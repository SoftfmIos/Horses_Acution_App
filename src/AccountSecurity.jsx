import React, { useState } from "react";
import { ProfilePhoto } from "./ProfilePhoto";
export function AccountSecurity({
  user,
  ar,
  request,
  onSignedOut,
  photoEnabled = false,
}) {
  const l = (en, a) => (ar ? a : en);
  const [mode, setMode] = useState("email"),
    [current, setCurrent] = useState(""),
    [email, setEmail] = useState(user.email),
    [password, setPassword] = useState(""),
    [repeat, setRepeat] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [preview, setPreview] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [deleting, setDeleting] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "password" && password !== repeat)
        throw Error(
          l("Passwords do not match.", "كلمتا المرور غير متطابقتين."),
        );
      await request("/auth/account/" + mode, {
        method: "PUT",
        body: {
          currentPassword: current,
          ...(mode === "email" ? { email } : { newPassword: password }),
        },
      });
      setCurrent("");
      setPassword("");
      setRepeat("");
      onSignedOut(
        l(
          "Login details updated. Please sign in again.",
          "تم تحديث بيانات الدخول. يرجى تسجيل الدخول مجدداً.",
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel account-security">
      <h2>{l("Account & security", "الحساب والأمان")}</h2>
      {photoEnabled && (
        <ProfilePhoto
          kind="members"
          id={user.id}
          name={user.name}
          request={request}
          editable
          ar={ar}
        />
      )}
      <p>
        <strong>{user.name}</strong> · <bdi>{user.email}</bdi>
      </p>
      <p>
        {l(
          "These controls apply to your account in all academies. Confirm your current password; email or password changes sign out every device.",
          "تنطبق هذه الخيارات على حسابك في جميع الأكاديميات. أكّد كلمة المرور الحالية؛ يؤدي تغيير البريد أو كلمة المرور إلى تسجيل الخروج من جميع الأجهزة.",
        )}
      </p>
      <div className="member-actions">
        <button
          className={mode === "email" ? "primary" : "soft"}
          onClick={() => {
            setMode("email");
            setError("");
          }}
        >
          {l("Change email", "تغيير البريد")}
        </button>
        <button
          className={mode === "password" ? "primary" : "soft"}
          onClick={() => {
            setMode("password");
            setError("");
          }}
        >
          {l("Change password", "تغيير كلمة المرور")}
        </button>
      </div>
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      <form onSubmit={submit} className="member-modal-form">
        <label>
          {l("Current password", "كلمة المرور الحالية")}
          <input
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        {mode === "email" ? (
          <label>
            {l("New email", "البريد الجديد")}
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        ) : (
          <>
            <label>
              {l("New password", "كلمة المرور الجديدة")}
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              {l("Confirm new password", "تأكيد كلمة المرور الجديدة")}
              <input
                type="password"
                autoComplete="new-password"
                required
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              />
            </label>
          </>
        )}
        <button className="primary" disabled={busy}>
          {l("Save & sign in again", "حفظ وتسجيل الدخول مجدداً")}
        </button>
      </form>
      <div className="account-delete-panel">
        <h3>{l("Delete account", "حذف الحساب")}</h3>
        <p>
          {l(
            "Remove your profile and account access permanently. Upcoming bookings are cancelled. Records needed for financial reconciliation, service history or legal obligations are retained with a deleted-account identity. Deletion does not automatically issue refunds.",
            "احذف ملفك والوصول إلى حسابك نهائياً. تُلغى الحجوزات القادمة. تُحتفظ السجلات اللازمة لتسوية المدفوعات والسجل الخدمي والالتزامات النظامية بهوية حساب محذوف. لا يؤدي الحذف إلى إصدار مبالغ مستردة تلقائياً.",
          )}
        </p>
        {!deleting ? (
          <button
            className="soft"
            disabled={busy}
            onClick={async () => {
              setError("");
              setBusy(true);
              try {
                setPreview(await request("/auth/account/deletion"));
                setDeleting(true);
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {l("Review account deletion", "مراجعة حذف الحساب")}
          </button>
        ) : (
          preview && (
            <>
              <p>
                {l("Upcoming bookings", "الحجوزات القادمة")}:{" "}
                {preview.activeBookings} · {l("Session balance", "رصيد الحصص")}:{" "}
                {preview.creditBalance} ·{" "}
                {l("Open invoices", "الفواتير المفتوحة")}:{" "}
                {preview.openInvoices}
              </p>
              {!!preview.blockers.length ? (
                <p className="notice">
                  {l(
                    "Assign another academy administrator/staff owner in the web portal before deleting this account:",
                    "عيّن مسؤولاً وموظفاً مالكاً آخر للأكاديمية عبر بوابة الويب قبل حذف الحساب:",
                  )}{" "}
                  {preview.blockers.map((x) => x.name).join(", ")}
                </p>
              ) : (
                <form
                  className="member-modal-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError("");
                    try {
                      await request("/auth/account", {
                        method: "DELETE",
                        body: { currentPassword: current, confirmation },
                      });
                      setCurrent("");
                      onSignedOut(
                        l("Your account has been deleted.", "تم حذف حسابك."),
                      );
                    } catch (e) {
                      setError(e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label>
                    {l("Current password", "كلمة المرور الحالية")}
                    <input
                      required
                      type="password"
                      autoComplete="current-password"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                    />
                  </label>
                  <label>
                    {l(
                      "Type DELETE to confirm permanent deletion",
                      "اكتب DELETE لتأكيد الحذف النهائي",
                    )}
                    <input
                      required
                      autoComplete="off"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                    />
                  </label>
                  <button
                    className="primary account-delete-button"
                    disabled={busy || confirmation !== "DELETE"}
                  >
                    {l("Permanently delete my account", "حذف حسابي نهائياً")}
                  </button>
                </form>
              )}
              <button
                className="soft"
                disabled={busy}
                onClick={() => setDeleting(false)}
              >
                {l("Cancel", "إلغاء")}
              </button>
            </>
          )
        )}
      </div>
    </section>
  );
}
