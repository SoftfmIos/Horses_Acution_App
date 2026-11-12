import Foundation

struct AppConfiguration {
    let apiOrigin: URL
    let websiteOrigin: URL
    static let current = AppConfiguration(
        apiOrigin: URL(string: Bundle.main.object(forInfoDictionaryKey: "AcademyAPIOrigin") as? String ?? "https://riyadhpolo.softfm.com")!,
        websiteOrigin: URL(string: Bundle.main.object(forInfoDictionaryKey: "AcademyWebsiteOrigin") as? String ?? "https://horsesacutionapp.vercel.app")!
    )
}

enum AcademyDates {
    static let zone = TimeZone(identifier: "Asia/Riyadh")!
    static func parse(_ value: String) -> Date? {
        let fractional = ISO8601DateFormatter()
        fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
            ?? dateOnly.date(from: value)
    }
    private static var dateOnly: DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = zone
        return formatter
    }
    static func display(_ value: String?, arabic: Bool) -> String {
        guard let value, let date = parse(value) else { return "—" }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: arabic ? "ar_SA" : "en_SA")
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.timeZone = zone
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    static func month(_ value: String) -> String {
        guard let date = parse(value) else { return "" }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = zone
        formatter.dateFormat = "yyyy-MM"
        return formatter.string(from: date)
    }
}
