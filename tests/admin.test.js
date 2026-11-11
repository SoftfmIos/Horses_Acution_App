import { test } from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "../server/db.js";
import { createAdmin } from "../server/admin.js";
import { createApp } from "../server/app.js";

test("admin bootstrap creates a login-capable manager without invitations and is idempotent", async (t) => {
  const db = openDatabase(":memory:");
  t.after(() => db.close());
  const options = { email: "ADMIN@test.com", password: "123456" };
  const created = await createAdmin(db, options);
  assert.equal(created.created, true);
  const stored = db.prepare("SELECT * FROM users").get();
  assert.notEqual(stored.password, options.password);
  const app = createApp(db);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(() => new Promise((r) => server.close(r)));
  const base = "http://127.0.0.1:" + server.address().port;
  const response = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: {
      Origin: base,
      "X-Requested-With": "RiyadhAcademy",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "admin@test.com", password: "123456" }),
  });
  assert.equal(response.status, 200);
  const me = await (
    await fetch(base + "/api/auth/me", {
      headers: { Cookie: response.headers.get("set-cookie").split(";")[0] },
    })
  ).json();
  assert.equal(me.stables[0].role, "owner");
  const again = await createAdmin(db, { ...options, password: "654321" });
  assert.equal(again.created, false);
  assert.equal(
    db.prepare("SELECT password FROM users").get().password,
    stored.password,
  );
  assert.equal(db.prepare("SELECT count(*) n FROM organizations").get().n, 1);
});
test("bootstrap uses existing academy and requires selection when there are several", async () => {
  const db = openDatabase(":memory:");
  try {
    db.prepare("INSERT INTO organizations VALUES(?,?)").run(
      "one",
      "Existing academy",
    );
    assert.equal(
      (await createAdmin(db, { email: "one@test.com", password: "abcdef" }))
        .stableId,
      "one",
    );
    db.prepare("INSERT INTO organizations VALUES(?,?)").run(
      "two",
      "Other academy",
    );
    await assert.rejects(
      createAdmin(db, { email: "two@test.com", password: "abcdef" }),
      /Multiple academies/,
    );
    assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 1);
    assert.equal(
      (
        await createAdmin(db, {
          email: "two@test.com",
          password: "abcdef",
          stableId: "two",
        })
      ).stableId,
      "two",
    );
  } finally {
    db.close();
  }
});
test("bootstrap rejects short passwords and does not promote existing members", async () => {
  const db = openDatabase(":memory:");
  try {
    await assert.rejects(
      createAdmin(db, { email: "bad@test.com", password: "12345" }),
      /6–128/,
    );
    const admin = await createAdmin(db, {
      email: "member@test.com",
      password: "123456",
    });
    db.prepare("UPDATE memberships SET role='member'").run();
    await assert.rejects(
      createAdmin(db, {
        email: "member@test.com",
        password: "654321",
        stableId: admin.stableId,
      }),
      /already belongs/,
    );
    assert.equal(
      db.prepare("SELECT role FROM memberships").get().role,
      "member",
    );
  } finally {
    db.close();
  }
});
