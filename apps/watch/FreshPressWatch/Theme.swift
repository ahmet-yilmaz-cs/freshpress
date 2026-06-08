import SwiftUI

/// FreshPress watch design tokens — mirrors the watch Figma (dark theme).
enum Theme {
    // Surfaces
    static let bg = Color.black
    static let card = Color(hex: 0x1C1C1E)
    static let cardElevated = Color(hex: 0x2C2C2E)

    // Brand + system accents
    static let orange = Color(hex: 0xFF8200)
    static let green = Color(hex: 0x30D158)
    static let blue = Color(hex: 0x64D2FF)
    static let yellow = Color(hex: 0xFFD60A)
    static let red = Color(hex: 0xFF453A)

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: 0x8E8E93)
    static let textTertiary = Color(hex: 0x6B6B70)

    // Warm brand shades
    static let warm = Color(hex: 0xDEC1AF)
    static let brown = Color(hex: 0x5F2C00)

    static let corner: CGFloat = 12
}

extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: alpha
        )
    }
}

extension Font {
    /// Plus Jakarta Sans is not bundled on-device by default; SF rounded is the
    /// closest native match and keeps the watch app dependency-free.
    static func fp(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}
