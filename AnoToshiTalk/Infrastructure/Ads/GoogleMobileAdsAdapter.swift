import GoogleMobileAds
import UIKit

@MainActor
final class GoogleMobileAdsAdapter: NSObject, AdServing, FullScreenContentDelegate {
    private let configuration: AdConfiguration
    private var rewardedAd: RewardedAd?
    private var continuation: CheckedContinuation<RewardedClientResult, Never>?
    private var rewardReceived = false

    init(configuration: AdConfiguration) { self.configuration = configuration }

    func preloadRewarded() async throws {
        let ad = try await RewardedAd.load(with: configuration.rewardedUnitID, request: Request())
        ad.fullScreenContentDelegate = self
        rewardedAd = ad
    }

    func showRewarded() async -> RewardedClientResult {
        do {
            if rewardedAd == nil { try await preloadRewarded() }
            guard let ad = rewardedAd else { return .loadFailed }
            try ad.canPresent(from: nil)
            rewardReceived = false
            return await withCheckedContinuation { continuation in
                self.continuation = continuation
                ad.present(from: nil) { [weak self] in self?.rewardReceived = true }
            }
        } catch {
            rewardedAd = nil
            return .loadFailed
        }
    }

    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        rewardedAd = nil
        finish(rewardReceived ? .rewardCallbackReceived : .cancelled)
    }

    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        rewardedAd = nil
        finish(.showFailed)
    }

    private func finish(_ result: RewardedClientResult) {
        continuation?.resume(returning: result)
        continuation = nil
    }
}

