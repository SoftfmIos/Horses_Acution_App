import { chromium } from "playwright";
import express from "express";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";
const db = openDatabase(":memory:");
const app = createApp(db);
app.use(express.static(resolve("dist")));
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = "http://127.0.0.1:" + server.address().port;
mkdirSync("test-results", { recursive: true });
let browser;
(async () => {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.locator("input[name=name]").fill("Browser Manager");
  await page
    .locator("input[name=email]")
    .fill("browser" + Date.now() + "@test.com");
  await page
    .locator("input[name=password]")
    .fill("Browser secure password 123");
  await page.locator("input[name=stableName]").fill("Riyadh Browser Stable");
  await page.locator("button[type=submit]").click();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  const nav = async (name) =>
    page.locator("nav").getByRole("button", { name, exact: true }).click();
  const add = async () =>
    page.getByRole("button", { name: "Add", exact: true }).click();
  const field = (name) =>
    page.getByRole("dialog").getByLabel(name, { exact: true });
  const save = async () => {
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  };
  await nav("Horses");
  await add();
  await field("Name").fill("Browser Shams");
  await field("Breed").fill("Arabian");
  await save();
  await page.getByRole("heading", { name: "Browser Shams" }).waitFor();
  await nav("Pricing");
  await add();
  await field("Name").fill("Private ride");
  await field("Price (SAR)").fill("200");
  await save();
  await page.getByText("SAR", { exact: false }).first().waitFor();
  await nav("Discount codes");
  await add();
  await field("Code").fill("HELLO10");
  await field("Discount type").selectOption("percent");
  await field("Value (% or SAR)").fill("10");
  await field("Maximum redemptions").fill("5");
  const expiry = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .slice(0, 16);
  await field("Expiry").fill(expiry);
  await save();
  await nav("Classes & riding");
  await add();
  await field("Title").fill("Browser private class");
  const start = new Date(Date.now() + 2 * 86400000);
  start.setMinutes(0, 0, 0);
  await field("Start").fill(start.toISOString().slice(0, 16));
  await field("End").fill(
    new Date(+start + 3600000).toISOString().slice(0, 16),
  );
  await field("Available horses (select multiple)").selectOption({
    label: "Browser Shams",
  });
  await field("Instructor").fill("Layla");
  await field("Arena").fill("Main arena");
  await field("Price plan").selectOption({ index: 1 });
  await save();
  await page.getByRole("heading", { name: "Browser private class" }).waitFor();
  const calendar = page.getByRole("region", { name: "Booking calendar" });
  await calendar
    .getByLabel("Date", { exact: true })
    .fill(start.toISOString().slice(0, 10));
  await calendar.getByLabel("View", { exact: true }).selectOption("month");
  await calendar
    .getByRole("button")
    .filter({ hasText: "Browser private class" })
    .waitFor();
  await calendar.getByLabel("View", { exact: true }).selectOption("day");
  await calendar
    .getByLabel("Horse", { exact: true })
    .selectOption({ label: "Browser Shams" });
  await calendar
    .getByLabel("Arena", { exact: true })
    .selectOption("Main arena");
  await calendar
    .getByRole("button")
    .filter({ hasText: "Browser private class" })
    .waitFor();
  await calendar.getByLabel("View", { exact: true }).selectOption("week");

  await page.getByRole("button", { name: "Book", exact: true }).click();
  await field("Discount code (optional)").fill("HELLO10");
  await page
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm booking", exact: true })
    .click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Cancel booking", exact: true })
    .first()
    .waitFor();
  await nav("Payment requests");
  await page.getByRole("button", { name: "View", exact: true }).click();
  await page
    .getByRole("heading", { name: "PRO FORMA — NOT A TAX INVOICE" })
    .waitFor();
  if (!(await page.getByRole("dialog").innerText()).includes("180"))
    throw Error("Discount not reflected");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await nav("Medical care");
  await add();
  await field("Horse").selectOption({ label: "Browser Shams" });
  await field("Care type").fill("Recovery");
  await field("Notes").fill("No riding until vet clearance");
  await field("Restrict horse from riding").check();
  await field("Medication").fill("Vet prescription");
  await save();
  await nav("Horses");
  await page.getByText("Medical rest", { exact: true }).waitFor();

  await nav("Feeding plans");
  await add();
  await field("Horse").selectOption({ label: "Browser Shams" });
  await field("Feed / supplement").fill("Hay");
  await field("Quantity").fill("2 kg");
  await field("Assigned to").selectOption({ index: 1 });
  await save();
  await nav("Inventory");
  await add();
  await field("Name").fill("Hay bales");
  await field("Unit").fill("bale");
  await field("Quantity").fill("10");
  await field("Reorder level").fill("15");
  await save();
  await nav("Vouchers");
  await add();
  await field("Voucher value (SAR)").fill("50");
  await field("Expiry").fill(expiry);
  await save();
  // A pending booking must not activate while its assigned horse is on medical rest.
  await page.evaluate(async () => {
    const me = await (await fetch("/api/auth/me")).json();
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "RiyadhAcademy",
      "X-Stable-Id": me.stables[0].id,
    };
    const data = await (await fetch("/api/data", { headers })).json();
    for (const med of data.medical) {
      const r = await fetch("/api/records/medical/" + med.id, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...med, completed: true }),
      });
      if (!r.ok) throw Error("Medical clearance failed");
    }
    for (const horse of data.horses) {
      const r = await fetch("/api/records/horses/" + horse.id, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...horse, status: "ready" }),
      });
      if (!r.ok) throw Error("Horse clearance failed");
    }
  });
  await nav("Payment requests");
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await field("Amount (SAR)").fill("180");
  await field("Payment reference").fill("BANK-UI-1");
  await field("Payment voucher details / invoice reference").fill(
    "ZATCA-EXTERNAL-1",
  );
  await save();
  await page.getByText("Paid", { exact: true }).waitFor();
  await page
    .getByRole("button", { name: "Record external refund", exact: true })
    .click();
  await field("Amount (SAR)").fill("180");
  await field("Payment reference").fill("REFUND-UI-1");
  await field("External credit note reference").fill("CREDIT-EXTERNAL-1");
  await save();
  await page
    .getByRole("button", { name: "Create payment request", exact: true })
    .click();
  await field("Member").selectOption({ index: 1 });
  await field("Price plan").selectOption({ index: 1 });
  await save();

  // Prepare a new ready horse/class and package using the manager's authenticated API.
  const memberSetup = await page.evaluate(async () => {
    const me = await (await fetch("/api/auth/me")).json();
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "RiyadhAcademy",
      "X-Stable-Id": me.stables[0].id,
    };
    const post = async (path, body) => {
      const r = await fetch("/api" + path, {
        method: "POST",
        headers,
        body: JSON.stringify(body || {}),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      return d;
    };
    const horse = await post("/records/horses", {
      name: "Member horse",
      status: "ready",
    });
    const price = await post("/records/plans", {
      name: "Member lesson price",
      kind: "class",
      amount: 20000,
    });
    const pack = await post("/records/plans", {
      name: "Five lessons",
      kind: "package",
      amount: 80000,
      credits: 5,
    });
    const startsAt = new Date(Date.now() + 4 * 86400000).toISOString();
    const endsAt = new Date(Date.now() + 4 * 86400000 + 3600000).toISOString();
    await post("/records/classes", {
      title: "Member lesson",
      startsAt,
      endsAt,
      capacity: 1,
      horseIds: [horse.id],
      instructor: "Khalid",
      arena: "Member arena",
      planId: price.id,
      creditCost: 1,
    });
    const invite = await post("/invites");
    return { invite: invite.code, packId: pack.id };
  });
  const memberContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const mp = await memberContext.newPage();
  mp.on("pageerror", (e) => errors.push(e.message));
  await mp.goto(base);
  await mp.getByRole("button", { name: "Create account", exact: true }).click();
  await mp.locator("input[name=name]").fill("Portal Member");
  await mp.locator("input[name=email]").fill("portal-member@test.com");
  await mp.locator("input[name=password]").fill("Member secure password 123");
  await mp.getByLabel("Join an existing stable", { exact: true }).check();
  await mp.locator("input[name=invite]").fill(memberSetup.invite);
  await mp.locator("button[type=submit]").click();
  await mp.getByRole("heading", { name: "My account", exact: true }).waitFor();
  if (
    await mp
      .locator("nav")
      .getByRole("button", { name: "Medical care", exact: true })
      .count()
  )
    throw Error("Member sees manager medical tools");
  const mn = async (name) =>
    mp.locator("nav").getByRole("button", { name, exact: true }).click();
  await mn("Pricing");
  await mp
    .getByRole("button", { name: "Request package", exact: true })
    .click();
  await mp
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm request", exact: true })
    .click();
  await mp.getByRole("dialog").waitFor({ state: "hidden" });
  await page.evaluate(async () => {
    const me = await (await fetch("/api/auth/me")).json();
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "RiyadhAcademy",
      "X-Stable-Id": me.stables[0].id,
    };
    const data = await (await fetch("/api/data", { headers })).json();
    const p = data.proformas.find((p) => p.description === "Five lessons");
    const r = await fetch("/api/proformas/" + p.id + "/payment", {
      method: "POST",
      headers,
      body: JSON.stringify({
        amount: p.due,
        reference: "MEMBER-PACK-PAYMENT",
        externalRef: "EXTERNAL-PACK-INVOICE",
      }),
    });
    if (!r.ok) throw Error(await r.text());
  });
  await mp.getByRole("button", { name: "Refresh", exact: true }).click();
  await mn("My balance");
  await mp.getByRole("heading", { name: "My balance", exact: true }).waitFor();
  await mp.getByText("Package paid", { exact: true }).waitFor();
  await mn("Classes & riding");
  await mp
    .getByLabel("Choose instructor", { exact: true })
    .selectOption("Khalid");
  await mp.getByRole("button", { name: "Book", exact: true }).click();
  await mp.getByLabel("Use my lesson credits", { exact: true }).check();
  await mp
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await mp
    .getByRole("button", { name: "Confirm booking", exact: true })
    .click();
  await mp.getByRole("dialog").waitFor({ state: "hidden" });
  await mn("My balance");
  await mp.getByText("Session booked", { exact: true }).waitFor();
  const balance = await mp.locator(".balance-hero .big-money").innerText();
  if (balance !== "4")
    throw Error("Expected four remaining lesson credits: " + balance);
  await mn("My account");
  await mp
    .getByRole("heading", { name: "Member lesson", exact: true })
    .waitFor();
  await mp.getByRole("button", { name: "Cancel booking", exact: true }).click();
  await mn("My balance");
  await mp.getByText("Booking cancelled", { exact: true }).waitFor();
  if ((await mp.locator(".balance-hero .big-money").innerText()) !== "5")
    throw Error("Cancellation did not restore lesson credits");
  await mp.screenshot({
    path: "test-results/member-balance.png",
    fullPage: true,
  });
  await mp.getByRole("button", { name: "العربية", exact: true }).click();
  await mp.setViewportSize({ width: 390, height: 844 });
  await mp.screenshot({
    path: "test-results/member-arabic.png",
    fullPage: true,
  });
  if (
    await mp.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Member mobile overflow");
  await memberContext.close();
  await nav("Reports");
  await page.getByRole("heading", { name: "Reports", exact: true }).waitFor();
  await page.screenshot({ path: "test-results/reports.png", fullPage: true });
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  if ((await page.locator("html").getAttribute("dir")) !== "rtl")
    throw Error("RTL missing");
  await page.screenshot({
    path: "test-results/arabic-mobile.png",
    fullPage: true,
  });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Mobile overflow");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "الحصص والركوب", exact: true })
    .click();
  await page.getByRole("region", { name: "تقويم الحجز" }).waitFor();
  await page.screenshot({
    path: "test-results/calendar-arabic-mobile.png",
    fullPage: true,
  });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Calendar mobile overflow");
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS real UI: registration, horse and pricing creation, discounts, class scheduling, booking, pro forma, medical restriction, reports, member packages/credits/bookings, Arabic mobile",
  );
  await browser.close();
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    await new Promise((r) => server.close(r));
    db.close();
  });
