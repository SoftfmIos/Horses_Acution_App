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
export function localizeData(data, ar) {
  const result = { ...data };
  for (const [key, rows] of Object.entries(data))
    if (Array.isArray(rows))
      result[key] = rows.map((r) =>
        typeof r === "object" && r !== null ? localizeRecord(r, ar) : r,
      );
  return result;
}
