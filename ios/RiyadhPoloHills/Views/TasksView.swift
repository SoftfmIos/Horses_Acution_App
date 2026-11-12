import SwiftUI

struct TasksView: View {
    @EnvironmentObject var store: AcademyStore
    @State private var showCompleted = false
    @State private var onlyMine = true
    @State private var search = ""
    @State private var selected: CareTask?
    var tasks: [CareTask] {
        store.data.tasks.filter { task in
            task.cancelled != true && (showCompleted || !task.done) && (!onlyMine || task.assigneeId == store.account?.id)
            && (search.isEmpty || task.title.localizedCaseInsensitiveContains(search))
        }.sorted { $0.dueAt < $1.dueAt }
    }
    var body: some View {
        List {
            Section {
                Toggle(store.text("Assigned to me", "المسندة إليّ"), isOn: $onlyMine)
                Toggle(store.text("Include completed", "عرض المنجزة أيضاً"), isOn: $showCompleted)
            }
            if tasks.isEmpty { EmptyMessage(title: store.text("No matching tasks", "لا توجد مهام مطابقة"), symbol: "checkmark.circle") }
            ForEach(tasks) { task in
                Button { selected = task } label: {
                    HStack(spacing: 12) {
                        Image(systemName: task.done ? "checkmark.circle.fill" : "circle").font(.title2).foregroundStyle(task.done ? Brand.gold : Brand.navy)
                        VStack(alignment: .leading, spacing: 5) {
                            Text(task.title).font(.headline)
                            Text(store.date(task.dueAt)).font(.caption).foregroundStyle(.secondary)
                            if let id = task.assigneeId { Text(store.memberName(id)).font(.caption) }
                        }
                    }.padding(.vertical, 6)
                }.buttonStyle(.plain)
            }
        }.scrollContentBackground(.hidden).background(Brand.ivory).navigationTitle(store.text("Staff tasks", "مهام الموظفين"))
            .searchable(text: $search, prompt: store.text("Search tasks", "البحث عن المهام"))
            .refreshable { await store.reload() }
            .sheet(item: $selected) { task in NavigationStack { TaskDetailView(task: task) } }
    }
}
struct TaskDetailView: View {
    @EnvironmentObject var store: AcademyStore
    @Environment(\.dismiss) private var dismiss
    let task: CareTask
    var current: CareTask { store.data.tasks.first { $0.id == task.id } ?? task }
    var body: some View {
        Form {
            Section {
                Text(current.title).font(.headline)
                LabeledContent(store.text("Scheduled (Riyadh)", "الموعد (الرياض)"), value: store.date(current.dueAt))
                LabeledContent(store.text("Assigned to", "المسؤول"), value: store.memberName(current.assigneeId ?? ""))
                if let notes = current.notes?.nonempty { Text(notes) }
                if current.done { LabeledContent(store.text("Completed", "تم الإنجاز"), value: store.date(current.completedAt)) }
            }
            Section {
                Button(current.done ? store.text("Reopen task", "إعادة فتح المهمة") : store.text("Mark completed", "تحديد كمنجزة")) {
                    Task { await store.perform { try await store.mutate("tasks/\(task.id)/toggle", body: ["done": !current.done]); dismiss() } }
                }.disabled(store.busy || !store.canComplete(current))
                if !store.canComplete(current) { Text(store.text("Your permissions or the historical-task policy prevent changes to this task.", "تمنع صلاحياتك أو سياسة المهام القديمة تعديل هذه المهمة.")).font(.footnote) }
            }
        }.navigationTitle(store.text("Task details", "تفاصيل المهمة"))
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button(store.text("Close", "إغلاق")) { dismiss() } } }
    }
}
