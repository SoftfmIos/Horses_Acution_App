import { flushSync } from "react-dom";
import { TaskHandout } from "./TaskHandout";
import { TaskCalendar } from "./TaskCalendar";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  ArrowLeft,
  ClipboardList,
} from "lucide-react";
import {
  taskGroups,
  plannerRange,
  inPeriod,
  completionSummary,
} from "./taskPlanner";
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
  initialGroup = null,
}) {
  const [selected, setSelected] = useState(initialGroup),
    [view, setView] = useState("week"),
    [layout, setLayout] = useState("calendar"),
    [printDaily, setPrintDaily] = useState(false),
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
          {label("Layout", "التنسيق")}
          <select
            aria-label={label("Task layout", "تنسيق المهام")}
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            <option value="calendar">{label("Calendar", "تقويم")}</option>
            <option value="list">{label("Checklist", "قائمة تحقق")}</option>
          </select>
        </label>
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
        <button
          className="primary"
          onClick={() => {
            flushSync(() => setPrintDaily(false));
            window.print();
          }}
        >
          <Printer size={18} />
          {label("Print planner", "طباعة المخطط")}
        </button>
        <button
          className="soft"
          onClick={() => {
            flushSync(() => setPrintDaily(true));
            window.print();
          }}
        >
          <Printer size={18} />
          {label("Print daily handout", "طباعة نموذج المتابعة اليومية")}
        </button>
      </div>
      <div className="period-completion record-grid">
        {[
          ["day", "Daily completion", "إنجاز اليوم"],
          ["week", "Weekly completion", "إنجاز الأسبوع"],
          ["month", "Monthly completion", "إنجاز الشهر"],
        ].map(([mode, en, a]) => {
          const s = completionSummary(
            group ? group.tasks : all,
            plannerRange(date, mode),
          );
          return (
            <div className="panel" key={mode}>
              <strong>{label(en, a)}</strong>
              <p>
                {s.done}/{s.total} · {s.percent}%
              </p>
              <progress value={s.done} max={s.total || 1} />
            </div>
          );
        })}
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
          {layout === "calendar" ? (
            <TaskCalendar
              tasks={all}
              range={range}
              view={view}
              ar={ar}
              members={members}
              when={when}
              toggle={toggle}
              busy={busy}
              canComplete={canComplete}
            />
          ) : (
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
          )}
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
          <p>
            {group.completed}/{group.tasks.length} · {group.percent}%
          </p>
          {layout === "calendar" ? (
            <TaskCalendar
              tasks={group.tasks}
              range={range}
              view={view}
              ar={ar}
              members={members}
              when={when}
              toggle={toggle}
              busy={busy}
              canComplete={canComplete}
            />
          ) : (
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
          )}
        </>
      )}
      <TaskHandout
        tasks={group ? group.tasks : all}
        range={printDaily ? plannerRange(date, "day") : range}
        members={members}
        ar={ar}
        when={when}
        stableName={stableName}
        title={group?.title || ""}
        daily={printDaily}
      />
    </section>
  );
}
