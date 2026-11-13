import { rateLimit } from "express-rate-limit";
import { randomBytes } from "node:crypto";

export function accountRoutes(c) {
  const {
    app,
    authenticate,
    get,
    all,
    run,
    transaction,
    text,
    fail,
    now,
    production,
    passwordHash,
    passwordValid,
    records,
    put,
    audit,
    notify,
    creditEntry,
  } = c;
  const limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 12,
    keyGenerator: (req) => req.user.id,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });
  const memberships = (uid) =>
    all(
      "SELECT m.org_id,m.role,o.name FROM memberships m JOIN organizations o ON o.id=m.org_id WHERE m.user_id=?",
      uid,
    );
  const blockers = (uid) =>
    memberships(uid)
      .filter(
        (m) =>
          (m.role === "owner" &&
            get(
              "SELECT count(*) n FROM memberships WHERE org_id=? AND role='owner'",
              m.org_id,
            ).n <= 1) ||
          (get(
            "SELECT user_id FROM system_admins WHERE org_id=? AND user_id=?",
            m.org_id,
            uid,
          ) &&
            get("SELECT count(*) n FROM system_admins WHERE org_id=?", m.org_id)
              .n <= 1),
      )
      .map((m) => ({ id: m.org_id, name: m.name }));
  const verified = async (req) => {
    const row = get(
      "SELECT id,email,password FROM users WHERE id=?",
      req.user.id,
    );
    if (
      !row ||
      !(await passwordValid(
        text(req.body.currentPassword, "current password", 128),
        row.password,
      ))
    )
      fail(
        "Current password is incorrect. / كلمة المرور الحالية غير صحيحة.",
        403,
      );
    return row;
  };
  const assertUnchanged = (row) => {
    const current = get("SELECT email,password FROM users WHERE id=?", row.id);
    if (
      !current ||
      current.password !== row.password ||
      current.email !== row.email ||
      get("SELECT user_id FROM deleted_accounts WHERE user_id=?", row.id)
    )
      fail(
        "Account changed. Sign in again. / تغير الحساب، يرجى تسجيل الدخول مجدداً.",
        409,
      );
  };
  const revoke = (uid) => {
    run("DELETE FROM sessions WHERE user_id=?", uid);
    run("DELETE FROM password_resets WHERE user_id=?", uid);
  };
  const clearCookie = (res) =>
    res.clearCookie("rp_session", {
      httpOnly: true,
      sameSite: "strict",
      secure: production,
      path: "/",
    });
  const log = (req, action, orgs = memberships(req.user.id)) => {
    for (const m of orgs)
      audit({ ...req, org: { id: m.org_id } }, action, req.user.id);
  };
  app.put("/api/auth/account/email", authenticate, limit, async (req, res) => {
    const email = text(req.body.email, "email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Invalid email");
    const row = await verified(req);
    transaction(() => {
      assertUnchanged(row);
      if (get("SELECT id FROM users WHERE email=? AND id<>?", email, row.id))
        fail("Email already registered", 409);
      run("UPDATE users SET email=? WHERE id=?", email, row.id);
      log(req, "account.email.changed");
      revoke(row.id);
    });
    clearCookie(res);
    res.json({ ok: true, reauthenticate: true });
  });
  app.put(
    "/api/auth/account/password",
    authenticate,
    limit,
    async (req, res) => {
      const password = text(req.body.newPassword, "new password", 128);
      if (password.length < 6) fail("Password must have at least 6 characters");
      const row = await verified(req),
        encrypted = await passwordHash(password);
      transaction(() => {
        assertUnchanged(row);
        run("UPDATE users SET password=? WHERE id=?", encrypted, row.id);
        log(req, "account.password.changed");
        revoke(row.id);
      });
      clearCookie(res);
      res.json({ ok: true, reauthenticate: true });
    },
  );
  app.get("/api/auth/account/deletion", authenticate, (req, res) => {
    const uid = req.user.id;
    res.json({
      blockers: blockers(uid),
      creditBalance: get(
        "SELECT coalesce(sum(delta),0) n FROM credit_ledger WHERE member_id=?",
        uid,
      ).n,
      openInvoices: get(
        "SELECT count(*) n FROM proformas WHERE member_id=? AND status='open'",
        uid,
      ).n,
      activeBookings: all(
        "SELECT org_id,class_id FROM reservations WHERE member_id=? AND status IN ('confirmed','pending_payment')",
        uid,
      ).filter((b) =>
        records(b.org_id, "classes").some(
          (s) => s.id === b.class_id && s.endsAt > now(),
        ),
      ).length,
    });
  });
  app.delete("/api/auth/account", authenticate, limit, async (req, res) => {
    if (req.body.confirmation !== "DELETE")
      fail(
        "Type DELETE to confirm account deletion. / اكتب DELETE لتأكيد حذف الحساب.",
      );
    const row = await verified(req),
      disabledPassword = await passwordHash(randomBytes(32).toString("hex"));
    transaction(() => {
      assertUnchanged(row);
      if (blockers(row.id).length)
        fail(
          "Assign another academy administrator/staff owner in the web portal before deleting this account. / عيّن مسؤولاً وموظفاً مالكاً آخر للأكاديمية عبر بوابة الويب قبل حذف الحساب.",
          409,
        );
      const orgs = memberships(row.id);
      for (const booking of all(
        "SELECT * FROM reservations WHERE member_id=? AND status IN ('confirmed','pending_payment')",
        row.id,
      )) {
        const session = records(booking.org_id, "classes").find(
          (s) => s.id === booking.class_id,
        );
        if (!session || session.endsAt <= now()) continue;
        const invoice = get(
          "SELECT id,paid,credit_used FROM proformas WHERE reservation_id=? AND org_id=?",
          booking.id,
          booking.org_id,
        );
        run(
          "UPDATE reservations SET status='cancelled',hold_expires_at=NULL WHERE id=?",
          booking.id,
        );
        if (invoice) {
          if (invoice.credit_used > 0)
            creditEntry(
              booking.org_id,
              row.id,
              invoice.credit_used,
              "booking.cancelled",
              booking.id,
              invoice.id,
            );
          run(
            "UPDATE proformas SET status=? WHERE id=?",
            invoice.paid > 0 ? "refund_required" : "void",
            invoice.id,
          );
        }
      }
      run(
        "UPDATE proformas SET status=CASE WHEN paid>0 THEN 'refund_required' ELSE 'void' END WHERE member_id=? AND status='open'",
        row.id,
      );
      for (const profile of all(
        "SELECT id,org_id,data FROM records WHERE kind='instructors'",
      )) {
        const data = JSON.parse(profile.data);
        if (
          data.userId !== row.id &&
          (data.userId || (data.email || "").toLowerCase() !== row.email)
        )
          continue;
        put(profile.org_id, "instructors", profile.id, {
          ...data,
          name: "Former instructor",
          nameEn: "Former instructor",
          nameAr: "مدرب سابق",
          email: "",
          phone: "",
          userId: "",
          notes: "",
          active: false,
        });
        run(
          "DELETE FROM records WHERE kind='profilePhotos' AND id=?",
          "photo:" + profile.org_id + ":instructors:" + profile.id,
        );
      }
      run(
        "DELETE FROM records WHERE kind='profilePhotos' AND id=('photo:' || org_id || ':members:' || ?)",
        row.id,
      );
      run("DELETE FROM profile_names WHERE user_id=?", row.id);
      run("DELETE FROM notifications WHERE user_id=?", row.id);
      run("DELETE FROM email_outbox WHERE user_id=?", row.id);
      run("DELETE FROM staff_roles WHERE user_id=?", row.id);
      run("DELETE FROM staff_permissions WHERE user_id=?", row.id);
      run("DELETE FROM system_admins WHERE user_id=?", row.id);
      run("DELETE FROM waitlist WHERE member_id=?", row.id);
      run("DELETE FROM memberships WHERE user_id=?", row.id);
      run(
        "UPDATE users SET email=?,name='Deleted account',password=? WHERE id=?",
        randomBytes(20).toString("hex") + "@deleted.invalid",
        disabledPassword,
        row.id,
      );
      run(
        "INSERT INTO deleted_accounts(user_id,deleted_at) VALUES(?,?)",
        row.id,
        now(),
      );
      log(req, "account.deleted", orgs);
      revoke(row.id);
      for (const m of orgs)
        for (const admin of all(
          "SELECT user_id FROM system_admins WHERE org_id=?",
          m.org_id,
        ))
          notify(
            m.org_id,
            admin.user_id,
            "Account deleted / تم حذف حساب",
            "An account was deleted. Review its retained bookings, balances and any payment reconciliation. Account ID: " +
              row.id +
              " / راجع السجلات والأرصدة وتسوية المدفوعات المرتبطة بالحساب المحذوف.",
          );
    });
    clearCookie(res);
    res.json({ ok: true, deleted: true });
  });
}
