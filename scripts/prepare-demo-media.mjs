// Development-only packaging, using the website's normal canvas upload sizing.
// Originals are retained; cPanel imports the already prepared assets without Chromium.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
const root = resolve(import.meta.dirname, ".."),
  output = join(root, "demo-assets");
const sources = JSON.parse(readFileSync(process.argv[2], "utf8"));
mkdirSync(join(output, "photos"), { recursive: true });
mkdirSync(join(output, "documents"), { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  const assets = [];
  for (const source of sources) {
    const bytes = readFileSync(source.path),
      mime = source.path.endsWith(".png") ? "image/png" : "image/jpeg";
    const jpeg = await page.evaluate(
      async ({ data }) => {
        const blob = await (await fetch(data)).blob(),
          bitmap = await createImageBitmap(blob),
          canvas = document.createElement("canvas"),
          ratio = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
        canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
        canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        return canvas.toDataURL("image/jpeg", 0.82).split(",")[1];
      },
      { data: `data:${mime};base64,${bytes.toString("base64")}` },
    );
    const prepared = Buffer.from(jpeg, "base64"),
      file = `photos/${source.key}.jpg`;
    writeFileSync(join(output, file), prepared);
    assets.push({
      key: source.key,
      file,
      mime: "image/jpeg",
      sha256: createHash("sha256").update(prepared).digest("hex"),
      source: source.source,
    });
  }
  const horses = [
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
  const instructors = [
    ["Omar Al Harbi", "عمر الحربي"],
    ["Khalid Al Qahtani", "خالد القحطاني"],
    ["Sara Al Dosari", "سارة الدوسري"],
    ["Faisal Al Otaibi", "فيصل العتيبي"],
    ["Noura Al Salem", "نورة السالم"],
  ];
  const font = readFileSync(
    join(root, "public/fonts/Tajawal-Regular.woff2"),
  ).toString("base64");
  const logo = readFileSync(join(output, "photos/avatar-club.jpg")).toString(
    "base64",
  );
  const documents = [];
  const row = (en, ar, value) =>
    `<tr><th>${en}<span dir="rtl">${ar}</span></th><td>${value}</td></tr>`;
  for (let n = 0; n < 12; n++)
    for (const kind of ["profile", "care"]) {
      const number = String(n + 1).padStart(2, "0"),
        horseId = `demo-horse-${number}`,
        name = horses[n],
        teacher = instructors[n % 5];
      const titleEn =
          kind === "profile"
            ? "Demo horse profile"
            : "Demo care and feeding summary",
        titleAr =
          kind === "profile" ? "ملف حصان تجريبي" : "ملخص رعاية وتغذية تجريبي";
      const file = `documents/horse-${number}-${kind}.pdf`;
      const rows =
        kind === "profile"
          ? [
              row("Horse", "الحصان", `${name[0]} / ${name[1]}`),
              row("Demo record ID", "معرف السجل التجريبي", horseId),
              row(
                "Illustrative microchip",
                "شريحة توضيحية",
                `DEMO-CHIP-${String(n + 1).padStart(4, "0")}`,
              ),
              row("Date of birth", "تاريخ الميلاد", `${2015 + (n % 6)}-03-15`),
              row(
                "Breed",
                "السلالة",
                [
                  "Arabian / عربي أصيل",
                  "Thoroughbred / ثوروبريد",
                  "Polo Pony / حصان بولو",
                ][n % 3],
              ),
              row(
                "Assigned instructor",
                "المدرب المعين",
                `${teacher[0]} / ${teacher[1]}`,
              ),
              row(
                "Owner category",
                "فئة المالك",
                n < 8
                  ? "Academy / الأكاديمية"
                  : n < 11
                    ? "Member / عضو"
                    : "Staff horse owner / موظف مالك حصان",
              ),
            ]
          : [
              row("Horse", "الحصان", `${name[0]} / ${name[1]}`),
              row(
                "Morning feeding",
                "تغذية صباحية",
                "07:00 · Hay · 2 kg (demo) / تبن · ٢ كجم (تجريبي)",
              ),
              row(
                "Midday feeding",
                "تغذية الظهيرة",
                "12:00 · Forage · 1.5 kg (demo) / علف · ١٫٥ كجم (تجريبي)",
              ),
              row(
                "Evening feeding",
                "تغذية مسائية",
                "20:00 · Hay · 2 kg (demo) / تبن · ٢ كجم (تجريبي)",
              ),
              row(
                "Daily grooming",
                "التنظيف اليومي",
                "08:00 · Grooming and tack check / تنظيف وفحص المعدات",
              ),
              row(
                "Routine follow-up",
                "المتابعة الدورية",
                "Farrier review and health check / فحص الحوافر والحدادة والفحص الصحي",
              ),
              row(
                "Live schedule",
                "الجدول الحالي",
                "View current dates and completion in the portal / راجع المواعيد والإنجاز في البوابة",
              ),
            ];
      await page.setContent(
        `<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:Tajawal;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{font:14px Tajawal,sans-serif;color:#0d2d45;margin:0;padding:24px}header{display:flex;align-items:center;gap:24px;border-bottom:3px solid #ba945b;padding-bottom:18px}header img{width:60px;height:76px;object-fit:contain}h1{font-size:20px;margin:4px 0}h2{font-size:18px;margin:8px 0}.demo{margin:18px 0;padding:10px;background:#fff2dc;border:1px solid #ba945b;font-weight:bold}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{border-bottom:1px solid #dedbd4;padding:10px;text-align:left;vertical-align:top}th{width:38%;background:#f7f5ef}th span{display:block;margin-top:5px}p{line-height:1.7}footer{margin-top:18px;border-top:1px solid #ddd;padding-top:12px;font-size:10px;color:#52616b}</style><header><img src="data:image/jpeg;base64,${logo}"><div><h1>Riyadh Polo Hills</h1><h1 dir="rtl">الرياض بولو هيلز</h1><h2>${titleEn}</h2><h2 dir="rtl">${titleAr}</h2></div></header><div class="demo">DEMO ONLY — FICTIONAL RECORD<br><span dir="rtl">للعرض فقط — سجل تجريبي خيالي</span></div><table>${rows.join("")}</table><p>This sample is linked to a fictional demonstration horse. It is not an official passport, proof of ownership, veterinary certificate or medical instruction.</p><p dir="rtl">هذا نموذج مرتبط بحصان تجريبي خيالي، ولا يعد جوازاً رسمياً أو إثبات ملكية أو شهادة بيطرية أو إرشادات علاجية.</p><footer>${horseId} · ${kind} · app.riyadhpolohills.com<br>Demonstration snapshot; refer to the live horse profile for current information.<br><span dir="rtl">نموذج توضيحي؛ يرجى الرجوع إلى ملف الحصان في النظام للمعلومات الحالية.</span></footer></html>`,
      );
      await page.evaluate(() => document.fonts.ready);
      const bytes = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "12mm", bottom: "12mm", left: "8mm", right: "8mm" },
      });
      writeFileSync(join(output, file), bytes);
      documents.push({
        id: `demo-document-${number}-${kind}`,
        horseId,
        title: `${titleEn} · ${name[0]}`,
        titleEn: `${titleEn} · ${name[0]}`,
        titleAr: `${titleAr} · ${name[1]}`,
        category: "other",
        filename: `${horseId}-${kind}.pdf`,
        mime: "application/pdf",
        file,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
    }
  writeFileSync(
    join(output, "manifest.json"),
    JSON.stringify({ version: 1, assets, documents }, null, 2) + "\n",
  );
  console.log(
    `Packaged ${assets.length} photos and ${documents.length} bilingual demo PDFs.`,
  );
} finally {
  await browser.close();
}
