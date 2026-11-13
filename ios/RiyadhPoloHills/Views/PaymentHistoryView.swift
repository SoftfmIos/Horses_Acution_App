import SwiftUI

struct PaymentHistoryView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var search = ""
    @State private var selectedMonth = ""
    @State private var groupByMember = false
    @State private var file: URL?
    private var invoices: [String: Invoice] { Dictionary(uniqueKeysWithValues: store.visibleInvoices.map { ($0.id,$0) }) }
    private var available: [Payment] { store.data.payments.filter { invoices[$0.proforma_id] != nil } }
    private var months: [String] { Array(Set(available.map { AcademyDates.month($0.created_at) })).sorted(by: >) }
    private var filtered: [Payment] {
        available.filter { payment in
            (selectedMonth.isEmpty || AcademyDates.month(payment.created_at) == selectedMonth) &&
            (search.isEmpty || [payment.reference,payment.external_ref ?? "",invoices[payment.proforma_id]?.display(store.arabic) ?? "",store.memberName(invoices[payment.proforma_id]?.member_id ?? "")].joined(separator: " ").localizedCaseInsensitiveContains(search))
        }.sorted { $0.created_at > $1.created_at }
    }
    private var displayedMonths: [String] { Array(Set(filtered.map { AcademyDates.month($0.created_at) })).sorted(by: >) }
    private func groupID(_ payment: Payment) -> String { groupByMember && store.isStaff ? (invoices[payment.proforma_id]?.member_id ?? "") : payment.proforma_id }
    private func groupTitle(_ key: String) -> String { groupByMember && store.isStaff ? store.memberName(key) : (invoices[key]?.display(store.arabic) ?? store.text("Payment request", "طلب دفع")) }
    private func groups(_ rows: [Payment]) -> [String] { Array(Set(rows.map(groupID))).sorted { groupTitle($0) < groupTitle($1) } }
    var body: some View {
        List {
            Section {
                LabeledContent(store.text("Net recorded payments", "صافي المدفوعات المسجلة"), value: store.money(filtered.reduce(0) { $0 + $1.amount }))
                Picker(store.text("Month", "الشهر"), selection: $selectedMonth) {
                    Text(store.text("All months", "جميع الأشهر")).tag("")
                    ForEach(months,id: \.self) { Text(AcademyDates.monthTitle($0, arabic: store.arabic)).tag($0) }
                }
                if store.isStaff { Toggle(store.text("Group by member", "تجميع حسب العضو"), isOn: $groupByMember) }
            }
            if filtered.isEmpty { EmptyMessage(title: store.text("No matching payments", "لا توجد مدفوعات مطابقة"), symbol: "doc.text.magnifyingglass") }
            ForEach(displayedMonths,id: \.self) { month in
                let rows = filtered.filter { AcademyDates.month($0.created_at) == month }
                Section(AcademyDates.monthTitle(month, arabic: store.arabic)) {
                    ForEach(groups(rows),id: \.self) { key in
                        let grouped = rows.filter { groupID($0) == key }
                        DisclosureGroup {
                            ForEach(grouped) { payment in
                                if let invoice = invoices[payment.proforma_id] {
                                    NavigationLink { InvoiceDetailView(invoice: invoice) } label: {
                                        VStack(alignment: .leading, spacing: 5) {
                                            HStack { Text(payment.reference).font(.headline); Spacer(); Text(store.money(payment.amount)).font(.subheadline.weight(.semibold)) }
                                            Text(invoice.display(store.arabic)).font(.subheadline)
                                            Text(store.date(payment.created_at)).font(.caption).foregroundStyle(.secondary)
                                            if let ref = payment.external_ref?.nonempty { Text(ref).font(.caption).foregroundStyle(.secondary) }
                                        }.padding(.vertical, 6)
                                    }
                                }
                            }
                        } label: { VStack(alignment: .leading, spacing: 5) { Text(groupTitle(key)).font(.headline); Text(store.money(grouped.reduce(0) { $0 + $1.amount })).font(.subheadline) } }
                    }
                }
            }
        }.navigationTitle(store.text("Payment history", "سجل المدفوعات")).searchable(text: $search, prompt: store.text("Member, invoice or payment reference", "العضو أو الفاتورة أو مرجع الدفعة"))
            .refreshable { await store.reload() }
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button { export() } label: { Image(systemName: "square.and.arrow.up") }.accessibilityLabel(store.text("Share or print payment report", "مشاركة أو طباعة تقرير المدفوعات")).disabled(filtered.isEmpty) } }
            .sheet(isPresented: Binding(get: { file != nil }, set: { if !$0 { file = nil } })) { if let file { ShareDocument(url: file) } }
    }
    private func export() {
        let title = store.text("Payment report", "تقرير المدفوعات")
        var lines = [store.stable?.display(store.arabic) ?? "Riyadh Polo Hills", store.text("Net recorded payments: ", "صافي المدفوعات المسجلة: ") + store.money(filtered.reduce(0) { $0 + $1.amount })]
        for month in displayedMonths {
            lines.append(AcademyDates.monthTitle(month, arabic: store.arabic))
            let rows = filtered.filter { AcademyDates.month($0.created_at) == month }
            for group in groups(rows) {
                lines.append(groupTitle(group))
                for row in rows.filter({ groupID($0) == group }) { lines.append([store.date(row.created_at),store.money(row.amount),row.reference,row.external_ref ?? ""].filter { !$0.isEmpty }.joined(separator: " · ")) }
            }
        }
        do { file = try AcademyTextDocument.create(title: title, lines: lines, arabic: store.arabic) }
        catch { store.error = error.localizedDescription }
    }
}
