import { isAbsolute } from "node:path";
import { openDatabase } from "../server/db.js";
import { createAdmin } from "../server/admin.js";

let db;
try {
  const path = process.env.DATABASE_PATH;
  if (!path || !isAbsolute(path))
    throw new Error(
      "Set DATABASE_PATH to the same absolute database path used by your Node.js application.",
    );
  db = openDatabase(path);
  const result = await createAdmin(db, {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME || "Administrator",
    stableId: process.env.ADMIN_STABLE_ID,
    stableName: process.env.ADMIN_STABLE_NAME || "Riyadh Polo Club Academy",
  });
  console.log(
    result.created
      ? "Admin created. Sign in with ADMIN_EMAIL and the password you supplied."
      : "This admin already exists. Its password was not changed; use the existing password.",
  );
  console.log("Academy ID:", result.stableId);
} catch (error) {
  console.error("Admin creation failed:", error.message);
  process.exitCode = 1;
} finally {
  db?.close();
}
