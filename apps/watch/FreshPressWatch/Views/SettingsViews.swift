import SwiftUI

// MARK: - Settings "Ayarlar"
struct SettingsView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        WatchScreen(title: store.t("settings")) {
            VStack(spacing: 6) {
                SectionHeader(title: store.upper("general"))
                Button { path.append(Route.connection) } label: {
                    SettingRow(dot: store.connectionAccent.color, title: store.t("bluetooth"), value: store.connectionSummary)
                }.buttonStyle(.plain)
                Button { path.append(Route.notificationSettings) } label: {
                    SettingRow(dot: Theme.yellow, title: store.t("notifications"), value: store.notificationSummary)
                }.buttonStyle(.plain)
                Button { path.append(Route.soundSettings) } label: {
                    SettingRow(dot: Theme.blue, title: store.t("sound"), value: store.soundSummary)
                }.buttonStyle(.plain)

                SectionHeader(title: store.upper("other"))
                Button { path.append(Route.language) } label: {
                    SettingRow(dot: Theme.orange, title: store.t("language"), value: store.selectedLanguageName)
                }.buttonStyle(.plain)
                Button { path.append(Route.about) } label: {
                    SettingRow(dot: Theme.textSecondary, title: store.t("about"), value: "\(store.t("version")) 1.2.0")
                }.buttonStyle(.plain)
                Button {
                    path = NavigationPath()
                    store.signOut()
                } label: {
                    SettingRow(dot: Theme.red, title: store.t("logout"), value: store.userName, showChevron: false)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - Notification settings "Bildirimler"
struct NotificationSettingsView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        WatchScreen(title: store.t("notifications")) {
            VStack(spacing: 6) {
                SectionHeader(title: store.upper("types"))
                ToggleRow(dot: Theme.green, title: store.t("finishJuice"), subtitle: store.t("completeWhenDone"), isOn: $store.notifyFinish)
                ToggleRow(dot: Theme.blue, title: store.t("maintenance"), subtitle: store.t("reminder"), isOn: $store.notifyMaintenance)
                ToggleRow(dot: Theme.red, title: store.t("error"), subtitle: store.t("deviceWarning"), isOn: $store.notifyError)

                SectionHeader(title: store.upper("other"))
                ToggleRow(dot: Theme.yellow, title: store.t("tankFull"), subtitle: store.t("pulpWarning"), isOn: $store.notifyTankFull)
                ToggleRow(dot: Theme.orange, title: store.t("vibration"), subtitle: store.t("haptic"), isOn: $store.notifyVibration)
            }
        }
    }
}

// MARK: - Sound settings "Sıkım Sesi"
struct SoundSettingsView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        WatchScreen(title: store.t("sound")) {
            VStack(spacing: 6) {
                SectionHeader(title: store.upper("soundSection"))
                ToggleRow(dot: Theme.blue, title: store.t("juicingSound"), subtitle: store.t("whileRunning"), isOn: $store.soundJuicing)
                ToggleRow(dot: Theme.green, title: store.t("startup"), subtitle: store.t("startupSound"), isOn: $store.soundStart)
                ToggleRow(dot: Theme.orange, title: store.t("finish"), subtitle: store.t("finishWhenDone"), isOn: $store.soundFinish)

                SectionHeader(title: store.upper("vibrationSection"))
                ToggleRow(dot: Theme.yellow, title: store.t("vibration"), subtitle: store.t("haptic"), isOn: $store.hapticVibration)
                ToggleRow(dot: Theme.textSecondary, title: store.t("silentMode"), subtitle: store.t("quietHours"), isOn: $store.silentMode)
            }
        }
    }
}

// MARK: - Language "Dil"
struct LanguageView: View {
    @EnvironmentObject var store: JuicerStore

    private var groups: [String] { ["recommended", "other"] }

    var body: some View {
        WatchScreen(title: store.t("language")) {
            VStack(spacing: 6) {
                ForEach(groups, id: \.self) { group in
                    SectionHeader(title: store.languageGroupTitle(group))
                    ForEach(store.languages.filter { $0.group == group }) { lang in
                        Button { store.selectLanguage(lang) } label: {
                            HStack(spacing: 8) {
                                VStack(alignment: .leading, spacing: 1) {
                                    Text(lang.name).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                                    Text(lang.region).font(.fp(9)).foregroundStyle(Theme.textSecondary)
                                }
                                Spacer(minLength: 4)
                                if lang.id == store.selectedLanguageID {
                                    Image(systemName: "checkmark")
                                        .font(.fp(11, .bold)).foregroundStyle(Theme.orange)
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
            }
        }
    }
}

// MARK: - About "Hakkında"
struct AboutView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        WatchScreen(title: store.t("about")) {
            VStack(spacing: 6) {
                SectionHeader(title: store.upper("device"))
                SettingRow(title: store.t("model"), value: "JuiceLab Pro X1", showChevron: false)
                SettingRow(title: store.t("serialNumber"), value: "FP-X1-127325", showChevron: false)
                SettingRow(title: store.t("software"), value: "\(store.t("version")) 1.2.0", showChevron: false)

                SectionHeader(title: store.upper("manufacturer"))
                SettingRow(title: store.t("brand"), value: "FreshPress", showChevron: false)
                SettingRow(title: store.t("year"), value: "2024", showChevron: false)
            }
        }
    }
}
