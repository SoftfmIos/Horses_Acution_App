import { classOpenings } from "../shared/class-openings.js";
export function expectedClassSlots(form) {
  return classOpenings(form);
}
export function verifyClassSlots(expected, saved) {
  if (
    !Array.isArray(saved) ||
    saved.length !== expected.length ||
    new Set(saved.map((c) => c.id)).size !== expected.length
  )
    throw new Error(
      "The backend did not save the complete schedule. Refresh before trying again; do not add duplicate classes.",
    );
  const actual = saved
    .map(
      (c) =>
        c.startsAt +
        "|" +
        c.endsAt +
        (expected[0]?.instructorId ? "|" + c.instructorId : ""),
    )
    .sort();
  const requested = expected
    .map(
      (c) =>
        c.startsAt +
        "|" +
        c.endsAt +
        (expected[0]?.instructorId ? "|" + c.instructorId : ""),
    )
    .sort();
  if (actual.some((s, i) => s !== requested[i]))
    throw new Error(
      "Saved class dates do not match the selected weekdays. Refresh before trying again.",
    );
  return saved;
}
