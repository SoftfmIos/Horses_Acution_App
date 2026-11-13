// Fictional, internally connected demonstration records. Never sends mail.
import { randomBytes } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { passwordHash } from "./app.js";
import { PERMISSION_PAGES, staffPolicy } from "../shared/permissions.js";
import { feedingSchedule } from "./care.js";

export const DEMO_KEEP_EMAIL = "abdul@softfm.com";
const DAY = 86400000;
const horseNames = [
  ["Shams", "شمس"],
  ["Badr", "بدر"],
  ["Najma", "نجمة"],
  ["Sahab", "سحاب"],
  ["Rimal", "رمال"],
  ["Barq", "برق"],
  ["Lulwa", "لؤلؤة"],
  ["Faris", "فارس"],
  ["Al Anoud", "العنود"],
  ["Sultan", "سلطان"],
  ["Reem", "ريم"],
  ["Wadi", "وادي"],
];
const people = [
  ["Omar Al Harbi", "عمر الحربي"],
  ["Khalid Al Qahtani", "خالد القحطاني"],
  ["Sara Al Dosari", "سارة الدوسري"],
  ["Faisal Al Otaibi", "فيصل العتيبي"],
  ["Noura Al Salem", "نورة السالم"],
  ["Hassan Al Ali", "حسن العلي"],
  ["Yousef Al Zahrani", "يوسف الزهراني"],
  ["Ahmed Al Rashid", "أحمد الراشد"],
  ["Lama Al Mansour", "لمى المنصور"],
  ["Mohammed Al Saud", "محمد السعد"],
  ["Hind Al Shammari", "هند الشمري"],
  ["Saad Al Ghamdi", "سعد الغامدي"],
  ["Dana Al Fares", "دانة الفارس"],
  ["Turki Al Nasser", "تركي الناصر"],
  ["Reem Al Saleh", "ريم الصالح"],
  ["Abdullah Al Majed", "عبدالله الماجد"],
  ["Maha Al Jaber", "مها الجابر"],
  ["Fahad Al Amri", "فهد العمري"],
  ["Haya Al Khalaf", "هيا الخلف"],
];
const id = (kind, n) => `demo-${kind}-${String(n + 1).padStart(2, "0")}`;
const stamp = (day, time = "09:00") =>
  new Date(`${day}T${time}:00+03:00`).toISOString();
const shift = (day, days) =>
  new Date(Date.parse(`${day}T12:00:00Z`) + days * DAY)
    .toISOString()
    .slice(0, 10);
function month(day, delta) {
  const value = new Date(`${day}T12:00:00Z`),
    date = value.getUTCDate();
  value.setUTCDate(1);
  value.setUTCMonth(value.getUTCMonth() + delta);
  const end = new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 0),
  ).getUTCDate();
  value.setUTCDate(Math.min(date, end));
  return value.toISOString().slice(0, 10);
}
export function demoDay(now = new Date()) {
  return new Date(now.getTime() + 3 * 3600000).toISOString().slice(0, 10);
}
export function demoPhotos(directory) {
  if (!directory) return [];
  const result = [];
  for (const [kind, count, prefix] of [
    ["horses", 12, "horse"],
    ["instructors", 5, "instructor"],
  ]) {
    for (let n = 0; n < count; n++) {
      const file = ["jpg", "jpeg", "png"]
        .map((ext) =>
          join(directory, `${prefix}-${String(n + 1).padStart(2, "0")}.${ext}`),
        )
        .find(existsSync);
      if (!file)
        throw new Error(
          `Missing photo: ${prefix}-${String(n + 1).padStart(2, "0")}.jpg (or .png)`,
        );
      const bytes = readFileSync(file);
      const png = bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if ((!png && !jpeg) || bytes.length > 2 * 1024 * 1024)
        throw new Error(`Photo must be JPEG/PNG, at most 2 MB: ${file}`);
      result.push({
        kind,
        id: id(prefix, n),
        mime: png ? "image/png" : "image/jpeg",
        content: bytes.toString("base64"),
      });
    }
  }
  return result;
}
export async function prepareDemo({ day = demoDay(), photosDirectory } = {}) {
  if (
    !/^\d{4}-\d\d-\d\d$/.test(day) ||
    new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) !== day
  )
    throw new Error("Invalid demo date; use YYYY-MM-DD.");
  const photos = demoPhotos(photosDirectory);
  const users = [];
  for (const [n, [name, nameAr]] of people.entries()) {
    const password = randomBytes(18).toString("base64url");
    users.push({
      id: id("user", n),
      name,
      nameAr,
      email: `${n < 5 ? "instructor" : n < 7 ? "care" : "member"}${String(n + 1).padStart(2, "0")}@demo.example.test`,
      role: n < 5 ? "instructor" : n < 7 ? "caregiver" : "member",
      password,
      encrypted: await passwordHash(password),
    });
  }
  return { day, start: month(day, -1), end: month(day, 2), users, photos };
}
export function seedDemo(db, org, keeper, prepared) {
  const { day, start, end, users, photos } = prepared;
  const now = stamp(day),
    origin = stamp(shift(start, -7));
  const run = (sql, ...args) => db.prepare(sql).run(...args);
  const put = (kind, rid, value) =>
    run(
      "INSERT INTO records(id,org_id,kind,data) VALUES(?,?,?,?)",
      rid,
      org,
      kind,
      JSON.stringify(value),
    );
  const policy = (uid, modules) => {
    const p = staffPolicy(modules);
    run(
      "INSERT INTO staff_permissions(org_id,user_id,modules,actions) VALUES(?,?,?,?)",
      org,
      uid,
      JSON.stringify(p.modules),
      JSON.stringify(p.actions),
    );
  };
  const credit = (uid, amount, reason, booking, invoice, at) =>
    run(
      "INSERT INTO credit_ledger VALUES(?,?,?,?,?,?,?,?)",
      `demo-credit-${++serial}`,
      org,
      uid,
      amount,
      reason,
      booking,
      invoice,
      at,
    );
  let serial = 0;
  for (const user of users) {
    run(
      "INSERT INTO users VALUES(?,?,?,?,?)",
      user.id,
      user.email,
      user.name,
      user.encrypted,
      origin,
    );
    run(
      "INSERT INTO profile_names VALUES(?,?,?)",
      user.id,
      user.name,
      user.nameAr,
    );
    run(
      "INSERT INTO memberships VALUES(?,?,?)",
      user.id,
      org,
      user.role === "member" ? "member" : "owner",
    );
    if (user.role !== "member")
      policy(
        user.id,
        user.role === "instructor"
          ? ["classes", "tasks", "horses"]
          : ["tasks", "feeding", "medical"],
      );
  }
  policy(keeper.id, PERMISSION_PAGES);
  put("academySettings", `${org}:settings`, {
    academyName: "Riyadh Polo Hills — Demo",
    academyNameEn: "Riyadh Polo Hills — Demo",
    academyNameAr: "الرياض بولو هيلز — تجريبي",
    currency: "SAR",
    timeZone: "Asia/Riyadh",
    bookingHoldHours: 72,
    calendarView: "month",
    lessonDuration: 45,
    defaultCapacity: 1,
    defaultCreditCost: 1,
    contactEmail: "support@riyadhpolohills.com",
    demoMode: true,
  });
  // A stored disabled row prevents fallback to any real SMTP environment variables.
  run(
    "INSERT INTO email_settings(org_id,data) VALUES(?,?)",
    org,
    JSON.stringify({
      enabled: false,
      host: "",
      user: "",
      from: "notifications@riyadhpolohills.com",
      replyTo: "support@riyadhpolohills.com",
    }),
  );
  const members = users.filter((u) => u.role === "member"),
    instructors = users.slice(0, 5),
    carers = users.slice(5, 7);
  for (let n = 0; n < 5; n++)
    put("instructors", id("instructor", n), {
      name: instructors[n].name,
      nameEn: instructors[n].name,
      nameAr: instructors[n].nameAr,
      userId: instructors[n].id,
      active: true,
      email: instructors[n].email,
      phone: "",
      notes: "Fictional demonstration profile / ملف تجريبي لشخصية خيالية",
    });
  for (let n = 0; n < 3; n++) {
    put("arenas", id("arena", n), {
      name: ["Main Polo Arena", "Covered Riding Arena", "Training Paddock"][n],
      nameEn: ["Main Polo Arena", "Covered Riding Arena", "Training Paddock"][
        n
      ],
      nameAr: ["ميدان البولو الرئيسي", "صالة الركوب المغطاة", "ميدان التدريب"][
        n
      ],
      active: true,
    });
    put("breeds", id("breed", n), {
      name: ["Arabian", "Thoroughbred", "Polo Pony"][n],
      nameEn: ["Arabian", "Thoroughbred", "Polo Pony"][n],
      nameAr: ["عربي أصيل", "ثوروبريد", "حصان بولو"][n],
      active: true,
    });
  }
  for (let n = 0; n < 12; n++) {
    const [name, nameAr] = horseNames[n];
    put("horses", id("horse", n), {
      name,
      nameEn: name,
      nameAr,
      breed: [
        "Arabian / عربي أصيل",
        "Thoroughbred / ثوروبريد",
        "Polo Pony / حصان بولو",
      ][n % 3],
      birthDate: `${2015 + (n % 6)}-03-15`,
      microchip: `DEMO-CHIP-${String(n + 1).padStart(4, "0")}`,
      ownerId: n < 8 ? keeper.id : n < 11 ? members[n - 8].id : carers[0].id,
      instructorId: id("instructor", n % 5),
      status: "ready",
      notes:
        "Fictional demo horse; calm with a steady training routine. / حصان تجريبي خيالي؛ هادئ ويشارك في برنامج تدريب منتظم.",
    });
  }
  const plans = [
    ["lesson", "Riding lesson", "حصة ركوب", 25000, 0],
    ["package", "5-session package", "باقة ٥ حصص", 110000, 5],
    ["package", "10-session package", "باقة ١٠ حصص", 200000, 10],
    ["boarding", "Monthly full boarding", "إيواء شهري شامل", 350000, 0],
  ];
  plans.forEach(([kind, name, nameAr, amount, credits], n) =>
    put("plans", id("plan", n), {
      kind,
      name,
      nameEn: name,
      nameAr,
      amount,
      credits,
      active: true,
    }),
  );
  const invoice = (rid, member, description, gross, paid, at, extra = {}) => {
    const {
      reservation = null,
      quantity = 0,
      used = 0,
      status = paid >= gross ? "settled" : "open",
      plan = id("plan", 0),
    } = extra;
    run(
      "INSERT INTO proformas(id,org_id,member_id,reservation_id,description,gross,discount,voucher,due,paid,status,created_at,credit_quantity,credit_awarded,credit_used,plan_id) VALUES(?,?,?,?,?,?,0,0,?,?,?,?,?,?,?,?)",
      rid,
      org,
      member,
      reservation,
      description,
      gross,
      gross,
      paid,
      status,
      at,
      quantity,
      quantity && status === "settled" ? 1 : 0,
      used,
      plan,
    );
    if (paid) {
      const split =
        paid > 10000
          ? [Math.floor(paid * 0.4), paid - Math.floor(paid * 0.4)]
          : [paid];
      split.forEach((amount, part) =>
        run(
          "INSERT INTO payments(id,org_id,proforma_id,amount,reference,external_ref,created_at) VALUES(?,?,?,?,?,?,?)",
          `${rid}-payment-${part}`,
          org,
          rid,
          amount,
          `DEMO-RECEIPT-${rid}-${part}`,
          "DEMO — not a real payment / ليس دفعاً حقيقياً",
          at,
        ),
      );
    }
    if (quantity && status === "settled")
      credit(member, quantity, "package.paid", null, rid, at);
  };
  for (const [n, member] of members.entries()) {
    for (let p = 0; p < 2; p++)
      invoice(
        `demo-package-${n}-${p}`,
        member.id,
        "10-session package",
        200000,
        200000,
        origin,
        { quantity: 10, plan: id("plan", 2) },
      );
    if (n < 4)
      invoice(
        `demo-pending-package-${n}`,
        member.id,
        "5-session package",
        110000,
        n % 2 ? 44000 : 0,
        now,
        { quantity: 5, plan: id("plan", 1) },
      );
  }
  for (let n = 0; n < 120; n++) {
    const date =
      n < 40
        ? shift(start, Math.min(27, Math.floor(n * 0.7)))
        : shift(day, 1 + Math.floor((n - 40) * 0.7));
    const time = n % 2 ? "17:00" : "16:00",
      startsAt = stamp(date, time),
      endsAt = new Date(Date.parse(startsAt) + 45 * 60000).toISOString();
    const h = n % 12,
      t = n % 5;
    put("classes", id("class", n), {
      title: n % 3 ? "Riding skills" : "Polo foundations",
      titleEn: n % 3 ? "Riding skills" : "Polo foundations",
      titleAr: n % 3 ? "مهارات الركوب" : "أساسيات البولو",
      startsAt,
      endsAt,
      instructor: instructors[t].name,
      instructorId: id("instructor", t),
      arena: ["Main Polo Arena", "Covered Riding Arena", "Training Paddock"][
        n % 3
      ],
      arenaId: id("arena", n % 3),
      horseIds: [id("horse", h)],
      capacity: 1,
      creditCost: 1,
      planId: id("plan", 0),
    });
    if (n >= 100) continue;
    const member = members[n % 12],
      cancelled = n < 40 ? n % 8 === 0 : n >= 95,
      pending = n >= 85 && n < 95;
    const useCredits = n % 3 !== 0 && !pending;
    const rid = id("booking", n),
      pid = id("invoice", n),
      at = n < 40 ? stamp(shift(date, -1)) : now;
    run(
      "INSERT INTO reservations(id,org_id,member_id,class_id,horse_id,status,created_at,hold_expires_at) VALUES(?,?,?,?,?,?,?,?)",
      rid,
      org,
      member.id,
      id("class", n),
      id("horse", h),
      cancelled ? "cancelled" : pending ? "pending_payment" : "confirmed",
      at,
      pending ? new Date(Date.parse(now) + 72 * 3600000).toISOString() : null,
    );
    const gross = useCredits ? 0 : 25000,
      paid =
        cancelled || useCredits ? 0 : pending ? (n % 2 ? 10000 : 0) : gross;
    invoice(
      pid,
      member.id,
      n % 3 ? "Riding skills" : "Polo foundations",
      gross,
      paid,
      at,
      {
        reservation: rid,
        used: useCredits ? 1 : 0,
        status: cancelled ? "void" : pending ? "open" : "settled",
      },
    );
    if (useCredits) {
      credit(member.id, -1, "booking.used", rid, pid, at);
      if (cancelled) credit(member.id, 1, "booking.cancelled", rid, pid, at);
    }
    if (n < 40 && !cancelled)
      run(
        "INSERT INTO attendance VALUES(?,?,?,?,?)",
        rid,
        org,
        n % 9 ? "attended" : "absent",
        instructors[t].id,
        endsAt,
      );
  }
  for (let n = 0; n < 6; n++)
    put("stalls", id("stall", n), {
      name: `Stable ${String.fromCharCode(65 + n)}`,
      nameEn: `Stable ${String.fromCharCode(65 + n)}`,
      nameAr: `مربط ${n + 1}`,
      capacity: 2,
      active: true,
      notes: "Demo stable / مربط تجريبي",
    });
  for (let n = 0; n < 8; n++) {
    const pid = `demo-boarding-invoice-${n}`,
      member = n < 4 ? keeper.id : n < 7 ? members[n - 4].id : carers[0].id;
    invoice(
      pid,
      member,
      "Monthly full boarding",
      350000,
      n < 4 ? 350000 : n < 6 ? 140000 : 0,
      stamp(start),
      { plan: id("plan", 3) },
    );
    put("boarding", id("boarding", n), {
      horseId: id("horse", n < 4 ? n : n + 4),
      memberId: member,
      stallId: id("stall", Math.floor(n / 2)),
      planId: id("plan", 3),
      invoiceId: pid,
      startDate: start,
      endDate: end,
      status: "active",
      notes:
        "Demo boarding; daily care included. / إيواء تجريبي يشمل الرعاية اليومية.",
    });
  }
  for (let n = 0; n < 12; n++) {
    for (let meal = 0; meal < 3; meal++) {
      const planId = `demo-feeding-${n}-${meal}`,
        time = ["07:00", "12:00", "20:00"][meal];
      const plan = {
        id: planId,
        horseId: id("horse", n),
        feed: [
          "Morning hay / تبن صباحي",
          "Midday forage / علف ظهيرة",
          "Evening hay / تبن مسائي",
        ][meal],
        quantity:
          meal === 1
            ? "1.5 kg (demo) / ١٫٥ كجم (تجريبي)"
            : "2 kg (demo) / ٢ كجم (تجريبي)",
        time,
        durationMinutes: 30,
        startDate: start,
        endDate: end,
        active: true,
        assigneeId: carers[n % 2].id,
        inventoryId: "",
        stockUnits: 0,
        notes:
          "Demonstration only; not veterinary advice. / للعرض فقط؛ ليست إرشادات بيطرية.",
      };
      put("feeding", planId, plan);
      // Historical completed feedings plus the application's existing rolling future window.
      const dueDates = new Set(feedingSchedule(plan, new Date(now)));
      for (let date = start; date < day; date = shift(date, 1))
        dueDates.add(stamp(date, time));
      for (const dueAt of dueDates) {
        const done = dueAt < now,
          tid = `feeding:${planId}:${dueAt.slice(0, 10)}`;
        put("tasks", tid, {
          title: `${horseNames[n][0]} · ${plan.feed}`,
          titleEn: `${horseNames[n][0]} · feeding`,
          titleAr: `${horseNames[n][1]} · تغذية`,
          horseId: id("horse", n),
          feedingPlanId: planId,
          dueAt,
          assigneeId: plan.assigneeId,
          done,
          cancelled: false,
          completedAt: done ? dueAt : "",
          completedBy: done ? plan.assigneeId : "",
          notes: plan.notes,
        });
      }
    }
    for (const [k, type, typeAr] of [
      [0, "Farrier review", "فحص الحوافر والحدادة"],
      [1, "Routine health check", "فحص صحي دوري"],
    ]) {
      const date = shift(start, n + k * 21),
        due = shift(day, 7 + n + k * 14);
      put("medical", `demo-medical-${n}-${k}`, {
        horseId: id("horse", n),
        type,
        titleEn: type,
        titleAr: typeAr,
        date: stamp(date),
        dueAt: stamp(due),
        assigneeId: carers[n % 2].id,
        notes:
          "Fictional routine care record; review with the care team. / سجل رعاية تجريبي؛ يراجع مع فريق الرعاية.",
        restriction: false,
        completed: false,
        medication: "",
        dose: "",
        frequencyHours: 0,
        durationDays: 0,
        repeatMode: "none",
        completedAt: "",
      });
    }
    for (let date = start; date <= end; date = shift(date, 1)) {
      const done = date < day,
        dueAt = stamp(date, "08:00");
      put("tasks", `demo-grooming-${n}-${date}`, {
        title: `${horseNames[n][0]} · grooming and tack check`,
        titleEn: `${horseNames[n][0]} · grooming and tack check`,
        titleAr: `${horseNames[n][1]} · تنظيف وفحص معدات`,
        horseId: id("horse", n),
        dueAt,
        assigneeId: carers[n % 2].id,
        done,
        cancelled: false,
        completedAt: done ? dueAt : "",
        completedBy: done ? carers[n % 2].id : "",
        notes: "Demo daily care / رعاية يومية تجريبية",
      });
    }
  }
  for (const [n, user] of users.entries())
    run(
      "INSERT INTO notifications(id,org_id,user_id,title,message,created_at) VALUES(?,?,?,?,?,?)",
      id("notification", n),
      org,
      user.id,
      "Welcome to the demo / مرحباً في العرض التجريبي",
      "Fictional demonstration data; no real payments or emails. / بيانات تجريبية؛ لا مدفوعات أو رسائل بريد فعلية.",
      now,
    );
  for (const photo of photos)
    put("profilePhotos", `photo:${org}:${photo.kind}:${photo.id}`, {
      mime: photo.mime,
      content: photo.content,
      updatedAt: now,
    });
  run(
    "INSERT INTO audit(org_id,actor_id,action,record_id,created_at) VALUES(?,?,?,?,?)",
    org,
    keeper.id,
    "demo.reset-and-seed",
    org,
    now,
  );
  return {
    users: 20,
    horses: 12,
    instructors: 5,
    bookings: 100,
    availableClasses: 20,
    feedingPlans: 36,
    careRecords: 24,
    photos: photos.length,
    from: start,
    through: end,
  };
}
