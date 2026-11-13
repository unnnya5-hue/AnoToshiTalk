import SwiftData
import SwiftUI

struct SettingsView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.modelContext) private var modelContext
    @AppStorage("soundEnabled") private var soundEnabled = false
    @AppStorage("hapticsEnabled") private var hapticsEnabled = true
    @Query private var favorites: [FavoriteRecord]
    @State private var confirmDelete = false

    var body: some View {
        NavigationStack {
            Form {
                Section("体験") { Toggle("効果音", isOn: $soundEnabled); Toggle("触覚", isOn: $hapticsEnabled); Label("Premium / 広告を消す（準備中）", systemImage: "crown") }
                Section("データ") {
                    Button("進行中のセットをリセット", role: .destructive) { model.session = nil; model.sessionTopics = [] }
                    Button("お気に入りをすべて削除", role: .destructive) { confirmDelete = true }
                }
                Section("サポート・法的情報") {
                    Link("プライバシーポリシー", destination: Self.privacyURL)
                    Link("利用規約", destination: Self.termsURL)
                    Link("サポート・広告を報告", destination: Self.supportURL)
                }
                Section { LabeledContent("App", value: "0.1.0 (1)"); LabeledContent("Content", value: model.catalog?.contentVersion ?? "-") }
            }
            .navigationTitle("設定")
            .toolbar { ToolbarItem(placement: .topBarLeading) { Button("戻る") { model.goHome() } } }
            .confirmationDialog("お気に入りをすべて削除しますか？", isPresented: $confirmDelete) {
                Button("削除する", role: .destructive) { favorites.forEach(modelContext.delete); try? modelContext.save() }
                Button("キャンセル", role: .cancel) {}
            }
        }
    }

    private static let privacyURL = URL(string: "https://unnnya5-hue.github.io/AnoToshiTalk/privacy/")!
    private static let termsURL = URL(string: "https://unnnya5-hue.github.io/AnoToshiTalk/terms/")!
    private static let supportURL = URL(string: "https://unnnya5-hue.github.io/AnoToshiTalk/support/")!
}

