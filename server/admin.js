import { randomUUID } from "node:crypto";
import { passwordHash } from "./app.js";

export async function createAdmin(
  db,
  {
    email,
    password,
    name = "Administrator",
    stableId,
    stableName = "Riyadh Polo Club Academy",
  },
) {
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    throw new Error("Set ADMIN_EMAIL to a valid email address.");
  if (
    typeof password !== "string" ||
    password.trim().length < 6 ||
    password.length > 128
  )
    throw new Error("Set ADMIN_PASSWORD to a password of 6–128 characters.");
  password = password.trim();
  if (
    !name.trim() ||
    name.length > 100 ||
    !stableName.trim() ||
    stableName.length > 100
  )
    throw new Error("Admin and academy names must contain 1–100 characters.");
  const encrypted = await passwordHash(password);
  db.exec("BEGIN IMMEDIATE");
  try {
    const academies = db.prepare("SELECT * FROM organizations").all();
    let academy;
    if (stableId) {
      academy = academies.find((a) => a.id === stableId);
      if (!academy)
        throw new Error("ADMIN_STABLE_ID does not match an existing academy.");
    } else {
      if (academies.length > 1)
        throw new Error(
          "Multiple academies exist. Set ADMIN_STABLE_ID to the academy to manage.",
        );
      academy = academies[0];
    }
    const existing = db
      .prepare("SELECT id FROM users WHERE email=?")
      .get(email);
    if (existing) {
      const owner =
        academy &&
        db
          .prepare(
            "SELECT user_id FROM memberships WHERE org_id=? AND user_id=? AND role='owner'",
          )
          .get(academy.id, existing.id);
      if (!owner)
        throw new Error(
          "This email already belongs to an account. No roles or password were changed; choose a new admin email.",
        );
      db.exec("COMMIT");
      return { created: false, email, stableId: academy.id };
    }
    const now = new Date().toISOString(),
      uid = randomUUID();
    if (!academy) {
      academy = { id: randomUUID(), name: stableName.trim() };
      db.prepare("INSERT INTO organizations VALUES(?,?)").run(
        academy.id,
        academy.name,
      );
    }
    db.prepare("INSERT INTO users VALUES(?,?,?,?,?)").run(
      uid,
      email,
      name.trim(),
      encrypted,
      now,
    );
    db.prepare("INSERT INTO memberships VALUES(?,?,?)").run(
      uid,
      academy.id,
      "owner",
    );
    db.prepare(
      "INSERT INTO audit(org_id,actor_id,action,record_id,created_at) VALUES(?,?,?,?,?)",
    ).run(academy.id, uid, "admin.bootstrap", uid, now);
    db.exec("COMMIT");
    return { created: true, email, stableId: academy.id };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
