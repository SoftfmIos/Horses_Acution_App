import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../server/db.js";
import { emailSettings } from "../server/email-settings.js";

test("SMTP password survives database reopen with a protected persistent key", () => {
  const dir = mkdtempSync(join(tmpdir(), "email-settings-"));
  const file = join(dir, "academy.sqlite");
  let db;
  try {
    db = openDatabase(file);
    db.prepare("INSERT INTO organizations VALUES(?,?)").run("stable", "Stable");
    emailSettings(db).save("stable", {
      enabled: true,
      host: "smtp.example.com",
      port: 465,
      username: "sender@example.com",
      from: "sender@example.com",
      password: "secret-password",
    });
    assert.equal(statSync(file + ".email-key").mode & 0o777, 0o600);
    db.close();
    db = openDatabase(file);
    assert.equal(
      emailSettings(db).config("stable").password,
      "secret-password",
    );
  } finally {
    db?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
