export const STAFF_MODULES = [
  "classes",
  "horses",
  "medical",
  "feeding",
  "tasks",
  "pricing",
  "billing",
  "inventory",
  "reports",
  "members",
  "settings",
];
export function mayEditTaskDate(dueAt, now, isAdmin) {
  if (isAdmin) return true;
  const day = (value) =>
    new Date(Date.parse(value) + 3 * 3600000).toISOString().slice(0, 10);
  const yesterday = day(new Date(Date.parse(now) - 86400000).toISOString());
  return day(dueAt) >= yesterday;
}
