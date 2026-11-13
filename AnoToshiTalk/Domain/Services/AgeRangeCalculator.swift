import Foundation

enum AgeRangeCalculator {
    static func estimatedBirthYear(age: Int, referenceYear: Int) -> Int { referenceYear - age }

    static func candidateYears(age: Int, referenceYear: Int, stages: Set<LifeStage>) -> Set<Int> {
        let birthYear = estimatedBirthYear(age: age, referenceYear: referenceYear)
        return Set(stages.flatMap { $0.ages.map { birthYear + $0 } })
    }

    static func estimatedAge(topicYear: Int, condition: SearchCondition) -> Int? {
        guard case let .age(age, referenceYear) = condition.input else { return nil }
        let result = topicYear - estimatedBirthYear(age: age, referenceYear: referenceYear)
        return (0...100).contains(result) ? result : nil
    }
}

