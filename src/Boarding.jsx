import React, { useState } from "react";
import { localizedName } from "./localization";
import { riyadhDay } from "./calendar";
export function Boarding({
  data,
  ar,
  request,
  action,
  busy,
  openForm,
  money,
  can = () => true,
}) {
  const [form, setForm] = useState(null),
    [error, setError] = useState("");
  const l = (en, a) => (ar ? a : en);
  const today = riyadhDay(new Date()),
    live = data.boarding.filter(
      (b) =>
        b.status === "active" && b.startDate <= today && b.endDate >= today,
    );
  const horse = (id) =>
      localizedName(data.horses.find((h) => h.id === id) || {}, ar),
    stall = (id) =>
      localizedName(data.stalls.find((s) => s.id === id) || {}, ar);
  return (
    <section className="boarding">
      <div className="section-heading">
        <p>
          {l(
            "Assign stalls and issue a boarding invoice for the selected period. Prices apply once to this period; renewal is manual. Payment remains pending until recorded.",
            "خصص المربط وأصدر فاتورة إيواء للفترة المختارة. السعر للفترة كاملة والتجديد يدوي. يبقى السداد معلقاً حتى تسجيله.",
          )}
        </p>
        <button
          className="primary"
          disabled={!can("boarding", "add")}
          onClick={() => {
            setError("");
            setForm({ startDate: today, endDate: today });
          }}
        >
          {l("Assign boarding", "إضافة إيواء")}
        </button>
        <button
          className="soft"
          disabled={!can("stalls", "add")}
          onClick={() => openForm("stalls")}
        >
          {l("Add stall", "إضافة مربط")}
        </button>
      </div>
      <div className="record-grid">
        {data.stalls.map((s) => (
          <article className="panel" key={s.id}>
            <h3>{localizedName(s, ar)}</h3>
            <p>
              {live.filter((b) => b.stallId === s.id).length}/{s.capacity}{" "}
              {l("occupied today", "مشغول اليوم")}
            </p>
            <p>{s.notes}</p>
            <button
              className="soft"
              disabled={!can("stalls", "edit")}
              onClick={() => openForm("stalls", s)}
            >
              {l("Edit stall", "تعديل المربط")}
            </button>
          </article>
        ))}
      </div>
      <h3>{l("Boarding stays", "فترات الإيواء")}</h3>
      <div className="record-grid">
        {data.boarding.map((b) => (
          <article className="panel" key={b.id}>
            <h3>
              {horse(b.horseId)} · {stall(b.stallId)}
            </h3>
            <p>
              {b.startDate} – {b.endDate}
            </p>
            <p>
              {b.status === "ended"
                ? l("Ended", "منتهٍ")
                : b.endDate < today
                  ? l("Period finished", "انتهت الفترة")
                  : l("Assigned", "مخصص")}{" "}
              ·{" "}
              {b.paymentStatus === "settled"
                ? l("Paid", "مدفوع")
                : l("Payment pending", "بانتظار السداد")}
            </p>
            <small>
              {l("Invoice", "الفاتورة")}: {b.invoiceId}
            </small>
            {b.status === "active" && (
              <button
                disabled={busy || !can("boarding", "delete")}
                onClick={() =>
                  action(() =>
                    request("/boarding/" + b.id + "/end", { method: "POST" }),
                  )
                }
              >
                {l("End stay", "إنهاء الإيواء")}
              </button>
            )}
          </article>
        ))}
      </div>
      {form && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-label={l("Assign boarding", "إضافة إيواء")}
            className="modal"
          >
            <button
              className="modal-close"
              onClick={() => setForm(null)}
              disabled={busy}
            >
              ×
            </button>
            <h2>{l("Assign boarding", "إضافة إيواء")}</h2>
            {error && <p role="alert">{error}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const ok = await action(async () => {
                  try {
                    await request("/boarding", { method: "POST", body: form });
                  } catch (e) {
                    setError(e.message);
                    throw e;
                  }
                });
                if (ok) setForm(null);
              }}
            >
              {[
                [
                  "horseId",
                  l("Horse", "الحصان"),
                  data.horses.map((h) => [h.id, localizedName(h, ar)]),
                ],
                [
                  "stallId",
                  l("Stall", "المربط"),
                  data.stalls
                    .filter((s) => s.active)
                    .map((s) => [s.id, localizedName(s, ar)]),
                ],
                [
                  "memberId",
                  l("Billed member", "العضو المفوتر"),
                  data.members.map((m) => [m.id, m.name]),
                ],
                [
                  "planId",
                  l("Boarding price", "سعر الإيواء"),
                  data.plans
                    .filter((p) => p.active && p.kind.startsWith("boarding"))
                    .map((p) => [p.id, p.name + " · " + money(p.amount)]),
                ],
              ].map(([k, title, opts]) => (
                <label key={k}>
                  {title}
                  <select
                    aria-label={title}
                    required
                    value={form[k] || ""}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  >
                    <option value="">—</option>
                    {opts.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              {[
                ["startDate", l("Start date", "بداية الفترة")],
                ["endDate", l("End date", "نهاية الفترة")],
              ].map(([k, t]) => (
                <label key={k}>
                  {t}
                  <input
                    aria-label={t}
                    type="date"
                    required
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  />
                </label>
              ))}
              <button disabled={busy} className="primary">
                {l("Assign & create invoice", "تخصيص وإصدار فاتورة")}
              </button>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
export function FeedStock({
  data,
  ar,
  request,
  action,
  busy,
  canReceive = true,
}) {
  const [form, setForm] = useState({}),
    l = (en, a) => (ar ? a : en);

  return (
    <section className="panel feed-stock">
      <h3>{l("Feed stock & purchasing", "مخزون العلف والمشتريات")}</h3>
      <p>
        {l(
          "Use the inventory item’s unit for each feeding deduction. Stock is consumed only when feeding is completed, and restored if reopened.",
          "استخدم وحدة صنف المخزون لكل وجبة. يخصم المخزون عند إنجاز التغذية ويعاد عند إعادة فتح المهمة.",
        )}
      </p>
      {data.inventory.map((i) => {
        const daily = data.feeding
          .filter((f) => f.active && f.inventoryId === i.id)
          .reduce((n, f) => n + f.stockUnits, 0);
        return (
          <article key={i.id}>
            <h4>
              {i.name} · {i.quantity} {i.unit}
            </h4>
            {daily > 0 && (
              <p>
                {l("Planned units per day", "الوحدات المخططة يومياً")}: {daily}{" "}
                · {l("Estimated days remaining", "الأيام المتبقية تقديرياً")}:{" "}
                {Math.floor(i.quantity / daily)}
              </p>
            )}
            {i.quantity <= i.reorderAt && (
              <p className="overdue">
                {l("Purchase needed", "يلزم الشراء")} ·{" "}
                {Math.max(0, i.reorderAt + daily * 7 - i.quantity)} {i.unit}
              </p>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  await action(() =>
                    request("/inventory/" + i.id + "/receive", {
                      method: "POST",
                      body: {
                        quantity: Number(form[i.id]?.quantity),
                        reference: form[i.id]?.reference,
                      },
                    }),
                  )
                )
                  setForm({ ...form, [i.id]: { quantity: "", reference: "" } });
              }}
            >
              <label>
                {l("Received units", "الوحدات المستلمة")}
                <input
                  aria-label={
                    l("Received units", "الوحدات المستلمة") + " " + i.name
                  }
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form[i.id]?.quantity || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [i.id]: { ...form[i.id], quantity: e.target.value },
                    })
                  }
                />
              </label>
              <label>
                {l("Delivery reference", "مرجع الاستلام")}
                <input
                  required
                  maxLength={150}
                  value={form[i.id]?.reference || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [i.id]: { ...form[i.id], reference: e.target.value },
                    })
                  }
                />
              </label>
              <button className="primary" disabled={busy || !canReceive}>
                {l("Receive stock", "استلام المخزون")}
              </button>
            </form>
          </article>
        );
      })}
      <details>
        <summary>{l("Stock movement history", "سجل حركة المخزون")}</summary>
        {data.stockMovements
          .slice()
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 100)
          .map((m) => (
            <p key={m.id}>
              {m.createdAt} ·{" "}
              {data.inventory.find((i) => i.id === m.itemId)?.name} · {m.delta}{" "}
              · {m.reference || l("Feeding", "تغذية")}{" "}
              {m.reversed ? l("(reversed)", "(معكوس)") : ""}
            </p>
          ))}
      </details>
    </section>
  );
}
