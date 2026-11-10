import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import nodemailer from "nodemailer";
import { openDatabase } from "./db.js";
import { createApp } from "./app.js";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const production = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);
if (production) {
  let origin;
  try {
    origin = new URL(process.env.PUBLIC_ORIGIN);
  } catch {
    throw new Error("Set PUBLIC_ORIGIN to the exact HTTPS production origin");
  }
  if (
    origin.protocol !== "https:" ||
    origin.origin !== process.env.PUBLIC_ORIGIN
  )
    throw new Error(
      "PUBLIC_ORIGIN must be an HTTPS origin without a path or trailing slash",
    );
}
const db = openDatabase(
  process.env.DATABASE_PATH || resolve(root, "data/academy.sqlite"),
);
const emailEnabled = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD &&
  process.env.EMAIL_FROM,
);
const app = createApp(db, {
  production,
  publicOrigin: process.env.PUBLIC_ORIGIN,
  emailEnabled,
});
app.use(express.static(resolve(root, "dist")));
app.get("/{*path}", (req, res) =>
  res.sendFile(resolve(root, "dist/index.html")),
);
const server = app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(
    `Academy server listening on ${process.env.HOST || "127.0.0.1"}:${port}; email ${emailEnabled ? "enabled" : "not configured"}`,
  ),
);
let working = false;
const mail = emailEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      requireTLS: process.env.SMTP_PORT !== "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;
async function tick() {
  if (working) return;
  working = true;
  try {
    app.locals.remind();
    if (mail) {
      for (const job of db
        .prepare(
          "SELECT e.*,u.email FROM email_outbox e JOIN users u ON u.id=e.user_id WHERE e.status='pending' AND attempts<5 LIMIT 10",
        )
        .all()) {
        try {
          await mail.sendMail({
            from: process.env.EMAIL_FROM,
            to: job.email,
            subject: job.subject,
            text: job.body,
            messageId: `<${job.id}@academy.notifications>`,
          });
          db.prepare(
            "UPDATE email_outbox SET status='sent',attempts=attempts+1 WHERE id=?",
          ).run(job.id);
        } catch {
          db.prepare(
            "UPDATE email_outbox SET attempts=attempts+1 WHERE id=?",
          ).run(job.id);
          console.error("Email delivery failed; retained for retry");
        }
      }
    }
  } catch (e) {
    console.error("Reminder worker failed:", e.message);
  } finally {
    working = false;
  }
}
const timer = setInterval(tick, 60000);
tick();
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => {
    clearInterval(timer);
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
