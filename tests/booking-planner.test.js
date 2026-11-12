import { test } from "node:test";
import assert from "node:assert/strict";
import { bookingPlannerRows } from "../src/bookingPlanner.js";
const classes = [
  { id: "c1", startsAt: "2026-11-11T21:30:00Z", instructorId: "i1" },
  { id: "c2", startsAt: "2026-11-13T07:00:00Z", instructorId: "i2" },
  { id: "c3", startsAt: "2026-11-20T07:00:00Z", instructorId: "i1" },
];
const bookings = [
  { id: "b1", class_id: "c1", member_id: "m1", status: "confirmed" },
  { id: "b2", class_id: "c2", member_id: "m2", status: "pending_payment" },
  { id: "b3", class_id: "c3", member_id: "m1", status: "cancelled" },
];
test("booking print calendars filter member, instructor, status and Riyadh day/week/month", () => {
  const base = { bookings, classes, date: "2026-11-12", view: "day" };
  assert.deepEqual(
    bookingPlannerRows(base).map((b) => b.id),
    ["b1"],
  );
  assert.deepEqual(
    bookingPlannerRows({ ...base, view: "week", memberId: "m2" }).map(
      (b) => b.id,
    ),
    ["b2"],
  );
  assert.deepEqual(
    bookingPlannerRows({ ...base, view: "month", instructor: "i1" }).map(
      (b) => b.id,
    ),
    ["b1"],
  );
  assert.deepEqual(
    bookingPlannerRows({
      ...base,
      view: "month",
      status: "all",
      memberId: "m1",
    }).map((b) => b.id),
    ["b1", "b3"],
  );
  assert.deepEqual(
    bookingPlannerRows({ ...base, view: "month", status: "cancelled" }).map(
      (b) => b.id,
    ),
    ["b3"],
  );
});
