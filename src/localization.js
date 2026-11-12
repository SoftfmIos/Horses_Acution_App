export const latinDigits = (value) =>
  typeof value === "string"
    ? value.replace(/[٠-٩۰-۹]/g, (c) =>
        "٠١٢٣٤٥٦٧٨٩".includes(c)
          ? String("٠١٢٣٤٥٦٧٨٩".indexOf(c))
          : String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)),
      )
    : value;
export function localizedName(record, ar, key = "name") {
  return latinDigits(
    (ar
      ? record[key + "Ar"] || record[key + "En"]
      : record[key + "En"] || record[key + "Ar"]) ||
      record[key] ||
      "",
  );
}
export function localizeRecord(record, ar) {
  const result = { ...record };
  for (const [key, value] of Object.entries(result))
    if (
      typeof value === "string" &&
      !/(?:En|Ar)$/.test(key) &&
      !/(?:^id$|Id$|_id$|code$|email$)/i.test(key)
    )
      result[key] = latinDigits(value);
  for (const key of [
    "name",
    "title",
    "instructor",
    "arena",
    "description",
    "breed",
  ])
    if (record[key] !== undefined) {
      result[key + "En"] = record[key + "En"] ?? record[key];
      result[key + "Ar"] = record[key + "Ar"] || "";
      result[key] = localizedName(result, ar, key);
    }
  return result;
}
export const collectionKeys = [
  "horses",
  "plans",
  "classes",
  "medical",
  "feeding",
  "tasks",
  "discounts",
  "vouchers",
  "inventory",
  "stalls",
  "boarding",
  "stockMovements",
  "members",
  "notifications",
  "instructors",
  "arenas",
  "breeds",
  "bookings",
  "proformas",
  "creditLedger",
  "payments",
  "waitlist",
  "attendance",
  "taskHistory",
];
export function missingCatalogues(data) {
  return ["breeds", "instructors", "arenas"].filter(
    (key) => !Array.isArray(data?.[key]),
  );
}
export function localizeData(data, ar) {
  const input = data && typeof data === "object" ? data : {};
  const result = { settings: null, creditBalance: 0, ...input };
  for (const key of collectionKeys)
    result[key] = Array.isArray(input[key])
      ? input[key]
          .filter((r) => r && typeof r === "object" && !Array.isArray(r))
          .map((r) => localizeRecord(r, ar))
      : [];
  return result;
}
