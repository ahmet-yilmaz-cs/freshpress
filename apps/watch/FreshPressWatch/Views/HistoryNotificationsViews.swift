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
        Group {
            if store.history.isEmpty {
                HistoryEmptyState()
            } else {
                ScrollView {
                    VStack(spacing: 6) {
                        ForEach(groups, id: \.self) { group in
                            SectionHeader(title: group)
                            ForEach(store.history.filter { $0.group == group }) { entry in
                                row(entry)
                            }
                        }
                    }
                    .padding(.horizontal, 10)
                }
            }
        }
        .background(Theme.bg)
        .navigationTitle("Geçmiş")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func row(_ entry: JuiceEntry) -> some View {
        Button { path.append(Route.detail(entry)) } label: {
            HStack(spacing: 8) {
                VStack(alignment: .leading, spacing: 1) {
                    Text(entry.name).font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                    Text(entry.time).font(.fp(9)).foregroundStyle(Theme.textSecondary)
                }
                Spacer(minLength: 4)
                VolumeBadge(volumeMl: entry.volumeMl)
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
    var body: some View {
        VStack(spacing: 6) {
            Text("↺").font(.fp(32, .bold)).foregroundStyle(Theme.textTertiary)
            Text("Henüz sıkım yok").font(.fp(14, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("İlk sıkımını başlat").font(.fp(9)).foregroundStyle(Theme.textSecondary)
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
        Group {
            if store.notices.isEmpty {
                NotificationsEmptyState()
            } else {
                ScrollView {
                    VStack(spacing: 6) {
                        ForEach(groups, id: \.self) { group in
                            SectionHeader(title: group)
                            ForEach(store.notices.filter { $0.group == group }) { n in
                                row(n)
                            }
                        }
                    }
                    .padding(.horizontal, 10)
                }
            }
        }
        .background(Theme.bg)
        .navigationTitle("Bildirimler")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func row(_ n: DeviceNotice) -> some View {
        HStack(spacing: 8) {
            Circle().fill(n.tint.color).frame(width: 8, height: 8)
            VStack(alignment: .leading, spacing: 1) {
                Text(n.title).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                Text(n.detail).font(.fp(9)).foregroundStyle(Theme.textSecondary)
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
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: "checkmark.circle.fill")
                .font(.fp(32)).foregroundStyle(Theme.green)
            Text("Bildirim yok").font(.fp(14, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("Her şey yolunda").font(.fp(9)).foregroundStyle(Theme.textSecondary)
        }
        .padding()
    }
}
