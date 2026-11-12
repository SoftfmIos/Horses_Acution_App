import { chromium } from "playwright";
import express from "express";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";
const db = openDatabase(":memory:"),
  app = createApp(db);
app.use(express.static(resolve("dist")));
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  for (const [key, value] of Object.entries({
    name: "Manager",
    email: "boarding-browser@test.com",
    password: "123456",
    stableName: "Academy",
  }))
    await page.locator(`input[name=${key}]`).fill(value);
  await page.locator("button[type=submit]").click();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  const seed = await page.evaluate(async () => {
    const me = await (await fetch("/api/auth/me")).json(),
      headers = {
        "Content-Type": "application/json",
        "X-Requested-With": "RiyadhAcademy",
        "X-Stable-Id": me.stables[0].id,
      };
    const call = async (path, body) => {
      const r = await fetch("/api" + path, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }),
        d = await r.json();
      if (!r.ok) throw Error(JSON.stringify(d));
      return d;
    };
    const horses = [];
    for (const name of ["Shams", "Moon", "Third"])
      horses.push(await call("/records/horses", { name, ownerId: me.user.id }));
    const a = await call("/records/stalls", { name: "North", capacity: 2 }),
      b = await call("/records/stalls", { name: "South", capacity: 1 });
    await call("/records/plans", {
      name: "A normal class",
      kind: "class",
      amount: 10000,
    });
    return { horses, a, b, member: me.user.id, stable: me.stables[0].id };
  });
  await page.reload();
  await page
    .locator("nav")
    .getByRole("button", { name: "Stalls & boarding", exact: true })
    .click();
  const dialog = () => page.getByRole("dialog");
  await page
    .getByRole("button", { name: "Assign boarding", exact: true })
    .click();
  await dialog()
    .getByText(/No active boarding prices are available/)
    .waitFor();
  assert.equal(
    await dialog()
      .getByLabel("Boarding price", { exact: true })
      .locator("option")
      .count(),
    1,
  );
  await dialog()
    .getByRole("button", { name: "Add boarding price", exact: true })
    .click();
  assert.equal(
    await dialog().getByLabel("Category", { exact: true }).inputValue(),
    "boarding",
  );
  await dialog()
    .getByLabel("Name (English)", { exact: true })
    .fill("Monthly boarding");
  await dialog().getByLabel("Price (SAR)", { exact: true }).fill("3000");
  await dialog().getByRole("button", { name: "Save", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
  await page
    .getByRole("heading", { name: "Stalls & boarding", exact: true })
    .waitFor();
  const from = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    to = new Date(Date.now() + 37 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel("Availability from", { exact: true }).fill(from);
  await page.getByLabel("Availability to", { exact: true }).fill(to);
  const stallCard = (name) =>
    page
      .locator(".boarding > .record-grid > article")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
  const available = async (name, count) =>
    stallCard(name)
      .locator(".stall-availability")
      .getByText(count + " spaces available", { exact: true })
      .waitFor();
  await available("North", 2);
  const snapshot = () =>
    page.evaluate(
      async (stable) =>
        (
          await fetch("/api/data", { headers: { "X-Stable-Id": stable } })
        ).json(),
      seed.stable,
    );
  const stale = await snapshot();
  await page.route("**/api/data?*", (route) => route.fulfill({ json: stale }));
  const assign = async (horse) => {
    await page
      .getByRole("button", { name: "Assign boarding", exact: true })
      .click();
    assert.equal(
      await dialog().getByLabel("Start date", { exact: true }).inputValue(),
      from,
    );
    assert.equal(
      await dialog().getByLabel("End date", { exact: true }).inputValue(),
      to,
    );
    await dialog().getByLabel("Horse", { exact: true }).selectOption(horse.id);
    await dialog().getByLabel("Stall", { exact: true }).selectOption(seed.a.id);
    await dialog()
      .getByLabel("Billed member", { exact: true })
      .selectOption(seed.member);
    await dialog()
      .locator(".boarding-price-total strong")
      .getByText(/3,000\.00/)
      .waitFor();
    await dialog()
      .getByRole("button", { name: "Assign & create invoice", exact: true })
      .click();
  };
  await assign(seed.horses[0]);
  await dialog().waitFor({ state: "hidden" });
  await available("North", 1);
  await page.unroute("**/api/data?*");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await assign(seed.horses[1]);
  await dialog().waitFor({ state: "hidden" });
  await available("North", 0);
  await assign(seed.horses[2]);
  await dialog()
    .getByRole("alert")
    .getByText(/Stall capacity is full/)
    .waitFor();
  await dialog().locator(".modal-close").click();
  const first = page
    .locator(".boarding-stay-card")
    .filter({
      has: page.getByRole("heading", { name: "Shams · North", exact: true }),
    });
  await first
    .getByRole("button", { name: "Edit boarding", exact: true })
    .click();
  await dialog().getByLabel("Stall", { exact: true }).selectOption(seed.b.id);
  await dialog()
    .getByRole("button", { name: "Save boarding changes", exact: true })
    .click();
  await dialog().waitFor({ state: "hidden" });
  await available("North", 1);
  await available("South", 0);
  await page
    .locator(".boarding-stay-card")
    .filter({
      has: page.getByRole("heading", { name: "Moon · North", exact: true }),
    })
    .getByRole("button", { name: "End stay", exact: true })
    .click();
  await available("North", 2);
  await available("South", 0);
  const persisted = await snapshot();
  assert.equal(persisted.proformas.length, 2);
  assert.equal(persisted.stallOccupancy.length, 1);
  assert.equal(
    persisted.boarding.find((b) => b.horseId === seed.horses[0].id).priceAmount,
    300000,
  );
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/boarding-prices-and-slots.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("heading", { name: "المرابط والإيواء", exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: missing-price guidance and direct price creation, explicit rate, inherited availability dates, immediate slots despite stale refresh, capacity rejection, moving and ending stays, original invoice and Arabic mobile",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
  db.close();
}
