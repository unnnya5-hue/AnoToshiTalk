import Foundation
import Testing
@testable import AnoToshiTalk

struct TopicSelectionServiceTests {
    private func topic(_ id: String, year: Int, category: TopicCategory) -> Topic {
        Topic(id: id, title: id, shortDescription: "説明", conversationPrompt: "問い", year: year, startYear: nil, endYear: nil, category: category, genderAffinity: .all, ageAffinity: nil, imageAsset: nil, sourceName: "Source", sourceURL: URL(string: "https://example.org")!, linkCheckedAt: try! JSONDecoder().decode(DateOnly.self, from: Data("\"2026-11-01\"".utf8)), tags: [], isActive: true, version: 1)
    }

    @Test func yearSelectsEveryCategoryWithoutDuplicates() {
        let topics = TopicCategory.allCases.enumerated().map { topic("topic-\($0.offset)", year: 2000, category: $0.element) }
        let condition = SearchCondition(input: .year(2000), gender: .unspecified, selectedCategories: Set(TopicCategory.allCases), lifeStages: [])
        let result = TopicSelectionService().select(from: topics, condition: condition, seed: 42)
        #expect(result.count == 7)
        #expect(Set(result.map(\.id)).count == 7)
        #expect(Set(result.map(\.category)) == Set(TopicCategory.allCases))
    }

    @Test func selectionIsStableForSameSeed() {
        let topics = (2000...2004).flatMap { year in TopicCategory.allCases.map { topic("\(year)-\($0.rawValue)", year: year, category: $0) } }
        let condition = SearchCondition(input: .decade(2000), gender: .unspecified, selectedCategories: Set(TopicCategory.allCases), lifeStages: [])
        let service = TopicSelectionService()
        #expect(service.select(from: topics, condition: condition, seed: 123).map(\.id) == service.select(from: topics, condition: condition, seed: 123).map(\.id))
        #expect(Set(service.select(from: topics, condition: condition, seed: 123).map(\.id)).count == 15)
    }
}

