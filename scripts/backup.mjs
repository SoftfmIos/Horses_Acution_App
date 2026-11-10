import { backup } from "node:sqlite";
import { openDatabase } from "../server/db.js";
import { resolve } from "node:path";
import { existsSync, chmodSync } from "node:fs";
const target = process.argv[2];
if (!target) throw new Error("Supply a backup destination");
const source = process.env.DATABASE_PATH || resolve("data/academy.sqlite");
if (!existsSync(source)) throw new Error("Source database does not exist");
if (existsSync(target))
  throw new Error("Backup destination already exists; choose a new path");
const db = openDatabase(source);
try {
  await backup(db, target);
  chmodSync(target, 0o600);
  console.log("Database backup completed.");
} finally {
  db.close();
}
