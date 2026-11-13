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
    email: "security-manager@test.com",
    password: "123456",
    stableName: "Academy",
  }))
    await page.locator(`input[name=${key}]`).fill(value);
  await page.locator("button[type=submit]").click();
  await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
  const id = await page.evaluate(async () => {
    const me = await (await fetch("/api/auth/me")).json();
    const r = await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "RiyadhAcademy",
        "X-Stable-Id": me.stables[0].id,
      },
      body: JSON.stringify({
        name: "Member",
        email: "security-member@test.com",
        password: "123456",
      }),
    });
    const d = await r.json();
    if (!r.ok) throw Error(JSON.stringify(d));
    return d.id;
  });
  const open = () =>
    page
      .getByRole("button", { name: "Account & security", exact: true })
      .click();
  await open();
  await page
    .getByRole("button", { name: "Review account deletion", exact: true })
    .click();
  await page.getByText(/Assign another academy administrator/).waitFor();
  assert.equal(
    await page
      .getByRole("button", {
        name: "Permanently delete my account",
        exact: true,
      })
      .count(),
    0,
  );
  await page.locator(".sidebar .profile").click();
  const login = async (email, password) => {
    await page.locator("input[name=email]").fill(email);
    await page.locator("input[name=password]").fill(password);
    await page.locator(".auth-card button[type=submit]").click();
  };
  await login("security-member@test.com", "123456");
  await page
    .getByRole("heading", { name: "My account", exact: true })
    .waitFor();
  await open();
  let form = page.locator(".account-security > form");
  await form.getByLabel("Current password", { exact: true }).fill("123456");
  await form
    .getByLabel("New email", { exact: true })
    .fill("updated-member@test.com");
  await form
    .getByRole("button", { name: "Save & sign in again", exact: true })
    .click();
  await page.locator(".auth-card").waitFor();
  await login("updated-member@test.com", "123456");
  await page
    .getByRole("heading", { name: "My account", exact: true })
    .waitFor();
  await open();
  await page
    .getByRole("button", { name: "Change password", exact: true })
    .click();
  form = page.locator(".account-security > form");
  await form.getByLabel("Current password", { exact: true }).fill("123456");
  await form.getByLabel("New password", { exact: true }).fill("new12345");
  await form
    .getByLabel("Confirm new password", { exact: true })
    .fill("different");
  await form
    .getByRole("button", { name: "Save & sign in again", exact: true })
    .click();
  await page
    .getByRole("alert")
    .getByText("Passwords do not match.", { exact: true })
    .waitFor();
  await form
    .getByLabel("Confirm new password", { exact: true })
    .fill("new12345");
  await form
    .getByRole("button", { name: "Save & sign in again", exact: true })
    .click();
  await page.locator(".auth-card").waitFor();
  await login("updated-member@test.com", "new12345");
  await page
    .getByRole("heading", { name: "My account", exact: true })
    .waitFor();
  await open();
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/account-security.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page
    .getByRole("button", { name: "Review account deletion", exact: true })
    .click();
  const deletion = page.locator(".account-delete-panel form");
  await deletion.waitFor();
  await deletion
    .getByLabel("Current password", { exact: true })
    .fill("new12345");
  await deletion
    .getByLabel("Type DELETE to confirm permanent deletion", { exact: true })
    .fill("DELETE");
  await deletion
    .getByRole("button", { name: "Permanently delete my account", exact: true })
    .click();
  await page.locator(".auth-card").waitFor();
  assert.equal(
    db
      .prepare("SELECT count(*) n FROM deleted_accounts WHERE user_id=?")
      .get(id).n,
    1,
  );
  await login("updated-member@test.com", "new12345");
  await page
    .getByText("Email or password is incorrect", { exact: true })
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: member email/password changes, reauthentication, mismatch handling, administrator transfer guard, in-app deletion, deleted login denial and Arabic mobile",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
  db.close();
}
