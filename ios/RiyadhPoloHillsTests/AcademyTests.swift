import XCTest
@testable import RiyadhPoloHills

final class AcademyTests: XCTestCase {
    func testRealBackendContractFixtures() throws {
        for name in ["member-data", "staff-data"] {
            let url = try XCTUnwrap(Bundle(for: AcademyTests.self).url(forResource: name, withExtension: "json"))
            let decoded = try JSONDecoder().decode(AcademyData.self, from: Data(contentsOf: url))
            XCTAssertEqual(decoded.classes.count, 1)
            XCTAssertEqual(decoded.bookings.count, 1)
            XCTAssertEqual(decoded.proformas.first?.outstanding, 6000)
            XCTAssertEqual(decoded.payments.first?.amount, 4000)
        }
        let authURL = try XCTUnwrap(Bundle(for: AcademyTests.self).url(forResource: "member-auth", withExtension: "json"))
        let auth = try JSONDecoder().decode(Authentication.self, from: Data(contentsOf: authURL))
        XCTAssertEqual(auth.stables.first?.role, "member")
    }
    func testRiyadhMonthBoundary() {
        XCTAssertEqual(AcademyDates.month("2026-01-31T22:00:00Z"), "2026-02")
        XCTAssertEqual(AcademyDates.month("2026-01-31T20:00:00Z"), "2026-01")
        XCTAssertNotNil(AcademyDates.parse("2026-11-12T09:30:00.123Z"))
        XCTAssertNotNil(AcademyDates.parse("2026-11-12"))
    }
    func testExactPaymentAmounts() {
        XCTAssertEqual(PaymentAmount.minor("12.34"), 1234)
        XCTAssertEqual(PaymentAmount.minor("١٢٫٣٤"), 1234)
        XCTAssertNil(PaymentAmount.minor("12.345"))
        XCTAssertNil(PaymentAmount.minor("12invalid"))
        XCTAssertNil(PaymentAmount.minor("-1"))
        XCTAssertNil(PaymentAmount.minor("0"))
    }
    func testSparsePermissionFilteredDataDecodes() throws {
        let payload = Data(#"{"classes":[],"bookings":[],"horses":[],"isAdmin":false,"permissions":["tasks"],"actionPermissions":{"tasks":["edit"]}}"#.utf8)
        let data = try JSONDecoder().decode(AcademyData.self, from: payload)
        XCTAssertTrue(data.payments.isEmpty)
        XCTAssertEqual(data.actionPermissions["tasks"], ["edit"])
        XCTAssertEqual(data.creditBalance, 0)
    }
    func testBookingHoldsAndInvoiceBalances() throws {
        let invoice = try JSONDecoder().decode(Invoice.self, from: Data(#"{"id":"i","member_id":"u","description":"Lesson","gross":10000,"discount":1000,"voucher":0,"due":9000,"paid":4000,"status":"open","created_at":"2026-11-12T10:00:00Z"}"#.utf8))
        XCTAssertEqual(invoice.outstanding, 5000)
        let booking = try JSONDecoder().decode(Booking.self, from: Data(#"{"id":"b","member_id":"u","class_id":"c","status":"pending_payment","hold_expires_at":null}"#.utf8))
        XCTAssertTrue(booking.isActive)
    }
    @MainActor func testPermissionChecksDoNotGrantAccessToMembers() throws {
        let store = AcademyStore()
        store.stable = try JSONDecoder().decode(Stable.self, from: Data(#"{"id":"s","name":"Academy","role":"member","isAdmin":false,"permissions":["tasks"],"actionPermissions":{"tasks":["edit"]}}"#.utf8))
        XCTAssertFalse(store.allowed("tasks", "edit"))
        store.stable = try JSONDecoder().decode(Stable.self, from: Data(#"{"id":"s","name":"Academy","role":"owner","isAdmin":false,"permissions":["tasks"],"actionPermissions":{"tasks":["edit"]}}"#.utf8))
        XCTAssertTrue(store.allowed("tasks", "edit"))
        XCTAssertFalse(store.allowed("tasks", "delete"))
        XCTAssertFalse(store.allowed("billing", "edit"))
        store.snapshotLoaded = true
        store.data = AcademyData()
        XCTAssertFalse(store.allowed("tasks", "edit"), "A newly revoked grant must not fall back to stale login permissions")

    }
}

extension AcademyTests {
    private func reminderData(status: String = "confirmed", memberID: String = "rider", start: String = "2026-11-13T10:00:00Z", sessionID: String = "session") throws -> AcademyData {
        let json: [String: Any] = [
            "classes": [["id": sessionID,"title":"Lesson","startsAt":start,"endsAt":"2026-11-13T11:00:00Z","instructor":"Teacher","instructorId":"teacher-profile","arena":"Arena A","planId":"plan"]],
            "bookings": [["id":"booking","member_id":memberID,"class_id":sessionID,"status":status]]
        ]
        return try JSONDecoder().decode(AcademyData.self, from: JSONSerialization.data(withJSONObject: json))
    }
    func testReminderIsThirtyMinutesBeforeClass() throws {
        let data = try reminderData()
        let plan = ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:data.bookings,sessions:data.classes,instructorIDs:[],arabic:false,now:AcademyDates.parse("2026-11-13T08:00:00Z")!)
        XCTAssertEqual(plan.count,1)
        XCTAssertEqual(plan.first?.fireDate,AcademyDates.parse("2026-11-13T09:30:00Z"))
        XCTAssertTrue(plan.first?.body.contains("Arena A") == true)
    }
    func testPendingCancelledAndOtherMembersAreExcluded() throws {
        let now = AcademyDates.parse("2026-11-13T08:00:00Z")!
        for status in ["pending_payment","cancelled","expired"] {
            let data = try reminderData(status:status)
            XCTAssertTrue(ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:data.bookings,sessions:data.classes,instructorIDs:[],arabic:false,now:now).isEmpty)
        }
        let data = try reminderData()
        XCTAssertTrue(ClassReminderPlan.make(accountID:"unrelated-user",stableID:"academy",bookings:data.bookings,sessions:data.classes,instructorIDs:[],arabic:false,now:now).isEmpty)
    }
    func testAssignedInstructorGetsOneReminderAndPastTriggersAreSkipped() throws {
        let data = try reminderData()
        let now = AcademyDates.parse("2026-11-13T08:00:00Z")!
        let plan = ClassReminderPlan.make(accountID:"teacher-user",stableID:"academy",bookings:data.bookings+data.bookings,sessions:data.classes,instructorIDs:["teacher-profile"],arabic:true,now:now)
        XCTAssertEqual(plan.count,1)
        XCTAssertEqual(plan.first?.title,"حصتك تبدأ بعد 30 دقيقة")
        XCTAssertTrue(ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:data.bookings,sessions:data.classes,instructorIDs:[],arabic:false,now:AcademyDates.parse("2026-11-13T09:45:00Z")!).isEmpty)
    }
    func testReschedulingPreservesReminderIdentityAndChangesTrigger() throws {
        let original = try reminderData()
        let updated = try reminderData(start:"2026-11-13T12:00:00Z")
        let now = AcademyDates.parse("2026-11-13T08:00:00Z")!
        let first = ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:original.bookings,sessions:original.classes,instructorIDs:[],arabic:false,now:now)
        let second = ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:updated.bookings,sessions:updated.classes,instructorIDs:[],arabic:false,now:now)
        XCTAssertEqual(first.first?.id,second.first?.id)
        XCTAssertNotEqual(first.first?.fireDate,second.first?.fireDate)
    }
}

extension AcademyTests {
    func testReminderQueueStaysBelowIOSPendingLimit() throws {
        var sessions: [RidingSession] = []
        var bookings: [Booking] = []
        for index in 0..<70 {
            let data = try reminderData(sessionID: "session-\(index)")
            sessions += data.classes
            bookings += data.bookings
        }
        let plan = ClassReminderPlan.make(accountID:"rider",stableID:"academy",bookings:bookings,sessions:sessions,instructorIDs:[],arabic:false,now:AcademyDates.parse("2026-11-13T08:00:00Z")!)
        XCTAssertEqual(plan.count,60)
        XCTAssertEqual(Set(plan.map(\.id)).count,60)
    }
}
