import Foundation

enum TopicCategory: String, Codable, CaseIterable, Hashable, Sendable, Identifiable {
    case music, screen, gamesToys, lifestyle, sports, news, schoolCulture

    var id: Self { self }
    var title: String {
        switch self {
        case .music: "音楽"
        case .screen: "テレビ・映画・アニメ"
        case .gamesToys: "ゲーム・おもちゃ"
        case .lifestyle: "商品・食べ物・暮らし"
        case .sports: "スポーツ"
        case .news: "ニュース・技術"
        case .schoolCulture: "学校・流行"
        }
    }
    var symbol: String {
        switch self {
        case .music: "music.note"
        case .screen: "tv"
        case .gamesToys: "gamecontroller"
        case .lifestyle: "cup.and.saucer"
        case .sports: "sportscourt"
        case .news: "newspaper"
        case .schoolCulture: "graduationcap"
        }
    }
}

enum GenderChoice: String, Codable, CaseIterable, Hashable, Sendable, Identifiable {
    case male, female, unspecified
    var id: Self { self }
    var title: String { self == .male ? "男性" : self == .female ? "女性" : "回答しない" }
}

enum GenderAffinity: String, Codable, Sendable { case all, maleLeaning, femaleLeaning }
enum InputMode: String, Codable, CaseIterable, Hashable, Sendable, Identifiable {
    case age, year, decade
    var id: Self { self }
    var title: String { self == .age ? "年齢" : self == .year ? "年" : "年代" }
}
enum LifeStage: String, Codable, CaseIterable, Hashable, Sendable, Identifiable {
    case teens, studentAge, earlyCareer
    var id: Self { self }
    var title: String {
        switch self { case .teens: "中高生の頃"; case .studentAge: "学生の頃"; case .earlyCareer: "社会人1〜5年目頃" }
    }
    var ages: ClosedRange<Int> {
        switch self { case .teens: 13...18; case .studentAge: 19...22; case .earlyCareer: 23...27 }
    }
}

struct AgeRange: Codable, Equatable, Hashable, Sendable { let min: Int; let max: Int }

struct DateOnly: Codable, Equatable, Hashable, Sendable {
    let year: Int
    let month: Int
    let day: Int

    init(from decoder: Decoder) throws {
        let value = try decoder.singleValueContainer().decode(String.self)
        let parts = value.split(separator: "-").compactMap { Int($0) }
        guard parts.count == 3,
              (1...12).contains(parts[1]), (1...31).contains(parts[2]),
              String(format: "%04d-%02d-%02d", parts[0], parts[1], parts[2]) == value else {
            throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "日付はYYYY-MM-DD形式である必要があります"))
        }
        year = parts[0]; month = parts[1]; day = parts[2]
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(String(format: "%04d-%02d-%02d", year, month, day))
    }
}

struct Topic: Codable, Identifiable, Hashable, Sendable {
    let id: String
    let title: String
    let shortDescription: String
    let conversationPrompt: String
    let year: Int
    let startYear: Int?
    let endYear: Int?
    let category: TopicCategory
    let genderAffinity: GenderAffinity
    let ageAffinity: AgeRange?
    let imageAsset: String?
    let sourceName: String
    let sourceURL: URL
    let linkCheckedAt: DateOnly
    let tags: [String]
    let isActive: Bool
    let version: Int
}

struct TopicCatalog: Codable, Sendable {
    let schemaVersion: Int
    let contentVersion: String
    let generatedAt: Date
    let topics: [Topic]
}

enum EraInput: Codable, Equatable, Hashable, Sendable {
    case year(Int)
    case decade(Int)
    case age(Int, referenceYear: Int)
}

struct SearchCondition: Codable, Equatable, Hashable, Sendable {
    var input: EraInput
    var gender: GenderChoice
    var selectedCategories: Set<TopicCategory>
    var lifeStages: Set<LifeStage>
}

struct TopicSession: Codable, Identifiable, Sendable {
    let id: UUID
    let condition: SearchCondition
    let topicIDs: [String]
    var currentIndex: Int
    let seed: UInt64
    let startedAt: Date
    var lastUpdatedAt: Date
}

