export function historyMonths(records, dateOf, ar = false) {
  const groups = new Map();
  for (const item of records) {
    const value = dateOf(item);
    const timestamp = value ? Date.parse(value) : NaN;
    const key = Number.isFinite(timestamp)
      ? new Date(timestamp + 3 * 3600000).toISOString().slice(0, 7)
      : "undated";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ item, timestamp });
  }
  return [...groups]
    .sort(([a], [b]) =>
      a === "undated" ? 1 : b === "undated" ? -1 : b.localeCompare(a),
    )
    .map(([key, rows]) => ({
      key,
      title:
        key === "undated"
          ? ar
            ? "بدون تاريخ"
            : "Undated"
          : new Intl.DateTimeFormat(ar ? "ar-SA-u-ca-gregory" : "en-SA", {
              month: "long",
              year: "numeric",
              timeZone: "Asia/Riyadh",
            }).format(new Date(key + "-01T12:00:00Z")),
      items: rows
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .map((row) => row.item),
    }));
}
