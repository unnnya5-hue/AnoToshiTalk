import SwiftUI

struct HomeView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        NavigationStack {
            ZStack {
                HomePopBackground()
                ScrollView {
                    VStack(spacing: 16) {
                        if model.canRequestAds, let unitID = model.adConfiguration?.bannerUnitID { AdBannerView(unitID: unitID) }
                        Image("home_hero")
                            .resizable()
                            .scaledToFill()
                            .frame(height: 190)
                            .clipShape(RoundedRectangle(cornerRadius: 22))
                            .overlay {
                                RoundedRectangle(cornerRadius: 22)
                                    .stroke(.white.opacity(0.9), lineWidth: 3)
                            }
                            .overlay(alignment: .bottomTrailing) {
                                Image(systemName: "clock.arrow.circlepath")
                                    .font(.title2.bold())
                                    .padding(12)
                                    .background(.ultraThinMaterial, in: Circle())
                                    .padding(12)
                            }
                            .shadow(color: HomePalette.indigo.opacity(0.12), radius: 12, y: 7)
                            .accessibilityLabel("思い出の写真を見ながら会話するイラスト")
                        HStack(spacing: 14) {
                            PopRays()
                            Text("あの年トーク")
                                .font(.largeTitle.bold())
                            PopRays()
                                .scaleEffect(x: -1)
                        }
                        Text("あの頃の話で、今日をもっと楽しく。 ")
                            .foregroundStyle(.secondary)
                            .padding(.bottom, 16)
                        homeButton(
                            "年齢から探す",
                            icon: "person.text.rectangle",
                            mode: .age,
                            colors: [HomePalette.sky, HomePalette.blue]
                        )
                        homeButton(
                            "年から探す",
                            icon: "calendar",
                            mode: .year,
                            colors: [HomePalette.mint, HomePalette.green]
                        )
                        homeButton(
                            "年代から探す",
                            icon: "calendar.badge.clock",
                            mode: .decade,
                            colors: [HomePalette.apricot, HomePalette.coral]
                        )
                        HStack(spacing: 24) {
                            Button { model.screen = .favorites } label: { Label("お気に入り", systemImage: "star") }
                            Button { model.screen = .settings } label: { Label("設定", systemImage: "gearshape") }
                        }
                        .font(.headline)
                        .foregroundStyle(HomePalette.indigo)
                        .padding(.top, 20)
                        if model.canRequestAds, let unitID = model.adConfiguration?.bannerUnitID { AdBannerView(unitID: unitID) }
                    }
                    .padding(24)
                }
            }
            .ignoresSafeArea(edges: .bottom)
        }
    }

    private func homeButton(_ title: String, icon: String, mode: InputMode, colors: [Color]) -> some View {
        Button { model.screen = .setup(mode) } label: {
            HStack(spacing: 14) {
                Image(systemName: icon).frame(width: 32)
                Text(title)
                Spacer()
                Image(systemName: "chevron.right")
            }
            .font(.headline)
            .padding(.horizontal, 18)
            .padding(.vertical, 17)
            .frame(maxWidth: .infinity)
            .foregroundStyle(.white)
            .background(
                LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing),
                in: RoundedRectangle(cornerRadius: 20)
            )
            .overlay {
                RoundedRectangle(cornerRadius: 20)
                    .stroke(.white.opacity(0.85), lineWidth: 2)
            }
            .shadow(color: (colors.last ?? HomePalette.indigo).opacity(0.28), radius: 0, y: 7)
            .shadow(color: HomePalette.indigo.opacity(0.12), radius: 10, y: 8)
        }
        .buttonStyle(.plain)
    }
}

private enum HomePalette {
    static let indigo = Color(red: 0.18, green: 0.17, blue: 0.55)
    static let sky = Color(red: 0.32, green: 0.72, blue: 0.98)
    static let blue = Color(red: 0.20, green: 0.52, blue: 0.93)
    static let mint = Color(red: 0.39, green: 0.88, blue: 0.67)
    static let green = Color(red: 0.24, green: 0.75, blue: 0.58)
    static let apricot = Color(red: 1.0, green: 0.65, blue: 0.43)
    static let coral = Color(red: 1.0, green: 0.43, blue: 0.34)
    static let butter = Color(red: 1.0, green: 0.88, blue: 0.40)
    static let lavender = Color(red: 0.73, green: 0.66, blue: 1.0)
}

private struct HomePopBackground: View {
    var body: some View {
        GeometryReader { proxy in
            ZStack {
                LinearGradient(
                    colors: [Color(red: 1.0, green: 0.98, blue: 0.93), .white],
                    startPoint: .top,
                    endPoint: .bottom
                )
                Circle()
                    .fill(HomePalette.sky.opacity(0.24))
                    .frame(width: 210)
                    .position(x: 8, y: 30)
                Circle()
                    .fill(HomePalette.butter.opacity(0.27))
                    .frame(width: 180)
                    .position(x: proxy.size.width - 10, y: 42)
                Circle()
                    .fill(HomePalette.lavender.opacity(0.22))
                    .frame(width: 230)
                    .position(x: 15, y: proxy.size.height - 5)
                Circle()
                    .fill(HomePalette.mint.opacity(0.22))
                    .frame(width: 245)
                    .position(x: proxy.size.width - 5, y: proxy.size.height - 15)
            }
        }
        .ignoresSafeArea()
        .accessibilityHidden(true)
    }
}

private struct PopRays: View {
    var body: some View {
        HStack(spacing: 3) {
            Capsule().frame(width: 4, height: 13).rotationEffect(.degrees(-35))
            Capsule().frame(width: 4, height: 16)
            Capsule().frame(width: 4, height: 13).rotationEffect(.degrees(35))
        }
        .foregroundStyle(HomePalette.butter)
        .accessibilityHidden(true)
    }
}

