import SwiftUI

// MARK: - History "Geçmiş"
struct HistoryView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    private let order = ["BUGÜN", "DÜN", "2 GÜN ÖNCE"]

    private var groups: [String] {
        let present = Set(store.history.map(\.group))
        return order.filter { present.contains($0) }
            + present.subtracting(order).sorted()
    }

    var body: some View {
        WatchScreen(title: store.t("history")) {
            if store.history.isEmpty {
                HistoryEmptyState()
            } else {
                VStack(spacing: 6) {
                    ForEach(groups, id: \.self) { group in
                        SectionHeader(title: store.historyGroupTitle(group))
                        ForEach(store.history.filter { $0.group == group }) { entry in
                            row(entry)
                        }
                    }
                }
            }
        }
    }

    private func row(_ entry: JuiceEntry) -> some View {
        Button { path.append(Route.detail(entry)) } label: {
            HStack(spacing: 8) {
                Circle()
                    .fill(entry.status.tint.color)
                    .frame(width: 7, height: 7)
                VStack(alignment: .leading, spacing: 1) {
                    Text(store.localizedMock(entry.name)).font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                    Text("\(entry.time) · \(store.historyStatus(entry.status))")
                        .font(.fp(9))
                        .foregroundStyle(Theme.textSecondary)
                        .lineLimit(1)
                        .minimumScaleFactor(0.75)
                }
                Spacer(minLength: 4)
                VStack(alignment: .trailing, spacing: 1) {
                    VolumeBadge(volumeMl: entry.volumeMl)
                    Text(entry.durationLabel)
                        .font(.fp(8))
                        .foregroundStyle(Theme.textSecondary)
                        .lineLimit(1)
                }
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

struct HistoryEmptyState: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        VStack(spacing: 6) {
            Text("↺").font(.fp(32, .bold)).foregroundStyle(Theme.textTertiary)
            Text(store.t("emptyHistoryTitle")).font(.fp(14, .semibold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("emptyHistorySubtitle")).font(.fp(9)).foregroundStyle(Theme.textSecondary)
        }
        .padding()
    }
}

// MARK: - Notifications "Bildirimler"
struct NotificationsView: View {
    @EnvironmentObject var store: JuicerStore
    private let order = ["BUGÜN", "DÜN"]

    private var groups: [String] {
        let present = Set(store.notices.map(\.group))
        return order.filter { present.contains($0) } + present.subtracting(order).sorted()
    }

    var body: some View {
        WatchScreen(title: store.t("notifications")) {
            if store.notices.isEmpty {
                NotificationsEmptyState()
            } else {
                VStack(spacing: 6) {
                    ForEach(groups, id: \.self) { group in
                        SectionHeader(title: store.historyGroupTitle(group))
                        ForEach(store.notices.filter { $0.group == group }) { n in
                            row(n)
                        }
                    }
                }
            }
        }
    }

    private func row(_ n: DeviceNotice) -> some View {
        HStack(spacing: 8) {
            Circle().fill(n.tint.color).frame(width: 8, height: 8)
            VStack(alignment: .leading, spacing: 1) {
                Text(store.localizedMock(n.title)).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                Text(store.localizedNoticeDetail(n.detail)).font(.fp(9)).foregroundStyle(Theme.textSecondary)
            }
            Spacer(minLength: 4)
            Text(n.time).font(.fp(9)).foregroundStyle(Theme.textSecondary)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 10)
        .frame(maxWidth: .infinity)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
    }
}

struct NotificationsEmptyState: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: "checkmark.circle.fill")
                .font(.fp(32)).foregroundStyle(Theme.green)
            Text(store.t("emptyNotificationsTitle")).font(.fp(14, .semibold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("emptyNotificationsSubtitle")).font(.fp(9)).foregroundStyle(Theme.textSecondary)
        }
        .padding()
    }
}
