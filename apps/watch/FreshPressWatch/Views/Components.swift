import SwiftUI

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
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.fp(14, .bold))
                .foregroundStyle(fg)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
        }
        .background(tint)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        .buttonStyle(.plain)
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
                .frame(maxWidth: .infinity)
                .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Apple sign-in styled button
struct AppleSignInButton: View {
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 5) {
                Image(systemName: "applelogo")
                    .font(.fp(13, .medium))
                Text("Apple ile Giriş Yap")
                    .font(.fp(13, .semibold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
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
    var body: some View {
        Circle()
            .fill(connected ? Theme.green : Theme.textTertiary)
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
    }
}

// MARK: - Card container
struct Card<Content: View>: View {
    var elevated: Bool = false
    @ViewBuilder var content: Content
    var body: some View {
        content
            .padding(10)
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
            Spacer(minLength: 4)
            if let value {
                Text(value)
                    .font(.fp(9))
                    .foregroundStyle(Theme.textSecondary)
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
            Text(value).font(.fp(13, .bold)).foregroundStyle(Theme.textPrimary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
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
