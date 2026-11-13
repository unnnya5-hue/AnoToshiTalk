import SwiftData
import SwiftUI

struct TopicSessionView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.modelContext) private var modelContext
    @Environment(\.openURL) private var openURL
    @Query private var favorites: [FavoriteRecord]
    @State private var confirmExit = false

    private var index: Int { model.session?.currentIndex ?? 0 }
    private var topic: Topic? { model.sessionTopics.indices.contains(index) ? model.sessionTopics[index] : nil }
    private var isFavorite: Bool { topic.map { value in favorites.contains { $0.topicID == value.id } } ?? false }

    var body: some View {
        NavigationStack {
            if let topic, let session = model.session {
                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        if model.canRequestAds, let unitID = model.adConfiguration?.bannerUnitID { AdBannerView(unitID: unitID) }
                        HStack {
                            Text(verbatim: "\(topic.year)年").font(.title2.bold()).foregroundStyle(.tint)
                            if let age = AgeRangeCalculator.estimatedAge(topicYear: topic.year, condition: session.condition) {
                                Text("当時 約\(age)歳").padding(.horizontal, 10).padding(.vertical, 5).background(.thinMaterial, in: Capsule())
                            }
                        }
                        Image(topic.imageAsset ?? "category_\(topic.category.rawValue)")
                            .resizable()
                            .scaledToFill()
                            .frame(height: 220)
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                            .overlay(alignment: .topTrailing) {
                                Label(topic.category.title, systemImage: topic.category.symbol)
                                    .font(.caption.bold())
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(.ultraThinMaterial, in: Capsule())
                                    .padding(10)
                            }
                            .accessibilityLabel("\(topic.category.title)のイラスト")
                        Text(topic.title).font(.title.bold())
                        Text(topic.shortDescription).font(.body)
                        VStack(alignment: .leading, spacing: 8) {
                            Label("会話のきっかけ", systemImage: "bubble.left.and.bubble.right").font(.headline)
                            Text(topic.conversationPrompt)
                        }.padding().frame(maxWidth: .infinity, alignment: .leading).background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))
                        let externalLink = TopicExternalLinkResolver.resolve(topic)
                        VStack(alignment: .leading, spacing: 4) {
                            Button { openURL(externalLink.url) } label: {
                                Label(externalLink.title, systemImage: "arrow.up.right.square")
                            }
                            if let caption = externalLink.sourceCaption {
                                Text("出典: \(caption)").font(.caption).foregroundStyle(.secondary)
                            }
                        }
                        HStack {
                            Button("前の話題") { model.movePrevious() }.buttonStyle(.bordered).disabled(index == 0)
                            Spacer()
                            Button(index == model.sessionTopics.count - 1 ? "セットを終える" : "次の話題") { model.moveNext() }.buttonStyle(.borderedProminent)
                        }.controlSize(.large)
                        if model.canRequestAds, let unitID = model.adConfiguration?.bannerUnitID { AdBannerView(unitID: unitID) }
                    }.padding()
                }
                .navigationTitle("\(index + 1) / \(model.sessionTopics.count)")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarLeading) { Button("終了") { confirmExit = true } }
                    ToolbarItem(placement: .topBarTrailing) {
                        Button { toggleFavorite(topic) } label: { Image(systemName: isFavorite ? "star.fill" : "star") }
                            .accessibilityLabel(isFavorite ? "お気に入りから削除" : "お気に入りに追加")
                    }
                }
                .confirmationDialog("このセットを終了しますか？", isPresented: $confirmExit) {
                    Button("終了する", role: .destructive) { model.endSession() }
                    Button("続ける", role: .cancel) {}
                }
            } else { ContentUnavailableView("セッションがありません", systemImage: "rectangle.stack.badge.minus") }
        }
    }

    private func toggleFavorite(_ topic: Topic) {
        if let record = favorites.first(where: { $0.topicID == topic.id }) { modelContext.delete(record) }
        else if favorites.count >= 20 { model.errorMessage = "無料版のお気に入りは20件までです。" }
        else { modelContext.insert(FavoriteRecord(topicID: topic.id)) }
        do { try modelContext.save() } catch { model.errorMessage = "お気に入りを保存できませんでした。" }
    }

}

struct SessionResultView: View {
    @Environment(AppModel.self) private var model
    @Query private var favorites: [FavoriteRecord]
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "party.popper.fill").font(.system(size: 64)).foregroundStyle(.tint).accessibilityHidden(true)
            Text("\(model.completedCount)件の話題を見ました").font(.title.bold())
            Label("\(favorites.count)件をお気に入り", systemImage: "star.fill")
            Button("次の人へ") { model.session = nil; model.screen = .setup(.age) }.primaryButton()
            Button("もう一度見る") { model.screen = .setup(modeForSession) }.buttonStyle(.bordered)
            Button("ホームへ") { model.endSession() }
        }.padding(24)
    }

    private var modeForSession: InputMode {
        guard let input = model.session?.condition.input else { return .age }
        switch input { case .age: return .age; case .year: return .year; case .decade: return .decade }
    }
}

