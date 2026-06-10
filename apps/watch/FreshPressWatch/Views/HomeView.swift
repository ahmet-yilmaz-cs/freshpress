import SwiftUI

// MARK: - Home "FreshPress" (root after auth)
struct HomeView: View {
    @EnvironmentObject var store: JuicerStore
    @State private var path = NavigationPath()

    private var isConnected: Bool {
        if case .connected = store.connection { return true }
        return false
    }

    var body: some View {
        NavigationStack(path: $path) {
            WatchScreen(showsBack: false) {
                VStack(spacing: 8) {
                    // Top status row
                    HStack(spacing: 5) {
                        StatusDot(connected: isConnected, tint: store.connectionAccent.color)
                        Text("FreshPress")
                            .font(.fp(13, .bold))
                            .foregroundStyle(Theme.textPrimary)
                        Spacer()
                        Text(store.connectionSummary)
                            .font(.fp(8, .semibold))
                            .foregroundStyle(Theme.textSecondary)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    }

                    // Weekly counter
                    VStack(spacing: 2) {
                        Text("\(store.weeklyCount)")
                            .font(.fp(34, .heavy))
                            .foregroundStyle(Theme.orange)
                            .lineLimit(1)
                            .minimumScaleFactor(0.65)
                        Text("/ \(store.weeklyGoal) \(store.upper("thisWeek"))")
                            .font(.fp(8, .bold))
                            .foregroundStyle(Theme.textSecondary)
                    }
                    .padding(.vertical, 2)
                    .frame(maxWidth: .infinity)

                    HStack(spacing: 6) {
                        MetricPill(title: store.upper("user"), value: store.userName, tint: Theme.orange)
                        MetricPill(title: store.upper("goal"), value: "\(max(0, store.weeklyGoal - store.weeklyCount)) \(store.t("remainingSuffix"))", tint: Theme.green)
                    }

                    PrimaryButton(title: store.isConnected ? store.upper("start") : store.upper("connectAction")) {
                        path.append(store.isConnected ? Route.programs : Route.connection)
                    }

                    // Navigation affordances
                    VStack(spacing: 6) {
                        navRow(store.t("connection"), subtitle: store.deviceName, trailing: store.connectionSummary, systemImage: "antenna.radiowaves.left.and.right", tint: store.connectionAccent.color, route: .connection)
                        navRow(store.t("history"), subtitle: "\(store.history.count) \(store.t("recordSuffix"))", trailing: store.t("open"), systemImage: "clock.arrow.circlepath", tint: Theme.blue, route: .history)
                        navRow(store.t("notifications"), subtitle: "\(store.notices.count) \(store.t("alertSuffix"))", trailing: store.notificationSummary, systemImage: "bell.fill", tint: Theme.yellow, route: .notifications)
                        navRow(store.t("settings"), subtitle: store.selectedLanguageName, trailing: store.t("edit"), systemImage: "gearshape.fill", tint: Theme.textSecondary, route: .settings)
                    }
                    .padding(.top, 2)
                }
            }
            .navigationDestination(for: Route.self) { route in
                destination(for: route)
            }
            .animation(.easeInOut(duration: 0.25), value: store.weeklyCount)
            .animation(.easeInOut(duration: 0.25), value: store.connectionSummary)
        }
    }

    private func navRow(_ title: String, subtitle: String, trailing: String, systemImage: String, tint: Color, route: Route) -> some View {
        ActionRow(
            title: title,
            subtitle: subtitle,
            trailing: trailing,
            systemImage: systemImage,
            tint: tint
        ) {
            path.append(route)
        }
    }

    // MARK: Central route table
    @ViewBuilder
    private func destination(for route: Route) -> some View {
        switch route {
        case .programs:             ProgramsView(path: $path)
        case .juicing:              JuicingView(path: $path)
        case .completed:            CompletedView(path: $path)
        case .detail(let entry):    DetailView(entry: entry, path: $path)
        case .history:              HistoryView(path: $path)
        case .notifications:        NotificationsView()
        case .connection:           ConnectionView(path: $path)
        case .addDevice:            AddDeviceView(path: $path)
        case .settings:             SettingsView(path: $path)
        case .notificationSettings: NotificationSettingsView()
        case .soundSettings:        SoundSettingsView()
        case .language:             LanguageView()
        case .about:                AboutView()
        }
    }
}
