import React, { useState } from "react";
import { Home, Plus } from "lucide-react";
import { localizedName } from "./localization";
export function StablesManager({
  stables,
  current,
  ar,
  onSelect,
  onCreate,
  busy,
}) {
  const [form, setForm] = useState(null);
  const label = (en, arabic) => (ar ? arabic : en);
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>
          <Home size={22} /> {label("Stable management", "إدارة الإسطبلات")}
        </h2>
        <button
          className="primary"
          onClick={() => setForm({ nameEn: "", nameAr: "" })}
        >
          <Plus size={18} />
          {label("Add stable", "إضافة إسطبل")}
        </button>
      </div>
      <p>
        {label(
          "Each stable has its own horses, members, bookings and care schedules. Select a stable before managing its members.",
          "لكل إسطبل خيوله وأعضاؤه وحجوزاته وجداول الرعاية الخاصة به. اختر الإسطبل قبل إدارة أعضائه.",
        )}
      </p>
      <div className="stable-cards">
        {stables.map((s) => (
          <button
            className={"soft " + (current === s.id ? "active-stable" : "")}
            key={s.id}
            onClick={() => onSelect(s)}
          >
            <Home size={20} />
            <span>{localizedName(s, ar)}</span>
            {current === s.id && <strong>✓</strong>}
          </button>
        ))}
      </div>
      {form && (
        <div className="modal-backdrop" onClick={() => !busy && setForm(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stable-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="stable-dialog-title">
              {label("Add stable", "إضافة إسطبل")}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (await onCreate(form)) setForm(null);
              }}
            >
              <label>
                {label("Stable name (English)", "اسم الإسطبل بالإنجليزية")}
                <input
                  required
                  maxLength={100}
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                />
              </label>
              <label>
                {label("Stable name (Arabic)", "اسم الإسطبل بالعربية")}
                <input
                  dir="rtl"
                  maxLength={100}
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                />
              </label>
              <div className="modal-actions">
                <button className="primary" disabled={busy}>
                  {label("Save", "حفظ")}
                </button>
                <button
                  type="button"
                  className="soft"
                  disabled={busy}
                  onClick={() => setForm(null)}
                >
                  {label("Cancel", "إلغاء")}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
