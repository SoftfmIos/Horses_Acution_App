const invalid = (message) => {
  const error = new Error(message);
  error.status = 400;
  throw error;
};
import { instant, treatmentSlots } from "./recurrence.js";
const day = (value) =>
  new Date(Date.parse(value) + 3 * 3600000).toISOString().slice(0, 10);
export function medicationSchedule(plan) {
  if (plan.completed) return [];
  const days = Number(plan.durationDays) || 0;
  if (!days)
    return plan.repeatMode && plan.repeatMode !== "none"
      ? treatmentSlots(plan)
      : [];
  const hours = Number(plan.frequencyHours) || 24;
  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 90 ||
    !Number.isInteger(hours) ||
    hours < 1 ||
    hours > 168
  )
    invalid("Invalid medication duration or interval");
  const count = Math.ceil((days * 24) / hours);
  if (count > 1000) invalid("Treatment schedule exceeds 1000 doses");
  let doses = Array.from({ length: count }, (_, i) =>
    new Date(instant(plan.date) + i * hours * 3600000).toISOString(),
  );
  if (plan.repeatMode && plan.repeatMode !== "none") {
    const allowed = new Set(
      treatmentSlots({ ...plan, completed: false }).map(day),
    );
    doses = doses.filter((d) => allowed.has(day(d)));
  }
  if (!doses.length)
    invalid(
      "No doses fall on the selected weekdays within the treatment duration. Extend the duration or adjust the days.",
    );
  return doses;
}
