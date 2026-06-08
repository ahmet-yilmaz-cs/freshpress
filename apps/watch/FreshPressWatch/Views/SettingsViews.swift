import SwiftUI

// MARK: - Settings "Ayarlar"
struct SettingsView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                SectionHeader(title: "GENEL")
                Button { path.append(Route.connection) } label: {
                    SettingRow(dot: Theme.green, title: "Bluetooth", value: store.deviceName)
                }.buttonStyle(.plain)
                Button { path.append(Route.notificationSettings) } label: {
                    SettingRow(dot: Theme.yellow, title: "Bildirimler", value: "Açık")
                }.buttonStyle(.plain)
                Button { path.append(Route.soundSettings) } label: {
                    SettingRow(dot: Theme.blue, title: "Sıkım Sesi", value: "Açık")
                }.buttonStyle(.plain)

                SectionHeader(title: "DİĞER")
                Button { path.append(Route.language) } label: {
                    SettingRow(dot: Theme.orange, title: "Dil", value: store.selectedLanguageName)
                }.buttonStyle(.plain)
                Button { path.append(Route.about) } label: {
                    SettingRow(dot: Theme.textSecondary, title: "Hakkında", value: "Sürüm 1.2.0")
                }.buttonStyle(.plain)
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Ayarlar")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Notification settings "Bildirimler"
struct NotificationSettingsView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                SectionHeader(title: "TÜRLER")
                ToggleRow(dot: Theme.green, title: "Sıkım bitti", subtitle: "Tamamlanınca", isOn: $store.notifyFinish)
                ToggleRow(dot: Theme.blue, title: "Bakım", subtitle: "Hatırlatıcı", isOn: $store.notifyMaintenance)
                ToggleRow(dot: Theme.red, title: "Hata", subtitle: "Cihaz uyarısı", isOn: $store.notifyError)

                SectionHeader(title: "DİĞER")
                ToggleRow(dot: Theme.yellow, title: "Hazne dolu", subtitle: "Posa uyarısı", isOn: $store.notifyTankFull)
                ToggleRow(dot: Theme.orange, title: "Titreşim", subtitle: "Dokunsal", isOn: $store.notifyVibration)
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Bildirimler")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Sound settings "Sıkım Sesi"
struct SoundSettingsView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                SectionHeader(title: "SES")
                ToggleRow(dot: Theme.blue, title: "Sıkım sesi", subtitle: "Çalışırken", isOn: $store.soundJuicing)
                ToggleRow(dot: Theme.green, title: "Açılış", subtitle: "Başlangıç sesi", isOn: $store.soundStart)
                ToggleRow(dot: Theme.orange, title: "Bitiş", subtitle: "Tamamlanınca", isOn: $store.soundFinish)

                SectionHeader(title: "TİTREŞİM")
                ToggleRow(dot: Theme.yellow, title: "Titreşim", subtitle: "Dokunsal", isOn: $store.hapticVibration)
                ToggleRow(dot: Theme.textSecondary, title: "Sessiz mod", subtitle: "22:00 – 07:00", isOn: $store.silentMode)
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Sıkım Sesi")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Language "Dil"
struct LanguageView: View {
    @EnvironmentObject var store: JuicerStore

    private var groups: [String] { ["ÖNERİLEN", "DİĞER"] }

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                ForEach(groups, id: \.self) { group in
                    SectionHeader(title: group)
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
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Dil")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - About "Hakkında"
struct AboutView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                SectionHeader(title: "CİHAZ")
                SettingRow(title: "Model", value: "FreshPress FP-24", showChevron: false)
                SettingRow(title: "Seri No", value: "127325", showChevron: false)
                SettingRow(title: "Yazılım", value: "Sürüm 1.2.0", showChevron: false)

                SectionHeader(title: "ÜRETİCİ")
                SettingRow(title: "Marka", value: "FreshPress", showChevron: false)
                SettingRow(title: "Yıl", value: "2024", showChevron: false)
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Hakkında")
        .navigationBarTitleDisplayMode(.inline)
    }
}
