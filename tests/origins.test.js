import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import express from "express";
import backendConfig from "../config/backend.json" with { type: "json" };
import proxy from "../api/backend.js";
import { createApp } from "../server/app.js";
import { openDatabase } from "../server/db.js";

test("custom production domain supports proxied login/recovery while rejecting untrusted origins", async (t) => {
  const db = openDatabase(":memory:");
  const app = createApp(db, {
    publicOrigin: "https://horsesacutionapp.vercel.app",
    allowedOrigins: backendConfig.allowedWebsiteOrigins,
    emailEnabled: true,
  });
  const backend = app.listen(0, "127.0.0.1");
  await new Promise((r) => backend.once("listening", r));
  const original = process.env.ACADEMY_BACKEND_URL;
  process.env.ACADEMY_BACKEND_URL =
    "http://127.0.0.1:" + backend.address().port;
  const web = express();
  web.use(express.json());
  web.use(proxy);
  const frontend = web.listen(0, "127.0.0.1");
  await new Promise((r) => frontend.once("listening", r));
  t.after(async () => {
    if (original === undefined) delete process.env.ACADEMY_BACKEND_URL;
    else process.env.ACADEMY_BACKEND_URL = original;
    await new Promise((r) => frontend.close(r));
    await new Promise((r) => backend.close(r));
    db.close();
  });
  const base = "http://127.0.0.1:" + frontend.address().port;
  const request = (
    path,
    body,
    origin = "https://app.riyadhpolohills.com",
    extra = {},
  ) =>
    fetch(base + "/api" + path, {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "X-Requested-With": "RiyadhAcademy",
        ...extra,
      },
      body: JSON.stringify(body),
    });
  assert.equal(
    (
      await request("/auth/register", {
        name: "Custom Domain Member",
        email: "custom@test.com",
        password: "Custom secure password",
        stableName: "Test Academy",
      })
    ).status,
    201,
  );
  let login = await request("/auth/login", {
    email: "custom@test.com",
    password: "Custom secure password",
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (await request("/auth/forgot-password", { email: "custom@test.com" }))
      .status,
    200,
  );
  const job = db
    .prepare(
      "SELECT * FROM email_outbox WHERE subject LIKE 'Reset your password%' ORDER BY rowid DESC LIMIT 1",
    )
    .get();
  const link = app.locals.emailSettings.decrypt(
    JSON.parse(job.details).recovery.linkEncrypted,
  );
  assert.equal(new URL(link).origin, "https://app.riyadhpolohills.com");
  const token = new URLSearchParams(new URL(link).hash.slice(1)).get(
    "reset-password",
  );
  assert.ok(
    db
      .prepare("SELECT token FROM password_resets WHERE token=?")
      .get(createHash("sha256").update(token).digest("hex")),
  );
  assert.equal(
    (
      await request("/auth/reset-password", {
        token,
        password: "Updated secure password",
      })
    ).status,
    200,
  );
  assert.equal(
    (await fetch(base + "/api/auth/me", { headers: { Cookie: cookie } }))
      .status,
    401,
  );
  assert.equal(
    (
      await request("/auth/login", {
        email: "custom@test.com",
        password: "Updated secure password",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/auth/login",
        { email: "custom@test.com", password: "Updated secure password" },
        "https://horsesacutionapp.vercel.app",
      )
    ).status,
    200,
  );
  for (const origin of [
    "https://attacker.example",
    "https://app.riyadhpolohills.com.attacker.example",
    "https://app.riyadhpolohills.com:444",
    "null",
  ]) {
    const response = await request(
      "/auth/forgot-password",
      { email: "custom@test.com" },
      origin,
      { "X-Forwarded-Host": "app.riyadhpolohills.com" },
    );
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "ORIGIN_REJECTED");
  }
  const direct = await fetch(
    process.env.ACADEMY_BACKEND_URL + "/api/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "RiyadhAcademy",
      },
      body: JSON.stringify({ email: "custom@test.com" }),
    },
  );
  assert.equal(direct.status, 403);
});
