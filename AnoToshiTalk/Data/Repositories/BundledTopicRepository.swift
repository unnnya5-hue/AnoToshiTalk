import Foundation

enum ContentError: LocalizedError {
    case missingResource, unsupportedSchema, duplicateID, invalidURL, empty
    var errorDescription: String? {
        switch self {
        case .missingResource: "話題データが見つかりません。"
        case .unsupportedSchema: "話題データの形式に対応していません。"
        case .duplicateID: "話題データに重複があります。"
        case .invalidURL: "安全でない外部リンクが含まれています。"
        case .empty: "利用できる話題がありません。"
        }
    }
}

protocol TopicRepository: Sendable { func load() throws -> TopicCatalog }

struct BundledTopicRepository: TopicRepository {
    var bundle: Bundle = .main

    func load() throws -> TopicCatalog {
        guard let url = bundle.url(forResource: "topics-v1", withExtension: "json") else { throw ContentError.missingResource }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let catalog = try decoder.decode(TopicCatalog.self, from: Data(contentsOf: url))
        guard catalog.schemaVersion == 1 else { throw ContentError.unsupportedSchema }
        guard !catalog.topics.isEmpty else { throw ContentError.empty }
        guard Set(catalog.topics.map(\.id)).count == catalog.topics.count else { throw ContentError.duplicateID }
        guard catalog.topics.allSatisfy({ $0.sourceURL.scheme?.lowercased() == "https" }) else { throw ContentError.invalidURL }
        return catalog
    }
}

