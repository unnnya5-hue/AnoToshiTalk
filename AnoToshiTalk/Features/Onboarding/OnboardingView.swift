import SwiftUI

struct OnboardingView: View {
    let completion: () -> Void
    @State private var page = 0
    private let pages = [
        ("home_hero", "年代から会話を始める", "年齢・年・年代を選ぶと、懐かしい話題を見つけられます。"),
        ("category_gamesToys", "カードをめくって話す", "問いかけをきっかけに、思い出をゆっくり話してみましょう。"),
        ("category_news", "安全に楽しむ", "プレイにはインターネット接続が必要です。無料版は各セット前に広告を最後まで見る必要があります。")
    ]

    var body: some View {
        VStack {
            HStack { Spacer(); Button("スキップ", action: completion).padding() }
            Spacer()
            Image(pages[page].0)
                .resizable()
                .scaledToFill()
                .frame(height: 260)
                .clipShape(RoundedRectangle(cornerRadius: 24))
                .padding(.horizontal, 24)
                .accessibilityHidden(true)
            Text(pages[page].1).font(.title.bold()).multilineTextAlignment(.center).padding(.top, 24)
            Text(pages[page].2).multilineTextAlignment(.center).foregroundStyle(.secondary).padding()
            Spacer()
            HStack { ForEach(0..<pages.count, id: \.self) { Image(systemName: $0 == page ? "circle.fill" : "circle") } }.font(.caption).accessibilityHidden(true)
            Button(page == pages.count - 1 ? "はじめる" : "次へ") {
                if page == pages.count - 1 { completion() } else { page += 1 }
            }.primaryButton().padding()
        }
    }
}

