import { test } from "node:test";
import assert from "node:assert/strict";
import { discountCodeForForm } from "../shared/discount-code.js";
test("discount form submits a real three-letter three-digit code and preserves issued codes", () => {
  assert.equal(
    discountCodeForForm({ titleEn: "open discount", discountDigits: "042" }),
    "OPE042",
  );
  assert.equal(
    discountCodeForForm({ titleAr: "خصم الافتتاح", discountDigits: "123" }),
    "OFF123",
  );
  assert.equal(
    discountCodeForForm(
      { titleEn: "Changed", discountDigits: "999" },
      "OPE042",
    ),
    "OPE042",
  );
});
