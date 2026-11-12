import SwiftUI
import EventKit
import EventKitUI

struct CalendarEditor: UIViewControllerRepresentable {
    let session: RidingSession
    let bookingID: String
    @Environment(\.dismiss) private var dismiss
    func makeCoordinator() -> Coordinator { Coordinator(dismiss: { dismiss() }) }
    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let controller = EKEventEditViewController()
        controller.eventStore = context.coordinator.store
        let event = EKEvent(eventStore: context.coordinator.store)
        event.title = session.title
        event.startDate = AcademyDates.parse(session.startsAt)
        event.endDate = AcademyDates.parse(session.endsAt)
        event.timeZone = AcademyDates.zone
        event.location = session.arena
        event.notes = "Riyadh Polo Hills · Booking / الحجز: \(bookingID)"
        controller.event = event
        controller.editViewDelegate = context.coordinator
        return controller
    }
    func updateUIViewController(_ controller: EKEventEditViewController, context: Context) {}
    final class Coordinator: NSObject, EKEventEditViewDelegate {
        let store = EKEventStore()
        let dismiss: () -> Void
        init(dismiss: @escaping () -> Void) { self.dismiss = dismiss; super.init() }
        func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) { dismiss() }
    }
}
