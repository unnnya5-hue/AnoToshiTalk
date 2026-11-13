import Foundation
import Testing
@testable import AnoToshiTalk

struct BundledContentTests {
    @Test func bundledCatalogMeetsRuntimeContract() throws {
        let catalog = try BundledTopicRepository().load()
        #expect(catalog.schemaVersion == 1)
        #expect(catalog.topics.count == 469)
        #expect(Set(catalog.topics.map(\.id)).count == catalog.topics.count)
        #expect(catalog.topics.allSatisfy { $0.sourceURL.scheme == "https" })
    }

    @Test func everyPublishedYearHasAllCategories() throws {
        let topics = try BundledTopicRepository().load().topics.filter(\.isActive)
        let grouped = Dictionary(grouping: topics, by: \.year)
        #expect(!grouped.isEmpty)
        for (_, yearlyTopics) in grouped {
            #expect(Set(yearlyTopics.map(\.category)) == Set(TopicCategory.allCases))
        }
    }

    @Test func debugAdConfigurationUsesGoogleDemoUnits() throws {
        let configuration = try AdConfiguration.bundled()
        #expect(configuration.bannerUnitID == "ca-app-pub-3940256099942544/2934735716")
        #expect(configuration.rewardedUnitID == "ca-app-pub-3940256099942544/1712485313")
    }
}
