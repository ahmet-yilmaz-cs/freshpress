import Foundation
import Combine

/// Connection state for the smart juicer.
enum ConnectionState: Equatable {
    case connected(name: String, battery: Int)
    case connecting
    case disconnected
}

/// A juice program the user can start from the wrist.
struct Program: Identifiable, Hashable {
    let id = UUID()
    let name: String        // "Sabah Smoothie"
    let estimate: String    // "≈ 3 dk"
    let volumeMl: Int        // 240
    let ingredients: String  // "Elma · Havuç · Zencefil"
    let durationSeconds: Int // total juicing duration used for the timer
}

/// A completed juice in history.
struct JuiceEntry: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let time: String     // "07:09"
    let volumeMl: Int
    let group: String    // "BUGÜN" / "DÜN"
    var ingredients: String = ""
    var durationLabel: String = "3:12"
}

/// A device notification.
struct DeviceNotice: Identifiable, Hashable {
    let id = UUID()
    let title: String    // "Sıkım bitti"
    let detail: String   // "240 ml · Smoothie"
    let time: String
    let group: String
    let tint: NoticeTint
}

enum NoticeTint { case green, yellow, red, blue }

/// A selectable interface language.
struct AppLanguage: Identifiable, Hashable {
    let id = UUID()
    let name: String     // "Türkçe"
    let region: String   // "Türkiye"
    let group: String    // "ÖNERİLEN" / "DİĞER"
}

/// In-memory mock store driving the whole watch app (Turkish copy from Figma).
final class JuicerStore: ObservableObject {
    // MARK: Auth / user
    @Published var isAuthenticated = false
    let userName = "Erdem"
    let deviceName = "FreshPress 127325"

    // MARK: Connection
    @Published var connection: ConnectionState = .connected(name: "FreshPress 127325", battery: 87)

    // MARK: Weekly progress
    @Published var weeklyCount = 12
    @Published var weeklyGoal = 20

    // MARK: Active juicing session
    @Published var activeProgram: Program?
    @Published var progress: Double = 0        // 0...1
    @Published var isJuicing = false
    @Published var showCompletionSheet = false

    private var timer: AnyCancellable?

    // MARK: Settings toggles (Notifications)
    @Published var notifyFinish = true
    @Published var notifyMaintenance = true
    @Published var notifyError = true
    @Published var notifyTankFull = false
    @Published var notifyVibration = true

    // MARK: Settings toggles (Sound)
    @Published var soundJuicing = true
    @Published var soundStart = true
    @Published var soundFinish = true
    @Published var hapticVibration = true
    @Published var silentMode = false

    // MARK: Language
    @Published var selectedLanguageID: UUID

    let languages: [AppLanguage] = [
        .init(name: "Türkçe", region: "Türkiye", group: "ÖNERİLEN"),
        .init(name: "English", region: "United States", group: "ÖNERİLEN"),
        .init(name: "Deutsch", region: "Deutschland", group: "ÖNERİLEN"),
        .init(name: "Español", region: "España", group: "DİĞER"),
        .init(name: "Français", region: "France", group: "DİĞER"),
    ]

    let programs: [Program] = [
        .init(name: "Sabah Smoothie", estimate: "≈ 3 dk", volumeMl: 240, ingredients: "Elma · Havuç · Zencefil", durationSeconds: 180),
        .init(name: "Ara Detoks", estimate: "≈ 2 dk", volumeMl: 180, ingredients: "Salatalık · Limon", durationSeconds: 120),
        .init(name: "Akşam Detoksu", estimate: "≈ 4 dk", volumeMl: 300, ingredients: "Pancar · Elma", durationSeconds: 240),
        .init(name: "Yeşil Detoks", estimate: "≈ 5 dk", volumeMl: 260, ingredients: "Ispanak · Kereviz", durationSeconds: 300),
        .init(name: "D Vitamini", estimate: "≈ 2 dk", volumeMl: 150, ingredients: "Portakal · Zerdeçal", durationSeconds: 120),
    ]

    @Published var history: [JuiceEntry] = [
        .init(name: "Sabah Smoothie", time: "07:09", volumeMl: 240, group: "BUGÜN", ingredients: "Elma · Havuç · Zencefil", durationLabel: "3:12"),
        .init(name: "Ara Detoks", time: "12:30", volumeMl: 180, group: "BUGÜN", ingredients: "Salatalık · Limon", durationLabel: "2:04"),
        .init(name: "Akşam Detoksu", time: "22:32", volumeMl: 300, group: "DÜN", ingredients: "Pancar · Elma", durationLabel: "4:01"),
        .init(name: "Yeşil Şok", time: "08:15", volumeMl: 320, group: "2 GÜN ÖNCE", ingredients: "Ispanak · Kereviz", durationLabel: "5:10"),
    ]

    @Published var notices: [DeviceNotice] = [
        .init(title: "Sıkım bitti", detail: "240 ml · Smoothie", time: "17:26", group: "BUGÜN", tint: .green),
        .init(title: "Hazne doldu", detail: "Posalığı boşalt", time: "08:46", group: "BUGÜN", tint: .yellow),
        .init(title: "Bakım zamanı", detail: "Filtreyi temizle", time: "09:03", group: "DÜN", tint: .blue),
        .init(title: "Su azaldı", detail: "Su haznesini doldur", time: "13:25", group: "DÜN", tint: .red),
    ]

    init() {
        // default selected language = first (Türkçe)
        selectedLanguageID = UUID() // placeholder, set below
        selectedLanguageID = languages[0].id
    }

    // MARK: - Actions

    func authenticate() {
        isAuthenticated = true
    }

    // MARK: Juicing session
    func startJuicing(_ program: Program) {
        activeProgram = program
        progress = 0
        isJuicing = true
        timer?.cancel()
        // Advance to 100% over a short, demo-friendly window (~6s).
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self, self.isJuicing else { return }
                self.progress = min(1.0, self.progress + 0.017)
                if self.progress >= 1.0 {
                    self.finishJuicing()
                }
            }
    }

    func stopJuicing() {
        isJuicing = false
        timer?.cancel()
    }

    func finishJuicing() {
        isJuicing = false
        timer?.cancel()
        progress = 1.0
        if let p = activeProgram {
            weeklyCount += 1
            let entry = JuiceEntry(
                name: p.name,
                time: currentClock(),
                volumeMl: p.volumeMl,
                group: "BUGÜN",
                ingredients: p.ingredients,
                durationLabel: formatDuration(p.durationSeconds)
            )
            history.insert(entry, at: 0)
            notices.insert(
                DeviceNotice(title: "Sıkım bitti", detail: "\(p.volumeMl) ml · \(p.name)", time: currentClock(), group: "BUGÜN", tint: .green),
                at: 0
            )
        }
        showCompletionSheet = true
    }

    /// Remaining time label for the active session, e.g. "01:12 kaldı".
    var remainingLabel: String {
        guard let p = activeProgram else { return "00:00 kaldı" }
        let remaining = Int(Double(p.durationSeconds) * (1 - progress))
        return "\(formatDuration(remaining)) kaldı"
    }

    var progressPercent: Int { Int(progress * 100) }

    // MARK: Connection
    func disconnect() {
        connection = .disconnected
    }

    func reconnect() {
        connection = .connecting
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) { [weak self] in
            self?.connection = .connected(name: "FreshPress 127325", battery: 87)
        }
    }

    func cancelConnecting() {
        connection = .disconnected
    }

    func pair() {
        connection = .connecting
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) { [weak self] in
            self?.connection = .connected(name: "FreshPress 127325", battery: 87)
        }
    }

    // MARK: Language
    func selectLanguage(_ lang: AppLanguage) {
        selectedLanguageID = lang.id
    }

    var selectedLanguageName: String {
        languages.first { $0.id == selectedLanguageID }?.name ?? "Türkçe"
    }

    // MARK: Helpers
    private func formatDuration(_ seconds: Int) -> String {
        String(format: "%02d:%02d", seconds / 60, seconds % 60)
    }

    private func currentClock() -> String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.string(from: Date())
    }
}
