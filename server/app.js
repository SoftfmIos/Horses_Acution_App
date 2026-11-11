import {
  feedingConflict,
  feedingSchedule,
  medicationSchedule,
} from "./care.js";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import {
  randomBytes,
  randomUUID,
  createHash,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCb);
const hash = (v) => createHash("sha256").update(v).digest("hex");
const id = () => randomUUID();
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (message, status = 400) => {
  throw new ApiError(status, message);
};
const text = (v, label, max = 200) => {
  if (typeof v !== "string" || !v.trim() || v.trim().length > max)
    fail(`Invalid ${label}`);
  return v.trim();
};
const integer = (v, label, min = 0, max = 100000000) => {
  if (!Number.isSafeInteger(v) || v < min || v > max) fail(`Invalid ${label}`);
  return v;
};
const iso = (v) => {
  if (typeof v !== "string" || !Number.isFinite(Date.parse(v)))
    fail("Invalid date");
  return new Date(v).toISOString();
};
const overlap = (a, b) => a.startsAt < b.endsAt && b.startsAt < a.endsAt;
export async function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 3,
    maxmem: 64 * 1024 * 1024,
  });
  return ["scrypt", 32768, 8, 3, salt, key.toString("hex")].join(":");
}
async function passwordValid(password, stored) {
  const parts = stored.split(":");
  const modern = parts[0] === "scrypt";
  const salt = modern ? parts[4] : parts[0],
    key = modern ? parts[5] : parts[1];
  const opts = modern ? { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 } : {};
  const derived = await scrypt(password, salt, 64, opts);
  return timingSafeEqual(Buffer.from(key, "hex"), derived);
}

const dummyPassword = await passwordHash("dummy password for constant work");
export function createApp(
  db,
  {
    production = false,
    clock = () => new Date(),
    emailEnabled = false,
    publicOrigin,
  } = {},
) {
  const app = express();
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          upgradeInsecureRequests: production ? [] : null,
        },
      },
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  const now = () => clock().toISOString();
  const get = (sql, ...args) => db.prepare(sql).get(...args);
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);
  const transaction = (fn) => {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      db.exec("COMMIT");
      return result;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  };
  const creditBalance = (org, member) =>
    get(
      "SELECT coalesce(sum(delta),0) AS balance FROM credit_ledger WHERE org_id=? AND member_id=?",
      org,
      member,
    ).balance;
  const creditEntry = (
    org,
    member,
    delta,
    reason,
    reservation = null,
    proforma = null,
  ) =>
    run(
      "INSERT INTO credit_ledger VALUES(?,?,?,?,?,?,?,?)",
      id(),
      org,
      member,
      delta,
      reason,
      reservation,
      proforma,
      now(),
    );
  function awardCredits(pid) {
    const p = get("SELECT * FROM proformas WHERE id=?", pid);
    if (p.credit_quantity > 0 && !p.credit_awarded && p.status === "settled") {
      creditEntry(
        p.org_id,
        p.member_id,
        p.credit_quantity,
        "package.paid",
        null,
        p.id,
      );
      run("UPDATE proformas SET credit_awarded=1 WHERE id=?", p.id);
      notify(
        p.org_id,
        p.member_id,
        "Lesson credits added / تمت إضافة رصيد الحصص",
        String(p.credit_quantity) + " sessions / حصص",
      );
    }
  }
  const records = (org, kind) =>
    all("SELECT id,data FROM records WHERE org_id=? AND kind=?", org, kind).map(
      (r) => ({ id: r.id, ...JSON.parse(r.data) }),
    );
  const record = (org, kind, rid) => {
    const r = get(
      "SELECT id,data FROM records WHERE org_id=? AND kind=? AND id=?",
      org,
      kind,
      rid,
    );
    if (!r) fail("Record not found", 404);
    return { id: r.id, ...JSON.parse(r.data) };
  };
  const put = (org, kind, rid, data) =>
    run(
      "INSERT INTO records(id,org_id,kind,data) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data WHERE org_id=excluded.org_id AND kind=excluded.kind",
      rid,
      org,
      kind,
      JSON.stringify(data),
    );
  const profileName = (uid, fallback) => {
    const p = get(
      "SELECT name_en,name_ar FROM profile_names WHERE user_id=?",
      uid,
    );
    return { nameEn: p?.name_en ?? fallback, nameAr: p?.name_ar || "" };
  };
  const saveProfileName = (uid, b, fallback) => {
    const en = typeof b.nameEn === "string" ? b.nameEn.trim() : fallback;
    const ar = typeof b.nameAr === "string" ? b.nameAr.trim() : "";
    if (en.length > 100 || ar.length > 100)
      fail("Names must be at most 100 characters");
    run(
      "INSERT INTO profile_names VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET name_en=excluded.name_en,name_ar=excluded.name_ar",
      uid,
      en,
      ar,
    );
  };
  const feedingBlocked = (org, horse, start, end) =>
    records(org, "feeding").some(
      (p) => p.horseId === horse && feedingConflict(p, start, end),
    );
  function syncCareTasks(org, kind, plan, reschedule = false) {
    const dueDates =
      kind === "medical"
        ? medicationSchedule(plan)
        : feedingSchedule(plan, clock());
    const marker = kind === "medical" ? "medicalId" : "feedingPlanId";
    const prefix = kind === "medical" ? "medication" : "feeding";
    const desired = new Set(
      dueDates.map(
        (date) =>
          prefix +
          ":" +
          plan.id +
          ":" +
          (kind === "feeding" ? date.slice(0, 10) : date),
      ),
    );
    for (const old of records(org, "tasks").filter(
      (t) => t[marker] === plan.id && !t.done,
    ))
      if (!desired.has(old.id) && (reschedule || old.dueAt >= now()))
        put(org, "tasks", old.id, { ...old, cancelled: true });
    const horse = record(org, "horses", plan.horseId);
    for (const dueAt of dueDates) {
      const tid =
        prefix +
        ":" +
        plan.id +
        ":" +
        (kind === "feeding" ? dueAt.slice(0, 10) : dueAt);
      const existing = get(
        "SELECT data FROM records WHERE id=? AND org_id=?",
        tid,
        org,
      );
      if (existing && JSON.parse(existing.data).done) continue;
      const detail =
        kind === "medical"
          ? plan.medication + " · " + plan.dose
          : plan.feed + " · " + plan.quantity;
      put(org, "tasks", tid, {
        title: horse.name + " · " + detail,
        titleEn: (horse.nameEn || horse.name) + " · " + detail,
        titleAr: (horse.nameAr || horse.name) + " · " + detail,
        dueAt,
        assigneeId: plan.assigneeId,
        done: false,
        cancelled: false,
        notes: plan.notes,
        [marker]: plan.id,
        horseId: horse.id,
        medication: kind === "medical" ? plan.medication : "",
        dose: kind === "medical" ? plan.dose : "",
        completedAt: "",
        completedBy: "",
      });
    }
  }
  const audit = (req, action, rid) =>
    run(
      "INSERT INTO audit(org_id,actor_id,action,record_id,created_at) VALUES(?,?,?,?,?)",
      req.org.id,
      req.user.id,
      action,
      rid,
      now(),
    );
  const notify = (org, user, title, message, dedupe = null) => {
    const rid = id();
    const result = run(
      "INSERT OR IGNORE INTO notifications(id,org_id,user_id,title,message,dedupe,created_at) VALUES(?,?,?,?,?,?,?)",
      rid,
      org,
      user,
      title,
      message,
      dedupe,
      now(),
    );
    if (emailEnabled && result.changes)
      run(
        "INSERT INTO email_outbox(id,user_id,subject,body) VALUES(?,?,?,?)",
        rid,
        user,
        title,
        message,
      );
  };
  const owners = (org) =>
    all(
      "SELECT user_id FROM memberships WHERE org_id=? AND role='owner'",
      org,
    ).map((x) => x.user_id);
  const cookie = (res, token) =>
    res.cookie("rp_session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: production,
      maxAge: 7 * 86400000,
      path: "/",
    });
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const origin = req.get("origin");
      if (
        !origin ||
        origin !== (publicOrigin || `${req.protocol}://${req.get("host")}`)
      )
        return res.status(403).json({ error: "Request origin rejected" });
      if (req.get("x-requested-with") !== "RiyadhAcademy")
        return res.status(403).json({ error: "Request token required" });
    }
    next();
  });
  app.get("/api/health", (req, res) =>
    res.json({ status: "ok", database: get("SELECT 1 AS ok").ok === 1 }),
  );
  const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) =>
      hash(
        typeof req.body?.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "invalid-email",
      ),
    handler: (req, res) =>
      res.status(429).json({ error: "Too many attempts; try again later" }),
  });
  const authBurst = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    keyGenerator: () => "authentication-service",
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) =>
      res
        .status(429)
        .json({ error: "Authentication is busy; try again later" }),
  });
  app.use("/api/auth", (req, res, next) =>
    req.method === "POST" && ["/login", "/register"].includes(req.path)
      ? authBurst(req, res, () => authLimit(req, res, next))
      : next(),
  );
  function authenticate(req, res, next) {
    const raw = req.headers.cookie
      ?.split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("rp_session="))
      ?.slice(11);
    const user =
      raw &&
      get(
        "SELECT u.id,u.email,u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>?",
        hash(raw),
        now(),
      );
    if (!user) return res.status(401).json({ error: "Please sign in" });
    req.user = { ...user, ...profileName(user.id, user.name) };
    next();
  }
  function scoped(req, res, next) {
    const orgId = req.get("x-stable-id");
    const org = get(
      "SELECT o.id,o.name,m.role FROM memberships m JOIN organizations o ON o.id=m.org_id WHERE m.user_id=? AND m.org_id=?",
      req.user.id,
      orgId || "",
    );
    if (!org) return res.status(403).json({ error: "Stable access denied" });
    const staff = get(
      "SELECT role FROM staff_roles WHERE org_id=? AND user_id=?",
      org.id,
      req.user.id,
    );
    if (org.role !== "owner" && staff) org.role = staff.role;
    req.org = org;
    next();
  }
  function owner(req, res, next) {
    const modules = {
      instructor: ["classes", "attendance"],
      vet: ["medical", "horses"],
      caregiver: ["feeding", "tasks"],
    };
    const module = req.path.startsWith("/api/records/")
      ? req.params.kind
      : req.path.startsWith("/api/attendance/")
        ? "attendance"
        : null;
    if (req.org.role !== "owner" && !modules[req.org.role]?.includes(module))
      return res.status(403).json({ error: "Manager permission required" });
    next();
  }
  app.post("/api/auth/register", async (req, res) => {
    const name = text(
        req.body.nameEn || req.body.nameAr || req.body.name,
        "name",
        100,
      ),
      email = text(req.body.email, "email", 254).toLowerCase(),
      password = text(req.body.password, "password", 128);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Invalid email");
    if (password.length < 6) fail("Password must have at least 6 characters");
    const invite = req.body.invite?.trim();
    const stableName = invite
      ? null
      : text(
          req.body.stableNameEn || req.body.stableNameAr || req.body.stableName,
          "stable name",
          100,
        );
    const encrypted = await passwordHash(password);
    const uid = id();
    try {
      transaction(() => {
        let org;
        if (invite) {
          org = get(
            "SELECT * FROM invites WHERE token=? AND used=0 AND expires_at>?",
            hash(invite),
            now(),
          );
          if (!org) fail("Invitation invalid or expired");
        }
        run(
          "INSERT INTO users VALUES(?,?,?,?,?)",
          uid,
          email,
          name,
          encrypted,
          now(),
        );
        saveProfileName(uid, req.body, name);
        const oid = org?.org_id || id();
        if (!invite) {
          run("INSERT INTO organizations VALUES(?,?)", oid, stableName);
          put(oid, "academySettings", oid + ":settings", {
            academyName: stableName,
            academyNameEn: req.body.stableNameEn ?? stableName,
            academyNameAr:
              typeof req.body.stableNameAr === "string"
                ? req.body.stableNameAr.trim().slice(0, 100)
                : "",
          });
        }
        run(
          "INSERT INTO memberships VALUES(?,?,?)",
          uid,
          oid,
          invite ? "member" : "owner",
        );
        if (invite)
          run("UPDATE invites SET used=1 WHERE token=?", hash(invite));
        notify(
          oid,
          uid,
          "Welcome / مرحباً",
          "Your academy workspace is ready. مساحة الأكاديمية جاهزة.",
        );
      });
    } catch (e) {
      if (e.errcode === 2067 || e.code?.includes("CONSTRAINT"))
        fail("Unable to register with these details", 409);
      throw e;
    }
    const token = randomBytes(32).toString("hex");
    run(
      "INSERT INTO sessions VALUES(?,?,?)",
      hash(token),
      uid,
      new Date(clock().getTime() + 7 * 86400000).toISOString(),
    );
    cookie(res, token);
    res.status(201).json({ ok: true });
  });
  app.post("/api/auth/login", async (req, res) => {
    const email = text(req.body.email, "email", 254).toLowerCase(),
      password = text(req.body.password, "password", 128);
    const user = get("SELECT * FROM users WHERE email=?", email);
    const valid = await passwordValid(
      password,
      user?.password || dummyPassword,
    );
    if (!user || !valid) fail("Email or password is incorrect", 401);
    const token = randomBytes(32).toString("hex");
    run(
      "INSERT INTO sessions VALUES(?,?,?)",
      hash(token),
      user.id,
      new Date(clock().getTime() + 7 * 86400000).toISOString(),
    );
    cookie(res, token);
    res.json({ ok: true });
  });
  app.get("/api/auth/me", authenticate, (req, res) =>
    res.json({
      user: req.user,
      stables: all(
        "SELECT o.id,o.name,CASE WHEN m.role='owner' THEN m.role ELSE coalesce(s.role,m.role) END AS role FROM organizations o JOIN memberships m ON m.org_id=o.id LEFT JOIN staff_roles s ON s.org_id=o.id AND s.user_id=m.user_id WHERE m.user_id=?",
        req.user.id,
      ).map((o) => {
        const settings = records(o.id, "academySettings")[0];
        return {
          ...o,
          nameEn: settings?.academyNameEn ?? o.name,
          nameAr: settings?.academyNameAr || "",
        };
      }),
    }),
  );
  app.post("/api/auth/logout", authenticate, (req, res) => {
    const raw = req.headers.cookie
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("rp_session="))
      .slice(11);
    run("DELETE FROM sessions WHERE token=?", hash(raw));
    res.clearCookie("rp_session", {
      httpOnly: true,
      sameSite: "strict",
      secure: production,
      path: "/",
    });
    res.json({ ok: true });
  });
  // Key protected traffic by verified account, not the shared Vercel egress IP.
  app.use(
    "/api",
    authenticate,
    scoped,
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      keyGenerator: (req) => req.user.id,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      handler: (req, res) =>
        res.status(429).json({ error: "Too many requests" }),
    }),
  );
  app.post("/api/invites", owner, (req, res) => {
    const code = randomBytes(18).toString("base64url");
    run(
      "INSERT INTO invites(token,org_id,expires_at) VALUES(?,?,?)",
      hash(code),
      req.org.id,
      new Date(clock().getTime() + 7 * 86400000).toISOString(),
    );
    audit(req, "invite.create", "");
    res.status(201).json({ code, expiresInDays: 7 });
  });
  function validate(req, kind, b, rid) {
    const names = [
        "horses",
        "plans",
        "inventory",
        "instructors",
        "arenas",
        "breeds",
      ].includes(kind),
      titles = ["classes", "tasks"].includes(kind);
    const body = { ...b };
    if (names) body.name = b.name || b.nameEn || b.nameAr;
    if (titles) body.title = b.title || b.titleEn || b.titleAr;
    let instructor, arena;
    if (kind === "classes") {
      instructor = records(req.org.id, "instructors").find((r) =>
        [r.name, r.nameEn, r.nameAr].filter(Boolean).includes(b.instructor),
      );
      arena = records(req.org.id, "arenas").find((r) =>
        [r.name, r.nameEn, r.nameAr].filter(Boolean).includes(b.arena),
      );
      if (instructor) body.instructor = instructor.name;
      if (arena) body.arena = arena.name;
    }
    const breed =
      kind === "horses"
        ? records(req.org.id, "breeds").find((r) =>
            [r.name, r.nameEn, r.nameAr].filter(Boolean).includes(b.breed),
          )
        : null;
    if (breed) body.breed = breed.name;
    const result = validateBase(req, kind, body, rid);
    if (kind === "horses")
      Object.assign(result, {
        breedEn: breed?.nameEn || breed?.name || b.breedEn || result.breed,
        breedAr: breed?.nameAr || b.breedAr || "",
      });
    for (const key of names ? ["name"] : titles ? ["title"] : []) {
      for (const suffix of ["En", "Ar"]) {
        const value =
          typeof b[key + suffix] === "string"
            ? b[key + suffix].trim()
            : suffix === "En"
              ? result[key]
              : "";
        if (value.length > 100) fail("Names must be at most 100 characters");
        result[key + suffix] =
          suffix === "En" && b[key] && b[key] !== b[key + "En"]
            ? result[key]
            : value;
      }
    }
    if (kind === "classes")
      Object.assign(result, {
        instructorEn:
          instructor?.nameEn ||
          instructor?.name ||
          b.instructorEn ||
          result.instructor,
        instructorAr: instructor?.nameAr || b.instructorAr || "",
        arenaEn: arena?.nameEn || arena?.name || b.arenaEn || result.arena,
        arenaAr: arena?.nameAr || b.arenaAr || "",
      });
    return result;
  }
  function validateBase(req, kind, b, rid) {
    const org = req.org.id;
    const optional = (v) =>
      typeof v === "string" ? v.trim().slice(0, 2000) : "";
    if (["instructors", "arenas", "breeds"].includes(kind))
      return {
        name: text(b.name, "name", 100),
        notes: optional(b.notes),
        active: b.active !== false,
        ...(kind === "arenas" ? { address: optional(b.address) } : {}),
        ...(kind === "instructors"
          ? { email: optional(b.email), phone: optional(b.phone) }
          : {}),
      };
    if (kind === "horses") {
      const status = ["ready", "rest", "retired"].includes(b.status)
        ? b.status
        : "ready";
      return {
        name: text(b.name, "horse name", 100),
        breed: optional(b.breed),
        birthDate: b.birthDate ? iso(b.birthDate) : "",
        microchip: optional(b.microchip),
        status,
        notes: optional(b.notes),
      };
    }
    if (kind === "plans")
      return {
        name: text(b.name, "price name", 100),
        amount: integer(b.amount, "price", b.kind === "package" ? 1 : 0),
        credits:
          b.kind === "package"
            ? integer(b.credits, "lesson credits", 1, 1000)
            : 0,
        kind: [
          "class",
          "private",
          "ride",
          "boarding",
          "package",
          "other",
        ].includes(b.kind)
          ? b.kind
          : "class",
        active: b.active !== false,
      };
    if (kind === "discounts") {
      const mode = b.mode === "fixed" ? "fixed" : "percent";
      return {
        code: text(b.code, "code", 40).toUpperCase(),
        mode,
        value: integer(
          b.value,
          "discount",
          1,
          mode === "percent" ? 100 : 100000000,
        ),
        minAmount: integer(b.minAmount || 0, "minimum amount"),
        maxUses: integer(b.maxUses || 1, "usage limit", 1, 100000),
        uses: rid ? record(org, kind, rid).uses : 0,
        expiresAt: iso(b.expiresAt),
        active: b.active !== false,
      };
    }
    if (kind === "vouchers") {
      if (rid) fail("Issued vouchers cannot be edited");
      return {
        code: text(b.code, "voucher code", 40).toUpperCase(),
        balance: integer(b.balance, "voucher amount", 1),
        initialAmount: b.balance,
        expiresAt: iso(b.expiresAt),
      };
    }
    if (kind === "classes") {
      const startsAt = iso(b.startsAt),
        endsAt = iso(b.endsAt);
      if (startsAt >= endsAt || startsAt <= now())
        fail("Class must be scheduled in the future with a valid duration");
      if (Date.parse(endsAt) - Date.parse(startsAt) > 86400000)
        fail("A class cannot exceed 24 hours");
      const capacity = integer(b.capacity, "capacity", 1, 100);
      const horseIds = [
        ...new Set(Array.isArray(b.horseIds) ? b.horseIds : []),
      ];
      if (horseIds.length < capacity)
        fail("Assign at least one available horse per place");
      horseIds.forEach((h) => {
        if (record(org, "horses", h).status !== "ready")
          fail("Horse is not ready to ride");
      });
      if (
        horseIds.filter((h) => !feedingBlocked(org, h, startsAt, endsAt))
          .length < capacity
      )
        fail("Not enough horses available outside their feeding times", 409);
      const plan = record(org, "plans", b.planId);
      if (!plan.active) fail("Price is inactive");
      if (plan.credits > 0)
        fail("Use a per-session price for a class, not a package");
      const data = {
        title: text(b.title, "title", 100),
        startsAt,
        endsAt,
        capacity,
        horseIds,
        instructor: text(b.instructor, "instructor", 100),
        arena: text(b.arena, "arena", 100),
        planId: plan.id,
        creditCost: integer(b.creditCost || 1, "credit cost", 1, 100),
      };
      if (
        records(org, kind).some(
          (c) =>
            c.id !== rid &&
            overlap(c, data) &&
            (c.instructor.toLowerCase() === data.instructor.toLowerCase() ||
              c.arena.toLowerCase() === data.arena.toLowerCase() ||
              c.horseIds.some((h) => horseIds.includes(h))),
        )
      )
        fail("Horse, instructor or arena already scheduled", 409);
      if (rid) {
        const booked = all(
          "SELECT * FROM reservations WHERE class_id=? AND org_id=? AND status IN ('confirmed','pending_payment')",
          rid,
          org,
        );
        const previous = record(org, "classes", rid);
        if (booked.length) {
          if (
            capacity < booked.length ||
            booked.some((b) => !horseIds.includes(b.horse_id))
          )
            fail("Keep booked capacity and assigned horses", 409);
          if (
            previous.planId !== data.planId ||
            (previous.creditCost || 1) !== data.creditCost
          )
            fail("Pricing cannot change while bookings exist", 409);
          for (const booking of booked) {
            const other = all(
              "SELECT * FROM reservations WHERE org_id=? AND member_id=? AND class_id!=? AND status IN ('confirmed','pending_payment')",
              org,
              booking.member_id,
              rid,
            );
            if (
              other.some((b) =>
                overlap(record(org, "classes", b.class_id), data),
              )
            )
              fail("A member has an overlapping booking", 409);
          }
        }
        if (previous.seriesId) data.seriesId = previous.seriesId;
      }
      return data;
    }
    if (kind === "medical") {
      const horse = record(org, "horses", b.horseId);
      const frequencyHours = b.frequencyHours
        ? integer(b.frequencyHours, "dose interval hours", 1, 168)
        : 0;
      const durationDays = b.durationDays
        ? integer(b.durationDays, "treatment days", 1, 90)
        : 0;
      if (Boolean(frequencyHours) !== Boolean(durationDays))
        fail("Set both dose interval and treatment duration");
      if (
        frequencyHours &&
        Math.ceil((durationDays * 24) / frequencyHours) > 1000
      )
        fail("Treatment schedule exceeds 1000 doses");
      const assigneeId = b.assigneeId || req.user.id;
      if (
        !get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
          org,
          assigneeId,
        )
      )
        fail("Assignee must belong to academy");
      if (frequencyHours && (!b.medication?.trim() || !b.dose?.trim()))
        fail("Medication and prescribed dose required for scheduled treatment");
      return {
        frequencyHours,
        durationDays,
        assigneeId,
        horseId: horse.id,
        type: text(b.type, "care type", 100),
        date: iso(b.date),
        dueAt: b.dueAt ? iso(b.dueAt) : "",
        vet: optional(b.vet),
        notes: text(b.notes, "care notes", 2000),
        restriction: b.restriction === true,
        completed: b.completed === true,
        medication: optional(b.medication),
        dose: optional(b.dose),
        frequency: optional(b.frequency),
        completedAt:
          b.completed === true
            ? (rid && record(org, kind, rid).completedAt) || now()
            : "",
        completedBy:
          b.completed === true
            ? (rid && record(org, kind, rid).completedBy) || req.user.id
            : "",
      };
    }
    if (kind === "feeding") {
      record(org, "horses", b.horseId);
      if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(b.time))
        fail("Invalid feeding time");
      if (
        !get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
          org,
          b.assigneeId,
        )
      )
        fail("Assignee must belong to stable");
      const durationMinutes = integer(
        b.durationMinutes || 30,
        "feeding duration",
        5,
        240,
      );
      const startDate = b.startDate ? iso(b.startDate).slice(0, 10) : "";
      const endDate = b.endDate ? iso(b.endDate).slice(0, 10) : "";
      if (startDate && endDate && startDate > endDate)
        fail("Feeding end date precedes start date");
      const candidate = {
        time: b.time,
        durationMinutes,
        startDate,
        endDate,
        active: b.active !== false,
      };
      for (const booking of all(
        "SELECT * FROM reservations WHERE org_id=? AND horse_id=? AND status IN ('confirmed','pending_payment')",
        org,
        b.horseId,
      )) {
        const session = record(org, "classes", booking.class_id);
        if (
          session.endsAt > now() &&
          feedingConflict(candidate, session.startsAt, session.endsAt)
        )
          fail("Feeding time conflicts with an existing horse booking", 409);
      }
      return {
        ...candidate,
        horseId: b.horseId,
        feed: text(b.feed, "feed", 100),
        quantity: text(b.quantity, "quantity", 100),
        assigneeId: b.assigneeId,
        time: text(b.time, "feeding time", 5),
        notes: optional(b.notes),
      };
    }
    if (kind === "tasks") {
      if (
        b.assigneeId &&
        !get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
          org,
          b.assigneeId,
        )
      )
        fail("Assignee must belong to stable");
      const previous = rid ? record(org, "tasks", rid) : {};
      if (previous.medicalId || previous.feedingPlanId)
        fail(
          "Edit the care plan to change generated tasks; use the completion checkbox for each dose",
          409,
        );
      return {
        title: text(b.title, "task", 100),
        dueAt: iso(b.dueAt),
        assigneeId: b.assigneeId || req.user.id,
        done: rid ? previous.done === true : b.done === true,
        completedBy: previous.completedBy || "",
        completedAt: previous.completedAt || "",
        notes: optional(b.notes),
      };
    }
    if (kind === "inventory")
      return {
        name: text(b.name, "item name", 100),
        unit: text(b.unit, "unit", 30),
        quantity: integer(b.quantity, "stock"),
        reorderAt: integer(b.reorderAt || 0, "reorder point"),
        expiresAt: b.expiresAt ? iso(b.expiresAt) : "",
      };
    fail("Unknown module", 404);
  }
  const kinds = [
    "instructors",
    "arenas",
    "breeds",
    "horses",
    "plans",
    "discounts",
    "vouchers",
    "classes",
    "medical",
    "feeding",
    "tasks",
    "inventory",
  ];
  function safeClass(req, c) {
    const total = get(
      "SELECT count(*) AS n FROM reservations WHERE org_id=? AND class_id=? AND status IN ('confirmed','pending_payment')",
      req.org.id,
      c.id,
    ).n;
    const usable = c.horseIds.filter(
      (h) =>
        record(req.org.id, "horses", h).status === "ready" &&
        !feedingBlocked(req.org.id, h, c.startsAt, c.endsAt),
    ).length;
    return {
      ...c,
      places: Math.max(0, Math.min(c.capacity - total, usable - total)),
    };
  }
  app.get("/api/data", (req, res) => {
    const org = req.org.id,
      manager = req.org.role === "owner";
    const members = all(
      "SELECT u.id,u.name,CASE WHEN m.role='owner' THEN m.role ELSE coalesce(s.role,m.role) END AS role FROM users u JOIN memberships m ON m.user_id=u.id LEFT JOIN staff_roles s ON s.org_id=m.org_id AND s.user_id=u.id WHERE m.org_id=?",
      org,
    ).map((m) => ({ ...m, ...profileName(m.id, m.name) }));
    const result = {};
    for (const k of kinds) {
      result[k] =
        !manager &&
        ["discounts", "vouchers", "inventory", "medical", "feeding"].includes(k)
          ? []
          : records(org, k);
    }
    const savedSettings = records(org, "academySettings")[0] || {};
    result.settings = {
      academyName: req.org.name,
      contactEmail: "",
      phone: "",
      address: "",
      calendarView: "month",
      lessonDuration: 60,
      defaultCapacity: 1,
      defaultCreditCost: 1,
      ...savedSettings,
      currency: "SAR",
      timeZone: "Asia/Riyadh",
    };
    result.classes = result.classes.map((c) => safeClass(req, c));
    result.tasks = manager
      ? result.tasks
      : result.tasks.filter((t) => t.assigneeId === req.user.id);
    result.bookings = all(
      "SELECT * FROM reservations WHERE org_id=?" +
        (manager ? "" : " AND member_id=?"),
      ...(manager ? [org] : [org, req.user.id]),
    );
    result.proformas = all(
      "SELECT * FROM proformas WHERE org_id=?" +
        (manager ? "" : " AND member_id=?") +
        " ORDER BY created_at DESC",
      ...(manager ? [org] : [org, req.user.id]),
    );
    result.members = manager
      ? members
      : members.filter((m) => m.id === req.user.id);
    result.creditBalance = creditBalance(org, req.user.id);
    result.creditLedger = all(
      "SELECT id,delta,reason,created_at,reservation_id,proforma_id FROM credit_ledger WHERE org_id=? AND member_id=? ORDER BY rowid DESC",
      org,
      req.user.id,
    );
    result.members = result.members.map((m) => ({
      ...m,
      creditBalance: creditBalance(org, m.id),
    }));
    result.notifications = all(
      "SELECT * FROM notifications WHERE org_id=? AND user_id=? ORDER BY created_at DESC LIMIT 100",
      org,
      req.user.id,
    );
    result.proformas = result.proformas.map((p) => ({
      ...p,
      ...(() => {
        const booking = p.reservation_id
          ? get(
              "SELECT class_id FROM reservations WHERE id=? AND org_id=?",
              p.reservation_id,
              org,
            )
          : null;
        const source = booking
          ? records(org, "classes").find((c) => c.id === booking.class_id)
          : records(org, "plans").find((plan) => plan.name === p.description);
        return {
          descriptionEn: source?.titleEn || source?.nameEn || p.description,
          descriptionAr: source?.titleAr || source?.nameAr || "",
        };
      })(),
      activation:
        p.status === "settled"
          ? "active"
          : p.status === "void"
            ? "cancelled"
            : "pending_payment",
    }));
    result.payments = all(
      "SELECT * FROM payments WHERE org_id=?" +
        (manager
          ? ""
          : " AND proforma_id IN (SELECT id FROM proformas WHERE member_id=?)"),
      ...(manager ? [org] : [org, req.user.id]),
    );
    result.waitlist = all(
      "SELECT * FROM waitlist WHERE org_id=?" +
        (manager ? "" : " AND member_id=?") +
        " ORDER BY created_at",
      ...(manager ? [org] : [org, req.user.id]),
    );
    result.attendance = all(
      "SELECT * FROM attendance WHERE org_id=?" +
        (manager
          ? ""
          : " AND reservation_id IN (SELECT id FROM reservations WHERE member_id=?)"),
      ...(manager ? [org] : [org, req.user.id]),
    );
    const staffModules = {
      instructor: [
        "classes",
        "plans",
        "horses",
        "instructors",
        "arenas",
        "tasks",
      ],
      vet: ["horses", "medical", "tasks"],
      caregiver: ["horses", "feeding", "tasks"],
    }[req.org.role];
    if (staffModules) {
      for (const k of kinds) if (!staffModules.includes(k)) result[k] = [];
      // Staff see operational records only, never other members' financial accounts.
      for (const k of staffModules)
        result[k] =
          k === "classes"
            ? records(org, k).map((c) => safeClass(req, c))
            : records(org, k);
      if (req.org.role === "instructor")
        result.tasks = result.tasks.filter((t) => t.assigneeId === req.user.id);
      if (req.org.role === "vet")
        result.tasks = result.tasks.filter(
          (t) => t.medicalId || t.assigneeId === req.user.id,
        );
      result.members = members.map(({ id, name, role, nameEn, nameAr }) => ({
        nameEn,
        nameAr,
        id,
        name,
        role,
      }));
      if (req.org.role === "instructor") {
        result.bookings = all("SELECT * FROM reservations WHERE org_id=?", org);
        result.attendance = all("SELECT * FROM attendance WHERE org_id=?", org);
        result.waitlist = all(
          "SELECT * FROM waitlist WHERE org_id=? ORDER BY created_at",
          org,
        );
      }
    }
    result.tasks = result.tasks
      .filter((t) => !t.cancelled)
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    result.taskHistory = all(
      "SELECT e.*,u.name AS actor_name FROM task_events e JOIN users u ON u.id=e.actor_id WHERE e.org_id=?" +
        (manager || ["vet", "caregiver"].includes(req.org.role)
          ? ""
          : " AND e.task_id IN (SELECT id FROM records WHERE org_id=? AND kind='tasks' AND json_extract(data,'$.assigneeId')=?)") +
        " ORDER BY e.created_at DESC",
      ...(manager || ["vet", "caregiver"].includes(req.org.role)
        ? [org]
        : [org, org, req.user.id]),
    );
    result.emailConfigured = emailEnabled;
    res.json(result);
  });
  function restrictHorse(req, data, rid) {
    if (!data.restriction || data.completed) return;
    const org = req.org.id,
      h = record(org, "horses", data.horseId);
    put(org, "horses", h.id, { ...h, status: "rest" });
    for (const u of owners(org))
      notify(
        org,
        u,
        "Horse on medical rest / راحة طبية",
        h.name + ": " + data.notes,
        "rest:" + rid + ":" + u,
      );
    for (const b of all(
      "SELECT * FROM reservations WHERE org_id=? AND horse_id=? AND status IN ('confirmed','pending_payment')",
      org,
      h.id,
    )) {
      const c = record(org, "classes", b.class_id);
      if (c.startsAt > now())
        notify(
          org,
          b.member_id,
          "Riding assignment needs review / إسناد الركوب يحتاج مراجعة",
          h.name + " · " + c.title + " · medical rest / راحة طبية",
          "rest-booking:" + rid + ":" + b.id,
        );
    }
  }
  app.get("/api/records/:kind/:id", owner, (req, res) => {
    if (!kinds.includes(req.params.kind)) fail("Unknown module", 404);
    res.json(record(req.org.id, req.params.kind, req.params.id));
  });
  app.post("/api/records/:kind", owner, (req, res) => {
    const { kind } = req.params;
    if (!kinds.includes(kind)) fail("Unknown module", 404);
    const created = transaction(() => {
      const weeks =
        kind === "classes"
          ? integer(req.body.repeatWeeks || 1, "weeks", 1, 52)
          : 1;
      const seriesId = weeks > 1 ? id() : null;
      return Array.from({ length: weeks }, (_, week) => {
        const rid = id();
        const body = { ...req.body };
        if (kind === "classes")
          for (const key of ["startsAt", "endsAt"])
            body[key] = new Date(
              Date.parse(iso(body[key])) + week * 7 * 86400000,
            ).toISOString();
        const data = {
          ...validate(req, kind, body),
          ...(seriesId ? { seriesId } : {}),
        };
        if (
          ["discounts", "vouchers"].includes(kind) &&
          records(req.org.id, kind).some((r) => r.code === data.code)
        )
          fail("Code already exists", 409);
        put(req.org.id, kind, rid, data);
        if (kind === "medical") restrictHorse(req, data, rid);
        if (["medical", "feeding"].includes(kind))
          syncCareTasks(req.org.id, kind, { id: rid, ...data }, true);
        audit(req, kind + ".create", rid);
        return { id: rid, ...data };
      });
    });
    app.locals.remind();
    res.status(201).json({ ...created[0], created });
  });

  app.put("/api/records/:kind/:id", owner, (req, res) => {
    const { kind, id: rid } = req.params;
    if (!kinds.includes(kind)) fail("Unknown module", 404);
    record(req.org.id, kind, rid);
    const data = validate(req, kind, req.body, rid);
    transaction(() => {
      if (
        ["discounts", "vouchers"].includes(kind) &&
        records(req.org.id, kind).some(
          (r) => r.id !== rid && r.code === data.code,
        )
      )
        fail("Code already exists", 409);
      if (
        kind === "horses" &&
        data.status === "ready" &&
        records(req.org.id, "medical").some(
          (m) => m.horseId === rid && m.restriction && !m.completed,
        )
      )
        fail("Complete medical restrictions before returning horse to riding");
      put(req.org.id, kind, rid, data);
      if (kind === "medical") restrictHorse(req, data, rid);
      if (["medical", "feeding"].includes(kind))
        syncCareTasks(req.org.id, kind, { id: rid, ...data }, true);
      if (kind === "classes")
        for (const b of all(
          "SELECT member_id FROM reservations WHERE org_id=? AND class_id=? AND status IN ('confirmed','pending_payment')",
          req.org.id,
          rid,
        ))
          notify(
            req.org.id,
            b.member_id,
            "Class updated / تم تحديث الحصة",
            data.title + " · " + data.startsAt,
          );
      audit(req, kind + ".update", rid);
    });
    app.locals.remind();
    res.json({ id: rid, ...data });
  });
  app.post("/api/tasks/:id/toggle", (req, res) => {
    transaction(() => {
      const task = record(req.org.id, "tasks", req.params.id);
      if (
        !["owner", "caregiver"].includes(req.org.role) &&
        task.assigneeId !== req.user.id
      )
        fail("Not assigned to you", 403);
      if (task.cancelled) fail("Task was cancelled", 409);
      const done = req.body.done === undefined ? !task.done : req.body.done;
      if (typeof done !== "boolean") fail("Invalid completion state");
      if (done === task.done) return;
      put(req.org.id, "tasks", task.id, {
        ...task,
        done,
        completedBy: done ? req.user.id : "",
        completedAt: done ? now() : "",
      });
      run(
        "INSERT INTO task_events VALUES(?,?,?,?,?,?)",
        id(),
        req.org.id,
        task.id,
        req.user.id,
        done ? "completed" : "reopened",
        now(),
      );
      audit(req, done ? "task.complete" : "task.reopen", task.id);
    });
    res.json({ ok: true });
  });

  function quote(req) {
    const org = req.org.id,
      c = record(org, "classes", req.body.classId),
      plan = record(org, "plans", c.planId);
    if (!plan.active) fail("Price inactive");
    if (req.body.useCredits === true) {
      if (req.body.discountCode || req.body.voucherCode)
        fail("Discounts and vouchers cannot be combined with lesson credits");
      const credits = c.creditCost || 1;
      if (creditBalance(org, req.user.id) < credits)
        fail("Not enough lesson credits", 409);
      return {
        class: c,
        description: c.title,
        gross: 0,
        discount: 0,
        voucher: 0,
        due: 0,
        credits,
      };
    }
    let discount = 0,
      discountRecord = null,
      voucherRecord = null;
    if (req.body.discountCode) {
      discountRecord = records(org, "discounts").find(
        (r) =>
          r.code ===
          text(req.body.discountCode, "discount code", 40).toUpperCase(),
      );
      if (
        !discountRecord ||
        !discountRecord.active ||
        discountRecord.expiresAt <= now() ||
        discountRecord.uses >= discountRecord.maxUses ||
        plan.amount < discountRecord.minAmount
      )
        fail("Discount invalid, expired or exhausted");
      discount = Math.min(
        plan.amount,
        discountRecord.mode === "percent"
          ? Math.floor((plan.amount * discountRecord.value) / 100)
          : discountRecord.value,
      );
    }
    if (req.body.voucherCode) {
      voucherRecord = records(org, "vouchers").find(
        (r) =>
          r.code ===
          text(req.body.voucherCode, "voucher code", 40).toUpperCase(),
      );
      if (
        !voucherRecord ||
        voucherRecord.expiresAt <= now() ||
        voucherRecord.balance <= 0
      )
        fail("Voucher invalid, expired or empty");
    }
    const voucher = Math.min(
      voucherRecord?.balance || 0,
      plan.amount - discount,
    );
    return {
      class: c,
      description: c.title,
      gross: plan.amount,
      discount,
      voucher,
      due: plan.amount - discount - voucher,
      discountRecord,
      voucherRecord,
    };
  }
  app.post("/api/quote", (req, res) => {
    const q = quote(req);
    res.json({
      gross: q.gross,
      discount: q.discount,
      voucher: q.voucher,
      due: q.due,
      currency: "SAR",
      credits: q.credits || 0,
    });
  });
  app.post("/api/bookings", (req, res) => {
    const org = req.org.id,
      uid = req.user.id;
    const result = transaction(() => {
      const q = quote(req),
        c = q.class;
      if (
        req.body.expectedDue !== undefined &&
        (req.body.expectedDue !== q.due ||
          req.body.expectedGross !== q.gross ||
          (req.body.expectedCredits || 0) !== (q.credits || 0))
      )
        fail("Price changed; calculate the total again", 409);
      if (c.startsAt <= now()) fail("Class has already started");
      const active = all(
        "SELECT * FROM reservations WHERE org_id=? AND status IN ('confirmed','pending_payment')",
        org,
      );
      if (active.some((b) => b.class_id === c.id && b.member_id === uid))
        fail("Already booked", 409);
      if (active.filter((b) => b.class_id === c.id).length >= c.capacity)
        fail("Class is full", 409);
      if (
        active.some(
          (b) =>
            b.member_id === uid &&
            overlap(record(org, "classes", b.class_id), c),
        )
      )
        fail("You have an overlapping booking", 409);
      const horseId = c.horseIds.find(
        (h) =>
          record(org, "horses", h).status === "ready" &&
          !feedingBlocked(org, h, c.startsAt, c.endsAt) &&
          !active.some(
            (b) =>
              b.horse_id === h &&
              overlap(record(org, "classes", b.class_id), c),
          ),
      );
      if (!horseId) fail("No medically available horse remains", 409);
      const bid = id(),
        pid = id();
      run(
        "INSERT INTO reservations VALUES(?,?,?,?,?,?,?)",
        bid,
        org,
        uid,
        c.id,
        horseId,
        q.due > 0 ? "pending_payment" : "confirmed",
        now(),
      );
      run(
        "INSERT INTO proformas(id,org_id,member_id,reservation_id,description,gross,discount,voucher,due,status,discount_id,voucher_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        pid,
        org,
        uid,
        bid,
        c.title,
        q.gross,
        q.discount,
        q.voucher,
        q.due,
        q.due === 0 ? "settled" : "open",
        q.discountRecord?.id || null,
        q.voucherRecord?.id || null,
        now(),
      );
      if (q.credits) {
        creditEntry(org, uid, -q.credits, "booking.used", bid, pid);
        run("UPDATE proformas SET credit_used=? WHERE id=?", q.credits, pid);
      }
      if (q.discountRecord)
        put(org, "discounts", q.discountRecord.id, {
          ...q.discountRecord,
          uses: q.discountRecord.uses + 1,
        });
      if (q.voucherRecord)
        put(org, "vouchers", q.voucherRecord.id, {
          ...q.voucherRecord,
          balance: q.voucherRecord.balance - q.voucher,
        });
      notify(
        org,
        uid,
        q.due > 0
          ? "Payment pending / بانتظار الدفع"
          : "Booking confirmed / تم تأكيد الحجز",
        `${c.title} · ${c.startsAt}`,
      );
      owners(org)
        .filter((u) => u !== uid)
        .forEach((u) =>
          notify(
            org,
            u,
            "New booking / حجز جديد",
            req.user.name + " · " + c.title,
          ),
        );
      run(
        "DELETE FROM waitlist WHERE org_id=? AND member_id=? AND class_id=?",
        org,
        uid,
        c.id,
      );
      audit(req, "booking.create", bid);
      return {
        id: bid,
        proformaId: pid,
        due: q.due,
        status: q.due > 0 ? "pending_payment" : "confirmed",
      };
    });
    res.status(201).json(result);
  });
  app.post("/api/bookings/:id/cancel", (req, res) => {
    transaction(() => {
      const b = get(
        "SELECT * FROM reservations WHERE id=? AND org_id=?",
        req.params.id,
        req.org.id,
      );
      if (!b || (b.member_id !== req.user.id && req.org.role !== "owner"))
        fail("Booking not found", 404);
      if (!["confirmed", "pending_payment"].includes(b.status))
        fail("Booking already cancelled", 409);
      if (record(req.org.id, "classes", b.class_id).startsAt <= now())
        fail("Past or started bookings cannot be cancelled");
      const p = get(
        "SELECT * FROM proformas WHERE reservation_id=? AND org_id=?",
        b.id,
        req.org.id,
      );
      if (p.paid > 0)
        fail(
          "Recorded payments must be reconciled externally before cancellation",
          409,
        );
      run("UPDATE reservations SET status='cancelled' WHERE id=?", b.id);
      run("UPDATE proformas SET status='void' WHERE id=?", p.id);
      if (p.credit_used > 0)
        creditEntry(
          req.org.id,
          b.member_id,
          p.credit_used,
          "booking.cancelled",
          b.id,
          p.id,
        );
      if (p.voucher_id) {
        const v = record(req.org.id, "vouchers", p.voucher_id);
        put(req.org.id, "vouchers", v.id, {
          ...v,
          balance: v.balance + p.voucher,
        });
      }
      if (p.discount_id) {
        const d = record(req.org.id, "discounts", p.discount_id);
        put(req.org.id, "discounts", d.id, {
          ...d,
          uses: Math.max(0, d.uses - 1),
        });
      }
      notify(
        req.org.id,
        b.member_id,
        "Booking cancelled / تم إلغاء الحجز",
        "Pro forma voided; applied voucher balance restored.",
      );
      for (const w of all(
        "SELECT * FROM waitlist WHERE org_id=? AND class_id=? ORDER BY created_at",
        req.org.id,
        b.class_id,
      ))
        notify(
          req.org.id,
          w.member_id,
          "Place available / مقعد متاح",
          record(req.org.id, "classes", b.class_id).title,
        );
      audit(req, "booking.cancel", b.id);
    });
    res.json({ ok: true });
  });
  function createPaymentRequest(req, memberId, planId, packageOnly = false) {
    const org = req.org.id,
      uid = text(memberId, "member");
    if (
      !get(
        "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
        org,
        uid,
      )
    )
      fail("Member not in stable");
    const plan = record(org, "plans", planId);
    if (!plan.active) fail("Price inactive");
    if (packageOnly && !(plan.kind === "package" && plan.credits > 0))
      fail("Select a lesson package");
    const pid = id();
    run(
      "INSERT INTO proformas(id,org_id,member_id,description,gross,discount,voucher,due,status,created_at,credit_quantity) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      pid,
      org,
      uid,
      plan.name,
      plan.amount,
      0,
      0,
      plan.amount,
      plan.amount === 0 ? "settled" : "open",
      now(),
      plan.credits || 0,
    );
    awardCredits(pid);
    notify(org, uid, "Payment request / طلب دفع", plan.name);
    audit(req, "proforma.create", pid);
    return pid;
  }
  app.post("/api/proformas", owner, (req, res) => {
    const pid = transaction(() =>
      createPaymentRequest(req, req.body.memberId, req.body.planId),
    );
    res.status(201).json({ id: pid });
  });
  app.post("/api/packages", (req, res) => {
    const pid = transaction(() =>
      createPaymentRequest(req, req.user.id, req.body.planId, true),
    );
    res.status(201).json({ id: pid });
  });
  app.post("/api/proformas/:id/refund", owner, (req, res) => {
    transaction(() => {
      const p = get(
        "SELECT * FROM proformas WHERE id=? AND org_id=?",
        req.params.id,
        req.org.id,
      );
      if (!p) fail("Payment request not found", 404);
      if (p.credit_awarded) {
        if (req.body.amount !== p.paid)
          fail("Paid lesson packages require a full external refund");
        if (creditBalance(req.org.id, p.member_id) < p.credit_quantity)
          fail(
            "Package credits have been used; reconcile bookings before refund",
            409,
          );
        creditEntry(
          req.org.id,
          p.member_id,
          -p.credit_quantity,
          "package.refunded",
          null,
          p.id,
        );
        run("UPDATE proformas SET credit_awarded=0 WHERE id=?", p.id);
      }
      const amount = integer(req.body.amount, "refund", 1);
      if (amount > p.paid) fail("Refund exceeds recorded payments");
      const reference = text(
        req.body.reference,
        "external refund reference",
        200,
      );
      if (
        get(
          "SELECT id FROM payments WHERE org_id=? AND reference=?",
          req.org.id,
          reference,
        )
      )
        fail("Payment reference already recorded", 409);
      const external = text(
        req.body.externalRef,
        "external credit note reference",
        200,
      );
      run(
        "INSERT INTO payments(id,org_id,proforma_id,amount,reference,created_at,external_ref) VALUES(?,?,?,?,?,?,?)",
        id(),
        req.org.id,
        p.id,
        -amount,
        reference,
        now(),
        external,
      );
      run(
        "UPDATE proformas SET paid=paid-?,status=? WHERE id=?",
        amount,
        p.credit_awarded ? "void" : "open",
        p.id,
      );
      if (p.reservation_id)
        run(
          "UPDATE reservations SET status='pending_payment' WHERE id=? AND status='confirmed'",
          p.reservation_id,
        );
      notify(
        req.org.id,
        p.member_id,
        "Refund recorded / تم تسجيل الاسترداد",
        String(amount / 100) + " SAR · " + external,
      );
      audit(req, "payment.refund", p.id);
    });
    res.json({ ok: true });
  });
  app.post("/api/proformas/:id/payment", owner, (req, res) => {
    transaction(() => {
      const p = get(
        "SELECT * FROM proformas WHERE id=? AND org_id=?",
        req.params.id,
        req.org.id,
      );
      if (!p) fail("Payment request not found", 404);
      if (p.status === "void") fail("Payment request is void");
      const amount = integer(req.body.amount, "payment", 1);
      if (amount > p.due - p.paid) fail("Payment exceeds outstanding balance");
      const reference = text(req.body.reference, "payment reference", 200);
      const external = text(
        req.body.externalRef,
        "payment voucher details",
        200,
      );
      if (
        get(
          "SELECT id FROM payments WHERE org_id=? AND reference=?",
          req.org.id,
          reference,
        )
      )
        fail("Payment reference already recorded", 409);
      run(
        "INSERT INTO payments(id,org_id,proforma_id,amount,reference,created_at,external_ref) VALUES(?,?,?,?,?,?,?)",
        id(),
        req.org.id,
        p.id,
        amount,
        reference,
        now(),
        external,
      );
      run(
        "UPDATE proformas SET paid=paid+?,status=?,external_ref=? WHERE id=?",
        amount,
        p.paid + amount === p.due ? "settled" : "open",
        external,
        p.id,
      );
      notify(
        req.org.id,
        p.member_id,
        "Payment recorded / تم تسجيل الدفعة",
        `${(amount / 100).toFixed(2)} SAR · ${reference}`,
      );
      if (p.reservation_id && p.paid + amount === p.due) {
        const booking = get(
          "SELECT * FROM reservations WHERE id=? AND org_id=?",
          p.reservation_id,
          req.org.id,
        );
        if (!booking || booking.status !== "pending_payment")
          fail("Booking cannot be activated", 409);
        if (record(req.org.id, "classes", booking.class_id).startsAt <= now())
          fail("Class has already started", 409);
        const session = record(req.org.id, "classes", booking.class_id);
        if (
          feedingBlocked(
            req.org.id,
            booking.horse_id,
            session.startsAt,
            session.endsAt,
          )
        )
          fail("Horse is reserved for feeding", 409);
        if (record(req.org.id, "horses", booking.horse_id).status !== "ready")
          fail("Horse is not ready; reconcile assignment before payment", 409);
        run(
          "UPDATE reservations SET status='confirmed' WHERE id=?",
          booking.id,
        );
        notify(
          req.org.id,
          p.member_id,
          "Booking activated / تم تفعيل الحجز",
          p.description,
        );
      }
      awardCredits(p.id);
      audit(req, "payment.record", p.id);
    });
    res.json({ ok: true });
  });
  app.post("/api/notifications/:id/read", (req, res) => {
    run(
      "UPDATE notifications SET read_at=? WHERE id=? AND org_id=? AND user_id=?",
      now(),
      req.params.id,
      req.org.id,
      req.user.id,
    );
    res.json({ ok: true });
  });
  app.get("/api/reports", owner, (req, res) => {
    const org = req.org.id;
    res.json({
      horses: records(org, "horses").length,
      members: get("SELECT count(*) AS n FROM memberships WHERE org_id=?", org)
        .n,
      bookings: get(
        "SELECT count(*) AS n FROM reservations WHERE org_id=? AND status IN ('confirmed','pending_payment')",
        org,
      ).n,
      ...get(
        "SELECT coalesce(sum(gross),0) AS gross,coalesce(sum(discount),0) AS discounts,coalesce(sum(voucher),0) AS voucherUsed,coalesce(sum(due-paid),0) AS outstanding,coalesce(sum(paid),0) AS recordedPayments FROM proformas WHERE org_id=? AND status!='void'",
        org,
      ),
      lowStock: records(org, "inventory").filter(
        (x) => x.quantity <= x.reorderAt,
      ).length,
      overdueTasks: records(org, "tasks").filter(
        (x) => !x.done && !x.cancelled && x.dueAt < now(),
      ).length,
      currency: "SAR",
      notice:
        "Operational report only; official tax invoices are managed in your external ZATCA system.",
    });
  });
  app.post("/api/stables", owner, (req, res) => {
    const nameEn =
      typeof req.body.nameEn === "string" ? req.body.nameEn.trim() : "";
    const nameAr =
      typeof req.body.nameAr === "string" ? req.body.nameAr.trim() : "";
    const name = text(nameEn || nameAr, "stable name", 100);
    if (nameEn.length > 100 || nameAr.length > 100)
      fail("Names must be at most 100 characters");
    const oid = id();
    transaction(() => {
      run("INSERT INTO organizations VALUES(?,?)", oid, name);
      run("INSERT INTO memberships VALUES(?,?,?)", req.user.id, oid, "owner");
      put(oid, "academySettings", oid + ":settings", {
        academyName: name,
        academyNameEn: nameEn,
        academyNameAr: nameAr,
      });
      audit({ ...req, org: { id: oid } }, "stable.create", oid);
    });
    res.status(201).json({ id: oid, name, nameEn, nameAr, role: "owner" });
  });
  app.post("/api/members/link", owner, (req, res) => {
    const email = text(req.body.email, "email", 254).toLowerCase();
    const user = get("SELECT id FROM users WHERE email=?", email);
    if (!user) fail("No registered account matches this email", 404);
    transaction(() => {
      if (
        get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
          req.org.id,
          user.id,
        )
      )
        fail("Member already belongs to this stable", 409);
      run(
        "INSERT INTO memberships VALUES(?,?,?)",
        user.id,
        req.org.id,
        "member",
      );
      audit(req, "member.link", user.id);
    });
    res.status(201).json({ id: user.id });
  });
  app.put("/api/settings", owner, (req, res) => {
    const b = req.body;
    if (!["day", "week", "month", "quarter"].includes(b.calendarView))
      fail("Invalid calendar view");
    const settings = {
      academyName: text(
        b.academyNameEn || b.academyNameAr || b.academyName,
        "academy name",
        100,
      ),
      academyNameEn:
        typeof b.academyNameEn === "string"
          ? b.academyNameEn.trim().slice(0, 100)
          : b.academyName,
      academyNameAr:
        typeof b.academyNameAr === "string"
          ? b.academyNameAr.trim().slice(0, 100)
          : "",
      contactEmail:
        typeof b.contactEmail === "string" ? b.contactEmail.trim() : "",
      phone: typeof b.phone === "string" ? b.phone.trim().slice(0, 100) : "",
      address:
        typeof b.address === "string" ? b.address.trim().slice(0, 500) : "",
      calendarView: b.calendarView,
      lessonDuration: integer(b.lessonDuration, "lesson duration", 15, 480),
      defaultCapacity: integer(b.defaultCapacity, "default capacity", 1, 100),
      defaultCreditCost: integer(
        b.defaultCreditCost,
        "default credit cost",
        1,
        100,
      ),
    };
    if (
      settings.contactEmail &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail) ||
        settings.contactEmail.length > 254)
    )
      fail("Invalid contact email");
    transaction(() => {
      put(req.org.id, "academySettings", req.org.id + ":settings", settings);
      run(
        "UPDATE organizations SET name=? WHERE id=?",
        settings.academyName,
        req.org.id,
      );
      audit(req, "settings.update", req.org.id);
    });
    res.json(settings);
  });
  app.post("/api/waitlist", (req, res) => {
    const c = record(req.org.id, "classes", req.body.classId);
    if (c.startsAt <= now()) fail("Class has started");
    if (safeClass(req, c).places > 0)
      fail("Places are available; book the class");
    if (
      get(
        "SELECT id FROM reservations WHERE org_id=? AND member_id=? AND class_id=? AND status IN ('confirmed','pending_payment')",
        req.org.id,
        req.user.id,
        c.id,
      )
    )
      fail("Already booked", 409);
    run(
      "INSERT OR IGNORE INTO waitlist VALUES(?,?,?,?,?)",
      id(),
      req.org.id,
      req.user.id,
      c.id,
      now(),
    );
    res.status(201).json({ ok: true });
  });
  app.delete("/api/waitlist/:id", (req, res) => {
    run(
      "DELETE FROM waitlist WHERE id=? AND org_id=?" +
        (req.org.role === "owner" ? "" : " AND member_id=?"),
      ...(req.org.role === "owner"
        ? [req.params.id, req.org.id]
        : [req.params.id, req.org.id, req.user.id]),
    );
    res.json({ ok: true });
  });
  app.put("/api/attendance/:id", owner, (req, res) => {
    const b = get(
      "SELECT * FROM reservations WHERE id=? AND org_id=?",
      req.params.id,
      req.org.id,
    );
    if (!b || b.status !== "confirmed")
      fail("Only activated bookings can have attendance", 409);
    if (!["present", "absent", "excused"].includes(req.body.status))
      fail("Invalid attendance");
    run(
      "INSERT INTO attendance VALUES(?,?,?,?,?) ON CONFLICT(reservation_id) DO UPDATE SET status=excluded.status,actor_id=excluded.actor_id,updated_at=excluded.updated_at",
      b.id,
      req.org.id,
      req.body.status,
      req.user.id,
      now(),
    );
    audit(req, "attendance.update", b.id);
    res.json({ ok: true });
  });
  app.post("/api/members", owner, async (req, res) => {
    const name = text(
        req.body.nameEn || req.body.nameAr || req.body.name,
        "name",
        100,
      ),
      email = text(req.body.email, "email", 254).toLowerCase(),
      password = text(req.body.password, "temporary password", 128);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6)
      fail("Valid email and a password of at least 6 characters required");
    const encrypted = await passwordHash(password),
      uid = id();
    transaction(() => {
      if (get("SELECT id FROM users WHERE email=?", email))
        fail("Email already registered; use an invitation", 409);
      run(
        "INSERT INTO users VALUES(?,?,?,?,?)",
        uid,
        email,
        name,
        encrypted,
        now(),
      );
      saveProfileName(uid, req.body, name);
      run("INSERT INTO memberships VALUES(?,?,?)", uid, req.org.id, "member");
      audit(req, "member.create", uid);
    });
    res.status(201).json({ id: uid });
  });
  app.put("/api/members/:id/role", owner, (req, res) => {
    const uid = req.params.id,
      role = req.body.role;
    if (!["member", "instructor", "vet", "caregiver"].includes(role))
      fail("Invalid staff role");
    if (
      !get(
        "SELECT user_id FROM memberships WHERE org_id=? AND user_id=? AND role='member'",
        req.org.id,
        uid,
      )
    )
      fail("Member not found or is manager", 404);
    transaction(() => {
      if (role === "member")
        run(
          "DELETE FROM staff_roles WHERE org_id=? AND user_id=?",
          req.org.id,
          uid,
        );
      else
        run(
          "INSERT INTO staff_roles VALUES(?,?,?) ON CONFLICT(org_id,user_id) DO UPDATE SET role=excluded.role",
          req.org.id,
          uid,
          role,
        );
      audit(req, "member.role", uid);
    });
    res.json({ ok: true });
  });
  app.put("/api/members/:id", owner, (req, res) => {
    const uid = req.params.id;
    if (
      !get(
        "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
        req.org.id,
        uid,
      )
    )
      fail("Member not found", 404);
    const name = text(
      req.body.nameEn || req.body.nameAr || req.body.name,
      "name",
      100,
    );
    // Names belong to the global account; do not modify another academy's account.
    if (get("SELECT count(*) AS n FROM memberships WHERE user_id=?", uid).n > 1)
      fail("Shared accounts must update their own profile", 409);
    const previous = profileName(uid, name);
    saveProfileName(uid, { ...previous, ...req.body }, name);
    run("UPDATE users SET name=? WHERE id=?", name, uid);
    audit(req, "member.update", uid);
    res.json({ ok: true });
  });
  app.delete("/api/members/:id", owner, (req, res) => {
    const uid = req.params.id;
    transaction(() => {
      if (
        !get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=? AND role='member'",
          req.org.id,
          uid,
        )
      )
        fail("Member not found or is manager", 404);
      if (
        get(
          "SELECT id FROM reservations WHERE org_id=? AND member_id=? AND status IN ('confirmed','pending_payment')",
          req.org.id,
          uid,
        ) ||
        creditBalance(req.org.id, uid) !== 0 ||
        get(
          "SELECT id FROM proformas WHERE org_id=? AND member_id=? AND status='open'",
          req.org.id,
          uid,
        )
      )
        fail(
          "Reconcile bookings, balances and payments before removing member",
          409,
        );
      run(
        "DELETE FROM staff_roles WHERE org_id=? AND user_id=?",
        req.org.id,
        uid,
      );
      run(
        "DELETE FROM memberships WHERE org_id=? AND user_id=?",
        req.org.id,
        uid,
      );
      run(
        "DELETE FROM waitlist WHERE org_id=? AND member_id=?",
        req.org.id,
        uid,
      );
      audit(req, "member.remove", uid);
    });
    res.json({ ok: true });
  });
  app.get("/api/audit", owner, (req, res) =>
    res.json(
      all(
        "SELECT * FROM audit WHERE org_id=? ORDER BY id DESC LIMIT 100",
        req.org.id,
      ),
    ),
  );
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Endpoint not found" }),
  );
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    if (status === 500) console.error("API error", err.message);
    res.status(status).json({
      error: status === 500 ? "Server operation failed" : err.message,
    });
  });
  app.locals.remind = () => {
    transaction(() => {
      for (const org of all("SELECT id FROM organizations")) {
        const day = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Riyadh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(clock());
        for (const plan of records(org.id, "feeding"))
          syncCareTasks(org.id, "feeding", plan);
        for (const task of records(org.id, "tasks").filter(
          (t) =>
            !t.done &&
            !t.cancelled &&
            t.dueAt <= new Date(clock().getTime() + 86400000).toISOString(),
        ))
          notify(
            org.id,
            task.assigneeId,
            "Task due / مهمة مستحقة",
            task.title,
            "task:" + task.id + ":" + task.dueAt,
          );
        for (const medical of records(org.id, "medical").filter(
          (m) =>
            !m.completed &&
            m.dueAt &&
            m.dueAt <= new Date(clock().getTime() + 7 * 86400000).toISOString(),
        ))
          owners(org.id).forEach((u) =>
            notify(
              org.id,
              u,
              "Care due / رعاية مستحقة",
              record(org.id, "horses", medical.horseId).name +
                " · " +
                medical.type,
              "medical:" + medical.id + ":" + medical.dueAt + ":" + u,
            ),
          );
        for (const item of records(org.id, "inventory").filter(
          (i) => i.quantity <= i.reorderAt,
        ))
          owners(org.id).forEach((u) =>
            notify(
              org.id,
              u,
              "Low stock / مخزون منخفض",
              item.name,
              "stock:" + item.id + ":" + item.quantity + ":" + u,
            ),
          );
        for (const b of all(
          "SELECT * FROM reservations WHERE org_id=? AND status='confirmed'",
          org.id,
        )) {
          const c = record(org.id, "classes", b.class_id);
          if (
            c.startsAt > now() &&
            c.startsAt <= new Date(clock().getTime() + 86400000).toISOString()
          )
            notify(
              org.id,
              b.member_id,
              "Upcoming class / حصة قادمة",
              c.title + " · " + c.startsAt,
              "class:" + b.id + ":" + c.startsAt,
            );
        }
      }
    });
  };
  return app;
}
