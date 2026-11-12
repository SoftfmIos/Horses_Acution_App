export async function api(path, { method = "GET", body, stableId } = {}) {
  const url = "/api" + path;
  // A unique URL also avoids intermediary caches that ignore fetch cache settings.
  const freshUrl =
    method === "GET"
      ? url + (url.includes("?") ? "&" : "?") + "_fresh=" + crypto.randomUUID()
      : url;
  const response = await fetch(freshUrl, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "RiyadhAcademy",
      ...(stableId ? { "X-Stable-Id": stableId } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server unavailable / الخادم غير متاح");
  }
  if (!response.ok) {
    const outdated =
      data.error === "Unknown module" || data.error === "Endpoint not found";
    const e = new Error(
      outdated
        ? "Backend update required: update the cPanel repository and restart Node.js. / يلزم تحديث الخادم: حدّث مستودع cPanel وأعد تشغيل Node.js."
        : data.error || "Request failed",
    );
    if (outdated) e.code = "BACKEND_UPDATE_REQUIRED";
    e.status = response.status;
    throw e;
  }
  return data;
}
