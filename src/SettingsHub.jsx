import { DEFAULT_HOLD_HOURS, MAX_HOLD_HOURS } from "../shared/booking-policy";
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
  page = "settings",
  can = () => true,
  canView = () => true,
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
    bookingHoldHours: DEFAULT_HOLD_HOURS,
    ...settings,
    ...draft,
  };
  const label = (en, arabic) => (ar ? arabic : en);
  const fields = [
    [
      "bookingHoldHours",
      label("Booking hold duration (hours)", "مدة الحجز المؤقت (بالساعات)"),
      "number",
    ],
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
    ["stalls", HorseHead],
    ["boardingManagement", HorseHead],
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
      {page === "settings" && (
        <div className="settings-grid">
          {[
            [
              "systemSettings",
              label("System settings", "إعدادات النظام"),
              "settings",
            ],
            [
              "emailSettings",
              label("Email settings", "إعدادات البريد الإلكتروني"),
              "emailSettings",
            ],
          ].map(
            ([key, title, module]) =>
              canView(module) && (
                <article className="panel settings-card" key={key}>
                  <h2>{title}</h2>
                  <button className="primary" onClick={() => go(key)}>
                    {label("Open", "فتح")}
                  </button>
                </article>
              ),
          )}
        </div>
      )}
      {page === "systemSettings" && (
        <>
          <button className="soft" onClick={() => go("settings")}>
            {label("Back to settings", "العودة إلى الإعدادات")}
          </button>
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
                  await action(async () => {
                    const saved = await request("/settings", {
                      method: "PUT",
                      body: form,
                    });
                    if (saved.bookingHoldHours !== form.bookingHoldHours)
                      throw new Error(
                        label(
                          "Update the cPanel backend to save booking hold hours.",
                          "حدّث خادم cPanel لحفظ مدة الحجز المؤقت.",
                        ),
                      );
                  })
                ) {
                  setDraft(null);
                  onSaved(
                    form.academyNameEn ||
                      form.academyNameAr ||
                      form.academyName,
                    form,
                  );
                }
              }}
            >
              <p className="notice">
                {label(
                  "Hold hours apply to new reservations. Existing holds keep their displayed deadline. A hold always ends by the class start time.",
                  "تطبق المدة على الحجوزات الجديدة. تحتفظ الحجوزات الحالية بموعد انتهائها المعروض، ولا تتجاوز بداية الحصة.",
                )}
              </p>
              {fields.map(([key, title, type]) => (
                <label key={key}>
                  {title}
                  <input
                    disabled={!can("settings", "edit")}
                    aria-label={title}
                    type={type}
                    required={key === "academyNameEn" || type === "number"}
                    min={key === "lessonDuration" ? 15 : 1}
                    max={
                      key === "bookingHoldHours"
                        ? MAX_HOLD_HOURS
                        : key === "lessonDuration"
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
                  disabled={!can("settings", "edit")}
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
              <button
                className="primary"
                disabled={busy || !can("settings", "edit")}
              >
                {t.save}
              </button>
            </form>
          </section>
        </>
      )}
      {page === "settings" && (
        <>
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
                    <button
                      className="soft"
                      disabled={!canView(module)}
                      onClick={() => go(key)}
                    >
                      {label("Manage", "إدارة")}
                    </button>
                    <button
                      className="primary"
                      disabled={!can(module, "add")}
                      onClick={() =>
                        ["members", "boardingManagement"].includes(key)
                          ? go(key)
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
      )}
    </>
  );
}
