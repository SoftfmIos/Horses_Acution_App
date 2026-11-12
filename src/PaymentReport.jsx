import { historyMonths } from "./historyMonths";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { paymentReport } from "./paymentReport";
export function PaymentReport({
  data,
  ar,
  money,
  when,
  stableName,
  printRequest = 0,
  onCanPrintChange,
}) {
  const [groupBy, setGroupBy] = useState("invoice"),
    [search, setSearch] = useState(""),
    [month, setMonth] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [preview, setPreview] = useState(false);
  const l = (en, a) => (ar ? a : en);
  const groups = paymentReport({ ...data, groupBy, search, from, to });
  const total = (key) => groups.reduce((sum, g) => sum + g[key], 0);
  const invalid = from && to && from > to;
  const previousPrint = useRef(printRequest);
  useEffect(() => {
    onCanPrintChange?.(!invalid && groups.length > 0);
  }, [invalid, groups.length, onCanPrintChange]);
  useEffect(() => {
    if (printRequest !== previousPrint.current) {
      previousPrint.current = printRequest;
      if (!invalid && groups.length) setPreview(true);
    }
  }, [printRequest, invalid, groups.length]);
  const sheet = (print = false) => (
    <div className="payment-report-sheet" dir={ar ? "rtl" : "ltr"}>
      <div className="print-brand">
        <img
          src="/logos/riyadh-polo-club-academy.png"
          alt={l("Academy logo", "شعار الأكاديمية")}
          width="80"
        />
        <h2>{stableName}</h2>
      </div>
      <h3>{l("Payment report", "تقرير الدفعات")}</h3>
      <p>
        {l("Grouped by", "تجميع حسب")}:{" "}
        {groupBy === "invoice"
          ? l("Pro forma invoice", "الفاتورة المبدئية")
          : l("User", "المستخدم")}{" "}
        · {from || l("All dates", "جميع التواريخ")} —{" "}
        {to || l("All dates", "جميع التواريخ")}
      </p>
      {search && (
        <p>
          {l("Search", "البحث")}: {search}
        </p>
      )}
      <p>
        {l("Payments received", "الدفعات المستلمة")}: {money(total("receipts"))}{" "}
        · {l("Refunds", "المبالغ المستردة")}: {money(total("refunds"))} ·{" "}
        {l("Net payments in report", "صافي دفعات التقرير")}:{" "}
        {money(total("net"))}
      </p>
      <p>
        {l(
          "Invoice balances are lifetime totals; date and search filters apply to payment rows only.",
          "أرصدة الفواتير تشمل جميع الدفعات؛ تنطبق فلاتر التاريخ والبحث على صفوف الدفعات فقط.",
        )}
      </p>
      {groups.map((g) => (
        <section className="payment-report-group" key={g.id}>
          <h3>
            {g.name} <small>{g.id}</small>
          </h3>
          <p>
            {l("Invoice total", "إجمالي الفواتير")}: {money(g.due)} ·{" "}
            {l("Total paid", "إجمالي المدفوع")}: {money(g.paid)} ·{" "}
            {l("Outstanding", "المتبقي")}: {money(g.outstanding)}
          </p>
          {historyMonths(g.rows, (p) => p.created_at, ar).map((month) => (
            <details
              className="payment-month"
              key={month.key}
              open={print || undefined}
            >
              <summary>
                <strong>{month.title}</strong>
                <span>
                  {month.items.length} {l("payments", "دفعات")} ·{" "}
                  {l("Net", "الصافي")}:{" "}
                  {money(month.items.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </summary>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        l("User", "المستخدم"),
                        l("Pro forma", "الفاتورة المبدئية"),
                        l("Date (Riyadh)", "التاريخ (الرياض)"),
                        l("Reference", "المرجع"),
                        l("Details", "التفاصيل"),
                        l("Amount", "المبلغ"),
                      ].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {month.items.map((p) => (
                      <tr key={p.id}>
                        <td>{p.user?.name || p.invoice.member_id}</td>
                        <td>
                          {p.invoice.description}
                          <small className="record-id">{p.invoice.id}</small>
                        </td>
                        <td>{when(p.created_at)}</td>
                        <td>{p.reference}</td>
                        <td>{p.external_ref || "—"}</td>
                        <td>
                          {money(p.amount)}
                          {p.amount < 0 && (
                            <small> {l("Refund", "استرداد")}</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
          <p>
            <strong>
              {l("Net payments in this group", "صافي دفعات المجموعة")}:{" "}
              {money(g.net)}
            </strong>{" "}
            · {g.rows.length} {l("entries", "حركات")}
          </p>
        </section>
      ))}
      {!groups.length && (
        <p>
          {l(
            "No payments match these filters.",
            "لا توجد دفعات مطابقة للفلاتر.",
          )}
        </p>
      )}
      <p>
        {l(
          "Operational payment report. Not an official tax invoice.",
          "تقرير دفعات تشغيلي. ليس فاتورة ضريبية رسمية.",
        )}
      </p>
    </div>
  );
  return (
    <section className="panel payment-report">
      <h2>{l("Payments & reports", "الدفعات والتقارير")}</h2>
      <div className="settings-form">
        <label>
          {l("Group payments by", "تجميع الدفعات حسب")}
          <select
            aria-label={l("Group payments by", "تجميع الدفعات حسب")}
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="invoice">
              {l("Pro forma invoice", "الفاتورة المبدئية")}
            </option>
            <option value="user">{l("User", "المستخدم")}</option>
          </select>
        </label>
        <label>
          {l("Search payments", "البحث في الدفعات")}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={l(
              "User, invoice, reference or details",
              "المستخدم أو الفاتورة أو المرجع أو التفاصيل",
            )}
          />
        </label>
        <label>
          {l("Payment month", "شهر الدفعات")}
          <input
            type="month"
            value={month}
            onChange={(e) => {
              const value = e.target.value;
              setMonth(value);
              if (value) {
                const [year, m] = value.split("-").map(Number);
                setFrom(value + "-01");
                setTo(
                  new Date(Date.UTC(year, m, 0)).toISOString().slice(0, 10),
                );
              } else {
                setFrom("");
                setTo("");
              }
            }}
          />
        </label>
        <label>
          {l("From date", "من تاريخ")}
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setMonth("");
            }}
          />
        </label>
        <label>
          {l("To date", "إلى تاريخ")}
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setMonth("");
            }}
          />
        </label>
      </div>
      {invalid && (
        <p role="alert">
          {l(
            "The end date must be on or after the start date.",
            "يجب أن يكون تاريخ النهاية بعد تاريخ البداية أو مساوياً له.",
          )}
        </p>
      )}
      {!invalid && sheet()}
      {preview &&
        createPortal(
          <div className="modal-backdrop" onClick={() => setPreview(false)}>
            <section
              className="modal payment-report-modal"
              role="dialog"
              aria-modal="true"
              aria-label={l("Payment report preview", "معاينة تقرير الدفعات")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-actions no-print">
                <button className="primary" onClick={() => window.print()}>
                  {l("Print", "طباعة")}
                </button>
                <button className="soft" onClick={() => setPreview(false)}>
                  {l("Close", "إغلاق")}
                </button>
              </div>
              {sheet(true)}
            </section>
          </div>,
          document.body,
        )}
    </section>
  );
}
