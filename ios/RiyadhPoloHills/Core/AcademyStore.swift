import SwiftUI

@MainActor final class AcademyStore: ObservableObject {
    @Published var account: Account?
    @Published var stables: [Stable] = []
    @Published var stable: Stable?
    @Published var data = AcademyData()
    @Published var snapshotLoaded = false
    @Published var busy = false
    @Published var restoring = true
    @Published var error: String?
    @Published var notice: String?
    @Published var arabic = UserDefaults.standard.string(forKey: "academy.language").map { $0 == "ar" } ?? (Locale.preferredLanguages.first?.hasPrefix("ar") ?? false) {
        didSet { UserDefaults.standard.set(arabic ? "ar" : "en", forKey: "academy.language"); Task { await synchronizeReminders() } }
    }
    let api: APIClient
    init(api: APIClient? = nil) { self.api = api ?? APIClient() }
    var isStaff: Bool { let role = snapshotLoaded ? data.userRole ?? stable?.role : stable?.role; return role != nil && role != "member" }
    var unread: Int { data.notifications.filter { $0.read_at == nil }.count }
    func text(_ english: String, _ arabic: String) -> String { self.arabic ? arabic : english }
    func allowed(_ page: String, _ action: String? = nil) -> Bool {
        guard isStaff else { return false }
        if snapshotLoaded ? data.isAdmin : stable?.isAdmin == true { return true }
        let modules = snapshotLoaded ? data.permissions : stable?.permissions ?? []
        guard modules.contains(page) else { return false }
        guard let action else { return true }
        return (snapshotLoaded ? data.actionPermissions[page] ?? [] : stable?.actionPermissions?[page] ?? []).contains(action)
    }
    func money(_ minor: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "SAR"
        formatter.locale = Locale(identifier: arabic ? "ar_SA" : "en_SA")
        return formatter.string(from: NSNumber(value: Double(minor) / 100)) ?? "\(Double(minor)/100) SAR"
    }
    func date(_ value: String?) -> String { AcademyDates.display(value, arabic: arabic) }
    func status(_ value: String) -> String {
        let names: [String: (String, String)] = [
            "confirmed": ("Confirmed", "مؤكد"), "pending_payment": ("Awaiting payment", "بانتظار الدفع"),
            "cancelled": ("Cancelled", "ملغى"), "expired": ("Expired", "منتهي"),
            "open": ("Awaiting payment", "بانتظار الدفع"), "settled": ("Paid", "مدفوع"),
            "void": ("Voided", "ملغاة"), "refund_required": ("Refund required", "يلزم الاسترداد"),
            "ready": ("Ready", "جاهز"), "rest": ("Medical rest", "راحة طبية"), "retired": ("Retired", "متقاعد")]
        guard let pair = names[value] else { return value }
        return text(pair.0, pair.1)
    }
    func perform(_ work: () async throws -> Void) async {
        guard !busy else { return }
        busy = true
        error = nil
        defer { busy = false }
        do { try await work() }
        catch APIError.unauthorized { clear(); error = APIError.unauthorized.localizedDescription }
        catch is CancellationError { }
        catch { self.error = error.localizedDescription }
    }
    func restore() async {
        restoring = true
        defer { restoring = false }
        guard api.hasSession else { return }
        await perform { try await loadAccount() }
    }
    func signIn(email: String, password: String) async {
        await perform {
            let _: APIResult = try await api.send("auth/login", method: "POST", body: ["email": email.trimmingCharacters(in: .whitespacesAndNewlines), "password": password])
            try await loadAccount()
        }
    }
    private func loadAccount() async throws {
        let auth: Authentication = try await api.send("auth/me")
        account = auth.user
        stables = auth.stables
        let preferred = UserDefaults.standard.string(forKey: "academy.stable")
        stable = stables.first(where: { $0.id == preferred }) ?? stables.first
        try await refresh()
    }
    func refresh() async throws {
        guard let id = stable?.id else { return }
        let snapshot: AcademyData = try await api.send("data", stableID: id)
        guard stable?.id == id else { return }
        data = snapshot
        snapshotLoaded = true
        await synchronizeReminders()
    }
    func reload() async { await perform { try await refresh() } }
    func chooseStable(_ id: String) async {
        guard !busy, id != stable?.id else { return }
        ClassReminderService.shared.clear()
        data = AcademyData()
        snapshotLoaded = false
        stable = stables.first { $0.id == id }
        UserDefaults.standard.set(id, forKey: "academy.stable")
        await reload()
    }
    func mutate(_ path: String, body: [String: Any] = [:], method: String = "POST") async throws {
        guard let stableID = stable?.id else { throw APIError.message(text("Choose an academy first.", "اختر الأكاديمية أولاً.")) }
        let _: APIResult = try await api.send(path, method: method, body: body, stableID: stableID)
        try await refresh()
    }
    func synchronizeReminders() async {
        guard let accountID = account?.id, let stableID = stable?.id, snapshotLoaded else { return }
        let ids = Set(data.myInstructorProfiles.map(\.id))
        let reminders = ClassReminderPlan.make(accountID: accountID, stableID: stableID,
            bookings: data.bookings, sessions: data.classes, instructorIDs: ids, arabic: arabic)
        do { try await ClassReminderService.shared.synchronize(reminders, stableID: stableID); notice = nil }
        catch { notice = text("Class reminders could not be scheduled. Your booking is saved; reopen the app to retry.", "تعذر جدولة تذكيرات الحصص. حجزك محفوظ؛ أعد فتح التطبيق للمحاولة.") }
    }
    func signOut() async {
        await perform {
            let _: APIResult = try await api.send("auth/logout", method: "POST")
            clear()
        }
    }
    func clear() {
        ClassReminderService.shared.clear()
        api.clearSession()
        account = nil; stable = nil; stables = []; data = AcademyData(); snapshotLoaded = false; notice = nil
        try? FileManager.default.removeItem(at: FileManager.default.temporaryDirectory.appendingPathComponent("InvoiceExports"))
    }
    func session(for booking: Booking) -> RidingSession? { data.classes.first { $0.id == booking.class_id } }
    func memberName(_ id: String) -> String { data.members.first { $0.id == id }?.name ?? "—" }
    func canComplete(_ task: CareTask) -> Bool {
        guard isStaff, allowed("tasks", "edit"), task.cancelled != true else { return false }
        if snapshotLoaded ? data.isAdmin : stable?.isAdmin == true { return true }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = AcademyDates.zone
        let yesterday = calendar.date(byAdding: .day, value: -1, to: Date())!
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.timeZone = AcademyDates.zone; formatter.dateFormat = "yyyy-MM-dd"
        guard let due = AcademyDates.parse(task.dueAt) else { return false }
        return formatter.string(from: due) >= formatter.string(from: yesterday)
    }
}
