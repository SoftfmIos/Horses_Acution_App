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
    email: "account-manager@test.com",
    password: "123456",
    stableName: "Academy",
  }))
    await page.locator(`input[name=${key}]`).fill(value);
  await page.locator("button[type=submit]").click();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await page.evaluate(async () => {
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
        result = await r.json();
      if (!r.ok) throw Error(path + ": " + JSON.stringify(result));
      return result;
    };
    const member = await call("/members", {
      name: "Rider",
      email: "rider-account@test.com",
      password: "123456",
    });
    for (const [credits, state] of [
      [8, "paid"],
      [3, "refunded"],
      [4, "partial"],
    ]) {
      const plan = await call("/records/plans", {
          name: credits + " sessions",
          kind: "package",
          amount: 10000,
          credits,
        }),
        invoice = await call("/proformas", {
          memberId: member.id,
          planId: plan.id,
        });
      await call("/proformas/" + invoice.id + "/payment", {
        amount: state === "partial" ? 4000 : 10000,
        reference: "PAID-" + credits,
        externalRef: "Received",
      });
      if (state === "refunded")
        await call("/proformas/" + invoice.id + "/refund", {
          amount: 10000,
          reference: "REFUNDED-" + credits,
          externalRef: "Refunded",
        });
    }
    const horse = await call("/records/horses", { name: "Shams" }),
      price = await call("/records/plans", {
        name: "Private lesson",
        amount: 1000,
        kind: "private",
      });
    for (const day of [2, 3]) {
      const start = new Date(Date.now() + day * 86400000),
        end = new Date(start.getTime() + 3600000);
      const slot = await call("/records/classes", {
        title: "Riding lesson " + day,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        capacity: 1,
        creditCost: 2,
        horseIds: [horse.id],
        instructor: "Teacher",
        arena: "A",
        planId: price.id,
      });
      const booking = await call("/bookings", {
        classId: slot.id,
        memberId: member.id,
        useCredits: true,
      });
      if (day === 3) await call("/bookings/" + booking.id + "/cancel", {});
    }
  });
  await page
    .locator("nav")
    .getByRole("button", { name: "Pricing", exact: true })
    .click();
  await page.locator(".sidebar .profile").click();
  const login = async () => {
    await page.locator("input[name=email]").fill("rider-account@test.com");
    await page.locator("input[name=password]").fill("123456");
    await page.locator(".auth-card button[type=submit]").click();
    await page
      .getByRole("heading", { name: "My account", exact: true })
      .waitFor();
    await page
      .locator(".client-summary button strong")
      .getByText("6", { exact: true })
      .waitFor();
  };
  await login();
  const expected = {
    purchased: 11,
    used: 4,
    restored: 2,
    refunded: 3,
    pending: 4,
  };
  const verify = async () => {
    for (const [key, count] of Object.entries(expected))
      await page
        .locator(`[data-session-total=${key}] dd`)
        .getByText(String(count), { exact: true })
        .waitFor();
  };
  await verify();
  assert.match(
    await page.locator(".member-login-email").innerText(),
    /rider-account@test.com/,
  );
  assert.equal(
    await page
      .locator("nav")
      .getByRole("button", { name: "Settings", exact: true })
      .count(),
    0,
  );
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/member-account-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Refresh session balance", exact: true })
    .click();
  await verify();
  await page
    .getByRole("button", { name: "View session history", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "My balance", exact: true })
    .waitFor();
  await page
    .locator(".balance-hero .big-money")
    .getByText("6", { exact: true })
    .waitFor();
  await verify();
  await page
    .locator("nav")
    .getByRole("button", { name: "My invoices", exact: true })
    .click();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await login();
  await verify();
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("heading", { name: "حسابي", exact: true }).waitFor();
  await page
    .getByRole("heading", { name: "ملخص الحصص", exact: true })
    .waitFor();
  await verify();
  assert.equal(await page.evaluate(() => document.documentElement.dir), "rtl");
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: "test-results/member-account-arabic-mobile.png",
    fullPage: true,
  });
  assert.ok(
    await page
      .locator(".sidebar nav")
      .evaluate((nav) => nav.getBoundingClientRect().height < 120),
    "Member navigation should stay in a single row",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: member login and relogin land on My account; paid, used, cancelled, refunded and partial-payment session totals match on account and balance; Arabic mobile fits",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
  db.close();
}
