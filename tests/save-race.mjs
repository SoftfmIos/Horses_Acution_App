import assert from "node:assert/strict";
import { chromium } from "playwright";
import express from "express";
import { resolve } from "node:path";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";
const db = openDatabase(":memory:");
const app = createApp(db);
app.use(express.static(resolve("dist")));
const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
let browser, release;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [],
    reads = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/api/data") reads.push(url);
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.locator("input[name=name]").fill("Save race manager");
  await page.locator("input[name=email]").fill("save-race@test.com");
  await page.locator("input[name=password]").fill("123456");
  await page.locator("input[name=stableName]").fill("Save race stable");
  await page.locator("button[type=submit]").click();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  await page
    .locator("nav")
    .getByRole("button", { name: "Horses", exact: true })
    .click();
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Name (English)", { exact: true })
    .fill("Concurrent horse");
  let signal;
  const started = new Promise((r) => (signal = r));
  let first = true;
  await page.route("**/api/data*", async (route) => {
    const response = await route.fetch();
    if (first) {
      first = false;
      signal();
      await new Promise((r) => (release = r));
    }
    await route.fulfill({ response });
  });
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await started;
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page
    .getByRole("heading", { name: "Concurrent horse", exact: true })
    .waitFor();
  release();
  release = null;
  await page.locator(".toast").waitFor();
  assert.equal(await page.locator(".toast").innerText(), "Saved successfully.");
  assert.equal(errors.length, 0);
  assert.equal(
    db.prepare("SELECT count(*) AS n FROM records WHERE kind='horses'").get().n,
    1,
  );
  await page.unroute("**/api/data*");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Name (English)", { exact: true })
    .fill("Omitted horse");
  await page.route("**/api/data*", async (route) => {
    const response = await route.fetch();
    const payload = await response.json();
    payload.horses = payload.horses.filter((h) => h.name !== "Omitted horse");
    await route.fulfill({ response, json: payload });
  });
  await page.route("**/api/records/horses/*", (route) =>
    route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: "Record not found" }),
    }),
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.waitForFunction(() =>
    document
      .querySelector(".toast")
      ?.textContent.includes("could not read the record back"),
  );
  assert.equal(
    db.prepare("SELECT count(*) AS n FROM records WHERE kind='horses'").get().n,
    2,
  );
  await page.unroute("**/api/records/horses/*");
  await page.unroute("**/api/data*");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page
    .getByRole("heading", { name: "Omitted horse", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Name (English)", { exact: true })
    .fill("Readback horse");
  await page.route("**/api/data*", async (route) => {
    const response = await route.fetch();
    const payload = await response.json();
    payload.horses = payload.horses.filter((h) => h.name !== "Readback horse");
    await route.fulfill({ response, json: payload });
  });
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByRole("heading", { name: "Readback horse", exact: true })
    .waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".toast")?.textContent === "Saved successfully.",
  );
  assert.equal(
    db.prepare("SELECT count(*) AS n FROM records WHERE kind='horses'").get().n,
    3,
  );
  await page.unroute("**/api/data*");
  assert.equal(errors.length, 0);
  assert.ok(reads.every((url) => url.searchParams.has("_fresh")));
  assert.equal(new Set(reads.map((url) => url.href)).size, reads.length);
  console.log(
    "PASS uncached reads, overlapping refresh, direct read-back recovery, no duplicate writes and genuine read-back failure",
  );
} finally {
  release?.();
  await browser?.close();
  await new Promise((r) => server.close(r));
  db.close();
}
