import { PaymentReport } from "./PaymentReport";
import { EmailSettings } from "./EmailSettings";
import { BookingPlanner } from "./BookingPlanner";
import { UserPermissions } from "./UserPermissions";
import {
  PERMISSION_PAGES,
  staffPolicy,
  mayEditTaskDate,
} from "../shared/permissions";
import { ProfilePhoto } from "./ProfilePhoto";
import { DEFAULT_HOLD_HOURS } from "../shared/booking-policy";
import { discountCodeForForm } from "../shared/discount-code";
import { expectedClassSlots, verifyClassSlots } from "./classSchedule";
import release from "../package.json";
import { HorseProfile, CareReminders } from "./HorseProfile";
import { Boarding, FeedStock } from "./Boarding";
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  Users,
  HeartPulse,
  LayoutDashboard,
  Package,
  Tags,
  FileText,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
  Check,
  RefreshCw,
  Sprout,
  Search,
  Activity,
  BookOpen,
  Settings as SettingsIcon,
  GraduationCap,
  MapPin,
  ClipboardList,
  Ticket,
  BarChart3,
  Wallet,
  Home,
} from "lucide-react";
import { api } from "./api";
import { localizeData, localizedName, missingCatalogues } from "./localization";
import { HorseHead } from "./HorseHead";
import { SettingsHub } from "./SettingsHub";
import { ClientHome } from "./ClientHome";
import { CareTasks } from "./CareTasks";
import { TaskPlanner } from "./TaskPlanner";
import { VoucherCard } from "./VoucherCard";
import { riyadhDay } from "./calendar";
import { RecurrenceFields } from "./RecurrenceFields";
import { StablesManager } from "./StablesManager";
import { Schedule, MemberTools } from "./Scheduling";
import "./style.css";
import "./system.css";
const dict = {
  en: {
    settings: "Settings",
    systemSettings: "System settings",
    emailSettings: "Email settings",
    permissions: "Users & Permissions",
    frequencyHours: "Dose interval (hours)",
    durationDays: "Treatment duration (days)",
    durationMinutes: "Feeding duration (minutes)",
    startDate: "Schedule start date",
    endDate: "Schedule end date",
    instructors: "Instructors",
    arenas: "Training locations & arenas",
    breeds: "Horse breeds",
    address: "Address",
    phone: "Phone",
    ownerId: "Horse owner",
    instructorId: "Assigned instructor",
    placeType: "Place type",
    open_area: "Open area",
    indoor_arena: "Indoor arena",
    trail: "Trail",
    academyPortal: "Academy portal",
    memberPortal: "Member portal",
    myAccount: "My account",
    accountBalance: "My balance",
    sessionBalance: "Lesson credits remaining",
    credits: "Session credits (packages only)",
    creditCost: "Credits per booking",
    package: "Lesson package",
    requestPackage: "Request package",
    confirmRequest: "Confirm request",
    packagePending:
      "Your package payment request is ready. Credits are added after payment is recorded.",
    packagePayment:
      "Requesting a package creates a pro forma payment request. No money is collected here, and credits become available after the academy records full payment.",
    useCredits: "Use my lesson credits",
    creditHistory: "Lesson credit history",
    creditChange: "Credit change",
    creditReason: "Reason",
    upcoming: "My upcoming sessions",
    allInstructors: "All instructors",
    filterInstructor: "Choose instructor",
    creditPaid: "Package paid",
    creditRefunded: "Package refunded",
    creditUsed: "Session booked",
    creditRestored: "Booking cancelled",
    lessonCredits: "Lesson credits",
    packageNotice:
      "Package credits are awarded once payment is fully recorded. Regular bookings can be paid in SAR or with eligible lesson credits.",

    brand: "Riyadh Polo Club Academy",
    overview: "Overview",
    classes: "Classes & riding",
    horses: "Horses",
    medical: "Medical care",
    feeding: "Feeding plans",
    tasks: "Tasks",
    pricing: "Pricing",
    discounts: "Discount codes",
    vouchers: "Vouchers",
    billing: "Payment requests",
    inventory: "Inventory",
    stalls: "Stalls",
    boardingManagement: "Stalls & boarding",
    horseProfile: "Horse profile",
    inventoryId: "Feed stock item (optional)",
    stockUnits: "Stock units per feeding",
    reports: "Reports",
    members: "Members",
    notifications: "Notifications",
    login: "Sign in",
    register: "Create account",
    logout: "Sign out",
    email: "Email",
    password: "Password (6+ characters)",
    name: "Name",
    nameEn: "Name (English)",
    nameAr: "Name (Arabic)",
    titleEn: "Title (English)",
    titleAr: "Title (Arabic)",
    stableName: "Stable name",
    invite: "Member invitation code",
    join: "Join an existing stable",
    newStable: "Create a stable",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    loading: "Loading…",
    empty: "No records yet.",
    welcome: "Your academy workspace",
    intro: "Riding, care, and your team — connected in one place.",
    manager: "Staff",
    member: "Member",
    price: "Price (SAR)",
    amount: "Amount (SAR)",
    kind: "Category",
    code: "Code",
    mode: "Discount type",
    value: "Value (% or SAR)",
    minAmount: "Minimum spend (SAR)",
    maxUses: "Maximum redemptions",
    expiresAt: "Expiry",
    balance: "Voucher value (SAR)",
    active: "Active",
    breed: "Breed",
    birthDate: "Birth date",
    microchip: "Microchip / passport",
    status: "Status",
    notes: "Notes",
    title: "Title",
    startsAt: "Start",
    endsAt: "End",
    capacity: "Places",
    horseIds: "Available horses (select multiple)",
    instructorIds: "Instructors (select multiple)",
    instructor: "Instructor",
    arena: "Arena",
    planId: "Price plan",
    horseId: "Horse",
    type: "Care type",
    date: "Recorded at",
    dueAt: "Due at",
    vet: "Vet / care provider",
    restriction: "Restrict horse from riding",
    completed: "Care completed",
    medication: "Medication",
    dose: "Dose / route",
    frequency: "Frequency",
    feed: "Feed / supplement",
    quantity: "Quantity",
    time: "Daily time (Riyadh)",
    assigneeId: "Assigned to",
    done: "Done",
    unit: "Unit",
    reorderAt: "Reorder level",
    book: "Book",
    quote: "Calculate total",
    confirm: "Confirm booking",
    discountCode: "Discount code (optional)",
    voucherCode: "Voucher code (optional)",
    gross: "Original amount",
    discount: "Discount",
    voucher: "Voucher applied",
    due: "Amount due",
    proforma: "PRO FORMA — NOT A TAX INVOICE",
    fiscal:
      "Official tax invoices are issued only by your separate ZATCA invoicing system.",
    createRequest: "Create payment request",
    refund: "Record external refund",
    memberId: "Member",
    payment: "Record payment",
    reference: "Payment reference",
    externalRef: "Payment voucher details / invoice reference",
    paid: "Payments recorded",
    outstanding: "Outstanding",
    recordedPayments: "Recorded payments",
    bookings: "Confirmed bookings",
    lowStock: "Low stock items",
    overdueTasks: "Overdue tasks",
    discountsTotal: "Discounts applied",
    voucherUsed: "Vouchers redeemed",
    inviteMember: "Invite a member",
    inviteInfo:
      "Single-use invitation. Expires in 7 days. Share securely with the intended member.",
    markRead: "Mark read",
    refresh: "Refresh",
    ready: "Ready to ride",
    rest: "Medical rest",
    retired: "Retired",
    percent: "Percentage",
    fixed: "Fixed amount",
    class: "Group class",
    private: "Private lesson",
    ride: "Ride",
    boarding: "Boarding",
    boarding_food: "Boarding with food",
    boarding_full: "Full-inclusive boarding",
    boarding_medical: "Boarding with medical care",
    other: "Other",
    open: "Pending payment",
    settled: "Paid",
    void: "Void",
    pending_payment: "Awaiting payment",
    expired: "Expired hold",
    refund_required: "Refund / reconciliation required",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    cancelBooking: "Cancel booking",
    myBookings: "My bookings",
    places: "places left",
    view: "View",
    print: "Print pro forma",
    refundNotice:
      "Record a refund already completed externally. Enter the credit note reference from your invoicing system.",
    creditRef: "External credit note reference",
    paymentNotice:
      "Record a payment already received. This does not collect money or issue a tax invoice.",
    emailOff:
      "In-app notifications are active. Email delivery is not configured.",
    emailOn: "In-app and queued SMTP email notifications are enabled.",
    dataNotice: "Shared server data · amounts in SAR · Riyadh time",
    passwordHint:
      "Use a unique password of at least 6 characters. New stable accounts are managers; invitations create member accounts.",
    search: "Search…",
    saved: "Saved successfully.",
    bookingSaved:
      "Booking saved. Payment is pending until the academy records your payment voucher.",
    notificationIntro: "Booking updates and scheduled care reminders.",
    membersIntro:
      "Invite members to let them view classes and manage their bookings.",
    back: "Back",
    select: "Select",
    usage: "Uses",
    remaining: "Remaining",
    restrictionNote:
      "Completing care does not automatically clear rest. Edit the horse after veterinary clearance.",
    session: "Class",
    caregiver: "Caregiver",
    owner: "Staff",
    role: "Role",
    allBookings: "All bookings",
    noPrices: "Create a price plan and horses before scheduling a class.",
    copy: "Copy code",
    copied: "Copied",
    error: "Could not load data",
    retry: "Retry",
    connection: "Connection interrupted; showing last loaded data.",
    registrationNote:
      "Public sign-up creates a separate stable. To join this academy, request an invitation.",
    feedingNote:
      "Daily feeding plans create assigned tasks in Riyadh time. Save a plan to start the reminders.",
    cancelPolicy:
      "Unpaid future bookings can be cancelled and vouchers restored. Paid bookings require external reconciliation.",
    noBilling: "Book a class to create a pro forma payment request.",
    purpose: "Stable and member management",
    unread: "Unread",
    complete: "Complete",
    medicalFor: "Medical history",
  },
  ar: {
    settings: "الإعدادات",
    systemSettings: "إعدادات النظام",
    emailSettings: "إعدادات البريد الإلكتروني",
    permissions: "المستخدمون والصلاحيات",
    frequencyHours: "تكرار الجرعة كل (ساعة)",
    durationDays: "مدة العلاج (أيام)",
    durationMinutes: "مدة التغذية (دقائق)",
    startDate: "تاريخ بداية الجدول",
    endDate: "تاريخ نهاية الجدول",
    instructors: "المدربون",
    arenas: "مواقع التدريب والميادين",
    breeds: "سلالات الخيول",
    address: "العنوان",
    phone: "الهاتف",
    ownerId: "مالك الحصان",
    instructorId: "المدرب المخصص",
    placeType: "نوع الموقع",
    open_area: "منطقة مفتوحة",
    indoor_arena: "ميدان مغلق",
    trail: "مسار خارجي",
    academyPortal: "بوابة الأكاديمية",
    memberPortal: "بوابة العضو",
    myAccount: "حسابي",
    accountBalance: "رصيدي",
    sessionBalance: "رصيد الحصص المتبقي",
    credits: "عدد الحصص (للباقات فقط)",
    creditCost: "رصيد الحصص المطلوب للحجز",
    package: "باقة حصص",
    requestPackage: "طلب باقة",
    confirmRequest: "تأكيد الطلب",
    packagePending: "تم إنشاء طلب دفع الباقة. يضاف رصيد الحصص بعد تسجيل الدفع.",
    packagePayment:
      "طلب الباقة ينشئ طلب دفع مبدئياً. لا يتم تحصيل المال هنا؛ يضاف الرصيد بعد تسجيل الأكاديمية للسداد الكامل.",
    useCredits: "استخدام رصيد حصصي",
    creditHistory: "حركة رصيد الحصص",
    creditChange: "التغيير في الرصيد",
    creditReason: "السبب",
    upcoming: "حصصي القادمة",
    allInstructors: "جميع المدربين",
    filterInstructor: "اختيار المدرب",
    creditPaid: "سداد الباقة",
    creditRefunded: "استرداد الباقة",
    creditUsed: "حجز حصة",
    creditRestored: "إلغاء الحجز",
    lessonCredits: "رصيد الحصص",
    packageNotice:
      "يضاف رصيد الباقة بعد تسجيل السداد الكامل. يمكن الحجز بالدفع بالريال أو برصيد الحصص المتاح.",

    brand: "أكاديمية نادي الرياض للبولو",
    overview: "نظرة عامة",
    classes: "الحصص والركوب",
    horses: "الخيول",
    medical: "الرعاية الطبية",
    feeding: "خطط التغذية",
    tasks: "المهام",
    pricing: "الأسعار",
    discounts: "أكواد الخصم",
    vouchers: "القسائم",
    billing: "طلبات الدفع",
    inventory: "المخزون",
    stalls: "المرابط",
    boardingManagement: "المرابط والإيواء",
    horseProfile: "ملف الحصان",
    inventoryId: "صنف العلف بالمخزون (اختياري)",
    stockUnits: "وحدات المخزون لكل وجبة",
    reports: "التقارير",
    members: "الأعضاء",
    notifications: "الإشعارات",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور (6 أحرف على الأقل)",
    name: "الاسم",
    nameEn: "الاسم بالإنجليزية",
    nameAr: "الاسم بالعربية",
    titleEn: "العنوان بالإنجليزية",
    titleAr: "العنوان بالعربية",
    stableName: "اسم الإسطبل",
    invite: "رمز دعوة العضو",
    join: "الانضمام إلى إسطبل",
    newStable: "إنشاء إسطبل",
    save: "حفظ",
    cancel: "إلغاء",
    add: "إضافة",
    edit: "تعديل",
    loading: "جارٍ التحميل…",
    empty: "لا توجد سجلات بعد.",
    welcome: "مساحة الأكاديمية",
    intro: "الركوب والرعاية والفريق — في مكان واحد.",
    manager: "موظف",
    member: "عضو",
    price: "السعر (ريال)",
    amount: "المبلغ (ريال)",
    kind: "الفئة",
    code: "الرمز",
    mode: "نوع الخصم",
    value: "القيمة (% أو ريال)",
    minAmount: "الحد الأدنى للإنفاق (ريال)",
    maxUses: "أقصى عدد للاستخدام",
    expiresAt: "الصلاحية",
    balance: "قيمة القسيمة (ريال)",
    active: "نشط",
    breed: "السلالة",
    birthDate: "تاريخ الميلاد",
    microchip: "الشريحة / جواز الحصان",
    status: "الحالة",
    notes: "ملاحظات",
    title: "العنوان",
    startsAt: "البداية",
    endsAt: "النهاية",
    capacity: "الأماكن",
    horseIds: "الخيول المتاحة (اختيار متعدد)",
    instructorIds: "المدربون (اختيار متعدد)",
    instructor: "المدرب",
    arena: "الميدان",
    planId: "خطة السعر",
    horseId: "الحصان",
    type: "نوع الرعاية",
    date: "تاريخ التسجيل",
    dueAt: "موعد الاستحقاق",
    vet: "الطبيب / مقدم الرعاية",
    restriction: "منع الحصان من الركوب",
    completed: "اكتملت الرعاية",
    medication: "الدواء",
    dose: "الجرعة / طريقة الإعطاء",
    frequency: "التكرار",
    feed: "العلف / المكمل",
    quantity: "الكمية",
    time: "الوقت اليومي (الرياض)",
    assigneeId: "المكلف",
    done: "مكتمل",
    unit: "الوحدة",
    reorderAt: "حد إعادة الطلب",
    book: "حجز",
    quote: "حساب الإجمالي",
    confirm: "تأكيد الحجز",
    discountCode: "كود الخصم (اختياري)",
    voucherCode: "رمز القسيمة (اختياري)",
    gross: "المبلغ الأصلي",
    discount: "الخصم",
    voucher: "القسيمة المستخدمة",
    due: "المبلغ المستحق",
    proforma: "طلب دفع مبدئي — ليس فاتورة ضريبية",
    fiscal:
      "تصدر الفواتير الضريبية الرسمية حصرياً من نظام الفوترة الخارجي المتوافق مع هيئة الزكاة والضريبة والجمارك.",
    createRequest: "إنشاء طلب دفع",
    refund: "تسجيل استرداد خارجي",
    memberId: "العضو",
    payment: "تسجيل دفعة",
    reference: "مرجع الدفع",
    externalRef: "تفاصيل سند الدفع / مرجع الفاتورة",
    paid: "الدفعات المسجلة",
    outstanding: "المستحق",
    recordedPayments: "الدفعات المسجلة",
    bookings: "الحجوزات المؤكدة",
    lowStock: "أصناف منخفضة المخزون",
    overdueTasks: "المهام المتأخرة",
    discountsTotal: "الخصومات المطبقة",
    voucherUsed: "القسائم المستخدمة",
    inviteMember: "دعوة عضو",
    inviteInfo:
      "دعوة للاستخدام مرة واحدة صالحة لمدة 7 أيام. شاركها مع العضو المعني فقط.",
    markRead: "تحديد كمقروء",
    refresh: "تحديث",
    ready: "جاهز للركوب",
    rest: "راحة طبية",
    retired: "متقاعد",
    percent: "نسبة مئوية",
    fixed: "مبلغ ثابت",
    class: "حصة جماعية",
    private: "حصة خاصة",
    ride: "جولة ركوب",
    boarding: "إيواء",
    boarding_food: "إيواء مع التغذية",
    boarding_full: "إيواء شامل",
    boarding_medical: "إيواء مع الرعاية الطبية",
    other: "أخرى",
    open: "بانتظار الدفع",
    settled: "مسدد",
    void: "ملغى",
    pending_payment: "بانتظار السداد",
    expired: "انتهت مهلة الحجز",
    refund_required: "تحتاج استرداداً أو تسوية",
    confirmed: "مؤكد",
    cancelled: "ملغى",
    cancelBooking: "إلغاء الحجز",
    myBookings: "حجوزاتي",
    places: "أماكن متبقية",
    view: "عرض",
    print: "طباعة طلب الدفع",
    refundNotice:
      "سجل استرداداً تم تنفيذه خارجياً وأدخل مرجع الإشعار الدائن من نظام الفوترة.",
    creditRef: "مرجع الإشعار الدائن الخارجي",
    paymentNotice:
      "سجل دفعة تم استلامها بالفعل. هذه العملية لا تحصّل المال ولا تصدر فاتورة ضريبية.",
    emailOff: "إشعارات التطبيق مفعلة. إرسال البريد الإلكتروني غير مهيأ.",
    emailOn: "إشعارات التطبيق وإرسال البريد الإلكتروني مفعّلان.",
    dataNotice: "بيانات مشتركة على الخادم · العملة ريال · توقيت الرياض",
    passwordHint:
      "استخدم كلمة مرور فريدة من 6 أحرف على الأقل. إنشاء إسطبل يمنح دور المدير، والدعوة تمنح دور العضو.",
    search: "بحث…",
    saved: "تم الحفظ بنجاح.",
    bookingSaved: "تم حفظ الحجز. يبقى بانتظار الدفع حتى تسجيل سند الدفع.",
    notificationIntro: "تحديثات الحجوزات وتذكيرات الرعاية المجدولة.",
    membersIntro: "ادع الأعضاء لعرض الحصص وإدارة حجوزاتهم.",
    back: "رجوع",
    select: "اختر",
    usage: "الاستخدامات",
    remaining: "المتبقي",
    restrictionNote:
      "إكمال الرعاية لا يرفع الراحة تلقائياً. عدّل حالة الحصان بعد موافقة الطبيب.",
    session: "الحصة",
    owner: "موظف",
    role: "الدور",
    allBookings: "جميع الحجوزات",
    noPrices: "أنشئ خطة سعر وأضف الخيول قبل جدولة حصة.",
    copy: "نسخ الرمز",
    copied: "تم النسخ",
    error: "تعذر تحميل البيانات",
    retry: "إعادة المحاولة",
    connection: "انقطع الاتصال؛ يتم عرض آخر بيانات محملة.",
    registrationNote:
      "التسجيل العام ينشئ إسطبلاً مستقلاً. للانضمام إلى الأكاديمية اطلب دعوة.",
    feedingNote:
      "خطط التغذية اليومية تنشئ مهام بتوقيت الرياض. احفظ الخطة لبدء التذكيرات.",
    cancelPolicy:
      "يمكن إلغاء الحجز المستقبلي غير المدفوع واستعادة القسيمة. الحجوزات المدفوعة تتطلب تسوية خارجية.",
    noBilling: "احجز حصة لإنشاء طلب دفع مبدئي.",
    purpose: "إدارة الإسطبل والأعضاء",
    unread: "غير مقروء",
    complete: "إكمال",
    medicalFor: "السجل الطبي",
  },
};
const fresh = {
  instructors: [],
  arenas: [],
  breeds: [],
  settings: null,
  creditBalance: 0,
  creditLedger: [],
  payments: [],
  waitlist: [],
  attendance: [],
  taskHistory: [],
  horses: [],
  plans: [],
  classes: [],
  medical: [],
  feeding: [],
  tasks: [],
  discounts: [],
  vouchers: [],
  inventory: [],
  stalls: [],
  boarding: [],
  stockMovements: [],
  bookings: [],
  proformas: [],
  members: [],
  notifications: [],
};
function App() {
  const [lang, setLang] = useState(
      localStorage.getItem("academy-language") || "en",
    ),
    [auth, setAuth] = useState(null),
    [stable, setStable] = useState(null),
    [rawData, setData] = useState(fresh),
    [backendVersion, setBackendVersion] = useState(""),
    [page, setPage] = useState("overview"),
    [loading, setLoading] = useState(true),
    [failure, setFailure] = useState(""),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false),
    [toast, setToast] = useState(""),
    [menu, setMenu] = useState(false),
    [instructorFilter, setInstructorFilter] = useState(""),
    [q, setQ] = useState(""),
    [reports, setReports] = useState(null),
    [calendarDate, setCalendarDate] = useState(""),
    [taskPlanFilter, setTaskPlanFilter] = useState(null),
    [pendingVoucher, setPendingVoucher] = useState(() => {
      const url = new URL(window.location.href),
        code = url.searchParams.get("voucher");
      if (code) {
        sessionStorage.setItem("booking-voucher", code.trim().toUpperCase());
        url.searchParams.delete("voucher");
        window.history.replaceState(
          null,
          "",
          url.pathname + url.search + url.hash,
        );
      }
      return sessionStorage.getItem("booking-voucher") || "";
    });
  const t = { ...dict[lang] },
    ar = lang === "ar",
    manager = ["owner", "staff", "instructor", "vet", "caregiver"].includes(
      rawData.userRole || stable?.role,
    ),
    staff = false,
    client = (rawData.userRole || stable?.role) === "member";
  if (client) {
    t.classes = ar ? "حجز موعد" : "Book a slot";
    t.horses = ar ? "خيولي" : "My horses";
    t.instructors = ar ? "مدربوني" : "My instructors";
    t.billing = ar ? "فواتيري" : "My invoices";
  }
  const refreshSequence = useRef(0),
    stableRef = useRef(stable?.id);
  stableRef.current = stable?.id;
  const data = localizeData(rawData, ar);
  const selectStable = (selected) => {
    if (!selected || selected.id === stable?.id) return;
    refreshSequence.current++;
    setData(fresh);
    setCalendarDate("");
    setStable(selected);
    setPage("overview");
    setQ("");
    setMenu(false);
  };
  const toggleCareTask = (task, done) =>
    action(() =>
      request("/tasks/" + task.id + "/toggle", {
        method: "POST",
        body: { done },
      }),
    );
  const isSystemAdmin = rawData.isAdmin ?? stable?.isAdmin ?? false;
  const allowedModules =
    rawData.permissions || stable?.permissions || PERMISSION_PAGES;
  const moduleFor = (kind) =>
    ({
      plans: "pricing",
      boardingManagement: "boarding",
      systemSettings: "settings",
    })[kind] || kind;
  const actionGrants =
    rawData.actionPermissions ||
    stable?.actionPermissions ||
    staffPolicy(allowedModules).actions;
  const permitted = (kind, action) =>
    isSystemAdmin ||
    (allowedModules.includes(moduleFor(kind)) &&
      (!action || actionGrants[moduleFor(kind)]?.includes(action)));
  const canComplete = (task) =>
    manager &&
    permitted("tasks", "edit") &&
    mayEditTaskDate(task.dueAt, new Date().toISOString(), isSystemAdmin);
  const canManage = (kind, action = "add") =>
    manager && permitted(kind, action);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.title = t.brand;
    localStorage.setItem("academy-language", lang);
  }, [lang]);
  async function init() {
    setLoading(true);
    try {
      const a = await api("/auth/me");
      setAuth(a);
      setStable(a.stables[0]);
      setFailure("");
    } catch (e) {
      if (e.status !== 401) setFailure(e.message);
      setAuth(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    let active = true;
    setBackendVersion("");
    api("/health")
      .then((health) => {
        if (active) setBackendVersion(health.version || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [stable?.id]);
  const request = (path, opts = {}) =>
    api(path, { stableId: stable?.id, ...opts });
  async function refresh(silent = false) {
    const sequence = ++refreshSequence.current,
      stableId = stable?.id;
    try {
      const d = await request("/data");
      if (stableId !== stableRef.current) return null;
      // A newer refresh owns the display, but this valid snapshot still verifies
      // the save that requested it. Superseded is not the same as failed.
      if (sequence !== refreshSequence.current) return d;
      setData(d);
      setFailure(
        missingCatalogues(d).length
          ? ar
            ? "نسخة الخادم قديمة أو استجابة البيانات غير مكتملة. حدّث مستودع cPanel إلى آخر إصدار ثم أعد تشغيل تطبيق Node.js. لن تظهر القوائم الجديدة حتى يتحدث الخادم."
            : "The backend is outdated or returned incomplete data. Update the cPanel repository to the latest commit and restart the Node.js app. New catalogues require the updated backend."
          : "",
      );
      if (
        manager &&
        (d.isAdmin || !d.permissions || d.permissions.includes("reports"))
      ) {
        try {
          setReports(await request("/reports"));
        } catch (e) {
          setFailure(e.message);
        }
      }
      return d;
    } catch (e) {
      if (e.status === 401) {
        setAuth(null);
        setStable(null);
      } else setFailure(e.message);
      return null;
    }
  }
  useEffect(() => {
    if (!stable) return;
    setData(fresh);
    refresh();
    const timer = setInterval(() => refresh(true), 30000);
    return () => clearInterval(timer);
  }, [stable?.id]);
  const notify = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 5000);
  };
  async function action(fn) {
    setBusy(true);
    try {
      await fn();
      await refresh();
      return true;
    } catch (e) {
      notify(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const money = (v) =>
    new Intl.NumberFormat(ar ? "ar-SA-u-nu-latn" : "en-SA-u-nu-latn", {
      style: "currency",
      currency: "SAR",
    }).format((v || 0) / 100);
  const when = (v) =>
    v
      ? new Date(v).toLocaleString(
          ar ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB-u-nu-latn",
          {
            timeZone: "Asia/Riyadh",
            dateStyle: "medium",
            timeStyle: "short",
          },
        )
      : "—";
  const labelHorse = (id) => data.horses.find((h) => h.id === id)?.name || "—";
  const memberName = (id) => data.members.find((m) => m.id === id)?.name || "—";
  const go = (p) => {
    if (p === "tasks") setTaskPlanFilter(null);
    setPage(p);
    setQ("");
    setMenu(false);
  };
  const nav = [
    ["overview", LayoutDashboard],
    ["classes", CalendarDays],
    ...(!manager ? [["accountBalance", BookOpen]] : []),
    ["horses", HorseHead],
    ...(client ? [["instructors", GraduationCap]] : []),
    ...(manager
      ? [
          ["medical", HeartPulse],
          ["feeding", Sprout],
        ]
      : []),
    ["tasks", ClipboardList],
    ["pricing", Tags],
    ...(manager
      ? [
          ["discounts", Ticket],
          ["vouchers", Ticket],
        ]
      : []),
    ["billing", FileText],
    ...(manager
      ? [
          ["inventory", Package],
          ["boardingManagement", HorseHead],
          ["reports", BarChart3],
          ["members", Users],
          ...(permitted("settings") ||
          permitted("stables") ||
          permitted("emailSettings")
            ? [["settings", SettingsIcon]]
            : []),
          ...(isSystemAdmin || permitted("members")
            ? [["permissions", Users]]
            : []),
        ]
      : []),
    ["notifications", Bell],
  ]
    .filter(
      ([key]) =>
        !client ||
        [
          "overview",
          "classes",
          "accountBalance",
          "horses",
          "instructors",
          "billing",
        ].includes(key),
    )
    .filter(
      ([key]) =>
        !staff ||
        [
          "overview",
          "notifications",
          ...({
            instructor: ["classes", "horses", "pricing", "tasks"],
            vet: ["horses", "medical", "tasks"],
            caregiver: ["horses", "feeding", "tasks"],
          }[stable?.role] || []),
        ].includes(key),
    );
  for (let i = nav.length - 1; i >= 0; i--)
    if (
      manager &&
      !["overview", "notifications", "permissions"].includes(nav[i][0]) &&
      !(nav[i][0] === "settings"
        ? permitted("settings") ||
          permitted("stables") ||
          permitted("emailSettings")
        : permitted(nav[i][0]))
    )
      nav.splice(i, 1);
  if (staff)
    for (const [key, icon] of [
      ["medical", HeartPulse],
      ["feeding", Sprout],
    ])
      if (canManage(key) && !nav.some(([k]) => k === key))
        nav.push([key, icon]);
  t.repeatWeeks = ar
    ? "تكرار أسبوعي (1–52 أسبوعاً، للحصص الجديدة)"
    : "Repeat weekly (1–52 weeks; new classes only)";
  function fields(kind) {
    const horses = data.horses.map((h) => [h.id, h.name]),
      members = data.members.map((m) => [m.id, m.name]);
    return (
      {
        breeds: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["active", "checkbox"],
          ["notes", "textarea"],
        ],
        instructors: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["email", "email"],
          ["phone", "tel"],
          ["active", "checkbox"],
          ["notes", "textarea"],
        ],
        arenas: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          [
            "placeType",
            "select",
            true,
            ["arena", "open_area", "indoor_arena", "trail", "other"].map(
              (v) => [v, t[v]],
            ),
          ],
          ["address", "text"],
          ["active", "checkbox"],
          ["notes", "textarea"],
        ],
        stalls: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["capacity", "number", true],
          ["active", "checkbox"],
          ["notes", "textarea"],
        ],
        horses: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["breed", "text"],
          ["birthDate", "date"],
          ["microchip", "text"],
          ["ownerId", "select", false, members],
          [
            "instructorId",
            "select",
            false,
            data.instructors.map((i) => [i.id, i.name]),
          ],
          [
            "status",
            "select",
            true,
            ["ready", "rest", "retired"].map((v) => [v, t[v]]),
          ],
          ["notes", "textarea"],
        ],
        plans: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["amount", "money", true],
          [
            "kind",
            "select",
            true,
            [
              "class",
              "private",
              "ride",
              "boarding",
              "boarding_food",
              "boarding_full",
              "boarding_medical",
              "package",
              "other",
            ].map((v) => [v, t[v]]),
          ],
          ["credits", "number"],
          ["active", "checkbox"],
        ],
        classes: [
          ["titleEn", "text", true],
          ["titleAr", "text"],
          ["startsAt", "datetime-local", true],
          ["endsAt", "datetime-local", true],
          ["capacity", "number", true],
          ["creditCost", "number", true],
          ["horseIds", "multi", true, horses],
          modal?.record?.instructorId
            ? [
                "instructorId",
                "select",
                true,
                data.instructors
                  .filter((i) => i.active)
                  .map((i) => [i.id, i.name]),
              ]
            : modal?.record
              ? ["instructor", "text", true]
              : [
                  "instructorIds",
                  "multi",
                  true,
                  data.instructors
                    .filter((i) => i.active)
                    .map((i) => [i.id, i.name]),
                ],
          [
            "arena",
            "select",
            true,
            [
              ...new Map(
                [
                  ...data.arenas
                    .filter((a) => a.active)
                    .map((a) => [a.nameEn || a.name, a.name]),
                  ...(modal?.record?.arena
                    ? [[modal.record.arena, modal.record.arena]]
                    : []),
                ].map((entry) => [entry[0], entry]),
              ).values(),
            ],
          ],
          [
            "planId",
            "select",
            true,
            data.plans
              .filter((p) => p.active && !p.credits)
              .map((p) => [p.id, p.name + " · " + money(p.amount)]),
          ],
        ],
        medical: [
          modal?.record
            ? ["horseId", "select", true, horses]
            : ["horseIds", "multi", true, horses],
          ["type", "text", true],
          ["date", "datetime-local", true],
          ["dueAt", "datetime-local"],
          ["vet", "text"],
          ["medication", "text"],
          ["dose", "text"],
          ["frequency", "text"],
          ["frequencyHours", "number"],
          ["durationDays", "number"],
          ["assigneeId", "select", true, members],
          ["notes", "textarea", true],
          ["restriction", "checkbox"],
          ["completed", "checkbox"],
        ],
        feeding: [
          modal?.record
            ? ["horseId", "select", true, horses]
            : ["horseIds", "multi", true, horses],
          ["feed", "text", true],
          [
            "inventoryId",
            "select",
            false,
            data.inventory.map((i) => [i.id, i.name + " · " + i.unit]),
          ],
          ["stockUnits", "number"],
          ["quantity", "text", true],
          ["time", "time", true],
          ["durationMinutes", "number", true],
          ["startDate", "date"],
          ["endDate", "date"],
          ["active", "checkbox"],
          ["assigneeId", "select", true, members],
          ["notes", "textarea"],
        ],
        tasks: [
          ["titleEn", "text", true],
          ["titleAr", "text"],
          ["dueAt", "datetime-local", true],
          ["assigneeId", "select", true, members],
          ["notes", "textarea"],
        ],
        discounts: [
          ["titleEn", "text", true],
          ["titleAr", "text"],
          ["code", "generated", false],
          ["mode", "select", true, ["percent", "fixed"].map((v) => [v, t[v]])],
          ["value", "number", true],
          ["minAmount", "money"],
          ["maxUses", "number", true],
          ["expiresAt", "datetime-local", true],
          ["active", "checkbox"],
        ],
        vouchers: [
          ["code", "text", true],
          ["balance", "money", true],
          ["expiresAt", "datetime-local", true],
        ],
        inventory: [
          ["nameEn", "text", true],
          ["nameAr", "text"],
          ["unit", "text", true],
          ["quantity", "number", true],
          ["reorderAt", "number"],
          ["expiresAt", "datetime-local"],
        ],
      }[kind] || []
    );
  }
  function defaults(kind) {
    return {
      ...(kind === "vouchers"
        ? {
            code: "RP-" + crypto.randomUUID().replaceAll("-", "").toUpperCase(),
          }
        : {}),
      ...(kind === "discounts"
        ? {
            discountDigits: String(
              crypto.getRandomValues(new Uint32Array(1))[0] % 1000,
            ).padStart(3, "0"),
          }
        : {}),
      active: true,
      repeatWeeks: 1,
      repeatMode: "none",
      repeatEvery: 1,
      repeatDays: [],
      repeatUntil: "",
      placeType: "arena",
      capacity: kind === "classes" ? 1 : data.settings?.defaultCapacity || 1,
      creditCost: data.settings?.defaultCreditCost || 1,
      credits: 0,
      status: "ready",
      mode: "percent",
      maxUses: 1,
      kind: "class",
      date: new Date().toISOString(),
      ...(kind === "medical"
        ? { frequencyHours: 0, durationDays: 0, assigneeId: auth.user.id }
        : {}),
      ...(kind === "feeding"
        ? { time: "07:00", durationMinutes: 30, assigneeId: auth.user.id }
        : {}),
    };
  }
  function openForm(kind, row) {
    setModal({
      kind,
      record: row || null,
      form: { ...defaults(kind), ...row },
    });
  }
  async function saveRecord(e) {
    e.preventDefault();
    const b = { ...modal.form };
    if (
      modal.kind === "medical" &&
      modal.record?.dailyDose &&
      !modal.touched?.includes("frequencyHours")
    )
      b.frequencyHours = 0;
    if (modal.kind === "discounts") {
      b.code = discountCodeForForm(modal.form, modal.record?.code);
      b.autoCode = !modal.record;
      delete b.discountDigits;
    }
    if (b.nameEn !== undefined || b.nameAr !== undefined)
      b.name = b.nameEn || b.nameAr || "";
    if (b.titleEn !== undefined || b.titleAr !== undefined)
      b.title = b.titleEn || b.titleAr || "";
    if (modal.kind === "horses") {
      delete b.breedEn;
      delete b.breedAr;
    }
    if (modal.kind === "classes") {
      delete b.instructorEn;
      delete b.instructorAr;
      delete b.arenaEn;
      delete b.arenaAr;
    }
    for (const [key, type] of fields(modal.kind)) {
      if (type === "number") b[key] = Number(b[key] || 0);
      if (type === "money") b[key] = Math.round(Number(b[key] || 0) * 100);
      if (type === "datetime-local" || type === "date")
        b[key] = b[key]
          ? new Date(
              type === "datetime-local" && !/Z$|[+-]\d\d:\d\d$/.test(b[key])
                ? b[key] + ":00+03:00"
                : b[key],
            ).toISOString()
          : "";
    }
    if (modal.kind === "discounts" && b.mode === "fixed")
      b.value = Math.round(b.value * 100);
    let expected = null,
      scheduleSubmitted = false;
    try {
      if (modal.kind === "classes" && !modal.record)
        expected = expectedClassSlots(b);
    } catch (e) {
      notify(e.message);
      return;
    }
    setBusy(true);
    try {
      const kind = modal.kind,
        savedStable = stable?.id;
      if (expected && b.instructorIds) {
        const health = await request("/health");
        if (health.schedulingVersion !== 2)
          throw new Error(
            ar
              ? "حدّث خادم cPanel وأعد تشغيل Node.js قبل حفظ مواعيد المدربين. لم يتم إرسال الحفظ."
              : "Update the cPanel backend and restart Node.js before saving instructor slots. Nothing has been submitted.",
          );
      }
      if (
        kind === "medical" &&
        b.durationDays > 0 &&
        (b.frequencyHours === 0 || (b.repeatMode && b.repeatMode !== "none"))
      ) {
        const health = await request("/health");
        if (health.medicalScheduleVersion !== 2)
          throw new Error(
            ar
              ? "حدّث خادم cPanel إلى 1.14.0 وأعد تشغيله لحفظ الجرعات اليومية مع الأيام المختارة."
              : "Update the cPanel backend to 1.14.0 and restart it to save daily doses with selected weekdays.",
          );
      }
      const saved = await request(
        "/records/" + kind + (modal.record ? "/" + modal.record.id : ""),
        { method: modal.record ? "PUT" : "POST", body: b },
      );
      if (stableRef.current !== savedStable) return;
      if (expected) {
        scheduleSubmitted = true;
        setModal((m) => (m ? { ...m, saveSubmitted: true } : m));
        // Confirm all dates, not just the first class returned by an older backend.
        const rows = Array.isArray(saved.created) ? saved.created : [saved];
        verifyClassSlots(expected, rows);
        const loaded = await refresh();
        const byId = new Map(
          (loaded?.classes || []).map((row) => [row.id, row]),
        );
        const missing = rows.filter((row) => !byId.has(row.id));
        for (let offset = 0; offset < missing.length; offset += 4) {
          const verified = await Promise.all(
            missing
              .slice(offset, offset + 4)
              .map((row) =>
                request("/records/classes/" + encodeURIComponent(row.id)),
              ),
          );
          for (const row of verified) byId.set(row.id, row);
        }
        const persisted = rows.map((row) => byId.get(row.id));
        verifyClassSlots(expected, persisted);
        if (stableRef.current !== savedStable) return;
        refreshSequence.current++;
        setData((previous) => ({
          ...previous,
          classes: [
            ...(loaded?.classes || previous.classes || []).filter(
              (c) => !persisted.some((p) => p.id === c.id),
            ),
            ...persisted,
          ],
        }));
        setFailure("");
        setModal(null);
        go("classes");
        setInstructorFilter("");
        setCalendarDate(
          riyadhDay(persisted[0].startsAt) + "|" + crypto.randomUUID(),
        );
        notify(
          ar
            ? "تم تأكيد " + persisted.length + " مواعيد في التقويم."
            : persisted.length + " calendar slots saved and verified.",
        );
        return;
      }
      // A successful write must not be hidden by an old search filter.
      setModal(null);
      go(kind === "plans" ? "pricing" : kind);
      if (kind === "classes") {
        setInstructorFilter("");
        setCalendarDate(riyadhDay(saved.startsAt));
      }
      const loaded = await refresh();
      if (stableRef.current !== savedStable) return;
      if (loaded?.[kind]?.some((r) => r.id === saved.id)) notify(t.saved);
      else {
        try {
          if (typeof saved.id !== "string" || !saved.id)
            throw new Error("The backend returned no saved record ID");
          const verified = await request(
            "/records/" + kind + "/" + encodeURIComponent(saved.id),
          );
          if (stableRef.current !== savedStable) return;
          if (verified.id !== saved.id)
            throw new Error("The backend returned a different record");
          // This is a server-confirmed record, not an optimistic copy of the form.
          // A delayed collection response must not hide a successful read-back.
          setData((previous) => ({
            ...previous,
            [kind]: [
              ...(Array.isArray(previous[kind]) ? previous[kind] : []).filter(
                (row) => row.id !== verified.id,
              ),
              verified,
            ],
          }));
          setFailure("");
          notify(t.saved);
        } catch (error) {
          const detail = error.status ? "HTTP " + error.status : error.message;
          const message = ar
            ? "قبل الخادم الحفظ، لكن تعذر تأكيد السجل من قاعدة البيانات (" +
              detail +
              "). حدّث الصفحة قبل الإضافة مرة أخرى. معرف السجل: " +
              (saved.id || "—")
            : "The backend accepted the save but could not read the record back (" +
              detail +
              "). Refresh before adding it again. Record ID: " +
              (saved.id || "missing");
          setFailure(message);
          notify(message);
        }
      }
    } catch (e) {
      if (scheduleSubmitted) setFailure(e.message);
      if (e.code === "BACKEND_UPDATE_REQUIRED") setFailure(e.message);
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }

  function editFormValue(key, type) {
    if (
      key === "frequencyHours" &&
      modal.record?.dailyDose &&
      !modal.touched?.includes(key)
    )
      return 0;
    const value = modal.form[key];
    if (type === "money")
      return value === undefined
        ? ""
        : modal.record && !modal.touched?.includes(key)
          ? value / 100
          : value;
    if (type === "datetime-local" && value) {
      const d = new Date(value);
      if (!Number.isNaN(+d))
        return new Date(d.getTime() + 3 * 3600000).toISOString().slice(0, 16);
    }
    if (type === "date" && value) return value.slice(0, 10);
    if (
      key === "value" &&
      modal.kind === "discounts" &&
      modal.form.mode === "fixed" &&
      modal.record &&
      !modal.touched?.includes(key)
    )
      return value / 100;
    return value ?? "";
  }
  function change(key, value) {
    setModal((m) => ({
      ...m,
      form: {
        ...m.form,
        [key]: value,
        ...(m.kind === "classes" && key === "startsAt" && !m.record && value
          ? {
              endsAt: new Date(
                new Date(value + ":00+03:00").getTime() +
                  (data.settings?.lessonDuration || 60) * 60000,
              ).toISOString(),
            }
          : {}),
      },
      touched: [...(m.touched || []), key],
      quote: null,
    }));
  }
  function rowCard(kind, r) {
    return (
      <article className="panel record-card" key={r.id}>
        {["horses", "instructors"].includes(kind) && (
          <ProfilePhoto
            kind={kind}
            id={r.id}
            name={r.name}
            request={request}
            editable={canManage(kind, "edit")}
            removable={canManage(kind, "delete")}
            ar={ar}
          />
        )}
        <div className="section-heading">
          <h3>{r.name || r.title || r.code || labelHorse(r.horseId)}</h3>
          {canManage(kind, "edit") &&
            kind !== "vouchers" &&
            !(kind === "tasks" && (r.medicalId || r.feedingPlanId)) && (
              <button
                className="text-button"
                onClick={() => {
                  const form = { ...r };
                  for (const [k, type] of fields(kind))
                    if (type === "money") form[k] = (r[k] || 0) / 100;
                  if (kind === "discounts" && r.mode === "fixed")
                    form.value = r.value / 100;
                  setModal({
                    kind,
                    record: r,
                    form,
                    touched: fields(kind).map((f) => f[0]),
                  });
                }}
              >
                {t.edit}
              </button>
            )}
        </div>
        {["instructors", "arenas", "breeds"].includes(kind) ? (
          <>
            <p>
              {r.email} {r.phone}
            </p>
            <p>{r.notes}</p>
            <span className="pill">
              {r.active ? t.active : ar ? "غير نشط" : "Inactive"}
            </span>
          </>
        ) : kind === "horses" ? (
          <>
            <button
              className="primary"
              onClick={() => setModal({ kind: "horseProfile", record: r })}
            >
              {ar ? "فتح ملف الحصان" : "Open horse profile"}
            </button>
            <p>{r.breed}</p>
            <span className={"pill " + (r.status === "rest" ? "warning" : "")}>
              {t[r.status]}
            </span>
            <p>{r.notes}</p>
          </>
        ) : kind === "plans" ? (
          <>
            <div className="big-money">{money(r.amount)}</div>
            {r.credits > 0 && (
              <>
                <p>
                  {r.credits} {t.lessonCredits}
                </p>
                <button
                  className="primary"
                  onClick={() => setModal({ kind: "package", record: r })}
                >
                  {t.requestPackage}
                </button>
              </>
            )}
            <p>
              {t[r.kind]} · {r.active ? t.active : "—"}
            </p>
          </>
        ) : kind === "discounts" ? (
          <>
            <code className="discount-code" dir="ltr">
              {r.code}
            </code>
            <div className="big-money">
              {r.mode === "percent" ? r.value + "%" : money(r.value)}
            </div>
            <p>
              {t.usage}: {r.uses}/{r.maxUses}
            </p>
            <p>{when(r.expiresAt)}</p>
          </>
        ) : kind === "vouchers" ? (
          <>
            <div className="big-money">{money(r.balance)}</div>
            <p>
              {t.remaining} · {when(r.expiresAt)}
            </p>
            <button
              className="primary"
              onClick={() => setModal({ kind: "voucherPrint", record: r })}
            >
              {ar ? "عرض QR والطباعة" : "QR code & print"}
            </button>
          </>
        ) : kind === "medical" ? (
          <>
            <p>
              <strong>{r.type}</strong> · {r.vet}
            </p>
            <p>
              {r.medication} {r.dose} {r.frequency}
            </p>
            <p>{r.notes}</p>
            <p>
              {t.date}: {when(r.date)}
            </p>
            <p>
              {t.dueAt}: {when(r.dueAt)}
            </p>
            {r.frequencyHours > 0 && (
              <p>
                {ar ? "كل" : "Every"} {r.frequencyHours}{" "}
                {ar ? "ساعة لمدة" : "hours for"} {r.durationDays}{" "}
                {ar ? "أيام" : "days"}
              </p>
            )}
            <CareTasks
              compact
              tasks={data.tasks.filter((task) => task.medicalId === r.id)}
              history={data.taskHistory}
              members={data.members}
              ar={ar}
              when={when}
              toggle={toggleCareTask}
              busy={busy}
              canComplete={canComplete}
            />
            <span className="pill">
              {r.completed ? t.completed : r.restriction ? t.rest : t.open}
            </span>
            {r.completedAt && (
              <p>
                {when(r.completedAt)} · {memberName(r.completedBy)}
              </p>
            )}
          </>
        ) : kind === "feeding" ? (
          <>
            <button
              className="primary"
              onClick={() => {
                go("tasks");
                setTaskPlanFilter("feeding:" + r.id);
              }}
            >
              {ar ? "متابعة التغذية اليومية" : "Daily feeding planner"}
            </button>
            <p>
              <strong>{r.feed}</strong> · {r.quantity}
            </p>
            <p>
              {r.time} · {r.durationMinutes || 30} {ar ? "دقيقة" : "minutes"} ·{" "}
              {memberName(r.assigneeId)}
            </p>
            <p className="notice">
              {ar
                ? "الحصان غير متاح للحجز خلال فترة التغذية."
                : "This horse is unavailable for booking during feeding."}
            </p>
            <CareTasks
              compact
              tasks={data.tasks.filter((task) => task.feedingPlanId === r.id)}
              history={data.taskHistory}
              members={data.members}
              ar={ar}
              when={when}
              toggle={toggleCareTask}
              busy={busy}
              canComplete={canComplete}
            />
            <p>{r.notes}</p>
          </>
        ) : kind === "tasks" ? (
          <>
            <p>
              {when(r.dueAt)} · {memberName(r.assigneeId)}
            </p>
            <p>{r.notes}</p>
            <button
              className="soft"
              disabled={busy}
              onClick={() =>
                action(() =>
                  request("/tasks/" + r.id + "/toggle", { method: "POST" }),
                )
              }
            >
              {r.done ? "✓ " + t.done : t.complete}
            </button>
          </>
        ) : kind === "inventory" ? (
          <>
            <div className="big-money">
              {r.quantity} <small>{r.unit}</small>
            </div>
            <p>
              {t.reorderAt}: {r.reorderAt}
            </p>
            {r.quantity <= r.reorderAt && (
              <span className="pill warning">{t.lowStock}</span>
            )}
            <p>{when(r.expiresAt)}</p>
          </>
        ) : null}
      </article>
    );
  }
  if (loading)
    return (
      <div className="auth-page">
        <p>{t.loading}</p>
      </div>
    );
  if (!auth)
    return (
      <div className="auth-page">
        <button
          className="language auth-language"
          onClick={() => setLang(ar ? "en" : "ar")}
        >
          {ar ? "English" : "العربية"}
        </button>
        <section className="auth-card">
          <img
            className="auth-logo"
            src="/logos/riyadh-polo-club-academy.png"
            alt={t.brand}
          />
          <h1>{t.brand}</h1>
          <p>{t.purpose}</p>
          {failure && (
            <p className="error" role="alert">
              {failure}
            </p>
          )}
          <AuthForm t={t} onSuccess={init} />
        </section>
      </div>
    );
  const unread = data.notifications.filter((n) => !n.read_at).length;
  const PageIcon =
    page === "breeds"
      ? HorseHead
      : page === "instructors"
        ? GraduationCap
        : page === "arenas"
          ? MapPin
          : nav.find(([key]) => key === page)?.[1] || Home;
  return (
    <div className={client ? "client-layout" : "academy-layout"}>
      <aside className={"sidebar " + (menu ? "open" : "")}>
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            go("overview");
          }}
        >
          <img
            className="academy-logo"
            src="/logos/riyadh-polo-club-academy.png"
            alt={t.brand}
          />
          <span>
            {t.brand}
            <small>{t.purpose}</small>
          </span>
        </a>
        <div className="stable-selector">
          <label>
            {ar ? "الإسطبل الحالي" : "Active stable"}
            <select
              aria-label={ar ? "الإسطبل الحالي" : "Active stable"}
              value={stable.id}
              onChange={(e) =>
                selectStable(auth.stables.find((s) => s.id === e.target.value))
              }
            >
              {auth.stables.map((s) => (
                <option key={s.id} value={s.id}>
                  {localizedName(s, ar)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav>
          {nav.map(([key, Icon]) => (
            <button
              key={key}
              className={page === key ? "selected" : ""}
              onClick={() => go(key)}
            >
              <Icon size={17} />
              {key === "overview" && !manager ? t.myAccount : t[key]}
              {key === "notifications" && unread > 0 && (
                <span className="count">{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          className="profile"
          onClick={() =>
            action(async () => {
              await api("/auth/logout", { method: "POST" });
              setAuth(null);
              setStable(null);
              setData(fresh);
            })
          }
        >
          <span className="avatar">
            {localizedName(auth.user, ar).slice(0, 1)}
          </span>
          <span>
            <strong>{localizedName(auth.user, ar)}</strong>
            <small>{manager ? t.manager : t.member}</small>
          </span>
          <LogOut size={17} />
        </button>
      </aside>
      <div className="workspace">
        <header>
          <button
            className="mobile-menu icon-button"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            <img
              className="header-logo"
              src="/logos/riyadh-polo-club-academy.png"
              alt=""
            />
            {t.brand}
          </div>
          <div className="header-actions">
            {client && (
              <button
                className="icon-button"
                aria-label={ar ? "تسجيل الخروج" : "Log out"}
                onClick={() =>
                  action(async () => {
                    await api("/auth/logout", { method: "POST" });
                    setAuth(null);
                    setStable(null);
                    setData(fresh);
                  })
                }
              >
                <LogOut size={17} />
              </button>
            )}
            <button
              className="language"
              onClick={() => setLang(ar ? "en" : "ar")}
            >
              {ar ? "English" : "العربية"}
            </button>
            <button
              className="icon-button"
              aria-label={t.refresh}
              onClick={() => refresh()}
            >
              <RefreshCw size={17} />
            </button>
            <button
              className="icon-button"
              aria-label={t.notifications}
              onClick={() => go("notifications")}
            >
              <Bell size={17} />
              {unread > 0 && <small>{unread}</small>}
            </button>
          </div>
        </header>
        <main>
          <p className="data-notice">
            <strong>
              {manager || staff ? t.academyPortal : t.memberPortal}
            </strong>{" "}
            · {t.dataNotice}
          </p>
          {failure && (
            <p className="error" role="alert">
              {failure}
            </p>
          )}
          {client && auth.stables.length > 1 && (
            <label className="client-stable-switch">
              {ar ? "الإسطبل" : "Stable"}
              <select
                value={stable.id}
                onChange={(e) =>
                  selectStable(
                    auth.stables.find((s) => s.id === e.target.value),
                  )
                }
              >
                {auth.stables.map((s) => (
                  <option key={s.id} value={s.id}>
                    {localizedName(s, ar)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="page-title">
            <div>
              <div className="eyebrow">
                {localizedName(
                  {
                    name: stable.name,
                    nameEn: rawData.settings?.academyNameEn ?? stable.nameEn,
                    nameAr: rawData.settings?.academyNameAr ?? stable.nameAr,
                  },
                  ar,
                )}
              </div>
              <div className="heading-with-icon">
                <PageIcon size={30} />
                <h1>
                  {page === "overview" && !manager ? t.myAccount : t[page]}
                </h1>
              </div>
              <p>
                {page === "overview"
                  ? t.intro
                  : page === "billing"
                    ? t.fiscal
                    : page === "members"
                      ? t.membersIntro
                      : page === "feeding"
                        ? t.feedingNote
                        : page === "notifications"
                          ? t.notificationIntro
                          : ""}
              </p>
            </div>
            {canManage(page === "pricing" ? "plans" : page) &&
              [
                "classes",
                "instructors",
                "arenas",
                "breeds",
                "horses",
                "stalls",
                "medical",
                "feeding",
                "tasks",
                "discounts",
                "vouchers",
                "inventory",
                "pricing",
              ].includes(page) && (
                <button
                  className="primary"
                  onClick={() => openForm(page === "pricing" ? "plans" : page)}
                >
                  <Plus size={17} />
                  {t.add}
                </button>
              )}
            {page === "billing" && canManage("billing", "add") && (
              <button
                className="primary"
                onClick={() => setModal({ kind: "manualBilling", form: {} })}
              >
                {t.createRequest}
              </button>
            )}
            {page === "members" && canManage("members", "add") && (
              <button
                className="primary"
                onClick={() =>
                  action(async () => {
                    const d = await request("/invites", { method: "POST" });
                    setModal({ kind: "invite", code: d.code });
                  })
                }
              >
                {t.inviteMember}
              </button>
            )}
          </div>

          {page === "permissions" &&
            manager &&
            !isSystemAdmin &&
            permitted("members") && (
              <MemberTools
                key={stable.id}
                canAdd={canManage("members", "add")}
                canEdit={canManage("members", "edit")}
                canDelete={canManage("members", "delete")}
                isAdmin={false}
                members={data.members}
                emailConfigured={data.emailConfigured}
                busy={busy}
                request={request}
                action={action}
                ar={ar}
              />
            )}
          {page === "permissions" && isSystemAdmin && (
            <UserPermissions
              key={stable.id}
              request={request}
              ar={ar}
              onSaved={() => refresh()}
            />
          )}
          {page === "boardingManagement" && manager && (
            <Boarding
              data={data}
              ar={ar}
              request={request}
              action={action}
              busy={busy}
              can={canManage}
              openForm={openForm}
              money={money}
            />
          )}
          {page === "inventory" && manager && (
            <FeedStock
              canReceive={canManage("inventory", "add")}
              data={data}
              ar={ar}
              request={request}
              action={action}
              busy={busy}
            />
          )}
          {["overview", "medical"].includes(page) && manager && (
            <CareReminders
              medical={data.medical}
              horses={data.horses}
              ar={ar}
              when={when}
            />
          )}
          {page === "overview" && client && (
            <ClientHome
              key={stable.id}
              request={request}
              data={data}
              user={{ ...auth.user, name: localizedName(auth.user, ar) }}
              ar={ar}
              t={t}
              go={go}
              when={when}
              money={money}
              busy={busy}
              cancel={(id) =>
                action(() =>
                  request("/bookings/" + id + "/cancel", { method: "POST" }),
                )
              }
            />
          )}
          {page === "settings" && manager && (
            <StablesManager
              canCreate={canManage("stables", "add")}
              stables={auth.stables}
              current={stable.id}
              ar={ar}
              onSelect={selectStable}
              busy={busy}
              onCreate={async (form) => {
                setBusy(true);
                try {
                  const created = await request("/stables", {
                    method: "POST",
                    body: form,
                  });
                  const refreshed = await api("/auth/me");
                  setAuth(refreshed);
                  selectStable(
                    refreshed.stables.find((s) => s.id === created.id),
                  );
                  notify(t.saved);
                  return true;
                } catch (e) {
                  notify(e.message);
                  return false;
                } finally {
                  setBusy(false);
                }
              }}
            />
          )}
          {page === "emailSettings" &&
            manager &&
            permitted("emailSettings") && (
              <>
                <button className="soft" onClick={() => go("settings")}>
                  {ar ? "العودة إلى الإعدادات" : "Back to settings"}
                </button>
                <EmailSettings
                  key={stable.id}
                  settings={data.emailSettings}
                  ar={ar}
                  request={request}
                  action={action}
                  busy={busy || !canManage("emailSettings", "edit")}
                />
              </>
            )}
          {["settings", "systemSettings"].includes(page) &&
            manager &&
            (page === "settings" || permitted("settings")) && (
              <SettingsHub
                page={page}
                can={canManage}
                canView={permitted}
                settings={data.settings}
                stableName={localizedName(
                  {
                    name: stable.name,
                    nameEn: rawData.settings?.academyNameEn ?? stable.nameEn,
                    nameAr: rawData.settings?.academyNameAr ?? stable.nameAr,
                  },
                  ar,
                )}
                data={data}
                ar={ar}
                request={request}
                action={action}
                onSaved={(name, form) => {
                  setStable((s) => ({
                    ...s,
                    name,
                    nameEn: form.academyNameEn || name,
                    nameAr: form.academyNameAr || "",
                  }));
                  setAuth((a) => ({
                    ...a,
                    stables: a.stables.map((s) =>
                      s.id === stable.id
                        ? {
                            ...s,
                            name,
                            nameEn: form.academyNameEn || name,
                            nameAr: form.academyNameAr || "",
                          }
                        : s,
                    ),
                  }));
                  notify(t.saved);
                }}
                go={go}
                openForm={openForm}
                busy={busy}
                t={t}
              />
            )}
          {page === "overview" && !manager && !client && (
            <>
              <section className="stats">
                {[
                  [BookOpen, data.creditBalance, t.sessionBalance],
                  [
                    CalendarDays,
                    data.bookings.filter(
                      (b) =>
                        ["confirmed", "pending_payment"].includes(b.status) &&
                        data.classes.find((c) => c.id === b.class_id)
                          ?.startsAt > new Date().toISOString(),
                    ).length,
                    t.upcoming,
                  ],
                  [
                    FileText,
                    money(
                      data.proformas
                        .filter((p) => p.status === "open")
                        .reduce((n, p) => n + p.due - p.paid, 0),
                    ),
                    t.outstanding,
                  ],
                  [Bell, unread, t.unread],
                ].map(([Icon, n, l]) => (
                  <div className="stat" key={l}>
                    <span className="stat-icon sand">
                      <Icon size={20} />
                    </span>
                    <div>
                      <strong>{n}</strong>
                      <span>{l}</span>
                    </div>
                  </div>
                ))}
              </section>
              <div className="member-actions">
                <button className="primary" onClick={() => go("classes")}>
                  {t.book}
                </button>
                <button className="soft" onClick={() => go("accountBalance")}>
                  {t.accountBalance}
                </button>
              </div>
              <h2 className="subheading">{t.upcoming}</h2>
              <div className="record-grid">
                {data.bookings
                  .filter(
                    (b) =>
                      ["confirmed", "pending_payment"].includes(b.status) &&
                      data.classes.find((c) => c.id === b.class_id)?.startsAt >
                        new Date().toISOString(),
                  )
                  .map((b) => {
                    const c = data.classes.find((c) => c.id === b.class_id);
                    return (
                      <article className="panel record-card" key={b.id}>
                        <h3>{c.title}</h3>
                        <p>{when(c.startsAt)}</p>
                        <p>
                          {c.instructor} · {c.arena}
                        </p>
                        <p>{labelHorse(b.horse_id)}</p>
                        <button
                          className="text-button"
                          disabled={busy}
                          onClick={() =>
                            action(() =>
                              request("/bookings/" + b.id + "/cancel", {
                                method: "POST",
                              }),
                            )
                          }
                        >
                          {t.cancelBooking}
                        </button>
                      </article>
                    );
                  })}
              </div>

              <p className="notice">{t.cancelPolicy}</p>
            </>
          )}
          {page === "accountBalance" && !manager && (
            <>
              <div className="balance-hero panel">
                <div>
                  <p>{t.sessionBalance}</p>
                  <div className="big-money">{data.creditBalance}</div>
                </div>
                <button className="primary" onClick={() => go("pricing")}>
                  {t.requestPackage}
                </button>
              </div>
              <p className="notice">{t.packageNotice}</p>
              <div className="panel table-wrap">
                <h2>{t.creditHistory}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.creditReason}</th>
                      <th>{t.creditChange}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.creditLedger.map((l) => (
                      <tr key={l.id}>
                        <td>{when(l.created_at)}</td>
                        <td>
                          {{
                            "package.paid": t.creditPaid,
                            "package.refunded": t.creditRefunded,
                            "booking.used": t.creditUsed,
                            "booking.cancelled": t.creditRestored,
                          }[l.reason] || l.reason}
                        </td>
                        <td dir="ltr">
                          {l.delta > 0 ? "+" : ""}
                          {l.delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.creditLedger.length && (
                  <p className="empty">{t.empty}</p>
                )}
              </div>
            </>
          )}
          {page === "overview" && manager && (
            <>
              <div className="stats">
                {[
                  [HorseHead, data.horses.length, t.horses],
                  [
                    CalendarDays,
                    data.bookings.filter((b) =>
                      ["confirmed", "pending_payment"].includes(b.status),
                    ).length,
                    t.bookings,
                  ],
                  [Check, data.tasks.filter((x) => !x.done).length, t.tasks],
                  [Bell, unread, t.unread],
                ].map(([Icon, n, l]) => (
                  <div className="stat" key={l}>
                    <span className="stat-icon sand">
                      <Icon size={22} />
                    </span>
                    <div>
                      <strong>{n}</strong>
                      <span>{l}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dashboard-grid">
                <div className="panel">
                  <h2>{t.classes}</h2>
                  {data.classes
                    .filter((c) => c.startsAt > new Date().toISOString())
                    .slice(0, 4)
                    .map((c) => (
                      <button
                        className="today-row"
                        key={c.id}
                        onClick={() => go("classes")}
                      >
                        <CalendarDays size={20} />
                        <span>
                          <strong>{c.title}</strong>
                          <small>{when(c.startsAt)}</small>
                        </span>
                      </button>
                    ))}
                  {!data.classes.length && <p className="empty">{t.empty}</p>}
                  <button className="primary" onClick={() => go("classes")}>
                    {t.classes}
                  </button>
                </div>
                <div className="panel">
                  <h2>{t.tasks}</h2>
                  {data.tasks
                    .filter((x) => !x.done)
                    .slice(0, 4)
                    .map((r) => (
                      <div className="task-row" key={r.id}>
                        <Check size={18} />
                        <span>
                          {r.title}
                          <small>{when(r.dueAt)}</small>
                        </span>
                      </div>
                    ))}
                  {!data.tasks.length && <p className="empty">{t.empty}</p>}
                  <p className="notice">
                    {data.emailConfigured ? t.emailOn : t.emailOff}
                  </p>
                </div>
              </div>
            </>
          )}
          {page === "classes" && (
            <>
              <p className="notice">
                {ar
                  ? "احجز موعداً أخضر. الحجز الأصفر يحتفظ بالمقعد لمدة تصل إلى " +
                    (data.settings?.bookingHoldHours ?? DEFAULT_HOLD_HOURS) +
                    " ساعة لتأكيد السداد، ثم يحرر تلقائياً."
                  : "Book a green opening. Yellow holds reserve a seat for up to " +
                    (data.settings?.bookingHoldHours ?? DEFAULT_HOLD_HOURS) +
                    " hours for full payment confirmation, then release automatically."}
              </p>
              <div className="slot-summary">
                <strong>
                  {
                    data.classes.filter(
                      (c) => c.endsAt > new Date().toISOString(),
                    ).length
                  }{" "}
                  {ar ? "مواعيد مجدولة" : "scheduled openings"}
                </strong>
                <span>
                  {data.classes.reduce(
                    (n, c) => n + (c.confirmedPlaces || 0),
                    0,
                  )}{" "}
                  {ar ? "مقاعد مؤكدة" : "confirmed seats"}
                </span>
              </div>
              <details
                className={client ? "client-calendar" : "admin-calendar"}
                open
              >
                <summary>{ar ? "عرض التقويم" : "Show calendar"}</summary>
                <Schedule
                  holdHours={
                    data.settings?.bookingHoldHours ?? DEFAULT_HOLD_HOURS
                  }
                  defaultView={data.settings?.calendarView || "month"}
                  initialDate={calendarDate.split("|")[0]}
                  key={
                    (data.settings?.calendarView || "month") +
                    "|" +
                    calendarDate
                  }
                  classes={data.classes.filter(
                    (c) =>
                      !instructorFilter || c.instructor === instructorFilter,
                  )}
                  horses={data.horses}
                  ar={ar}
                  onSelect={(c) => {
                    if (manager && !canManage("classes", "add")) {
                      notify(
                        ar
                          ? "ليست لديك صلاحية إضافة حجز."
                          : "You do not have Add permission to book a slot.",
                      );
                      return;
                    }
                    const existing = data.bookings.find(
                      (b) =>
                        b.class_id === c.id &&
                        ["confirmed", "pending_payment"].includes(b.status),
                    );
                    if (existing && !manager) {
                      go("overview");
                      return;
                    }
                    if (c.places <= 0) {
                      notify(
                        ar
                          ? "هذا الموعد غير متاح حالياً. اختر موعداً أخضر."
                          : "This slot is unavailable. Choose a green slot.",
                      );
                      return;
                    }
                    setModal({
                      kind: "booking",
                      classId: c.id,
                      title: c.title,
                      form: { voucherCode: pendingVoucher },
                    });
                  }}
                />
              </details>

              <BookingPlanner
                data={data}
                ar={ar}
                staff={manager}
                stableName={localizedName(stable, ar)}
                when={when}
              />
              <p className="notice">{t.cancelPolicy}</p>
              <label className="instructor-filter">
                {t.filterInstructor}
                <select
                  aria-label={t.filterInstructor}
                  value={instructorFilter}
                  onChange={(e) => setInstructorFilter(e.target.value)}
                >
                  <option value="">{t.allInstructors}</option>
                  {[...new Set(data.classes.map((c) => c.instructor))].map(
                    (i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ),
                  )}
                </select>
              </label>
              {manager && (!data.plans.length || !data.horses.length) && (
                <p className="notice">{t.noPrices}</p>
              )}
              <div className="session-grid">
                {data.classes
                  .filter(
                    (c) =>
                      c.endsAt > new Date().toISOString() &&
                      (!instructorFilter || c.instructor === instructorFilter),
                  )
                  .map((c) => {
                    const b = data.bookings.find(
                      (b) =>
                        b.class_id === c.id &&
                        b.member_id === auth.user.id &&
                        ["confirmed", "pending_payment"].includes(b.status),
                    );
                    const plan = data.plans.find((p) => p.id === c.planId);
                    return (
                      <article className="session" key={c.id}>
                        <div className="session-top">
                          <span className="eyebrow">{c.instructor}</span>
                          <span className="pill">
                            {c.places} {t.places}
                          </span>
                        </div>
                        <h3>{c.title}</h3>
                        <p>{when(c.startsAt)}</p>
                        <p>
                          {c.arena} · {money(plan?.amount)}
                        </p>
                        <div className="session-bottom">
                          <button
                            className="primary"
                            disabled={
                              busy ||
                              (manager && !b && !canManage("classes", "add")) ||
                              (manager && b && !canManage("classes", "delete"))
                            }
                            onClick={() =>
                              !b && c.places <= 0
                                ? action(() =>
                                    request("/waitlist", {
                                      method: "POST",
                                      body: { classId: c.id },
                                    }),
                                  )
                                : b
                                  ? action(() =>
                                      request("/bookings/" + b.id + "/cancel", {
                                        method: "POST",
                                      }),
                                    )
                                  : setModal({
                                      kind: "booking",
                                      classId: c.id,
                                      title: c.title,
                                      form: { voucherCode: pendingVoucher },
                                    })
                            }
                          >
                            {b
                              ? t.cancelBooking
                              : c.places <= 0
                                ? ar
                                  ? "قائمة الانتظار"
                                  : "Join waitlist"
                                : t.book}
                          </button>
                          {canManage("classes", "add") &&
                            canManage("classes", "edit") &&
                            !c.seriesId && (
                              <button
                                className="soft"
                                onClick={() =>
                                  setModal({
                                    kind: "classes",
                                    form: {
                                      ...defaults("classes"),
                                      ...c,
                                      id: undefined,
                                      sourceClassId: c.id,
                                      instructorIds: c.instructorId
                                        ? [c.instructorId]
                                        : data.instructors
                                            .filter(
                                              (i) =>
                                                i.nameEn === c.instructorEn ||
                                                i.name === c.instructor,
                                            )
                                            .map((i) => i.id),
                                      repeatMode: "weekdays",
                                      repeatDays: [
                                        new Date(
                                          riyadhDay(c.startsAt) + "T12:00:00Z",
                                        ).getUTCDay(),
                                      ],
                                      repeatUntil: riyadhDay(
                                        new Date(
                                          Date.parse(c.startsAt) +
                                            28 * 86400000,
                                        ),
                                      ),
                                    },
                                  })
                                }
                              >
                                {ar
                                  ? "جدولة أيام إضافية"
                                  : "Schedule selected days"}
                              </button>
                            )}
                          {canManage("classes", "edit") && (
                            <button
                              className="text-button"
                              onClick={() => openForm("classes", c)}
                            >
                              {t.edit}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </div>
              <section className="panel">
                <h3>{ar ? "قائمة الانتظار" : "Waitlist"}</h3>
                {data.waitlist?.map((w) => (
                  <div className="task-row" key={w.id}>
                    <span>
                      {data.classes.find((c) => c.id === w.class_id)?.title} ·{" "}
                      {memberName(w.member_id)}
                    </span>
                    <button
                      onClick={() =>
                        action(() =>
                          request("/waitlist/" + w.id, { method: "DELETE" }),
                        )
                      }
                    >
                      {ar ? "إزالة" : "Remove"}
                    </button>
                  </div>
                ))}
              </section>
              <h2 className="subheading booking-table-heading">
                {manager ? t.allBookings : t.myBookings}
              </h2>
              <div className="panel table-wrap classes-booking-table">
                <table>
                  <thead>
                    <tr>
                      <th>{t.session}</th>
                      {(manager || stable?.role === "instructor") && (
                        <th>{t.member}</th>
                      )}
                      <th>{t.horses}</th>
                      <th>{t.status}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          {data.classes.find((c) => c.id === b.class_id)?.title}
                        </td>
                        {manager && <td>{memberName(b.member_id)}</td>}
                        <td>{labelHorse(b.horse_id)}</td>
                        <td>
                          {t[b.status] || b.status}
                          {canManage("classes", "edit") &&
                            b.status === "confirmed" && (
                              <label>
                                {ar ? "الحضور" : "Attendance"}
                                <select
                                  aria-label={ar ? "الحضور" : "Attendance"}
                                  value={
                                    data.attendance?.find(
                                      (a) => a.reservation_id === b.id,
                                    )?.status || ""
                                  }
                                  onChange={(e) =>
                                    e.target.value &&
                                    action(() =>
                                      request("/attendance/" + b.id, {
                                        method: "PUT",
                                        body: { status: e.target.value },
                                      }),
                                    )
                                  }
                                >
                                  <option value="">—</option>
                                  <option value="present">
                                    {ar ? "حاضر" : "Present"}
                                  </option>
                                  <option value="absent">
                                    {ar ? "غائب" : "Absent"}
                                  </option>
                                  <option value="excused">
                                    {ar ? "بعذر" : "Excused"}
                                  </option>
                                </select>
                              </label>
                            )}
                        </td>
                        <td>
                          {["confirmed", "pending_payment"].includes(
                            b.status,
                          ) && (
                            <button
                              className="text-button"
                              disabled={
                                busy ||
                                (manager && !canManage("classes", "delete"))
                              }
                              onClick={() =>
                                action(() =>
                                  request("/bookings/" + b.id + "/cancel", {
                                    method: "POST",
                                  }),
                                )
                              }
                            >
                              {t.cancelBooking}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {page === "tasks" && manager && !isSystemAdmin && (
            <p className="notice">
              {ar
                ? "يمكنك تحديث مهام الأمس وما بعده. تعديل المهام الأقدم متاح لمسؤول النظام فقط."
                : "You can update yesterday’s and newer tasks. Older tasks require a system administrator."}
            </p>
          )}
          {page === "tasks" && manager && (
            <TaskPlanner
              key={stable.id + "|" + (taskPlanFilter || "all")}
              initialGroup={taskPlanFilter}
              tasks={data.tasks}
              history={data.taskHistory}
              members={data.members}
              ar={ar}
              when={when}
              toggle={toggleCareTask}
              busy={busy}
              canComplete={canComplete}
              stableName={localizedName(stable, ar)}
            />
          )}
          {[
            "instructors",
            "arenas",
            "breeds",
            "horses",
            "stalls",
            "medical",
            "feeding",
            "pricing",
            "discounts",
            "vouchers",
            "inventory",
          ].includes(page) && (
            <>
              {page === "medical" && (
                <p className="notice">{t.restrictionNote}</p>
              )}
              <label className="search">
                <Search size={17} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.search}
                />
              </label>
              <p className="record-count" role="status">
                {data[page === "pricing" ? "plans" : page].length}{" "}
                {ar ? "سجلات" : "records"}
              </p>
              <div className="record-grid">
                {data[page === "pricing" ? "plans" : page]
                  .filter((r) =>
                    JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
                  )
                  .map((r) => rowCard(page === "pricing" ? "plans" : page, r))}
              </div>
              {!data[page === "pricing" ? "plans" : page].length && (
                <div className="empty">{t.empty}</div>
              )}
            </>
          )}
          {page === "billing" && (
            <>
              {manager && (
                <PaymentReport
                  key={stable.id}
                  data={data}
                  ar={ar}
                  money={money}
                  when={when}
                  stableName={localizedName(stable, ar)}
                />
              )}
              <p className="notice">
                <FileText size={20} />
                {t.proforma}
              </p>
              <div className="panel table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t.title}</th>
                      {(manager || stable?.role === "instructor") && (
                        <th>{t.member}</th>
                      )}
                      <th>{t.due}</th>
                      <th>{t.paid}</th>
                      <th>{t.status}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data.proformas.map((p) => (
                      <tr key={p.id}>
                        <td>
                          {p.description}
                          <small className="record-id">
                            {p.id.slice(0, 8)}
                          </small>
                        </td>
                        {manager && <td>{memberName(p.member_id)}</td>}
                        <td>{money(p.due)}</td>
                        <td>{money(p.paid)}</td>
                        <td>{t[p.status]}</td>
                        <td>
                          <button
                            className="text-button"
                            onClick={() =>
                              setModal({ kind: "proforma", record: p })
                            }
                          >
                            {t.view}
                          </button>
                          {canManage("billing", "edit") && p.paid > 0 && (
                            <button
                              className="text-button"
                              onClick={() =>
                                setModal({
                                  kind: "refund",
                                  record: p,
                                  form: {},
                                })
                              }
                            >
                              {t.refund}
                            </button>
                          )}
                          {canManage("billing", "edit") &&
                            p.status === "open" && (
                              <button
                                className="text-button"
                                onClick={() =>
                                  setModal({
                                    kind: "payment",
                                    record: p,
                                    form: {},
                                  })
                                }
                              >
                                {t.payment}
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!data.proformas.length && <p className="empty">{t.noBilling}</p>}
            </>
          )}
          {page === "reports" && reports && (
            <>
              <p className="notice">{t.fiscal}</p>
              <div className="record-grid">
                {[
                  "gross",
                  "discounts",
                  "voucherUsed",
                  "recordedPayments",
                  "outstanding",
                ].map((k) => (
                  <div className="panel" key={k}>
                    <p>{k === "discounts" ? t.discountsTotal : t[k]}</p>
                    <div className="big-money">{money(reports[k])}</div>
                  </div>
                ))}
                {[
                  "horses",
                  "members",
                  "bookings",
                  "lowStock",
                  "overdueTasks",
                ].map((k) => (
                  <div className="panel" key={k}>
                    <p>{t[k]}</p>
                    <div className="big-money">{reports[k]}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {page === "members" && manager && (
            <MemberTools
              key={stable.id}
              canAdd={canManage("members", "add")}
              canEdit={canManage("members", "edit")}
              canDelete={canManage("members", "delete")}
              isAdmin={isSystemAdmin}
              members={data.members}
              emailConfigured={data.emailConfigured}
              busy={busy}
              request={request}
              action={action}
              ar={ar}
            />
          )}
          {page === "notifications" && (
            <>
              <p className="notice">
                {data.emailConfigured ? t.emailOn : t.emailOff}
              </p>
              {data.notifications.map((n) => (
                <article
                  className={
                    "panel notification " + (!n.read_at ? "unread" : "")
                  }
                  key={n.id}
                >
                  <h3>{n.title}</h3>
                  <p>{n.message}</p>
                  <small>{when(n.created_at)}</small>
                  {!n.read_at && (
                    <button
                      className="text-button"
                      onClick={() =>
                        action(() =>
                          request("/notifications/" + n.id + "/read", {
                            method: "POST",
                          }),
                        )
                      }
                    >
                      {t.markRead}
                    </button>
                  )}
                </article>
              ))}
              {!data.notifications.length && <p className="empty">{t.empty}</p>}
            </>
          )}
          <footer>
            <span>
              © {new Date().getFullYear()} {t.brand}
            </span>
            <span>
              {t.purpose} ·{" "}
              <bdi>
                {ar ? "الواجهة" : "Frontend"} v{release.version}
              </bdi>{" "}
              ·{" "}
              <a href="/api/health" target="_blank" rel="noreferrer">
                <bdi>
                  {ar ? "الخادم" : "Backend"}{" "}
                  {data.backendVersion || backendVersion
                    ? "v" + (data.backendVersion || backendVersion)
                    : ar
                      ? "الإصدار غير متاح"
                      : "version unavailable"}
                </bdi>
              </a>
              {(data.backendVersion || backendVersion) &&
                (data.backendVersion || backendVersion) !== release.version && (
                  <strong className="version-mismatch">
                    {" "}
                    ·{" "}
                    {ar
                      ? "الإصدارات غير متطابقة — حدّث النشر الأقدم"
                      : "Versions differ — update the older deployment"}
                  </strong>
                )}
            </span>
          </footer>
        </main>
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={() => !busy && setModal(null)}>
          <section
            className={
              "modal " +
              (modal.kind === "horseProfile"
                ? "horse-profile-modal"
                : modal.kind === "proforma"
                  ? "proforma-modal"
                  : modal.kind === "voucherPrint"
                    ? "voucher-modal"
                    : "")
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close icon-button"
              aria-label={t.cancel}
              disabled={busy}
              onClick={() => setModal(null)}
            >
              <X />
            </button>
            <h2 id="dialog-title">
              {modal.kind === "booking"
                ? modal.title
                : modal.kind === "invite"
                  ? t.inviteMember
                  : modal.kind === "proforma"
                    ? t.proforma
                    : modal.kind === "payment"
                      ? t.payment
                      : modal.kind === "refund"
                        ? t.refund
                        : modal.kind === "package"
                          ? t.requestPackage
                          : modal.kind === "manualBilling"
                            ? t.createRequest
                            : t[
                                modal.kind === "plans" ? "pricing" : modal.kind
                              ]}
            </h2>
            {modal.kind === "horseProfile" ? (
              <HorseProfile
                horseId={modal.record.id}
                ar={ar}
                request={request}
                staff={manager}
                canEdit={canManage("horses", "edit")}
                canAddDocuments={canManage("horses", "add")}
                canDeleteDocuments={canManage("horses", "delete")}
                when={when}
                busy={busy}
                action={action}
              />
            ) : modal.kind === "voucherPrint" ? (
              <VoucherCard
                voucher={modal.record}
                academy={localizedName(stable, ar)}
                ar={ar}
                money={money}
                when={when}
              />
            ) : modal.kind === "invite" ? (
              <>
                <p>{t.inviteInfo}</p>
                <code className="invite-code" dir="ltr">
                  {modal.code}
                </code>
                <button
                  className="primary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(modal.code);
                      notify(t.copied);
                    } catch {
                      notify(modal.code);
                    }
                  }}
                >
                  {t.copy}
                </button>
              </>
            ) : modal.kind === "booking" ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!modal.quote) {
                    setBusy(true);
                    try {
                      if (manager) {
                        const health = await request("/health");
                        if (health.bookingVersion !== 1)
                          throw new Error(
                            ar
                              ? "حدّث خادم cPanel وأعد تشغيله قبل الحجز لعضو."
                              : "Update and restart the cPanel backend before booking for a member.",
                          );
                      }
                      const quote = await request("/quote", {
                        method: "POST",
                        body: { classId: modal.classId, ...modal.form },
                      });
                      setModal((m) => ({ ...m, quote }));
                    } catch (e) {
                      notify(e.message);
                    } finally {
                      setBusy(false);
                    }
                  } else if (
                    await action(() =>
                      request("/bookings", {
                        method: "POST",
                        body: {
                          classId: modal.classId,
                          ...modal.form,
                          expectedDue: modal.quote.due,
                          expectedGross: modal.quote.gross,
                          expectedCredits: modal.quote.credits || 0,
                          expectedMemberId: modal.quote.memberId,
                        },
                      }),
                    )
                  ) {
                    setModal(null);
                    setPendingVoucher("");
                    sessionStorage.removeItem("booking-voucher");
                    notify(t.bookingSaved);
                  }
                }}
              >
                {manager && (
                  <label>
                    {ar ? "الحجز للعضو" : "Book for member"}
                    <select
                      aria-label={ar ? "الحجز للعضو" : "Book for member"}
                      required
                      value={modal.form.memberId || ""}
                      onChange={(e) =>
                        setModal((m) => ({
                          ...m,
                          form: {
                            ...m.form,
                            memberId: e.target.value,
                            useCredits: false,
                          },
                          quote: null,
                        }))
                      }
                    >
                      <option value="">{t.select}</option>
                      {data.members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {!manager && (
                  <p>
                    {ar ? "الحجز باسمك" : "Booking for"}:{" "}
                    <strong>{localizedName(auth.user, ar)}</strong>
                  </p>
                )}
                <p>
                  {t.sessionBalance}:{" "}
                  <strong>
                    {manager
                      ? data.members.find((m) => m.id === modal.form.memberId)
                          ?.creditBalance || 0
                      : data.creditBalance}
                  </strong>
                </p>
                <label className="check-label">
                  <input
                    type="checkbox"
                    disabled={
                      (manager
                        ? data.members.find((m) => m.id === modal.form.memberId)
                            ?.creditBalance || 0
                        : data.creditBalance) <
                      (data.classes.find((c) => c.id === modal.classId)
                        ?.creditCost || 1)
                    }
                    checked={Boolean(modal.form.useCredits)}
                    onChange={(e) =>
                      setModal((m) => ({
                        ...m,
                        form: {
                          ...m.form,
                          useCredits: e.target.checked,
                          discountCode: "",
                          voucherCode: "",
                        },
                        quote: null,
                      }))
                    }
                  />
                  {t.useCredits}
                </label>
                <label>
                  {t.discountCode}
                  <input
                    disabled={modal.form.useCredits}
                    value={modal.form.discountCode || ""}
                    onChange={(e) => change("discountCode", e.target.value)}
                  />
                </label>
                <label>
                  {t.voucherCode}
                  <input
                    disabled={modal.form.useCredits}
                    value={modal.form.voucherCode || ""}
                    onChange={(e) => change("voucherCode", e.target.value)}
                  />
                </label>
                {modal.quote && (
                  <div className="quote">
                    {modal.quote.credits > 0 && (
                      <p>
                        {t.lessonCredits}: {modal.quote.credits}
                      </p>
                    )}
                    {["gross", "discount", "voucher", "due"].map((k) => (
                      <p key={k}>
                        <span>{t[k]}</span>
                        <strong>{money(modal.quote[k])}</strong>
                      </p>
                    ))}
                  </div>
                )}
                <p>{t.fiscal}</p>
                <button className="primary" disabled={busy}>
                  {modal.quote ? t.confirm : t.quote}
                </button>
              </form>
            ) : modal.kind === "package" ? (
              <>
                <h3>{modal.record.name}</h3>
                <div className="big-money">{money(modal.record.amount)}</div>
                <p>
                  {modal.record.credits} {t.lessonCredits}
                </p>
                <p>{t.packagePayment}</p>
                <button
                  className="primary"
                  disabled={busy}
                  onClick={() =>
                    action(async () => {
                      await request("/packages", {
                        method: "POST",
                        body: { planId: modal.record.id },
                      });
                      setModal(null);
                      notify(t.packagePending);
                      go("billing");
                    })
                  }
                >
                  {t.confirmRequest}
                </button>
              </>
            ) : modal.kind === "manualBilling" ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await action(() =>
                      request("/proformas", {
                        method: "POST",
                        body: modal.form,
                      }),
                    )
                  ) {
                    setModal(null);
                    notify(t.saved);
                  }
                }}
              >
                <label>
                  {t.member}
                  <select
                    required
                    aria-label={t.member}
                    value={modal.form.memberId || ""}
                    onChange={(e) => change("memberId", e.target.value)}
                  >
                    <option value="">{t.select}</option>
                    {data.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t.planId}
                  <select
                    required
                    aria-label={t.planId}
                    value={modal.form.planId || ""}
                    onChange={(e) => change("planId", e.target.value)}
                  >
                    <option value="">{t.select}</option>
                    {data.plans
                      .filter((p) => p.active)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {money(p.amount)}
                        </option>
                      ))}
                  </select>
                </label>
                <p>{t.fiscal}</p>
                <button className="primary" disabled={busy}>
                  {t.save}
                </button>
              </form>
            ) : ["payment", "refund"].includes(modal.kind) ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await action(() =>
                      request(
                        "/proformas/" + modal.record.id + "/" + modal.kind,
                        {
                          method: "POST",
                          body: {
                            ...modal.form,
                            amount: Math.round(Number(modal.form.amount) * 100),
                          },
                        },
                      ),
                    )
                  ) {
                    setModal(null);
                    notify(t.saved);
                  }
                }}
              >
                <p>
                  {modal.kind === "refund" ? t.refundNotice : t.paymentNotice}
                </p>
                {["amount", "reference", "externalRef"].map((k) => (
                  <label key={k}>
                    {modal.kind === "refund" && k === "externalRef"
                      ? t.creditRef
                      : t[k]}
                    <input
                      required
                      type={k === "amount" ? "number" : "text"}
                      min={k === "amount" ? ".01" : undefined}
                      step={k === "amount" ? ".01" : undefined}
                      value={modal.form[k] || ""}
                      onChange={(e) => change(k, e.target.value)}
                    />
                  </label>
                ))}
                <button className="primary" disabled={busy}>
                  {t.save}
                </button>
              </form>
            ) : modal.kind === "proforma" ? (
              <>
                <div className="print-brand">
                  <img src="/logos/riyadh-polo-club-academy.png" alt="" />
                  <h3>{t.brand}</h3>
                </div>
                <p>{modal.record.description}</p>
                <p>
                  {ar ? "التفعيل" : "Activation"}:{" "}
                  {modal.record.activation === "active"
                    ? ar
                      ? "مفعل"
                      : "Active"
                    : modal.record.activation === "cancelled"
                      ? t.cancelled
                      : t.pending_payment}
                </p>
                {canManage("billing", "edit") && (
                  <div className="modal-actions no-print">
                    <button
                      className="soft"
                      disabled={busy || !data.emailConfigured}
                      onClick={() =>
                        action(() =>
                          request("/proformas/" + modal.record.id + "/email", {
                            method: "POST",
                            body: {},
                          }),
                        )
                      }
                    >
                      {ar ? "إرسال الفاتورة المبدئية" : "Email pro forma"}
                    </button>
                    <button
                      className="soft"
                      disabled={
                        busy ||
                        !data.emailConfigured ||
                        !data.payments.some(
                          (p) =>
                            p.proforma_id === modal.record.id && p.amount > 0,
                        )
                      }
                      onClick={() =>
                        action(() =>
                          request("/proformas/" + modal.record.id + "/email", {
                            method: "POST",
                            body: { receipt: true },
                          }),
                        )
                      }
                    >
                      {ar ? "إرسال تأكيد الدفع" : "Email payment confirmation"}
                    </button>
                  </div>
                )}
                {data.payments
                  ?.filter((p) => p.proforma_id === modal.record.id)
                  .map((p) => (
                    <p key={p.id}>
                      {money(p.amount)} · {p.reference} · {p.external_ref} ·{" "}
                      {when(p.created_at)}
                    </p>
                  ))}
                {modal.record.credit_quantity > 0 && (
                  <p>
                    {t.lessonCredits}: {modal.record.credit_quantity}
                  </p>
                )}
                {modal.record.credit_used > 0 && (
                  <p>
                    {t.creditUsed}: {modal.record.credit_used}
                  </p>
                )}
                <small>{modal.record.id}</small>
                <p>
                  {when(modal.record.created_at)} · {t[modal.record.status]}
                </p>
                <div className="quote">
                  {["gross", "discount", "voucher", "due", "paid"].map((k) => (
                    <p key={k}>
                      <span>{t[k]}</span>
                      <strong>{money(modal.record[k])}</strong>
                    </p>
                  ))}
                </div>
                <p>
                  {t.externalRef}: {modal.record.external_ref || "—"}
                </p>
                <p className="fiscal-note">{t.fiscal}</p>
                <button
                  className="primary no-print"
                  onClick={() => window.print()}
                >
                  {t.print}
                </button>
              </>
            ) : (
              <form onSubmit={saveRecord}>
                {modal.kind === "medical" && (
                  <p className="notice">
                    {ar
                      ? "لجلسات المتابعة، اختر التكرار والأيام أسفل النموذج. لجرعات الدواء، أدخل الدواء والجرعة والتكرار بالساعات والمدة بالأيام بدلاً من تكرار الجلسات."
                      : "Use session repetition below for follow-up appointments, or medication dose interval/duration for prescribed doses. Choose one schedule type."}
                  </p>
                )}
                {modal.kind === "feeding" && (
                  <p className="notice">
                    {ar
                      ? "ستُجدول المهام تلقائياً لمدة 28 يوماً مقدماً، ويُحجز وقت الحصان طوال مدة التغذية. أضف خطة منفصلة لكل موعد يومي."
                      : "Tasks are scheduled 28 days ahead and the horse is blocked for the feeding duration. Add a separate plan for each daily feeding time."}
                  </p>
                )}
                {fields(modal.kind).map(([key, type, required, options]) => (
                  <label
                    key={key}
                    className={type === "checkbox" ? "check-label" : ""}
                  >
                    {type === "checkbox" ? (
                      <>
                        <input
                          type="checkbox"
                          checked={Boolean(modal.form[key])}
                          onChange={(e) => change(key, e.target.checked)}
                        />
                        {t[key]}
                      </>
                    ) : (
                      <>
                        {key === "amount" ? t.price : t[key]}
                        {key === "frequencyHours" && (
                          <small>
                            {ar
                              ? "0 = مرة يومياً (كل 24 ساعة)"
                              : "0 = once daily (every 24 hours)"}
                          </small>
                        )}
                        {type === "generated" ? (
                          <input
                            readOnly
                            aria-label={t[key]}
                            value={discountCodeForForm(
                              modal.form,
                              modal.record?.code,
                            )}
                          />
                        ) : type === "select" || type === "multi" ? (
                          <select
                            aria-label={t[key]}
                            required={required}
                            multiple={type === "multi"}
                            value={
                              modal.form[key] || (type === "multi" ? [] : "")
                            }
                            onChange={(e) =>
                              change(
                                key,
                                type === "multi"
                                  ? [...e.target.selectedOptions].map(
                                      (x) => x.value,
                                    )
                                  : e.target.value,
                              )
                            }
                          >
                            {type !== "multi" && (
                              <option value="">{t.select}</option>
                            )}
                            {options.map(([v, l]) => (
                              <option key={v} value={v}>
                                {l}
                              </option>
                            ))}
                          </select>
                        ) : type === "textarea" ? (
                          <textarea
                            required={required}
                            maxLength={2000}
                            value={modal.form[key] || ""}
                            onChange={(e) => change(key, e.target.value)}
                          />
                        ) : (
                          <input
                            required={required}
                            aria-label={key === "amount" ? t.price : t[key]}
                            readOnly={
                              modal.kind === "classes" &&
                              key === "capacity" &&
                              !modal.record
                            }
                            list={
                              modal.kind === "classes" &&
                              ["instructor", "arena"].includes(key)
                                ? "catalogue-" + key
                                : modal.kind === "horses" && key === "breed"
                                  ? "catalogue-breed"
                                  : undefined
                            }
                            lang={
                              [
                                "number",
                                "money",
                                "date",
                                "datetime-local",
                                "time",
                              ].includes(type)
                                ? "en"
                                : undefined
                            }
                            type={type === "money" ? "number" : type}
                            min={
                              ["number", "money"].includes(type)
                                ? "0"
                                : undefined
                            }
                            step={
                              type === "money" || key === "value"
                                ? ".01"
                                : type === "number"
                                  ? "1"
                                  : undefined
                            }
                            value={editFormValue(key, type)}
                            onChange={(e) => change(key, e.target.value)}
                            maxLength={type === "text" ? 200 : undefined}
                          />
                        )}
                      </>
                    )}
                  </label>
                ))}
                {modal.saveSubmitted && (
                  <p role="alert" className="notice">
                    {ar
                      ? "تم إرسال الحفظ. أغلق هذه النافذة وحدّث البيانات قبل إعادة المحاولة لتجنب التكرار."
                      : "Save submitted. Close this window and refresh before retrying to avoid duplicate slots."}
                  </p>
                )}
                {modal.kind === "classes" && !modal.record && (
                  <RecurrenceFields
                    form={modal.form}
                    onChange={change}
                    ar={ar}
                  />
                )}
                {modal.kind === "medical" && (
                  <RecurrenceFields
                    form={modal.form}
                    onChange={change}
                    ar={ar}
                    medical
                  />
                )}
                {modal.kind === "horses" && (
                  <datalist id="catalogue-breed">
                    {data.breeds
                      .filter((r) => r.active)
                      .map((r) => (
                        <option key={r.id} value={r.name} />
                      ))}
                  </datalist>
                )}
                {modal.kind === "classes" && (
                  <>
                    <datalist id="catalogue-instructor">
                      {data.instructors
                        .filter((r) => r.active)
                        .map((r) => (
                          <option key={r.id} value={r.name} />
                        ))}
                    </datalist>
                    <datalist id="catalogue-arena">
                      {data.arenas
                        .filter((r) => r.active)
                        .map((r) => (
                          <option key={r.id} value={r.name} />
                        ))}
                    </datalist>
                  </>
                )}
                <button
                  className="primary"
                  disabled={busy || modal.saveSubmitted}
                >
                  {busy ? t.loading : t.save}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
function AuthForm({ t, onSuccess }) {
  const [mode, setMode] = useState("login"),
    [join, setJoin] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <div className="tabs">
        <button
          className={mode === "login" ? "active" : ""}
          onClick={() => {
            setMode("login");
            setError("");
          }}
        >
          {t.login}
        </button>
        <button
          className={mode === "register" ? "active" : ""}
          onClick={() => {
            setMode("register");
            setError("");
          }}
        >
          {t.register}
        </button>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const values = Object.fromEntries(new FormData(e.currentTarget));
          setBusy(true);
          setError("");
          try {
            await api("/auth/" + mode, { method: "POST", body: values });
            await onSuccess();
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {mode === "register" && (
          <label>
            {t.nameEn}
            <input required name="name" autoComplete="name" maxLength={100} />
            <span>{t.nameAr}</span>
            <input name="nameAr" maxLength={100} dir="rtl" />
          </label>
        )}
        <label>
          {t.email}
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
        </label>
        <label>
          {t.password}
          <input
            required
            name="password"
            type="password"
            minLength={mode === "register" ? 6 : 1}
            maxLength={128}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
          />
        </label>
        {mode === "register" && (
          <>
            <label className="check-label">
              <input
                type="checkbox"
                checked={join}
                onChange={(e) => setJoin(e.target.checked)}
              />
              {t.join}
            </label>
            <label>
              {join ? t.invite : t.stableName}
              <input
                key={join ? "invite" : "stable"}
                required
                name={join ? "invite" : "stableName"}
                autoComplete="off"
                maxLength={100}
              />
            </label>
            {!join && (
              <label>
                {t.nameAr} · {t.stableName}
                <input name="stableNameAr" maxLength={100} dir="rtl" />
              </label>
            )}
            <p className="auth-hint">{t.passwordHint}</p>
            <p className="auth-hint">{t.registrationNote}</p>
          </>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button disabled={busy} className="primary" type="submit">
          {busy ? t.loading : t[mode]}
        </button>
      </form>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
