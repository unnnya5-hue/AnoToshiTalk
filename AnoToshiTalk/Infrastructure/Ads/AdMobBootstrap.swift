import Foundation
import GoogleMobileAds
import UserMessagingPlatform

@MainActor
enum AdMobBootstrap {
    static func prepareIfConfigured(bundle: Bundle = .main) async -> Bool {
        guard let appID = bundle.object(forInfoDictionaryKey: "GADApplicationIdentifier") as? String,
              appID.hasPrefix("ca-app-pub-"), appID.contains("~") else {
            assertionFailure("GADApplicationIdentifier is missing or invalid")
            return false
        }
        do {
            try await ConsentInformation.shared.requestConsentInfoUpdate(with: nil)
            try await ConsentForm.loadAndPresentIfRequired(from: nil)
        } catch {
            // A previous session's valid consent may still permit requests.
        }
        guard ConsentInformation.shared.canRequestAds else { return false }
        await MobileAds.shared.start()
        return true
    }
}
