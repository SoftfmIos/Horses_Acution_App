import SwiftUI

struct AccountView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var signOut = false
    var body: some View {
        List {
            Section {
                HStack(spacing: 16) {
                    Image("AcademyLogo").resizable().scaledToFit().frame(width: 70, height: 85)
                    VStack(alignment: .leading, spacing: 6) {
                        Text(store.account?.display(store.arabic) ?? "").font(.headline)
                        Text(store.account?.email ?? "").font(.caption).textSelection(.enabled)
                        Text(store.isStaff ? store.text("Staff access", "وصول الموظفين") : store.text("Member access", "وصول الأعضاء")).font(.caption).foregroundStyle(.secondary)
                    }
                }.padding(.vertical, 8)
            }
            Section {
                NavigationLink { InboxView() } label: { Label(store.text("Notifications", "الإشعارات") + (store.unread > 0 ? " (\(store.unread))" : ""), systemImage: "bell") }
                if !store.isStaff || store.allowed("billing") {
                    NavigationLink { InvoicesView() } label: { Label(store.text("Invoices & payments", "الفواتير والمدفوعات"), systemImage: "doc.text") }
                }
                if !store.isStaff {
                    NavigationLink { PackagesView() } label: { Label(store.text("Lesson packages", "باقات الحصص"), systemImage: "ticket") }
                }
                if store.isStaff && store.allowed("tasks") {
                    NavigationLink { TasksView() } label: { Label(store.text("Staff tasks", "مهام الموظفين"), systemImage: "checklist") }
                }
            }
            Section(store.text("Preferences", "التفضيلات")) {
                Toggle("العربية / Arabic", isOn: $store.arabic)
                if store.stables.count > 1 {
                    Picker(store.text("Academy", "الأكاديمية"), selection: Binding(get: { store.stable?.id ?? "" }, set: { id in Task { await store.chooseStable(id) } })) {
                        ForEach(store.stables) { Text($0.display(store.arabic)).tag($0.id) }
                    }.disabled(store.busy)
                }
                LabeledContent(store.text("Time zone", "التوقيت"), value: store.text("Riyadh (UTC+3)", "الرياض (UTC+3)"))
                LabeledContent(store.text("Version", "الإصدار"), value: Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0.0")
            }
            Section(store.text("Support", "الدعم")) {
                Link(destination: URL(string: "mailto:support@riyadhpolohills.com")!) { Label(store.text("Contact support", "تواصل مع الدعم"), systemImage: "envelope") }
                Link(destination: store.api.configuration.websiteOrigin) { Label(store.text("Open academy website", "فتح موقع الأكاديمية"), systemImage: "safari") }
                NavigationLink { PrivacyView() } label: { Label(store.text("Privacy & your account", "الخصوصية وحسابك"), systemImage: "lock.shield") }
            }
            Section { Button(store.text("Sign out", "تسجيل الخروج"), role: .destructive) { signOut = true }.disabled(store.busy) }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.text("My account", "حسابي"))
            .confirmationDialog(store.text("Sign out of this account?", "تسجيل الخروج من الحساب؟"), isPresented: $signOut, titleVisibility: .visible) {
                Button(store.text("Sign out", "تسجيل الخروج"), role: .destructive) { Task { await store.signOut() } }
            }
    }
}
struct InboxView: View {
    @EnvironmentObject var store: AcademyStore
    var body: some View {
        List {
            if store.data.notifications.isEmpty { EmptyMessage(title: store.text("You’re all caught up", "لا توجد إشعارات جديدة"), symbol: "bell") }
            ForEach(store.data.notifications.sorted { $0.created_at > $1.created_at }) { item in
                NavigationLink {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            Text(item.title).font(.title2.bold())
                            Text(store.date(item.created_at)).font(.caption).foregroundStyle(.secondary)
                            Text(item.message).textSelection(.enabled)
                        }.frame(maxWidth: .infinity, alignment: .leading).padding()
                    }.background(Brand.ivory).navigationTitle(store.text("Notification", "الإشعار"))
                        .task { if item.read_at == nil { await store.perform { try await store.mutate("notifications/\(item.id)/read") } } }
                } label: {
                    HStack(alignment: .top) {
                        Circle().fill(item.read_at == nil ? Brand.gold : .clear).frame(width: 8, height: 8).padding(.top, 6)
                        VStack(alignment: .leading, spacing: 6) { Text(item.title).font(.headline); Text(item.message).font(.subheadline).lineLimit(2).foregroundStyle(.secondary); Text(store.date(item.created_at)).font(.caption2) }
                    }.padding(.vertical, 5)
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.text("Notifications", "الإشعارات")).refreshable { await store.reload() }
    }
}
struct PackagesView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var selected: PricePlan?
    var body: some View {
        List {
            Section { LabeledContent(store.text("Lesson credits", "رصيد الحصص"), value: "\(store.data.creditBalance)") }
            ForEach(store.data.plans.filter { $0.kind == "package" && $0.active != false }) { plan in
                VStack(alignment: .leading, spacing: 10) {
                    Text(plan.name).font(.headline)
                    Text("\(plan.credits ?? 0) " + store.text("lessons", "حصص") + " · " + store.money(plan.amount))
                    Button(store.text("Request package", "طلب الباقة")) { selected = plan }.disabled(store.busy)
                }.padding(.vertical, 8)
            }
        }.navigationTitle(store.text("Lesson packages", "باقات الحصص"))
            .confirmationDialog(store.text("Create a payment request for this package?", "إنشاء طلب دفع لهذه الباقة؟"), isPresented: Binding(get: { selected != nil }, set: { if !$0 { selected = nil } }), titleVisibility: .visible) {
                if let plan = selected {
                    Button(store.text("Confirm request", "تأكيد الطلب")) { Task { await store.perform { try await store.mutate("packages", body: ["planId": plan.id]) } }; selected = nil }
                }
            } message: { Text(store.text("Credits are added only after the academy records full payment. No money is charged in the app.", "يُضاف الرصيد بعد تسجيل الأكاديمية للسداد الكامل فقط. لا يتم خصم مبلغ داخل التطبيق.")) }
    }
}
struct PrivacyView: View {
    @EnvironmentObject var store: AcademyStore
    var body: some View {
        List {
            Section(store.text("Your data", "بياناتك")) {
                Text(store.text("This app connects to your academy account. Bookings, horse records, invoices and notifications are stored by the academy’s existing service. Staff access follows the permissions set by your administrator.", "يرتبط التطبيق بحسابك في الأكاديمية. تُحفظ الحجوزات وسجلات الخيل والفواتير والإشعارات في خدمة الأكاديمية الحالية. يتبع وصول الموظفين الصلاحيات المحددة من المسؤول."))
                Text(store.text("Your session is stored in the iPhone Keychain. Your password is not saved by this app. Calendar access is used only when you choose to add a booking. The app does not include advertising or analytics SDKs.", "تُحفظ جلسة الدخول في سلسلة مفاتيح آيفون. لا يحفظ التطبيق كلمة المرور. يُستخدم التقويم فقط عند اختيار إضافة حجز. لا يحتوي التطبيق على أدوات إعلانات أو تحليلات."))
            }
            Section(store.text("Privacy policy & license", "سياسة الخصوصية والترخيص")) {
                Link(destination: store.api.configuration.websiteOrigin.appendingPathComponent("privacy.html")) {
                    Label(store.text("Read the privacy policy", "قراءة سياسة الخصوصية"), systemImage: "hand.raised")
                }
                Link(destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!) {
                    Label(store.text("Apple Standard License Agreement", "اتفاقية ترخيص آبل القياسية"), systemImage: "doc.text")
                }
            }
            Section(store.text("Account support", "دعم الحساب")) {
                Text(store.text("Contact the academy to update your login details, request a password reset, or request account/data deletion. The academy may need to retain financial records.", "تواصل مع الأكاديمية لتحديث بيانات الدخول أو طلب استعادة كلمة المرور أو حذف الحساب والبيانات. قد يلزم الاحتفاظ بالسجلات المالية."))
                Link("support@riyadhpolohills.com", destination: URL(string: "mailto:support@riyadhpolohills.com")!)
            }
        }.navigationTitle(store.text("Privacy", "الخصوصية"))
    }
}
