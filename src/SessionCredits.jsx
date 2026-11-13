import React, { useState } from "react";

export function PackageCreditStatus({
  invoice,
  ar,
  admin = false,
  action,
  request,
  busy,
}) {
  const l = (en, a) => (ar ? a : en),
    info = invoice.sessionCreditStatus;
  const [review, setReview] = useState(false),
    [quantity, setQuantity] = useState(""),
    [reason, setReason] = useState("");
  if (!info) return null;
  return (
    <section className="package-credit-status panel">
      <h3>{l("Package sessions", "حصص الباقة")}</h3>
      {info.status === "credited" ? (
        <p>
          {info.quantity}{" "}
          {l(
            "sessions were added to your balance. Booked sessions are deducted from that balance.",
            "حصص أضيفت إلى رصيدك. تُخصم الحصص المحجوزة من هذا الرصيد.",
          )}
        </p>
      ) : info.status === "pending" ? (
        <p>
          {info.quantity || "—"}{" "}
          {l(
            "sessions awaiting full payment confirmation.",
            "حصص بانتظار تأكيد السداد الكامل.",
          )}
        </p>
      ) : info.status === "refunded" ? (
        <p>
          {l(
            "This package is closed or refunded.",
            "هذه الباقة مغلقة أو مستردة.",
          )}
        </p>
      ) : (
        <p role="status">
          {l(
            "This invoice is paid, but its session credits need review. Ask an administrator to check the package details below.",
            "هذه الفاتورة مدفوعة لكن رصيد حصصها يحتاج مراجعة. اطلب من المسؤول التحقق من تفاصيل الباقة أدناه.",
          )}
        </p>
      )}
      {admin &&
        info.canRepair &&
        ["missing_snapshot", "needs_review"].includes(info.status) && (
          <>
            <button
              className="soft no-print"
              disabled={busy}
              onClick={() => {
                setReview(!review);
                setQuantity(
                  String(info.quantity || info.suggestedQuantity || ""),
                );
              }}
            >
              {l("Review missing sessions", "مراجعة الحصص المفقودة")}
            </button>
            {review && (
              <form
                className="member-modal-form no-print"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await action(() =>
                      request("/proformas/" + invoice.id + "/session-credits", {
                        method: "POST",
                        body: {
                          planId: info.matchedPlanId,
                          credits: Number(quantity),
                          reason,
                        },
                      }),
                    )
                  )
                    setReview(false);
                }}
              >
                <p>
                  {l(
                    "Verify the original package purchase before confirming. This adds sessions once and keeps an audit record. The suggested count comes from the current package and may differ from an older purchase.",
                    "تحقق من شراء الباقة الأصلية قبل التأكيد. تُضاف الحصص مرة واحدة مع حفظ سجل المراجعة. العدد المقترح مأخوذ من الباقة الحالية وقد يختلف عن الشراء القديم.",
                  )}
                </p>
                <label>
                  {l("Confirmed session count", "عدد الحصص المؤكد")}
                  <input
                    required
                    type="number"
                    min={1}
                    max={1000}
                    step={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </label>
                <label>
                  {l("Correction reason", "سبب التصحيح")}
                  <input
                    required
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <button
                  className="primary"
                  disabled={busy || (!info.quantity && !info.matchedPlanId)}
                >
                  {l(
                    "Confirm missing session credits",
                    "تأكيد إضافة الحصص المفقودة",
                  )}
                </button>
              </form>
            )}
          </>
        )}
    </section>
  );
}
export function BuySessions({
  data,
  ar,
  money,
  request,
  action,
  busy,
  onCreated,
}) {
  const l = (en, a) => (ar ? a : en);
  const packages = data.plans.filter(
    (p) =>
      p.active &&
      p.kind === "package" &&
      Number.isSafeInteger(p.credits) &&
      p.credits > 0,
  );
  const [selected, setSelected] = useState("");
  return (
    <>
      <section className="panel">
        <h2>{l("Buy session credits", "شراء رصيد حصص")}</h2>
        <p>
          {l(
            "Choose a lesson package. A payment request will be created for your account. Staff confirm payment using the existing payment process; sessions are added after full payment.",
            "اختر باقة حصص. يُنشأ طلب دفع لحسابك. يؤكد الموظفون السداد بآلية الدفع الحالية، وتُضاف الحصص بعد السداد الكامل.",
          )}
        </p>
        <p>
          {l("Current session balance", "رصيد الحصص الحالي")}:{" "}
          <strong>{data.creditBalance}</strong>
        </p>
      </section>
      <div className="record-grid">
        {packages.map((plan) => (
          <article className="panel session-package-card" key={plan.id}>
            <h3>{plan.name}</h3>
            <strong className="big-money">
              {plan.credits} {l("sessions", "حصص")}
            </strong>
            <p>{money(plan.amount)}</p>
            {selected === plan.id ? (
              <>
                <p>
                  {l(
                    "Confirming creates a payment request. It does not charge a card or add unpaid sessions.",
                    "يؤدي التأكيد إلى إنشاء طلب دفع. لا يتم خصم مبلغ من بطاقة أو إضافة حصص غير مدفوعة.",
                  )}
                </p>
                <div className="modal-actions">
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={async () => {
                      let invoice;
                      if (
                        await action(async () => {
                          invoice = await request("/packages", {
                            method: "POST",
                            body: { planId: plan.id },
                          });
                        })
                      ) {
                        setSelected("");
                        onCreated(invoice.id);
                      }
                    }}
                  >
                    {l("Confirm session purchase", "تأكيد شراء الحصص")}
                  </button>
                  <button
                    className="soft"
                    disabled={busy}
                    onClick={() => setSelected("")}
                  >
                    {l("Cancel", "إلغاء")}
                  </button>
                </div>
              </>
            ) : (
              <button
                className="primary"
                disabled={busy}
                onClick={() => setSelected(plan.id)}
              >
                {l("Buy sessions", "شراء حصص")}
              </button>
            )}
          </article>
        ))}
      </div>
      {!packages.length && (
        <p className="empty">
          {l(
            "No active lesson packages are available. Contact the academy to add a session package.",
            "لا توجد باقات حصص مفعّلة. تواصل مع الأكاديمية لإضافة باقة.",
          )}
        </p>
      )}
    </>
  );
}
