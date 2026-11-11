import React, { useState } from "react";
const dayKey = (value) =>
  new Date(new Date(value).getTime() + 3 * 3600000).toISOString().slice(0, 10);
export function Schedule({ classes, horses, onSelect, ar }) {
  const [view, setView] = useState("week"),
    [anchor, setAnchor] = useState(dayKey(new Date())),
    [horse, setHorse] = useState(""),
    [arena, setArena] = useState("");
  const date = new Date(anchor + "T00:00:00+03:00");
  const start = new Date(date);
  if (view === "week")
    start.setUTCDate(
      start.getUTCDate() - new Date(anchor + "T12:00:00Z").getUTCDay(),
    );
  if (view === "month") {
    start.setUTCDate(start.getUTCDate() - (Number(anchor.slice(8)) - 1));
    start.setUTCDate(
      start.getUTCDate() - new Date(dayKey(start) + "T12:00:00Z").getUTCDay(),
    );
  }
  const count = view === "day" ? 1 : view === "week" ? 7 : 42;
  const days = Array.from(
    { length: count },
    (_, i) => new Date(start.getTime() + i * 86400000),
  );
  const filtered = classes.filter(
    (c) =>
      (!horse || c.horseIds.includes(horse)) && (!arena || c.arena === arena),
  );
  function move(direction) {
    const next = new Date(date);
    if (view === "month") {
      next.setUTCDate(next.getUTCDate() - (Number(anchor.slice(8)) - 1));
      next.setUTCMonth(next.getUTCMonth() + direction);
    } else
      next.setUTCDate(
        next.getUTCDate() + direction * (view === "week" ? 7 : 1),
      );
    setAnchor(dayKey(next));
  }
  return (
    <section
      className="panel schedule"
      aria-label={ar ? "تقويم الحجز" : "Booking calendar"}
    >
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
            ].map(([v, en, arabic]) => (
              <option key={v} value={v}>
                {ar ? arabic : en}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => move(-1)}
          aria-label={ar ? "السابق" : "Previous period"}
        >
          ‹
        </button>
        <label>
          {ar ? "التاريخ" : "Date"}
          <input
            type="date"
            value={anchor}
            onChange={(e) => e.target.value && setAnchor(e.target.value)}
          />
        </label>
        <button
          onClick={() => move(1)}
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
      <div className={"calendar-grid calendar-" + view}>
        {days.map((d) => (
          <div className="calendar-day" key={dayKey(d)}>
            <strong>
              {d.toLocaleDateString(ar ? "ar-SA" : "en-GB", {
                timeZone: "Asia/Riyadh",
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </strong>
            {filtered
              .filter((c) => dayKey(c.startsAt) === dayKey(d))
              .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
              .map((c) => (
                <button
                  className="calendar-event"
                  key={c.id}
                  onClick={() => onSelect(c)}
                >
                  <b>{c.title}</b>
                  <span>
                    {new Date(c.startsAt).toLocaleTimeString(
                      ar ? "ar-SA" : "en-GB",
                      {
                        timeZone: "Asia/Riyadh",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}{" "}
                    · {c.instructor}
                  </span>
                  <span>
                    {c.arena} · {c.places} {ar ? "مقاعد" : "places"}
                  </span>
                </button>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
export function MemberTools({ members, request, action, ar }) {
  const [form, setForm] = useState(null);
  const label = (en, arabic) => (ar ? arabic : en);
  return (
    <section className="panel">
      <button
        className="primary"
        onClick={() => setForm({ name: "", email: "", password: "" })}
      >
        {label("Create member", "إنشاء عضو")}
      </button>
      {form && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (
              await action(() =>
                request("/members" + (form.id ? "/" + form.id : ""), {
                  method: form.id ? "PUT" : "POST",
                  body: form,
                }),
              )
            )
              setForm(null);
          }}
        >
          <label>
            {label("Name", "الاسم")}
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          {!form.id && (
            <>
              <label>
                {label("Email", "البريد الإلكتروني")}
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                {label(
                  "Temporary password (12+ characters)",
                  "كلمة مرور مؤقتة (12 حرفاً على الأقل)",
                )}
                <input
                  required
                  type="password"
                  minLength={12}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </label>
            </>
          )}
          <button className="primary">{label("Save", "حفظ")}</button>
          <button type="button" onClick={() => setForm(null)}>
            {label("Cancel", "إلغاء")}
          </button>
        </form>
      )}
      {members
        .filter((m) => m.role !== "owner")
        .map((m) => (
          <div className="task-row" key={m.id}>
            <span>{m.name}</span>
            <label>
              {label("Role", "الدور")}
              <select
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
                  ["instructor", "Instructor", "مدرب"],
                  ["vet", "Vet", "طبيب بيطري"],
                  ["caregiver", "Caregiver", "مسؤول رعاية"],
                ].map(([v, en, arabic]) => (
                  <option key={v} value={v}>
                    {ar ? arabic : en}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => setForm({ id: m.id, name: m.name })}>
              {label("Edit name", "تعديل الاسم")}
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    label(
                      "Remove this member’s academy access? Financial history is retained.",
                      "إزالة وصول العضو إلى الأكاديمية مع حفظ السجل المالي؟",
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
