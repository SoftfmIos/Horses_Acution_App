import SwiftUI

struct HorsesView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var search = ""
    var horses: [Horse] { store.directoryHorses.filter { search.isEmpty || $0.display(store.arabic).localizedCaseInsensitiveContains(search) } }
    var body: some View {
        List {
            if horses.isEmpty { EmptyMessage(title: store.text("No horses to show", "لا توجد خيول للعرض"), symbol: "figure.equestrian.sports") }
            ForEach(horses) { horse in
                NavigationLink { HorseDetailView(horse: horse) } label: {
                    HStack(spacing: 16) {
                        AcademyPhoto(kind: "horses", id: horse.id, size: 64)
                        VStack(alignment: .leading, spacing: 6) { Text(horse.display(store.arabic)).font(.headline); Text(horse.breed ?? "").font(.caption).foregroundStyle(.secondary) }
                        Spacer()
                        if let status = horse.status { StatusPill(status: status) }
                    }.padding(.vertical, 8)
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.isStaff ? store.text("Horses", "الخيل") : store.text("My horses", "خيولي"))
            .searchable(text: $search, prompt: store.text("Search horses", "البحث عن الخيل")).refreshable { await store.reload() }
    }
}
struct HorseDetailView: View {
    @EnvironmentObject var store: AcademyStore
    let horse: Horse
    @State private var profile: HorseProfileData?
    @State private var loading = true
    @State private var failure: String?
    @State private var section = "card"
    @State private var sharedFile: URL?
    private var current: Horse { profile?.horse ?? horse }
    private var scope: String { store.accessIdentity + "|" + store.dataRevision.uuidString + "|" + horse.id }
    private var months: [String] { Array(Set(profile?.events.map { AcademyDates.month($0.date) } ?? [])).sorted(by: >) }
    var body: some View {
        List {
            Section {
                HStack(spacing: 20) {
                    AcademyPhoto(kind: "horses", id: horse.id, size: 110)
                    VStack(alignment: .leading, spacing: 8) { Text(current.display(store.arabic)).font(.title2.bold()); Text(current.breed ?? "").foregroundStyle(.secondary); if let status = current.status { StatusPill(status: status) } }
                }.padding(.vertical, 10)
                Picker(store.text("Show", "عرض"), selection: $section) {
                    Text(store.text("Card", "البطاقة")).tag("card")
                    Text(store.text("History", "السجل")).tag("history")
                    Text(store.text("Care", "الرعاية")).tag("care")
                    Text(store.text("Rides", "الحصص")).tag("rides")
                    Text(store.text("Documents", "الوثائق")).tag("documents")
                }.pickerStyle(.menu)
            }
            if loading { ProgressView() }
            if let failure { Section { Text(failure); Button(store.text("Retry", "إعادة المحاولة")) { Task { await load() } } } }
            if let profile {
                switch section {
                case "history": historySections(profile)
                case "care": careSections(profile)
                case "rides": ridesSection(profile)
                case "documents": documentsSection(profile)
                default: cardSections(profile)
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(current.display(store.arabic))
            .task(id: scope) { await load() }.refreshable { await load() }
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button { if let profile { do { sharedFile = try HorseCardDocument.create(profile: profile, arabic: store.arabic) } catch { store.error = error.localizedDescription } } } label: { Image(systemName: "square.and.arrow.up") }.accessibilityLabel(store.text("Share or print horse card", "مشاركة أو طباعة بطاقة الخيل")).disabled(profile == nil || loading) } }
            .sheet(isPresented: Binding(get: { sharedFile != nil }, set: { if !$0 { sharedFile = nil } })) { if let sharedFile { ShareDocument(url: sharedFile) } }
    }
    private func cardSections(_ profile: HorseProfileData) -> some View {
        Section(store.text("Horse card", "بطاقة الخيل")) {
            LabeledContent(store.text("Breed", "السلالة"), value: current.breed ?? "—")
            LabeledContent(store.text("Microchip", "الشريحة"), value: current.microchip?.nonempty ?? "—")
            LabeledContent(store.text("Date of birth", "تاريخ الميلاد"), value: AcademyDates.dayDisplay(current.birthDate, arabic: store.arabic))
            if let name = profile.ownerName?.nonempty { LabeledContent(store.text("Owner", "المالك"), value: name) }
            if let instructor = profile.instructor { HStack(spacing: 12) { AcademyPhoto(kind: "instructors", id: instructor.id, symbol: "person.fill", size: 48); VStack(alignment: .leading) { Text(store.text("Instructor", "المدرب")).font(.caption).foregroundStyle(.secondary); Text(instructor.display(store.arabic)) } } }
            if let notes = current.notes?.nonempty { Text(notes) }
            HStack { Label("\(profile.medical.count)", systemImage: "cross.case"); Spacer(); Label("\(profile.documents.count)", systemImage: "doc"); Spacer(); Label("\(profile.bookings.count)", systemImage: "calendar") }.font(.caption).foregroundStyle(.secondary)
        }
    }
    @ViewBuilder private func historySections(_ profile: HorseProfileData) -> some View {
        if profile.events.isEmpty { EmptyMessage(title: store.text("No history yet", "لا يوجد سجل بعد"), symbol: "clock") }
        ForEach(months, id: \.self) { month in
            Section(AcademyDates.monthTitle(month, arabic: store.arabic)) {
                ForEach(profile.events.filter { AcademyDates.month($0.date) == month }.sorted { $0.date > $1.date }, id: \.identity) { event in
                    VStack(alignment: .leading, spacing: 6) { Text(event.title).font(.headline); Text(store.date(event.date)).font(.caption).foregroundStyle(.secondary); if let details = event.details?.nonempty { Text(details).font(.subheadline) } }.padding(.vertical, 6)
                }
            }
        }
    }
    @ViewBuilder private func careSections(_ profile: HorseProfileData) -> some View {
        Section(store.text("Medical & care records", "السجلات الطبية والرعاية")) {
            if profile.medical.isEmpty { Text(store.text("No records to show", "لا توجد سجلات للعرض")).foregroundStyle(.secondary) }
            ForEach(profile.medical) { record in
                VStack(alignment: .leading, spacing: 8) {
                    Text(record.display(store.arabic)).font(.headline)
                    if let date = record.date { Text(store.date(date)).font(.caption).foregroundStyle(.secondary) }
                    if let medication = record.medication?.nonempty { LabeledContent(store.text("Medication", "الدواء"), value: medication) }
                    if let dose = record.dose?.nonempty { LabeledContent(store.text("Dose", "الجرعة"), value: dose) }
                    if let frequency = record.frequency?.nonempty { Text(frequency) }
                    if record.medication?.nonempty != nil, let hours = record.frequencyHours { LabeledContent(store.text("Dose interval", "تكرار الجرعة"), value: hours == 0 ? store.text("Once daily", "مرة يومياً") : "\(hours) " + store.text("hours", "ساعات")) }
                    if let days = record.durationDays, days > 0 { LabeledContent(store.text("Duration", "المدة"), value: "\(days) " + store.text("days", "أيام")) }
                    if let due = record.nextDue?.nonempty ?? record.dueAt?.nonempty { LabeledContent(store.text("Next due", "الاستحقاق القادم"), value: store.date(due)) }
                    if let vet = record.vet?.nonempty { LabeledContent(store.text("Veterinarian", "الطبيب البيطري"), value: vet) }
                    if record.completed == true { Label(store.text("Completed", "مكتمل") + " · " + store.date(record.completedAt), systemImage: "checkmark.circle") }
                    if record.restriction == true { Label(store.text("Medical rest", "راحة طبية"), systemImage: "cross.case").foregroundStyle(.orange) }
                    if let notes = record.notes?.nonempty { Text(notes).font(.subheadline) }
                }.padding(.vertical, 6)
            }
        }
        Section(store.text("Feeding plans", "خطط التغذية")) {
            if profile.feeding.isEmpty { Text(store.text("No feeding plans", "لا توجد خطط تغذية")).foregroundStyle(.secondary) }
            ForEach(profile.feeding) { feed in
                VStack(alignment: .leading, spacing: 6) { Text(feed.feed).font(.headline); Text(feed.quantity + " · " + feed.time); if let notes = feed.notes?.nonempty { Text(notes).font(.subheadline) }; if let start = feed.startDate { Text(AcademyDates.dayDisplay(start, arabic: store.arabic) + " — " + AcademyDates.dayDisplay(feed.endDate, arabic: store.arabic)).font(.caption).foregroundStyle(.secondary) } }
            }
        }
        Section(store.text("Care tasks for this horse", "مهام رعاية هذا الحصان")) {
            if profile.tasks.isEmpty { Text(store.text("No care tasks", "لا توجد مهام رعاية")).foregroundStyle(.secondary) }
            ForEach(profile.tasks) { task in
                VStack(alignment: .leading, spacing: 6) { Label(task.title, systemImage: task.done ? "checkmark.circle.fill" : "circle").font(.headline); Text(store.date(task.dueAt)).font(.caption); if let notes = task.notes?.nonempty { Text(notes).font(.subheadline) }; if task.done { Text(store.text("Completed: ", "تم الإنجاز: ") + store.date(task.completedAt)).font(.caption).foregroundStyle(.secondary) } }
            }
        }
        Section(store.text("Boarding history", "سجل الإيواء")) {
            if profile.boarding.isEmpty { Text(store.text("No boarding stays", "لا توجد فترات إيواء")).foregroundStyle(.secondary) }
            ForEach(profile.boarding) { stay in
                VStack(alignment: .leading, spacing: 6) { Text(stay.stall ?? store.text("Boarding stay", "فترة إيواء")).font(.headline); Text(stay.startDate + " — " + stay.endDate).font(.subheadline); Text(stay.status == "active" ? store.text("Assigned", "مخصص") : store.text("Ended", "منتهٍ")).font(.caption); if let amount = stay.priceAmount { Text(store.money(amount)) } }
            }
        }
    }
    private func ridesSection(_ profile: HorseProfileData) -> some View {
        Section(store.text("Ride bookings & attendance", "حجوزات الركوب والحضور")) {
            if profile.bookings.isEmpty { Text(store.text("No rides to show", "لا توجد حصص للعرض")).foregroundStyle(.secondary) }
            ForEach(profile.bookings.sorted { $0.session.startsAt > $1.session.startsAt }) { ride in
                VStack(alignment: .leading, spacing: 6) { Text(ride.session.display(store.arabic)).font(.headline); Text(store.date(ride.session.startsAt)).font(.caption); InstructorBadge(session: ride.session); StatusPill(status: ride.status); if let attendance = ride.attendance?.nonempty { Text(store.status(attendance)).font(.caption) } }
            }
        }
    }
    private func documentsSection(_ profile: HorseProfileData) -> some View {
        Section(store.text("Horse documents", "وثائق الخيل")) {
            if profile.documents.isEmpty { Text(store.text("No documents", "لا توجد وثائق")).foregroundStyle(.secondary) }
            ForEach(profile.documents) { document in
                Button { Task { await download(document) } } label: { HStack { Image(systemName: "doc.text").foregroundStyle(Brand.gold); VStack(alignment: .leading, spacing: 5) { Text(document.title).font(.headline); Text(document.filename).font(.caption).foregroundStyle(.secondary) }; Spacer(); Image(systemName: "square.and.arrow.up") } }.buttonStyle(.plain)
            }
        }
    }
    private func load() async {
        let key = scope
        loading = true; failure = nil; profile = nil
        do {
            let loaded: HorseProfileData = try await store.api.send("horses/\(horse.id)/profile", stableID: store.stable?.id)
            guard key == scope, !Task.isCancelled else { return }
            profile = loaded; loading = false
        } catch {
            guard key == scope, !Task.isCancelled else { return }
            if RequestCancellation.matches(error) { loading = false; return }
            loading = false; failure = error.localizedDescription
        }
    }
    private func download(_ document: HorseDocument) async {
        let key = scope
        do {
            let file: DocumentFile = try await store.api.send("horse-documents/\(document.id)", stableID: store.stable?.id)
            guard key == scope, let bytes = Data(base64Encoded: file.content) else { return }
            let folder = FileManager.default.temporaryDirectory.appendingPathComponent("HorseExports")
            try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            let url = folder.appendingPathComponent(UUID().uuidString + "-" + URL(fileURLWithPath: file.filename).lastPathComponent)
            try bytes.write(to: url, options: [.atomic, .completeFileProtection])
            sharedFile = url
        } catch { if key == scope && !RequestCancellation.matches(error) { store.error = error.localizedDescription } }
    }
}
