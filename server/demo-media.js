import { DatabaseSync, backup } from "node:sqlite";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync,
  copyFileSync,
  constants,
} from "node:fs";
import { resolve, dirname, join, isAbsolute } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { DEMO_KEEP_EMAIL } from "./demo-data.js";

const assetRoot = resolve(import.meta.dirname, "../demo-assets");
const userAgent = "RiyadhPoloHillsDemo/1.0 (support@riyadhpolohills.com)";
const checksum = (bytes) => createHash("sha256").update(bytes).digest("hex");
function imageMime(bytes) {
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return "image/jpeg";
  throw new Error("Downloaded profile photo is not a JPEG or PNG.");
}
function asset(file, sha256, root) {
  const path = resolve(root, file);
  if (!path.startsWith(resolve(root) + "/"))
    throw new Error("Invalid bundled asset path.");
  const bytes = readFileSync(path);
  if (checksum(bytes) !== sha256)
    throw new Error(`Bundled asset checksum mismatch: ${file}`);
  return bytes;
}
const online = [
  ["horse-07", "white Arabian horse"],
  ["horse-08", "black horse"],
  ["horse-09", "buckskin horse"],
  ["horse-10", "bay Arabian horse"],
  ["horse-11", "grey horse"],
  ["horse-12", "pinto horse"],
  ["instructor-01", "polo mallet"],
  ["instructor-02", "horse saddle"],
  ["instructor-03", "riding helmet"],
  ["instructor-04", "riding boots"],
  ["instructor-05", "equestrian arena"],
];
export async function commonsPhoto(
  query,
  { fetcher = fetch, used = new Set() } = {},
) {
  for (const search of [
    `${query} incategory:CC-Zero filetype:bitmap`,
    `${query} filetype:bitmap`,
  ]) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: search,
      gsrnamespace: "6",
      gsrlimit: "40",
      prop: "imageinfo",
      iiprop: "url|mime|extmetadata",
      iiurlwidth: "512",
      iiurlheight: "512",
      format: "json",
      formatversion: "2",
      uselang: "en",
    });
    const response = await fetcher(
      "https://commons.wikimedia.org/w/api.php?" + params,
      {
        headers: { "User-Agent": userAgent, Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
        redirect: "error",
      },
    );
    if (!response.ok)
      throw new Error(
        `Wikimedia search failed (${response.status}). Retry the same photo-only command; the database has not changed.`,
      );
    const data = await response.json();
    for (const page of data.query?.pages || []) {
      const info = page.imageinfo?.[0],
        meta = info?.extmetadata || {},
        license = meta.LicenseShortName?.value || "";
      // Use only CC0/public-domain images; no third-party person portraits are required.
      if (!/^(CC0|public domain|PD(?:-|$))/i.test(license) || !info) continue;
      const href = info.thumburl || info.url;
      let url;
      try {
        url = new URL(href);
      } catch {
        continue;
      }
      if (
        url.protocol !== "https:" ||
        url.hostname !== "upload.wikimedia.org" ||
        (url.port && url.port !== "443") ||
        used.has(info.url)
      )
        continue;
      const photo = await fetcher(href, {
        headers: { "User-Agent": userAgent },
        signal: AbortSignal.timeout(20000),
        redirect: "error",
      });
      if (!photo.ok) continue;
      if (Number(photo.headers.get("content-length")) > 512 * 1024) continue;
      const chunks = [];
      let size = 0;
      for await (const chunk of photo.body) {
        size += chunk.length;
        if (size > 512 * 1024) break;
        chunks.push(chunk);
      }
      if (!size || size > 512 * 1024) continue;
      const bytes = Buffer.concat(chunks);
      let mime;
      try {
        mime = imageMime(bytes);
      } catch {
        continue;
      }
      used.add(info.url);
      return {
        bytes,
        mime,
        source: {
          type: "internet",
          page: info.descriptionurl,
          original: info.url,
          download: href,
          license,
          artist: String(meta.Artist?.value || "").replace(/<[^>]*>/g, ""),
        },
      };
    }
  }
  throw new Error(
    `No suitable CC0/public-domain image found for '${query}'. No database changes were made. Retry later or provide a local photo folder.`,
  );
}
function target(db, academyId, adminEmail) {
  const emails = adminEmail
    ? [adminEmail.trim().toLowerCase()]
    : ["a.alsagier@riyadhpolohills.com", DEMO_KEEP_EMAIL];
  const matches = db
    .prepare(
      `SELECT id,email FROM users WHERE lower(email) IN (${emails.map(() => "?").join(",")})`,
    )
    .all(...emails);
  if (!matches.length)
    throw new Error(
      "Demo administrator account not found. Use --admin-email with your current login email. No data changed.",
    );
  if (matches.length !== 1)
    throw new Error(
      "Multiple administrator email matches. Select the current administrator using --admin-email. No data changed.",
    );
  const keeper = matches[0];
  const eligible = db
    .prepare(
      "SELECT o.id,o.name,r.data FROM organizations o JOIN memberships m ON m.org_id=o.id JOIN system_admins a ON a.org_id=o.id AND a.user_id=m.user_id JOIN records r ON r.org_id=o.id AND r.kind='academySettings' WHERE m.user_id=? AND m.role='owner'",
    )
    .all(keeper.id)
    .filter((r) => JSON.parse(r.data).demoMode === true);
  const org = academyId
    ? eligible.find((r) => r.id === academyId)
    : eligible.length === 1
      ? eligible[0]
      : null;
  if (!org)
    throw new Error(
      "Select one existing demo academy using --academy-id. This command never resets or creates an academy.",
    );
  const records = db
    .prepare(
      "SELECT id,kind,data FROM records WHERE org_id=? AND kind IN ('horses','instructors')",
    )
    .all(org.id);
  const names = {
    horses: [
      "Shams",
      "Badr",
      "Najma",
      "Sahab",
      "Rimal",
      "Barq",
      "Lulwa",
      "Faris",
      "Al Anoud",
      "Sultan",
      "Reem",
      "Wadi",
    ],
  };
  for (let n = 0; n < 12; n++) {
    const rid = `demo-horse-${String(n + 1).padStart(2, "0")}`,
      horse = records.find((r) => r.kind === "horses" && r.id === rid);
    if (!horse || JSON.parse(horse.data).name !== names.horses[n])
      throw new Error(
        `Expected demo horse ${rid} (${names.horses[n]}) is missing or renamed; review before attaching sample documents.`,
      );
  }
  for (let n = 0; n < 5; n++)
    if (
      !records.some(
        (r) =>
          r.kind === "instructors" &&
          r.id === `demo-instructor-${String(n + 1).padStart(2, "0")}`,
      )
    )
      throw new Error(
        "An expected demo instructor is missing. No data changed.",
      );
  const members = db
    .prepare(
      "SELECT u.id,u.email FROM users u JOIN memberships m ON m.user_id=u.id WHERE m.org_id=?",
    )
    .all(org.id);
  const userIds = new Set(members.map((u) => u.id));
  for (let n = 0; n < 19; n++)
    if (!userIds.has(`demo-user-${String(n + 1).padStart(2, "0")}`))
      throw new Error("An expected demo user is missing. No data changed.");
  return { org, keeper, records };
}
export async function importDemoMedia({
  databasePath,
  academyId,
  adminEmail,
  preview = false,
  replace = false,
  root = assetRoot,
  fetcher = fetch,
  localPhotosDirectory,
  log = () => {},
} = {}) {
  if (
    !databasePath ||
    !isAbsolute(databasePath) ||
    !existsSync(databasePath) ||
    !statSync(databasePath).isFile()
  )
    throw new Error(
      "Set DATABASE_PATH to the same existing absolute SQLite filename used by the backend.",
    );
  const manifest = JSON.parse(
    readFileSync(join(root, "manifest.json"), "utf8"),
  );
  let db = new DatabaseSync(databasePath, { readOnly: preview });
  let locked = false;
  try {
    const before = target(db, academyId, adminEmail),
      summary = {
        academyId: before.org.id,
        adminEmail: before.keeper.email,
        academy: before.org.name,
        plannedPhotos: 37,
        plannedDocuments: 24,
        mode: preview ? "preview — no changes" : "photo/document import",
        existingPhotosPreserved: !replace,
      };
    if (preview) return summary;
    const photos = new Map();
    for (const item of manifest.assets) {
      const bytes = asset(item.file, item.sha256, root);
      if (bytes.length > 512 * 1024)
        throw new Error("Bundled photo is too large.");
      photos.set(item.key, {
        bytes,
        mime: imageMime(bytes),
        source: { type: "bundled", description: item.source },
      });
    }
    const documents = manifest.documents.map((item) => {
      const bytes = asset(item.file, item.sha256, root);
      if (
        !bytes.subarray(0, 5).equals(Buffer.from("%PDF-")) ||
        bytes.length > 2 * 1024 * 1024
      )
        throw new Error("Invalid bundled PDF.");
      return { ...item, bytes };
    });
    if (documents.length !== 24)
      throw new Error("Expected 24 complete demo documents.");
    const cache = join(dirname(databasePath), "demo-media-cache");
    mkdirSync(cache, { recursive: true, mode: 0o700 });
    const used = new Set();
    for (const [key, query] of online) {
      const cacheFile = join(cache, key + ".json");
      let value;
      if (localPhotosDirectory) {
        const file = ["jpg", "jpeg", "png"]
          .map((ext) => join(localPhotosDirectory, key + "." + ext))
          .find(existsSync);
        if (!file) throw new Error(`Missing local photo for ${key}.`);
        const bytes = readFileSync(file);
        if (bytes.length > 512 * 1024)
          throw new Error("Local photos must be at most 512 KB.");
        value = {
          bytes,
          mime: imageMime(bytes),
          source: {
            type: "local",
            description: "Operator-supplied demo photo",
          },
        };
      } else if (existsSync(cacheFile)) {
        const saved = JSON.parse(readFileSync(cacheFile, "utf8")),
          bytes = Buffer.from(saved.content, "base64");
        if (bytes.length > 512 * 1024 || checksum(bytes) !== saved.sha256)
          throw new Error(
            "Cached photo failed validation; remove its cache file and retry.",
          );
        value = { bytes, mime: imageMime(bytes), source: saved.source };
      } else {
        log(`Downloading ready-made photo: ${key}`);
        value = await commonsPhoto(query, { fetcher, used });
        writeFileSync(
          cacheFile,
          JSON.stringify({
            content: value.bytes.toString("base64"),
            sha256: checksum(value.bytes),
            source: value.source,
          }),
          { mode: 0o600 },
        );
      }
      if (value.source.original) used.add(value.source.original);
      photos.set(key, value);
    }
    const planned = [];
    const add = (kind, rid, key) => {
      const photo = photos.get(key);
      if (!photo) throw new Error(`Missing prepared photo ${key}.`);
      planned.push({ kind, rid, ...photo });
    };
    for (let n = 1; n <= 12; n++)
      add(
        "horses",
        `demo-horse-${String(n).padStart(2, "0")}`,
        `horse-${String(n).padStart(2, "0")}`,
      );
    for (let n = 1; n <= 5; n++)
      add(
        "instructors",
        `demo-instructor-${String(n).padStart(2, "0")}`,
        `instructor-${String(n).padStart(2, "0")}`,
      );
    const avatarKeys = [
      ...Array.from(
        { length: 12 },
        (_, n) => `horse-${String(n + 1).padStart(2, "0")}`,
      ),
      "avatar-club",
      "avatar-riding",
      "avatar-polo",
    ];
    for (let n = 1; n <= 19; n++)
      add(
        "members",
        `demo-user-${String(n).padStart(2, "0")}`,
        n <= 5
          ? `instructor-${String(n).padStart(2, "0")}`
          : avatarKeys[(n - 6) % avatarKeys.length],
      );
    add("members", before.keeper.id, "avatar-club");
    const backupDirectory = join(dirname(databasePath), "backups");
    mkdirSync(backupDirectory, { recursive: true, mode: 0o700 });
    const backupFile = join(
      backupDirectory,
      `academy-before-demo-media-${Date.now()}-${randomUUID()}.sqlite`,
    );
    db.exec(
      "PRAGMA foreign_keys=ON; PRAGMA busy_timeout=10000; BEGIN IMMEDIATE",
    );
    locked = true;
    const current = target(db, academyId, adminEmail);
    if (
      current.org.id !== before.org.id ||
      current.keeper.id !== before.keeper.id
    )
      throw new Error("Demo academy changed while downloading; retry.");
    writeFileSync(backupFile, "", { mode: 0o600, flag: "wx" });
    const reader = new DatabaseSync(databasePath, { readOnly: true });
    try {
      await backup(reader, backupFile);
    } finally {
      reader.close();
    }
    if (existsSync(databasePath + ".email-key"))
      copyFileSync(
        databasePath + ".email-key",
        backupFile + ".email-key",
        constants.COPYFILE_EXCL,
      );
    const put = (kind, rid, data) => {
      const existing = db
        .prepare("SELECT org_id,kind FROM records WHERE id=?")
        .get(rid);
      if (existing && existing.org_id !== current.org.id)
        throw new Error("Demo media ID belongs to another academy.");
      if (existing && existing.kind !== kind)
        throw new Error("Demo media ID belongs to a different record type.");
      db.prepare(
        "INSERT INTO records(id,org_id,kind,data) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
      ).run(rid, current.org.id, kind, JSON.stringify(data));
    };
    const now = new Date().toISOString();
    let importedPhotos = 0,
      importedDocuments = 0,
      skippedPhotos = 0,
      skippedDocuments = 0;
    for (const photo of planned) {
      const rid = `photo:${current.org.id}:${photo.kind}:${photo.rid}`,
        existing = db
          .prepare(
            "SELECT data FROM records WHERE org_id=? AND kind='profilePhotos' AND id=?",
          )
          .get(current.org.id, rid);
      if (existing && JSON.parse(existing.data).content && !replace) {
        skippedPhotos++;
        continue;
      }
      put("profilePhotos", rid, {
        mime: photo.mime,
        content: photo.bytes.toString("base64"),
        updatedAt: now,
        demoSource: photo.source,
      });
      importedPhotos++;
    }
    for (const item of documents) {
      const existing = db
        .prepare(
          "SELECT id FROM records WHERE org_id=? AND kind='horseDocuments' AND id=?",
        )
        .get(current.org.id, item.id);
      if (existing && !replace) {
        skippedDocuments++;
        continue;
      }
      put("horseDocuments", item.id, {
        horseId: item.horseId,
        title: item.title,
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        category: item.category,
        filename: item.filename,
        mime: "application/pdf",
        size: item.bytes.length,
        createdAt: now,
        createdBy: current.keeper.id,
        demo: true,
      });
      put("documentContent", item.id + "-content", {
        content: item.bytes.toString("base64"),
      });
      importedDocuments++;
    }
    db.prepare(
      "INSERT INTO audit(org_id,actor_id,action,record_id,created_at) VALUES(?,?,?,?,?)",
    ).run(
      current.org.id,
      current.keeper.id,
      "demo.import-media",
      current.org.id,
      now,
    );
    if (db.prepare("PRAGMA foreign_key_check").all().length)
      throw new Error("Database integrity check failed.");
    db.exec("COMMIT");
    locked = false;
    return {
      ...summary,
      importedPhotos,
      importedDocuments,
      skippedPhotos,
      skippedDocuments,
      backupFile,
      status: "completed",
      note: "Refresh the website and app. Existing users, passwords, sessions, bookings, invoices and balances were preserved.",
    };
  } catch (error) {
    if (locked) db.exec("ROLLBACK");
    throw error;
  } finally {
    db.close();
  }
}
