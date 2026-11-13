import SwiftUI

private struct BoardingEditor: Identifiable { let id = UUID(); let stay: BoardingStay? }
struct BoardingOverviewView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var from = Date()
    @State private var to = Date()
    @State private var search = ""
    @State private var editor: BoardingEditor?
    @State private var ending: BoardingStay?
    private var permitted: Bool { store.allowed("boarding") || store.allowed("stalls") }
    private func horse(_ stay: BoardingStay) -> String { store.data.horses.first { $0.id == stay.horseId }?.display(store.arabic) ?? store.text("Boarded horse", "حصان الإيواء") }
    private func stall(_ stay: BoardingStay) -> String { store.data.stalls.first { $0.id == stay.stallId }?.display(store.arabic) ?? store.text("Assigned stall", "المربط المخصص") }
    var body: some View {
        List {
            if permitted {
                if store.allowed("stalls") {
                    Section(store.text("Stall availability", "توفر المرابط")) {
                        DatePicker(store.text("From", "من"), selection: $from, displayedComponents: .date)
                        DatePicker(store.text("To", "إلى"), selection: $to, in: from..., displayedComponents: .date)
                        ForEach(store.data.stalls) { stall in
                            let slots = StallSlots.available(stall, stays: store.data.stallOccupancy, from: AcademyDates.day(from), to: AcademyDates.day(to))
                            HStack { Text(stall.display(store.arabic)); Spacer(); Text("\(slots) / \(stall.capacity) " + store.text("available", "متاح")).foregroundStyle(slots > 0 ? Brand.navy : Brand.ink).font(.subheadline.weight(.semibold)) }
                        }
                        Text(store.text("Spaces are calculated for the selected period, including assigned stays awaiting payment.", "تُحسب الأماكن للفترة المحددة، بما فيها فترات الإيواء المخصصة بانتظار السداد.")).font(.footnote).foregroundStyle(.secondary)
                    }
                }
                if store.allowed("boarding") {
                    Section(store.text("Boarding stays", "فترات الإيواء")) {
                        if store.data.boarding.isEmpty { Text(store.text("No boarding stays", "لا توجد فترات إيواء")) }
                        ForEach(store.data.boarding.filter { search.isEmpty || [horse($0),stall($0),store.memberName($0.memberId)].joined(separator: " ").localizedCaseInsensitiveContains(search) }.sorted { $0.startDate > $1.startDate }) { stay in
                            VStack(alignment: .leading, spacing: 10) {
                                HStack(spacing: 12) { AcademyPhoto(kind: "horses", id: stay.horseId, size: 55); VStack(alignment: .leading, spacing: 4) { Text(horse(stay)).font(.headline); Text(stall(stay)).font(.subheadline) } }
                                Text(stay.startDate + " — " + stay.endDate).font(.caption)
                                HStack { Text(stay.status == "active" ? store.text("Assigned", "مخصص") : store.text("Ended", "منتهٍ")); Spacer(); if let amount = stay.priceAmount { Text(store.money(amount)) } }.font(.subheadline)
                                if let status = stay.paymentStatus { StatusPill(status: status) }
                                if stay.status == "active" {
                                    HStack(spacing: 24) {
                                        if store.allowed("boarding", "edit") { Button(store.text("Edit stay", "تعديل الإيواء")) { editor = BoardingEditor(stay: stay) } }
                                        if store.allowed("boarding", "delete") { Button(store.text("End stay", "إنهاء الإيواء"), role: .destructive) { ending = stay } }
                                    }.buttonStyle(.borderless).disabled(store.busy)
                                }
                            }.padding(.vertical, 8)
                        }
                    }
                }
            } else { EmptyMessage(title: store.text("This page is not available for your account.", "هذه الصفحة غير متاحة لحسابك."), symbol: "lock") }
        }.navigationTitle(store.text("Stalls & boarding", "المرابط والإيواء")).searchable(text: $search)
            .refreshable { await store.reload() }
            .toolbar { if store.allowed("boarding", "add") { ToolbarItem(placement: .topBarTrailing) { Button { editor = BoardingEditor(stay: nil) } label: { Image(systemName: "plus") }.accessibilityLabel(store.text("Assign boarding", "إضافة إيواء")) } } }
            .sheet(item: $editor) { selection in NavigationStack { BoardingFormView(stay: selection.stay, from: from, to: to) { start, end in from = start; to = end } } }
            .confirmationDialog(store.text("End this boarding stay?", "إنهاء فترة الإيواء؟"), isPresented: Binding(get: { ending != nil }, set: { if !$0 { ending = nil } }), titleVisibility: .visible) {
                if let stay = ending { Button(store.text("End stay", "إنهاء الإيواء"), role: .destructive) { Task { await store.perform { try await store.mutate("boarding/\(stay.id)/end") }; ending = nil } } }
            }
    }
}
struct BoardingFormView: View {
    @EnvironmentObject var store: AcademyStore
    @Environment(\.dismiss) private var dismiss
    let stay: BoardingStay?
    let onSaved: (Date, Date) -> Void
    @State private var horseID: String
    @State private var stallID: String
    @State private var memberID: String
    @State private var planID: String
    @State private var from: Date
    @State private var to: Date
    init(stay: BoardingStay?, from: Date, to: Date, onSaved: @escaping (Date, Date) -> Void) {
        self.stay = stay; self.onSaved = onSaved
        _horseID = State(initialValue: stay?.horseId ?? ""); _stallID = State(initialValue: stay?.stallId ?? "")
        _memberID = State(initialValue: stay?.memberId ?? ""); _planID = State(initialValue: stay?.planId ?? "")
        _from = State(initialValue: stay.flatMap { AcademyDates.parse($0.startDate) } ?? from)
        _to = State(initialValue: stay.flatMap { AcademyDates.parse($0.endDate) } ?? to)
    }
    private var plans: [PricePlan] { store.data.plans.filter { ["boarding","boarding_food","boarding_full","boarding_medical"].contains($0.kind ?? "") && ($0.active != false || $0.id == stay?.planId) } }
    private var locked: Bool { stay?.financialTermsLocked == true || stay?.paymentStatus == "settled" || (store.data.proformas.first { $0.id == stay?.invoiceId }?.paid ?? 0) > 0 }
    private var amount: Int? { if let stay, stay.planId == planID { return stay.priceAmount }; return plans.first { $0.id == planID }?.amount }
    var body: some View {
        Form {
            Section {
                Picker(store.text("Horse", "الحصان"), selection: $horseID) { Text(store.text("Choose", "اختر")).tag(""); ForEach(store.data.horses) { Text($0.display(store.arabic)).tag($0.id) } }
                Picker(store.text("Stall", "المربط"), selection: $stallID) {
                    Text(store.text("Choose", "اختر")).tag("")
                    ForEach(store.data.stalls.filter { $0.active != false || $0.id == stay?.stallId }) { stall in
                        Text(stall.display(store.arabic) + " · \(StallSlots.available(stall, stays: store.data.stallOccupancy, from: AcademyDates.day(from), to: AcademyDates.day(to), excluding: stay?.id)) " + store.text("available", "متاح")).tag(stall.id)
                    }
                }
                Picker(store.text("Billed member", "العضو المفوتر"), selection: $memberID) { Text(store.text("Choose", "اختر")).tag(""); ForEach(store.data.members) { Text($0.display(store.arabic)).tag($0.id) } }.disabled(locked)
                Picker(store.text("Boarding price", "سعر الإيواء"), selection: $planID) { Text(store.text("Choose", "اختر")).tag(""); ForEach(plans) { Text($0.name + " · " + store.money($0.amount)).tag($0.id) } }.disabled(locked)
                if plans.isEmpty { Text(store.text("Ask an administrator to add an active Boarding price through the web portal.", "اطلب من المسؤول إضافة سعر إيواء مفعّل عبر بوابة الويب.")).font(.footnote) }
                if let amount { LabeledContent(store.text("Price for this stay", "سعر فترة الإيواء"), value: store.money(amount)) }
                DatePicker(store.text("Start date", "بداية الفترة"), selection: $from, displayedComponents: .date)
                DatePicker(store.text("End date", "نهاية الفترة"), selection: $to, in: from..., displayedComponents: .date)
                Text(store.text("The price applies once to the selected period. Editing dates keeps the invoice and does not automatically prorate it.", "يُحتسب السعر مرة واحدة للفترة المحددة. يحتفظ تعديل التواريخ بالفاتورة دون احتساب تلقائي بالتناسب مع المدة.")).font(.footnote)
            }
            Section {
                Button(store.text("Save boarding", "حفظ الإيواء")) { Task { await store.perform {
                    let body: [String: Any] = ["horseId":horseID,"stallId":stallID,"memberId":memberID,"planId":planID,"startDate":AcademyDates.day(from),"endDate":AcademyDates.day(to)]
                    try await store.mutate(stay.map { "boarding/\($0.id)" } ?? "boarding", body: body, method: stay == nil ? "POST" : "PUT")
                    onSaved(from,to); dismiss()
                } } }.disabled(store.busy || horseID.isEmpty || stallID.isEmpty || memberID.isEmpty || planID.isEmpty || from > to || !store.allowed("boarding", stay == nil ? "add" : "edit"))
            }
        }.navigationTitle(stay == nil ? store.text("Assign boarding", "إضافة إيواء") : store.text("Edit boarding", "تعديل الإيواء"))
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button(store.text("Cancel", "إلغاء")) { dismiss() } } }
    }
}
