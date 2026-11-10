import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import proxy from "../api/[...path].js";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";

test("Vercel proxy: configuration errors, backend failure, login cookies, CSRF and shared data", async (t) => {
  const saved = process.env.ACADEMY_BACKEND_URL;
  const db = openDatabase(":memory:");
  const frontend = express();
  frontend.use(express.json());
  frontend.use(proxy);
  const f = frontend.listen(0, "127.0.0.1");
  await new Promise((r) => f.once("listening", r));
  const base = "http://127.0.0.1:" + f.address().port;
  const backend = createApp(db, { publicOrigin: base });
  const b = backend.listen(0, "127.0.0.1");
  await new Promise((r) => b.once("listening", r));
  t.after(async () => {
    if (saved === undefined) delete process.env.ACADEMY_BACKEND_URL;
    else process.env.ACADEMY_BACKEND_URL = saved;
    await new Promise((r) => f.close(r));
    await new Promise((r) => b.close(r));
    db.close();
  });
  delete process.env.ACADEMY_BACKEND_URL;
  let r = await fetch(base + "/api/health");
  assert.equal(r.status, 503);
  assert.equal((await r.json()).code, "BACKEND_NOT_CONFIGURED");
  process.env.ACADEMY_BACKEND_URL = "https://backend.example.com/path";
  r = await fetch(base + "/api/health");
  assert.equal(r.status, 503);
  process.env.ACADEMY_BACKEND_URL = base;
  r = await fetch(base + "/api/health");
  assert.equal(r.status, 503);
  process.env.ACADEMY_BACKEND_URL = "http://127.0.0.1:1";
  r = await fetch(base + "/api/health");
  assert.equal(r.status, 502);
  process.env.ACADEMY_BACKEND_URL = "http://127.0.0.1:" + b.address().port;
  r = await fetch(base + "/api/health");
  assert.equal(r.status, 200);
  assert.equal((await r.json()).database, true);
  const headers = {
    "Content-Type": "application/json",
    "X-Requested-With": "RiyadhAcademy",
    Origin: base,
  };
  r = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Proxy user",
      email: "proxy@test.com",
      password: "Proxy testing password 123",
      stableName: "Proxy academy",
    }),
  });
  assert.equal(r.status, 201);
  const cookie = r.headers.get("set-cookie").split(";")[0];
  assert.ok(r.headers.get("set-cookie").includes("HttpOnly"));
  r = await fetch(base + "/api/auth/me", { headers: { Cookie: cookie } });
  assert.equal(r.status, 200);
  const me = await r.json();
  r = await fetch(base + "/api/data", {
    headers: { Cookie: cookie, "X-Stable-Id": me.stables[0].id },
  });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).members[0].name, "Proxy user");
  r = await fetch(base + "/api/auth/logout", {
    method: "POST",
    headers: {
      ...headers,
      Cookie: cookie,
      Origin: "https://wrong.example.com",
    },
  });
  assert.equal(r.status, 403);
  r = await fetch(base + "/api/auth/logout", {
    method: "POST",
    headers: { ...headers, Cookie: cookie },
  });
  assert.equal(r.status, 200);
  assert.ok(r.headers.get("set-cookie").includes("Expires="));
  r = await fetch(base + "/api/auth/me", { headers: { Cookie: cookie } });
  assert.equal(r.status, 401);
});
