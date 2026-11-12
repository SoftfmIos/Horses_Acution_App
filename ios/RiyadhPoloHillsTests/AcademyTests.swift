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
