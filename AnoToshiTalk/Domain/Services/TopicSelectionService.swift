import CryptoKit
import Foundation

struct TopicSelectionService: Sendable {
    func matching(_ topics: [Topic], condition: SearchCondition) -> [Topic] {
        let years: Set<Int>
        switch condition.input {
        case let .year(year): years = [year]
        case let .decade(decade): years = Set(decade...(decade + 9))
        case let .age(age, referenceYear):
            years = AgeRangeCalculator.candidateYears(age: age, referenceYear: referenceYear, stages: condition.lifeStages)
        }
        return topics.filter { $0.isActive && condition.selectedCategories.contains($0.category) && years.contains($0.year) }
    }

    func select(from topics: [Topic], condition: SearchCondition, seed: UInt64) -> [Topic] {
        let candidates = matching(topics, condition: condition)
        switch condition.input {
        case .year: return selectYear(candidates, condition: condition, seed: seed)
        case .decade, .age: return selectBalanced(candidates, condition: condition, seed: seed)
        }
    }

    private func selectYear(_ topics: [Topic], condition: SearchCondition, seed: UInt64) -> [Topic] {
        var picked: [Topic] = []
        for category in TopicCategory.allCases where condition.selectedCategories.contains(category) {
            if let first = sorted(topics.filter { $0.category == category }, condition: condition, seed: seed).first { picked.append(first) }
        }
        if picked.count < 7 {
            let ids = Set(picked.map(\.id))
            picked += sorted(topics.filter { !ids.contains($0.id) }, condition: condition, seed: seed).prefix(7 - picked.count)
        }
        return Array(picked.prefix(7))
    }

    private func selectBalanced(_ topics: [Topic], condition: SearchCondition, seed: UInt64) -> [Topic] {
        let categories = condition.selectedCategories.sorted { stableHash(seed, $0.rawValue) < stableHash(seed, $1.rawValue) }
        var remaining = topics
        var result: [Topic] = []
        var yearCounts: [Int: Int] = [:]
        while result.count < 15 && !remaining.isEmpty {
            var added = false
            for category in categories where result.count < 15 {
                let pool = remaining.filter { $0.category == category }
                guard !pool.isEmpty else { continue }
                let choice = pool.sorted {
                    let lhsCount = yearCounts[$0.year, default: 0], rhsCount = yearCounts[$1.year, default: 0]
                    if lhsCount != rhsCount { return lhsCount < rhsCount }
                    return compare($0, $1, condition: condition, seed: seed)
                }[0]
                result.append(choice)
                yearCounts[choice.year, default: 0] += 1
                remaining.removeAll { $0.id == choice.id }
                added = true
            }
            if !added { break }
        }
        return result
    }

    private func sorted(_ topics: [Topic], condition: SearchCondition, seed: UInt64) -> [Topic] {
        topics.sorted { compare($0, $1, condition: condition, seed: seed) }
    }

    private func compare(_ lhs: Topic, _ rhs: Topic, condition: SearchCondition, seed: UInt64) -> Bool {
        let left = score(lhs, condition: condition), right = score(rhs, condition: condition)
        return left == right ? stableHash(seed, lhs.id) < stableHash(seed, rhs.id) : left > right
    }

    private func score(_ topic: Topic, condition: SearchCondition) -> Int {
        let genderScore: Int
        if condition.gender == .unspecified || topic.genderAffinity == .all { genderScore = 100 }
        else if (condition.gender == .male && topic.genderAffinity == .maleLeaning) ||
                    (condition.gender == .female && topic.genderAffinity == .femaleLeaning) { genderScore = 120 }
        else { genderScore = 80 }
        guard let affinity = topic.ageAffinity else { return genderScore + 5 }
        guard let age = AgeRangeCalculator.estimatedAge(topicYear: topic.year, condition: condition) else { return genderScore }
        return genderScore + ((affinity.min...affinity.max).contains(age) ? 10 : 0)
    }

    private func stableHash(_ seed: UInt64, _ value: String) -> UInt64 {
        let digest = SHA256.hash(data: Data("\(seed):\(value)".utf8))
        return digest.prefix(8).reduce(0) { ($0 << 8) | UInt64($1) }
    }
}

