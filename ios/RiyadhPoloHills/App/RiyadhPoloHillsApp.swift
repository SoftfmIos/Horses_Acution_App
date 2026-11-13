import SwiftUI

@main @MainActor struct RiyadhPoloHillsApp: App {
    @StateObject private var store = AcademyStore()
    init() { _ = ClassReminderService.shared }
    var body: some Scene {
        WindowGroup {
            RootView().environmentObject(store)
                .environment(\.layoutDirection, store.arabic ? .rightToLeft : .leftToRight)
                .environment(\.locale, Locale(identifier: store.arabic ? "ar" : "en"))
                .tint(Brand.navy).preferredColorScheme(.light)
        }
    }
}
struct RootView: View {
    @EnvironmentObject var store: AcademyStore
    @Environment(\.scenePhase) private var scenePhase
    var body: some View {
        Group {
            if store.restoring { ZStack { Brand.ivory.ignoresSafeArea(); VStack { Image("AcademyLogo").resizable().scaledToFit().frame(height: 160); ProgressView() } } }
            else if store.account != nil && !store.snapshotLoaded {
                VStack(spacing: 20) {
                    Image("AcademyLogo").resizable().scaledToFit().frame(height: 100)
                    if store.busy { ProgressView(store.text("Loading your account…", "جار تحميل حسابك…")) }
                    else { Button(store.text("Retry loading your account", "إعادة تحميل الحساب")) { Task { await store.reload() } } }
                    Button(store.text("Sign out", "تسجيل الخروج")) { Task { await store.signOut() } }.disabled(store.busy)
                }.padding().frame(maxWidth: .infinity, maxHeight: .infinity).background(Brand.ivory)
            }
            else if store.account != nil { MainTabs() }
            else { LoginView() }
        }
        .task { await store.restore() }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active && store.account != nil { Task { await store.reload() } }
        }
        .alert(store.text("Something needs your attention", "تنبيه"), isPresented: Binding(get: { store.error != nil }, set: { if !$0 { store.error = nil } })) {
            Button(store.text("OK", "حسناً"), role: .cancel) { store.error = nil }
        } message: { Text(store.error ?? "") }
    }
}
struct MainTabs: View {
    @EnvironmentObject var store: AcademyStore
    var body: some View {
        TabView {
            NavigationStack { HomeView() }.tabItem { Label(store.text("Home", "الرئيسية"), systemImage: "house") }
            if !store.isStaff || store.allowed("classes") {
                NavigationStack { SessionsView() }.tabItem { Label(store.text("Bookings", "الحجوزات"), systemImage: "calendar") }
            }
            if store.canBrowseHorses {
                NavigationStack { HorsesView() }.tabItem { Label(store.allowed("horses") ? store.text("Horses", "الخيل") : store.text("My horses", "خيولي"), systemImage: "figure.equestrian.sports") }
            }
            if store.allowed("tasks") {
                NavigationStack { TasksView() }.tabItem { Label(store.text("Tasks", "المهام"), systemImage: "checklist") }
            }
            NavigationStack { AccountView() }.tabItem { Label(store.text("Account", "الحساب"), systemImage: "ellipsis.circle") }.badge(store.unread)
        }
        .id(store.accessIdentity)
        .task(id: store.stable?.id) {
            while !Task.isCancelled {
                do { try await Task.sleep(for: .seconds(60)) } catch { return }
                if !store.busy { await store.reload() }
            }
        }
    }
}
