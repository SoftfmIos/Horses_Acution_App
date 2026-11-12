import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import proxy from "../api/backend.js";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";

test("Vercel proxy: configuration errors, backend failure, login cookies, CSRF and shared data", async (t) => {
  const saved = process.env.ACADEMY_BACKEND_URL;
  const db = openDatabase(":memory:");
  const frontend = express();
  frontend.use(express.json({ limit: "3mb" }));
  // Emulate the explicit Vercel rewrite, including nested authentication URLs.
  frontend.use((req, res, next) => {
    const original = new URL(req.url, "https://frontend.invalid");
    const rewritten = new URL("/api/backend", original.origin);
    rewritten.search = original.search;
    rewritten.searchParams.set(
      "__academy_path",
      original.pathname.slice("/api/".length),
    );
    req.url = rewritten.pathname + rewritten.search;
    next();
  });
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
  const scopedHeaders = {
    ...headers,
    Cookie: cookie,
    "X-Stable-Id": me.stables[0].id,
  };
  r = await fetch(base + "/api/records/horses", {
    method: "POST",
    headers: scopedHeaders,
    body: JSON.stringify({ name: "Proxy horse" }),
  });
  assert.equal(r.status, 201);
  const horse = await r.json();
  r = await fetch(base + "/api/records/horses/" + horse.id, {
    method: "PUT",
    headers: scopedHeaders,
    body: JSON.stringify({ name: "Updated through nested route" }),
  });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).name, "Updated through nested route");
  r = await fetch(base + "/api/records/medical", {
    method: "POST",
    headers: scopedHeaders,
    body: JSON.stringify({
      horseId: horse.id,
      type: "Medication",
      date: new Date().toISOString(),
      medication: "Prescribed",
      dose: "Prescribed dose",
      notes: "Vet instructions",
      frequencyHours: 8,
      durationDays: 1,
    }),
  });
  assert.equal(r.status, 201);
  const medical = await r.json();
  r = await fetch(base + "/api/data", { headers: scopedHeaders });
  const scheduled = await r.json();
  const dose = scheduled.tasks.find((t) => t.medicalId === medical.id);
  assert.ok(dose.id.includes("."));
  r = await fetch(base + "/api/tasks/" + dose.id + "/toggle", {
    method: "POST",
    headers: scopedHeaders,
    body: JSON.stringify({ done: true }),
  });
  assert.equal(r.status, 200);

  const documentContent = Buffer.from(
    "%PDF-1.4\n" + "x".repeat(150000),
  ).toString("base64");
  r = await fetch(base + "/api/horses/" + horse.id + "/documents", {
    method: "POST",
    headers: scopedHeaders,
    body: JSON.stringify({
      titleEn: "Passport",
      category: "passport",
      filename: "passport.pdf",
      content: documentContent,
    }),
  });
  assert.equal(r.status, 201);
  const document = await r.json();
  r = await fetch(base + "/api/horse-documents/" + document.id, {
    headers: scopedHeaders,
  });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).content, documentContent);
  r = await fetch(base + "/api/records/horses", {
    method: "POST",
    headers: scopedHeaders,
    body: JSON.stringify({ name: "Too large", notes: "x".repeat(150000) }),
  });
  assert.equal(r.status, 413);

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
