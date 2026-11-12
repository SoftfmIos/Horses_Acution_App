import React, { useState } from "react";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { bookingPlannerRows, instructorKey } from "./bookingPlanner";
import { plannerRange } from "./taskPlanner";
import { riyadhDay, movePeriod } from "./calendar";
import { localizedName } from "./localization";
export function BookingPlanner({ data, ar, staff, stableName, when }) {
  const [view, setView] = useState("week"),
    [date, setDate] = useState(riyadhDay(new Date())),
    [memberId, setMemberId] = useState(""),
    [instructor, setInstructor] = useState(""),
    [status, setStatus] = useState("active");
  const l = (en, a) => (ar ? a : en),
    range = plannerRange(date, view),
    rows = bookingPlannerRows({
      bookings: data.bookings,
      classes: data.classes,
      memberId: staff ? memberId : "",
      instructor,
      status,
      date,
      view,
    });
  const member = (id) =>
      localizedName(data.members.find((m) => m.id === id) || {}, ar) || "—",
    horse = (id) =>
      localizedName(data.horses.find((h) => h.id === id) || {}, ar) || "—";
  const teachers = [
    ...new Map(
      data.classes.map((c) => [
        instructorKey(c),
        localizedName(c, ar, "instructor"),
      ]),
    ).entries(),
  ].filter(([id]) => id);
  const names = {
    confirmed: l("Confirmed", "مؤكد"),
    pending_payment: l("Awaiting payment", "بانتظار السداد"),
    cancelled: l("Cancelled", "ملغى"),
    expired: l("Expired", "منتهي"),
  };
  const dates = [];
  for (
    let day = range.start;
    day <= range.end;
    day = new Date(Date.parse(day + "T12:00:00Z") + 86400000)
      .toISOString()
      .slice(0, 10)
  )
    dates.push(day);
  const title = staff
    ? l(
        "Member & instructor booking calendar",
        "تقويم حجوزات الأعضاء والمدربين",
      )
    : l("My booking calendar", "تقويم حجوزاتي");
  return (
    <details className="panel booking-planner">
      <summary>
        {title} · {l("View & print", "عرض وطباعة")}
      </summary>
      <div className="booking-planner-controls no-print">
        <label>
          {l("View", "العرض")}
          <select
            aria-label={l("Booking planner view", "عرض مخطط الحجوزات")}
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            {[
              ["day", "Daily", "يومي"],
              ["week", "Weekly", "أسبوعي"],
              ["month", "Monthly", "شهري"],
            ].map(([v, en, a]) => (
              <option key={v} value={v}>
                {l(en, a)}
              </option>
            ))}
          </select>
        </label>
        <button
          className="soft"
          aria-label={l("Previous booking period", "فترة الحجوزات السابقة")}
          onClick={() => setDate(movePeriod(date, view, -1))}
        >
          <ChevronLeft size={18} />
        </button>
        <label>
          {l("Date", "التاريخ")}
          <input
            aria-label={l("Booking planner date", "تاريخ مخطط الحجوزات")}
            type="date"
            lang="en"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </label>
        <button
          className="soft"
          aria-label={l("Next booking period", "فترة الحجوزات التالية")}
          onClick={() => setDate(movePeriod(date, view, 1))}
        >
          <ChevronRight size={18} />
        </button>
        {staff && (
          <label>
            {l("Member", "العضو")}
            <select
              aria-label={l("Booking planner member", "عضو مخطط الحجوزات")}
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">{l("All members", "كل الأعضاء")}</option>
              {data.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {localizedName(m, ar)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          {l("Instructor", "المدرب")}
          <select
            aria-label={l("Booking planner instructor", "مدرب مخطط الحجوزات")}
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          >
            <option value="">{l("All instructors", "كل المدربين")}</option>
            {teachers.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {l("Status", "الحالة")}
          <select
            aria-label={l("Booking planner status", "حالة مخطط الحجوزات")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">
              {l("Active bookings", "الحجوزات الفعالة")}
            </option>
            <option value="all">{l("All statuses", "كل الحالات")}</option>
            {Object.entries(names).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="soft"
          onClick={() => {
            const next = data.bookings
              .map((b) => ({
                ...b,
                session: data.classes.find((c) => c.id === b.class_id),
              }))
              .filter(
                (b) =>
                  b.session &&
                  b.session.startsAt >= new Date().toISOString() &&
                  (!memberId || b.member_id === memberId) &&
                  (!instructor || instructorKey(b.session) === instructor) &&
                  ["confirmed", "pending_payment"].includes(b.status),
              )
              .sort((a, b) =>
                a.session.startsAt.localeCompare(b.session.startsAt),
              )[0];
            if (next) setDate(riyadhDay(next.session.startsAt));
          }}
        >
          {l("Next booked session", "الحصة المحجوزة التالية")}
        </button>
        <button className="primary" onClick={() => window.print()}>
          <Printer size={18} />
          {l("Print booking calendar", "طباعة تقويم الحجوزات")}
        </button>
      </div>
      <section
        className="booking-print-sheet"
        aria-label={l("Printable booking calendar", "تقويم الحجوزات للطباعة")}
      >
        <div className="print-document-heading">
          <img src="/logos/riyadh-polo-club-academy.png" alt="" />
          <div>
            <h2>{stableName}</h2>
            <h3>
              {title} ·{" "}
              {
                {
                  day: l("Daily", "يومي"),
                  week: l("Weekly", "أسبوعي"),
                  month: l("Monthly", "شهري"),
                }[view]
              }
            </h3>
            <p>
              {range.start} – {range.end} · {l("Riyadh time", "توقيت الرياض")}
            </p>
            <p>
              {staff
                ? memberId
                  ? member(memberId)
                  : l("All members", "كل الأعضاء")
                : l("My bookings only", "حجوزاتي فقط")}{" "}
              ·{" "}
              {instructor
                ? teachers.find(([id]) => id === instructor)?.[1]
                : l("All instructors", "كل المدربين")}{" "}
              ·{" "}
              {status === "active"
                ? l("Active bookings", "الحجوزات الفعالة")
                : status === "all"
                  ? l("All statuses", "كل الحالات")
                  : names[status]}{" "}
              · {rows.length} {l("bookings", "حجوزات")}
            </p>
          </div>
        </div>
        <div className={"booking-planner-grid booking-view-" + view}>
          {view === "month" &&
            Array.from(
              { length: new Date(range.start + "T12:00:00Z").getUTCDay() },
              (_, i) => <div className="booking-padding" key={"pad" + i} />,
            )}
          {dates.map((day) => (
            <section className="booking-planner-day" data-date={day} key={day}>
              <h4>
                {new Date(day + "T12:00:00Z").toLocaleDateString(
                  ar ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB",
                  { weekday: "short", month: "short", day: "numeric" },
                )}
              </h4>
              {rows
                .filter((b) => riyadhDay(b.session.startsAt) === day)
                .map((b) => (
                  <article
                    className={
                      "booking-planner-entry booking-status-" + b.status
                    }
                    key={b.id}
                  >
                    <strong>
                      {new Date(b.session.startsAt).toLocaleTimeString(
                        ar ? "ar-SA-u-nu-latn" : "en-GB",
                        {
                          timeZone: "Asia/Riyadh",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )}{" "}
                      –{" "}
                      {new Date(b.session.endsAt).toLocaleTimeString(
                        ar ? "ar-SA-u-nu-latn" : "en-GB",
                        {
                          timeZone: "Asia/Riyadh",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )}
                    </strong>
                    <b>{localizedName(b.session, ar, "title")}</b>
                    <span>{member(b.member_id)}</span>
                    <span>{localizedName(b.session, ar, "instructor")}</span>
                    <span>
                      {horse(b.horse_id)} ·{" "}
                      {localizedName(b.session, ar, "arena")}
                    </span>
                    <small>
                      {names[b.status] || b.status} · {b.id.slice(0, 8)}
                    </small>
                  </article>
                ))}
            </section>
          ))}
        </div>
        {!rows.length && (
          <p>
            {l(
              "No bookings match these filters and dates.",
              "لا توجد حجوزات تطابق هذه الفلاتر والتواريخ.",
            )}
          </p>
        )}
      </section>
    </details>
  );
}
