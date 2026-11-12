import React, { useId } from "react";
import { summarizeSessionCredits } from "../shared/session-credits.js";
export function SessionTotals({ ledger, invoices, ar, loading = false }) {
  const heading = useId(),
    l = (en, a) => (ar ? a : en);
  const totals = summarizeSessionCredits(ledger);
  const pending = invoices
    .filter((p) => p.status === "open" && p.credit_quantity > 0)
    .reduce((sum, p) => sum + p.credit_quantity, 0);
  const stats = [
    [
      "purchased",
      totals.credited,
      l("Total purchased", "إجمالي الحصص المشتراة"),
    ],
    ["used", totals.used, l("Used", "الحصص المستخدمة")],
    [
      "restored",
      totals.restored,
      l("Restored after cancellation", "الحصص المعادة بعد الإلغاء"),
    ],
    ["refunded", totals.refunded, l("Refunded", "الحصص المستردة قيمتها")],
    ["pending", pending, l("Awaiting full payment", "بانتظار السداد الكامل")],
  ];
  return (
    <section
      className="session-totals"
      aria-labelledby={heading}
      aria-busy={loading}
    >
      <h2 id={heading}>{l("Session totals", "ملخص الحصص")}</h2>
      <dl className="session-total-grid">
        {stats.map(([key, value, title]) => (
          <div className="panel" key={key} data-session-total={key}>
            <dt>{title}</dt>
            <dd>{loading ? l("Loading…", "جار التحميل…") : value}</dd>
          </div>
        ))}
      </dl>
      <p className="session-total-note">
        {l(
          "Remaining = purchased − used + restored − refunded. Pending sessions are added only after full payment is confirmed.",
          "المتبقي = المشتراة − المستخدمة + المعادة − المستردة قيمتها. تُضاف الحصص المعلقة بعد تأكيد السداد الكامل فقط.",
        )}
      </p>
      {!loading &&
        invoices.some((p) =>
          ["missing_snapshot", "needs_review"].includes(
            p.sessionCreditStatus?.status,
          ),
        ) && (
          <p className="notice" role="status">
            {l(
              "A paid package needs session review. Contact the academy to confirm its session count.",
              "تحتاج باقة مدفوعة إلى مراجعة الحصص. تواصل مع الأكاديمية لتأكيد عدد حصصها.",
            )}
          </p>
        )}
    </section>
  );
}
