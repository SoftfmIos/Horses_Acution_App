import { test } from "node:test";
import assert from "node:assert/strict";
import { renderEmail } from "../server/email-template.js";
const booking = {
  id: "booking-1",
  title: "Lesson <script> / حصة",
  startsAt: "2026-11-13T10:00:00Z",
  endsAt: "2026-11-13T11:00:00Z",
  location: "Arena A, Riyadh",
  status: "confirmed",
};
const proforma = {
  id: "invoice-1",
  description: "Lesson",
  gross: 10000,
  discount: 1000,
  voucher: 0,
  due: 9000,
  paid: 9000,
  status: "settled",
  created_at: "2026-11-12T10:00:00Z",
};
test("branded bilingual email escapes content and includes a printable invoice and a valid calendar", () => {
  const result = renderEmail({
    subject: "Confirmed / مؤكد",
    body: "Confirmed",
    details: {
      academy: "Academy <script>",
      recipient: "Rider & Guest",
      booking,
      proforma,
    },
  });
  assert.ok(result.html.includes("cid:academy-logo"));
  assert.ok(result.html.includes("Academy &lt;script&gt;"));
  assert.ok(!result.html.includes("<script>"));
  assert.ok(result.html.includes("إضافة إلى التقويم"));
  assert.ok(result.html.includes("13:00") || result.html.includes("1:00"));
  const calendar = result.attachments.find(
    (a) => a.filename === "booking.ics",
  ).content;
  assert.ok(calendar.includes("DTSTART:20261113T100000Z"));
  assert.ok(calendar.includes("UID:booking-1@riyadhpolohills.com"));
  assert.ok(calendar.includes("LOCATION:Arena A\\, Riyadh"));
  for (const line of calendar.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  const copy = result.attachments.find(
    (a) => a.filename === "proforma-invoice-1.html",
  ).content;
  assert.ok(copy.includes("data:image/png;base64,"));
  assert.ok(copy.includes("90.00 SAR"));
  assert.ok(copy.includes("ليست فاتورة ضريبية رسمية"));
});
test("pending bookings never get calendar events and partial receipts explain the remaining balance", () => {
  const result = renderEmail({
    subject: "Payment recorded",
    details: {
      booking: { ...booking, status: "pending_payment" },
      proforma: { ...proforma, paid: 2000, status: "open" },
      payment: {
        amount: 2000,
        reference: "first",
        createdAt: "2026-11-12T10:00:00Z",
      },
    },
  });
  assert.equal(
    result.attachments.some((a) => a.filename === "booking.ics"),
    false,
  );
  assert.ok(result.html.includes("70.00 SAR"));
  assert.ok(result.html.includes("A balance remains due"));
  assert.ok(result.html.includes('dir="rtl"'));
});
test("welcome email includes the sign-in link and only includes a password when explicitly supplied", () => {
  const job = {
    subject: "Welcome",
    details: {
      credentials: {
        email: "rider@example.com",
        loginUrl: "https://academy.example.com",
      },
    },
  };
  const result = renderEmail(job);
  assert.ok(result.html.includes('href="https://academy.example.com"'));
  assert.ok(!result.html.includes("Password / كلمة المرور"));
  const withPassword = renderEmail({
    ...job,
    details: {
      credentials: { ...job.details.credentials, password: "A&B<secret>" },
    },
  });
  assert.ok(withPassword.html.includes("A&amp;B&lt;secret&gt;"));
  assert.ok(withPassword.text.includes("A&B<secret>"));
});
