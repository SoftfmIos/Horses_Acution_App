import XCTest
import PDFKit
@testable import RiyadhPoloHills

final class AcademyTests: XCTestCase {
    @MainActor func testAccountSwitchClearsOldIdentityEvenWhenLogoutIsOffline() async throws {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [AccountSwitchURLProtocol.self]
        let origin = try XCTUnwrap(URL(string: "https://native-account-switch.example.test"))
        let api = APIClient(configuration: AppConfiguration(apiOrigin: origin, websiteOrigin: origin), sessionConfiguration: configuration)
        let store = AcademyStore(api: api)
        await store.signIn(email: "staff@example.test", password: "Test only")
        XCTAssertEqual(store.account?.id, "staff")
        store.busy = true // Logout must remain available during a background refresh.
        await store.signOut()
        XCTAssertNil(store.account)
        XCTAssertFalse(api.hasSession)
        XCTAssertFalse(store.busy)
        XCTAssertTrue(store.data.horses.isEmpty)
        await store.signIn(email: "member@example.test", password: "Test only")
        XCTAssertEqual(store.account?.id, "member")
        XCTAssertEqual(store.account?.email, "member@example.test")
        XCTAssertNil(store.error)
        await store.signOut()
        await store.signIn(email: "wrong@example.test", password: "Test only")
        XCTAssertNil(store.account, "A server response for another account must never be displayed")
        XCTAssertFalse(api.hasSession)
        XCTAssertNotNil(store.error)
    }
    @MainActor func testOwnedHorsesRemainVisibleForMembersAndStaffWithoutHorseGrants() throws {
        let payload = Data(#"{"userRole":"staff","permissions":[],"horses":[{"id":"school","name":"School"}],"ownedHorses":[{"id":"own","name":"Owned horse","ownerId":"rider","notes":"Owner care notes"},{"id":"other","name":"Other horse","ownerId":"someone-else"}]}"#.utf8)
        for role in ["member", "staff"] {
            let store = AcademyStore()
            store.account = try JSONDecoder().decode(Account.self, from: Data(#"{"id":"rider","name":"Rider","email":"rider@example.test"}"#.utf8))
            store.stable = try JSONDecoder().decode(Stable.self, from: JSONSerialization.data(withJSONObject: ["id":"academy", "name":"Academy", "role":role]))
            var snapshot = try JSONDecoder().decode(AcademyData.self, from: payload)
            snapshot.userRole = role
            store.data = role == "member" ? snapshot.memberView(accountID: "rider") : snapshot
            store.snapshotLoaded = true
            XCTAssertTrue(store.canBrowseHorses)
            XCTAssertEqual(store.directoryHorses.map(\.id), ["own"])
            XCTAssertEqual(store.ownedHorses.first?.notes, "Owner care notes")
            XCTAssertFalse(store.allowed("horses", "edit"))
        }
    }
    @MainActor func testRefreshSurvivesCancelledViewTaskAndLoadsAuthoritativeBalance() async throws {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [BalanceRefreshURLProtocol.self]
        let origin = try XCTUnwrap(URL(string: "https://native-refresh.example.test"))
        let api = APIClient(configuration: AppConfiguration(apiOrigin: origin, websiteOrigin: origin), sessionConfiguration: configuration)
        let store = AcademyStore(api: api)
        store.account = try JSONDecoder().decode(Account.self, from: Data(#"{"id":"rider","name":"Test Rider","email":"rider@example.test"}"#.utf8))
        store.stable = try JSONDecoder().decode(Stable.self, from: Data(#"{"id":"academy","name":"Test Academy","role":"member"}"#.utf8))
        let viewTask = Task { await store.reload() }
        viewTask.cancel()
        await viewTask.value
        XCTAssertTrue(store.snapshotLoaded)
        XCTAssertEqual(store.data.creditBalance, 5)
        XCTAssertEqual(store.data.sessionBalance?.credited, 5)
        XCTAssertNil(store.error)
        XCTAssertFalse(store.busy)
    }
    @MainActor func testCancelledRefreshDoesNotDisplayAnAlertButRealNetworkErrorsDo() async {
        let store = AcademyStore()
        for cancellation in [CancellationError() as Error, URLError(.cancelled), NSError(domain: NSURLErrorDomain, code: NSURLErrorCancelled)] {
            await store.perform { throw cancellation }
            XCTAssertNil(store.error)
            XCTAssertFalse(store.busy)
        }
        await store.perform { throw URLError(.notConnectedToInternet) }
        XCTAssertNotNil(store.error)
        XCTAssertFalse(store.busy)
    }
    func testPaidPackageBalanceFromRealBackendContracts() throws {
        struct State: Decodable { let summary: SessionBalance; let snapshot: AcademyData }
        let url = try XCTUnwrap(Bundle(for: AcademyTests.self).url(forResource: "member-package-balances", withExtension: "json"))
        let states = try JSONDecoder().decode([String: State].self, from: Data(contentsOf: url))
        for name in ["unpaid", "partial", "paid", "refreshed"] {
            let state = try XCTUnwrap(states[name])
            let expected = ["paid", "refreshed"].contains(name) ? 5 : 0
            XCTAssertEqual(state.summary.balance, expected)
            XCTAssertEqual(state.snapshot.creditBalance, expected)
            XCTAssertEqual(SessionTotals(state.snapshot.creditLedger, summary: state.summary).purchased, expected)
            XCTAssertTrue(state.summary.needsReview.isEmpty)
            XCTAssertEqual(state.summary.pendingPackages, expected == 0 ? 1 : 0)
            XCTAssertEqual(state.snapshot.proformas.first?.credit_quantity, 5)
            XCTAssertEqual(state.snapshot.proformas.first?.status, expected == 0 ? "open" : "settled")
            XCTAssertEqual(state.snapshot.creditLedger.filter { $0.reason == "package.paid" }.count, expected == 0 ? 0 : 1)
        }
    }
    func testAcademySnapshotDecodesStallAvailability() throws {
        let payload = Data(#"{"stalls":[{"id":"stall","name":"A","capacity":2,"active":true}],"stallOccupancy":[{"id":"stay","stallId":"stall","status":"active","startDate":"2026-11-01","endDate":"2026-11-30"}]}"#.utf8)
        let snapshot = try JSONDecoder().decode(AcademyData.self, from: payload)
        let stall = try XCTUnwrap(snapshot.stalls.first)
        XCTAssertEqual(snapshot.stallOccupancy.count, 1)
        XCTAssertEqual(StallSlots.available(stall, stays: snapshot.stallOccupancy, from: "2026-11-13", to: "2026-11-14"), 1)
        let empty = try JSONDecoder().decode(AcademyData.self, from: Data("{}".utf8))
        XCTAssertTrue(empty.stalls.isEmpty)
        XCTAssertTrue(empty.stallOccupancy.isEmpty)
    }
    @MainActor func testAccountPDFExportProducesReadableMultiplePages() throws {
        for arabic in [false, true] {
            let line = arabic ? "سجل الحساب والحصص" : "Account and session history"
            let url = try AcademyTextDocument.create(title: line, lines: Array(repeating: line, count: 100), arabic: arabic)
            defer { try? FileManager.default.removeItem(at: url) }
            let document = try XCTUnwrap(PDFDocument(url: url))
            XCTAssertGreaterThan(document.pageCount, 1)
            XCTAssertTrue(document.page(at: 0)?.string?.contains("Riyadh Polo Hills") == true)
        }
    }
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

private final class AccountSwitchURLProtocol: URLProtocol {
    override class func canInit(with request: URLRequest) -> Bool { request.url?.host == "native-account-switch.example.test" }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        guard let url = request.url else { return }
        if url.path == "/api/auth/logout" {
            client?.urlProtocol(self, didFailWithError: URLError(.notConnectedToInternet)); return
        }
        var headers = ["Content-Type": "application/json"]
        let payload: String
        if url.path == "/api/auth/login" {
            guard request.value(forHTTPHeaderField: "Cookie") == nil else {
                client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse)); return
            }
            // URLSession may expose the JSON body as a stream to URLProtocol.
            var bytes = request.httpBody ?? Data()
            if bytes.isEmpty, let stream = request.httpBodyStream {
                stream.open(); defer { stream.close() }
                var buffer = [UInt8](repeating: 0, count: 4096)
                while stream.hasBytesAvailable {
                    let count = stream.read(&buffer, maxLength: buffer.count)
                    if count <= 0 { break }; bytes.append(contentsOf: buffer.prefix(count))
                }
            }
            let body = (try? JSONSerialization.jsonObject(with: bytes)) as? [String: String]
            let token = body?["email"] == "member@example.test" ? "member-token" : "staff-token"
            headers["Set-Cookie"] = "rp_session=\(token); Path=/; Secure; HttpOnly"
            payload = #"{"ok":true}"#
        } else {
            let member = request.value(forHTTPHeaderField: "Cookie") == "rp_session=member-token"
            let id = member ? "member" : "staff"
            payload = "{\"user\":{\"id\":\"\(id)\",\"name\":\"Test user\",\"email\":\"\(id)@example.test\"},\"stables\":[]}"
        }
        guard let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: headers) else { return }
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: Data(payload.utf8))
        client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() { }
}

private final class BalanceRefreshURLProtocol: URLProtocol {
    override class func canInit(with request: URLRequest) -> Bool { request.url?.host == "native-refresh.example.test" }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        guard let url = request.url else { return }
        let isBalance = url.path == "/api/members/rider/credits"
        let payload = isBalance
            ? #"{"memberId":"rider","balance":5,"credited":5,"used":0,"restored":0,"refunded":0,"needsReview":[],"pendingPackages":0,"paidRequestsWithoutSessions":0}"#
            : #"{"userRole":"member","creditBalance":0,"creditLedger":[]}"#
        guard let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: ["Content-Type": "application/json"]) else { return }
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: Data(payload.utf8))
        client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() { }
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

extension AcademyTests {
    func testMemberProjectionRejectsForeignBookingsTasksPaymentsAndPrivateHorseFields() throws {
        let payload = Data(#"{"userRole":"owner","isAdmin":true,"permissions":["tasks","classes","billing"],"tasks":[{"id":"task","title":"Academy work","dueAt":"2026-11-13T10:00:00Z","done":false}],"bookings":[{"id":"mine","member_id":"me","class_id":"lesson","horse_id":"school","status":"confirmed"},{"id":"theirs","member_id":"other","class_id":"lesson","status":"confirmed"}],"proformas":[{"id":"my-invoice","member_id":"me","description":"Mine","gross":100,"discount":0,"voucher":0,"due":100,"paid":0,"status":"open","created_at":"2026-11-13"},{"id":"their-invoice","member_id":"other","description":"Private","gross":100,"discount":0,"voucher":0,"due":100,"paid":0,"status":"open","created_at":"2026-11-13"}],"payments":[{"id":"my-payment","proforma_id":"my-invoice","amount":50,"reference":"Mine","created_at":"2026-11-13"},{"id":"their-payment","proforma_id":"their-invoice","amount":50,"reference":"Private","created_at":"2026-11-13"}],"horses":[{"id":"owned","name":"Owned","ownerId":"me","notes":"Owner care","microchip":"OWN"},{"id":"school","name":"School","ownerId":"other","notes":"Private notes","microchip":"PRIVATE"},{"id":"unrelated","name":"Unrelated","ownerId":"other"}],"notifications":[{"id":"mine","user_id":"me","title":"Mine","message":"Mine","created_at":"2026-11-13"},{"id":"other","user_id":"other","title":"Other","message":"Private","created_at":"2026-11-13"}]}"#.utf8)
        let source = try JSONDecoder().decode(AcademyData.self, from: payload)
        let view = source.memberView(accountID: "me")
        XCTAssertEqual(view.bookings.map(\.id), ["mine"])
        XCTAssertEqual(view.proformas.map(\.id), ["my-invoice"])
        XCTAssertEqual(view.payments.map(\.id), ["my-payment"])
        XCTAssertEqual(view.notifications.map(\.id), ["mine"])
        XCTAssertTrue(view.tasks.isEmpty); XCTAssertTrue(view.permissions.isEmpty); XCTAssertFalse(view.isAdmin)
        XCTAssertEqual(view.horses.count, 2)
        XCTAssertEqual(view.horses.first { $0.id == "owned" }?.notes, "Owner care")
        XCTAssertNil(view.horses.first { $0.id == "school" }?.notes)
        XCTAssertNil(view.horses.first { $0.id == "school" }?.microchip)
        XCTAssertEqual(source.tasks.count, 1, "Filtering must not mutate another account's source snapshot")
    }
    @MainActor func testMemberAuthenticationCannotInheritCachedStaffPrivileges() throws {
        let store = AcademyStore()
        store.account = try JSONDecoder().decode(Account.self, from: Data(#"{"id":"me","name":"Member","email":"member@example.com"}"#.utf8))
        store.stable = try JSONDecoder().decode(Stable.self, from: Data(#"{"id":"s","name":"Academy","role":"member","isAdmin":false}"#.utf8))
        store.data = try JSONDecoder().decode(AcademyData.self, from: Data(#"{"userRole":"owner","isAdmin":true,"permissions":["tasks","classes"],"bookings":[{"id":"foreign","member_id":"another","class_id":"lesson","status":"confirmed"}]}"#.utf8))
        store.snapshotLoaded = true
        XCTAssertFalse(store.isStaff)
        XCTAssertFalse(store.allowed("tasks"))
        XCTAssertTrue(store.visibleBookings.isEmpty)
        let foreign = try XCTUnwrap(store.data.bookings.first)
        XCTAssertFalse(store.canView(foreign))
        let identity = store.accessIdentity
        store.clear()
        XCTAssertNil(store.account); XCTAssertTrue(store.data.bookings.isEmpty); XCTAssertFalse(store.snapshotLoaded)
        XCTAssertNotEqual(identity, store.accessIdentity)
    }
    func testUnknownRolesFailClosedAndMemberRoleOverridesStaleStaffSnapshot() {
        XCTAssertFalse(AcademyAccess.isStaff(authRole: "unknown", snapshotRole: "owner", loaded: true))
        XCTAssertFalse(AcademyAccess.isStaff(authRole: "member", snapshotRole: "owner", loaded: true))
        XCTAssertFalse(AcademyAccess.isStaff(authRole: "owner", snapshotRole: "member", loaded: true))
        XCTAssertFalse(AcademyAccess.isStaff(authRole: "owner", snapshotRole: nil, loaded: true))
        XCTAssertTrue(AcademyAccess.isStaff(authRole: "owner", snapshotRole: "owner", loaded: true))
    }
    func testSessionTotalsHandleUsedRestoredAndRefundedCredits() throws {
        let data = Data(#"[{"id":"1","reason":"package.paid","delta":10,"created_at":"2026-11-13"},{"id":"2","reason":"booking.used","delta":-3,"created_at":"2026-11-13"},{"id":"3","reason":"booking.cancelled","delta":1,"created_at":"2026-11-13"},{"id":"4","reason":"package.refunded","delta":-2,"created_at":"2026-11-13"}]"#.utf8)
        let totals = SessionTotals(try JSONDecoder().decode([CreditEntry].self, from: data))
        XCTAssertEqual(totals.purchased,10); XCTAssertEqual(totals.used,3); XCTAssertEqual(totals.restored,1); XCTAssertEqual(totals.refunded,2)
        XCTAssertEqual(totals.purchased-totals.used+totals.restored-totals.refunded,6)
    }
    func testStallAvailabilityUsesPeakOverlapAndExcludesEditedOrEndedStays() throws {
        let stall = try JSONDecoder().decode(Stall.self, from: Data(#"{"id":"stall","name":"A","capacity":2,"active":true}"#.utf8))
        let stays = try JSONDecoder().decode([StallOccupancy].self, from: Data(#"[{"id":"first","stallId":"stall","status":"active","startDate":"2026-11-01","endDate":"2026-11-03"},{"id":"second","stallId":"stall","status":"active","startDate":"2026-11-04","endDate":"2026-11-06"},{"id":"ended","stallId":"stall","status":"ended","startDate":"2026-11-01","endDate":"2026-11-06"}]"#.utf8))
        XCTAssertEqual(StallSlots.available(stall,stays:stays,from:"2026-11-01",to:"2026-11-06"),1)
        XCTAssertEqual(StallSlots.available(stall,stays:stays,from:"2026-11-01",to:"2026-11-03",excluding:"first"),2)
    }
    func testProfilePhotoAndAccountDeletionPreviewDecode() throws {
        let photo = try JSONDecoder().decode(ProfilePhotoData.self,from:Data(#"{"mime":"image/png","content":"cGhvdG8=","updatedAt":"2026-11-13"}"#.utf8))
        XCTAssertEqual(Data(base64Encoded:try XCTUnwrap(photo.content)),Data("photo".utf8))
        let empty = try JSONDecoder().decode(ProfilePhotoData.self,from:Data(#"{"content":null}"#.utf8)); XCTAssertNil(empty.content)
        let preview = try JSONDecoder().decode(DeletionPreview.self,from:Data(#"{"blockers":[],"creditBalance":3,"openInvoices":1,"activeBookings":2}"#.utf8))
        XCTAssertEqual(preview.activeBookings,2); XCTAssertTrue(preview.blockers.isEmpty)
    }
}

extension AcademyTests {
    func testOwnedHorseAndPhotoContractsFromCurrentBackend() throws {
        let bundle = Bundle(for: AcademyTests.self)
        let profileURL = try XCTUnwrap(bundle.url(forResource: "member-horse-profile", withExtension: "json"))
        let profile = try JSONDecoder().decode(HorseProfileData.self, from: Data(contentsOf: profileURL))
        XCTAssertEqual(profile.horse.microchip, "TEST-CHIP")
        XCTAssertEqual(profile.horse.notes, "Fictional owner care notes")
        XCTAssertEqual(profile.instructor?.name, "Test Instructor")
        XCTAssertFalse(profile.medical.isEmpty)
        XCTAssertEqual(profile.medical.first?.display(false), "Test vaccination")
        XCTAssertEqual(profile.feeding.first?.feed, "Test hay")
        XCTAssertEqual(profile.bookings.count, 1)
        for name in ["member-horse-photo", "member-instructor-photo"] {
            let url = try XCTUnwrap(bundle.url(forResource: name, withExtension: "json"))
            let photo = try JSONDecoder().decode(ProfilePhotoData.self, from: Data(contentsOf: url))
            XCTAssertEqual(photo.mime, "image/png")
            let bytes = try XCTUnwrap(Data(base64Encoded: try XCTUnwrap(photo.content)))
            XCTAssertTrue(bytes.count > 8)
        }
    }
}
