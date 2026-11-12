import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
export function VoucherCard({ voucher, academy, ar, money, when }) {
  const [qr, setQr] = useState("");
  const link = new URL(
    "/?voucher=" + encodeURIComponent(voucher.code),
    window.location.origin,
  ).href;
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(link, { width: 260, margin: 2, errorCorrectionLevel: "M" })
      .then((image) => {
        if (active) setQr(image);
      })
      .catch(() => {
        if (active) setQr("");
      });
    return () => {
      active = false;
    };
  }, [link]);
  const label = (en, arabic) => (ar ? arabic : en);
  return (
    <section className="voucher-print-card printable-document">
      <img
        className="voucher-logo"
        src="/logos/riyadh-polo-club-academy.png"
        alt=""
      />
      <h2>{academy}</h2>
      <h3>{label("Gift voucher", "قسيمة هدية")}</h3>
      <strong className="big-money">{money(voucher.balance)}</strong>
      <p>{label("Remaining value", "القيمة المتبقية")}</p>
      {qr ? (
        <img
          width="240"
          height="240"
          src={qr}
          alt={label("Voucher QR code", "رمز القسيمة QR")}
        />
      ) : (
        <p>
          {label("Use the readable code below.", "استخدم الرمز المكتوب أدناه.")}
        </p>
      )}
      <code className="voucher-code" dir="ltr">
        {voucher.code}
      </code>
      <p>
        {label("Expires", "صالحة حتى")}: {when(voucher.expiresAt)}
      </p>
      <p>
        {label(
          "Scan to open booking with this voucher. Sign in, select an available slot and confirm the quote.",
          "امسح الرمز لفتح الحجز بالقسيمة. سجّل الدخول واختر موعداً متاحاً ثم أكّد المبلغ.",
        )}
      </p>
      <p className="voucher-link">{link}</p>
      <button className="primary no-print" onClick={() => window.print()}>
        {label("Print voucher", "طباعة القسيمة")}
      </button>
    </section>
  );
}
