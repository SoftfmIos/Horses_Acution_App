import { test } from "node:test";
import assert from "node:assert/strict";
import { historyMonths } from "../src/historyMonths.js";
test("horse history groups by Riyadh month with newest entries first and undated entries last", () => {
  const groups = historyMonths(
    [
      { id: "old", date: "2026-01-10T08:00:00Z" },
      { id: "boundary", date: "2026-01-31T22:00:00Z" },
      { id: "new", date: "2026-02-10T08:00:00Z" },
      { id: "missing" },
    ],
    (x) => x.date,
  );
  assert.deepEqual(
    groups.map((g) => g.key),
    ["2026-02", "2026-01", "undated"],
  );
  assert.deepEqual(
    groups[0].items.map((x) => x.id),
    ["new", "boundary"],
  );
  assert.equal(groups[0].title, "February 2026");
  assert.ok(
    historyMonths(
      [{ date: "2026-02-01" }],
      (x) => x.date,
      true,
    )[0].title.includes("فبراير"),
  );
  assert.deepEqual(
    historyMonths([], (x) => x.date),
    [],
  );
});
