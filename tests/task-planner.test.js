import { test } from "node:test";
import assert from "node:assert/strict";
import {
  taskGroups,
  plannerRange,
  inPeriod,
  completionSummary,
} from "../src/taskPlanner.js";
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

test("daily weekly monthly summaries use the selected period and exclude cancelled work", () => {
  const tasks = [
    { dueAt: "2026-11-11T06:00:00Z", done: true },
    { dueAt: "2026-11-11T08:00:00Z", done: false },
    { dueAt: "2026-11-12T06:00:00Z", done: true },
    { dueAt: "2026-11-20T06:00:00Z", done: false },
    { dueAt: "2026-11-11T06:00:00Z", done: true, cancelled: true },
  ];
  assert.deepEqual(
    completionSummary(tasks, plannerRange("2026-11-11", "day")),
    { done: 1, total: 2, percent: 50 },
  );
  assert.deepEqual(
    completionSummary(tasks, plannerRange("2026-11-11", "week")),
    { done: 2, total: 3, percent: 67 },
  );
  assert.deepEqual(
    completionSummary(tasks, plannerRange("2026-11-11", "month")),
    { done: 2, total: 4, percent: 50 },
  );
});
