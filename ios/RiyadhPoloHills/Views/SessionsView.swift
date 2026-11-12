import SwiftUI
import UserNotifications

struct SessionsView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var segment = 0
    @State private var search = ""
    var sessions: [RidingSession] {
        store.data.classes.filter { $0.isUpcoming && (search.isEmpty || [$0.title, $0.titleAr ?? "", $0.instructor, $0.arena].joined(separator: " ").localizedCaseInsensitiveContains(search)) }.sorted { $0.startsAt < $1.startsAt }
    }
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Picker(store.text("Show", "عرض"), selection: $segment) { Text(store.text("Available sessions", "الحصص المتاحة")).tag(0); Text(store.isStaff ? store.text("Bookings", "الحجوزات") : store.text("My bookings", "حجوزاتي")).tag(1) }.pickerStyle(.segmented)
                if segment == 0 {
                    if sessions.isEmpty { EmptyMessage(title: store.text("No sessions found", "لا توجد حصص"), symbol: "calendar") }
                    ForEach(sessions) { session in
                        NavigationLink { SessionDetailView(session: session) } label: {
                            AcademyCard {
                                Text(session.display(store.arabic)).font(.headline)
                                Label(store.date(session.startsAt), systemImage: "clock")
                                Label(session.instructor, systemImage: "person")
                                HStack { Label(session.arena, systemImage: "mappin"); Spacer(); Text("\(session.places ?? 0) " + store.text("places", "أماكن")).foregroundStyle(Brand.navy) }.font(.caption)
                            }.foregroundStyle(Brand.ink)
                        }.buttonStyle(.plain)
                    }
                } else {
                    if store.data.bookings.isEmpty { EmptyMessage(title: store.text("No bookings yet", "لا توجد حجوزات بعد"), symbol: "calendar") }
                    ForEach(store.data.bookings.sorted { (store.session(for: $0)?.startsAt ?? "") > (store.session(for: $1)?.startsAt ?? "") }) { booking in
                        NavigationLink { BookingDetailView(booking: booking) } label: { BookingCard(booking: booking) }.buttonStyle(.plain)
                    }
                }
            }.padding()
        }.background(Brand.ivory).navigationTitle(store.text("Bookings", "الحجوزات"))
            .searchable(text: $search, prompt: store.text("Find a session or instructor", "ابحث عن حصة أو مدرب"))
            .refreshable { await store.reload() }
    }
}
struct SessionDetailView: View {
    @EnvironmentObject var store: AcademyStore
    @Environment(\.dismiss) private var dismiss
    let session: RidingSession
    @State private var memberID = ""
    @State private var credits = false
    @State private var discount = ""
    @State private var voucher = ""
    @State private var quote: Quote?
    private var bodyValues: [String: Any] {
        var values: [String: Any] = ["classId": session.id, "useCredits": credits]
        if store.isStaff { values["memberId"] = memberID }
        if !credits && !discount.isEmpty { values["discountCode"] = discount }
        if !credits && !voucher.isEmpty { values["voucherCode"] = voucher }
        return values
    }
    var body: some View {
        Form {
            Section(store.text("Session details", "تفاصيل الحصة")) {
                LabeledContent(store.text("Starts (Riyadh)", "البداية (الرياض)"), value: store.date(session.startsAt))
                LabeledContent(store.text("Ends (Riyadh)", "النهاية (الرياض)"), value: store.date(session.endsAt))
                LabeledContent(store.text("Instructor", "المدرب"), value: session.instructor)
                LabeledContent(store.text("Location", "الموقع"), value: session.arena)
            }
            Section(store.text("Booking options", "خيارات الحجز")) {
                if store.isStaff {
                    Picker(store.text("Book for", "الحجز لصالح"), selection: $memberID) {
                        Text(store.text("Choose a member", "اختر عضواً")).tag("")
                        ForEach(store.data.members) { Text($0.name).tag($0.id) }
                    }
                }
                Toggle(store.text("Use lesson credits", "استخدام رصيد الحصص"), isOn: $credits)
                if !credits {
                    TextField(store.text("Discount code (optional)", "رمز الخصم (اختياري)"), text: $discount).textInputAutocapitalization(.characters).autocorrectionDisabled()
                    TextField(store.text("Voucher code (optional)", "رمز القسيمة (اختياري)"), text: $voucher).textInputAutocapitalization(.characters).autocorrectionDisabled()
                }
                Button(store.text("Calculate price", "حساب السعر")) {
                    Task { await store.perform {
                        quote = try await store.api.send("quote", method: "POST", body: bodyValues, stableID: store.stable?.id)
                    } }
                }.disabled(store.busy || (store.isStaff && (memberID.isEmpty || !store.allowed("classes", "add"))) || (session.places ?? 0) < 1)
            }
            if let quote {
                Section(store.text("Confirm booking", "تأكيد الحجز")) {
                    if let credits = quote.credits { LabeledContent(store.text("Credits", "الرصيد"), value: "\(credits)") }
                    else {
                        LabeledContent(store.text("Price", "السعر"), value: store.money(quote.gross))
                        LabeledContent(store.text("Discount", "الخصم"), value: store.money(quote.discount))
                        LabeledContent(store.text("Voucher", "القسيمة"), value: store.money(quote.voucher))
                        LabeledContent(store.text("Amount due", "المبلغ المستحق"), value: store.money(quote.due))
                    }
                    Text(store.text("Payment is recorded by the academy. A cash-priced booking stays pending until fully paid. Prices and availability are checked again when you confirm.", "تسجل الأكاديمية المدفوعات. يبقى الحجز النقدي معلقاً حتى اكتمال السداد. يُعاد التحقق من السعر والتوفر عند التأكيد.")).font(.footnote)
                    Button(store.text("Confirm booking", "تأكيد الحجز")) { Task { await store.perform {
                        try await store.mutate("bookings", body: bodyValues)
                        dismiss()
                    } } }.disabled(store.busy)
                }
            }
        }.navigationTitle(session.display(store.arabic))
            .onChange(of: memberID) { _, _ in quote = nil }.onChange(of: credits) { _, _ in quote = nil }
            .onChange(of: discount) { _, _ in quote = nil }.onChange(of: voucher) { _, _ in quote = nil }
    }
}
struct BookingDetailView: View {
    @EnvironmentObject var store: AcademyStore
    let booking: Booking
    @State private var cancel = false
    @State private var calendar = false
    @State private var notificationsDenied = false
    var current: Booking { store.data.bookings.first { $0.id == booking.id } ?? booking }
    var body: some View {
        Form {
            Section {
                StatusPill(status: current.status)
                if let session = store.session(for: current) {
                    LabeledContent(store.text("Session", "الحصة"), value: session.display(store.arabic))
                    LabeledContent(store.text("Starts (Riyadh)", "البداية (الرياض)"), value: store.date(session.startsAt))
                    LabeledContent(store.text("Instructor", "المدرب"), value: session.instructor)
                    LabeledContent(store.text("Location", "الموقع"), value: session.arena)
                    if current.status == "confirmed" { Button(store.text("Add to calendar", "إضافة إلى التقويم")) { calendar = true } }
                    if current.status == "confirmed" {
                        Label(store.text("Allow notifications for a reminder 30 minutes before class. Open the app after booking to sync reminders.", "اسمح بالإشعارات لتذكير قبل الحصة بـ30 دقيقة. افتح التطبيق بعد الحجز لمزامنة التذكيرات."), systemImage: "bell").font(.footnote)
                        if notificationsDenied {
                            Text(store.text("Enable notifications for Riyadh Polo Hills in iPhone Settings to receive class reminders.", "فعّل إشعارات الرياض بولو هيلز في إعدادات آيفون لاستلام تذكيرات الحصص.")).font(.footnote)
                            Button(store.text("Open iPhone notification settings", "فتح إعدادات إشعارات آيفون")) { if let url = URL(string: UIApplication.openNotificationSettingsURLString) { UIApplication.shared.open(url) } }
                        }
                        if let notice = store.notice { Text(notice).font(.footnote) }
                    }

                }
                if current.status == "pending_payment" { LabeledContent(store.text("Pay before", "الدفع قبل"), value: store.date(current.hold_expires_at)) }
                Text(current.id).font(.caption).textSelection(.enabled)
            }
            if current.isActive && (!store.isStaff || store.allowed("classes", "delete")) {
                Section { Button(store.text("Cancel booking", "إلغاء الحجز"), role: .destructive) { cancel = true } }
            }
        }.navigationTitle(store.text("Booking", "الحجز"))
            .task { notificationsDenied = await ClassReminderService.shared.status() == .denied }
            .onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
                Task { notificationsDenied = await ClassReminderService.shared.status() == .denied }
            }
            .confirmationDialog(store.text("Cancel this booking?", "إلغاء هذا الحجز؟"), isPresented: $cancel, titleVisibility: .visible) {
                Button(store.text("Cancel booking", "إلغاء الحجز"), role: .destructive) { Task { await store.perform { try await store.mutate("bookings/\(booking.id)/cancel") } } }
            } message: { Text(store.text("Paid bookings require payment reconciliation before cancellation.", "تتطلب الحجوزات المدفوعة تسوية الدفعات قبل الإلغاء.")) }
            .sheet(isPresented: $calendar) { if let session = store.session(for: current) { CalendarEditor(session: session, bookingID: current.id) } }
    }
}
