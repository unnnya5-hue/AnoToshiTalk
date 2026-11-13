import Foundation
import Observation

enum AppScreen: Equatable {
    case loading, onboarding, home, setup(InputMode), session, result, favorites, settings, onlineRequired
}

@MainActor @Observable
final class AppModel {
    var screen: AppScreen = .loading
    var catalog: TopicCatalog?
    var session: TopicSession?
    var sessionTopics: [Topic] = []
    var errorMessage: String?
    var completedCount = 0
    var canRequestAds = false

    let connectivity = ConnectivityMonitor()
    let adConfiguration: AdConfiguration?
    private let repository: any TopicRepository
    private let selector = TopicSelectionService()
    private let permitStore = LocalPlayPermitStore()
    private let adService: any AdServing

    init(repository: any TopicRepository = BundledTopicRepository()) {
        self.repository = repository
        let configuration = try? AdConfiguration.bundled()
        adConfiguration = configuration
        adService = configuration.map { GoogleMobileAdsAdapter(configuration: $0) } ?? UnavailableAdService()
    }

    func launch(onboardingCompleted: Bool) async {
        do {
            catalog = try repository.load()
            guard connectivity.isOnline else { screen = .onlineRequired; return }
            canRequestAds = await AdMobBootstrap.prepareIfConfigured()
            screen = onboardingCompleted ? .home : .onboarding
        } catch {
            errorMessage = error.localizedDescription
            screen = .onlineRequired
        }
    }

    var availableYears: ClosedRange<Int> {
        let years = catalog?.topics.map(\.year) ?? [1960, 2026]
        return (years.min() ?? 1960)...(years.max() ?? 2026)
    }

    func candidateCount(for condition: SearchCondition) -> Int {
        selector.matching(catalog?.topics ?? [], condition: condition).count
    }

    func authorizeAndStart(condition: SearchCondition) async {
        guard connectivity.isOnline else { screen = .onlineRequired; return }
        guard canRequestAds else {
            errorMessage = "広告配信の同意状態を確認できません。時間をおいて再試行してください。"
            return
        }
        let adResult = await adService.showRewarded()
        guard adResult == .rewardCallbackReceived else {
            errorMessage = "広告の視聴完了を確認できませんでした。"
            return
        }
        beginSession(condition: condition)
    }

    private func beginSession(condition: SearchCondition) {
        let seed = UInt64.random(in: UInt64.min...UInt64.max)
        let topics = selector.select(from: catalog?.topics ?? [], condition: condition, seed: seed)
        guard !topics.isEmpty else { errorMessage = "この条件で表示できる話題がありません。"; return }
        let id = UUID()
        permitStore.issue(sessionID: id, topicCount: topics.count)
        sessionTopics = topics
        session = TopicSession(id: id, condition: condition, topicIDs: topics.map(\.id), currentIndex: 0, seed: seed, startedAt: .now, lastUpdatedAt: .now)
        screen = .session
    }

    func movePrevious() { guard var value = session, value.currentIndex > 0 else { return }; value.currentIndex -= 1; value.lastUpdatedAt = .now; session = value }

    func moveNext() {
        guard connectivity.isOnline else { screen = .onlineRequired; return }
        guard var value = session, permitStore.isValid(sessionID: value.id, topicCount: value.topicIDs.count) else {
            errorMessage = "プレイ許可を確認できません。新しいセットを開始してください。"; screen = .setup(.age); return
        }
        if value.currentIndex + 1 >= value.topicIDs.count {
            completedCount = value.topicIDs.count; permitStore.revoke(); screen = .result
        } else { value.currentIndex += 1; value.lastUpdatedAt = .now; session = value }
    }

    func endSession() { permitStore.revoke(); session = nil; sessionTopics = []; screen = .home }
    func goHome() { screen = .home }
}

