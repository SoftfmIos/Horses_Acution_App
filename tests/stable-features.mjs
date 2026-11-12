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
    return { horse, second, plan, inventory, actor: me.user.id };
  });
  const nav = (name) =>
    page.locator("nav").getByRole("button", { name, exact: true }).click();
  const refresh = () =>
    page.getByRole("button", { name: "Refresh", exact: true }).click();
  const dialog = () => page.getByRole("dialog");
  await refresh();
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
  await nav("Medical care");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await dialog()
    .getByLabel("Available horses (select multiple)", { exact: true })
    .selectOption([seed.horse.id, seed.second.id]);
  await dialog().getByLabel("Care type", { exact: true }).fill("Vaccination");
  await dialog()
    .getByLabel("Notes", { exact: true })
    .fill("Annual vaccination review");
  await dialog().getByRole("button", { name: "Save", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
  assert.equal(await page.locator(".record-card").count(), 2);
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
  const before = await page
    .locator(".staff-workload input[type=checkbox]")
    .count();
  assert.ok(before > 0);
  const completedResponse = page.waitForResponse(
    (r) => r.url().includes("/toggle") && r.request().method() === "POST",
  );
  await page.locator(".staff-workload input[type=checkbox]").first().check();
  assert.equal((await completedResponse).status(), 200);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".planner-print-sheet").isVisible(), true);
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
