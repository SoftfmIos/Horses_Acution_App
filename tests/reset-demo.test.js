import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import {
  mkdtempSync,
  rmSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { openDatabase } from "../server/db.js";
import { createApp, passwordHash } from "../server/app.js";
import { resetDemo } from "../server/reset-demo.js";

async function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "academy-demo-")),
    path = join(dir, "academy.sqlite");
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const db = openDatabase(path);
  createApp(db);
  const hash = await passwordHash("Original admin password");
  db.prepare("INSERT INTO users VALUES(?,?,?,?,?)").run(
    "keeper",
    "abdul@softfm.com",
    "Abdul",
    hash,
    "2026-01-01T00:00:00Z",
  );
  db.prepare("INSERT INTO users VALUES(?,?,?,?,?)").run(
    "old-user",
    "old@example.test",
    "Old data",
    hash,
    "2026-01-01T00:00:00Z",
  );
  db.exec(
    "INSERT INTO organizations VALUES('academy','Riyadh Polo Hills'); INSERT INTO memberships VALUES('keeper','academy','owner'); INSERT INTO memberships VALUES('old-user','academy','member'); INSERT INTO system_admins VALUES('academy','keeper'); INSERT INTO sessions VALUES('old-token','keeper','2027-01-01'); INSERT INTO email_settings VALUES('academy','{\"enabled\":true,\"password\":\"old-secret\"}')",
  );
  db.prepare("INSERT INTO records VALUES(?,?,?,?)").run(
    "old-horse",
    "academy",
    "horses",
    JSON.stringify({ name: "Old horse", notes: "Old private notes" }),
  );
  db.close();
  writeFileSync(path + ".email-key", Buffer.alloc(32, 7), { mode: 0o600 });
  return { dir, path, hash };
}
test("reset preview changes nothing; apply keeps Abdul/password, backs up all old data and seeds connected demo records", async (t) => {
  const { path, hash, dir } = await fixture(t);
  const photos = join(dir, "portraits");
  mkdirSync(photos);
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  for (const [prefix, count] of [
    ["horse", 12],
    ["instructor", 5],
  ])
    for (let n = 1; n <= count; n++)
      writeFileSync(
        join(photos, `${prefix}-${String(n).padStart(2, "0")}.png`),
        png,
      );
  const preview = await resetDemo({ databasePath: path });
  assert.equal(preview.existingUsersToDelete, 1);
  let db = new DatabaseSync(path);
  assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 2);
  db.close();
  const result = await resetDemo({
    databasePath: path,
    apply: true,
    day: "2026-11-13",
    photosDirectory: photos,
  });
  assert.equal(result.generated.photos, 17);
  const old = new DatabaseSync(result.backupFile, { readOnly: true });
  assert.equal(old.prepare("SELECT count(*) n FROM users").get().n, 2);
  assert.equal(
    old.prepare("SELECT count(*) n FROM records WHERE id='old-horse'").get().n,
    1,
  );
  old.close();
  assert.equal(statSync(result.backupFile).mode & 0o777, 0o600);
  assert.deepEqual(
    readFileSync(result.backupFile + ".email-key"),
    Buffer.alloc(32, 7),
  );
  assert.equal(statSync(result.credentialsFile).mode & 0o777, 0o600);
  db = openDatabase(path);
  t.after(() => db.close());
  assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 20);
  assert.equal(
    db.prepare("SELECT password FROM users WHERE id='keeper'").get().password,
    hash,
  );
  assert.equal(
    db.prepare("SELECT count(*) n FROM users WHERE id='old-user'").get().n,
    0,
  );
  assert.equal(db.prepare("SELECT count(*) n FROM sessions").get().n, 0);
  assert.equal(db.prepare("SELECT count(*) n FROM reservations").get().n, 100);
  for (const [kind, count] of [
    ["horses", 12],
    ["instructors", 5],
    ["feeding", 36],
    ["medical", 24],
  ])
    assert.equal(
      db.prepare("SELECT count(*) n FROM records WHERE kind=?").get(kind).n,
      count,
    );
  assert.equal(db.prepare("SELECT count(*) n FROM email_outbox").get().n, 0);
  assert.equal(
    JSON.parse(db.prepare("SELECT data FROM email_settings").get().data)
      .enabled,
    false,
  );
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
  for (const invoice of db
    .prepare(
      "SELECT p.*,coalesce((SELECT sum(amount) FROM payments WHERE proforma_id=p.id),0) actual FROM proformas p",
    )
    .all())
    assert.equal(invoice.paid, invoice.actual);
  for (const balance of db
    .prepare(
      "SELECT member_id,sum(delta) n FROM credit_ledger GROUP BY member_id",
    )
    .all())
    assert.ok(balance.n >= 0);
  const credentials = JSON.parse(readFileSync(result.credentialsFile)).users;
  const app = createApp(db, {
    clock: () => new Date("2026-11-13T09:00:00+03:00"),
    emailEnabled: true,
  });
  app.locals.remind();
  assert.equal(db.prepare("SELECT count(*) n FROM email_outbox").get().n, 0);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(() => new Promise((r) => server.close(r)));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function login(email, password) {
    const response = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: {
        Origin: base,
        "X-Requested-With": "RiyadhAcademy",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(response.status, 200);
    return response.headers.get("set-cookie").split(";")[0];
  }
  await login("abdul@softfm.com", "Original admin password");
  for (const role of ["member", "caregiver", "instructor"]) {
    const user = credentials.find((u) => u.role === role),
      cookie = await login(user.email, user.password);
    const response = await fetch(base + "/api/data?_fresh=demo-check", {
      headers: { Cookie: cookie, "X-Stable-Id": "academy" },
    });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.ok(Array.isArray(data.horses));
    if (role !== "instructor") assert.ok(data.ownedHorses.length > 0);
    for (const h of data.ownedHorses) {
      const profile = await fetch(base + "/api/horses/" + h.id + "/profile", {
        headers: { Cookie: cookie, "X-Stable-Id": "academy" },
      });
      assert.equal(profile.status, 200);
      const details = await profile.json();
      assert.ok(details.medical.length > 0);
      assert.ok(details.feeding.length > 0);
      const photo = await fetch(base + "/api/photos/horses/" + h.id, {
        headers: { Cookie: cookie, "X-Stable-Id": "academy" },
      });
      assert.equal(photo.status, 200);
      assert.equal((await photo.json()).mime, "image/png");
    }
  }
});
test("reset refuses missing keeper, unknown tables and ambiguous academies; empty reset preserves only Abdul", async (t) => {
  const { path } = await fixture(t);
  let db = new DatabaseSync(path);
  db.exec("CREATE TABLE future_private_data(id TEXT)");
  db.close();
  await assert.rejects(
    resetDemo({ databasePath: path, apply: true, empty: true }),
    /Unknown table/,
  );
  db = new DatabaseSync(path);
  db.exec(
    "DROP TABLE future_private_data; INSERT INTO organizations VALUES('second','Second'); INSERT INTO memberships VALUES('keeper','second','owner')",
  );
  db.close();
  await assert.rejects(
    resetDemo({ databasePath: path, apply: true, empty: true }),
    /ambiguous/,
  );
  const result = await resetDemo({
    databasePath: path,
    apply: true,
    empty: true,
    academyId: "academy",
  });
  assert.equal(result.status, "completed");
  db = new DatabaseSync(path);
  assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 1);
  assert.equal(db.prepare("SELECT count(*) n FROM organizations").get().n, 1);
  db.prepare("UPDATE users SET email='someone@example.test'").run();
  db.close();
  await assert.rejects(
    resetDemo({ databasePath: path, apply: true, empty: true }),
    /does not exist/,
  );
});
test("missing/invalid photo sets never trigger a reset", async (t) => {
  const { path, dir } = await fixture(t),
    photos = join(dir, "photos");
  mkdirSync(photos);
  await assert.rejects(
    resetDemo({ databasePath: path, apply: true, photosDirectory: photos }),
    /Missing photo/,
  );
  const db = new DatabaseSync(path);
  assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 2);
  db.close();
});

test("a seed insertion failure rolls back deletion and retains the complete backup", async (t) => {
  const { path, dir } = await fixture(t);
  let db = new DatabaseSync(path);
  db.exec(
    "CREATE TRIGGER abort_demo BEFORE INSERT ON users WHEN new.id LIKE 'demo-%' BEGIN SELECT RAISE(ABORT,'Injected seed failure'); END",
  );
  db.close();
  await assert.rejects(
    resetDemo({ databasePath: path, apply: true, day: "2026-11-13" }),
    /Injected seed failure/,
  );
  db = new DatabaseSync(path);
  assert.equal(db.prepare("SELECT count(*) n FROM users").get().n, 2);
  assert.equal(
    db.prepare("SELECT count(*) n FROM records WHERE id='old-horse'").get().n,
    1,
  );
  assert.equal(db.prepare("SELECT count(*) n FROM sessions").get().n, 1);
  assert.equal(
    JSON.parse(db.prepare("SELECT data FROM email_settings").get().data)
      .enabled,
    true,
  );
  db.close();
  const { readdirSync } = await import("node:fs");
  const backups = readdirSync(join(dir, "backups"));
  assert.ok(backups.some((name) => name.endsWith(".sqlite")));
  assert.ok(!backups.some((name) => name.endsWith(".demo-logins.json")));
});
