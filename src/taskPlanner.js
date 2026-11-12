import { riyadhDay } from "./calendar.js";
export function taskGroups(tasks) {
  const groups = new Map();
  for (const task of tasks.filter((t) => !t.cancelled)) {
    const id = task.medicalId
      ? "medical:" + task.medicalId
      : task.feedingPlanId
        ? "feeding:" + task.feedingPlanId
        : "task:" + task.id;
    if (!groups.has(id)) groups.set(id, { id, title: task.title, tasks: [] });
    groups.get(id).tasks.push(task);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    tasks: group.tasks.sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    completed: group.tasks.filter((t) => t.done).length,
    percent: Math.round(
      (group.tasks.filter((t) => t.done).length / group.tasks.length) * 100,
    ),
  }));
}
export function plannerRange(anchor, view) {
  const day = new Date(anchor + "T12:00:00Z");
  if (view === "week") day.setUTCDate(day.getUTCDate() - day.getUTCDay());
  if (view === "month") day.setUTCDate(1);
  const start = day.toISOString().slice(0, 10);
  const days =
    view === "day"
      ? 1
      : view === "week"
        ? 7
        : new Date(
            Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0),
          ).getUTCDate();
  const end = new Date(day.getTime() + (days - 1) * 86400000)
    .toISOString()
    .slice(0, 10);
  return { start, end };
}
export const inPeriod = (task, range) => {
  const day = riyadhDay(task.dueAt);
  return day >= range.start && day <= range.end;
};
