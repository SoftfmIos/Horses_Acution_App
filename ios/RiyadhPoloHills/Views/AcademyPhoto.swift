import SwiftUI

struct AcademyPhoto: View {
    @EnvironmentObject var store: AcademyStore
    let kind: String
    let id: String
    var symbol = "figure.equestrian.sports"
    var size: CGFloat = 56
    @State private var image: UIImage?
    @State private var loading = false
    private var scope: String { (store.account?.id ?? "") + "|" + (store.stable?.id ?? "") + "|" + kind + "|" + id + "|" + store.dataRevision.uuidString }
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: min(18, size / 4)).fill(Brand.stone)
            if let image { Image(uiImage: image).resizable().scaledToFill() }
            else if loading { ProgressView() }
            else { Image(systemName: symbol).font(.system(size: min(36, size / 2.4))).foregroundStyle(Brand.navy) }
        }.frame(width: size, height: size).clipShape(RoundedRectangle(cornerRadius: min(18, size / 4)))
            .accessibilityHidden(true)
            .task(id: scope) { await load() }
    }
    private func load() async {
        image = nil
        guard !id.isEmpty, let stableID = store.stable?.id else { return }
        let key = scope
        loading = true
        defer { if key == scope { loading = false } }
        do {
            let photo: ProfilePhotoData = try await store.api.send("photos/\(kind)/\(id)", stableID: stableID)
            guard key == scope, !Task.isCancelled else { return }
            if let content = photo.content, let bytes = Data(base64Encoded: content) { image = UIImage(data: bytes) }
        } catch APIError.unauthorized {
            if key == scope { store.clear(); store.error = APIError.unauthorized.localizedDescription }
        } catch { }
    }
}
struct InstructorBadge: View {
    @EnvironmentObject var store: AcademyStore
    let session: RidingSession
    var body: some View {
        HStack(spacing: 12) {
            if let instructor = store.instructor(for: session) {
                AcademyPhoto(kind: "instructors", id: instructor.id, symbol: "person.fill", size: 42)
                VStack(alignment: .leading, spacing: 3) { Text(store.text("Instructor", "المدرب")).font(.caption).foregroundStyle(.secondary); Text(instructor.display(store.arabic)).font(.subheadline) }
            } else { Label(session.instructor, systemImage: "person.crop.circle") }
        }
    }
}
