import { DatabaseSync, backup } from "node:sqlite";
import {
  existsSync,
  statSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  chmodSync,
  constants,
  unlinkSync,
} from "node:fs";
import { isAbsolute, dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { DEMO_KEEP_EMAIL, prepareDemo, seedDemo } from "./demo-data.js";

const tables = [
  "sessions",
  "notifications",
  "email_outbox",
  "task_events",
  "password_resets",
  "deleted_accounts",
  "attendance",
  "waitlist",
  "credit_ledger",
  "payments",
  "proformas",
  "reservations",
  "audit",
  "records",
  "invites",
  "email_settings",
  "staff_permissions",
  "staff_roles",
  "system_admins",
  "profile_names",
  "memberships",
  "users",
  "organizations",
];
function inspect(db, academyId) {
  const present = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    )
    .all()
    .map((r) => r.name);
  for (const name of present)
    if (!tables.includes(name))
      throw new Error(
        `Unknown table '${name}'; reset refused until its retention rules are reviewed.`,
      );
  const keeper = db
    .prepare("SELECT * FROM users WHERE lower(email)=?")
    .get(DEMO_KEEP_EMAIL);
  if (!keeper)
    throw new Error(
      `Required account ${DEMO_KEEP_EMAIL} does not exist. Nothing was deleted.`,
    );
  if (
    present.includes("deleted_accounts") &&
    db.prepare("SELECT 1 FROM deleted_accounts WHERE user_id=?").get(keeper.id)
  )
    throw new Error(
      "The preserved account is deleted/disabled. Restore it before resetting.",
    );
  const academies = db
    .prepare(
      "SELECT o.* FROM organizations o JOIN memberships m ON o.id=m.org_id WHERE m.user_id=?",
    )
    .all(keeper.id);
  const academy = academyId
    ? academies.find((a) => a.id === academyId)
    : academies.length === 1
      ? academies[0]
      : null;
  if (!academy)
    throw new Error(
      "Choose one of Abdul's existing academies using --academy-id; reset refused because the target is ambiguous.",
    );
  const profile = present.includes("profile_names")
    ? db.prepare("SELECT * FROM profile_names WHERE user_id=?").get(keeper.id)
    : null;
  const counts = Object.fromEntries(
    present.map((name) => [
      name,
      db.prepare(`SELECT count(*) AS n FROM "${name}"`).get().n,
    ]),
  );
  return { keeper, academy, profile, present, counts };
}

export async function resetDemo({
  databasePath,
  academyId,
  apply = false,
  empty = false,
  photosDirectory,
  day,
  backupDirectory,
} = {}) {
  if (
    !databasePath ||
    !isAbsolute(databasePath) ||
    !existsSync(databasePath) ||
    !statSync(databasePath).isFile()
  )
    throw new Error(
      "Set DATABASE_PATH to the existing absolute SQLite database filename. A missing database will never be created.",
    );
  let db = new DatabaseSync(databasePath, { readOnly: !apply });
  let inTransaction = false,
    credentialsFile;
  try {
    const before = inspect(db, academyId);
    const report = {
      mode: apply ? "apply" : "preview — no database changes",
      databasePath,
      preservedAccount: DEMO_KEEP_EMAIL,
      academyId: before.academy.id,
      academyName: before.academy.name,
      removesAllOtherAcademies: true,
      existingRows: before.counts,
      existingUsersToDelete: before.counts.users - 1,
      replacement: empty
        ? "Abdul only; no demo dataset"
        : "20 total users including Abdul, 12 horses, 5 instructors, 100 bookings, 36 feeding plans and care history",
      photos: photosDirectory
        ? "17 JPEG/PNG files will be validated before any deletion"
        : "No photos supplied; portraits are not included",
      outboundEmail: "disabled; previous SMTP settings removed",
    };
    if (!apply) return report;
    const prepared = empty ? null : await prepareDemo({ day, photosDirectory });
    const directory = backupDirectory || join(dirname(databasePath), "backups");
    if (!isAbsolute(directory))
      throw new Error(
        "Backup directory must be an absolute private path outside the website public directory.",
      );
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const backupFile = join(
      directory,
      `academy-before-demo-${Date.now()}-${randomUUID()}.sqlite`,
    );
    db.exec(
      "PRAGMA foreign_keys=ON; PRAGMA busy_timeout=10000; BEGIN IMMEDIATE",
    );
    inTransaction = true;
    // Freeze other writers, then take a coherent read-only backup of the committed database.
    const locked = inspect(db, academyId);
    if (
      locked.keeper.id !== before.keeper.id ||
      locked.keeper.password !== before.keeper.password
    )
      throw new Error(
        "Account changed during preparation; reset refused. Run preview again.",
      );
    writeFileSync(backupFile, "", { flag: "wx", mode: 0o600 });
    const reader = new DatabaseSync(databasePath, { readOnly: true });
    try {
      await backup(reader, backupFile);
    } finally {
      reader.close();
    }
    chmodSync(backupFile, 0o600);
    if (existsSync(databasePath + ".email-key")) {
      copyFileSync(
        databasePath + ".email-key",
        backupFile + ".email-key",
        constants.COPYFILE_EXCL,
      );
      chmodSync(backupFile + ".email-key", 0o600);
    }
    if (prepared) {
      credentialsFile = backupFile + ".demo-logins.json";
      writeFileSync(
        credentialsFile,
        JSON.stringify(
          {
            notice:
              "Private demo credentials. Abdul keeps his existing password. Never upload this file to GitHub or a public directory.",
            users: prepared.users.map(
              ({ email, name, nameAr, role, password }) => ({
                email,
                name,
                nameAr,
                role,
                password,
              }),
            ),
          },
          null,
          2,
        ) + "\n",
        { flag: "wx", mode: 0o600 },
      );
    }
    for (const name of tables) {
      if (!locked.present.includes(name)) continue;
      if (name === "users")
        db.prepare("DELETE FROM users WHERE id<>?").run(locked.keeper.id);
      else if (name === "organizations")
        db.prepare("DELETE FROM organizations WHERE id<>?").run(
          locked.academy.id,
        );
      else db.exec(`DELETE FROM "${name}"`);
    }
    db.prepare("INSERT INTO memberships VALUES(?,?,'owner')").run(
      locked.keeper.id,
      locked.academy.id,
    );
    db.prepare("INSERT INTO system_admins VALUES(?,?)").run(
      locked.academy.id,
      locked.keeper.id,
    );
    if (locked.profile)
      db.prepare("INSERT INTO profile_names VALUES(?,?,?)").run(
        locked.keeper.id,
        locked.profile.name_en,
        locked.profile.name_ar,
      );
    let generated;
    if (prepared)
      generated = seedDemo(db, locked.academy.id, locked.keeper, prepared);
    else
      db.prepare("INSERT INTO email_settings(org_id,data) VALUES(?,?)").run(
        locked.academy.id,
        JSON.stringify({ enabled: false }),
      );
    if (db.prepare("PRAGMA foreign_key_check").all().length)
      throw new Error("Integrity check failed; entire reset rolled back.");
    if (
      db.prepare("SELECT password FROM users WHERE id=?").get(locked.keeper.id)
        ?.password !== locked.keeper.password
    )
      throw new Error("Preserved password changed; entire reset rolled back.");
    db.exec("COMMIT");
    inTransaction = false;
    return {
      ...report,
      backupFile,
      credentialsFile,
      generated,
      status: "completed",
      next: "Restart the Node app. Sign in as abdul@softfm.com using the existing password.",
    };
  } catch (error) {
    if (inTransaction) {
      db.exec("ROLLBACK");
      if (credentialsFile) {
        try {
          unlinkSync(credentialsFile);
        } catch {
          /* Keep original failure. */
        }
      }
    }
    throw error;
  } finally {
    db.close();
  }
}
