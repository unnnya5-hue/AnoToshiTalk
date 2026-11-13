import SwiftData
import SwiftUI

struct FavoritesView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \FavoriteRecord.createdAt, order: .reverse) private var favorites: [FavoriteRecord]

    var body: some View {
        NavigationStack {
            Group {
                if visibleFavorites.isEmpty {
                    ContentUnavailableView("お気に入りはまだありません", systemImage: "star", description: Text("カードの☆から追加できます。"))
                } else {
                    List {
                        ForEach(visibleFavorites, id: \.record.topicID) { item in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(verbatim: "\(item.topic.year)年・\(item.topic.category.title)").font(.caption).foregroundStyle(.secondary)
                                Text(item.topic.title).font(.headline)
                                Text(item.topic.conversationPrompt).font(.subheadline).lineLimit(2)
                            }.padding(.vertical, 4)
                        }.onDelete(perform: delete)
                    }
                }
            }
            .navigationTitle("お気に入り")
            .toolbar { ToolbarItem(placement: .topBarLeading) { Button("戻る") { model.goHome() } }; ToolbarItem(placement: .topBarTrailing) { EditButton() } }
        }
    }

    private var visibleFavorites: [(record: FavoriteRecord, topic: Topic)] {
        let byID = Dictionary(uniqueKeysWithValues: (model.catalog?.topics ?? []).map { ($0.id, $0) })
        return favorites.compactMap { record in byID[record.topicID].map { (record, $0) } }
    }

    private func delete(at offsets: IndexSet) {
        for index in offsets { modelContext.delete(visibleFavorites[index].record) }
        try? modelContext.save()
    }
}

