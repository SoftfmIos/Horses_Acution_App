import { test } from "node:test";
import assert from "node:assert/strict";
import { paymentReport } from "../src/paymentReport.js";
const data = {
  members: [{ id: "u", name: "Rider" }],
  proformas: [
    {
      id: "i1",
      member_id: "u",
      description: "First",
      due: 10000,
      paid: 4000,
      status: "open",
    },
    {
      id: "i2",
      member_id: "u",
      description: "Second",
      due: 3000,
      paid: 3000,
      status: "settled",
    },
  ],
  payments: [
    {
      id: "p1",
      proforma_id: "i1",
      amount: 2000,
      reference: "ONE",
      created_at: "2026-11-11T21:30:00Z",
    },
    {
      id: "p2",
      proforma_id: "i1",
      amount: 3000,
      reference: "TWO",
      created_at: "2026-11-12T10:00:00Z",
    },
    {
      id: "refund",
      proforma_id: "i1",
      amount: -1000,
      reference: "REFUND",
      created_at: "2026-11-13T10:00:00Z",
    },
    {
      id: "p3",
      proforma_id: "i2",
      amount: 3000,
      reference: "THREE",
      created_at: "2026-11-13T11:00:00Z",
    },
  ],
};
test("multiple payments group once per invoice and once per user without double-counting balances", () => {
  const invoices = paymentReport(data);
  assert.equal(invoices.length, 2);
  assert.equal(invoices[0].net, 4000);
  assert.equal(invoices[0].refunds, 1000);
  assert.equal(invoices[0].outstanding, 6000);
  const users = paymentReport({ ...data, groupBy: "user" });
  assert.equal(users.length, 1);
  assert.equal(users[0].due, 13000);
  assert.equal(users[0].net, 7000);
  assert.equal(users[0].outstanding, 6000);
});
test("search and Riyadh date filters select payments while preserving lifetime invoice balances", () => {
  const day = paymentReport({ ...data, from: "2026-11-12", to: "2026-11-12" });
  assert.equal(day.length, 1);
  assert.equal(day[0].rows.length, 2);
  assert.equal(day[0].net, 5000);
  assert.equal(day[0].paid, 4000);
  const search = paymentReport({ ...data, search: "two" });
  assert.equal(search[0].rows.length, 1);
  assert.equal(search[0].net, 3000);
  assert.equal(search[0].outstanding, 6000);
  assert.equal(paymentReport({ ...data, search: "not found" }).length, 0);
});

test("payment month groups use Riyadh dates and keep refunds in the correct month", async () => {
  const { historyMonths } = await import("../src/historyMonths.js");
  const months = historyMonths(
    [
      { amount: 5000, created_at: "2026-10-31T22:00:00Z" },
      { amount: -1000, created_at: "2026-11-01T10:00:00Z" },
      { amount: 2000, created_at: "2026-10-15T10:00:00Z" },
    ],
    (p) => p.created_at,
  );
  assert.deepEqual(
    months.map((m) => m.key),
    ["2026-11", "2026-10"],
  );
  assert.equal(
    months[0].items.reduce((sum, p) => sum + p.amount, 0),
    4000,
  );
});
