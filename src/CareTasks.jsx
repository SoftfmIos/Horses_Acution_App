import React, { useState } from "react";
import { inPeriod, taskCategoryGroups } from "./taskPlanner";
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
  period = null,
}) {
  const [filter, setFilter] = useState(compact ? "pending" : "all"),
    [pending, setPending] = useState({});
  const label = (en, arabic) => (ar ? arabic : en);
  const name = (id) => members.find((m) => m.id === id)?.name || "—";
  const shown = tasks
    .filter(
      (t) =>
        !t.cancelled &&
        (!period || inPeriod(t, period)) &&
        (filter === "all" || (filter === "done" ? t.done : !t.done)),
    )
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const eligible = tasks.filter(
    (t) => !t.cancelled && (!period || inPeriod(t, period)),
  );
  const categories = taskCategoryGroups(eligible);
  const categoryName = (id) =>
    ({
      feeding: label("Feeding", "التغذية"),
      medical: label("Medical", "الرعاية الطبية"),
      other: label("Other tasks", "مهام أخرى"),
    })[id];
  const completed = eligible.filter((task) => task.done).length;
  const percent = eligible.length
    ? Math.round((completed / eligible.length) * 100)
    : 0;
  const table = (
    <>
      <div className="care-progress">
        <strong>
          {label("Completion", "نسبة الإنجاز")}: {completed}/{eligible.length} (
          {percent}%)
        </strong>
        <progress
          aria-label={label("Completion rate", "نسبة الإنجاز")}
          value={completed}
          max={eligible.length || 1}
        />
      </div>
      <div className="care-toolbar">
        <strong>
          {eligible.length} {label("scheduled tasks", "مهام مجدولة")}
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
      {categories.map((group) => {
        const ids = new Set(group.tasks.map((t) => t.id));
        const groupShown = shown.filter((t) => ids.has(t.id));
        if (!groupShown.length) return null;
        return (
          <details
            className={"task-checklist-group category-" + group.id}
            key={group.id}
            open
          >
            <summary>
              <strong>{categoryName(group.id)}</strong> · {group.done}/
              {group.total} · {group.percent}%
            </summary>
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
                  {groupShown.map((task) => (
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
                          ? name(task.completedBy) +
                            " · " +
                            when(task.completedAt)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        );
      })}
      {!shown.filter((t) => !t.cancelled).length && (
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
        {eligible.length})
      </summary>
      {table}
    </details>
  ) : (
    <section className="panel care-ledger">{table}</section>
  );
}
