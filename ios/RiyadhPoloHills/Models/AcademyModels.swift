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
struct Member: Decodable, Identifiable { let id: String; let name: String; let role: String; let creditBalance: Int? }
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
    func display(_ arabic: Bool) -> String { arabic ? (nameAr?.nonempty ?? name) : (nameEn?.nonempty ?? name) }
}
struct CareTask: Decodable, Identifiable {
    let id: String; let title: String; let dueAt: String; let done: Bool
    let assigneeId: String?; let horseId: String?; let notes: String?; let cancelled: Bool?
    let completedAt: String?; let medicalId: String?; let feedingPlanId: String?
}
struct InboxItem: Decodable, Identifiable {
    let id: String; let title: String; let message: String; let read_at: String?; let created_at: String
}
struct HorseEvent: Decodable, Identifiable {
    let id: String; let date: String; let type: String; let title: String; let details: String?
    var identity: String { type + id }
}
struct HorseProfileData: Decodable {
    let horse: Horse; let ownerName: String?; let events: [HorseEvent]
}
struct AcademyData: Decodable {
    var classes: [RidingSession] = []; var bookings: [Booking] = []; var plans: [PricePlan] = []
    var proformas: [Invoice] = []; var payments: [Payment] = []; var horses: [Horse] = []
    var tasks: [CareTask] = []; var notifications: [InboxItem] = []; var members: [Member] = []
    var creditBalance: Int = 0; var isAdmin: Bool = false; var userRole: String?
    var permissions: [String] = []; var actionPermissions: [String: [String]] = [:]
    init() {}
    enum CodingKeys: String, CodingKey { case classes, bookings, plans, proformas, payments, horses, tasks, notifications, members, creditBalance, isAdmin, userRole, permissions, actionPermissions }
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
