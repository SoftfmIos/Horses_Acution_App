import SwiftUI

struct AccountSecurityView: View {
    @EnvironmentObject var store: AcademyStore
    var body: some View {
        List {
            Section(store.text("Login & security", "الدخول والأمان")) {
                LabeledContent(store.text("Login email", "بريد الدخول"), value: store.account?.email ?? "")
                NavigationLink { ChangeCredentialsView(mode: .email) } label: { Label(store.text("Change email", "تغيير البريد الإلكتروني"), systemImage: "envelope") }
                NavigationLink { ChangeCredentialsView(mode: .password) } label: { Label(store.text("Change password", "تغيير كلمة المرور"), systemImage: "key") }
                Text(store.text("For your security, confirm your current password. Changing your login details signs out all devices.", "لحمايتك، أكّد كلمة مرورك الحالية. يؤدي تغيير بيانات الدخول إلى تسجيل الخروج من جميع الأجهزة.")).font(.footnote).foregroundStyle(.secondary)
            }
            Section {
                NavigationLink { DeleteAccountView() } label: { Label(store.text("Delete account", "حذف الحساب"), systemImage: "person.crop.circle.badge.minus").foregroundStyle(.red) }
            } footer: { Text(store.text("Permanently remove your account access and profile. Financial and service records may need to be retained.", "احذف الوصول إلى حسابك وملفك الشخصي نهائياً. قد يلزم الاحتفاظ بالسجلات المالية والخدمية.")) }
        }.navigationTitle(store.text("Account & security", "الحساب والأمان"))
    }
}
struct ChangeCredentialsView: View {
    enum Mode: Equatable { case email, password }
    @EnvironmentObject var store: AcademyStore
    let mode: Mode
    @State private var currentPassword = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmation = ""
    var valid: Bool {
        !currentPassword.isEmpty && (mode == .email ? (email.contains("@") && email.contains(".") && email != store.account?.email) : password.count >= 6 && password.count <= 128 && password == confirmation)
    }
    var body: some View {
        Form {
            Section {
                LabeledContent(store.text("Current email", "البريد الحالي"), value: store.account?.email ?? "")
                SecureField(store.text("Current password", "كلمة المرور الحالية"), text: $currentPassword).textContentType(.password).privacySensitive()
            }
            Section {
                if mode == .email {
                    TextField(store.text("New email", "البريد الجديد"), text: $email).keyboardType(.emailAddress).textContentType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled()
                } else {
                    SecureField(store.text("New password", "كلمة المرور الجديدة"), text: $password).textContentType(.newPassword).privacySensitive()
                    SecureField(store.text("Confirm new password", "تأكيد كلمة المرور الجديدة"), text: $confirmation).textContentType(.newPassword).privacySensitive()
                    Text(store.text("Use at least 6 characters.", "استخدم 6 أحرف على الأقل.")).font(.footnote)
                }
                Button(store.text("Save & sign in again", "حفظ وتسجيل الدخول مجدداً")) {
                    Task {
                        if mode == .email { await store.changeEmail(email.trimmingCharacters(in: .whitespacesAndNewlines), currentPassword: currentPassword) }
                        else { await store.changePassword(password, currentPassword: currentPassword) }
                        if store.account == nil { currentPassword = ""; password = ""; confirmation = "" }
                    }
                }.disabled(!valid || store.busy)
            } footer: { Text(store.text("Your academy records stay with your account. All existing sign-ins are revoked after this change.", "تبقى سجلات الأكاديمية مرتبطة بحسابك، وتُلغى جلسات الدخول الحالية بعد هذا التغيير.")) }
        }.navigationTitle(mode == .email ? store.text("Change email", "تغيير البريد") : store.text("Change password", "تغيير كلمة المرور"))
    }
}
struct DeleteAccountView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var preview: DeletionPreview?
    @State private var failure: String?
    @State private var password = ""
    @State private var confirmation = ""
    @State private var confirm = false
    var body: some View {
        Form {
            Section {
                Label(store.text("Permanent account deletion", "حذف الحساب نهائياً"), systemImage: "person.crop.circle.badge.minus").font(.headline).foregroundStyle(.red)
                Text(store.text("This removes your account and profile from all academies, revokes every sign-in and removes your profile photo. Upcoming bookings are cancelled. Records needed for financial reconciliation, service history or legal obligations are retained with a deleted-account identity.", "يؤدي هذا إلى حذف حسابك وملفك الشخصي من جميع الأكاديميات وإلغاء جلسات الدخول وإزالة صورتك الشخصية. تُلغى الحجوزات القادمة. ويُحتفظ بالسجلات اللازمة لتسوية المدفوعات والسجل الخدمي والالتزامات النظامية بهوية حساب محذوف."))
            }
            if let preview {
                Section(store.text("Your account", "حسابك")) {
                    LabeledContent(store.text("Upcoming active bookings", "الحجوزات القادمة النشطة"), value: "\(preview.activeBookings)")
                    LabeledContent(store.text("Session balance", "رصيد الحصص"), value: "\(preview.creditBalance)")
                    LabeledContent(store.text("Open invoices", "الفواتير المفتوحة"), value: "\(preview.openInvoices)")
                    Text(store.text("Deletion does not automatically issue refunds. Contact the academy about outstanding balances or refunds.", "لا يؤدي الحذف إلى إصدار مبالغ مستردة تلقائياً. تواصل مع الأكاديمية بشأن الأرصدة أو الاسترداد.")).font(.footnote)
                }
                if !preview.blockers.isEmpty {
                    Section {
                        Text(store.text("You are the last administrator or staff owner for an academy. Assign another administrator/staff owner through the web portal before deleting your account.", "أنت المسؤول أو الموظف المالك الوحيد لإحدى الأكاديميات. عيّن مسؤولاً وموظفاً مالكاً آخر عبر بوابة الويب قبل حذف حسابك."))
                        ForEach(preview.blockers) { Text($0.name) }
                        Link(store.text("Open web portal", "فتح بوابة الويب"), destination: store.api.configuration.websiteOrigin)
                        Button(store.text("Check again", "التحقق مجدداً")) { Task { await load() } }
                    }
                } else {
                    Section {
                        SecureField(store.text("Current password", "كلمة المرور الحالية"), text: $password).textContentType(.password).privacySensitive()
                        TextField(store.text("Type DELETE to confirm", "اكتب DELETE للتأكيد"), text: $confirmation).textInputAutocapitalization(.characters).autocorrectionDisabled()
                        Button(store.text("Delete my account", "حذف حسابي"), role: .destructive) { confirm = true }.disabled(store.busy || password.isEmpty || confirmation != "DELETE")
                    }
                }
            } else if let failure {
                Section { Text(failure); Button(store.text("Retry", "إعادة المحاولة")) { Task { await load() } } }
            } else { ProgressView() }
        }.navigationTitle(store.text("Delete account", "حذف الحساب"))
            .task { await load() }
            .confirmationDialog(store.text("Permanently delete your account?", "حذف حسابك نهائياً؟"), isPresented: $confirm, titleVisibility: .visible) {
                Button(store.text("Delete account permanently", "حذف الحساب نهائياً"), role: .destructive) { Task { await store.deleteAccount(currentPassword: password); if store.account == nil { password = "" } } }
            } message: { Text(store.text("This applies to your account in every academy and cannot be undone.", "ينطبق هذا على حسابك في جميع الأكاديميات ولا يمكن التراجع عنه.")) }
    }
    private func load() async {
        preview = nil; failure = nil
        do { preview = try await store.api.send("auth/account/deletion") }
        catch { failure = error.localizedDescription }
    }
}
