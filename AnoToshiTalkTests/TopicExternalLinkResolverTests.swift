import Foundation
import Testing
@testable import AnoToshiTalk

struct TopicExternalLinkResolverTests {
    private func topic(url: String, source: String) -> Topic {
        Topic(
            id: "test-topic", title: "思い出の話題", shortDescription: "説明", conversationPrompt: "問い",
            year: 1990, startYear: nil, endYear: nil, category: .schoolCulture,
            genderAffinity: .all, ageAffinity: nil, imageAsset: nil,
            sourceName: source, sourceURL: URL(string: url)!,
            linkCheckedAt: try! JSONDecoder().decode(DateOnly.self, from: Data("\"2026-11-01\"".utf8)),
            tags: [], isActive: true, version: 1
        )
    }

    @Test func wikipediaYearPageBecomesTopicSpecificSearch() {
        let link = TopicExternalLinkResolver.resolve(topic(url: "https://ja.wikipedia.org/wiki/1990年", source: "Wikipedia日本語版"))
        #expect(link.url.host == "www.google.com")
        #expect(link.title == "この話題を検索")
        #expect(link.sourceCaption == nil)
        #expect(link.url.absoluteString.contains("%E6%80%9D%E3%81%84%E5%87%BA"))
    }

    @Test func directSourceIsPreserved() {
        let link = TopicExternalLinkResolver.resolve(topic(url: "https://www.example.org/topic", source: "公式サイト"))
        #expect(link.url == URL(string: "https://www.example.org/topic"))
        #expect(link.title == "参考ページを見る")
        #expect(link.sourceCaption == "公式サイト")
    }
}
