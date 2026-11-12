import SwiftUI

struct HorsesView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var search = ""
    var body: some View {
        List {
            if store.data.horses.isEmpty { EmptyMessage(title: store.text("No horses to show", "لا توجد خيول للعرض"), symbol: "figure.equestrian.sports") }
            ForEach(store.data.horses.filter { search.isEmpty || $0.display(store.arabic).localizedCaseInsensitiveContains(search) }) { horse in
                NavigationLink { HorseDetailView(horse: horse) } label: {
                    HStack(spacing: 16) {
                        Image(systemName: "figure.equestrian.sports").font(.title).foregroundStyle(Brand.gold).frame(width: 44)
                        VStack(alignment: .leading, spacing: 6) { Text(horse.display(store.arabic)).font(.headline); Text(horse.breed ?? "").font(.caption).foregroundStyle(.secondary) }
                        Spacer()
                        if let status = horse.status { StatusPill(status: status) }
                    }.padding(.vertical, 8)
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.text("Horses", "الخيل"))
            .searchable(text: $search, prompt: store.text("Search horses", "البحث عن الخيل")).refreshable { await store.reload() }
    }
}
struct HorseDetailView: View {
    @EnvironmentObject var store: AcademyStore
    let horse: Horse
    @State private var profile: HorseProfileData?
    @State private var loading = true
    @State private var failure: String?
    var months: [String] { Array(Set(profile?.events.map { AcademyDates.month($0.date) } ?? [])).sorted(by: >) }
    func monthTitle(_ month: String) -> String {
        guard let date = AcademyDates.parse(month + "-01") else { return store.text("Undated", "بدون تاريخ") }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: store.arabic ? "ar_SA" : "en_SA")
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.timeZone = AcademyDates.zone
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: date)
    }
    var body: some View {
        List {
            Section(store.text("Horse card", "بطاقة الخيل")) {
                if let status = horse.status { StatusPill(status: status) }
                LabeledContent(store.text("Breed", "السلالة"), value: horse.breed ?? "—")
                LabeledContent(store.text("Microchip", "الشريحة"), value: horse.microchip?.nonempty ?? "—")
                if let name = profile?.ownerName { LabeledContent(store.text("Owner", "المالك"), value: name) }
                if let notes = horse.notes?.nonempty { Text(notes) }
            }
            if loading { ProgressView() }
            if let failure { Section { Text(failure); Button(store.text("Retry", "إعادة المحاولة")) { Task { await load() } } } }
            if profile?.events.isEmpty == true { EmptyMessage(title: store.text("No history yet", "لا يوجد سجل بعد"), symbol: "clock") }
            ForEach(months, id: \.self) { month in
                Section(monthTitle(month)) {
                    ForEach((profile?.events ?? []).filter { AcademyDates.month($0.date) == month }.sorted { $0.date > $1.date }, id: \.identity) { event in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(event.title).font(.headline)
                            Text(store.date(event.date)).font(.caption).foregroundStyle(.secondary)
                            if let details = event.details?.nonempty { Text(details).font(.subheadline) }
                        }.padding(.vertical, 6)
                    }
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(horse.display(store.arabic))
            .task(id: store.stable?.id) { await load() }.refreshable { await load() }
    }
    private func load() async {
        loading = true; failure = nil
        defer { loading = false }
        do { profile = try await store.api.send("horses/\(horse.id)/profile", stableID: store.stable?.id) }
        catch APIError.unauthorized { store.clear(); store.error = APIError.unauthorized.localizedDescription }
        catch { failure = error.localizedDescription }
    }
}
