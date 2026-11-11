export async function api(path, { method = "GET", body, stableId } = {}) {
  const response = await fetch("/api" + path, {
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
    const e = new Error(data.error || "Request failed");
    e.status = response.status;
    throw e;
  }
  return data;
}
