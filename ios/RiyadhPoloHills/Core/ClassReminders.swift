import Foundation
import UserNotifications

struct ClassReminder: Equatable {
    let id: String
    let sessionID: String
    let fireDate: Date
    let title: String
    let body: String
}

enum ClassReminderPlan {
    static let prefix = "rph.class."
    // Leave room under iOS's pending-notification limit for future app features.
    static let limit = 60

    static func make(accountID: String, stableID: String, bookings: [Booking], sessions: [RidingSession], instructorIDs: Set<String>, arabic: Bool, now: Date = Date()) -> [ClassReminder] {
        let confirmed = bookings.filter { $0.status == "confirmed" }
        let ownSessionIDs = Set(confirmed.filter { $0.member_id == accountID }.map(\.class_id))
        let confirmedSessionIDs = Set(confirmed.map(\.class_id))
        return sessions.compactMap { session -> ClassReminder? in
            let assignedInstructor = session.instructorId.map { instructorIDs.contains($0) } == true && confirmedSessionIDs.contains(session.id)
            guard ownSessionIDs.contains(session.id) || assignedInstructor,
                  let start = AcademyDates.parse(session.startsAt) else { return nil }
            let fireDate = start.addingTimeInterval(-30 * 60)
            guard fireDate > now else { return nil }
            let title = arabic ? "حصتك تبدأ بعد 30 دقيقة" : "Your class starts in 30 minutes"
            let location = session.arena.nonempty.map { " · " + $0 } ?? ""
            let body = session.display(arabic) + " · " + AcademyDates.display(session.startsAt, arabic: arabic) + location
            return ClassReminder(id: prefix + stableID + "." + accountID + "." + session.id, sessionID: session.id, fireDate: fireDate, title: title, body: body)
        }.sorted { $0.fireDate == $1.fireDate ? $0.id < $1.id : $0.fireDate < $1.fireDate }
            .reduce(into: [ClassReminder]()) { result, reminder in
                if result.count < limit && !result.contains(where: { $0.id == reminder.id }) { result.append(reminder) }
            }
    }
}

@MainActor final class ClassReminderService: NSObject, UNUserNotificationCenterDelegate {
    static let shared = ClassReminderService()
    private let center = UNUserNotificationCenter.current()
    private var generation = 0
    private override init() {
        super.init()
        center.delegate = self
    }

    func synchronize(_ reminders: [ClassReminder], stableID: String, requestPermission: Bool = true) async throws {
        generation += 1
        let current = generation
        let settings = await center.notificationSettings()
        var authorized = [UNAuthorizationStatus.authorized, .provisional, .ephemeral].contains(settings.authorizationStatus)
        if settings.authorizationStatus == .notDetermined && requestPermission && !reminders.isEmpty {
            authorized = try await center.requestAuthorization(options: [.alert, .sound])
        }
        guard generation == current else { return }
        let pending = await center.pendingNotificationRequests()
        guard generation == current else { return }
        let desiredIDs = Set(authorized ? reminders.map(\.id) : [])
        let stale = pending.filter { $0.identifier.hasPrefix(ClassReminderPlan.prefix) && !desiredIDs.contains($0.identifier) }.map(\.identifier)
        center.removePendingNotificationRequests(withIdentifiers: stale)
        guard authorized else { return }
        for reminder in reminders {
            guard generation == current else { return }
            let content = UNMutableNotificationContent()
            content.title = reminder.title
            content.body = reminder.body
            content.sound = .default
            content.threadIdentifier = "rph.classes." + stableID
            content.userInfo = ["stableID": stableID, "sessionID": reminder.sessionID]
            // Absolute UTC components avoid changes when the device changes time zone.
            var calendar = Calendar(identifier: .gregorian)
            calendar.timeZone = TimeZone(secondsFromGMT: 0)!
            var components = calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: reminder.fireDate)
            components.calendar = calendar
            components.timeZone = calendar.timeZone
            let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
            let request = UNNotificationRequest(identifier: reminder.id, content: content, trigger: trigger)
            try await center.add(request)
            // Sign-out or academy switches may happen while iOS adds a request.
            if generation != current { center.removePendingNotificationRequests(withIdentifiers: [reminder.id]); return }
        }
    }

    func clear() {
        generation += 1
        // The app owns only these local class reminders. Clear immediately at account boundaries.
        center.removeAllPendingNotificationRequests()
        center.removeAllDeliveredNotifications()
    }

    func status() async -> UNAuthorizationStatus { await center.notificationSettings().authorizationStatus }

    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .list, .sound])
    }
}
