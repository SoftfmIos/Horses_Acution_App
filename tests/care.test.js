import { test } from "node:test";
import assert from "node:assert/strict";
import {
  feedingConflict,
  feedingSchedule,
  medicationSchedule,
} from "../server/care.js";
test("feeding windows use Riyadh dates, include midnight crossover and allow exact boundaries", () => {
  const p = { time: "23:45", durationMinutes: 30 };
  assert.equal(
    feedingConflict(p, "2026-11-11T21:00:00Z", "2026-11-11T22:00:00Z"),
    true,
  );
  assert.equal(
    feedingConflict(p, "2026-11-11T21:15:00Z", "2026-11-11T22:00:00Z"),
    false,
  );
  assert.equal(
    feedingConflict(
      { ...p, active: false },
      "2026-11-11T21:00:00Z",
      "2026-11-11T22:00:00Z",
    ),
    false,
  );
  assert.equal(
    feedingConflict(
      { ...p, startDate: "2026-11-12" },
      "2026-11-11T21:00:00Z",
      "2026-11-11T22:00:00Z",
    ),
    false,
  );
  const schedule = feedingSchedule(
    { time: "07:00", startDate: "2026-11-12", endDate: "2026-11-13" },
    new Date("2026-11-11T07:00:00Z"),
  );
  assert.deepEqual(schedule, [
    "2026-11-12T04:00:00.000Z",
    "2026-11-13T04:00:00.000Z",
  ]);
});
test("medication schedule creates all prescribed doses and stops at the course boundary", () => {
  const p = {
    date: "2026-11-11T07:00:00Z",
    frequencyHours: 8,
    durationDays: 2,
  };
  const doses = medicationSchedule(p);
  assert.equal(doses.length, 6);
  assert.equal(doses[5], "2026-11-12T23:00:00.000Z");
  assert.deepEqual(medicationSchedule({ ...p, completed: true }), []);
});

test("dose intervals and selected weekdays combine within the course duration", () => {
  const plan = {
    date: "2026-11-15T06:00:00+03:00",
    frequencyHours: 8,
    durationDays: 4,
    repeatMode: "weekdays",
    repeatEvery: 1,
    repeatDays: [0, 2, 3],
    repeatUntil: "2026-11-18",
  };
  const doses = medicationSchedule(plan);
  assert.equal(doses.length, 9);
  assert.ok(
    doses.every((d) =>
      [0, 2, 3].includes(new Date(Date.parse(d) + 3 * 3600000).getUTCDay()),
    ),
  );
  const daily = medicationSchedule({ ...plan, frequencyHours: 0 });
  assert.equal(daily.length, 3);
  assert.deepEqual(daily, [
    "2026-11-15T03:00:00.000Z",
    "2026-11-17T03:00:00.000Z",
    "2026-11-18T03:00:00.000Z",
  ]);
});
