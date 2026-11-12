import SwiftUI
import UIKit

@MainActor enum InvoiceDocument {
    static func escape(_ value: String) -> String {
        value.replacingOccurrences(of: "&", with: "&amp;").replacingOccurrences(of: "<", with: "&lt;").replacingOccurrences(of: ">", with: "&gt;").replacingOccurrences(of: "\"", with: "&quot;")
    }
    static func create(invoice: Invoice, payments: [Payment], customer: String, academy: String) throws -> URL {
        let money: (Int) -> String = { String(format: "%.2f SAR", Double($0)/100) }
        let rows: [(String, String)] = [
            ("Customer / العميل",customer),("Reference / المرجع",invoice.id),("Description / الوصف",invoice.description),
            ("Issued / تاريخ الإصدار",AcademyDates.display(invoice.created_at, arabic: false)),
            ("Subtotal / المبلغ الأساسي",money(invoice.gross)),("Discount / الخصم",money(invoice.discount)),
            ("Voucher / القسيمة",money(invoice.voucher)),("Total / الإجمالي",money(invoice.due)),
            ("Paid / المدفوع",money(invoice.paid)),("Outstanding / المتبقي",money(invoice.outstanding))]
        let table = rows.map { "<tr><th>\(escape($0.0))</th><td>\(escape($0.1))</td></tr>" }.joined()
        let paymentRows = payments.map { "<tr><td>\(escape(AcademyDates.display($0.created_at, arabic: false)))</td><td>\(escape($0.reference))</td><td>\(escape($0.external_ref ?? ""))</td><td>\(money($0.amount))</td></tr>" }.joined()
        let logo = UIImage(named: "AcademyLogo")?.pngData()?.base64EncodedString() ?? ""
        let html = """
        <html><head><meta charset="utf-8"><style>body{font-family:Helvetica,Arial,sans-serif;color:#0d2d45;font-size:12px}h1,h2{text-align:center}table{width:100%;border-collapse:collapse;margin:18px 0}td,th{padding:9px;text-align:start;border-bottom:1px solid #eae4d8}th{background:#f7f3eb}tr{page-break-inside:avoid}</style></head><body>
        <p style="text-align:center"><img width="65" src="data:image/png;base64,\(logo)"></p><h1>\(escape(academy))</h1><h2>Pro forma / فاتورة مبدئية</h2>
        <table>\(table)</table><h3>Payments / الدفعات</h3><table>\(paymentRows)</table><p>Not an official tax invoice. / ليست فاتورة ضريبية رسمية.</p></body></html>
        """
        let renderer = InvoicePageRenderer()
        renderer.addPrintFormatter(UIMarkupTextPrintFormatter(markupText: html), startingAtPageAt: 0)
        let count = renderer.numberOfPages
        guard count > 0 else { throw APIError.message("Could not prepare the invoice PDF. / تعذر إعداد ملف الفاتورة.") }
        let document = UIGraphicsPDFRenderer(bounds: renderer.paperRect).pdfData { context in
            for page in 0..<count { context.beginPage(); renderer.drawPage(at: page, in: renderer.paperRect) }
        }
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent("InvoiceExports", isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        // Keep temporary financial exports out of backups and remove old exports.
        for file in (try? FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)) ?? [] { try? FileManager.default.removeItem(at: file) }
        let url = directory.appendingPathComponent("proforma-\(UUID().uuidString).pdf")
        try document.write(to: url, options: [.atomic, .completeFileProtection])
        return url
    }
}
private class InvoicePageRenderer: UIPrintPageRenderer {
    override var paperRect: CGRect { CGRect(x: 0, y: 0, width: 595, height: 842) }
    override var printableRect: CGRect { paperRect.insetBy(dx: 32, dy: 32) }
}
struct ShareDocument: UIViewControllerRepresentable {
    let url: URL
    func makeUIViewController(context: Context) -> UIActivityViewController { UIActivityViewController(activityItems: [url], applicationActivities: nil) }
    func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}
