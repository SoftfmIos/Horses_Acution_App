import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname } from "node:path";
export function openDatabase(path) {
  if (path !== ":memory:")
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  if (path !== ":memory:") chmodSync(path, 0o600);
  db.exec(
    "PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;",
  );
  db.exec(`
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS organizations(id TEXT PRIMARY KEY,name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS memberships(user_id TEXT REFERENCES users(id),org_id TEXT REFERENCES organizations(id),role TEXT NOT NULL CHECK(role IN ('owner','member')),PRIMARY KEY(user_id,org_id));
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS invites(token TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),expires_at TEXT NOT NULL,used INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),kind TEXT NOT NULL,data TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS records_org_kind ON records(org_id,kind);
CREATE TABLE IF NOT EXISTS reservations(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),member_id TEXT REFERENCES users(id),class_id TEXT NOT NULL,horse_id TEXT,status TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS reservation_active ON reservations(org_id,member_id,class_id) WHERE status='confirmed';
CREATE TABLE IF NOT EXISTS proformas(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),member_id TEXT REFERENCES users(id),reservation_id TEXT UNIQUE,description TEXT NOT NULL,gross INTEGER NOT NULL,discount INTEGER NOT NULL,voucher INTEGER NOT NULL,due INTEGER NOT NULL,paid INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL,discount_id TEXT,voucher_id TEXT,external_ref TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS payments(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),proforma_id TEXT REFERENCES proformas(id),amount INTEGER NOT NULL,reference TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS notifications(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),user_id TEXT REFERENCES users(id),title TEXT NOT NULL,message TEXT NOT NULL,read_at TEXT,dedupe TEXT UNIQUE,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,org_id TEXT,actor_id TEXT,action TEXT,record_id TEXT,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS email_outbox(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0);
`);
  if (
    !db
      .prepare("PRAGMA table_info(payments)")
      .all()
      .some((c) => c.name === "external_ref")
  )
    db.exec(
      "ALTER TABLE payments ADD COLUMN external_ref TEXT NOT NULL DEFAULT ''",
    );
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS payments_reference ON payments(org_id,reference)",
  );
  if (path !== ":memory:") chmodSync(path, 0o600);
  db.exec(
    `CREATE TABLE IF NOT EXISTS credit_ledger(id TEXT PRIMARY KEY,org_id TEXT REFERENCES organizations(id),member_id TEXT REFERENCES users(id),delta INTEGER NOT NULL,reason TEXT NOT NULL,reservation_id TEXT,proforma_id TEXT,created_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS credits_member ON credit_ledger(org_id,member_id);`,
  );
  for (const column of ["credit_quantity", "credit_awarded", "credit_used"])
    if (
      !db
        .prepare("PRAGMA table_info(proformas)")
        .all()
        .some((c) => c.name === column)
    )
      db.exec(
        "ALTER TABLE proformas ADD COLUMN " +
          column +
          " INTEGER NOT NULL DEFAULT 0",
      );
  db.exec(`
UPDATE reservations SET status='pending_payment' WHERE status='confirmed' AND id IN (SELECT reservation_id FROM proformas WHERE status='open' AND due>paid);
DROP INDEX IF EXISTS reservation_active;
CREATE UNIQUE INDEX reservation_active ON reservations(org_id,member_id,class_id) WHERE status IN ('confirmed','pending_payment');
CREATE TABLE IF NOT EXISTS task_events(id TEXT PRIMARY KEY,org_id TEXT NOT NULL,task_id TEXT NOT NULL,actor_id TEXT REFERENCES users(id),action TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS profile_names(user_id TEXT PRIMARY KEY REFERENCES users(id),name_en TEXT NOT NULL DEFAULT '',name_ar TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS staff_roles(org_id TEXT NOT NULL,user_id TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('instructor','vet','caregiver')),PRIMARY KEY(org_id,user_id));
CREATE TABLE IF NOT EXISTS waitlist(id TEXT PRIMARY KEY,org_id TEXT NOT NULL,member_id TEXT NOT NULL,class_id TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(org_id,member_id,class_id));
CREATE TABLE IF NOT EXISTS attendance(reservation_id TEXT PRIMARY KEY,org_id TEXT NOT NULL,status TEXT NOT NULL,actor_id TEXT NOT NULL,updated_at TEXT NOT NULL);
`);
  return db;
}
