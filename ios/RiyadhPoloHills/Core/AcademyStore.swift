import SwiftUI

@MainActor final class AcademyStore: ObservableObject {
    @Published var account: Account?
    @Published var stables: [Stable] = []
    @Published var stable: Stable?
    @Published var data = AcademyData()
    @Published var snapshotLoaded = false
    @Published var dataRevision = UUID()
    private var requestGeneration = UUID()
    private var operationGeneration = UUID()
    private var reloadTask: (id: UUID, task: Task<Void, Never>)?
    @Published var busy = false
    @Published var restoring = true
    @Published var error: String?
    @Published var notice: String?
    @Published var arabic = UserDefaults.standard.string(forKey: "academy.language").map { $0 == "ar" } ?? (Locale.preferredLanguages.first?.hasPrefix("ar") ?? false) {
        didSet { UserDefaults.standard.set(arabic ? "ar" : "en", forKey: "academy.language"); Task { await synchronizeReminders() } }
    }
    let api: APIClient
    init(api: APIClient? = nil) { self.api = api ?? APIClient() }
    var isStaff: Bool { AcademyAccess.isStaff(authRole: stable?.role, snapshotRole: data.userRole, loaded: snapshotLoaded) }
    var accessIdentity: String {
        let grants = data.actionPermissions.keys.sorted().map { $0 + ":" + (data.actionPermissions[$0] ?? []).sorted().joined(separator: ",") }.joined(separator: ";")
        return (account?.id ?? "") + "|" + (stable?.id ?? "") + "|" + String(isStaff) + "|" + String(data.isAdmin) + "|" + data.permissions.sorted().joined(separator: ",") + "|" + grants
    }
    var visibleBookings: [Booking] { isStaff && allowed("classes") ? data.bookings : data.bookings.filter { $0.member_id == account?.id } }
    var visibleInvoices: [Invoice] { isStaff && allowed("billing") ? data.proformas : data.proformas.filter { $0.member_id == account?.id } }
    var ownedHorses: [Horse] {
        guard let accountID = account?.id else { return [] }
        let owned = data.ownedHorses.filter { $0.ownerId == accountID }
        let ids = Set(owned.map(\.id))
        return owned + data.horses.filter { $0.ownerId == accountID && !ids.contains($0.id) }
    }
    var canBrowseHorses: Bool { !isStaff || allowed("horses") || !ownedHorses.isEmpty }
    var directoryHorses: [Horse] { isStaff && allowed("horses") ? data.horses : ownedHorses }
    func instructor(for session: RidingSession) -> Instructor? { data.instructors.first { $0.id == session.instructorId || $0.name == session.instructor || $0.nameEn == session.instructor || $0.nameAr == session.instructor } }
    func canView(_ invoice: Invoice) -> Bool { invoice.member_id == account?.id || allowed("billing") }
    func canView(_ booking: Booking) -> Bool { booking.member_id == account?.id || allowed("classes") }
    private func resetSnapshot() {
        reloadTask?.task.cancel(); reloadTask = nil
        requestGeneration = UUID(); ClassReminderService.shared.clear()
        data = AcademyData(); snapshotLoaded = false; dataRevision = UUID()
    }
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
            "partial": ("Partially paid", "مدفوع جزئياً"), "attended": ("Attended", "حاضر"), "absent": ("Absent", "غائب"),
            "open": ("Awaiting payment", "بانتظار الدفع"), "settled": ("Paid", "مدفوع"),
            "void": ("Voided", "ملغاة"), "refund_required": ("Refund required", "يلزم الاسترداد"),
            "ready": ("Ready", "جاهز"), "rest": ("Medical rest", "راحة طبية"), "retired": ("Retired", "متقاعد")]
        guard let pair = names[value] else { return value }
        return text(pair.0, pair.1)
    }
    func perform(_ work: () async throws -> Void) async {
        guard !busy else { return }
        let operation = UUID()
        operationGeneration = operation
        busy = true
        error = nil
        defer { if operationGeneration == operation { busy = false } }
        do { try await work() }
        catch APIError.unauthorized {
            guard operationGeneration == operation else { return }
            clear(); error = APIError.unauthorized.localizedDescription
        }
        catch {
            guard operationGeneration == operation else { return }
            if !RequestCancellation.matches(error) { self.error = error.localizedDescription }
        }
    }
    func restore() async {
        restoring = true
        defer { restoring = false }
        guard api.hasSession else { return }
        await perform { try await loadAccount() }
    }
    func signIn(email: String, password: String) async {
        guard !busy else { return }
        clear()
        let loginEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)
        await perform {
            let _: APIResult = try await api.send("auth/login", method: "POST", body: ["email": loginEmail, "password": password])
            try await loadAccount(expectedEmail: loginEmail)
        }
    }
    private func loadAccount(expectedEmail: String? = nil) async throws {
        resetSnapshot()
        account = nil; stable = nil; stables = []
        let auth: Authentication = try await api.send("auth/me")
        if let expectedEmail, auth.user.email.caseInsensitiveCompare(expectedEmail) != .orderedSame {
            api.clearSession()
            throw APIError.message(text("The signed-in account did not match your email. Please sign in again.", "الحساب الذي تم تسجيل الدخول إليه لا يطابق بريدك. يرجى تسجيل الدخول مجدداً."))
        }
        account = auth.user
        stables = auth.stables
        let preferred = UserDefaults.standard.string(forKey: "academy.stable")
        stable = stables.first(where: { $0.id == preferred }) ?? stables.first
        guard stable != nil else { snapshotLoaded = true; return }
        try await refresh()
    }
    func refresh() async throws {
        guard let id = stable?.id, let accountID = account?.id else { return }
        let generation = requestGeneration
        var snapshot: AcademyData = try await api.send("data", stableID: id)
        if !AcademyAccess.isStaff(authRole: stable?.role, snapshotRole: snapshot.userRole, loaded: true) {
            let balance: SessionBalance = try await api.send("members/\(accountID)/credits", stableID: id)
            guard balance.memberId == accountID else { throw APIError.invalidResponse }
            snapshot.sessionBalance = balance
            snapshot.creditBalance = balance.balance
        }
        try Task.checkCancellation()
        guard stable?.id == id, account?.id == accountID, generation == requestGeneration else { return }
        if !AcademyAccess.isStaff(authRole: stable?.role, snapshotRole: snapshot.userRole, loaded: true) {
            snapshot = snapshot.memberView(accountID: accountID)
        } else if !snapshot.isAdmin {
            if !snapshot.permissions.contains("tasks") { snapshot.tasks = [] }
            if !snapshot.permissions.contains("classes") { snapshot.classes = []; snapshot.bookings = [] }
            if !snapshot.permissions.contains("billing") { snapshot.proformas = []; snapshot.payments = []; snapshot.creditLedger = [] }
        }
        data = snapshot
        snapshotLoaded = true
        dataRevision = UUID()
        await synchronizeReminders()
    }
    func reload() async {
        if let pending = reloadTask { await pending.task.value; return }
        let id = UUID()
        // Keep network refresh alive when SwiftUI ends the pull gesture or replaces its view task.
        let task = Task { @MainActor in await self.perform { try await self.refresh() } }
        reloadTask = (id, task)
        await task.value
        if reloadTask?.id == id { reloadTask = nil }
    }
    func chooseStable(_ id: String) async {
        guard !busy, id != stable?.id else { return }
        resetSnapshot()
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
        let revocation = api.endSession()
        clear()
        await revocation.value
    }
    func clear() {
        operationGeneration = UUID(); busy = false; error = nil
        resetSnapshot()
        api.clearSession()
        account = nil; stable = nil; stables = []; data = AcademyData(); snapshotLoaded = false; notice = nil
        for folder in ["InvoiceExports", "HorseExports", "AccountExports"] { try? FileManager.default.removeItem(at: FileManager.default.temporaryDirectory.appendingPathComponent(folder)) }
    }
    func changeEmail(_ email: String, currentPassword: String) async {
        await perform {
            let _: APIResult = try await api.send("auth/account/email", method: "PUT", body: ["email": email, "currentPassword": currentPassword])
            clear()
            notice = text("Email updated. Sign in with your new email.", "تم تحديث البريد. سجّل الدخول بالبريد الجديد.")
        }
    }
    func changePassword(_ password: String, currentPassword: String) async {
        await perform {
            let _: APIResult = try await api.send("auth/account/password", method: "PUT", body: ["newPassword": password, "currentPassword": currentPassword])
            clear()
            notice = text("Password updated. Sign in with your new password.", "تم تحديث كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.")
        }
    }
    func deleteAccount(currentPassword: String) async {
        await perform {
            let _: APIResult = try await api.send("auth/account", method: "DELETE", body: ["currentPassword": currentPassword, "confirmation": "DELETE"])
            clear()
            notice = text("Your account has been deleted.", "تم حذف حسابك.")
        }
    }
    func session(for booking: Booking) -> RidingSession? { data.classes.first { $0.id == booking.class_id } }
    func memberName(_ id: String) -> String { data.members.first { $0.id == id }?.display(arabic) ?? "—" }
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
