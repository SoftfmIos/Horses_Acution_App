import { parseArgs } from "node:util";
import { importDemoMedia } from "../server/demo-media.js";
try {
  const { values } = parseArgs({
    options: {
      preview: { type: "boolean", default: false },
      replace: { type: "boolean", default: false },
      "academy-id": { type: "string" },
      "admin-email": { type: "string" },
      "photos-dir": { type: "string" },
    },
  });
  const result = await importDemoMedia({
    databasePath: process.env.DATABASE_PATH,
    preview: values.preview,
    replace: values.replace,
    academyId: values["academy-id"],
    adminEmail: values["admin-email"],
    localPhotosDirectory: values["photos-dir"],
    log: (message) => console.log(message),
  });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Demo photo/document import failed:", error.message);
  process.exitCode = 1;
}
