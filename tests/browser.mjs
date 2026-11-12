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
  await page.locator("input[name=password]").fill("123456");
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
  await nav("Settings");
  await page
    .getByLabel("Academy name (English)", { exact: true })
    .fill("Riyadh Browser Stable");
  await page
    .getByLabel("Academy name (Arabic)", { exact: true })
    .fill("أكاديمية الاختبار");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const settingsAdd = async (title) => {
    await nav("Settings");
    await page
      .locator(".settings-card")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) })
      .getByRole("button", { name: "Add", exact: true })
      .click();
  };
  // Reproduce the incomplete response from an older cPanel backend across every Add form.
  await page.route("**/api/data*", async (route) => {
    const response = await route.fetch();
    const payload = await response.json();
    for (const key of [
      "breeds",
      "instructors",
      "arenas",
      "taskHistory",
      "settings",
    ])
      delete payload[key];
    await route.fulfill({ response, json: payload });
  });
  await page.reload();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  for (const title of [
    "Horses",
    "Horse breeds",
    "Instructors",
    "Training locations & arenas",
    "Classes & riding",
    "Pricing",
    "Medical care",
    "Feeding plans",
    "Tasks",
    "Discount codes",
    "Vouchers",
    "Inventory",
  ]) {
    await settingsAdd(title);
    await page.getByRole("dialog").waitFor();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
  }
  await page.route("**/api/records/instructors", (route) =>
    route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unknown module" }),
    }),
  );
  await settingsAdd("Instructors");
  await field("Name (English)").fill("Outdated backend test");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await page
    .getByText(/Backend update required:/)
    .first()
    .waitFor();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await page.unroute("**/api/records/instructors");
  await nav("Members");
  await page
    .getByRole("button", { name: "Create member", exact: true })
    .click();
  await field("Name (English)").waitFor();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await nav("Settings");
  await page.getByRole("button", { name: "Add stable", exact: true }).click();
  await field("Stable name (English)").waitFor();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await nav("Payment requests");
  await page
    .getByRole("button", { name: "Create payment request", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await page.unroute("**/api/data*");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await settingsAdd("Horse breeds");
  await field("Name (English)").fill("Arabian");
  await field("Name (Arabic)").fill("عربي");
  await save();
  await settingsAdd("Instructors");
  await field("Name (English)").fill("Layla");
  await field("Name (Arabic)").fill("ليلى");
  await save();
  await settingsAdd("Training locations & arenas");
  await field("Name (English)").fill("Main arena");
  await field("Name (Arabic)").fill("الميدان الرئيسي");
  await field("Place type").selectOption("open_area");
  await field("Address").fill("Riyadh");
  await save();
  await nav("Horses");
  await page.locator(".search input").fill("A filter that hides the new horse");
  await add();
  await field("Name (English)").fill("Browser Shams");
  await field("Name (Arabic)").fill("شمس");
  await field("Breed").fill("Arabian");
  await save();
  await page.getByRole("heading", { name: "Browser Shams" }).waitFor();
  if (await page.locator(".search input").inputValue())
    throw Error("Horse save did not clear search");
  await page.reload();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await nav("Horses");
  await page
    .getByRole("heading", { name: "Browser Shams", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.getByRole("heading", { name: "شمس", exact: true }).waitFor();
  await page.getByRole("button", { name: "English", exact: true }).click();

  await nav("Pricing");
  await page.locator(".search input").fill("A filter that hides prices");
  await add();
  await field("Name (English)").fill("Private ride");
  await field("Price (SAR)").fill("200");
  await save();
  await page.getByText("SAR", { exact: false }).first().waitFor();
  await page
    .getByRole("heading", { name: "Private ride", exact: true })
    .waitFor();
  await page.reload();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await nav("Pricing");
  await page
    .getByRole("heading", { name: "Private ride", exact: true })
    .waitFor();

  await nav("Discount codes");
  await add();
  await field("Title (English)").fill("Summer");
  await field("Discount type").selectOption("percent");
  await field("Value (% or SAR)").fill("10");
  await field("Maximum redemptions").fill("5");
  const expiry = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .slice(0, 16);
  await field("Expiry").fill(expiry);
  await save();
  const discountCode = (await page.locator(".record-card").innerText()).match(
    /SUM\d{3}/,
  )[0];
  await nav("Classes & riding");
  await add();
  await field("Title (English)").fill("Browser private class");
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
  await field("Arena").selectOption({ label: "Main arena" });
  await field("Price plan").selectOption({ index: 1 });
  await save();
  await page.getByRole("heading", { name: "Browser private class" }).waitFor();
  const calendar = page.getByRole("region", { name: "Booking calendar" });
  if (
    (await calendar.getByLabel("View", { exact: true }).inputValue()) !==
    "month"
  )
    throw Error("Calendar does not open in month view");
  await calendar.getByLabel("View", { exact: true }).selectOption("quarter");
  if ((await calendar.locator(".calendar-month").count()) !== 3)
    throw Error("Quarter must contain three months");
  const quarterTitle = await calendar.locator(".calendar-period").innerText();
  await calendar
    .getByRole("button", { name: "Next period", exact: true })
    .click();
  if ((await calendar.locator(".calendar-period").innerText()) === quarterTitle)
    throw Error("Quarter navigation failed");
  await calendar
    .getByRole("button", { name: "Previous period", exact: true })
    .click();
  await calendar.getByLabel("View", { exact: true }).selectOption("month");

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
  await field("Discount code (optional)").fill(discountCode);
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
  await field("Available horses (select multiple)").selectOption({ label: "Browser Shams" });
  await field("Care type").fill("Recovery");
  await field("Notes").fill("No riding until vet clearance");
  await field("Restrict horse from riding").check();
  await field("Medication").fill("Vet prescription");
  await field("Dose / route").fill("As prescribed");
  await field("Dose interval (hours)").fill("8");
  await field("Treatment duration (days)").fill("2");
  await save();
  await page.locator(".care-ledger").first().locator("summary").first().click();
  await page
    .getByRole("checkbox", { name: /^Complete / })
    .first()
    .check();
  await page.getByLabel("Task status", { exact: true }).selectOption("done");
  await page.locator(".care-table tbody tr").first().waitFor();
  if (
    !(await page.locator(".care-table tbody tr").first().innerText()).includes(
      "Browser Manager",
    )
  )
    throw Error("Dose completion did not record actor");
  if (
    (await page
      .locator(".care-progress progress")
      .first()
      .getAttribute("value")) !== "1"
  )
    throw Error("Completion progress did not update");

  await nav("Horses");
  await page.getByText("Medical rest", { exact: true }).waitFor();

  await nav("Feeding plans");
  await add();
  await field("Available horses (select multiple)").selectOption({
    label: "Browser Shams",
  });
  await field("Feed / supplement").fill("Hay");
  await field("Quantity").fill("2 kg");
  await field("Assigned to").selectOption({ index: 1 });
  await save();
  await nav("Tasks");
  await add();
  await field("Title (English)").fill("Inspect tack");
  await field("Due at").fill(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  );
  await field("Assigned to").selectOption({ index: 1 });
  await save();
  await page.getByRole("heading", {name:"Inspect tack",exact:true}).waitFor();
  await nav("Inventory");
  await add();
  await field("Name (English)").fill("Hay bales");
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
  const mn = async (name) => {
    if (name === "Pricing") {
      await mp
        .locator("nav")
        .getByRole("button", { name: "My account", exact: true })
        .click();
      await mp.getByRole("button", { name: "Pricing", exact: true }).click();
      return;
    }
    await mp
      .locator("nav")
      .getByRole("button", {
        name: name === "Classes & riding" ? "Book a slot" : name,
        exact: true,
      })
      .click();
  };
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
  if ((await mp.locator(".client-layout").count()) !== 1)
    throw Error("Member did not receive the client portal");
  if (/[٠-٩۰-۹]/.test(await mp.locator("body").innerText()))
    throw Error("Arabic digits displayed in client portal");
  const fonts = await mp
    .locator("h1,button,input,select,textarea")
    .evaluateAll((nodes) => nodes.map((n) => getComputedStyle(n).fontFamily));
  if (fonts.some((font) => !font.includes("Tajawal")))
    throw Error("Inconsistent font");
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
  if (/[٠-٩۰-۹]/.test(await page.locator("body").innerText()))
    throw Error("Arabic digits displayed in calendar");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "English", exact: true }).click();
  // Generate a named offering on selected weekdays using saved location choices.
  await nav("Classes & riding");
  await add();
  await field("Title (English)").fill("Morning ride");
  let firstDay = new Date();
  firstDay.setUTCDate(firstDay.getUTCDate() + 10);
  firstDay.setUTCDate(firstDay.getUTCDate() + ((7 - firstDay.getUTCDay()) % 7));
  const firstDate = firstDay.toISOString().slice(0, 10),
    until = new Date(firstDay.getTime() + 14 * 86400000)
      .toISOString()
      .slice(0, 10);
  await field("Start").fill(firstDate + "T06:00");
  await field("End").fill(firstDate + "T06:45");
  await field("Available horses (select multiple)").selectOption({
    label: "Browser Shams",
  });
  await field("Instructor").fill("Layla");
  await field("Arena").selectOption({ label: "Main arena" });
  await field("Price plan").selectOption({ index: 1 });
  await field("Repeat").selectOption("weekdays");
  await page
    .getByRole("dialog")
    .getByRole("checkbox", { name: "Sun", exact: true })
    .check();
  await page
    .getByRole("dialog")
    .getByRole("checkbox", { name: "Tue", exact: true })
    .check();
  await field("Repeat until").fill(until);
  await page
    .getByRole("dialog")
    .getByText("5 bookable sessions will be generated.", { exact: true })
    .waitFor();
  await save();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".session h3")].filter(
        (h) => h.textContent === "Morning ride",
      ).length === 5,
  );
  // A repeated follow-up creates individual tasks and displays completed/total progress.
  await nav("Medical care");
  await add();
  await field("Available horses (select multiple)").selectOption({ label: "Browser Shams" });
  await field("Care type").fill("Follow-up appointments");
  await field("Notes").fill("Appointment schedule test");
  await field("Recorded at").fill(firstDate + "T08:00");
  await field("Repeat").selectOption("daily");
  await field("Repeat until").fill(
    new Date(firstDay.getTime() + 2 * 86400000).toISOString().slice(0, 10),
  );
  await save();
  const course = page
    .locator(".record-card")
    .filter({ hasText: "Appointment schedule test" });
  await course.locator(".care-ledger summary").first().click();
  await course
    .getByRole("checkbox", { name: /^Complete / })
    .first()
    .check();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".record-card")]
        .find((c) => c.textContent.includes("Appointment schedule test"))
        ?.querySelector("progress")?.value === 1,
  );
  if ((await course.locator("progress").getAttribute("max")) !== "3")
    throw Error("Medical course task total incorrect");
  if (!(await course.locator(".care-progress").innerText()).includes("33%"))
    throw Error("Medical completion percentage incorrect");
  await nav("Settings");
  await page.getByRole("button", { name: "Add stable", exact: true }).click();
  await field("Stable name (English)").fill("Second UI stable");
  await field("Stable name (Arabic)").fill("الإسطبل الثاني");
  await save();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await nav("Members");
  await page
    .getByRole("button", { name: "Create member", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: "Create member", exact: true })
    .waitFor();
  await field("Name (English)").fill("Six character member");
  await field("Name (Arabic)").fill("عضو جديد");
  await field("Email").fill("six-member@test.com");
  await field("Password (6+ characters)").fill("123456");
  await save();
  await page
    .locator(".member-row")
    .filter({ hasText: "Six character member" })
    .waitFor();
  await page.reload();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await page
    .getByLabel("Active stable", { exact: true })
    .selectOption({ label: "Second UI stable" });
  await nav("Members");
  await page
    .locator(".member-row")
    .filter({ hasText: "Six character member" })
    .waitFor();
  await nav("Settings");
  await page.screenshot({
    path: "test-results/settings-desktop.png",
    fullPage: true,
  });
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS real UI: all Add forms with legacy data, outdated-backend save errors, registration, horse and pricing creation, discounts, class scheduling, booking, pro forma, medical restriction, reports, member packages/credits/bookings, Arabic mobile",
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
