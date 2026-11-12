import { MemberTools } from "./Scheduling";
import { actionsForPage } from "../shared/permissions";
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
    pricing: l("Prices", "الأسعار"),
    billing: l("Invoices & payments", "الفواتير والمدفوعات"),
    inventory: l("Inventory", "المخزون"),
    reports: l("Reports", "التقارير"),
    members: l("Members", "الأعضاء"),
    settings: l("Settings", "الإعدادات"),
    instructors: l("Instructors", "المدربون"),
    arenas: l("Training locations & arenas", "مواقع التدريب والميادين"),
    breeds: l("Horse breeds", "سلالات الخيول"),
    stalls: l("Stalls", "المرابط"),
    boarding: l("Boarding", "الإيواء"),
    discounts: l("Discount codes", "رموز الخصم"),
    vouchers: l("Vouchers", "القسائم"),
    stables: l("Stable management", "إدارة الإسطبلات"),
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
    if (!u) {
      setDraft(null);
      return;
    }
    setDraft({
      role: u.isAdmin ? "admin" : u.role === "owner" ? "staff" : "member",
      permissions: u.permissions,
      actionPermissions: u.actionPermissions || {},
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
      {data && (
        <MemberTools
          members={data.users}
          request={request}
          ar={ar}
          busy={busy}
          isAdmin={true}
          action={async (fn) => {
            setBusy(true);
            setError("");
            try {
              await fn();
              await load();
              await onSaved();
              return true;
            } catch (e) {
              setError(e.message);
              return false;
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
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
              if (data.permissionVersion !== 2)
                throw new Error(
                  l(
                    "Update the cPanel backend before saving Add/Edit/Delete permissions.",
                    "حدّث خادم cPanel قبل حفظ صلاحيات الإضافة والتعديل والحذف.",
                  ),
                );
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
              <legend>
                {l("Page & function permissions", "صلاحيات الصفحات والوظائف")}
              </legend>
              <p>
                {l(
                  "Enable page access for viewing, then grant Add, Edit and Delete independently. Delete also controls cancellations; Edit includes completion, attendance, payments and photos. Administrator-only operations stay protected.",
                  "فعّل عرض الصفحة، ثم امنح الإضافة والتعديل والحذف بشكل مستقل. الحذف يشمل الإلغاء، والتعديل يشمل الإنجاز والحضور والمدفوعات والصور. تبقى عمليات مسؤول النظام محمية.",
                )}
              </p>
              <div className="table-wrap">
                <table className="permission-matrix">
                  <thead>
                    <tr>
                      <th>{l("Page / function", "الصفحة / الوظيفة")}</th>
                      <th>{l("Page access", "عرض الصفحة")}</th>
                      {(data.actions || ["add", "edit", "delete"]).map((a) => (
                        <th key={a}>
                          {
                            {
                              add: l("Add", "إضافة"),
                              edit: l("Edit", "تعديل"),
                              delete: l("Delete", "حذف"),
                            }[a]
                          }
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.modules.map((module) => (
                      <tr key={module}>
                        <th>{labels[module]}</th>
                        <td>
                          <input
                            type="checkbox"
                            aria-label={labels[module]}
                            checked={draft.permissions.includes(module)}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                permissions: e.target.checked
                                  ? [...draft.permissions, module]
                                  : draft.permissions.filter(
                                      (p) => p !== module,
                                    ),
                                actionPermissions: e.target.checked
                                  ? draft.actionPermissions
                                  : {
                                      ...draft.actionPermissions,
                                      [module]: [],
                                    },
                              })
                            }
                          />
                        </td>
                        {(data.actions || ["add", "edit", "delete"]).map(
                          (a) => (
                            <td key={a}>
                              <input
                                type="checkbox"
                                aria-label={
                                  labels[module] +
                                  " — " +
                                  {
                                    add: l("Add", "إضافة"),
                                    edit: l("Edit", "تعديل"),
                                    delete: l("Delete", "حذف"),
                                  }[a]
                                }
                                disabled={
                                  !draft.permissions.includes(module) ||
                                  !actionsForPage(module).includes(a)
                                }
                                checked={
                                  draft.permissions.includes(module) &&
                                  Boolean(
                                    draft.actionPermissions[module]?.includes(
                                      a,
                                    ),
                                  )
                                }
                                onChange={(e) =>
                                  setDraft({
                                    ...draft,
                                    actionPermissions: {
                                      ...draft.actionPermissions,
                                      [module]: e.target.checked
                                        ? [
                                            ...(draft.actionPermissions[
                                              module
                                            ] || []),
                                            a,
                                          ]
                                        : (
                                            draft.actionPermissions[module] ||
                                            []
                                          ).filter((v) => v !== a),
                                    },
                                  })
                                }
                              />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
