import React, { useEffect, useState } from "react";
import { localizedName } from "./localization";
export function HorseProfile({
  horseId,
  ar,
  request,
  staff,
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
      <div className="profile-tabs">
        {[
          ["timeline", "Timeline", "السجل الزمني"],
          ["care", "Care & feeding", "الرعاية والتغذية"],
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
          <ol className="horse-timeline">
            {profile.events.map((e) => (
              <li key={e.type + e.id}>
                <time>{when(e.date)}</time>
                <strong>{e.title}</strong>
                <p>{e.details}</p>
              </li>
            ))}
          </ol>
          {!profile.events.length && (
            <p>{l("No history yet.", "لا يوجد سجل بعد.")}</p>
          )}
        </>
      )}
      {tab === "care" && (
        <>
          <h3>{l("Medical records", "السجل الطبي")}</h3>
          {profile.medical.map((m) => (
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
          <h3>{l("Feeding plans", "خطط التغذية")}</h3>
          {profile.feeding.map((f) => (
            <p key={f.id}>
              {f.time} · {f.feed} · {f.quantity}
            </p>
          ))}
          <h3>{l("Boarding", "الإيواء")}</h3>
          {profile.boarding.map((b) => (
            <p key={b.id}>
              {b.stall} · {b.startDate} – {b.endDate}
            </p>
          ))}
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
          {staff && (
            <form className="panel profile-upload" onSubmit={upload}>
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
                    ["vaccination", "Vaccination certificate", "شهادة تطعيم"],
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
          {profile.documents.map((d) => (
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
              {staff && (
                <button
                  disabled={busy}
                  onClick={async () => {
                    const ok = await action(() =>
                      request("/horse-documents/" + d.id, { method: "DELETE" }),
                    );
                    if (ok) load();
                  }}
                >
                  {l("Remove document", "حذف الوثيقة")}
                </button>
              )}
            </article>
          ))}
        </>
      )}
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
