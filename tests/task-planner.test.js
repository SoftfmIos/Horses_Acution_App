import { test } from "node:test";
import assert from "node:assert/strict";
import { taskGroups, plannerRange, inPeriod } from "../src/taskPlanner.js";
test("planner tracks each course separately and filters Riyadh dates", () => {
  const groups = taskGroups([
    {
      id: "1",
      medicalId: "a",
      title: "Dose",
      done: true,
      dueAt: "2026-11-12T21:30:00Z",
    },
    {
      id: "2",
      medicalId: "a",
      title: "Dose",
      done: false,
      dueAt: "2026-11-14T07:00:00Z",
    },
    {
      id: "3",
      feedingPlanId: "b",
      title: "Hay",
      done: true,
      dueAt: "2026-11-13T07:00:00Z",
    },
  ]);
  assert.deepEqual(
    groups.map((g) => g.percent),
    [50, 100],
  );
  assert.equal(
    inPeriod(groups[0].tasks[0], plannerRange("2026-11-13", "day")),
    true,
  );
  assert.deepEqual(plannerRange("2026-02-15", "month"), {
    start: "2026-02-01",
    end: "2026-02-28",
  });
});
