import { Printer } from "lucide-react";
import { historyMonths } from "./historyMonths";
import { ProfilePhoto } from "./ProfilePhoto";
import React, { useEffect, useState } from "react";
import { localizedName } from "./localization";
export function HorseProfile({
  horseId,
  ar,
  request,
  staff,
  canEdit = staff,
  canAddDocuments = staff,
  canDeleteDocuments = staff,
  when,
  busy,
  action,
}) {
  const [profile, setProfile] = useState(null),
    [error, setError] = useState(""),
    [tab, setTab] = useState("timeline"),
    [uploading, setUploading] = useState(false);
  const l = (en, arabic) => (ar ? arabic : en);
  const load = () =>
    request("/horses/" + horseId + "/profile")
      .then(setProfile)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [horseId]);
  const download = async (d) => {
    try {
      const file = await request("/horse-documents/" + d.id);
      const bytes = Uint8Array.from(atob(file.content), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: file.mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e.message);
    }
  };
  const upload = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      file = f.get("file");
    if (!file?.size || file.size > 2 * 1024 * 1024) {
      setError(
        l(
          "Choose a PDF, PNG or JPEG up to 2 MB",
          "اختر ملف PDF أو صورة لا تتجاوز 2 MB",
        ),
      );
      return;
    }
    setUploading(true);
    setError("");
    try {
      const content = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      await request("/horses/" + horseId + "/documents", {
        method: "POST",
        body: {
          titleEn: f.get("titleEn"),
          titleAr: f.get("titleAr"),
          category: f.get("category"),
          filename: file.name,
          content,
        },
      });
      await load();
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  if (!profile)
    return (
      <p role="status">
        {error || l("Loading horse profile…", "جار تحميل ملف الحصان…")}
      </p>
    );
  const h = profile.horse;
  return (
    <section className="horse-profile">
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      <div className="horse-print-brand">
        <img src="/logos/riyadh-polo-club-academy.png" alt="" width="70" />
        <h2>{l("Horse card & history", "بطاقة الخيل والسجل")}</h2>
      </div>
      <div className="section-heading no-print">
        <p>
          {l(
            "Print the horse card and the selected history section.",
            "اطبع بطاقة الخيل وقسم السجل المحدد.",
          )}
        </p>
        <button className="soft" onClick={() => window.print()}>
          <Printer size={17} />
          {l("Print horse card & history", "طباعة بطاقة الخيل والسجل")}
        </button>
      </div>
      <div className="horse-master-detail">
        <aside className="horse-master">
          <ProfilePhoto
            kind="horses"
            id={h.id}
            name={localizedName(h, ar)}
            request={request}
            editable={canEdit}
            removable={canDeleteDocuments}
            ar={ar}
          />
          <h3>{localizedName(h, ar)}</h3>
          <dl className="horse-facts">
            <div>
              <dt>{l("Breed", "السلالة")}</dt>
              <dd>{h.breed || "—"}</dd>
            </div>
            <div>
              <dt>{l("Microchip", "الشريحة")}</dt>
              <dd>{h.microchip || "—"}</dd>
            </div>
            <div>
              <dt>{l("Born", "تاريخ الميلاد")}</dt>
              <dd>{h.birthDate ? when(h.birthDate) : "—"}</dd>
            </div>
            <div>
              <dt>{l("Status", "الحالة")}</dt>
              <dd>
                {
                  {
                    ready: l("Ready", "جاهز"),
                    rest: l("Medical rest", "راحة طبية"),
                    retired: l("Retired", "متقاعد"),
                  }[h.status]
                }
              </dd>
            </div>
          </dl>
          <p>
            {l("Owner", "المالك")}: {profile.ownerName || "—"} ·{" "}
            {l("Instructor", "المدرب")}:{" "}
            {localizedName(profile.instructor || {}, ar) || "—"}
          </p>
          {h.notes && <p>{h.notes}</p>}
          <div className="horse-summary">
            <p>
              {l("Care records", "سجلات الرعاية")}: {profile.medical.length}
            </p>
            <p>
              {l("Ride bookings", "حجوزات الركوب")}: {profile.bookings.length}
            </p>
            <p>
              {l("Completed care tasks", "مهام الرعاية المنجزة")}:{" "}
              {profile.tasks.filter((t) => t.done).length}/
              {profile.tasks.length}
            </p>
          </div>
        </aside>
        <div className="horse-detail">
          <div className="profile-tabs no-print">
            {[
              ["timeline", "Timeline", "السجل الزمني"],
              ["care", "Care & feeding", "الرعاية والتغذية"],
              ["rides", "Ride history", "سجل الركوب"],
              ["documents", "Documents", "الوثائق"],
            ].map(([key, en, a]) => (
              <button
                key={key}
                className={tab === key ? "primary" : "soft"}
                onClick={() => setTab(key)}
              >
                {l(en, a)}
              </button>
            ))}
          </div>
          {tab === "timeline" && (
            <>
              <h3>{l("Horse history", "سجل الحصان")}</h3>
              {historyMonths(profile.events, (e) => e.date, ar).map((month) => (
                <section className="horse-history-month" key={month.key}>
                  <h4>{month.title}</h4>
                  <ol className="horse-timeline">
                    {month.items.map((e) => (
                      <li key={e.type + e.id}>
                        <time>{when(e.date)}</time>
                        <strong>{e.title}</strong>
                        <p>{e.details}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
              {!profile.events.length && (
                <p>{l("No history yet.", "لا يوجد سجل بعد.")}</p>
              )}
            </>
          )}
          {tab === "rides" && (
            <section>
              <h3>{l("Ride history", "سجل الركوب")}</h3>
              <p>
                {l(
                  "All ride bookings, including pending, cancelled and past sessions. Attendance is shown only when recorded.",
                  "كل حجوزات الركوب بما فيها المعلقة والملغاة والسابقة. يظهر الحضور عند تسجيله فقط.",
                )}
              </p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        l("Date", "التاريخ"),
                        l("Class", "الحصة"),
                        l("Rider", "الفارس"),
                        l("Instructor", "المدرب"),
                        l("Location", "الموقع"),
                        l("Status", "الحالة"),
                        l("Attendance", "الحضور"),
                      ].map((t) => (
                        <th key={t}>{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historyMonths(
                      profile.bookings,
                      (b) => b.session.startsAt,
                      ar,
                    ).map((month) => (
                      <React.Fragment key={month.key}>
                        <tr className="history-month-row">
                          <th colSpan={7}>{month.title}</th>
                        </tr>
                        {month.items.map((b) => (
                          <tr key={b.id}>
                            <td>{when(b.session.startsAt)}</td>
                            <td>{localizedName(b.session, ar, "title")}</td>
                            <td>{b.memberName || "—"}</td>
                            <td>
                              {localizedName(b.session, ar, "instructor")}
                            </td>
                            <td>{localizedName(b.session, ar, "arena")}</td>
                            <td>
                              {{
                                confirmed: l("Confirmed", "مؤكد"),
                                pending_payment: l(
                                  "Awaiting payment",
                                  "بانتظار السداد",
                                ),
                                cancelled: l("Cancelled", "ملغى"),
                                expired: l("Expired", "منتهي"),
                              }[b.status] || b.status}
                            </td>
                            <td>{b.attendance || "—"}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {!profile.bookings.length && (
                <p>{l("No ride bookings yet.", "لا توجد حجوزات ركوب بعد.")}</p>
              )}
            </section>
          )}
          {tab === "care" && (
            <>
              <h3>{l("Medical records", "السجل الطبي")}</h3>
              {historyMonths(profile.medical, (m) => m.date, ar).map(
                (month) => (
                  <section className="horse-history-month" key={month.key}>
                    <h4>{month.title}</h4>
                    {month.items.map((m) => (
                      <article className="panel" key={m.id}>
                        <strong>{m.type}</strong>
                        <p>
                          {when(m.date)} · {m.notes}
                        </p>
                        {m.dueAt && (
                          <p>
                            {l("Next due", "الموعد القادم")}: {when(m.dueAt)}
                          </p>
                        )}
                        <p>
                          {m.medication} {m.dose}
                        </p>
                      </article>
                    ))}
                  </section>
                ),
              )}
              <h3>{l("Care task history", "سجل مهام الرعاية")}</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{l("Task", "المهمة")}</th>
                      <th>{l("Scheduled", "الموعد")}</th>
                      <th>{l("Completion", "الإنجاز")}</th>
                      <th>{l("Completed by / at", "المنفذ / الوقت")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyMonths(
                      profile.tasks.filter((t) => !t.cancelled),
                      (t) => t.dueAt,
                      ar,
                    ).map((month) => (
                      <React.Fragment key={month.key}>
                        <tr className="history-month-row">
                          <th colSpan={4}>{month.title}</th>
                        </tr>
                        {month.items.map((t) => (
                          <tr key={t.id}>
                            <td>{t.title}</td>
                            <td>{when(t.dueAt)}</td>
                            <td>{t.done ? "✓" : l("Pending", "معلق")}</td>
                            <td>
                              {t.done
                                ? (t.completedByName || "—") +
                                  " · " +
                                  when(t.completedAt)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3>{l("Feeding plans", "خطط التغذية")}</h3>
              {profile.feeding.map((f) => (
                <p key={f.id}>
                  {f.time} · {f.feed} · {f.quantity}
                </p>
              ))}
              <h3>{l("Boarding", "الإيواء")}</h3>
              {historyMonths(profile.boarding, (b) => b.startDate, ar).map(
                (month) => (
                  <section className="horse-history-month" key={month.key}>
                    <h4>{month.title}</h4>
                    {month.items.map((b) => (
                      <p key={b.id}>
                        {b.stall} · {b.startDate} – {b.endDate}
                      </p>
                    ))}
                  </section>
                ),
              )}
            </>
          )}
          {tab === "documents" && (
            <>
              <p>
                {l(
                  "Passports, certificates, medical reports and ownership documents. PDF, PNG or JPEG, maximum 2 MB.",
                  "جوازات وشهادات وتقارير طبية ووثائق ملكية. PDF أو PNG أو JPEG بحد أقصى 2 MB.",
                )}
              </p>
              {canAddDocuments && (
                <form
                  className="panel profile-upload no-print"
                  onSubmit={upload}
                >
                  <label>
                    {l("Document title (English)", "عنوان الوثيقة بالإنجليزية")}
                    <input name="titleEn" required maxLength={100} />
                  </label>
                  <label>
                    {l("Document title (Arabic)", "عنوان الوثيقة بالعربية")}
                    <input name="titleAr" maxLength={100} />
                  </label>
                  <label>
                    {l("Category", "التصنيف")}
                    <select name="category">
                      {[
                        ["passport", "Passport", "جواز"],
                        [
                          "vaccination",
                          "Vaccination certificate",
                          "شهادة تطعيم",
                        ],
                        ["medical", "Medical report", "تقرير طبي"],
                        ["ownership", "Ownership", "ملكية"],
                        ["other", "Other", "أخرى"],
                      ].map(([v, en, a]) => (
                        <option key={v} value={v}>
                          {l(en, a)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {l("File", "الملف")}
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      required
                    />
                  </label>
                  <button className="primary" disabled={uploading}>
                    {uploading
                      ? l("Uploading…", "جار الرفع…")
                      : l("Upload document", "رفع الوثيقة")}
                  </button>
                </form>
              )}
              {historyMonths(profile.documents, (d) => d.createdAt, ar).map(
                (month) => (
                  <section className="horse-history-month" key={month.key}>
                    <h4>{month.title}</h4>
                    {month.items.map((d) => (
                      <article className="panel" key={d.id}>
                        <strong>{localizedName(d, ar, "title")}</strong>
                        <p>
                          {d.filename} · {Math.ceil(d.size / 1024)} KB ·{" "}
                          {when(d.createdAt)}
                        </p>
                        <button
                          className="soft"
                          disabled={busy}
                          onClick={() => download(d)}
                        >
                          {l("Download", "تنزيل")}
                        </button>
                        {canDeleteDocuments && (
                          <button
                            disabled={busy}
                            onClick={async () => {
                              const ok = await action(() =>
                                request("/horse-documents/" + d.id, {
                                  method: "DELETE",
                                }),
                              );
                              if (ok) load();
                            }}
                          >
                            {l("Remove document", "حذف الوثيقة")}
                          </button>
                        )}
                      </article>
                    ))}
                  </section>
                ),
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export function CareReminders({ medical, horses, ar, when }) {
  const l = (en, a) => (ar ? a : en),
    today = new Date().toISOString(),
    limit = new Date(Date.now() + 7 * 86400000).toISOString();
  const upcoming = medical
    .filter((m) => !m.completed && m.dueAt && m.dueAt <= limit)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  return (
    <section className="panel care-reminders">
      <h3>
        {l(
          "Care reminders · next 7 days & overdue",
          "تذكيرات الرعاية · المتأخرة وخلال 7 أيام",
        )}
      </h3>
      <p>
        {l(
          "Record vaccinations, farrier and dental checks as care records and set their Next due date.",
          "أضف التطعيمات وزيارات البيطار وفحص الأسنان في الرعاية وحدد موعد الاستحقاق التالي.",
        )}
      </p>
      {upcoming.map((m) => (
        <p key={m.id} className={m.dueAt < today ? "overdue" : ""}>
          <strong>
            {localizedName(horses.find((h) => h.id === m.horseId) || {}, ar)} ·{" "}
            {m.type}
          </strong>{" "}
          · {when(m.dueAt)} ·{" "}
          {m.dueAt < today ? l("Overdue", "متأخر") : l("Upcoming", "قادم")}
        </p>
      ))}
      {!upcoming.length && (
        <p>
          {l(
            "No care due in this period.",
            "لا توجد رعاية مستحقة في هذه الفترة.",
          )}
        </p>
      )}
    </section>
  );
}
