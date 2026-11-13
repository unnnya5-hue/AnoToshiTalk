import Foundation

struct AdConfiguration: Sendable {
    let bannerUnitID: String
    let interstitialUnitID: String
    let rewardedUnitID: String
    let rewardedInterstitialUnitID: String
    let appOpenUnitID: String

    static func bundled(_ bundle: Bundle = .main) throws -> Self {
        func value(_ key: String) throws -> String {
            guard let result = bundle.object(forInfoDictionaryKey: key) as? String,
                  result.hasPrefix("ca-app-pub-") else { throw AdConfigurationError.missing(key) }
            return result
        }
        return try Self(
            bannerUnitID: value("AdMobBannerUnitID"),
            interstitialUnitID: value("AdMobInterstitialUnitID"),
            rewardedUnitID: value("AdMobRewardedUnitID"),
            rewardedInterstitialUnitID: value("AdMobRewardedInterstitialUnitID"),
            appOpenUnitID: value("AdMobAppOpenUnitID")
        )
    }
}

enum AdConfigurationError: Error { case missing(String) }

