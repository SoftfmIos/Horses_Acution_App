import { treatmentSlots } from "../shared/recurrence.js";
const DAY = 86400000;
export const riyadhDate = (value) =>
  new Date(new Date(value).getTime() + 3 * 3600000).toISOString().slice(0, 10);
export function feedingConflict(plan, startsAt, endsAt) {
  if (plan.active === false) return false;
  const first = riyadhDate(startsAt),
    last = riyadhDate(endsAt);
  let day = new Date(first + "T12:00:00Z").getTime() - DAY;
  const limit = new Date(last + "T12:00:00Z").getTime();
  for (; day <= limit; day += DAY) {
    const date = new Date(day).toISOString().slice(0, 10);
    if (
      (plan.startDate && date < plan.startDate) ||
      (plan.endDate && date > plan.endDate)
    )
      continue;
    const start = new Date(date + "T" + plan.time + ":00+03:00").getTime();
    const end = start + (plan.durationMinutes || 30) * 60000;
    if (start < Date.parse(endsAt) && Date.parse(startsAt) < end) return true;
  }
  return false;
}
export { medicationSchedule } from "../shared/medication-schedule.js";
export function feedingSchedule(plan, now, days = 28) {
  if (plan.active === false) return [];
  const start = new Date(riyadhDate(now) + "T12:00:00Z").getTime();
  return Array.from({ length: days }, (_, i) =>
    new Date(start + i * DAY).toISOString().slice(0, 10),
  )
    .filter(
      (date) =>
        (!plan.startDate || date >= plan.startDate) &&
        (!plan.endDate || date <= plan.endDate),
    )
    .map((date) =>
      new Date(date + "T" + plan.time + ":00+03:00").toISOString(),
    );
}
