import Foundation

struct LocalPlayPermit: Sendable {
    let sessionID: UUID
    let topicCount: Int
    let issuedAt: ContinuousClock.Instant
}

@MainActor
final class LocalPlayPermitStore {
    private var permit: LocalPlayPermit?
    func issue(sessionID: UUID, topicCount: Int) { permit = .init(sessionID: sessionID, topicCount: topicCount, issuedAt: .now) }
    func isValid(sessionID: UUID, topicCount: Int) -> Bool { permit?.sessionID == sessionID && permit?.topicCount == topicCount }
    func revoke() { permit = nil }
}

enum RewardedClientResult: Equatable, Sendable { case rewardCallbackReceived, cancelled, loadFailed, showFailed }
@MainActor
protocol AdServing { func showRewarded() async -> RewardedClientResult }

struct UnavailableAdService: AdServing {
    func showRewarded() async -> RewardedClientResult { .loadFailed }
}

