import React, { useState } from "react";

export function EmailSettings({ settings, ar, request, action, busy }) {
  const [draft, setDraft] = useState(null);
  const label = (en, arabic) => (ar ? arabic : en);
  const form = {
    enabled: false,
    host: "",
    port: 587,
    username: "notifications@riyadhpolohills.com",
    from: "notifications@riyadhpolohills.com",
    replyTo: "support@riyadhpolohills.com",
    ...settings,
    password: "",
    ...draft,
  };
  return (
    <section className="panel">
      <h2>{label("Outgoing email settings", "إعدادات البريد الصادر")}</h2>
      <p>
        {label(
          "Configure the mailbox used to send booking, payment and reminder notifications for this stable.",
          "اضبط البريد المستخدم لإرسال إشعارات الحجوزات والدفع والتذكيرات لهذا الإسطبل.",
        )}
      </p>
      <form
        className="settings-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            await action(() =>
              request("/settings/email", {
                method: "PUT",
                body: {
                  enabled: form.enabled,
                  host: form.host,
                  port: Number(form.port),
                  username: form.username,
                  from: form.from,
                  replyTo: form.replyTo,
                  password: form.password,
                },
              }),
            )
          )
            setDraft(null);
        }}
      >
        <label>
          {label("Email delivery", "إرسال البريد")}
          <select
            aria-label={label("Email delivery", "إرسال البريد")}
            value={String(form.enabled)}
            disabled={busy}
            onChange={(e) =>
              setDraft({ ...form, enabled: e.target.value === "true" })
            }
          >
            <option value="false">{label("Disabled", "معطل")}</option>
            <option value="true">{label("Enabled", "مفعل")}</option>
          </select>
        </label>
        {[
          ["host", "SMTP hostname", "اسم خادم SMTP", "text"],
          ["port", "SMTP port", "منفذ SMTP", "number"],
          ["username", "SMTP username", "اسم مستخدم SMTP", "text"],
          ["from", "Sender email", "بريد المرسل", "email"],
          ["replyTo", "Reply-to email", "بريد الرد", "email"],
        ].map(([key, en, arabic, type]) => (
          <label key={key}>
            {label(en, arabic)}
            <input
              type={type}
              dir="ltr"
              required={key !== "replyTo"}
              value={form[key]}
              disabled={busy}
              min={type === "number" ? 1 : undefined}
              max={type === "number" ? 65535 : undefined}
              maxLength={key === "host" ? 253 : 254}
              onChange={(e) => setDraft({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <label>
          {label("Mailbox / app password", "كلمة مرور البريد / التطبيق")}
          <input
            type="password"
            dir="ltr"
            autoComplete="new-password"
            maxLength={1024}
            required={form.enabled && !settings?.passwordSaved}
            disabled={busy}
            value={form.password}
            placeholder={
              settings?.passwordSaved
                ? label(
                    "Saved — leave blank to keep",
                    "محفوظة — اتركها فارغة للاحتفاظ بها",
                  )
                : ""
            }
            onChange={(e) => setDraft({ ...form, password: e.target.value })}
          />
        </label>
        <p className="notice">
          {label(
            "Use your provider’s SMTP host and mailbox or app password. Port 465 uses TLS; port 587 uses STARTTLS. Saved passwords are encrypted and never displayed. Settings take effect within one minute.",
            "استخدم خادم SMTP وكلمة مرور البريد أو التطبيق من مزود البريد. المنفذ 465 يستخدم TLS والمنفذ 587 يستخدم STARTTLS. تُحفظ كلمات المرور مشفرة ولا تُعرض. تُطبق الإعدادات خلال دقيقة.",
          )}
        </p>
        <button className="primary" disabled={busy}>
          {label("Save email settings", "حفظ إعدادات البريد")}
        </button>
      </form>
    </section>
  );
}
