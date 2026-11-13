import { test } from "node:test";
import assert from "node:assert/strict";
import { paymentStatusTone } from "../src/paymentStatus.js";
test("payment request colors distinguish fully paid, partial, pending and closed invoices", () => {
  assert.equal(
    paymentStatusTone({ status: "settled", due: 10000, paid: 10000 }),
    "paid",
  );
  assert.equal(
    paymentStatusTone({ status: "open", due: 10000, paid: 4000 }),
    "partial",
  );
  assert.equal(
    paymentStatusTone({ status: "open", due: 10000, paid: 0 }),
    "pending",
  );
  assert.equal(
    paymentStatusTone({ status: "void", due: 10000, paid: 10000 }),
    "closed",
  );
  assert.equal(
    paymentStatusTone({ status: "refund_required", due: 10000, paid: 4000 }),
    "closed",
  );
});
