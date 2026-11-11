import backendConfig from "../config/backend.json" with { type: "json" };
// Vercel's stateless function forwards API requests to the persistent Node service.
// DATABASE_PATH belongs on that service, not in Vercel Functions.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const configured =
    process.env.ACADEMY_BACKEND_URL ||
    (process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
      ? backendConfig.productionOrigin
      : undefined);
  if (!configured) {
    return res.status(503).json({
      error: "Academy backend is not connected. / خادم الأكاديمية غير متصل.",
      code: "BACKEND_NOT_CONFIGURED",
    });
  }
  let backend;
  try {
    backend = new URL(configured);
    const local = ["127.0.0.1", "localhost"].includes(backend.hostname);
    if (
      (!local && backend.protocol !== "https:") ||
      !["https:", "http:"].includes(backend.protocol) ||
      backend.pathname !== "/" ||
      backend.search ||
      backend.hash ||
      backend.username ||
      backend.password ||
      backend.host.toLowerCase() === (req.headers.host || "auto").toLowerCase()
    )
      throw new Error("Invalid backend origin");
  } catch {
    return res.status(503).json({
      error:
        "Academy backend configuration is invalid. / إعداد خادم الأكاديمية غير صالح.",
      code: "BACKEND_CONFIG_INVALID",
    });
  }
  const incoming = new URL(req.url, "https://frontend.invalid");
  const routedPath =
    incoming.searchParams.get("__academy_path") ??
    req.query?.__academy_path ??
    null;
  if (routedPath !== null) {
    if (
      typeof routedPath !== "string" ||
      !/^[a-zA-Z0-9_:/-]+$/.test(routedPath) ||
      routedPath.startsWith("/") ||
      routedPath.includes("//")
    )
      return res.status(400).json({ error: "Invalid API path" });
    incoming.pathname = "/api/" + routedPath;
    incoming.searchParams.delete("__academy_path");
  }
  if (!incoming.pathname.startsWith("/api/"))
    return res.status(404).json({ error: "API route not found" });
  const target = new URL(incoming.pathname + incoming.search, backend.origin);
  const headers = {};
  // Explicitly forward authentication and CSRF context; never forward arbitrary proxy headers.
  for (const key of [
    "cookie",
    "content-type",
    "x-requested-with",
    "x-stable-id",
    "origin",
    "accept",
  ]) {
    if (typeof req.headers[key] === "string") headers[key] = req.headers[key];
  }
  let body;
  if (!["GET", "HEAD"].includes(req.method)) {
    if (req.body !== undefined)
      body =
        typeof req.body === "string" || Buffer.isBuffer(req.body)
          ? req.body
          : JSON.stringify(req.body);
    else {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 100 * 1024)
          return res.status(413).json({ error: "Request too large" });
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }
    if (Buffer.byteLength(body) > 100 * 1024)
      return res.status(413).json({ error: "Request too large" });
  }
  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
    });
    if (response.status >= 300 && response.status < 400)
      throw new Error("Unexpected API redirect");
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json"))
      throw new Error("Backend did not return API JSON");
    res.statusCode = response.status;
    for (const key of [
      "content-type",
      "ratelimit",
      "ratelimit-policy",
      "retry-after",
    ]) {
      const value = response.headers.get(key);
      if (value) res.setHeader(key, value);
    }
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader("Set-Cookie", cookies);
    return res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    return res.status(502).json({
      error:
        "Academy backend could not be reached. / تعذر الاتصال بخادم الأكاديمية.",
      code: "BACKEND_UNREACHABLE",
    });
  }
}
