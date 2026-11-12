import React from "react";
import { taskCategoryGroups, inPeriod } from "./taskPlanner";
import { riyadhDay } from "./calendar";
export function TaskHandout({
  tasks,
  range,
  members,
  ar,
  when,
  stableName,
  title,
  daily = false,
}) {
  const l = (en, a) => (ar ? a : en),
    name = (id) => members.find((m) => m.id === id)?.name || "—";
  const visible = tasks.filter((t) => !t.cancelled && inPeriod(t, range));
  const days = [...new Set(visible.map((t) => riyadhDay(t.dueAt)))].sort();
  const label = (id) =>
    ({
      feeding: l("Feeding", "التغذية"),
      medical: l("Medical", "الرعاية الطبية"),
      other: l("Other tasks", "مهام أخرى"),
    })[id];
  return (
    <section
      className="planner-print-sheet task-handout"
      aria-label={l("Task follow-up handout", "نموذج متابعة المهام")}
    >
      <div className="print-document-heading">
        <img src="/logos/riyadh-polo-club-academy.png" alt="" />
        <div>
          <h1>{stableName}</h1>
          <h2>
            {daily
              ? l(
                  "Daily task follow-up & signatures",
                  "المتابعة اليومية للمهام والتوقيعات",
                )
              : l("Task follow-up & signatures", "متابعة المهام والتوقيعات")}
          </h2>
          {title && <p>{title}</p>}
          <p>
            {range.start} – {range.end} · {l("Riyadh time", "توقيت الرياض")}
          </p>
        </div>
      </div>
      <p className="handout-identity">
        {l("Staff name", "اسم الموظف")}: ____________________ ·{" "}
        {l("Supervisor", "المشرف")}: ____________________
      </p>
      <p>
        {l(
          "Sign beside each task after performing it. Paper signatures do not automatically change the digital completion record.",
          "وقّع أمام كل مهمة بعد تنفيذها. التوقيع الورقي لا يغيّر حالة الإنجاز الإلكترونية تلقائياً.",
        )}
      </p>
      {days.map((date) => (
        <section className="handout-day" key={date}>
          <h3>{date}</h3>
          {taskCategoryGroups(
            visible.filter((t) => riyadhDay(t.dueAt) === date),
          ).map((group) => (
            <section key={group.id}>
              <h4>
                {label(group.id)} · {group.done}/{group.total} · {group.percent}
                %
              </h4>
              <table>
                <thead>
                  <tr>
                    <th>{l("Scheduled", "الموعد")}</th>
                    <th>{l("Task / instructions", "المهمة / التعليمات")}</th>
                    <th>{l("Assigned to", "المسؤول")}</th>
                    <th>{l("Done", "تم")}</th>
                    <th>{l("Recorded completion", "الإنجاز المسجل")}</th>
                    <th>
                      {l("Actual time & signature", "وقت التنفيذ والتوقيع")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.tasks.map((t) => (
                    <tr key={t.id}>
                      <td>{when(t.dueAt)}</td>
                      <td>
                        <strong>{t.title}</strong>
                        {t.notes && <p>{t.notes}</p>}
                      </td>
                      <td>{name(t.assigneeId)}</td>
                      <td>{t.done ? "✓" : "□"}</td>
                      <td>
                        {t.done
                          ? name(t.completedBy) + " · " + when(t.completedAt)
                          : "—"}
                      </td>
                      <td className="signature-cell">
                        <span>{l("Time", "الوقت")}: __________</span>
                        <span>
                          {l("Signature", "التوقيع")}: __________________
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </section>
      ))}
      {!visible.length && (
        <p>
          {l(
            "No scheduled tasks in this period.",
            "لا توجد مهام مجدولة في هذه الفترة.",
          )}
        </p>
      )}
      <p className="handout-supervisor">
        {l("Supervisor review / signature", "مراجعة المشرف / التوقيع")}:
        ____________________ · {l("Date", "التاريخ")}: ______________
      </p>
    </section>
  );
}
