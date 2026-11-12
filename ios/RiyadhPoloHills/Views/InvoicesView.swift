import SwiftUI

struct InvoicesView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var search = ""
    var body: some View {
        List {
            if store.data.proformas.isEmpty { EmptyMessage(title: store.text("No payment requests", "لا توجد طلبات دفع"), symbol: "doc.text") }
            ForEach(store.data.proformas.filter { search.isEmpty || [$0.description,$0.descriptionAr ?? "",$0.id,store.memberName($0.member_id)].joined(separator: " ").localizedCaseInsensitiveContains(search) }) { invoice in
                NavigationLink { InvoiceDetailView(invoice: invoice) } label: {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack { Text(invoice.display(store.arabic)).font(.headline); Spacer(); StatusPill(status: invoice.status) }
                        if store.isStaff { Text(store.memberName(invoice.member_id)).font(.caption) }
                        HStack { Text(store.money(invoice.due)); Spacer(); Text(store.text("Remaining: ", "المتبقي: ") + store.money(invoice.outstanding)).font(.caption) }
                    }.padding(.vertical, 6)
                }
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.text("Payment requests", "طلبات الدفع"))
            .searchable(text: $search, prompt: store.text("Search invoices or members", "البحث في الفواتير أو الأعضاء")).refreshable { await store.reload() }
    }
}
struct InvoiceDetailView: View {
    @EnvironmentObject var store: AcademyStore
    let invoice: Invoice
    @State private var recordPayment = false
    @State private var file: URL?
    var current: Invoice { store.data.proformas.first { $0.id == invoice.id } ?? invoice }
    var payments: [Payment] { store.data.payments.filter { $0.proforma_id == invoice.id }.sorted { $0.created_at < $1.created_at } }
    var body: some View {
        List {
            Section {
                StatusPill(status: current.status)
                Text(current.display(store.arabic)).font(.headline)
                Text(current.id).font(.caption).textSelection(.enabled)
                LabeledContent(store.text("Issued", "تاريخ الإصدار"), value: store.date(current.created_at))
                LabeledContent(store.text("Subtotal", "المبلغ الأساسي"), value: store.money(current.gross))
                LabeledContent(store.text("Discount", "الخصم"), value: store.money(current.discount))
                LabeledContent(store.text("Voucher", "القسيمة"), value: store.money(current.voucher))
                LabeledContent(store.text("Total", "الإجمالي"), value: store.money(current.due))
                LabeledContent(store.text("Paid", "المدفوع"), value: store.money(current.paid))
                LabeledContent(store.text("Outstanding", "المتبقي"), value: store.money(current.outstanding))
            }
            Section(store.text("Payments for this pro forma", "دفعات هذه الفاتورة المبدئية")) {
                if payments.isEmpty { Text(store.text("No payments recorded yet.", "لم تسجل دفعات بعد.")) }
                ForEach(payments) { payment in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack { Text(payment.reference).font(.headline); Spacer(); Text(store.money(payment.amount)) }
                        Text(store.date(payment.created_at)).font(.caption)
                        if let details = payment.external_ref { Text(details).font(.caption).foregroundStyle(.secondary) }
                    }.padding(.vertical, 5)
                }
            }
            Section {
                if store.allowed("billing", "edit") && current.status == "open" && current.outstanding > 0 {
                    Button(store.text("Record payment", "تسجيل دفعة")) { recordPayment = true }
                }
                Button(store.text("Share or print pro forma", "مشاركة أو طباعة الفاتورة المبدئية")) {
                    do { file = try InvoiceDocument.create(invoice: current, payments: payments, customer: store.memberName(current.member_id), academy: store.stable?.display(store.arabic) ?? "Riyadh Polo Hills") }
                    catch { store.error = error.localizedDescription }
                }
                Text(store.text("Pro forma payment request. Official tax invoices are issued by the academy’s invoicing system.", "فاتورة مبدئية لطلب الدفع. تصدر الفواتير الضريبية الرسمية من نظام فواتير الأكاديمية.")).font(.footnote)
            }
        }.navigationTitle(store.text("Pro forma", "الفاتورة المبدئية"))
            .sheet(isPresented: $recordPayment) { NavigationStack { RecordPaymentView(invoice: current) } }
            .sheet(isPresented: Binding(get: { file != nil }, set: { if !$0 { file = nil } })) { if let file { ShareDocument(url: file) } }
    }
}
struct RecordPaymentView: View {
    @EnvironmentObject var store: AcademyStore
    @Environment(\.dismiss) private var dismiss
    let invoice: Invoice
    @State private var amount = ""
    @State private var reference = ""
    @State private var details = ""
    var minor: Int? { PaymentAmount.minor(amount) }
    var body: some View {
        Form {
            LabeledContent(store.text("Outstanding", "المتبقي"), value: store.money(invoice.outstanding))
            TextField(store.text("Amount (SAR)", "المبلغ (ريال)"), text: $amount).keyboardType(.decimalPad)
            TextField(store.text("Payment reference", "مرجع الدفعة"), text: $reference)
            TextField(store.text("Voucher / bank transfer details", "تفاصيل القسيمة أو التحويل"), text: $details)
            Text(store.text("Record money already received by the academy. This does not charge a card.", "سجّل مبلغاً استلمته الأكاديمية بالفعل. لا يتم خصم مبلغ من بطاقة.")).font(.footnote)
            Button(store.text("Save payment", "حفظ الدفعة")) { Task { await store.perform {
                guard let minor else { return }
                try await store.mutate("proformas/\(invoice.id)/payment", body: ["amount": minor,"reference": reference,"externalRef": details])
                dismiss()
            } } }.disabled(store.busy || minor == nil || (minor ?? 0) > invoice.outstanding || reference.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || details.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }.navigationTitle(store.text("Record payment", "تسجيل دفعة"))
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button(store.text("Cancel", "إلغاء")) { dismiss() } } }
    }
}
enum PaymentAmount {
    static func minor(_ raw: String) -> Int? {
        let normalized = raw.trimmingCharacters(in: .whitespacesAndNewlines).map { character -> String in
            if let digit = character.wholeNumberValue { return String(digit) }
            return character == "٫" || character == "," ? "." : String(character)
        }.joined()
        guard normalized.range(of: #"^[0-9]+(?:\.[0-9]{1,2})?$"#, options: .regularExpression) != nil else { return nil }
        guard let value = Decimal(string: normalized, locale: Locale(identifier: "en_US_POSIX")), value > 0, value <= 1_000_000 else { return nil }
        let scaled = value * 100
        let number = NSDecimalNumber(decimal: scaled)
        guard Decimal(number.intValue) == scaled else { return nil }
        return number.intValue
    }
}
