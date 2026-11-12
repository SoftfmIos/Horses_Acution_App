import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import nodemailer from "nodemailer";

export function emailSettings(db) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS email_settings(org_id TEXT PRIMARY KEY REFERENCES organizations(id), data TEXT NOT NULL)",
  );
  if (
    !db
      .prepare("PRAGMA table_info(email_outbox)")
      .all()
      .some((c) => c.name === "org_id")
  )
    db.exec("ALTER TABLE email_outbox ADD COLUMN org_id TEXT");
  if (
    !db
      .prepare("PRAGMA table_info(email_outbox)")
      .all()
      .some((c) => c.name === "details")
  )
    db.exec(
      "ALTER TABLE email_outbox ADD COLUMN details TEXT NOT NULL DEFAULT '{}'",
    );
  let key;
  function encryptionKey() {
    if (key) return key;
    const file = db.prepare("PRAGMA database_list").get().file;
    if (!file) return (key = randomBytes(32));
    const path = file + ".email-key";
    try {
      key = readFileSync(path);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      try {
        writeFileSync(path, randomBytes(32), { mode: 0o600, flag: "wx" });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
      key = readFileSync(path);
    }
    if (key.length !== 32) throw new Error("Invalid email encryption key");
    return key;
  }
  function encrypt(password) {
    const iv = randomBytes(12),
      cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
    const data = Buffer.concat([
      cipher.update(password, "utf8"),
      cipher.final(),
    ]);
    return [iv, cipher.getAuthTag(), data]
      .map((b) => b.toString("base64"))
      .join(".");
  }
  function decrypt(value) {
    const [iv, tag, data] = value
      .split(".")
      .map((s) => Buffer.from(s, "base64"));
    const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    cipher.setAuthTag(tag);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(
      "utf8",
    );
  }
  const stored = (org) =>
    JSON.parse(
      db.prepare("SELECT data FROM email_settings WHERE org_id=?").get(org)
        ?.data || "null",
    );
  const publicSettings = (org) => {
    const value = stored(org);
    return value
      ? {
          ...value,
          password: undefined,
          passwordSaved: Boolean(value.password),
        }
      : null;
  };
  function save(org, value) {
    const previous = stored(org);
    const data = {
      ...value,
      password: value.password ? encrypt(value.password) : previous?.password,
    };
    if (data.enabled && !data.password)
      throw new Error("Enter an SMTP password");
    db.prepare(
      "INSERT INTO email_settings VALUES(?,?) ON CONFLICT(org_id) DO UPDATE SET data=excluded.data",
    ).run(org, JSON.stringify(data));
    return publicSettings(org);
  }
  function config(org) {
    const value = stored(org);
    if (value)
      return value.enabled
        ? { ...value, password: decrypt(value.password) }
        : null;
    return process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.EMAIL_FROM
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          username: process.env.SMTP_USER,
          password: process.env.SMTP_PASSWORD,
          from: process.env.EMAIL_FROM,
        }
      : null;
  }
  function transport(value) {
    return nodemailer.createTransport({
      host: value.host,
      port: value.port,
      secure: value.port === 465,
      requireTLS: value.port !== 465,
      auth: { user: value.username, pass: value.password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }
  return {
    encrypt,
    decrypt,
    publicSettings,
    save,
    config,
    transport,
    enabled: (org) => {
      const value = stored(org);
      return value
        ? Boolean(value.enabled && value.password)
        : Boolean(
            process.env.SMTP_HOST &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASSWORD &&
            process.env.EMAIL_FROM,
          );
    },
  };
}
