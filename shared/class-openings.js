const invalid = (message) => {
  const error = new Error(message);
  error.status = 400;
  throw error;
};
import { recurrenceSlots } from "./recurrence.js";
export function classOpenings(body) {
  const dates = recurrenceSlots(body);
  if (body.instructorIds === undefined) return dates;
  if (
    !Array.isArray(body.instructorIds) ||
    !body.instructorIds.length ||
    body.instructorIds.length > 50 ||
    body.instructorIds.some((id) => typeof id !== "string" || !id)
  )
    invalid("Select between 1 and 50 instructors");
  const instructors = [...new Set(body.instructorIds)];
  if (
    !Array.isArray(body.horseIds) ||
    new Set(body.horseIds).size < instructors.length
  )
    invalid("Choose at least one horse per instructor");
  if (dates.length * instructors.length > 2000)
    invalid("Schedule exceeds 2000 instructor slots; choose a shorter period");
  return dates.flatMap((date) =>
    instructors.map((instructorId) => ({ ...date, instructorId })),
  );
}
