// Use UTC civil dates for arithmetic; session instants are displayed in Riyadh.
export const riyadhDay = (value) =>
  new Date(new Date(value).getTime() + 3 * 3600000).toISOString().slice(0, 10);
export function periodMonths(anchor, view) {
  const d = new Date(anchor + "T12:00:00Z");
  if (view !== "quarter") return [anchor.slice(0, 7) + "-01"];
  return Array.from({ length: 3 }, (_, i) =>
    new Date(
      Date.UTC(
        d.getUTCFullYear(),
        Math.floor(d.getUTCMonth() / 3) * 3 + i,
        1,
        12,
      ),
    )
      .toISOString()
      .slice(0, 10),
  );
}
export function calendarDays(anchor, view) {
  const d = new Date(anchor + "T12:00:00Z");
  if (view === "week") d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  else if (view !== "day") {
    d.setUTCDate(1);
    d.setUTCDate(1 - d.getUTCDay());
  }
  return Array.from(
    { length: view === "day" ? 1 : view === "week" ? 7 : 42 },
    (_, i) => new Date(d.getTime() + i * 86400000).toISOString().slice(0, 10),
  );
}
export function movePeriod(anchor, view, direction) {
  const d = new Date(anchor + "T12:00:00Z");
  if (view === "month" || view === "quarter") {
    d.setUTCDate(1);
    if (view === "quarter") d.setUTCMonth(Math.floor(d.getUTCMonth() / 3) * 3);
    d.setUTCMonth(d.getUTCMonth() + direction * (view === "quarter" ? 3 : 1));
  } else d.setUTCDate(d.getUTCDate() + direction * (view === "week" ? 7 : 1));
  return d.toISOString().slice(0, 10);
}
