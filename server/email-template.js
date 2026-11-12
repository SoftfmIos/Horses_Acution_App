import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const builtLogo = fileURLToPath(
  new URL("../dist/logos/riyadh-polo-club-academy.png", import.meta.url),
);
const logoPath = existsSync(builtLogo)
  ? builtLogo
  : fileURLToPath(
      new URL("../public/logos/riyadh-polo-club-academy.png", import.meta.url),
    );
const logoData = readFileSync(logoPath).toString("base64");
const money = (value) => `${(Number(value || 0) / 100).toFixed(2)} SAR / ر.س`;
const date = (value, lang) =>
  value
    ? new Intl.DateTimeFormat(lang, {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Riyadh",
      }).format(new Date(value))
    : "";
const stamp = (value) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");
const icsEscape = (value) =>
  String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
const foldLine = (line) => {
  let result = "",
    width = 0;
  for (const character of line) {
    const bytes = Buffer.byteLength(character);
    if (width + bytes > 75) {
      result += "\r\n ";
      width = 1;
    }
    result += character;
    width += bytes;
  }
  return result;
};
export function renderEmail(job) {
  const d =
    typeof job.details === "string"
      ? JSON.parse(job.details || "{}")
      : job.details || {};
  const p = d.proforma,
    b = d.booking,
    rows = [],
    plainRows = [];
  const row = (label, value) => {
    plainRows.push(label + ": " + String(value ?? ""));
    rows.push(
      `<tr><th style="padding:10px;text-align:start;border-bottom:1px solid #e6e0d4">${escape(label)}</th><td style="padding:10px;overflow-wrap:anywhere;word-break:break-word;border-bottom:1px solid #e6e0d4">${escape(value)}</td></tr>`,
    );
  };
  row("Customer / العميل", d.recipient || "");
  if (d.credentials) {
    row("Login email / بريد تسجيل الدخول", d.credentials.email);
    if (d.credentials.role)
      row("Account type / نوع الحساب", d.credentials.role);
    if (d.credentials.password)
      row("Password / كلمة المرور", d.credentials.password);
    row("Sign-in link / رابط تسجيل الدخول", d.credentials.loginUrl);
  }
  if (b) {
    row("Booking reference / رقم الحجز", b.id);
    row("Session / الحصة", b.title);
    row(
      "Date & time (Riyadh) / التاريخ والوقت (الرياض)",
      date(b.startsAt, "en-SA") + " · " + date(b.startsAt, "ar-SA"),
    );
    row(
      "Ends / الانتهاء",
      date(b.endsAt, "en-SA") + " · " + date(b.endsAt, "ar-SA"),
    );
    row("Location / الموقع", b.location);
    if (b.instructor) row("Instructor / المدرب", b.instructor);
    if (b.horse) row("Horse / الخيل", b.horse);
    row(
      "Booking status / حالة الحجز",
      b.status === "confirmed"
        ? "Confirmed / مؤكد"
        : b.status === "pending_payment"
          ? "Awaiting payment / بانتظار الدفع"
          : {
              cancelled: "Cancelled / ملغى",
              expired: "Expired / منتهي الصلاحية",
            }[b.status] || b.status,
    );
    if (b.holdExpiresAt && b.status === "pending_payment")
      row(
        "Pay before / يرجى الدفع قبل",
        date(b.holdExpiresAt, "en-SA") + " · " + date(b.holdExpiresAt, "ar-SA"),
      );
  }
  if (p) {
    row("Pro forma reference / رقم الفاتورة المبدئية", p.id);
    row(
      "Issued / تاريخ الإصدار",
      date(p.created_at, "en-SA") + " · " + date(p.created_at, "ar-SA"),
    );
    row("Description / الوصف", p.description);
    row("Subtotal / المبلغ الأساسي", money(p.gross));
    row("Discount / الخصم", money(p.discount));
    row("Voucher applied / قيمة القسيمة", money(p.voucher));
    row("Total due / الإجمالي المستحق", money(p.due));
    row("Paid to date / إجمالي المدفوع", money(p.paid));
    row("Outstanding / المتبقي", money(Math.max(0, p.due - p.paid)));
    row(
      "Payment status / حالة الدفع",
      {
        settled: "Paid in full / مدفوعة بالكامل",
        open: "Awaiting remaining payment / بانتظار استكمال الدفع",
        void: "Voided / ملغاة",
        refund_required: "Refund required / يلزم الاسترداد",
      }[p.status] || p.status,
    );
  }
  if (d.boarding) {
    const stay = d.boarding;
    row("Boarding reference / رقم الإيواء", stay.id);
    row("Horse / الخيل", stay.horseName || stay.horseId);
    row("Stall / المربط", stay.stallName || stay.stallId);
    row("Boarding plan / خطة الإيواء", stay.planName || stay.planId);
    row("Stay dates / فترة الإيواء", stay.startDate + " — " + stay.endDate);
    row(
      "Boarding status / حالة الإيواء",
      stay.status === "ended" ? "Ended / منتهٍ" : "Arranged / مسجل",
    );
  }
  if (d.payments?.length) {
    for (const entry of d.payments)
      row(
        "Recorded payment / دفعة مسجلة",
        [
          date(entry.created_at, "en-SA"),
          money(entry.amount),
          entry.reference,
          entry.external_ref,
        ]
          .filter(Boolean)
          .join(" · "),
      );
  }
  if (d.payment) {
    row("This payment / الدفعة الحالية", money(d.payment.amount));
    row("Payment reference / مرجع الدفعة", d.payment.reference);
    row("Payment details / تفاصيل الدفعة", d.payment.externalRef);
    row(
      "Payment date / تاريخ الدفع",
      date(d.payment.createdAt, "en-SA") +
        " · " +
        date(d.payment.createdAt, "ar-SA"),
    );
  }
  const explanation = d.credentials
    ? "Welcome! Your account is ready. Use the email and sign-in link below to access your bookings, invoices and account. Keep your login details private. / مرحباً بك! حسابك جاهز. استخدم البريد ورابط تسجيل الدخول أدناه للوصول إلى حجوزاتك وفواتيرك وحسابك. احتفظ ببيانات الدخول بسرية."
    : d.payment
      ? p?.status === "settled"
        ? "Thank you. Your payment has been recorded and the balance is fully paid. / شكراً لك. تم تسجيل دفعتك وسداد المبلغ بالكامل."
        : "Thank you. Your payment has been recorded. A balance remains due; your booking is confirmed only after full payment. / شكراً لك. تم تسجيل دفعتك، ولا يزال مبلغ مستحق. يُؤكد الحجز بعد السداد الكامل."
      : b?.status === "pending_payment"
        ? "Your booking is awaiting payment. Please pay the outstanding balance before the hold expires to confirm your place. / حجزك بانتظار الدفع. يرجى سداد المبلغ المتبقي قبل انتهاء الحجز المؤقت لتأكيد مقعدك."
        : b?.status === "confirmed"
          ? "Your session is confirmed. Please find the full booking details below. All times are in Riyadh time (UTC+3). / تم تأكيد حصتك. تجد أدناه جميع تفاصيل الحجز. جميع الأوقات بتوقيت الرياض (UTC+3)."
          : p
            ? "Please find your pro forma payment request below. This is not an official tax invoice. / تجد أدناه طلب الدفع والفاتورة المبدئية. هذه ليست فاتورة ضريبية رسمية."
            : job.body;
  const attachments = [
    {
      filename: "academy-logo.png",
      path: logoPath,
      cid: "academy-logo",
    },
  ];
  let calendar = "";
  if (b?.status === "confirmed" && b.startsAt && b.endsAt) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: b.title,
      dates: stamp(b.startsAt) + "/" + stamp(b.endsAt),
      location: b.location || "",
      details: "Booking / الحجز: " + b.id,
      ctz: "Asia/Riyadh",
    });
    calendar = `<p><a style="display:inline-block;padding:14px;background:#152b42;color:white;text-decoration:none;border-radius:6px" href="https://calendar.google.com/calendar/render?${escape(params)}">Add to calendar / إضافة إلى التقويم</a></p><p>For Apple Calendar or Outlook, open the attached calendar file. / لتقويم آبل أو أوتلوك، افتح ملف التقويم المرفق.</p>`;
    let lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Riyadh Polo//Bookings//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + icsEscape(b.id) + "@riyadhpolohills.com",
      "DTSTAMP:" + stamp(job.createdAt || new Date()),
      "DTSTART:" + stamp(b.startsAt),
      "DTEND:" + stamp(b.endsAt),
      "SUMMARY:" + icsEscape(b.title),
      "LOCATION:" + icsEscape(b.location),
      "DESCRIPTION:" + icsEscape("Booking / الحجز: " + b.id),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    attachments.push({
      filename: "booking.ics",
      content: lines.map(foldLine).join("\r\n") + "\r\n",
      contentType: "text/calendar; charset=utf-8",
    });
  }
  const login = d.credentials?.loginUrl
    ? `<p><a style="display:inline-block;padding:14px;background:#152b42;color:white;border-radius:6px" href="${escape(d.credentials.loginUrl)}">Sign in / تسجيل الدخول</a></p>`
    : "";
  const table = `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows.join("")}</table>`;
  const brand = escape(d.academy || "Riyadh Polo Hills");
  const html = `<!doctype html><html lang="en"><body style="margin:0;background:#f5f1e9;font-family:Arial,sans-serif;color:#152b42"><div style="max-width:660px;margin:24px auto;background:white;border-radius:12px;overflow:hidden"><header style="padding:24px;text-align:center;background:#152b42;color:white"><img src="cid:academy-logo" width="120" alt="Academy logo / شعار الأكاديمية" style="background:white;border-radius:8px"><h1 style="font-size:22px">${brand}</h1></header><main style="padding:28px"><h2>${escape(job.subject)}</h2><p dir="auto" style="line-height:1.9">${escape(explanation.split(" / ")[0])}</p>${explanation.includes(" / ") ? `<p dir="rtl" lang="ar" style="line-height:1.9">${escape(explanation.split(" / ").slice(1).join(" / "))}</p>` : ""}${table}${login}${calendar}<p dir="rtl" lang="ar" style="line-height:1.8">للاستفسارات، يرجى الرد على هذا البريد أو التواصل مع فريق الدعم.</p><p>For questions, reply to this email or contact our support team.</p>${p ? "<p>Pro forma payment request — not an official tax invoice. / فاتورة مبدئية لطلب الدفع — ليست فاتورة ضريبية رسمية.</p>" : ""}</main><footer style="padding:20px;text-align:center;background:#eee7d8">${brand}<br>${escape(d.phone || "")} ${escape(d.address || "")}</footer></div></body></html>`;
  if (p)
    attachments.push({
      filename: `proforma-${p.id}.html`,
      content: `<!doctype html><html lang="en"><meta charset="utf-8"><title>Pro forma / فاتورة مبدئية</title><body style="font-family:Arial,sans-serif;padding:24px"><img src="data:image/png;base64,${logoData}" width="120" alt="Academy logo / شعار الأكاديمية"><h1>${brand}</h1><h2>Pro forma / فاتورة مبدئية</h2>${table}<p>Not an official tax invoice. / ليست فاتورة ضريبية رسمية.</p><p>Print or save as PDF from your browser. / اطبع أو احفظ كملف PDF من المتصفح.</p></body></html>`,
      contentType: "text/html; charset=utf-8",
    });
  return {
    html,
    text: [job.subject, explanation, ...plainRows].join("\n"),
    attachments,
  };
}
