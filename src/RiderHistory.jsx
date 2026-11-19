import React, { useState } from "react";
import { feedbackFields, LessonFeedback } from "./AcademyUpdates";

export function RiderHistory({
  data,
  ar,
  t,
  when,
  stableName,
  canEdit,
  busy,
  save,
}) {
  const [riderId, setRiderId] = useState("");
  const tr = (en, arabic) => (ar ? arabic : en);
  const rider = data.members.find((member) => member.id === riderId);
  const sessions = new Map(
    data.classes.map((session) => [session.id, session]),
  );
  const attendance = new Map(
    data.attendance.map((row) => [row.reservation_id, row.status]),
  );
  const feedback = new Map(
    (data.lessonFeedback || []).map((row) => [row.reservation_id, row]),
  );
  const horses = new Map(data.horses.map((horse) => [horse.id, horse.name]));
  const cutoff = Date.now();
  const rides = rider
    ? data.bookings
        .filter((booking) => booking.member_id === rider.id)
        .map((booking) => ({
          booking,
          session: sessions.get(booking.class_id),
          attendance: attendance.get(booking.id),
          feedback: feedback.get(booking.id),
        }))
        .filter(
          ({ session }) => !session || Date.parse(session.endsAt) <= cutoff,
        )
        .sort((a, b) =>
          (b.session?.startsAt || b.booking.created_at).localeCompare(
            a.session?.startsAt || a.booking.created_at,
          ),
        )
    : [];
  const attendanceLabels = {
    present: tr("Present", "حاضر"),
    absent: tr("Absent", "غائب"),
    excused: tr("Excused", "بعذر"),
  };

  return (
    <section className="rider-history">
      <div className="panel rider-history-controls no-print">
        <label>
          {tr("Select a rider", "اختر فارساً")}
          <select
            value={rider?.id || ""}
            onChange={(event) => setRiderId(event.target.value)}
          >
            <option value="">{t.select}</option>
            {[...data.members]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
          </select>
        </label>
        <button
          type="button"
          className="primary"
          disabled={!rides.length}
          onClick={() => window.print()}
        >
          {tr("Print rider history", "طباعة سجل الفارس")}
        </button>
      </div>
      {data.backendVersion && !data.riderHistoryVersion && (
        <p className="notice no-print">
          {tr(
            "Update the backend to record marks.",
            "حدّث الخادم لتسجيل الدرجات.",
          )}
        </p>
      )}
      {rider && (
        <div className="rider-history-report">
          <div className="print-document-heading">
            <img src="/logos/riyadh-polo-club-academy.png" alt="" />
            <div>
              <h2>{rider.name}</h2>
              <p>
                {stableName} · {t.riderHistory}
              </p>
            </div>
          </div>
          {rides.length === 0 && (
            <p>
              {tr(
                "No past rides for this rider.",
                "لا توجد حصص سابقة لهذا الفارس.",
              )}
            </p>
          )}
          {rides.length > 0 && (
            <p className="notice">
              {Object.entries(attendanceLabels).map(([status, label]) => (
                <span key={status}>
                  {label}{" "}
                  {rides.filter((ride) => ride.attendance === status).length}{" "}
                  ·{" "}
                </span>
              ))}
              {tr("Past bookings", "الحجوزات السابقة")} {rides.length}
            </p>
          )}
          {rides.map(({ booking, session, attendance, feedback }) => (
            <article className="panel rider-history-ride" key={booking.id}>
              <h3>
                {session?.title || tr("Unavailable session", "موعد غير متاح")}
              </h3>
              <p>
                {session
                  ? when(session.startsAt)
                  : tr("Booked", "وقت الحجز") + " " + when(booking.created_at)}
                {session?.instructor && " · " + session.instructor}
                {horses.has(booking.horse_id) &&
                  " · " + horses.get(booking.horse_id)}
              </p>
              <dl>
                <dt>{t.status}</dt>
                <dd>{t[booking.status] || booking.status}</dd>
                <dt>{tr("Attendance", "الحضور")}</dt>
                <dd>
                  {attendanceLabels[attendance] || tr("Unrecorded", "غير مسجل")}
                </dd>
                <dt>{tr("Mark", "الدرجة")}</dt>
                <dd>{feedback?.mark != null ? feedback.mark + "/100" : "—"}</dd>
                {feedbackFields(ar)
                  .slice(0, 3)
                  .filter(([, column]) => feedback?.[column])
                  .map(([, column, label]) => (
                    <React.Fragment key={column}>
                      <dt>{label}</dt>
                      <dd>{feedback[column]}</dd>
                    </React.Fragment>
                  ))}
              </dl>
              {feedback?.staff_notes && (
                <p className="no-print">
                  <strong>
                    {tr("Private staff notes", "ملاحظات خاصة بالموظفين")}
                  </strong>{" "}
                  {feedback.staff_notes}
                </p>
              )}
              {canEdit && session && booking.status === "confirmed" && (
                <div className="no-print">
                  <LessonFeedback
                    marksEnabled={data.riderHistoryVersion === 1}
                    record={feedback}
                    ar={ar}
                    busy={busy}
                    save={(body) => save(booking.id, body)}
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
