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
            ScrollView {
                VStack(spacing: 8) {
                    // Top status row
                    HStack(spacing: 5) {
                        StatusDot(connected: isConnected)
                        Text("FreshPress")
                            .font(.fp(13, .bold))
                            .foregroundStyle(Theme.textPrimary)
                        Spacer()
                    }

                    // Weekly counter
                    VStack(spacing: 0) {
                        Text("\(store.weeklyCount)")
                            .font(.fp(44, .heavy))
                            .foregroundStyle(Theme.orange)
                        Text("/ \(store.weeklyGoal) BU HAFTA")
                            .font(.fp(8, .bold))
                            .foregroundStyle(Theme.textSecondary)
                    }
                    .padding(.vertical, 2)

                    PrimaryButton(title: "BAŞLAT") { path.append(Route.programs) }

                    // Navigation affordances
                    VStack(spacing: 6) {
                        navRow("Bağlantı", systemImage: "antenna.radiowaves.left.and.right", tint: Theme.green, route: .connection)
                        navRow("Geçmiş", systemImage: "clock.arrow.circlepath", tint: Theme.blue, route: .history)
                        navRow("Bildirimler", systemImage: "bell.fill", tint: Theme.yellow, route: .notifications)
                        navRow("Ayarlar", systemImage: "gearshape.fill", tint: Theme.textSecondary, route: .settings)
                    }
                    .padding(.top, 2)
                }
                .padding(.horizontal, 10)
            }
            .background(Theme.bg)
            .navigationDestination(for: Route.self) { route in
                destination(for: route)
            }
            // Completion sheet (presented globally for the active session)
            .sheet(isPresented: $store.showCompletionSheet) {
                CompletionSheet(path: $path)
            }
        }
    }

    private func navRow(_ title: String, systemImage: String, tint: Color, route: Route) -> some View {
        Button { path.append(route) } label: {
            HStack(spacing: 8) {
                Image(systemName: systemImage)
                    .font(.fp(12, .semibold))
                    .foregroundStyle(tint)
                    .frame(width: 18)
                Text(title)
                    .font(.fp(12, .semibold))
                    .foregroundStyle(Theme.textPrimary)
                Spacer()
                Text("›").font(.fp(12, .semibold)).foregroundStyle(Theme.textTertiary)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 10)
            .frame(maxWidth: .infinity)
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
        }
        .buttonStyle(.plain)
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
        case .addDevice:            AddDeviceView()
        case .settings:             SettingsView(path: $path)
        case .notificationSettings: NotificationSettingsView()
        case .soundSettings:        SoundSettingsView()
        case .language:             LanguageView()
        case .about:                AboutView()
        }
    }
}
