import { test } from "node:test";
import assert from "node:assert/strict";
import { recurrenceSlots, treatmentSlots } from "../shared/recurrence.js";
const base = { startsAt: "2026-11-15T06:00", endsAt: "2026-11-15T07:00" };
test("daily openings preserve Riyadh clock time and include the end date", () => {
  const rows = recurrenceSlots({
    ...base,
    repeatMode: "daily",
    repeatEvery: 1,
    repeatUntil: "2026-11-17",
  });
  assert.equal(rows.length, 3);
  assert.equal(rows[0].startsAt, "2026-11-15T03:00:00.000Z");
  assert.equal(rows[2].endsAt, "2026-11-17T04:00:00.000Z");
  assert.equal(
    recurrenceSlots({
      ...base,
      repeatMode: "daily",
      repeatEvery: 2,
      repeatUntil: "2026-11-19",
    }).length,
    3,
  );
});
test("weekly and selected days generate the intended openings", () => {
  assert.equal(
    recurrenceSlots({
      ...base,
      repeatMode: "weekly",
      repeatEvery: 2,
      repeatUntil: "2026-12-13",
    }).length,
    3,
  );
  const rows = recurrenceSlots({
    ...base,
    repeatMode: "weekdays",
    repeatEvery: 1,
    repeatDays: [0, 2],
    repeatUntil: "2026-11-29",
  });
  assert.equal(rows.length, 5);
  assert.equal(rows[1].startsAt, "2026-11-17T03:00:00.000Z");
  assert.equal(recurrenceSlots({ ...base, repeatWeeks: 3 }).length, 3);
});
test("invalid, empty and unbounded schedules are rejected", () => {
  for (const extra of [
    { repeatDays: [] },
    { repeatDays: [7] },
    { repeatUntil: "2026-02-31" },
    { repeatUntil: "2026-11-01" },
    { repeatUntil: "2028-01-01" },
    { repeatEvery: 0 },
  ])
    assert.throws(() =>
      recurrenceSlots({
        ...base,
        repeatMode: "weekdays",
        repeatDays: [0],
        repeatEvery: 1,
        repeatUntil: "2026-11-29",
        ...extra,
      }),
    );
  assert.equal(
    treatmentSlots({
      date: base.startsAt,
      repeatMode: "daily",
      repeatUntil: "2026-11-17",
    }).length,
    3,
  );
  assert.deepEqual(
    treatmentSlots({
      date: base.startsAt,
      repeatMode: "daily",
      repeatUntil: "2026-11-17",
      completed: true,
    }),
    [],
  );
});
