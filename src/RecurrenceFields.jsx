import React from "react";
import { recurrenceSlots, instant } from "../shared/recurrence";
export function RecurrenceFields({ form, onChange, ar, medical = false }) {
  const label = (en, arabic) => (ar ? arabic : en);
  const mode = form.repeatMode || "none";
  let preview = [],
    error = "";
  const start = medical ? form.date : form.startsAt;
  if (start && (medical || form.endsAt))
    try {
      const end = medical
        ? new Date(instant(start) + 1800000).toISOString()
        : form.endsAt;
      preview = recurrenceSlots({
        ...form,
        repeatMode: mode,
        startsAt: start,
        endsAt: end,
      });
    } catch (e) {
      error = e.message;
    }
  const days = [
    ["Sun", "الأحد"],
    ["Mon", "الاثنين"],
    ["Tue", "الثلاثاء"],
    ["Wed", "الأربعاء"],
    ["Thu", "الخميس"],
    ["Fri", "الجمعة"],
    ["Sat", "السبت"],
  ];
  return (
    <fieldset className="recurrence-fields">
      <legend>
        {medical
          ? label("Medical session schedule", "جدول الجلسات الطبية")
          : label("Generate booking openings", "توليد المواعيد المتاحة للحجز")}
      </legend>
      <label>
        {label("Repeat", "التكرار")}
        <select
          aria-label={label("Repeat", "التكرار")}
          value={mode}
          onChange={(e) => onChange("repeatMode", e.target.value)}
        >
          {[
            ["none", "Once", "مرة واحدة"],
            ["daily", "Daily", "يومياً"],
            ["weekly", "Weekly", "أسبوعياً"],
            ["weekdays", "Selected weekdays", "أيام محددة من الأسبوع"],
          ].map(([value, en, arabic]) => (
            <option key={value} value={value}>
              {ar ? arabic : en}
            </option>
          ))}
        </select>
      </label>
      {mode !== "none" && (
        <>
          <label>
            {mode === "daily"
              ? label("Every (days)", "كل (أيام)")
              : label("Every (weeks)", "كل (أسابيع)")}
            <input
              lang="en"
              type="number"
              required
              min={1}
              max={52}
              value={form.repeatEvery ?? 1}
              onChange={(e) => onChange("repeatEvery", Number(e.target.value))}
            />
          </label>
          {mode === "weekdays" && (
            <fieldset className="weekday-picker">
              <legend>{label("Days", "الأيام")}</legend>
              {days.map(([en, arabic], day) => (
                <label className="check-label" key={day}>
                  <input
                    type="checkbox"
                    checked={(form.repeatDays || []).includes(day)}
                    onChange={(e) =>
                      onChange(
                        "repeatDays",
                        e.target.checked
                          ? [...(form.repeatDays || []), day]
                          : (form.repeatDays || []).filter((d) => d !== day),
                      )
                    }
                  />
                  {ar ? arabic : en}
                </label>
              ))}
            </fieldset>
          )}
          <label>
            {label("Repeat until", "التكرار حتى")}
            <input
              type="date"
              lang="en"
              required
              value={form.repeatUntil || ""}
              onChange={(e) => onChange("repeatUntil", e.target.value)}
            />
          </label>
        </>
      )}
      {preview.length > 0 && (
        <p role="status" className="schedule-preview">
          {preview.length}{" "}
          {medical
            ? label(
                "medical tasks will be generated.",
                "مهام طبية سيتم إنشاؤها.",
              )
            : label(
                "bookable sessions will be generated.",
                "مواعيد متاحة للحجز سيتم إنشاؤها.",
              )}
        </p>
      )}
      {preview.length > 1 && (
        <details className="schedule-dates" open>
          <summary>
            {label("Dates to publish", "المواعيد التي سيتم نشرها")} ·{" "}
            {preview.length}
          </summary>
          <ol>
            {preview.map((slot) => (
              <li key={slot.startsAt}>
                {new Date(slot.startsAt).toLocaleString(
                  ar ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB",
                  {
                    timeZone: "Asia/Riyadh",
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
      {error && mode !== "none" && (
        <p className="notice">
          {label("Complete the schedule: ", "أكمل بيانات الجدول: ")}
          {error}
        </p>
      )}
      <p className="notice">
        {medical
          ? label(
              "Choose an assignee above. Each appointment becomes a task with a completion checkbox. Use the medication interval fields for dose schedules instead.",
              "اختر المسؤول أعلاه. تتحول كل جلسة إلى مهمة بعلامة إتمام. لجدول جرعات الدواء استخدم حقول التكرار بالساعات بدلاً من ذلك.",
            )
          : label(
              "Each session has its own seats and horse assignment. Registered students can book available places.",
              "لكل موعد سعة وخيول مخصصة، ويمكن للطلاب المسجلين حجز المقاعد المتاحة.",
            )}
      </p>
    </fieldset>
  );
}
