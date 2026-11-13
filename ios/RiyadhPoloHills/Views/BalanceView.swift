import SwiftUI

struct CreditBalanceCard: View {
    @EnvironmentObject var store: AcademyStore
    var totals: SessionTotals { SessionTotals(store.data.creditLedger) }
    var body: some View {
        AcademyCard {
            HStack { Label(store.text("Sessions remaining", "الحصص المتبقية"), systemImage: "ticket").font(.headline); Spacer(); Text("\(store.data.creditBalance)").font(.system(size: 38, weight: .bold, design: .rounded)).foregroundStyle(Brand.navy) }
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], alignment: .leading, spacing: 16) {
                statistic(store.text("Total purchased", "إجمالي المشتراة"), totals.purchased)
                statistic(store.text("Used", "المستخدمة"), totals.used)
                statistic(store.text("Restored", "المعادة"), totals.restored)
                statistic(store.text("Refunded", "المستردة قيمتها"), totals.refunded)
            }
            LabeledContent(store.text("Awaiting full payment", "بانتظار السداد الكامل"), value: "\(store.visibleInvoices.filter { $0.status == "open" }.reduce(0) { $0 + ($1.credit_quantity ?? 0) })").font(.caption)
            Text(store.text("Remaining = purchased − used + restored − refunded.", "المتبقي = المشتراة − المستخدمة + المعادة − المستردة قيمتها.")).font(.caption).foregroundStyle(.secondary)
        }
    }
    private func statistic(_ title: String, _ value: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) { Text(title).font(.caption).foregroundStyle(.secondary); Text("\(value)").font(.title3.bold()) }
    }
}
struct BalanceView: View {
    @EnvironmentObject var store: AcademyStore
    var months: [String] { Array(Set(store.data.creditLedger.map { AcademyDates.month($0.created_at) })).sorted(by: >) }
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                CreditBalanceCard()
                NavigationLink { PackagesView() } label: { Label(store.text("Buy sessions", "شراء حصص"), systemImage: "plus.circle") }.buttonStyle(PrimaryButtonStyle())
                ForEach(store.visibleInvoices.filter { $0.sessionCreditStatus != nil }) { invoice in
                    NavigationLink { InvoiceDetailView(invoice: invoice) } label: {
                        AcademyCard { Text(invoice.display(store.arabic)).font(.headline); Text(packageStatus(invoice)); Text(store.money(invoice.paid) + " / " + store.money(invoice.due)).font(.caption) }
                    }.buttonStyle(.plain)
                }
                Text(store.text("Session history", "سجل الحصص")).font(.title2.bold())
                if store.data.creditLedger.isEmpty { EmptyMessage(title: store.text("No session transactions yet", "لا توجد معاملات حصص بعد"), symbol: "ticket") }
                ForEach(months, id: \.self) { month in
                    Text(AcademyDates.monthTitle(month, arabic: store.arabic)).font(.headline)
                    ForEach(store.data.creditLedger.filter { AcademyDates.month($0.created_at) == month }.sorted { $0.created_at > $1.created_at }) { entry in
                        AcademyCard { HStack { VStack(alignment: .leading, spacing: 5) { Text(reason(entry.reason)).font(.headline); Text(store.date(entry.created_at)).font(.caption).foregroundStyle(.secondary) }; Spacer(); Text((entry.delta > 0 ? "+" : "") + "\(entry.delta)").font(.title2.bold()).foregroundStyle(entry.delta > 0 ? Brand.navy : Brand.ink) } }
                    }
                }
            }.padding()
        }.background(Brand.ivory).navigationTitle(store.text("My balance", "رصيدي")).refreshable { await store.reload() }
    }
    private func packageStatus(_ invoice: Invoice) -> String {
        switch invoice.sessionCreditStatus?.status {
        case "credited": return store.text("Sessions credited", "أضيفت الحصص للرصيد")
        case "pending": return store.text("Awaiting full payment", "بانتظار السداد الكامل")
        case "refunded": return store.text("Closed or refunded", "مغلقة أو مستردة")
        default: return store.text("Paid package needs academy review", "تحتاج الباقة المدفوعة إلى مراجعة الأكاديمية")
        }
    }
    private func reason(_ value: String) -> String {
        switch value {
        case "package.paid": return store.text("Package purchased", "شراء باقة")
        case "booking.used": return store.text("Session booked", "حجز حصة")
        case "booking.cancelled": return store.text("Booking cancelled", "إلغاء حجز")
        case "package.refunded": return store.text("Package refunded", "استرداد قيمة باقة")
        default: return store.text("Balance adjustment", "تعديل الرصيد")
        }
    }
}
