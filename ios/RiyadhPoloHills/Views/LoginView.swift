import SwiftUI

struct LoginView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var email = ""
    @State private var password = ""
    @FocusState private var field: Field?
    enum Field { case email, password }
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                HStack { Spacer(); Button(store.arabic ? "English" : "العربية") { store.arabic.toggle() } }
                Image("AcademyLogo").resizable().scaledToFit().frame(height: 155).accessibilityLabel(store.text("Riyadh Polo Hills crest", "شعار الرياض بولو هيلز"))
                VStack(spacing: 8) {
                    Text(store.text("Riyadh Polo Hills", "الرياض بولو هيلز")).font(.largeTitle.weight(.semibold)).multilineTextAlignment(.center)
                    Text(store.text("Your horses. Your next ride.", "خيلك وحصتك القادمة.")).foregroundStyle(.secondary)
                }
                AcademyCard {
                    Text(store.text("Member & staff sign in", "دخول الأعضاء والموظفين")).font(.title3.bold())
                    TextField(store.text("Email", "البريد الإلكتروني"), text: $email)
                        .textContentType(.username).keyboardType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled().focused($field, equals: .email).submitLabel(.next).onSubmit { field = .password }
                        .padding().background(Brand.ivory, in: RoundedRectangle(cornerRadius: 10)).environment(\.layoutDirection, .leftToRight)
                    SecureField(store.text("Password", "كلمة المرور"), text: $password)
                        .textContentType(.password).focused($field, equals: .password).submitLabel(.go).onSubmit { signIn() }
                        .padding().background(Brand.ivory, in: RoundedRectangle(cornerRadius: 10)).environment(\.layoutDirection, .leftToRight)
                    Button { signIn() } label: {
                        if store.busy { ProgressView().tint(.white).frame(maxWidth: .infinity) }
                        else { Text(store.text("Sign in", "تسجيل الدخول")) }
                    }.buttonStyle(PrimaryButtonStyle()).disabled(store.busy || email.isEmpty || password.isEmpty)
                    if store.api.hasSession { Button(store.text("Retry saved session", "إعادة محاولة الدخول المحفوظ")) { Task { await store.restore() } }.disabled(store.busy) }
                }
                Text(store.text("Use the account provided by your academy. Contact support if you need access.", "استخدم الحساب المقدم من الأكاديمية. تواصل مع الدعم للحصول على حساب.")).font(.footnote).multilineTextAlignment(.center).foregroundStyle(.secondary)
                Link("support@riyadhpolohills.com", destination: URL(string: "mailto:support@riyadhpolohills.com")!)
                Image("RidingHero").resizable().scaledToFill().frame(height: 170).clipped().clipShape(RoundedRectangle(cornerRadius: 18)).accessibilityHidden(true)
            }.padding(24).frame(maxWidth: 600).frame(maxWidth: .infinity)
        }.background(Brand.ivory).foregroundStyle(Brand.ink)
    }
    private func signIn() {
        guard !email.isEmpty && !password.isEmpty else { return }
        field = nil
        Task { await store.signIn(email: email, password: password); if store.account != nil { password = "" } }
    }
}
