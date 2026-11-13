import React, { useEffect, useState } from "react";
export function BookingCredits({
  memberId,
  stableId,
  request,
  ar,
  creditCost = 1,
  checked,
  onChange,
  refreshKey,
  onReview,
}) {
  const [details, setDetails] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [retry, setRetry] = useState(0);
  const l = (en, a) => (ar ? a : en);
  useEffect(() => {
    let active = true;
    setDetails(null);
    setError("");
    if (!memberId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    request("/members/" + encodeURIComponent(memberId) + "/credits")
      .then((result) => {
        if (
          !Number.isSafeInteger(result.balance) ||
          result.memberId !== memberId
        )
          throw Error(
            l(
              "The server did not return this member’s session balance.",
              "لم يُرجع الخادم رصيد حصص هذا العضو.",
            ),
          );
        if (active) setDetails(result);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [memberId, stableId, retry, refreshKey]);
  useEffect(() => {
    if (checked && (error || (details && details.balance < creditCost)))
      onChange(false);
  }, [loading, error, details, creditCost, checked]);
  return (
    <section className="booking-session-balance" aria-live="polite">
      <p>
        {l("Lesson credits remaining", "رصيد الحصص المتبقي")}:{" "}
        <strong>
          {loading
            ? l("Checking…", "جار التحقق…")
            : details
              ? details.balance
              : "—"}
        </strong>
      </p>
      {!memberId && (
        <p>
          {l(
            "Choose the member to check their session balance.",
            "اختر العضو للتحقق من رصيد حصصه.",
          )}
        </p>
      )}
      {error && (
        <p role="alert" className="notice">
          {l(
            "Could not check the session balance. Try refreshing or contact the academy.",
            "تعذر التحقق من رصيد الحصص. حاول التحديث أو تواصل مع الأكاديمية.",
          )}{" "}
          {error}
        </p>
      )}
      {details && (
        <>
          <p className="credit-breakdown">
            {l("Purchased", "المشتراة")}: {details.credited} ·{" "}
            {l("Used", "المستخدمة")}: {details.used} ·{" "}
            {l("Restored", "المعادة")}: {details.restored} ·{" "}
            {l("Refunded", "المستردة")}: {details.refunded}
          </p>
          {!!details.needsReview.length && (
            <p className="notice">
              {l(
                "Paid package credits need administrator review. Open these invoices and review their package sessions:",
                "رصيد باقات مدفوعة يحتاج مراجعة المسؤول. افتح الفواتير التالية وراجع حصص الباقة:",
              )}{" "}
              {details.needsReview
                .map((p) => `${p.description} (${p.id.slice(0, 8)})`)
                .join(", ")}
            </p>
          )}
          {onReview &&
            details.needsReview.map((invoice) => (
              <button
                key={invoice.id}
                type="button"
                className="soft"
                onClick={() => onReview(invoice.id)}
              >
                {l("Review paid package", "مراجعة الباقة المدفوعة")}:{" "}
                {invoice.description}
              </button>
            ))}
          {details.balance === 0 &&
            !details.needsReview.length &&
            details.paidRequestsWithoutSessions > 0 &&
            details.credited === 0 && (
              <p className="notice">
                {l(
                  "Paid requests exist, but none added package session credits. Regular class and boarding payments do not top up the session balance.",
                  "توجد طلبات مدفوعة لكنها لم تضف رصيد باقات حصص. دفع الحصص الفردية أو الإيواء لا يزيد رصيد الباقات.",
                )}
              </p>
            )}
          {details.pendingPackages > 0 && (
            <p>
              {details.pendingPackages}{" "}
              {l(
                "package requests are awaiting full payment.",
                "طلبات باقات تنتظر السداد الكامل.",
              )}
            </p>
          )}
        </>
      )}
      {memberId && (
        <button
          type="button"
          className="soft"
          disabled={loading}
          onClick={() => setRetry((value) => value + 1)}
        >
          {l("Refresh session balance", "تحديث رصيد الحصص")}
        </button>
      )}
      <label className="check-label">
        <input
          type="checkbox"
          disabled={
            loading || !details || details.balance < creditCost || !!error
          }
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {l("Use my lesson credits", "استخدام رصيد الحصص")}
      </label>
    </section>
  );
}
