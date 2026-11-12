import SwiftUI

enum Brand {
    static let navy = Color(red: 13/255, green: 45/255, blue: 69/255)
    static let ivory = Color(red: 247/255, green: 243/255, blue: 235/255)
    static let stone = Color(red: 234/255, green: 228/255, blue: 216/255)
    static let gold = Color(red: 184/255, green: 142/255, blue: 80/255)
    static let ink = Color(red: 35/255, green: 57/255, blue: 70/255)
}
struct AcademyCard<Content: View>: View {
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 12) { content }
            .frame(maxWidth: .infinity, alignment: .leading).padding(18)
            .background(.white, in: RoundedRectangle(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(Brand.stone))
    }
}
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.font(.headline).frame(maxWidth: .infinity).padding(.vertical, 15)
            .foregroundStyle(.white).background(Brand.navy.opacity(configuration.isPressed ? 0.75 : 1), in: RoundedRectangle(cornerRadius: 12))
    }
}
struct StatusPill: View {
    @EnvironmentObject var store: AcademyStore
    let status: String
    var body: some View {
        Text(store.status(status)).font(.caption.weight(.semibold)).padding(.horizontal, 10).padding(.vertical, 6)
            .foregroundStyle(Brand.navy).background(Brand.stone, in: Capsule())
    }
}
struct EmptyMessage: View {
    let title: String
    let symbol: String
    var body: some View {
        ContentUnavailableView(title, systemImage: symbol).foregroundStyle(Brand.ink).padding(.vertical, 24)
    }
}
