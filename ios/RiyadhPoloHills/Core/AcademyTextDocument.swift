import UIKit

@MainActor enum AcademyTextDocument {
    static func create(title: String, lines: [String], arabic: Bool) throws -> URL {
        let renderer = UIGraphicsPDFRenderer(bounds: CGRect(x: 0, y: 0, width: 595, height: 842))
        let data: Data = renderer.pdfData { context in
            var y: CGFloat = 55
            func beginPage() {
                context.beginPage(); y = 55
                (("Riyadh Polo Hills · " + title) as NSString).draw(at: CGPoint(x: 40, y: 20), withAttributes: [.font: UIFont.boldSystemFont(ofSize: 13), .foregroundColor: UIColor(red: 13/255, green: 45/255, blue: 69/255, alpha: 1)])
            }
            beginPage()
            let paragraph = NSMutableParagraphStyle(); paragraph.alignment = arabic ? .right : .left
            let attributes: [NSAttributedString.Key: Any] = [.font: UIFont.systemFont(ofSize: 12), .paragraphStyle: paragraph]
            for line in lines {
                let text = line as NSString
                let height: CGFloat = max(22, text.boundingRect(with: CGSize(width: 515, height: CGFloat.greatestFiniteMagnitude), options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attributes, context: nil).height + 10)
                if y + height > 795 { beginPage() }
                text.draw(in: CGRect(x: 40, y: y, width: 515, height: height), withAttributes: attributes); y += height
            }
        }
        let folder = FileManager.default.temporaryDirectory.appendingPathComponent("AccountExports")
        try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        let url = folder.appendingPathComponent("Riyadh-Polo-Hills-" + UUID().uuidString + ".pdf")
        try data.write(to: url, options: Data.WritingOptions([.atomic, .completeFileProtection]))
        return url
    }
}
