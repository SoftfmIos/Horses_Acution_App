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
const base = "http://127.0.0.1:" + server.address().port;
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
  await page.goto(base);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.locator("input[name=name]").fill("Stable Staff");
  await page.locator("input[name=email]").fill("operations@test.com");
  await page.locator("input[name=password]").fill("123456");
  await page.locator("input[name=stableName]").fill("Operations stable");
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
      });
      const d = await r.json();
      if (!r.ok) throw Error(JSON.stringify(d));
      return d;
    };
    const horse = await call("/records/horses", {
        nameEn: "Shams",
        nameAr: "شمس",
        ownerId: me.user.id,
      }),
      second = await call("/records/horses", { name: "Moon" });
    const plan = await call("/records/plans", {
      name: "Boarding with food",
      amount: 10000,
      kind: "boarding_food",
      active: true,
    });
    const inventory = await call("/records/inventory", {
      name: "Hay stock",
      unit: "kg",
      quantity: 20,
      reorderAt: 5,
    });
    const teacher = await call("/records/instructors", {
      name: "Trainer",
      active: true,
    });
    const worker = await call("/members", {
      name: "Staff worker",
      email: "worker@test.com",
      password: "123456",
      role: "staff",
    });
    const rider = await call("/members", {
      name: "Rider Member",
      email: "rider@test.com",
      password: "123456",
    });
    const lessonPrice = await call("/records/plans", {
      name: "Lesson",
      amount: 10000,
      kind: "class",
      active: true,
    });
    const starts = new Date(Date.now() + 2 * 86400000);
    starts.setUTCHours(9, 0, 0, 0);
    const slot = await call("/records/classes", {
      title: "Staff booked lesson",
      startsAt: starts.toISOString(),
      endsAt: new Date(starts.getTime() + 3600000).toISOString(),
      capacity: 1,
      horseIds: [horse.id],
      instructor: "Trainer",
      arena: "Lesson arena",
      planId: lessonPrice.id,
    });
    return {
      horse,
      second,
      plan,
      inventory,
      actor: me.user.id,
      worker,
      rider,
      teacher,
      slot,
    };
  });
  const nav = (name) =>
    page.locator("nav").getByRole("button", { name, exact: true }).click();
  const refresh = () =>
    page.getByRole("button", { name: "Refresh", exact: true }).click();
  const dialog = () => page.getByRole("dialog");
  await refresh();
  await nav("Users & Permissions");
  await page
    .getByLabel("Permissions user", { exact: true })
    .selectOption(seed.worker.id);
  await page.getByLabel("Access level", { exact: true }).selectOption("staff");
  await page.getByRole("checkbox", { name: "Prices", exact: true }).uncheck();
  await page
    .getByRole("checkbox", {
      name: "Horse profiles & history — Edit",
      exact: true,
    })
    .uncheck();
  await page
    .getByRole("checkbox", {
      name: "Horse profiles & history — Delete",
      exact: true,
    })
    .uncheck();
  await page
    .getByRole("button", { name: "Save permissions", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      !document.querySelector(".permissions-page button[type=submit]")
        ?.disabled,
  );
  assert.equal(
    JSON.parse(
      db
        .prepare("SELECT modules FROM staff_permissions WHERE user_id=?")
        .get(seed.worker.id).modules,
    ).includes("pricing"),
    false,
  );
  assert.deepEqual(
    JSON.parse(
      db
        .prepare("SELECT actions FROM staff_permissions WHERE user_id=?")
        .get(seed.worker.id).actions,
    ).horses,
    ["add"],
  );
  const workerContext = await browser.newContext();
  const workerPage = await workerContext.newPage();
  await workerPage.goto(base);
  await workerPage.locator("input[name=email]").fill("worker@test.com");
  await workerPage.locator("input[name=password]").fill("123456");
  await workerPage.locator("button[type=submit]").click();
  await workerPage
    .getByRole("heading", { name: "Overview", exact: true })
    .waitFor();
  await workerPage
    .locator("nav")
    .getByRole("button", { name: "Horses", exact: true })
    .click();
  await workerPage.getByRole("button", { name: "Add", exact: true }).waitFor();
  assert.equal(
    await workerPage.getByRole("button", { name: "Edit", exact: true }).count(),
    0,
  );
  assert.equal(
    await workerPage.locator(".profile-photo input[type=file]").count(),
    0,
  );
  await workerContext.close();
  await nav("Classes & riding");
  await page
    .getByRole("region", { name: "Booking calendar" })
    .locator(".calendar-event")
    .filter({ hasText: "Staff booked lesson" })
    .first()
    .click();
  await dialog()
    .getByLabel("Book for member", { exact: true })
    .selectOption(seed.rider.id);
  await dialog()
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await dialog()
    .getByRole("button", { name: "Confirm booking", exact: true })
    .click();
  await dialog().waitFor({ state: "hidden" });
  assert.equal(
    db
      .prepare("SELECT member_id FROM reservations WHERE class_id=?")
      .get(seed.slot.id).member_id,
    seed.rider.id,
  );
  assert.equal(
    db
      .prepare(
        "SELECT member_id FROM proformas WHERE reservation_id IS NOT NULL",
      )
      .get().member_id,
    seed.rider.id,
  );
  await page.locator(".booking-planner > summary").click();
  const bookingPrint = page.getByRole("region", {
    name: "Printable booking calendar",
  });
  await page
    .getByLabel("Booking planner date", { exact: true })
    .fill(seed.slot.startsAt.slice(0, 10));
  await page
    .getByLabel("Booking planner member", { exact: true })
    .selectOption(seed.rider.id);
  await page
    .getByLabel("Booking planner instructor", { exact: true })
    .selectOption("Trainer");
  for (const period of ["day", "week", "month"]) {
    await page
      .getByLabel("Booking planner view", { exact: true })
      .selectOption(period);
    assert.equal(
      await bookingPrint.locator(".booking-planner-entry").count(),
      1,
    );
    await page.emulateMedia({ media: "print" });
    assert.equal(await bookingPrint.isVisible(), true);
    mkdirSync("test-results", { recursive: true });
    await page.pdf({
      path: "test-results/bookings-" + period + ".pdf",
      format: "A4",
      landscape: true,
    });
    await page.emulateMedia({ media: "screen" });
  }
  await nav("Stalls & boarding");
  await page.getByRole("button", { name: "Add stall", exact: true }).click();
  await dialog()
    .getByLabel("Name (English)", { exact: true })
    .fill("North stall");
  await dialog()
    .getByLabel("Name (Arabic)", { exact: true })
    .fill("المربط الشمالي");
  await dialog().getByLabel("Places", { exact: true }).fill("1");
  await dialog().getByRole("button", { name: "Save", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
  await nav("Stalls & boarding");
  await page
    .getByRole("button", { name: "Assign boarding", exact: true })
    .click();
  await dialog()
    .getByLabel("Horse", { exact: true })
    .selectOption(seed.horse.id);
  await dialog()
    .getByLabel("Stall", { exact: true })
    .selectOption({ label: "North stall" });
  await dialog()
    .getByLabel("Billed member", { exact: true })
    .selectOption(seed.actor);
  await dialog()
    .getByLabel("Boarding price", { exact: true })
    .selectOption(seed.plan.id);
  await dialog()
    .getByRole("button", { name: "Assign & create invoice", exact: true })
    .click();
  await dialog().waitFor({ state: "hidden" });
  await page.getByText("Payment pending", { exact: false }).waitFor();
  await nav("Horses");
  await page
    .locator(".record-card")
    .filter({ has: page.getByRole("heading", { name: "Shams", exact: true }) })
    .getByRole("button", { name: "Open horse profile", exact: true })
    .click();
  await dialog()
    .getByRole("heading", { name: "Horse history", exact: true })
    .waitFor();
  const imageContent = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 4;
    const x = c.getContext("2d");
    x.fillStyle = "#227744";
    x.fillRect(0, 0, 4, 4);
    return c.toDataURL("image/png").split(",")[1];
  });
  await dialog()
    .getByLabel("Upload photo for Shams", { exact: true })
    .setInputFiles({
      name: "horse.png",
      mimeType: "image/png",
      buffer: Buffer.from(imageContent, "base64"),
    });
  await dialog().locator(".profile-photo img").waitFor();
  assert.ok(
    db
      .prepare("SELECT count(*) AS n FROM records WHERE kind='profilePhotos'")
      .get().n > 0,
  );
  await dialog()
    .getByRole("button", { name: "Ride history", exact: true })
    .click();
  await dialog()
    .getByRole("heading", { name: "Ride history", exact: true })
    .waitFor();
  await dialog().getByText("Staff booked lesson", { exact: true }).waitFor();
  await dialog().getByText("Rider Member", { exact: true }).waitFor();
  assert.equal(await dialog().locator(".horse-master").isVisible(), true);
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/horse-master-detail.png",
    fullPage: true,
  });
  await dialog()
    .getByRole("button", { name: "Documents", exact: true })
    .click();
  await dialog()
    .getByLabel("Document title (English)", { exact: true })
    .fill("Horse passport");
  await dialog()
    .getByLabel("File", { exact: true })
    .setInputFiles({
      name: "passport.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\nBrowser document\n%%EOF"),
    });
  await dialog()
    .getByRole("button", { name: "Upload document", exact: true })
    .click();
  await dialog().getByText("Horse passport", { exact: true }).waitFor();
  const downloadEvent = page.waitForEvent("download");
  await dialog().getByRole("button", { name: "Download", exact: true }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "passport.pdf");
  await dialog().getByRole("button", { name: "Timeline", exact: true }).click();
  await dialog().getByText("Horse passport", { exact: true }).waitFor();
  await dialog().getByRole("button", { name: "Cancel", exact: true }).click();
  await nav("Settings");
  await page
    .locator(".settings-card")
    .filter({
      has: page.getByRole("heading", { name: "Instructors", exact: true }),
    })
    .getByRole("button", { name: "Manage", exact: true })
    .click();
  await page
    .getByLabel("Upload photo for Trainer", { exact: true })
    .setInputFiles({
      name: "trainer.png",
      mimeType: "image/png",
      buffer: Buffer.from(imageContent, "base64"),
    });
  await page.locator(".record-card .profile-photo img").waitFor();
  await nav("Members");
  const riderRow = page
    .locator(".member-row")
    .filter({ hasText: "Rider Member" });
  await riderRow
    .getByLabel("Upload photo for Rider Member", { exact: true })
    .setInputFiles({
      name: "rider.png",
      mimeType: "image/png",
      buffer: Buffer.from(imageContent, "base64"),
    });
  await riderRow.locator(".profile-photo img").waitFor();
  await nav("Medical care");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await dialog()
    .getByLabel("Available horses (select multiple)", { exact: true })
    .selectOption([seed.horse.id, seed.second.id]);
  await dialog().getByLabel("Care type", { exact: true }).fill("Vaccination");
  await dialog()
    .getByLabel("Notes", { exact: true })
    .fill("Annual vaccination review");
  await dialog()
    .getByLabel("Medication", { exact: true })
    .fill("Daily supplement");
  await dialog()
    .getByLabel("Dose / route", { exact: true })
    .fill("As prescribed");
  await dialog().getByLabel("Dose interval (hours)", { exact: true }).fill("0");
  await dialog()
    .getByLabel("Treatment duration (days)", { exact: true })
    .fill("3");
  await dialog().getByRole("button", { name: "Save", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
  await page.waitForFunction(
    () => document.querySelectorAll(".record-card").length === 2,
  );
  await nav("Feeding plans");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await dialog()
    .getByLabel("Available horses (select multiple)", { exact: true })
    .selectOption(seed.horse.id);
  await dialog().getByLabel("Feed / supplement", { exact: true }).fill("Hay");
  await dialog().getByLabel("Quantity", { exact: true }).fill("2 kg");
  await dialog()
    .getByLabel("Feed stock item (optional)", { exact: true })
    .selectOption(seed.inventory.id);
  await dialog()
    .getByLabel("Stock units per feeding", { exact: true })
    .fill("2");
  await dialog().getByRole("button", { name: "Save", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
  await nav("Tasks");
  await page
    .getByRole("heading", { name: "Staff work planner", exact: true })
    .waitFor();
  await page.getByLabel("Planner view", { exact: true }).selectOption("day");
  const taskCalendar = page
    .locator(".staff-workload")
    .getByRole("region", { name: "Care task calendar" });
  await taskCalendar.locator('[data-category="feeding"] > summary').waitFor();
  await taskCalendar.locator('[data-category="medical"] > summary').waitFor();
  await taskCalendar
    .getByLabel("Calendar task group", { exact: true })
    .selectOption("medical");
  assert.equal(
    await taskCalendar.locator('[data-category="feeding"]').count(),
    0,
  );
  assert.equal(
    await taskCalendar.locator('[data-category="medical"]').count(),
    1,
  );
  await taskCalendar
    .getByLabel("Calendar task group", { exact: true })
    .selectOption("all");
  await page.getByLabel("Planner view", { exact: true }).selectOption("week");
  assert.equal(
    await taskCalendar
      .locator('[data-category="feeding"]')
      .first()
      .getAttribute("open"),
    null,
  );
  await taskCalendar
    .locator('[data-category="feeding"] > summary')
    .first()
    .click();
  await taskCalendar
    .locator('[data-category="feeding"] input[type=checkbox]')
    .first()
    .waitFor({ state: "visible" });
  await page.getByLabel("Planner view", { exact: true }).selectOption("day");
  const before = await page
    .locator(".staff-workload input[type=checkbox]")
    .count();
  assert.ok(before > 0);
  const completedResponse = page.waitForResponse(
    (r) => r.url().includes("/toggle") && r.request().method() === "POST",
  );
  await page
    .locator(".staff-workload .task-occurrence")
    .filter({ hasText: "Hay" })
    .locator("input[type=checkbox]")
    .first()
    .check();
  assert.equal((await completedResponse).status(), 200);
  await page
    .locator(".staff-workload .task-occurrence.done")
    .filter({ hasText: "Hay" })
    .locator(".completion-stamp")
    .waitFor();
  await taskCalendar
    .locator('[data-category="feeding"] > summary')
    .filter({ hasText: "100%" })
    .waitFor();
  await page.screenshot({
    path: "test-results/task-calendar.png",
    fullPage: true,
  });
  await page.getByLabel("Task layout", { exact: true }).selectOption("list");
  await page
    .locator(".staff-workload .task-checklist-group.category-feeding > summary")
    .waitFor();
  await page
    .locator(".staff-workload .task-checklist-group.category-medical > summary")
    .waitFor();
  await page.evaluate(() => {
    window.print = () => {};
  });
  await page
    .getByRole("button", { name: "Print daily handout", exact: true })
    .click();
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".planner-print-sheet").isVisible(), true);
  assert.ok((await page.locator(".task-handout .signature-cell").count()) > 0);
  await page
    .getByRole("heading", {
      name: "Daily task follow-up & signatures",
      exact: true,
    })
    .waitFor();
  mkdirSync("test-results", { recursive: true });
  await page.pdf({ path: "test-results/staff-planner.pdf", format: "A4" });
  await page.emulateMedia({ media: "screen" });
  await nav("Inventory");
  await page
    .getByRole("heading", { name: "Feed stock & purchasing", exact: true })
    .waitFor();
  await page.waitForFunction(() =>
    document.querySelector(".feed-stock h4")?.textContent.includes("18"),
  );
  await page.getByLabel("Received units Hay stock", { exact: true }).fill("5");
  await page.getByLabel("Delivery reference", { exact: true }).fill("DEL-UI-1");
  await page
    .getByRole("button", { name: "Receive stock", exact: true })
    .click();
  await page.waitForFunction(() =>
    document.querySelector(".feed-stock h4")?.textContent.includes("23"),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/stable-features-mobile.png",
    fullPage: true,
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS stable operations UI: stalls, boarding invoice, horse timeline, document upload/download, multi-horse medical, staff planner print and feed stock completion/receiving",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
  db.close();
}
