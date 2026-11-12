import { test } from "node:test";
import assert from "node:assert/strict";
import { expectedClassSlots, verifyClassSlots } from "../src/classSchedule.js";
test("calendar verification rejects a first-record-only save and checks every selected weekday", () => {
  const expected = expectedClassSlots({
    startsAt: "2026-11-15T06:00",
    endsAt: "2026-11-15T07:00",
    repeatMode: "weekdays",
    repeatDays: [0, 2],
    repeatEvery: 1,
    repeatUntil: "2026-11-29",
  });
  assert.equal(expected.length, 5);
  const saved = expected.map((s, i) => ({ ...s, id: String(i) }));
  assert.throws(
    () => verifyClassSlots(expected, [saved[0]]),
    /complete schedule/,
  );
  assert.throws(
    () =>
      verifyClassSlots(
        expected,
        saved.map((s) => ({ ...s, startsAt: saved[0].startsAt })),
      ),
    /dates/,
  );
  assert.equal(verifyClassSlots(expected, saved.slice().reverse()).length, 5);
});
