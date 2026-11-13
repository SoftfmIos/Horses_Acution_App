import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createAdmin } from "../server/admin.js";
import { resetDemo } from "../server/reset-demo.js";
import { importDemoMedia, commonsPhoto } from "../server/demo-media.js";
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
const id = (value) =>
  createHash("sha256").update(value).digest("hex").slice(0, 16);
function network(license = "Public domain", host = "upload.wikimedia.org") {
  return async (url) => {
    if (url.startsWith("https://commons.wikimedia.org/w/api.php")) {
      const key = id(new URL(url).searchParams.get("gsrsearch"));
      return Response.json({
        query: {
          pages: [
            {
              imageinfo: [
                {
                  url: `https://${host}/${key}.png`,
                  thumburl: `https://${host}/thumb-${key}.png`,
                  descriptionurl: `https://commons.wikimedia.org/wiki/File:${key}.png`,
                  extmetadata: {
                    LicenseShortName: { value: license },
                    Artist: { value: "Public-domain test source" },
                  },
                },
              ],
            },
          ],
        },
      });
    }
    assert.ok(url.startsWith("https://upload.wikimedia.org/"));
    return new Response(png, { headers: { "Content-Type": "image/png" } });
  };
}
test("online selector accepts public-domain photos and refuses restricted licences or untrusted download hosts", async () => {
  const photo = await commonsPhoto("horse", { fetcher: network() });
  assert.equal(photo.mime, "image/png");
  assert.equal(photo.source.license, "Public domain");
  await assert.rejects(
    commonsPhoto("horse", { fetcher: network("CC BY-SA 4.0") }),
    /No suitable/,
  );
  await assert.rejects(
    commonsPhoto("horse", { fetcher: network("CC0", "untrusted.example") }),
    /No suitable/,
  );
});
test("photo/document import preserves every account and transaction, links bilingual PDFs and is repeatable", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "academy-media-")),
    path = join(dir, "academy.sqlite");
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  let db = openDatabase(path);
  createApp(db);
  await createAdmin(db, {
    email: "abdul@softfm.com",
    password: "Existing admin password",
    name: "Abdul",
  });
  db.close();
  await resetDemo({ databasePath: path, apply: true, day: "2026-11-13" });
  const oldPreview = await importDemoMedia({
    databasePath: path,
    preview: true,
  });
  assert.equal(oldPreview.adminEmail, "abdul@softfm.com");
  const changed = new DatabaseSync(path);
  changed
    .prepare("UPDATE users SET email=? WHERE email=?")
    .run("a.alsagier@riyadhpolohills.com", "abdul@softfm.com");
  changed.close();
  const snapshot = () => {
    const data = new DatabaseSync(path);
    try {
      return Object.fromEntries(
        [
          "users",
          "sessions",
          "memberships",
          "reservations",
          "proformas",
          "payments",
          "credit_ledger",
          "email_settings",
        ].map((table) => [
          table,
          data.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all(),
        ]),
      );
    } finally {
      data.close();
    }
  };
  const before = snapshot();
  const preview = await importDemoMedia({ databasePath: path, preview: true });
  assert.equal(preview.plannedPhotos, 37);
  assert.equal(preview.adminEmail, "a.alsagier@riyadhpolohills.com");
  const ambiguous = new DatabaseSync(path);
  ambiguous
    .prepare(
      "INSERT INTO users(id,email,name,password,created_at) VALUES(?,?,?,?,?)",
    )
    .run(
      "old-address-user",
      "abdul@softfm.com",
      "Different old-address account",
      "not-a-login-hash",
      "2026-11-13T00:00:00Z",
    );
  ambiguous.close();
  await assert.rejects(
    importDemoMedia({ databasePath: path, preview: true }),
    /Multiple administrator email matches/,
  );
  const selected = await importDemoMedia({
    databasePath: path,
    preview: true,
    adminEmail: "a.alsagier@riyadhpolohills.com",
  });
  assert.equal(selected.adminEmail, "a.alsagier@riyadhpolohills.com");
  const cleanup = new DatabaseSync(path);
  cleanup.prepare("DELETE FROM users WHERE id='old-address-user'").run();
  cleanup.close();
  assert.deepEqual(snapshot(), before);
  await assert.rejects(
    importDemoMedia({
      databasePath: path,
      fetcher: async () => {
        throw new Error("network unavailable");
      },
    }),
    /network unavailable/,
  );
  assert.deepEqual(snapshot(), before);
  const result = await importDemoMedia({
    databasePath: path,
    fetcher: network(),
  });
  assert.equal(result.importedPhotos, 37);
  assert.equal(result.importedDocuments, 24);
  assert.deepEqual(snapshot(), before);
  db = openDatabase(path);
  t.after(() => db.close());
  assert.equal(
    db
      .prepare("SELECT count(*) n FROM records WHERE kind='profilePhotos'")
      .get().n,
    37,
  );
  assert.equal(
    db
      .prepare("SELECT count(*) n FROM records WHERE kind='horseDocuments'")
      .get().n,
    24,
  );
  const old = new DatabaseSync(result.backupFile, { readOnly: true });
  assert.equal(
    old
      .prepare("SELECT count(*) n FROM records WHERE kind='horseDocuments'")
      .get().n,
    0,
  );
  old.close();
  const again = await importDemoMedia({
    databasePath: path,
    fetcher: async () => {
      throw new Error("Cached import should not access internet");
    },
  });
  assert.equal(again.importedPhotos, 0);
  assert.equal(again.skippedPhotos, 37);
  assert.equal(again.skippedDocuments, 24);
  assert.deepEqual(snapshot(), before);
  const app = createApp(db, {
      clock: () => new Date("2026-11-13T09:00:00+03:00"),
    }),
    server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(() => new Promise((r) => server.close(r)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const credentials = JSON.parse(
    readFileSync(
      (await import("node:fs"))
        .readdirSync(join(dir, "backups"))
        .map((name) => join(dir, "backups", name))
        .find((name) => name.endsWith(".demo-logins.json")),
    ),
  ).users;
  const call = async (path, cookie, org) => {
    const response = await fetch(base + "/api" + path, {
      headers: { Cookie: cookie, "X-Stable-Id": org },
    });
    assert.equal(response.status, 200);
    return response.json();
  };
  for (const role of ["member", "caregiver"]) {
    const user = credentials.find((u) => u.role === role);
    const response = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: {
        Origin: base,
        "Content-Type": "application/json",
        "X-Requested-With": "RiyadhAcademy",
      },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    assert.equal(response.status, 200);
    const cookie = response.headers.get("set-cookie").split(";")[0],
      auth = await call("/auth/me", cookie, ""),
      org = auth.stables[0].id;
    const own = await call("/photos/members/" + auth.user.id, cookie, org);
    assert.ok(own.content);
    const ownPath = base + "/api/photos/members/" + auth.user.id;
    for (const method of ["PUT", "DELETE"]) {
      const changed = await fetch(ownPath, {
        method,
        headers: {
          Origin: base,
          Cookie: cookie,
          "X-Stable-Id": org,
          "X-Requested-With": "RiyadhAcademy",
          "Content-Type": "application/json",
        },
        ...(method === "PUT"
          ? { body: JSON.stringify({ content: png.toString("base64") }) }
          : {}),
      });
      assert.equal(changed.status, 200);
    }
    const other = await fetch(base + "/api/photos/members/demo-user-19", {
      headers: { Cookie: cookie, "X-Stable-Id": org },
    });
    assert.equal(other.status, 403);
    const data = await call("/data", cookie, org);
    assert.ok(data.ownedHorses.length);
    for (const horse of data.ownedHorses) {
      const profile = await call(
        "/horses/" + horse.id + "/profile",
        cookie,
        org,
      );
      assert.equal(profile.documents.length, 2);
      for (const document of profile.documents) {
        const download = await call(
          "/horse-documents/" + document.id,
          cookie,
          org,
        );
        assert.equal(download.mime, "application/pdf");
        assert.ok(
          Buffer.from(download.content, "base64")
            .subarray(0, 5)
            .equals(Buffer.from("%PDF-")),
        );
      }
    }
  }
});
