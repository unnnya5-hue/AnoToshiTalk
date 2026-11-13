import Testing
@testable import AnoToshiTalk

struct AgeRangeCalculatorTests {
    @Test func allLifeStagesProduceExpectedYears() {
        let years = AgeRangeCalculator.candidateYears(age: 35, referenceYear: 2026, stages: Set(LifeStage.allCases))
        #expect(years.min() == 2004)
        #expect(years.max() == 2018)
        #expect(years.count == 15)
    }

    @Test func estimatedAgeOnlyExistsForAgeInput() {
        let ageCondition = SearchCondition(input: .age(35, referenceYear: 2026), gender: .unspecified, selectedCategories: Set(TopicCategory.allCases), lifeStages: Set(LifeStage.allCases))
        #expect(AgeRangeCalculator.estimatedAge(topicYear: 2007, condition: ageCondition) == 16)
        let yearCondition = SearchCondition(input: .year(2007), gender: .unspecified, selectedCategories: Set(TopicCategory.allCases), lifeStages: [])
        #expect(AgeRangeCalculator.estimatedAge(topicYear: 2007, condition: yearCondition) == nil)
    }
}

