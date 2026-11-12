import React, { useEffect, useState } from "react";
export function UserPermissions({ request, ar, onSaved }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(""),
    [draft, setDraft] = useState(null),
    l = (en, a) => (ar ? a : en);
  const labels = {
    classes: l("Classes & bookings", "الحصص والحجوزات"),
    horses: l("Horse profiles & history", "ملفات الخيول وسجلاتها"),
    medical: l("Medical care", "الرعاية الطبية"),
    feeding: l("Feeding plans", "خطط التغذية"),
    tasks: l("Tasks", "المهام"),
    pricing: l("Prices & discounts", "الأسعار والخصومات"),
    billing: l("Invoices & payments", "الفواتير والمدفوعات"),
    inventory: l("Inventory", "المخزون"),
    reports: l("Reports", "التقارير"),
    members: l("Members", "الأعضاء"),
    settings: l("Settings", "الإعدادات"),
  };
  const load = () =>
    request("/permissions")
      .then(setData)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  const select = (id) => {
    setSelected(id);
    const u = data.users.find((u) => u.id === id);
    setDraft({
      role: u.isAdmin ? "admin" : u.role === "owner" ? "staff" : "member",
      permissions: u.permissions,
    });
    setError("");
  };
  return (
    <section className="panel permissions-page">
      <h2>{l("Users & Permissions", "المستخدمون والصلاحيات")}</h2>
      <p>
        {l(
          "Only system administrators can change these permissions. Staff can update tasks dated yesterday or later; only administrators can change older tasks.",
          "فقط مسؤولو النظام يمكنهم تعديل الصلاحيات. يمكن للموظفين تحديث مهام الأمس وما بعده، والمهام الأقدم متاحة لمسؤول النظام فقط.",
        )}
      </p>
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      {data && (
        <label>
          {l("User", "المستخدم")}
          <select
            aria-label={l("Permissions user", "مستخدم الصلاحيات")}
            value={selected}
            onChange={(e) => select(e.target.value)}
          >
            <option value="">—</option>
            {data.users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {draft && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await request("/permissions/" + selected, {
                method: "PUT",
                body: draft,
              });
              await load();
              await onSaved();
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {l("Access level", "مستوى الوصول")}
            <select
              aria-label={l("Access level", "مستوى الوصول")}
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            >
              <option value="admin">
                {l("System administrator", "مسؤول النظام")}
              </option>
              <option value="staff">{l("Staff", "موظف")}</option>
              <option value="member">{l("Member", "عضو")}</option>
            </select>
          </label>
          {draft.role === "admin" ? (
            <p>
              {l(
                "Full system access, including historical task corrections and permission management.",
                "وصول كامل بما فيه تصحيح المهام القديمة وإدارة الصلاحيات.",
              )}
            </p>
          ) : draft.role === "member" ? (
            <p>
              {l(
                "Own bookings, horses, instructors and invoices only.",
                "حجوزاته وخيوله ومدربوه وفواتيره فقط.",
              )}
            </p>
          ) : (
            <fieldset>
              <legend>{l("Allowed modules", "الأقسام المسموحة")}</legend>
              {data.modules.map((module) => (
                <label className="check-label" key={module}>
                  <input
                    type="checkbox"
                    checked={draft.permissions.includes(module)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        permissions: e.target.checked
                          ? [...draft.permissions, module]
                          : draft.permissions.filter((p) => p !== module),
                      })
                    }
                  />
                  {labels[module]}
                </label>
              ))}
            </fieldset>
          )}
          <button className="primary" disabled={busy}>
            {l("Save permissions", "حفظ الصلاحيات")}
          </button>
        </form>
      )}
    </section>
  );
}
