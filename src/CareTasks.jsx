import React, { useState } from "react";
export function CareTasks({
  tasks,
  history = [],
  members,
  ar,
  when,
  toggle,
  busy,
  compact = false,
  canComplete = () => true,
}) {
  const [filter, setFilter] = useState("pending"),
    [pending, setPending] = useState({});
  const label = (en, arabic) => (ar ? arabic : en);
  const name = (id) => members.find((m) => m.id === id)?.name || "—";
  const shown = tasks
    .filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const completed = tasks.filter((task) => task.done).length;
  const percent = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const table = (
    <>
      <div className="care-progress">
        <strong>
          {label("Completion", "نسبة الإنجاز")}: {completed}/{tasks.length} (
          {percent}%)
        </strong>
        <progress
          aria-label={label("Completion rate", "نسبة الإنجاز")}
          value={completed}
          max={tasks.length || 1}
        />
      </div>
      <div className="care-toolbar">
        <strong>
          {tasks.length} {label("scheduled tasks", "مهام مجدولة")}
        </strong>
        <label>
          {label("Show", "عرض")}
          <select
            aria-label={label("Task status", "حالة المهام")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">{label("Pending", "قيد التنفيذ")}</option>
            <option value="done">{label("Completed", "مكتملة")}</option>
            <option value="all">{label("All", "الكل")}</option>
          </select>
        </label>
      </div>
      <div className="table-wrap">
        <table className="care-table">
          <thead>
            <tr>
              <th>{label("Done", "تم")}</th>
              <th>{label("Task / dose", "المهمة / الجرعة")}</th>
              <th>{label("Scheduled time", "الموعد المجدول")}</th>
              <th>{label("Assigned to", "المسؤول")}</th>
              <th>{label("Completed by / at", "نفذها / وقت التنفيذ")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((task) => (
              <tr key={task.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={pending[task.id] ?? Boolean(task.done)}
                    aria-label={
                      label("Complete ", "إتمام ") +
                      task.title +
                      " " +
                      when(task.dueAt)
                    }
                    disabled={busy || !canComplete(task)}
                    onChange={(e) => {
                      const done = e.target.checked;
                      setPending((p) => ({ ...p, [task.id]: done }));
                      Promise.resolve(toggle(task, done)).finally(() =>
                        setPending((p) => {
                          const next = { ...p };
                          delete next[task.id];
                          return next;
                        }),
                      );
                    }}
                  />
                </td>
                <td>
                  {task.title}
                  {task.medication && (
                    <small className="record-id">
                      {task.medication} · {task.dose}
                    </small>
                  )}
                </td>
                <td>{when(task.dueAt)}</td>
                <td>{name(task.assigneeId)}</td>
                <td>
                  {task.done
                    ? name(task.completedBy) + " · " + when(task.completedAt)
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!shown.length && (
        <p className="empty">
          {label("No tasks in this view.", "لا توجد مهام في هذا العرض.")}
        </p>
      )}
      <details>
        <summary>{label("Completion history", "سجل التنفيذ")}</summary>
        {history
          .filter((e) => tasks.some((t) => t.id === e.task_id))
          .map((e) => (
            <p key={e.id}>
              {name(e.actor_id)} ·{" "}
              {e.action === "completed"
                ? label("Completed", "تم التنفيذ")
                : label("Reopened", "أعيد فتحها")}{" "}
              · {when(e.created_at)}
            </p>
          ))}
      </details>
    </>
  );
  return compact ? (
    <details className="care-ledger">
      <summary>
        {label("Treatment / feeding schedule", "جدول العلاج / التغذية")} (
        {tasks.length})
      </summary>
      {table}
    </details>
  ) : (
    <section className="panel care-ledger">{table}</section>
  );
}
