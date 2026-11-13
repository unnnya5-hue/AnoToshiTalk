import Foundation
import SwiftData

@Model
final class FavoriteRecord {
    @Attribute(.unique) var topicID: String
    var createdAt: Date
    init(topicID: String, createdAt: Date = .now) { self.topicID = topicID; self.createdAt = createdAt }
}

