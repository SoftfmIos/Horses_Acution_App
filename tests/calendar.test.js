import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calendarDays,
  periodMonths,
  movePeriod,
  riyadhDay,
} from "../src/calendar.js";
import {
  localizedName,
  localizeData,
  latinDigits,
} from "../src/localization.js";
test("month, week and quarter navigation crosses years and leap months", () => {
  assert.equal(movePeriod("2026-12-31", "month", 1), "2027-01-01");
  assert.equal(movePeriod("2026-11-11", "quarter", 1), "2027-01-01");
  assert.equal(movePeriod("2026-11-11", "quarter", -1), "2026-07-01");
  assert.equal(movePeriod("2026-11-11", "week", 1), "2026-11-18");
  assert.deepEqual(periodMonths("2026-11-11", "quarter"), [
    "2026-10-01",
    "2026-11-01",
    "2026-12-01",
  ]);
  const feb = calendarDays("2028-02-15", "month");
  assert.equal(feb.length, 42);
  assert.ok(feb.includes("2028-02-29"));
  assert.equal(calendarDays("2026-11-11", "week")[0], "2026-11-08");
  assert.equal(riyadhDay("2026-11-11T22:00:00Z"), "2026-11-12");
});
test("bilingual names switch immediately, preserve editable originals and always use Western digits", () => {
  const source = {
    horses: [{ id: "h", name: "Shams", nameEn: "Shams 2", nameAr: "شمس ٢" }],
  };
  const arabic = localizeData(source, true);
  assert.equal(arabic.horses[0].name, "شمس 2");
  assert.equal(arabic.horses[0].nameEn, "Shams 2");
  assert.equal(source.horses[0].name, "Shams");
  assert.equal(localizeData(source, false).horses[0].name, "Shams 2");
  assert.equal(localizedName({ name: "Legacy" }, true), "Legacy");
  assert.equal(latinDigits("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹"), "01234567890123456789");
  const display = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date("2026-11-11"));
  assert.doesNotMatch(display, /[٠-٩۰-۹]/);
});

test("older backend data is safe to render when newer catalogues are missing", () => {
  const old = {
    horses: [{ id: "horse", name: "Legacy horse" }],
    plans: [],
    members: [],
  };
  const data = localizeData(old, false);
  assert.deepEqual(data.breeds, []);
  assert.deepEqual(data.instructors, []);
  assert.deepEqual(data.arenas, []);
  assert.deepEqual(data.taskHistory, []);
  assert.doesNotThrow(() => data.breeds.filter((r) => r.active));
  assert.equal(data.horses[0].name, "Legacy horse");
});
