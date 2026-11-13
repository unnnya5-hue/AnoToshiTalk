import GoogleMobileAds
import SwiftUI

struct AdBannerView: View {
    let unitID: String

    var body: some View {
        BannerContainer(unitID: unitID, adSize: AdSizeBanner)
            .frame(width: AdSizeBanner.size.width, height: AdSizeBanner.size.height)
            .frame(maxWidth: .infinity)
            .accessibilityLabel("広告")
    }
}

private struct BannerContainer: UIViewRepresentable {
    let unitID: String
    let adSize: AdSize

    func makeUIView(context: Context) -> UIView {
        let container = UIView()
        container.clipsToBounds = true

        let banner = BannerView(adSize: adSize)
        banner.adUnitID = unitID
        banner.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(banner)
        NSLayoutConstraint.activate([
            banner.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            banner.centerYAnchor.constraint(equalTo: container.centerYAnchor),
            banner.widthAnchor.constraint(equalToConstant: adSize.size.width),
            banner.heightAnchor.constraint(equalToConstant: adSize.size.height)
        ])
        banner.load(Request())
        return container
    }

    func updateUIView(_ container: UIView, context: Context) {
        guard let banner = container.subviews.first(where: { $0 is BannerView }) as? BannerView else { return }
        if banner.adSize.size != adSize.size {
            banner.adSize = adSize
            banner.load(Request())
        }
    }
}

