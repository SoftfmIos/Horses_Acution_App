import React, { useEffect, useState } from "react";
import { api } from "./api";

const copy = (ar, en, arabic) => (ar ? arabic : en);

export function sessionLabel(type, ar) {
  return {
    lesson: copy(ar, "Lesson", "حصة"),
    clinic: copy(ar, "Clinic", "ورشة تدريبية"),
    open_day: copy(ar, "Open day", "يوم مفتوح"),
  }[type];
}

export function PublicAcademy() {
  const [ar, setAr] = useState(
    new URLSearchParams(location.search).get("lang") === "ar",
  );
  const [slots, setSlots] = useState(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [sent, setSent] = useState(false);
  const tr = (en, arabic) => copy(ar, en, arabic);
  useEffect(() => {
    document.documentElement.lang = ar ? "ar" : "en";
    document.title = ar
      ? "احجز حصتك الأولى | أكاديمية الرياض للبولو"
      : "Book your first lesson | Riyadh Polo Club Academy";
  }, [ar]);
  useEffect(() => {
    api("/public/openings")
      .then(setSlots)
      .catch(() => setLoadError(true));
  }, []);
  const date = (v) =>
    new Intl.DateTimeFormat(ar ? "ar-SA-u-ca-gregory" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    }).format(new Date(v));
  const money = (amount) =>
    new Intl.NumberFormat(ar ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount / 100);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/public/lesson-requests", {
        method: "POST",
        body: {
          classId: selected.id,
          name: form.get("name"),
          email: form.get("email"),
        },
      });
      setSent(true);
      setSelected(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="academy-public" dir={ar ? "rtl" : "ltr"}>
      <header>
        <a href="/app.html">
          {tr("Riyadh Polo Club Academy", "أكاديمية نادي الرياض للبولو")}
        </a>
        <div>
          <a href="/">{tr("Member sign-in", "دخول الأعضاء")}</a>
          <button type="button" onClick={() => setAr(!ar)}>
            {ar ? "English" : "العربية"}
          </button>
        </div>
      </header>
      <main>
        <section className="academy-public-intro">
          <img src="/logos/riyadh-polo-club-academy.png" alt="" />
          <div>
            <h1>{tr("Book your first lesson", "احجز حصتك الأولى")}</h1>
            <p>
              {tr(
                "Choose a beginner lesson, clinic, or open day and send a request. The Academy will contact you by email to confirm availability and payment details.",
                "اختر حصة للمبتدئين أو ورشة تدريبية أو يوماً مفتوحاً وأرسل طلبك. ستتواصل معك الأكاديمية بالبريد الإلكتروني لتأكيد التوفر وتفاصيل الدفع.",
              )}
            </p>
            <p>
              {tr(
                "Wear long trousers and closed-toe shoes. Ask the Academy about helmet and equipment requirements when your booking is confirmed.",
                "ارتدِ سروالاً طويلاً وحذاءً مغلقاً. اسأل الأكاديمية عن الخوذة والمعدات المطلوبة عند تأكيد الحجز.",
              )}
            </p>
          </div>
        </section>
        {loadError && (
          <p role="alert">
            {tr(
              "Openings could not be loaded. Refresh to try again.",
              "تعذر تحميل المواعيد. حدّث الصفحة للمحاولة مجدداً.",
            )}
          </p>
        )}
        {!loadError && !slots && (
          <p role="status">{tr("Loading openings…", "جارٍ تحميل المواعيد…")}</p>
        )}
        {slots?.length === 0 && (
          <p>
            {tr(
              "No public openings are currently published.",
              "لا توجد مواعيد عامة منشورة حالياً.",
            )}
          </p>
        )}
        {sent && (
          <p className="notice" role="status">
            {tr(
              "Request received. Your place is confirmed after the Academy reviews your request and any required payment is recorded.",
              "تم استلام طلبك. يُؤكد مكانك بعد مراجعة الطلب وتسجيل أي مبلغ مستحق.",
            )}
          </p>
        )}
        <div className="academy-public-slots">
          {slots?.map((slot) => (
            <article className="session" key={slot.id}>
              <span className="pill">{sessionLabel(slot.type, ar)}</span>
              <h2>{(ar ? slot.titleAr : slot.titleEn) || slot.title}</h2>
              <p>
                {date(slot.startsAt)} · {slot.arena}
              </p>
              <p>
                {money(slot.amount)} · {slot.places}{" "}
                {tr("places available", "أماكن متاحة")}
              </p>
              <button
                className="primary"
                disabled={busy || !slot.places}
                onClick={() => {
                  setError("");
                  setSent(false);
                  setSelected(slot);
                }}
              >
                {slot.places
                  ? tr("Request a place", "اطلب مكاناً")
                  : tr("Full", "مكتمل")}
              </button>
            </article>
          ))}
        </div>
        {selected && (
          <form className="panel academy-feedback" onSubmit={submit}>
            <h2>
              {(ar ? selected.titleAr : selected.titleEn) || selected.title}
            </h2>
            <label>
              {tr("Full name", "الاسم الكامل")}
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                autoFocus
              />
            </label>
            <label>
              {tr("Email", "البريد الإلكتروني")}
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </label>
            <p>
              <a href="/privacy.html">
                {tr("Privacy policy", "سياسة الخصوصية")}
              </a>
            </p>
            {error && <p role="alert">{error}</p>}
            <div>
              <button className="primary" disabled={busy}>
                {tr("Send request", "إرسال الطلب")}
              </button>{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => setSelected(null)}
              >
                {tr("Cancel", "إلغاء")}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export function LessonRequests({
  request,
  action,
  ar,
  when,
  busy,
  canEdit,
  canApprove,
}) {
  const [state, setState] = useState({});
  const tr = (en, arabic) => copy(ar, en, arabic);
  const load = async () => {
    try {
      setState({ rows: await request("/lesson-requests") });
    } catch (e) {
      setState({ error: e.message });
    }
  };
  async function review(id, status) {
    if (
      await action(() =>
        request("/lesson-requests/" + id, { method: "PUT", body: { status } }),
      )
    )
      await load();
  }
  return (
    <details
      className="panel"
      onToggle={(event) => {
        if (event.currentTarget.open) load();
      }}
    >
      <summary>{tr("Public booking requests", "طلبات الحجز العامة")}</summary>
      <p>
        {tr(
          "Confirm the details with the visitor by email before approving.",
          "أكّد التفاصيل مع الزائر عبر البريد الإلكتروني قبل الموافقة.",
        )}
      </p>
      <button type="button" disabled={busy} onClick={load}>
        {tr("Refresh requests", "تحديث الطلبات")}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.rows?.length === 0 && (
        <p>{tr("No pending requests.", "لا توجد طلبات قيد المراجعة.")}</p>
      )}
      {state.rows?.map((row) => (
        <article className="task-row" key={row.id}>
          <div>
            <strong>{row.name}</strong> ·{" "}
            <a href={"mailto:" + row.email}>{row.email}</a>
            <p>
              {row.title || tr("Removed opening", "موعد محذوف")} ·{" "}
              {when(row.requested_start)}
            </p>
            {row.starts_at && row.starts_at !== row.requested_start && (
              <p>
                {tr(
                  "The session time changed. Ask the visitor to send a new request.",
                  "تغيّر وقت الموعد. اطلب من الزائر إرسال طلب جديد.",
                )}
              </p>
            )}
            {!row.member_id && (
              <p>
                {tr(
                  "Add or invite a member with this email, then refresh the queue.",
                  "أضف أو ادعُ عضواً بهذا البريد الإلكتروني ثم حدّث الطلبات.",
                )}
              </p>
            )}
          </div>
          {canEdit && (
            <div>
              <button
                type="button"
                className="primary"
                disabled={
                  busy ||
                  !canApprove ||
                  !row.member_id ||
                  !row.title ||
                  row.starts_at !== row.requested_start
                }
                onClick={() => review(row.id, "approved")}
              >
                {tr("Approve and book", "موافقة وحجز")}
              </button>{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => review(row.id, "declined")}
              >
                {tr("Decline", "رفض")}
              </button>
            </div>
          )}
        </article>
      ))}
    </details>
  );
}

export function feedbackFields(ar) {
  return [
    ["focus", "focus", copy(ar, "Lesson focus", "محور الحصة")],
    ["feedback", "feedback", copy(ar, "Rider feedback", "ملاحظات للفارس")],
    [
      "nextStep",
      "next_step",
      copy(ar, "What to work on next", "الخطوة التدريبية التالية"),
    ],
    [
      "staffNotes",
      "staff_notes",
      copy(ar, "Private staff notes", "ملاحظات خاصة بالموظفين"),
    ],
  ];
}

export function LessonFeedback({ record, ar, busy, save, marksEnabled }) {
  const fields = feedbackFields(ar);
  const [saved, setSaved] = useState(false);
  return (
    <details>
      <summary>{copy(ar, "Lesson feedback", "ملاحظات الحصة")}</summary>
      <form
        className="academy-feedback"
        onChange={() => setSaved(false)}
        onSubmit={async (event) => {
          event.preventDefault();
          const values = Object.fromEntries(new FormData(event.currentTarget));
          const { mark, ...fields } = values;
          setSaved(
            await save(
              marksEnabled
                ? { ...fields, mark: mark === "" ? null : Number(mark) }
                : fields,
            ),
          );
        }}
      >
        {fields.map(([key, column, label]) => (
          <label key={key}>
            {label}
            <textarea
              name={key}
              rows={2}
              maxLength={2000}
              defaultValue={record?.[column] || ""}
            />
          </label>
        ))}
        {marksEnabled && (
          <label>
            {copy(ar, "Mark out of 100 (optional)", "الدرجة من 100 (اختياري)")}
            <input
              type="number"
              name="mark"
              min="0"
              max="100"
              step="1"
              defaultValue={record?.mark ?? ""}
            />
          </label>
        )}
        <button className="primary" disabled={busy}>
          {copy(ar, "Save feedback", "حفظ الملاحظات")}
        </button>
        {saved && (
          <small role="status">
            {copy(ar, "Feedback saved.", "تم حفظ الملاحظات.")}
          </small>
        )}
      </form>
    </details>
  );
}

export function FeedbackHistory({ data, ar, when }) {
  if (!data.lessonFeedback?.length) return null;
  return (
    <section className="panel">
      <h2>{copy(ar, "Rider progress", "تقدم الفارس")}</h2>
      {data.lessonFeedback.map((row) => {
        const booking = data.bookings.find((b) => b.id === row.reservation_id);
        const session = data.classes.find((c) => c.id === booking?.class_id);
        return (
          <details key={row.reservation_id}>
            <summary>
              {session?.title || copy(ar, "Lesson feedback", "ملاحظات الحصة")} ·{" "}
              {when(session?.startsAt || row.updated_at)}
            </summary>
            <dl>
              {row.mark != null && (
                <>
                  <dt>{copy(ar, "Mark", "الدرجة")}</dt>
                  <dd>{row.mark}/100</dd>
                </>
              )}
              {feedbackFields(ar)
                .slice(0, 3)
                .filter(([, column]) => row[column])
                .map(([, column, label]) => (
                  <React.Fragment key={column}>
                    <dt>
                      <strong>{label}</strong>
                    </dt>
                    <dd>{row[column]}</dd>
                  </React.Fragment>
                ))}
            </dl>
          </details>
        );
      })}
    </section>
  );
}
