import React, { useState } from "react";
import {
  CalendarDays,
  BookOpen,
  ArrowRight,
  Clock,
  MapPin,
  GraduationCap,
} from "lucide-react";
export function ClientHome({
  data,
  user,
  ar,
  t,
  go,
  when,
  money,
  cancel,
  busy,
}) {
  const [history, setHistory] = useState(false);
  const label = (en, arabic) => (ar ? arabic : en);
  const bookings = data.bookings
    .map((b) => ({
      ...b,
      session: data.classes.find((c) => c.id === b.class_id),
    }))
    .filter((b) => b.session)
    .sort((a, b) => a.session.startsAt.localeCompare(b.session.startsAt));
  const upcoming = bookings.filter(
    (b) =>
      ["confirmed", "pending_payment"].includes(b.status) &&
      b.session.endsAt > new Date().toISOString(),
  );
  const shown = history ? bookings : upcoming;
  return (
    <>
      <section className="client-welcome">
        <div>
          <span className="eyebrow">
            {label("YOUR RIDING JOURNEY", "رحلتك مع الفروسية")}
          </span>
          <h2>
            {label("Welcome, ", "مرحباً، ")}
            {user.name}
          </h2>
          <p>
            {label(
              "Your lessons, bookings and next ride. All in one place.",
              "حصصك وحجوزاتك وركوبك القادم في مكان واحد.",
            )}
          </p>
        </div>
        <button className="primary" onClick={() => go("classes")}>
          {label("Book a class", "احجز حصة")}
          <ArrowRight size={18} />
        </button>
      </section>
      <div className="client-summary">
        <button className="panel" onClick={() => go("accountBalance")}>
          <BookOpen />
          <strong>{data.creditBalance || 0}</strong>
          <span>{t.sessionBalance}</span>
        </button>
        <div className="panel">
          <CalendarDays />
          <strong>{upcoming.length}</strong>
          <span>{t.upcoming}</span>
        </div>
      </div>
      <div className="section-heading">
        <h2>{history ? t.myBookings : t.upcoming}</h2>
        <button className="text-button" onClick={() => setHistory(!history)}>
          {history
            ? label("Upcoming only", "القادمة فقط")
            : label("All bookings", "جميع الحجوزات")}
        </button>
      </div>
      {!shown.length && (
        <section className="panel client-empty">
          <CalendarDays size={36} />
          <h3>{label("Your next ride starts here", "حجزك القادم يبدأ هنا")}</h3>
          <p>
            {label(
              "Choose a class and reserve your place.",
              "اختر حصة واحجز مقعدك.",
            )}
          </p>
          <button className="primary" onClick={() => go("classes")}>
            {label("Browse classes", "استعرض الحصص")}
          </button>
        </section>
      )}
      <div className="client-bookings">
        {shown.map((b) => (
          <article className="panel client-booking" key={b.id}>
            <div className="section-heading">
              <span
                className={
                  "pill " + (b.status === "pending_payment" ? "warning" : "")
                }
              >
                {t[b.status] || b.status}
              </span>
              <CalendarDays size={20} />
            </div>
            <h3>{b.session.title}</h3>
            <p>
              <Clock size={16} />
              {when(b.session.startsAt)}
            </p>
            <p>
              <GraduationCap size={16} />
              {b.session.instructor}
            </p>
            <p>
              <MapPin size={16} />
              {b.session.arena}
            </p>
            {b.status === "pending_payment" && (
              <p className="notice">
                {label(
                  "Your place is reserved. The academy will activate it after recording your payment.",
                  "مقعدك محجوز. ستفعّل الأكاديمية حجزك بعد تسجيل الدفع.",
                )}
              </p>
            )}
            {["confirmed", "pending_payment"].includes(b.status) &&
              b.session.startsAt > new Date().toISOString() && (
                <button
                  className="soft"
                  disabled={busy}
                  onClick={() => cancel(b.id)}
                >
                  {t.cancelBooking}
                </button>
              )}
          </article>
        ))}
      </div>
      <section className="panel client-account-links">
        <h3>{label("Your account", "حسابك")}</h3>
        <button onClick={() => go("pricing")}>
          {t.pricing}
          <ArrowRight size={17} />
        </button>
        <button onClick={() => go("billing")}>
          {t.billing}
          <span>
            {money(
              data.proformas
                .filter((p) => p.status === "open")
                .reduce((n, p) => n + p.due - p.paid, 0),
            )}
          </span>
        </button>
        <button onClick={() => go("notifications")}>
          {t.notifications}
          <ArrowRight size={17} />
        </button>
      </section>
    </>
  );
}
