import SwiftUI

// MARK: - Shared watch layout
private enum WatchChrome {
    static let headerHeight: CGFloat = 24
    static let headerLift: CGFloat = 22
    static let headerSideWidth: CGFloat = 28
}

struct WatchScreen<Content: View>: View {
    var title: String?
    var showsBack = true
    var scrolls = true
    var horizontalPadding: CGFloat = 10
    let content: Content

    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: JuicerStore

    init(
        title: String? = nil,
        showsBack: Bool = true,
        scrolls: Bool = true,
        horizontalPadding: CGFloat = 10,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.showsBack = showsBack
        self.scrolls = scrolls
        self.horizontalPadding = horizontalPadding
        self.content = content()
    }

    var body: some View {
        VStack(spacing: 0) {
            if let title {
                WatchHeader(title: title, showsBack: showsBack, backLabel: store.t("back")) {
                    dismiss()
                }
                .offset(y: -WatchChrome.headerLift)
                .padding(.bottom, -WatchChrome.headerLift)
            }

            Group {
                if scrolls {
                    ScrollView {
                        content
                            .padding(.horizontal, horizontalPadding)
                            .padding(.top, title == nil ? 8 : 2)
                            .padding(.bottom, 12)
                            .frame(maxWidth: .infinity)
                    }
                } else {
                    content
                        .padding(.horizontal, horizontalPadding)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.bg.ignoresSafeArea())
        .toolbar(.hidden, for: .navigationBar)
        .navigationBarBackButtonHidden(true)
    }
}

struct WatchHeader: View {
    let title: String
    var showsBack = true
    var backLabel = "Geri"
    let backAction: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            Group {
                if showsBack {
                    Button(action: backAction) {
                        Image(systemName: "chevron.left")
                            .font(.fp(11, .bold))
                            .foregroundStyle(Theme.orange)
                            .frame(width: WatchChrome.headerSideWidth, height: WatchChrome.headerHeight)
                            .contentShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(backLabel)
                } else {
                    Color.clear.frame(width: WatchChrome.headerSideWidth, height: WatchChrome.headerHeight)
                }
            }

            Text(title)
                .font(.fp(11, .bold))
                .foregroundStyle(Theme.textPrimary)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
                .frame(maxWidth: .infinity)

            Color.clear.frame(width: WatchChrome.headerSideWidth, height: WatchChrome.headerHeight)
        }
        .frame(height: WatchChrome.headerHeight)
        .padding(.horizontal, 8)
        .background(Theme.bg)
    }
}

// MARK: - Section header ("PROGRAMLAR", "BUGÜN", ...)
struct SectionHeader: View {
    let title: String
    var body: some View {
        Text(title)
            .font(.fp(8, .bold))
            .foregroundStyle(Theme.textSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 4)
    }
}

// MARK: - Primary filled button
struct PrimaryButton: View {
    let title: String
    var tint: Color = Theme.orange
    var fg: Color = .black
    var isDisabled = false
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.fp(14, .bold))
                .foregroundStyle(fg)
                .lineLimit(1)
                .minimumScaleFactor(0.75)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 32)
        }
        .background(tint.opacity(isDisabled ? 0.45 : 1))
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        .buttonStyle(.plain)
        .disabled(isDisabled)
    }
}

// MARK: - Secondary / text button
struct TextButton: View {
    let title: String
    var color: Color = Theme.textSecondary
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.fp(12, .semibold))
                .foregroundStyle(color)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 28)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Apple sign-in styled button
struct AppleSignInButton: View {
    var title = "Apple ile Giriş Yap"
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 5) {
                Image(systemName: "applelogo")
                    .font(.fp(13, .medium))
                Text(title)
                    .font(.fp(13, .semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 32)
        }
        .background(Color.black)
        .overlay(
            RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                .stroke(Color.white.opacity(0.25), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        .buttonStyle(.plain)
    }
}

// MARK: - Status connection dot
struct StatusDot: View {
    let connected: Bool
    var tint: Color? = nil
    var body: some View {
        Circle()
            .fill(tint ?? (connected ? Theme.green : Theme.textTertiary))
            .frame(width: 7, height: 7)
    }
}

// MARK: - Volume badge ("240 ml")
struct VolumeBadge: View {
    let volumeMl: Int
    var body: some View {
        Text("\(volumeMl)")
            .font(.fp(13, .bold))
            .foregroundStyle(Theme.orange)
            .lineLimit(1)
            .minimumScaleFactor(0.75)
    }
}

// MARK: - Card container
struct Card<Content: View>: View {
    var elevated: Bool = false
    @ViewBuilder var content: Content
    var body: some View {
        content
            .padding(9)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(elevated ? Theme.cardElevated : Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
    }
}

// MARK: - Progress ring
struct ProgressRing: View {
    let progress: Double           // 0...1
    var lineWidth: CGFloat = 10
    var tint: Color = Theme.orange
    var body: some View {
        ZStack {
            Circle()
                .stroke(Theme.cardElevated, lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: progress)
                .stroke(tint, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.linear(duration: 0.1), value: progress)
        }
    }
}

// MARK: - Settings row (title + value + chevron)
struct SettingRow: View {
    var dot: Color? = nil
    let title: String
    var value: String? = nil
    var showChevron = true
    var body: some View {
        HStack(spacing: 8) {
            if let dot {
                Circle().fill(dot).frame(width: 7, height: 7)
            }
            Text(title)
                .font(.fp(11, .semibold))
                .foregroundStyle(Theme.textPrimary)
                .lineLimit(1)
                .minimumScaleFactor(0.75)
            Spacer(minLength: 4)
            if let value {
                Text(value)
                    .font(.fp(9))
                    .foregroundStyle(Theme.textSecondary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
            if showChevron {
                Text("›")
                    .font(.fp(12, .semibold))
                    .foregroundStyle(Theme.textTertiary)
            }
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 10)
        .frame(maxWidth: .infinity)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        .contentShape(Rectangle())
    }
}

// MARK: - Toggle row bound to store state
struct ToggleRow: View {
    var dot: Color? = nil
    let title: String
    let subtitle: String
    @Binding var isOn: Bool
    var body: some View {
        HStack(spacing: 8) {
            if let dot {
                Circle().fill(dot).frame(width: 7, height: 7)
            }
            VStack(alignment: .leading, spacing: 1) {
                Text(title).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                Text(subtitle).font(.fp(9)).foregroundStyle(Theme.textSecondary)
            }
            .lineLimit(1)
            .minimumScaleFactor(0.75)
            Spacer(minLength: 4)
            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(Theme.green)
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 10)
        .frame(maxWidth: .infinity)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
    }
}

// MARK: - Logo mark "FP"
struct LogoMark: View {
    var size: CGFloat = 56
    var body: some View {
        Text("FP")
            .font(.fp(size * 0.42, .heavy))
            .foregroundStyle(.black)
            .frame(width: size, height: size)
            .background(Theme.orange)
            .clipShape(Circle())
    }
}

// MARK: - Stat tile (label + value)
struct StatTile: View {
    let label: String
    let value: String
    var body: some View {
        VStack(spacing: 2) {
            Text(label).font(.fp(7, .semibold)).foregroundStyle(Theme.textSecondary)
            Text(value)
                .font(.fp(13, .bold))
                .foregroundStyle(Theme.textPrimary)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
    }
}

// MARK: - List action row
struct ActionRow: View {
    let title: String
    var subtitle: String?
    var trailing: String?
    var systemImage: String
    var tint: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: systemImage)
                    .font(.fp(12, .semibold))
                    .foregroundStyle(tint)
                    .frame(width: 18)
                VStack(alignment: .leading, spacing: 1) {
                    Text(title)
                        .font(.fp(12, .semibold))
                        .foregroundStyle(Theme.textPrimary)
                    if let subtitle {
                        Text(subtitle)
                            .font(.fp(8))
                            .foregroundStyle(Theme.textSecondary)
                    }
                }
                .lineLimit(1)
                .minimumScaleFactor(0.75)
                Spacer(minLength: 4)
                if let trailing {
                    Text(trailing)
                        .font(.fp(8, .semibold))
                        .foregroundStyle(Theme.textSecondary)
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                }
                Text("›")
                    .font(.fp(12, .semibold))
                    .foregroundStyle(Theme.textTertiary)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 10)
            .frame(maxWidth: .infinity)
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Small metric pill
struct MetricPill: View {
    let title: String
    let value: String
    var tint: Color = Theme.orange

    var body: some View {
        HStack(spacing: 4) {
            Circle().fill(tint).frame(width: 5, height: 5)
            Text(title)
                .font(.fp(8, .semibold))
                .foregroundStyle(Theme.textSecondary)
            Text(value)
                .font(.fp(9, .bold))
                .foregroundStyle(Theme.textPrimary)
        }
        .lineLimit(1)
        .minimumScaleFactor(0.7)
        .padding(.vertical, 5)
        .padding(.horizontal, 8)
        .background(Theme.card)
        .clipShape(Capsule())
    }
}

extension NoticeTint {
    var color: Color {
        switch self {
        case .green: return Theme.green
        case .yellow: return Theme.yellow
        case .red: return Theme.red
        case .blue: return Theme.blue
        }
    }
}
