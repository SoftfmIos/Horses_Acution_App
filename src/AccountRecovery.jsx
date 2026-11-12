import React, { useState } from "react";
import { api } from "./api";

export function AccountRecovery({ ar, onBack }) {
  const l = (en, arabic) => (ar ? arabic : en);
  const [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="account-recovery">
      <h2>{l("Recover your account", "استعادة حسابك")}</h2>
      <h3>{l("Forgot your password?", "نسيت كلمة المرور؟")}</h3>
      <p>
        {l(
          "Enter your login email. If the account can receive email, we’ll send a reset link valid for 30 minutes.",
          "أدخل بريد تسجيل الدخول. إذا كان الحساب يستقبل البريد فسنرسل رابط إعادة تعيين صالحاً لمدة 30 دقيقة.",
        )}
      </p>
      {sent ? (
        <p role="status" className="notice">
          {l(
            "If an account can receive email, a reset link will be sent. Check your inbox and spam folder. If nothing arrives, contact support.",
            "إذا كان الحساب يستقبل البريد فسيُرسل رابط إعادة التعيين. تحقق من الوارد والبريد غير المرغوب فيه. تواصل مع الدعم إذا لم تصلك الرسالة.",
          )}
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await api("/auth/forgot-password", {
                method: "POST",
                body: { email },
              });
              setSent(true);
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {l("Login email", "بريد تسجيل الدخول")}
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button className="primary" disabled={busy}>
            {busy
              ? l("Sending…", "جار الإرسال…")
              : l("Send password reset link", "إرسال رابط إعادة التعيين")}
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <h3>{l("Forgot your login email?", "نسيت بريد تسجيل الدخول؟")}</h3>
      <p>
        {l(
          "Contact the academy so they can verify your identity and help find your account. Include your name and registered phone number; never send your password.",
          "تواصل مع الأكاديمية للتحقق من هويتك ومساعدتك في العثور على حسابك. اذكر اسمك ورقم هاتفك المسجل، ولا ترسل كلمة المرور.",
        )}
      </p>
      <a
        className="soft"
        href="mailto:support@riyadhpolohills.com?subject=Login%20email%20recovery"
      >
        {l("Email account support", "مراسلة دعم الحسابات")}
      </a>
      <button className="soft" disabled={busy} onClick={onBack}>
        {l("Back to login", "العودة لتسجيل الدخول")}
      </button>
    </section>
  );
}
export function ResetPassword({ token, ar, onBack }) {
  const l = (en, arabic) => (ar ? arabic : en);
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <div className="auth-page">
      <section className="auth-card">
        <img
          className="auth-logo"
          src="/logos/riyadh-polo-club-academy.png"
          alt={l("Academy logo", "شعار الأكاديمية")}
        />
        <h1>{l("Reset your password", "إعادة تعيين كلمة المرور")}</h1>
        {done ? (
          <p role="status">
            {l(
              "Your password has been updated. Sign in with your new password. Previous sessions have been signed out.",
              "تم تحديث كلمة المرور. سجل الدخول بالكلمة الجديدة. أُغلقت الجلسات السابقة.",
            )}
          </p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (password !== confirm) {
                setError(
                  l("Passwords do not match.", "كلمتا المرور غير متطابقتين."),
                );
                return;
              }
              setBusy(true);
              try {
                await api("/auth/reset-password", {
                  method: "POST",
                  body: { token, password },
                });
                setDone(true);
                setPassword("");
                setConfirm("");
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              {l("New password", "كلمة المرور الجديدة")}
              <input
                required
                type="password"
                autoComplete="new-password"
                minLength={6}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              {l("Confirm new password", "تأكيد كلمة المرور الجديدة")}
              <input
                required
                type="password"
                autoComplete="new-password"
                minLength={6}
                maxLength={128}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            <button className="primary" disabled={busy}>
              {l("Save new password", "حفظ كلمة المرور الجديدة")}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="soft" disabled={busy} onClick={onBack}>
          {l("Back to login", "العودة لتسجيل الدخول")}
        </button>
      </section>
    </div>
  );
}
