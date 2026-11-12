import React, { useState } from "react";
import { riyadhDay } from "./calendar";
export function TaskCalendar({
  tasks,
  range,
  view,
  ar,
  members,
  when,
  toggle,
  busy,
  canComplete,
}) {
  const [pending, setPending] = useState({});
  const [status, setStatus] = useState("all"),
    l = (en, a) => (ar ? a : en);
  const dates = [];
  for (
    let date = range.start;
    date <= range.end;
    date = new Date(Date.parse(date + "T12:00:00Z") + 86400000)
      .toISOString()
      .slice(0, 10)
  )
    dates.push(date);
  const rows = tasks.filter(
    (t) =>
      !t.cancelled &&
      (status === "all" || (status === "done" ? t.done : !t.done)),
  );
  const name = (id) => members.find((m) => m.id === id)?.name || "—";
  return (
    <section
      className="task-calendar"
      aria-label={l("Care task calendar", "تقويم مهام الرعاية")}
    >
      <label className="task-calendar-filter">
        {l("Show tasks", "عرض المهام")}
        <select
          aria-label={l("Calendar task status", "حالة مهام التقويم")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">{l("All", "الكل")}</option>
          <option value="pending">{l("Pending", "معلق")}</option>
          <option value="done">{l("Completed", "مكتمل")}</option>
        </select>
      </label>
      <div className={"task-calendar-grid task-calendar-view-" + view}>
        {view === "month" &&
          Array.from(
            { length: new Date(range.start + "T12:00:00Z").getUTCDay() },
            (_, i) => <div className="task-calendar-padding" key={"pad" + i} />,
          )}
        {dates.map((date) => {
          const daily = rows
            .filter((t) => riyadhDay(t.dueAt) === date)
            .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
          return (
            <section
              className={
                "task-calendar-day" +
                (date === riyadhDay(new Date()) ? " today" : "")
              }
              key={date}
            >
              <h4>
                {new Date(date + "T12:00:00Z").toLocaleDateString(
                  ar ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB",
                  { weekday: "short", day: "numeric", month: "short" },
                )}
              </h4>
              <small>
                {daily.filter((t) => t.done).length}/{daily.length}{" "}
                {l("done", "منجز")} ·{" "}
                {daily.length
                  ? Math.round(
                      (daily.filter((t) => t.done).length / daily.length) * 100,
                    )
                  : 0}
                %
              </small>
              <div className="task-calendar-items">
                {daily.map((task) => (
                  <article
                    className={
                      "task-occurrence" +
                      (task.done
                        ? " done"
                        : task.dueAt < new Date().toISOString()
                          ? " overdue"
                          : "")
                    }
                    key={task.id}
                  >
                    <label>
                      <input
                        type="checkbox"
                        aria-label={
                          l("Complete ", "إتمام ") +
                          task.title +
                          " " +
                          when(task.dueAt)
                        }
                        checked={pending[task.id] ?? Boolean(task.done)}
                        disabled={busy || !canComplete(task)}
                        onChange={async (e) => {
                          const done = e.target.checked;
                          setPending((p) => ({ ...p, [task.id]: done }));
                          try {
                            await toggle(task, done);
                          } finally {
                            setPending((p) => {
                              const next = { ...p };
                              delete next[task.id];
                              return next;
                            });
                          }
                        }}
                      />
                      <span>
                        <time>
                          {new Date(task.dueAt).toLocaleTimeString(
                            ar ? "ar-SA-u-nu-latn" : "en-GB",
                            {
                              timeZone: "Asia/Riyadh",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            },
                          )}
                        </time>
                        <strong>{task.title}</strong>
                      </span>
                    </label>
                    <small>{name(task.assigneeId)}</small>
                    {task.done && (
                      <p className="completion-stamp">
                        ✓ {name(task.completedBy)} · {when(task.completedAt)}
                      </p>
                    )}
                    {task.notes && (
                      <details>
                        <summary>{l("Instructions", "التعليمات")}</summary>
                        <p>{task.notes}</p>
                      </details>
                    )}
                  </article>
                ))}
                {!daily.length && (
                  <p className="empty">{l("No tasks", "لا مهام")}</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
