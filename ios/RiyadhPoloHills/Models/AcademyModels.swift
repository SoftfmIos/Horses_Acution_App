import Foundation

struct Account: Decodable, Identifiable {
    let id: String
    let name: String
    let email: String
    var nameEn: String?
    var nameAr: String?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct Stable: Decodable, Identifiable {
    let id: String
    let name: String
    let role: String
    let isAdmin: Bool?
    let nameEn: String?
    let nameAr: String?
    let permissions: [String]?
    let actionPermissions: [String: [String]]?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct Authentication: Decodable { let user: Account; let stables: [Stable] }
struct Member: Decodable, Identifiable {
    let id: String; let name: String; let role: String; let creditBalance: Int?; let nameEn: String?; let nameAr: String?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct RidingSession: Decodable, Identifiable {
    let id: String
    let title: String
    let startsAt: String
    let endsAt: String
    let instructor: String
    let arena: String
    let places: Int?
    let capacity: Int?
    let creditCost: Int?
    let planId: String
    let instructorId: String?
    let horseIds: [String]?
    let titleEn: String?
    let titleAr: String?
    func display(_ arabic: Bool) -> String { arabic ? (titleAr?.nonempty ?? title) : (titleEn?.nonempty ?? title) }
    var isUpcoming: Bool { (AcademyDates.parse(startsAt) ?? .distantPast) > Date() }
}
struct Booking: Decodable, Identifiable {
    let id: String
    let member_id: String
    let class_id: String
    let status: String
    let hold_expires_at: String?
    let horse_id: String?
    var isActive: Bool { ["confirmed", "pending_payment"].contains(status) }
}
struct PricePlan: Decodable, Identifiable {
    let id: String; let name: String; let amount: Int
    let kind: String?; let active: Bool?; let credits: Int?
}
struct Invoice: Decodable, Identifiable {
    let id: String; let member_id: String; let description: String
    let gross: Int; let discount: Int; let voucher: Int; let due: Int; let paid: Int
    let status: String; let created_at: String; let descriptionEn: String?; let descriptionAr: String?
    let credit_quantity: Int?; let sessionCreditStatus: SessionCreditInfo?
    var outstanding: Int { ["void", "refund_required"].contains(status) ? 0 : max(0, due - paid) }
    func display(_ arabic: Bool) -> String { arabic ? (descriptionAr?.nonempty ?? description) : (descriptionEn?.nonempty ?? description) }
}
struct Payment: Decodable, Identifiable {
    let id: String; let proforma_id: String; let amount: Int
    let reference: String; let external_ref: String?; let created_at: String
}
struct Horse: Decodable, Identifiable {
    let id: String; let name: String; let nameEn: String?; let nameAr: String?
    let breed: String?; let status: String?; let microchip: String?; let notes: String?
    let ownerId: String?; let instructorId: String?; let birthDate: String?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct CareTask: Decodable, Identifiable {
    let id: String; let title: String; let dueAt: String; let done: Bool
    let assigneeId: String?; let horseId: String?; let notes: String?; let cancelled: Bool?
    let completedAt: String?; let medicalId: String?; let feedingPlanId: String?
    let titleEn: String?; let titleAr: String?
    func display(_ arabic: Bool) -> String { arabic ? (titleAr?.nonempty ?? title) : (titleEn?.nonempty ?? title) }
}
struct InboxItem: Decodable, Identifiable {
    let id: String; let title: String; let message: String; let read_at: String?; let created_at: String
    let user_id: String?
}
struct HorseEvent: Decodable, Identifiable {
    let id: String; let date: String; let type: String; let title: String; let details: String?
    var identity: String { type + id }
}
struct HorseProfileData: Decodable {
    let horse: Horse; let ownerName: String?; let events: [HorseEvent]
    let instructor: Instructor?; let medical: [MedicalRecord]; let feeding: [FeedingRecord]
    let tasks: [CareTask]; let documents: [HorseDocument]; let boarding: [BoardingStay]; let bookings: [HorseRide]
    enum CodingKeys: String, CodingKey { case horse, ownerName, events, instructor, medical, feeding, tasks, documents, boarding, bookings }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        horse = try c.decode(Horse.self, forKey: .horse)
        ownerName = try c.decodeIfPresent(String.self, forKey: .ownerName)
        events = try c.decodeIfPresent([HorseEvent].self, forKey: .events) ?? []
        instructor = try c.decodeIfPresent(Instructor.self, forKey: .instructor)
        medical = try c.decodeIfPresent([MedicalRecord].self, forKey: .medical) ?? []
        feeding = try c.decodeIfPresent([FeedingRecord].self, forKey: .feeding) ?? []
        tasks = try c.decodeIfPresent([CareTask].self, forKey: .tasks) ?? []
        documents = try c.decodeIfPresent([HorseDocument].self, forKey: .documents) ?? []
        boarding = try c.decodeIfPresent([BoardingStay].self, forKey: .boarding) ?? []
        bookings = try c.decodeIfPresent([HorseRide].self, forKey: .bookings) ?? []
    }
}
struct InstructorIdentity: Decodable { let id: String }
struct AcademyData: Decodable {
    var classes: [RidingSession] = []; var bookings: [Booking] = []; var plans: [PricePlan] = []
    var proformas: [Invoice] = []; var payments: [Payment] = []; var horses: [Horse] = []
    var tasks: [CareTask] = []; var notifications: [InboxItem] = []; var members: [Member] = []
    var instructors: [Instructor] = []; var creditLedger: [CreditEntry] = []; var boarding: [BoardingStay] = []; var stalls: [Stall] = []; var stallOccupancy: [StallOccupancy] = []
    var myInstructorProfiles: [InstructorIdentity] = []
    var creditBalance: Int = 0; var isAdmin: Bool = false; var userRole: String?; var emailConfigured = false
    var permissions: [String] = []; var actionPermissions: [String: [String]] = [:]
    init() {}
    enum CodingKeys: String, CodingKey { case emailConfigured, classes, bookings, plans, proformas, payments, horses, tasks, notifications, members, instructors, creditLedger, boarding, stalls, stallOccupancy, myInstructorProfiles, creditBalance, isAdmin, userRole, permissions, actionPermissions }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        classes = try c.decodeIfPresent([RidingSession].self, forKey: .classes) ?? []
        bookings = try c.decodeIfPresent([Booking].self, forKey: .bookings) ?? []
        plans = try c.decodeIfPresent([PricePlan].self, forKey: .plans) ?? []
        proformas = try c.decodeIfPresent([Invoice].self, forKey: .proformas) ?? []
        payments = try c.decodeIfPresent([Payment].self, forKey: .payments) ?? []
        horses = try c.decodeIfPresent([Horse].self, forKey: .horses) ?? []
        tasks = try c.decodeIfPresent([CareTask].self, forKey: .tasks) ?? []
        notifications = try c.decodeIfPresent([InboxItem].self, forKey: .notifications) ?? []
        members = try c.decodeIfPresent([Member].self, forKey: .members) ?? []
        instructors = try c.decodeIfPresent([Instructor].self, forKey: .instructors) ?? []
        creditLedger = try c.decodeIfPresent([CreditEntry].self, forKey: .creditLedger) ?? []
        boarding = try c.decodeIfPresent([BoardingStay].self, forKey: .boarding) ?? []
        stalls = try c.decodeIfPresent([Stall].self, forKey: .stalls) ?? []
        stallOccupancy = try c.decodeIfPresent([StallOccupancy].self, forKey: .stallOccupancy) ?? []
        myInstructorProfiles = try c.decodeIfPresent([InstructorIdentity].self, forKey: .myInstructorProfiles) ?? []
        emailConfigured = try c.decodeIfPresent(Bool.self, forKey: .emailConfigured) ?? false
        creditBalance = try c.decodeIfPresent(Int.self, forKey: .creditBalance) ?? 0
        isAdmin = try c.decodeIfPresent(Bool.self, forKey: .isAdmin) ?? false
        userRole = try c.decodeIfPresent(String.self, forKey: .userRole)
        permissions = try c.decodeIfPresent([String].self, forKey: .permissions) ?? []
        actionPermissions = try c.decodeIfPresent([String: [String]].self, forKey: .actionPermissions) ?? [:]
    }
}
struct Quote: Decodable { let gross: Int; let discount: Int; let voucher: Int; let due: Int; let credits: Int? }
struct APIResult: Decodable { let ok: Bool?; let id: String?; let queued: Bool? }
extension String { var nonempty: String? { trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : self } }

struct Instructor: Decodable, Identifiable {
    let id: String; let name: String; let nameEn: String?; let nameAr: String?; let active: Bool?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct ProfilePhotoData: Decodable { let mime: String?; let content: String?; let updatedAt: String? }
struct CreditEntry: Decodable, Identifiable { let id: String; let delta: Int; let reason: String; let created_at: String }
struct SessionCreditInfo: Decodable { let quantity: Int; let awarded: Bool; let status: String }
struct MedicalRecord: Decodable, Identifiable {
    let id: String; let title: String?; let type: String?; let titleEn: String?; let titleAr: String?
    let date: String?; let nextDue: String?; let dueAt: String?; let vet: String?; let completedAt: String?; let medication: String?; let dose: String?; let frequency: String?
    let frequencyHours: Int?; let durationDays: Int?; let notes: String?; let restriction: Bool?; let completed: Bool?
    func display(_ arabic: Bool) -> String { (arabic ? titleAr?.nonempty : titleEn?.nonempty) ?? title?.nonempty ?? type?.nonempty ?? (arabic ? "سجل رعاية" : "Care record") }
}
struct FeedingRecord: Decodable, Identifiable {
    let id: String; let feed: String; let quantity: String; let time: String
    let startDate: String?; let endDate: String?; let notes: String?; let active: Bool?
}
struct HorseDocument: Decodable, Identifiable { let id: String; let title: String; let category: String; let filename: String; let mime: String?; let createdAt: String }
struct DocumentFile: Decodable { let filename: String; let mime: String; let content: String }
struct BoardingStay: Decodable, Identifiable {
    let id: String; let horseId: String; let stallId: String; let memberId: String; let planId: String
    let startDate: String; let endDate: String; let status: String; let invoiceId: String
    let priceAmount: Int?; let paymentStatus: String?; let stall: String?; let financialTermsLocked: Bool?
}
struct HorseRide: Decodable, Identifiable { let id: String; let member_id: String; let status: String; let session: RidingSession; let attendance: String? }
struct DeletionBlocker: Decodable, Identifiable { let id: String; let name: String }
struct DeletionPreview: Decodable { let blockers: [DeletionBlocker]; let creditBalance: Int; let openInvoices: Int; let activeBookings: Int }

struct SessionTotals {
    let purchased: Int; let used: Int; let restored: Int; let refunded: Int
    init(_ ledger: [CreditEntry]) {
        purchased = ledger.filter { $0.reason == "package.paid" }.reduce(0) { $0 + $1.delta }
        used = -ledger.filter { $0.reason == "booking.used" }.reduce(0) { $0 + $1.delta }
        restored = ledger.filter { $0.reason == "booking.cancelled" }.reduce(0) { $0 + $1.delta }
        refunded = -ledger.filter { $0.reason == "package.refunded" }.reduce(0) { $0 + $1.delta }
    }
}
enum AcademyAccess {
    static let staffRoles: Set<String> = ["owner", "staff", "admin", "instructor", "vet", "caregiver"]
    static func isStaff(authRole: String?, snapshotRole: String?, loaded: Bool) -> Bool {
        guard let role = authRole, staffRoles.contains(role) else { return false }
        guard loaded else { return true }
        guard let snapshotRole else { return false }
        return staffRoles.contains(snapshotRole)
    }
}
extension AcademyData {
    func memberView(accountID: String) -> AcademyData {
        var view = self
        view.tasks = []; view.permissions = []; view.actionPermissions = [:]; view.isAdmin = false; view.userRole = "member"; view.myInstructorProfiles = []
        view.bookings = bookings.filter { $0.member_id == accountID }
        let classIDs = Set(view.bookings.map(\.class_id)), horseIDs = Set(view.bookings.compactMap(\.horse_id))
        view.classes = classes.filter { $0.isUpcoming || classIDs.contains($0.id) }
        view.horses = horses.filter { $0.ownerId == accountID || horseIDs.contains($0.id) }.map { $0.ownerId == accountID ? $0 : $0.publicSummary }
        view.proformas = proformas.filter { $0.member_id == accountID }
        let invoiceIDs = Set(view.proformas.map(\.id))
        view.payments = payments.filter { invoiceIDs.contains($0.proforma_id) }
        view.members = members.filter { $0.id == accountID }
        view.notifications = notifications.filter { $0.user_id == accountID }
        view.boarding = []; view.stalls = []; view.stallOccupancy = []
        return view
    }
}

struct Stall: Decodable, Identifiable {
    let id: String; let name: String; let nameEn: String?; let nameAr: String?; let capacity: Int; let active: Bool?
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct StallOccupancy: Decodable, Identifiable { let id: String; let stallId: String; let status: String; let startDate: String; let endDate: String }
enum StallSlots {
    static func available(_ stall: Stall, stays: [StallOccupancy], from: String, to: String, excluding: String? = nil) -> Int {
        guard from <= to, stall.active != false else { return 0 }
        let rows = stays.filter { $0.stallId == stall.id && $0.status == "active" && $0.id != excluding && $0.startDate <= to && $0.endDate >= from }
        let boundaries = [from] + rows.map(\.startDate).filter { $0 >= from && $0 <= to }
        let occupied = boundaries.map { date in rows.filter { $0.startDate <= date && $0.endDate >= date }.count }.max() ?? 0
        return max(0, stall.capacity - occupied)
    }
}

extension Horse {
    var publicSummary: Horse { Horse(id: id, name: name, nameEn: nameEn, nameAr: nameAr, breed: breed, status: status, microchip: nil, notes: nil, ownerId: nil, instructorId: nil, birthDate: nil) }
}
