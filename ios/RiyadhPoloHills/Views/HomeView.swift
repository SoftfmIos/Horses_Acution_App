import SwiftUI

struct HomeView: View {
    @EnvironmentObject var store: AcademyStore
    var upcoming: [Booking] {
        store.data.bookings.filter { $0.isActive && (store.session(for: $0).flatMap { AcademyDates.parse($0.endsAt) } ?? .distantPast) > Date() }
            .sorted { (store.session(for: $0)?.startsAt ?? "") < (store.session(for: $1)?.startsAt ?? "") }
    }
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                ZStack(alignment: .bottomLeading) {
                    Image("PoloHero").resizable().scaledToFill().frame(height: 215).clipped()
                    LinearGradient(colors: [.clear, Brand.navy.opacity(0.95)], startPoint: .top, endPoint: .bottom)
                    VStack(alignment: .leading, spacing: 6) {
                        Text(store.text("WELCOME BACK", "مرحباً بعودتك")).font(.caption.weight(.semibold)).foregroundStyle(Brand.gold)
                        Text(store.account?.display(store.arabic) ?? "").font(.title.bold()).foregroundStyle(.white)
                    }.padding(20)
                }.clipShape(RoundedRectangle(cornerRadius: 20))
                if store.stables.count > 1 {
                    Picker(store.text("Academy", "الأكاديمية"), selection: Binding(get: { store.stable?.id ?? "" }, set: { id in Task { await store.chooseStable(id) } })) {
                        ForEach(store.stables) { stable in Text(stable.display(store.arabic)).tag(stable.id) }
                    }.pickerStyle(.menu).disabled(store.busy)
                }
                HStack(spacing: 12) {
                    AcademyCard { Label(store.text("Upcoming rides", "الحصص القادمة"), systemImage: "calendar").font(.caption); Text("\(upcoming.count)").font(.largeTitle.bold()) }
                    AcademyCard {
                        Label(store.isStaff ? store.text("Open tasks", "المهام المعلقة") : store.text("Lesson credits", "رصيد الحصص"), systemImage: store.isStaff ? "checklist" : "ticket").font(.caption)
                        Text("\(store.isStaff ? store.data.tasks.filter { !$0.done && $0.cancelled != true }.count : store.data.creditBalance)").font(.largeTitle.bold())
                    }
                }
                Text(store.isStaff ? store.text("Academy bookings", "حجوزات الأكاديمية") : store.text("Your next rides", "حصصك القادمة")).font(.title2.bold())
                if upcoming.isEmpty { EmptyMessage(title: store.text("No upcoming bookings", "لا توجد حجوزات قادمة"), symbol: "calendar") }
                ForEach(Array(upcoming.prefix(5))) { booking in
                    NavigationLink { BookingDetailView(booking: booking) } label: { BookingCard(booking: booking) }.buttonStyle(.plain)
                }
                if store.stables.isEmpty { EmptyMessage(title: store.text("No academy access yet. Contact support.", "لا يوجد وصول للأكاديمية بعد. تواصل مع الدعم."), symbol: "building.2") }
            }.padding()
        }.background(Brand.ivory).navigationTitle(store.stable?.display(store.arabic) ?? store.text("Home", "الرئيسية"))
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Image("AcademyLogo").resizable().scaledToFit().frame(width: 40, height: 40).accessibilityHidden(true) } }
            .refreshable { await store.reload() }
    }
}
struct BookingCard: View {
    @EnvironmentObject var store: AcademyStore
    let booking: Booking
    var body: some View {
        AcademyCard {
            HStack { Text(store.session(for: booking)?.display(store.arabic) ?? store.text("Booking", "حجز")).font(.headline); Spacer(); StatusPill(status: booking.status) }
            Label(store.date(store.session(for: booking)?.startsAt), systemImage: "clock").font(.subheadline)
            if let session = store.session(for: booking) { Label(session.arena, systemImage: "mappin.and.ellipse").font(.subheadline).foregroundStyle(.secondary) }
            if store.isStaff { Text(store.memberName(booking.member_id)).font(.caption) }
        }.foregroundStyle(Brand.ink)
    }
}
