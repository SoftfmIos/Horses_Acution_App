const DAY = 86400000;
const invalid = (message) => {
  const error = new Error(message);
  error.status = 400;
  throw error;
};
const integer = (value, label, min, max) => {
  if (!Number.isInteger(value) || value < min || value > max)
    invalid(`Invalid ${label}`);
  return value;
};
export function instant(value) {
  if (typeof value !== "string") invalid("Set the first session start and end");
  let text = value;
  if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(text)) text += ":00+03:00";
  else if (/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(text)) text += "+03:00";
  const parsed = Date.parse(text);
  if (!Number.isFinite(parsed)) invalid("Invalid session date/time");
  return parsed;
}
export function recurrenceSlots(body) {
  const start = instant(body.startsAt),
    end = instant(body.endsAt);
  if (end <= start || end - start > DAY)
    invalid("Session duration must be between 1 minute and 24 hours");
  const slot = (offset) => ({
    startsAt: new Date(start + offset * DAY).toISOString(),
    endsAt: new Date(end + offset * DAY).toISOString(),
  });
  if (body.repeatMode === undefined) {
    const weeks = integer(body.repeatWeeks ?? 1, "weeks", 1, 52);
    return Array.from({ length: weeks }, (_, i) => slot(i * 7));
  }
  const mode = body.repeatMode;
  if (!["none", "daily", "weekly", "weekdays"].includes(mode))
    invalid("Invalid repetition");
  if (mode === "none") return [slot(0)];
  const every = integer(body.repeatEvery ?? 1, "repeat interval", 1, 52);
  const first = new Date(start + 3 * 3600000).toISOString().slice(0, 10);
  const until = body.repeatUntil;
  if (
    typeof until !== "string" ||
    !/^\d{4}-\d\d-\d\d$/.test(until) ||
    !Number.isFinite(Date.parse(until + "T12:00:00Z")) ||
    new Date(until + "T12:00:00Z").toISOString().slice(0, 10) !== until
  )
    invalid("Choose a valid repeat end date");
  const firstDay = Date.parse(first + "T12:00:00Z"),
    lastDay = Date.parse(until + "T12:00:00Z");
  const days = Math.round((lastDay - firstDay) / DAY);
  if (days < 0 || days > 365)
    invalid("Repeat end date must be within one year of the first session");
  const weekday = new Date(firstDay).getUTCDay();
  let chosen = mode === "weekly" ? [weekday] : body.repeatDays;
  if (
    mode === "weekdays" &&
    (!Array.isArray(chosen) ||
      !chosen.length ||
      chosen.some((d) => !Number.isInteger(d) || d < 0 || d > 6))
  )
    invalid("Choose at least one weekday");
  const result = [];
  for (let offset = 0; offset <= days; offset++) {
    const dow = (weekday + offset) % 7;
    const week = Math.floor((weekday + offset) / 7);
    if (
      mode === "daily"
        ? offset % every === 0
        : chosen.includes(dow) && week % every === 0
    )
      result.push(slot(offset));
  }
  if (!result.length) invalid("No sessions fall on the selected days");
  return result;
}
export function treatmentSlots(plan) {
  if (!plan.repeatMode || plan.repeatMode === "none" || plan.completed)
    return [];
  const start = instant(plan.date);
  return recurrenceSlots({
    ...plan,
    startsAt: new Date(start).toISOString(),
    endsAt: new Date(start + 30 * 60000).toISOString(),
  }).map((s) => s.startsAt);
}
