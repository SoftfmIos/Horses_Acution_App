import { ProfilePhoto } from "./ProfilePhoto";
import { DEFAULT_HOLD_HOURS } from "../shared/booking-policy";
import React, { useState } from "react";
import {
  calendarDays,
  periodMonths,
  movePeriod,
  riyadhDay as dayKey,
} from "./calendar";
export function Schedule({
  classes,
  horses,
  onSelect,
  ar,
  defaultView = "month",
  initialDate = "",
  holdHours = DEFAULT_HOLD_HOURS,
}) {
  const [view, setView] = useState(defaultView),
    [anchor, setAnchor] = useState(
      () =>
        initialDate ||
        dayKey(
          classes
            .filter((c) => c.endsAt > new Date().toISOString())
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0]
            ?.startsAt || new Date(),
        ),
    ),
    [horse, setHorse] = useState(""),
    [arena, setArena] = useState("");
  const filtered = classes.filter(
    (c) =>
      (!horse || c.horseIds.includes(horse)) && (!arena || c.arena === arena),
  );
  const months = periodMonths(anchor, view);
  const locale = ar ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB";
  const monthLabel = (value) =>
    new Date(value + "T12:00:00Z").toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Riyadh",
    });
  const monthTitle =
    view === "quarter"
      ? `${monthLabel(months[0])} – ${monthLabel(months[2])}`
      : view === "month"
        ? monthLabel(anchor)
        : anchor;
  return (
    <section
      className="panel schedule"
      aria-label={ar ? "تقويم الحجز" : "Booking calendar"}
    >
      <div className="slot-legend">
        <span className="slot-available">{ar ? "متاح" : "Available"}</span>
        <span className="slot-held">
          {ar
            ? "حجز مؤقت " + holdHours + " ساعة"
            : holdHours + "-hour payment hold"}
        </span>
        <span className="slot-booked">
          {ar ? "حجز مؤكد" : "Confirmed booking"}
        </span>
        <span className="slot-blocked">
          {ar ? "غير متاح للرعاية" : "Unavailable for care"}
        </span>
      </div>
      <div className="calendar-tools">
        <label>
          {ar ? "العرض" : "View"}
          <select
            aria-label={ar ? "العرض" : "View"}
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            {[
              ["day", "Day", "يوم"],
              ["week", "Week", "أسبوع"],
              ["month", "Month", "شهر"],
              ["quarter", "Quarter", "ربع سنة"],
            ].map(([v, en, arabic]) => (
              <option key={v} value={v}>
                {ar ? arabic : en}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => setAnchor(movePeriod(anchor, view, -1))}
          aria-label={ar ? "السابق" : "Previous period"}
        >
          ‹
        </button>
        <label>
          {ar ? "التاريخ" : "Date"}
          <input
            type="date"
            lang="en"
            value={anchor}
            onChange={(e) => e.target.value && setAnchor(e.target.value)}
          />
        </label>
        <button
          onClick={() => setAnchor(movePeriod(anchor, view, 1))}
          aria-label={ar ? "التالي" : "Next period"}
        >
          ›
        </button>
        <button onClick={() => setAnchor(dayKey(new Date()))}>
          {ar ? "اليوم" : "Today"}
        </button>
        <label>
          {ar ? "الخيل" : "Horse"}
          <select
            aria-label={ar ? "الخيل" : "Horse"}
            value={horse}
            onChange={(e) => setHorse(e.target.value)}
          >
            <option value="">{ar ? "الكل" : "All horses"}</option>
            {horses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ar ? "الميدان" : "Arena"}
          <select
            aria-label={ar ? "الميدان" : "Arena"}
            value={arena}
            onChange={(e) => setArena(e.target.value)}
          >
            <option value="">{ar ? "الكل" : "All arenas"}</option>
            {[...new Set(classes.map((c) => c.arena))].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
      </div>
      <p>
        {ar
          ? "الأوقات بتوقيت الرياض. اختر الحصة للحجز أو الإدارة."
          : "Times are in Riyadh. Select a class to book or manage it."}
      </p>
      <h2 className="calendar-period" aria-live="polite">
        {monthTitle}
      </h2>
      <div className={view === "quarter" ? "quarter-grid" : ""}>
        {(view === "quarter" ? months : [anchor]).map((month) => (
          <section key={month} className="calendar-month">
            {view === "quarter" && <h3>{monthLabel(month)}</h3>}
            <div className={"calendar-grid calendar-" + view}>
              {calendarDays(month, view).map((day) => {
                const sessions = filtered
                  .filter((c) => dayKey(c.startsAt) === day)
                  .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
                return (
                  <div
                    className={
                      "calendar-day" +
                      (view !== "day" &&
                      view !== "week" &&
                      day.slice(0, 7) !== month.slice(0, 7)
                        ? " outside-month"
                        : "") +
                      (day === dayKey(new Date()) ? " is-today" : "")
                    }
                    key={day}
                  >
                    <strong>
                      {new Date(day + "T12:00:00Z").toLocaleDateString(locale, {
                        timeZone: "Asia/Riyadh",
                        weekday: "short",
                        day: "numeric",
                      })}
                    </strong>
                    {sessions.map((c) => (
                      <button
                        className={
                          "calendar-event " +
                          (c.places > 0
                            ? "slot-available"
                            : c.heldPlaces > 0
                              ? "slot-held"
                              : c.confirmedPlaces > 0
                                ? "slot-booked"
                                : "slot-blocked")
                        }
                        key={c.id}
                        onClick={() => onSelect(c)}
                      >
                        <b>{c.title}</b>
                        <span>
                          {new Date(c.startsAt).toLocaleTimeString(locale, {
                            timeZone: "Asia/Riyadh",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {c.instructor}
                        </span>
                        <span>
                          {c.arena} · {c.places} {ar ? "مقاعد" : "places"}
                        </span>
                        <span className="slot-badges">
                          <span className="slot-available">
                            {c.places} {ar ? "متاح" : "available"}
                          </span>
                          {c.heldPlaces > 0 && (
                            <span className="slot-held">
                              {c.heldPlaces} {ar ? "معلق" : "held"}
                            </span>
                          )}
                          {c.confirmedPlaces > 0 && (
                            <span className="slot-booked">
                              {c.confirmedPlaces} {ar ? "محجوز" : "booked"}
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
export function MemberTools({
  members,
  request,
  action,
  ar,
  busy = false,
  isAdmin = false,
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) {
  const [form, setForm] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const label = (en, arabic) => (ar ? arabic : en);
  return (
    <section className="panel">
      <div className="member-toolbar">
        <button
          className="primary"
          disabled={!canAdd}
          onClick={() => {
            setShowPassword(false);
            setForm({
              mode: "create",
              nameEn: "",
              nameAr: "",
              email: "",
              password: "",
            });
          }}
        >
          {label("Add user", "إضافة مستخدم")}
        </button>
        <button
          className="soft"
          disabled={!canAdd}
          onClick={() => setForm({ mode: "link", email: "" })}
        >
          {label("Add existing member", "إضافة عضو مسجل")}
        </button>
      </div>
      {form && (
        <div className="modal-backdrop" onClick={() => !busy && setForm(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2 id="member-dialog-title">
                {form.mode === "edit"
                  ? label("Edit member", "تعديل العضو")
                  : form.mode === "link"
                    ? label("Add existing member", "إضافة عضو مسجل")
                    : label("Add user", "إضافة مستخدم")}
              </h2>
              <button
                className="icon-button"
                aria-label={label("Close", "إغلاق")}
                disabled={busy}
                onClick={() => setForm(null)}
              >
                ×
              </button>
            </div>
            <form
              className="member-modal-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const path =
                  form.mode === "link"
                    ? "/members/link"
                    : "/members" + (form.id ? "/" + form.id : "");
                if (
                  await action(() =>
                    request(path, {
                      method: form.id ? "PUT" : "POST",
                      body: form,
                    }),
                  )
                ) {
                  if (form.mode === "create") setCredentials({ ...form });
                  setForm(null);
                  setShowPassword(false);
                }
              }}
            >
              {form.mode !== "link" && (
                <>
                  <label>
                    {label("Name (English)", "الاسم بالإنجليزية")}
                    <input
                      required
                      value={form.nameEn}
                      maxLength={100}
                      onChange={(e) =>
                        setForm({ ...form, nameEn: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    {label("Name (Arabic)", "الاسم بالعربية")}
                    <input
                      dir="rtl"
                      value={form.nameAr}
                      maxLength={100}
                      onChange={(e) =>
                        setForm({ ...form, nameAr: e.target.value })
                      }
                    />
                  </label>
                </>
              )}
              {form.mode !== "edit" && (
                <label>
                  {label("Email", "البريد الإلكتروني")}
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </label>
              )}
              {form.mode === "create" && (
                <label>
                  {label("User type", "نوع المستخدم")}
                  <select
                    aria-label={label("User type", "نوع المستخدم")}
                    value={form.role || "member"}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="member">{label("Member", "عضو")}</option>
                    <option value="staff" disabled={!isAdmin}>
                      {label("Staff", "موظف")}
                    </option>
                  </select>
                </label>
              )}
              {form.mode === "create" && (
                <label>
                  {label(
                    "Password (6+ characters)",
                    "كلمة المرور (6 أحرف على الأقل)",
                  )}
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <span className="member-toolbar">
                    <button
                      type="button"
                      className="soft"
                      disabled={busy}
                      onClick={() => {
                        const alphabet =
                          "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*?";
                        const limit = 256 - (256 % alphabet.length);
                        let password = "";
                        while (password.length < 16) {
                          const bytes = crypto.getRandomValues(
                            new Uint8Array(32),
                          );
                          for (const byte of bytes) {
                            if (byte < limit && password.length < 16)
                              password += alphabet[byte % alphabet.length];
                          }
                        }
                        setForm({ ...form, password });
                      }}
                    >
                      {label("Generate password", "توليد كلمة المرور")}
                    </button>
                    <button
                      type="button"
                      className="soft"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? label("Hide password", "إخفاء كلمة المرور")
                        : label("Show password", "إظهار كلمة المرور")}
                    </button>
                  </span>
                </label>
              )}
              <p className="notice">
                {label(
                  "This member will belong to the currently selected stable.",
                  "سيتم ربط العضو بالإسطبل المحدد حالياً.",
                )}
              </p>
              <div className="modal-actions">
                <button className="primary" disabled={busy}>
                  {label("Save", "حفظ")}
                </button>
                <button
                  className="soft"
                  type="button"
                  disabled={busy}
                  onClick={() => setForm(null)}
                >
                  {label("Cancel", "إلغاء")}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {credentials && (
        <div className="modal-backdrop" onClick={() => setCredentials(null)}>
          <section
            className="modal user-credentials"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credentials-title"
            dir={ar ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="credentials-title">
              {label(
                "User created — account details",
                "تم إنشاء المستخدم — بيانات الحساب",
              )}
            </h2>
            <dl className="credential-details">
              <dt>{label("Name", "الاسم")}</dt>
              <dd>
                {(ar ? credentials.nameAr : credentials.nameEn) ||
                  credentials.nameEn ||
                  credentials.nameAr}
              </dd>
              <dt>{label("Email", "البريد الإلكتروني")}</dt>
              <dd dir="ltr">{credentials.email.trim().toLowerCase()}</dd>
              <dt>{label("Password", "كلمة المرور")}</dt>
              <dd dir="ltr">
                <code>{credentials.password}</code>
              </dd>
              <dt>{label("User type", "نوع المستخدم")}</dt>
              <dd>
                {credentials.role === "staff"
                  ? label("Staff", "موظف")
                  : label("Member", "عضو")}
              </dd>
              <dt>{label("Sign-in URL", "رابط تسجيل الدخول")}</dt>
              <dd dir="ltr">
                {window.location.origin + window.location.pathname}
              </dd>
            </dl>
            <p>
              {label(
                "Keep these details private. The password is only available here until this card is closed.",
                "احتفظ بهذه البيانات بسرية. تتوفر كلمة المرور هنا فقط حتى إغلاق هذه البطاقة.",
              )}
            </p>
            <div className="modal-actions no-print">
              <button className="primary" onClick={() => window.print()}>
                {label("Print account details", "طباعة بيانات الحساب")}
              </button>
              <button className="soft" onClick={() => setCredentials(null)}>
                {label("Close", "إغلاق")}
              </button>
            </div>
          </section>
        </div>
      )}
      {members
        .filter((m) => true)
        .map((m) => (
          <div className="task-row member-row" key={m.id}>
            <ProfilePhoto
              kind="members"
              id={m.id}
              name={m.name}
              request={request}
              editable={canEdit}
              removable={canDelete}
              ar={ar}
            />
            <strong>
              {m.name}
              <small className="record-id">
                {m.creditBalance || 0} {label("lesson credits", "رصيد حصص")}
              </small>
            </strong>
            <label>
              {label("Role", "الدور")}
              <select
                disabled={!isAdmin}
                aria-label={label("Role for ", "دور ") + m.name}
                value={m.role}
                onChange={(e) =>
                  action(() =>
                    request("/members/" + m.id + "/role", {
                      method: "PUT",
                      body: { role: e.target.value },
                    }),
                  )
                }
              >
                {[
                  ["member", "Member", "عضو"],
                  ["owner", "Staff", "موظف"],
                ].map(([v, en, arabic]) => (
                  <option key={v} value={v}>
                    {ar ? arabic : en}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="soft"
              disabled={!canEdit}
              onClick={() =>
                setForm({
                  mode: "edit",
                  id: m.id,
                  nameEn: m.nameEn ?? m.name,
                  nameAr: m.nameAr || "",
                })
              }
            >
              {label("Edit name", "تعديل الاسم")}
            </button>
            <button
              className="text-button"
              disabled={!canDelete}
              onClick={() => {
                if (
                  window.confirm(
                    label(
                      "Remove this member’s stable access? Financial history is retained.",
                      "إزالة وصول العضو للإسطبل مع الاحتفاظ بالسجل المالي؟",
                    ),
                  )
                )
                  action(() =>
                    request("/members/" + m.id, { method: "DELETE" }),
                  );
              }}
            >
              {label("Remove", "إزالة")}
            </button>
          </div>
        ))}
    </section>
  );
}
