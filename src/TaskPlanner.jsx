import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  ArrowLeft,
  ClipboardList,
} from "lucide-react";
import { taskGroups, plannerRange, inPeriod } from "./taskPlanner";
import { riyadhDay, movePeriod } from "./calendar";
import { CareTasks } from "./CareTasks";
export function TaskPlanner({
  tasks,
  history,
  members,
  ar,
  when,
  toggle,
  busy,
  canComplete,
  stableName,
}) {
  const [selected, setSelected] = useState(null),
    [view, setView] = useState("week"),
    [date, setDate] = useState(riyadhDay(new Date())),
    [assignee, setAssignee] = useState(""),
    [search, setSearch] = useState("");
  const label = (en, arabic) => (ar ? arabic : en);
  const all = tasks.filter(
    (t) =>
      (!assignee || t.assigneeId === assignee) &&
      (!search || t.title.toLowerCase().includes(search.toLowerCase())),
  );
  const groups = taskGroups(all),
    group = groups.find((g) => g.id === selected),
    range = plannerRange(date, view);
  const visible = (group ? group.tasks : all).filter((t) => inPeriod(t, range));
  const actor = (id) => members.find((m) => m.id === id)?.name || "—";
  const open = (group) => {
    setSelected(group.id);
    const next =
      group.tasks.find((t) => !t.done && t.dueAt >= new Date().toISOString()) ||
      group.tasks[0];
    if (next) setDate(riyadhDay(next.dueAt));
  };
  return (
    <section className="task-planner">
      <div className="panel planner-controls no-print">
        {group && (
          <button className="soft" onClick={() => setSelected(null)}>
            <ArrowLeft size={17} />
            {label("All tasks", "كل المهام")}
          </button>
        )}
        <label>
          {label("View", "العرض")}
          <select
            aria-label={label("Planner view", "عرض المخطط")}
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            {[
              ["day", "Daily", "يومي"],
              ["week", "Weekly", "أسبوعي"],
              ["month", "Monthly", "شهري"],
            ].map(([v, en, arabic]) => (
              <option key={v} value={v}>
                {ar ? arabic : en}
              </option>
            ))}
          </select>
        </label>
        <button
          className="soft"
          aria-label={label("Previous planner period", "الفترة السابقة")}
          onClick={() => setDate(movePeriod(date, view, -1))}
        >
          <ChevronLeft size={18} />
        </button>
        <label>
          {label("Date", "التاريخ")}
          <input
            aria-label={label("Planner date", "تاريخ المخطط")}
            lang="en"
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </label>
        <button
          className="soft"
          aria-label={label("Next planner period", "الفترة التالية")}
          onClick={() => setDate(movePeriod(date, view, 1))}
        >
          <ChevronRight size={18} />
        </button>
        <label>
          {label("Assignee", "المسؤول")}
          <select
            aria-label={label("Planner assignee", "مسؤول المخطط")}
            value={assignee}
            onChange={(e) => {
              setAssignee(e.target.value);
              setSelected(null);
            }}
          >
            <option value="">{label("All staff", "كل الموظفين")}</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <button className="primary" onClick={() => window.print()}>
          <Printer size={18} />
          {label("Print planner", "طباعة المخطط")}
        </button>
      </div>
      {!group && (
        <section className="panel staff-workload">
          <h3>{label("Staff work planner", "مخطط عمل الموظفين")}</h3>
          <p>
            {range.start} – {range.end}
          </p>
          <div className="record-grid">
            {members
              .filter(
                (m) =>
                  m.role === "owner" || all.some((t) => t.assigneeId === m.id),
              )
              .map((m) => {
                const assigned = visible.filter((t) => t.assigneeId === m.id),
                  done = assigned.filter((t) => t.done).length,
                  overdue = assigned.filter(
                    (t) => !t.done && t.dueAt < new Date().toISOString(),
                  ).length;
                return (
                  <button
                    key={m.id}
                    className="soft"
                    onClick={() => setAssignee(m.id)}
                  >
                    <strong>{m.name}</strong>
                    <p>
                      {done}/{assigned.length} {label("completed", "مكتملة")} ·{" "}
                      {overdue} {label("overdue", "متأخرة")}
                    </p>
                  </button>
                );
              })}
          </div>
          <CareTasks
            tasks={all}
            period={range}
            history={history}
            members={members}
            ar={ar}
            when={when}
            toggle={toggle}
            busy={busy}
            canComplete={canComplete}
          />
        </section>
      )}
      {!group ? (
        <>
          <p>
            {label(
              "Choose a task or care plan to view its dates and completion. Each card shows only its own progress.",
              "اختر مهمة أو خطة رعاية لعرض مواعيدها وإنجازها. تعرض كل بطاقة نسبة إنجازها فقط.",
            )}
          </p>
          <label className="search no-print">
            {label("Search tasks", "ابحث في المهام")}
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <div className="planner-task-cards">
            {groups.map((g) => (
              <button
                className="panel planner-task-card"
                key={g.id}
                onClick={() => open(g)}
              >
                <ClipboardList size={24} />
                <h3>{g.title}</h3>
                <p>
                  {g.completed}/{g.tasks.length} {label("completed", "مكتملة")}{" "}
                  · {g.percent}%
                </p>
                <progress
                  aria-label={label("Task completion", "إنجاز المهمة")}
                  value={g.completed}
                  max={g.tasks.length}
                />
                <span>
                  {label("View dates & details", "عرض المواعيد والتفاصيل")}
                </span>
              </button>
            ))}
          </div>
          {!groups.length && (
            <p className="empty">
              {label("No tasks yet.", "لا توجد مهام بعد.")}
            </p>
          )}
        </>
      ) : (
        <>
          <h2>{group.title}</h2>
          <p>
            {range.start} – {range.end}
          </p>
          <CareTasks
            tasks={group.tasks}
            period={range}
            history={history}
            members={members}
            ar={ar}
            when={when}
            toggle={toggle}
            busy={busy}
            canComplete={canComplete}
          />
        </>
      )}
      <section className="planner-print-sheet">
        <h1>{stableName}</h1>
        <h2>
          {group?.title || label("Care task planner", "مخطط مهام الرعاية")}
        </h2>
        <p>
          {range.start} – {range.end} · {label("Riyadh time", "توقيت الرياض")}
        </p>
        {group && (
          <p>
            {group.completed}/{group.tasks.length} · {group.percent}%
          </p>
        )}
        <table>
          <thead>
            <tr>
              <th>{label("Date / time", "التاريخ / الوقت")}</th>
              <th>{label("Task", "المهمة")}</th>
              <th>{label("Assignee", "المسؤول")}</th>
              <th>{label("Done", "تم")}</th>
              <th>{label("Completed by / at", "نفذها / وقت التنفيذ")}</th>
            </tr>
          </thead>
          <tbody>
            {visible
              .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
              .map((t) => (
                <tr key={t.id}>
                  <td>{when(t.dueAt)}</td>
                  <td>{t.title}</td>
                  <td>{actor(t.assigneeId)}</td>
                  <td>{t.done ? "✓" : "□"}</td>
                  <td>
                    {t.done
                      ? actor(t.completedBy) + " · " + when(t.completedAt)
                      : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!visible.length && (
          <p>
            {label(
              "No scheduled tasks in this period.",
              "لا توجد مهام مجدولة في هذه الفترة.",
            )}
          </p>
        )}
      </section>
    </section>
  );
}
