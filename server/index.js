import backendConfig from "../config/backend.json" with { type: "json" };
import { renderEmail } from "./email-template.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
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
  allowedOrigins: [
    ...(backendConfig.allowedWebsiteOrigins || []),
    ...(process.env.ADDITIONAL_PUBLIC_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  ],
  emailEnabled,
});
app.use(express.static(resolve(root, "dist")));
app.get("/{*path}", (req, res) =>
  res.sendFile(resolve(root, "dist/index.html")),
);
const server = app.listen(
  globalThis.PhusionPassenger ? "passenger" : port,
  ...(globalThis.PhusionPassenger ? [] : [process.env.HOST || "127.0.0.1"]),
  () =>
    console.log(
      `Academy server listening on ${globalThis.PhusionPassenger ? "Passenger" : `${process.env.HOST || "127.0.0.1"}:${port}`}; email ${emailEnabled ? "enabled" : "not configured"}`,
    ),
);
let working = false;
async function tick() {
  if (working) return;
  working = true;
  try {
    app.locals.remind();
    {
      for (const job of db
        .prepare(
          "SELECT e.*,u.email FROM email_outbox e JOIN users u ON u.id=e.user_id WHERE e.status='pending' AND attempts<5",
        )
        .all()
        .filter((job) => app.locals.emailSettings.enabled(job.org_id))
        .slice(0, 10)) {
        try {
          const config = app.locals.emailSettings.config(job.org_id);
          if (!config) continue;
          const mail = app.locals.emailSettings.transport(config);
          const details = JSON.parse(job.details || "{}");
          if (details.credentials?.passwordEncrypted)
            details.credentials.password = app.locals.emailSettings.decrypt(
              details.credentials.passwordEncrypted,
            );
          if (details.recovery?.linkEncrypted)
            details.recovery.link = app.locals.emailSettings.decrypt(
              details.recovery.linkEncrypted,
            );
          await mail.sendMail({
            from: config.from,
            replyTo: config.replyTo || undefined,
            to: job.email,
            subject: job.subject,
            ...renderEmail({ ...job, details }),
            messageId: `<${job.id}@academy.notifications>`,
          });
          db.prepare(
            "UPDATE email_outbox SET status='sent',attempts=attempts+1,details=json_remove(details,'$.credentials.passwordEncrypted','$.recovery.linkEncrypted') WHERE id=?",
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
