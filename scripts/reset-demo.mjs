import { parseArgs } from "node:util";
import { resetDemo } from "../server/reset-demo.js";

try {
  const { values } = parseArgs({
    options: {
      apply: { type: "boolean", default: false },
      empty: { type: "boolean", default: false },
      "academy-id": { type: "string" },
      "photos-dir": { type: "string" },
      "backup-dir": { type: "string" },
      date: { type: "string" },
    },
  });
  const result = await resetDemo({
    databasePath: process.env.DATABASE_PATH,
    apply: values.apply,
    empty: values.empty,
    academyId: values["academy-id"],
    photosDirectory: values["photos-dir"],
    backupDirectory: values["backup-dir"],
    day: values.date,
  });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Reset/demo failed:", error.message);
  process.exitCode = 1;
}
