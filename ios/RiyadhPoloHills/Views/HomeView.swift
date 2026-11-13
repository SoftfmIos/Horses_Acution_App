import SwiftUI

struct HomeView: View {
    @EnvironmentObject var store: AcademyStore
    var upcoming: [Booking] {
        store.visibleBookings.filter { $0.isActive && (store.session(for: $0).flatMap { AcademyDates.parse($0.endsAt) } ?? .distantPast) > Date() }
            .sorted { (store.session(for: $0)?.startsAt ?? "") < (store.session(for: $1)?.startsAt ?? "") }
    }
    var assignedTasks: [CareTask] { store.allowed("tasks") ? store.data.tasks.filter { !$0.done && $0.cancelled != true && $0.assigneeId == store.account?.id } : [] }
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                ZStack(alignment: .bottomLeading) {
                    Image("PoloHero").resizable().scaledToFill().frame(height: 205).clipped()
                    LinearGradient(colors: [.clear, Brand.navy.opacity(0.95)], startPoint: .top, endPoint: .bottom)
                    HStack(alignment: .bottom, spacing: 16) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(store.text("RIYADH POLO HILLS", "الرياض بولو هيلز")).font(.caption.weight(.semibold)).foregroundStyle(Brand.gold)
                            Text(store.text("Welcome, ", "مرحباً، ") + (store.account?.display(store.arabic) ?? "")).font(.title.bold()).foregroundStyle(.white)
                        }
                        Spacer()
                        Image("AcademyLogo").resizable().scaledToFit().frame(width: 55, height: 65).padding(8).background(Brand.ivory, in: RoundedRectangle(cornerRadius: 12))
                    }.padding(20)
                }.clipShape(RoundedRectangle(cornerRadius: 20))
                if store.stables.count > 1 {
                    Picker(store.text("Academy", "الأكاديمية"), selection: Binding(get: { store.stable?.id ?? "" }, set: { id in Task { await store.chooseStable(id) } })) {
                        ForEach(store.stables) { stable in Text(stable.display(store.arabic)).tag(stable.id) }
                    }.pickerStyle(.menu).disabled(store.busy)
                }
                if store.isStaff {
                    HStack(spacing: 12) {
                        if store.allowed("classes") { AcademyCard { Label(store.text("Upcoming bookings", "الحجوزات القادمة"), systemImage: "calendar").font(.caption); Text("\(upcoming.count)").font(.largeTitle.bold()) } }
                        if store.allowed("tasks") { AcademyCard { Label(store.text("Your open tasks", "مهامك المعلقة"), systemImage: "checklist").font(.caption); Text("\(assignedTasks.count)").font(.largeTitle.bold()) } }
                    }
                    staffShortcuts
                } else {
                    CreditBalanceCard()
                    HStack(spacing: 12) {
                        NavigationLink { SessionsView(showAvailable: true) } label: { Label(store.text("Book a ride", "احجز حصة"), systemImage: "calendar.badge.plus") }.buttonStyle(PrimaryButtonStyle())
                        NavigationLink { BalanceView() } label: { Label(store.text("My balance", "رصيدي"), systemImage: "ticket").font(.headline).padding(15).frame(maxWidth: .infinity).background(Brand.stone, in: RoundedRectangle(cornerRadius: 12)) }
                    }
                }
                if !store.isStaff || store.allowed("classes") {
                    Text(store.isStaff ? store.text("Academy bookings", "حجوزات الأكاديمية") : store.text("Your next rides", "حصصك القادمة")).font(.title2.bold())
                    if upcoming.isEmpty { EmptyMessage(title: store.text("No upcoming bookings", "لا توجد حجوزات قادمة"), symbol: "calendar") }
                    ForEach(Array(upcoming.prefix(5))) { booking in NavigationLink { BookingDetailView(booking: booking) } label: { BookingCard(booking: booking) }.buttonStyle(.plain) }
                }
                if !store.ownedHorses.isEmpty && (!store.isStaff || store.allowed("horses")) {
                    Text(store.text("Your horses", "خيولك")).font(.title2.bold())
                    ForEach(Array(store.ownedHorses.prefix(3))) { horse in
                        NavigationLink { HorseDetailView(horse: horse) } label: { AcademyCard { HStack(spacing: 16) { AcademyPhoto(kind: "horses", id: horse.id, size: 66); VStack(alignment: .leading, spacing: 5) { Text(horse.display(store.arabic)).font(.headline); Text(horse.breed ?? "").font(.caption).foregroundStyle(.secondary) }; Spacer(); Image(systemName: "chevron.forward").font(.caption) } } }.buttonStyle(.plain)
                    }
                }
                if store.stables.isEmpty { EmptyMessage(title: store.text("No academy access yet. Your account controls are available from Account.", "لا يوجد وصول للأكاديمية بعد. يمكنك إدارة حسابك من الحساب."), symbol: "building.2") }
            }.padding()
        }.background(Brand.ivory).navigationTitle(store.isStaff ? (store.stable?.display(store.arabic) ?? store.text("Academy", "الأكاديمية")) : store.text("My account", "حسابي"))
            .refreshable { await store.reload() }
    }
    private var staffShortcuts: some View {
        HStack(spacing: 16) {
            if store.allowed("tasks") { NavigationLink { TasksView() } label: { Label(store.text("Tasks", "المهام"), systemImage: "checklist") } }
            if store.allowed("billing") { NavigationLink { InvoicesView() } label: { Label(store.text("Invoices", "الفواتير"), systemImage: "doc.text") } }
            if store.allowed("boarding") { NavigationLink { BoardingOverviewView() } label: { Label(store.text("Boarding", "الإيواء"), systemImage: "building.2") } }
        }.font(.subheadline.weight(.semibold)).padding(.vertical, 6)
    }
}
struct BookingCard: View {
    @EnvironmentObject var store: AcademyStore
    let booking: Booking
    var body: some View {
        AcademyCard {
            HStack { Text(store.session(for: booking)?.display(store.arabic) ?? store.text("Booking", "حجز")).font(.headline); Spacer(); StatusPill(status: booking.status) }
            Label(store.date(store.session(for: booking)?.startsAt), systemImage: "clock").font(.subheadline)
            if let session = store.session(for: booking) { InstructorBadge(session: session); Label(session.arena, systemImage: "mappin.and.ellipse").font(.subheadline).foregroundStyle(.secondary) }
            if let id = booking.horse_id { HStack(spacing: 12) { AcademyPhoto(kind: "horses", id: id, size: 44); Text(store.data.horses.first { $0.id == id }?.display(store.arabic) ?? store.text("Booked horse", "حصان الحجز")).font(.subheadline) } }
            if store.isStaff { Text(store.memberName(booking.member_id)).font(.caption) }
        }.foregroundStyle(Brand.ink)
    }
}
