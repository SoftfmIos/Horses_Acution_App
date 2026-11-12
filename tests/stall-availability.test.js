import { test } from "node:test";
import assert from "node:assert/strict";
import { stallAvailability } from "../src/stallAvailability.js";
const stall = { id: "s", capacity: 2, active: true };
const rows = [
  {
    id: "one",
    stallId: "s",
    status: "active",
    startDate: "2026-11-01",
    endDate: "2026-11-03",
  },
  {
    id: "two",
    stallId: "s",
    status: "active",
    startDate: "2026-11-04",
    endDate: "2026-11-06",
  },
];
test("stall availability uses peak simultaneous occupancy, not the count of separate stays", () => {
  assert.deepEqual(stallAvailability(stall, rows, "2026-11-01", "2026-11-06"), {
    occupied: 1,
    available: 1,
    valid: true,
  });
  assert.equal(
    stallAvailability(stall, rows, "2026-11-01", "2026-11-03", "one").available,
    2,
  );
  assert.equal(
    stallAvailability(
      { ...stall, active: false },
      rows,
      "2026-11-01",
      "2026-11-03",
    ).available,
    0,
  );
  assert.equal(
    stallAvailability(stall, rows, "2026-11-07", "2026-11-01").valid,
    false,
  );
});
