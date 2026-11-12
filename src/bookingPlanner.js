import { riyadhDay } from "./calendar.js";
import { plannerRange } from "./taskPlanner.js";
export const instructorKey = (c) =>
  c.instructorId || c.instructorEn || c.instructor || "";
export function bookingPlannerRows({
  bookings,
  classes,
  memberId = "",
  instructor = "",
  status = "active",
  date,
  view,
}) {
  const range = plannerRange(date, view),
    classMap = new Map(classes.map((c) => [c.id, c]));
  return bookings
    .map((b) => ({ ...b, session: classMap.get(b.class_id) }))
    .filter((b) => {
      if (!b.session) return false;
      const day = riyadhDay(b.session.startsAt);
      const matchesStatus =
        status === "all" ||
        (status === "active"
          ? ["confirmed", "pending_payment"].includes(b.status)
          : b.status === status);
      return (
        (!memberId || b.member_id === memberId) &&
        (!instructor || instructorKey(b.session) === instructor) &&
        matchesStatus &&
        day >= range.start &&
        day <= range.end
      );
    })
    .sort((a, b) => a.session.startsAt.localeCompare(b.session.startsAt));
}
