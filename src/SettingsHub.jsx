import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  MapPin,
  CalendarDays,
  HeartPulse,
  Sprout,
  ClipboardList,
  Package,
  Tags,
  Ticket,
  FileText,
} from "lucide-react";
import { HorseHead } from "./HorseHead";
export function SettingsHub({
  settings,
  stableName,
  data,
  ar,
  request,
  action,
  onSaved,
  go,
  openForm,
  busy,
  t,
}) {
  const [draft, setDraft] = useState(null);
  const form = {
    academyName: stableName,
    academyNameEn: settings?.academyNameEn ?? stableName,
    academyNameAr: settings?.academyNameAr || "",
    contactEmail: "",
    phone: "",
    address: "",
    calendarView: "month",
    lessonDuration: 60,
    defaultCapacity: 1,
    defaultCreditCost: 1,
    ...settings,
    ...draft,
  };
  const label = (en, arabic) => (ar ? arabic : en);
  const fields = [
    [
      "academyNameAr",
      label("Academy name (Arabic)", "اسم الأكاديمية بالعربية"),
      "text",
    ],
    [
      "academyNameEn",
      label("Academy name (English)", "اسم الأكاديمية بالإنجليزية"),
      "text",
    ],
    ["contactEmail", label("Contact email", "بريد التواصل"), "email"],
    ["phone", label("Phone", "الهاتف"), "tel"],
    ["address", label("Address", "العنوان"), "text"],
    [
      "lessonDuration",
      label(
        "Default lesson duration (minutes)",
        "مدة الحصة الافتراضية بالدقائق",
      ),
      "number",
    ],
    [
      "defaultCapacity",
      label("Default class capacity", "سعة الحصة الافتراضية"),
      "number",
    ],
    [
      "defaultCreditCost",
      label("Default lesson credit cost", "رصيد الحصة الافتراضي"),
      "number",
    ],
  ];
  const links = [
    ["horses", HorseHead],
    ["breeds", HorseHead],
    ["members", Users],
    ["instructors", GraduationCap],
    ["arenas", MapPin],
    ["classes", CalendarDays],
    ["pricing", Tags],
    ["medical", HeartPulse],
    ["feeding", Sprout],
    ["tasks", ClipboardList],
    ["discounts", Ticket],
    ["vouchers", Ticket],
    ["inventory", Package],
    ["billing", FileText],
  ];
  return (
    <>
      <section className="panel">
        <h2>
          {label(
            "Academy details & preferences",
            "بيانات الأكاديمية والتفضيلات",
          )}
        </h2>
        <form
          className="settings-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (
              await action(() =>
                request("/settings", { method: "PUT", body: form }),
              )
            ) {
              setDraft(null);
              onSaved(
                form.academyNameEn || form.academyNameAr || form.academyName,
                form,
              );
            }
          }}
        >
          {fields.map(([key, title, type]) => (
            <label key={key}>
              {title}
              <input
                aria-label={title}
                type={type}
                required={key === "academyNameEn" || type === "number"}
                min={key === "lessonDuration" ? 15 : 1}
                max={
                  key === "lessonDuration"
                    ? 480
                    : type === "number"
                      ? 100
                      : undefined
                }
                value={form[key]}
                onChange={(e) =>
                  setDraft({
                    ...form,
                    [key]:
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
              />
            </label>
          ))}
          <label>
            {label("Default calendar view", "عرض التقويم الافتراضي")}
            <select
              aria-label={label(
                "Default calendar view",
                "عرض التقويم الافتراضي",
              )}
              value={form.calendarView}
              onChange={(e) =>
                setDraft({ ...form, calendarView: e.target.value })
              }
            >
              {[
                ["month", "Month", "شهر"],
                ["week", "Week", "أسبوع"],
                ["quarter", "Quarter", "ربع سنة"],
                ["day", "Day", "يوم"],
              ].map(([v, en, arabic]) => (
                <option key={v} value={v}>
                  {ar ? arabic : en}
                </option>
              ))}
            </select>
          </label>
          <p className="notice">
            {label(
              "Currency: SAR · Time zone: Riyadh (UTC+3)",
              "العملة: ريال سعودي · التوقيت: الرياض (UTC+3)",
            )}
          </p>
          <button className="primary" disabled={busy}>
            {t.save}
          </button>
        </form>
      </section>
      <h2 className="subheading">
        {label("Manage your academy", "إدارة الأكاديمية")}
      </h2>
      <p>
        {label(
          "Add and manage everything in one place.",
          "أضف وأدر كل شيء من مكان واحد.",
        )}
      </p>
      <div className="settings-grid">
        {links.map(([key, Icon]) => {
          const module = key === "pricing" ? "plans" : key;
          const count = data[module]?.length;
          return (
            <article className="panel settings-card" key={key}>
              <Icon size={26} />
              <h3>{t[key]}</h3>
              {count !== undefined && (
                <p>
                  {count} {label("records", "سجلات")}
                </p>
              )}
              <div>
                <button className="soft" onClick={() => go(key)}>
                  {label("Manage", "إدارة")}
                </button>
                <button
                  className="primary"
                  onClick={() =>
                    key === "members"
                      ? go("members")
                      : key === "billing"
                        ? go("billing")
                        : openForm(module)
                  }
                >
                  {t.add}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
