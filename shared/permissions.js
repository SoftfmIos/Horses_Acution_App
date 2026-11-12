export const STAFF_MODULES = [
  "classes",
  "horses",
  "medical",
  "feeding",
  "tasks",
  "pricing",
  "billing",
  "inventory",
  "reports",
  "members",
  "settings",
];
export function mayEditTaskDate(dueAt, now, isAdmin) {
  if (isAdmin) return true;
  const day = (value) =>
    new Date(Date.parse(value) + 3 * 3600000).toISOString().slice(0, 10);
  const yesterday = day(new Date(Date.parse(now) - 86400000).toISOString());
  return day(dueAt) >= yesterday;
}

export const PERMISSION_ACTIONS = ["add", "edit", "delete"];
export const PERMISSION_PAGES = [
  ...STAFF_MODULES,
  "instructors",
  "arenas",
  "breeds",
  "stalls",
  "boarding",
  "discounts",
  "vouchers",
  "stables",
];
export const actionsForPage = (page) =>
  page === "reports" ? [] : page === "settings" ? ["edit"] : PERMISSION_ACTIONS;
export function staffPolicy(modules = PERMISSION_PAGES, actions = null) {
  const legacyChildren = {
    classes: ["instructors", "arenas"],
    horses: ["breeds", "stalls", "boarding"],
    pricing: ["discounts"],
    billing: ["vouchers"],
    settings: ["stables"],
  };
  const pages = [
    ...new Set(
      actions === null
        ? modules.flatMap((p) => [p, ...(legacyChildren[p] || [])])
        : modules,
    ),
  ].filter((p) => PERMISSION_PAGES.includes(p));
  return {
    modules: pages,
    actions: Object.fromEntries(
      PERMISSION_PAGES.map((p) => [
        p,
        pages.includes(p)
          ? actions === null
            ? actionsForPage(p)
            : actionsForPage(p).filter((a) => actions[p]?.includes(a))
          : [],
      ]),
    ),
  };
}
export function permissionForRoute(path, method) {
  let page = path.startsWith("/records/")
    ? path.split("/")[2]
    : path.startsWith("/photos/")
      ? path.split("/")[2]
      : null;
  page = { plans: "pricing" }[page] || page;
  if (!page)
    page = /^\/(quote|bookings|class-series|attendance|waitlist)/.test(path)
      ? "classes"
      : /^\/(proformas|packages)/.test(path)
        ? "billing"
        : /^\/(horses|horse-documents)/.test(path)
          ? "horses"
          : /^\/boarding/.test(path)
            ? "boarding"
            : /^\/tasks/.test(path)
              ? "tasks"
              : /^\/inventory/.test(path)
                ? "inventory"
                : /^\/(members|invites)/.test(path)
                  ? "members"
                  : /^\/stables/.test(path)
                    ? "stables"
                    : /^\/settings/.test(path)
                      ? "settings"
                      : /^\/(reports|audit)/.test(path)
                        ? "reports"
                        : null;
  if (!PERMISSION_PAGES.includes(page)) return null;
  const action =
    ["GET", "HEAD", "OPTIONS"].includes(method) || path === "/quote"
      ? null
      : method === "DELETE" || /\/(cancel|end)$/.test(path)
        ? "delete"
        : method === "POST" && !/\/(toggle|payment|refund)$/.test(path)
          ? "add"
          : "edit";
  return { page, action };
}
