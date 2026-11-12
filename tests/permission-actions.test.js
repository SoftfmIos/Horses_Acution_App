import { test } from "node:test";
import assert from "node:assert/strict";
import { staffPolicy, permissionForRoute } from "../shared/permissions.js";
test("legacy page grants preserve existing function access and full actions", () => {
  const legacy = staffPolicy(["classes", "horses"]);
  assert.ok(legacy.modules.includes("instructors"));
  assert.ok(legacy.modules.includes("boarding"));
  assert.deepEqual(legacy.actions.horses, ["add", "edit", "delete"]);
  const precise = staffPolicy(["classes"], { classes: ["add"] });
  assert.deepEqual(precise.modules, ["classes"]);
  assert.deepEqual(precise.actions.classes, ["add"]);
  assert.deepEqual(precise.actions.instructors, []);
});
test("function actions map cancellation to Delete and operational completion to Edit", () => {
  for (const [path, method, page, action] of [
    ["/records/horses", "POST", "horses", "add"],
    ["/records/horses/id", "PUT", "horses", "edit"],
    ["/photos/horses/id", "DELETE", "horses", "delete"],
    ["/quote", "POST", "classes", null],
    ["/bookings/id/cancel", "POST", "classes", "delete"],
    ["/tasks/id/toggle", "POST", "tasks", "edit"],
    ["/proformas/id/payment", "POST", "billing", "edit"],
    ["/proformas/id/refund", "POST", "billing", "edit"],
    ["/boarding/id/end", "POST", "boarding", "delete"],
    ["/inventory/id/receive", "POST", "inventory", "add"],
  ])
    assert.deepEqual(permissionForRoute(path, method), { page, action });
});
