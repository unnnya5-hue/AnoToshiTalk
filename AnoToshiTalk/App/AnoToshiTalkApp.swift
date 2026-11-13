import SwiftData
import SwiftUI

@main
struct AnoToshiTalkApp: App {
    @State private var model = AppModel()

    var body: some Scene {
        WindowGroup { RootView().environment(model) }
            .modelContainer(for: FavoriteRecord.self)
    }
}

struct RootView: View {
    @Environment(AppModel.self) private var model
    @AppStorage("onboardingCompleted") private var onboardingCompleted = false

    var body: some View {
        Group {
            switch model.screen {
            case .loading: LaunchView()
            case .onboarding: OnboardingView { onboardingCompleted = true; model.screen = .home }
            case .home: HomeView()
            case let .setup(mode): EraSetupView(initialMode: mode)
            case .session: TopicSessionView()
            case .result: SessionResultView()
            case .favorites: FavoritesView()
            case .settings: SettingsView()
            case .onlineRequired: OnlineRequiredView()
            }
        }
        .task { if model.screen == .loading { await model.launch(onboardingCompleted: onboardingCompleted) } }
        .alert("お知らせ", isPresented: Binding(get: { model.errorMessage != nil }, set: { if !$0 { model.errorMessage = nil } })) {
            Button("閉じる") { model.errorMessage = nil }
        } message: { Text(model.errorMessage ?? "") }
    }
}

private struct LaunchView: View {
    var body: some View {
        VStack(spacing: 16) { Image(systemName: "clock.arrow.circlepath").font(.system(size: 64)).foregroundStyle(.tint); Text("あの年トーク").font(.largeTitle.bold()); ProgressView() }
            .accessibilityElement(children: .combine)
    }
}

private struct OnlineRequiredView: View {
    @Environment(AppModel.self) private var model
    var body: some View {
        ContentUnavailableView {
            Label("インターネット接続が必要です", systemImage: "wifi.exclamationmark")
        } description: { Text(model.errorMessage ?? "広告視聴またはPremium確認に通信を使用します。") }
        actions: {
            Button("再試行") { Task { model.errorMessage = nil; await model.launch(onboardingCompleted: true) } }.buttonStyle(.borderedProminent)
            Button("ホームへ") { model.goHome() }.buttonStyle(.bordered)
        }
    }
}

