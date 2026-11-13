import Foundation

struct TopicExternalLink: Equatable, Sendable {
    let url: URL
    let title: String
    let sourceCaption: String?
}

enum TopicExternalLinkResolver {
    static func resolve(_ topic: Topic) -> TopicExternalLink {
        let host = topic.sourceURL.host?.lowercased() ?? ""
        let isWikipedia = host.contains("wikipedia.org") || topic.sourceName.localizedCaseInsensitiveContains("Wikipedia")
        guard isWikipedia else {
            return TopicExternalLink(
                url: topic.sourceURL,
                title: "参考ページを見る",
                sourceCaption: topic.sourceName
            )
        }

        var components = URLComponents(string: "https://www.google.com/search")!
        components.queryItems = [
            URLQueryItem(name: "q", value: "\(topic.title) \(topic.year)年 \(topic.category.title)")
        ]
        return TopicExternalLink(
            url: components.url!,
            title: "この話題を検索",
            sourceCaption: nil
        )
    }
}

