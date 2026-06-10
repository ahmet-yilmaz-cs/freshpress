import Foundation
import Combine

/// Connection state for the smart juicer.
enum ConnectionState: Equatable {
    case connected(name: String, battery: Int)
    case connecting
    case disconnected
}

/// Mock account mirrored from the companion phone app.
struct MockAccount: Hashable {
    let name: String
    let phone: String
    let plan: String
    let lastSync: String
}

/// Mock Bluetooth device discovered by the watch.
struct MockDevice: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let serial: String
    let signal: Int
    let battery: Int
    let isKnown: Bool
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

/// Current lifecycle of a locally tracked mock juicing run.
enum JuiceEntryStatus: String, Hashable {
    case running
    case paused
    case canceled
    case completed

    var localizationKey: String {
        switch self {
        case .running: return "runningHistory"
        case .paused: return "pausedHistory"
        case .canceled: return "canceledHistory"
        case .completed: return "completedHistory"
        }
    }

    var symbol: String {
        switch self {
        case .running: return "●"
        case .paused: return "Ⅱ"
        case .canceled: return "×"
        case .completed: return "✓"
        }
    }

    var tint: NoticeTint {
        switch self {
        case .running: return .yellow
        case .paused: return .blue
        case .canceled: return .red
        case .completed: return .green
        }
    }
}

/// A locally tracked juice run shown in history.
struct JuiceEntry: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let time: String     // "07:09"
    let volumeMl: Int
    let group: String    // "BUGÜN" / "DÜN"
    var ingredients: String = ""
    var durationLabel: String = "3:12"
    var status: JuiceEntryStatus = .completed
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
enum LanguageCode: String, Hashable {
    case tr
    case en
    case de
    case es
    case fr

    var localeIdentifier: String {
        switch self {
        case .tr: return "tr_TR"
        case .en: return "en_US"
        case .de: return "de_DE"
        case .es: return "es_ES"
        case .fr: return "fr_FR"
        }
    }
}

struct AppLanguage: Identifiable, Hashable {
    let id = UUID()
    let code: LanguageCode
    let name: String     // "Türkçe"
    let region: String   // "Türkiye"
    let group: String    // "recommended" / "other"
}

private let localizedCopy: [LanguageCode: [String: String]] = [
    .tr: [
        "back": "Geri",
        "welcome": "Hoş Geldin",
        "onboardingSubtitle": "Bileğinden sıkım başlat ve takip et",
        "startIntro": "Başla",
        "skip": "Atla",
        "login": "Giriş Yap",
        "connectAccount": "FreshPress hesabını bağla",
        "mock": "Mock",
        "syncPhone": "Telefonla Eşitle",
        "appleSignIn": "Apple ile Giriş Yap",
        "thisWeek": "BU HAFTA",
        "user": "Kullanıcı",
        "goal": "Hedef",
        "remainingSuffix": "kaldı",
        "start": "Başlat",
        "connectAction": "Bağlan",
        "open": "Aç",
        "edit": "Düzenle",
        "recordSuffix": "kayıt",
        "alertSuffix": "uyarı",
        "connection": "Bağlantı",
        "history": "Geçmiş",
        "notifications": "Bildirimler",
        "settings": "Ayarlar",
        "programs": "Program Seç",
        "juicing": "Sıkılıyor",
        "paused": "Durakladı",
        "completed": "Tamamlandı",
        "detail": "Detay",
        "addDevice": "Cihaz Ekle",
        "language": "Dil",
        "about": "Hakkında",
        "sound": "Sıkım Sesi",
        "bluetooth": "Bluetooth",
        "general": "Genel",
        "other": "Diğer",
        "types": "Türler",
        "soundSection": "Ses",
        "vibrationSection": "Titreşim",
        "recommended": "Önerilen",
        "connected": "Bağlı",
        "connectedShort": "Bağlı",
        "connecting": "Bağlanıyor",
        "disconnectedShort": "Bağlı değil",
        "disconnectedTitle": "Bağlı Değil",
        "battery": "Batarya",
        "disconnect": "Bağlantıyı Kes",
        "searchingFreshPress": "FreshPress aranıyor",
        "mockBluetoothSim": "Bluetooth bağlantısı simüle ediliyor",
        "cancel": "İptal",
        "deviceNotFound": "Cihaz bulunamadı",
        "bringDeviceClose": "Cihazı yakınına getir",
        "reconnect": "Yeniden Bağlan",
        "addDeviceSubtitle": "Mock Bluetooth taraması",
        "devicePlural": "cihaz",
        "addDeviceTitle": "Cihaz Ekle",
        "bringFreshPressClose": "FreshPress'i yakınına getir",
        "chooseMockDevice": "Mock cihazlardan birini seç",
        "foundDevices": "Bulunan Cihazlar",
        "returnConnection": "Bağlantıya Dön",
        "signal": "Sinyal",
        "pair": "Eşleştir",
        "programsSection": "Programlar",
        "more": "Daha Fazla",
        "noDevice": "Cihaz bağlı değil",
        "connectForProgram": "Program başlatmak için mock Bluetooth bağlantısını kur.",
        "bluetoothGo": "Bluetooth'a Git",
        "juicingStatus": "Sıkılıyor",
        "pausedStatus": "Duraklatıldı",
        "stop": "Durdur",
        "resume": "Devam Et",
        "cancelUpper": "İptal",
        "completedUpper": "Tamamlandı",
        "viewDetail": "Detayı Gör",
        "newJuice": "Yeni Sıkım",
        "home": "Ana Ekran",
        "close": "Kapat",
        "juicingCompleted": "Sıkım tamamlandı",
        "duration": "Süre",
        "time": "Saat",
        "status": "Durum",
        "good": "İyi",
        "runningHistory": "Sürüyor",
        "pausedHistory": "Durakladı",
        "canceledHistory": "İptal edildi",
        "completedHistory": "Tamamlandı",
        "repeatJuice": "Tekrar Sık",
        "emptyHistoryTitle": "Henüz sıkım yok",
        "emptyHistorySubtitle": "İlk sıkımını başlat",
        "emptyNotificationsTitle": "Bildirim yok",
        "emptyNotificationsSubtitle": "Her şey yolunda",
        "version": "Sürüm",
        "logout": "Oturumu Kapat",
        "finishJuice": "Sıkım bitti",
        "completeWhenDone": "Tamamlanınca",
        "maintenance": "Bakım",
        "reminder": "Hatırlatıcı",
        "error": "Hata",
        "deviceWarning": "Cihaz uyarısı",
        "tankFull": "Hazne dolu",
        "pulpWarning": "Posa uyarısı",
        "vibration": "Titreşim",
        "haptic": "Dokunsal",
        "juicingSound": "Sıkım sesi",
        "whileRunning": "Çalışırken",
        "startup": "Açılış",
        "startupSound": "Başlangıç sesi",
        "finish": "Bitiş",
        "finishWhenDone": "Tamamlanınca",
        "silentMode": "Sessiz mod",
        "quietHours": "22:00 - 07:00",
        "device": "Cihaz",
        "model": "Model",
        "serialNumber": "Seri No",
        "software": "Yazılım",
        "manufacturer": "Üretici",
        "brand": "Marka",
        "year": "Yıl",
        "today": "Bugün",
        "yesterday": "Dün",
        "twoDaysAgo": "2 gün önce",
        "enabledShort": "açık",
        "silent": "Sessiz",
        "minuteShort": "dk"
    ],
    .en: [
        "back": "Back",
        "welcome": "Welcome",
        "onboardingSubtitle": "Start and track juicing from your wrist",
        "startIntro": "Start",
        "skip": "Skip",
        "login": "Sign In",
        "connectAccount": "Connect your FreshPress account",
        "mock": "Mock",
        "syncPhone": "Sync Phone",
        "appleSignIn": "Sign in with Apple",
        "thisWeek": "THIS WEEK",
        "user": "User",
        "goal": "Goal",
        "remainingSuffix": "left",
        "start": "Start",
        "connectAction": "Connect",
        "open": "Open",
        "edit": "Edit",
        "recordSuffix": "records",
        "alertSuffix": "alerts",
        "connection": "Connection",
        "history": "History",
        "notifications": "Alerts",
        "settings": "Settings",
        "programs": "Programs",
        "juicing": "Juicing",
        "paused": "Paused",
        "completed": "Completed",
        "detail": "Detail",
        "addDevice": "Add Device",
        "language": "Language",
        "about": "About",
        "sound": "Juice Sound",
        "bluetooth": "Bluetooth",
        "general": "General",
        "other": "Other",
        "types": "Types",
        "soundSection": "Sound",
        "vibrationSection": "Vibration",
        "recommended": "Recommended",
        "connected": "Connected",
        "connectedShort": "Connected",
        "connecting": "Connecting",
        "disconnectedShort": "Disconnected",
        "disconnectedTitle": "Disconnected",
        "battery": "Battery",
        "disconnect": "Disconnect",
        "searchingFreshPress": "Searching FreshPress",
        "mockBluetoothSim": "Simulating Bluetooth link",
        "cancel": "Cancel",
        "deviceNotFound": "Device not found",
        "bringDeviceClose": "Bring device closer",
        "reconnect": "Reconnect",
        "addDeviceSubtitle": "Mock Bluetooth scan",
        "devicePlural": "devices",
        "addDeviceTitle": "Add Device",
        "bringFreshPressClose": "Bring FreshPress closer",
        "chooseMockDevice": "Choose a mock device",
        "foundDevices": "Found Devices",
        "returnConnection": "Back to Connection",
        "signal": "Signal",
        "pair": "Pair",
        "programsSection": "Programs",
        "more": "More",
        "noDevice": "Device disconnected",
        "connectForProgram": "Connect mock Bluetooth before starting a program.",
        "bluetoothGo": "Go to Bluetooth",
        "juicingStatus": "Juicing",
        "pausedStatus": "Paused",
        "stop": "Stop",
        "resume": "Continue",
        "cancelUpper": "Cancel",
        "completedUpper": "Completed",
        "viewDetail": "View Detail",
        "newJuice": "New Juice",
        "home": "Home",
        "close": "Close",
        "juicingCompleted": "Juicing complete",
        "duration": "Duration",
        "time": "Time",
        "status": "Status",
        "good": "Good",
        "runningHistory": "Running",
        "pausedHistory": "Paused",
        "canceledHistory": "Canceled",
        "completedHistory": "Completed",
        "repeatJuice": "Repeat",
        "emptyHistoryTitle": "No juices yet",
        "emptyHistorySubtitle": "Start your first juice",
        "emptyNotificationsTitle": "No alerts",
        "emptyNotificationsSubtitle": "Everything is fine",
        "version": "Version",
        "logout": "Sign Out",
        "finishJuice": "Juice ready",
        "completeWhenDone": "When complete",
        "maintenance": "Maintenance",
        "reminder": "Reminder",
        "error": "Error",
        "deviceWarning": "Device alert",
        "tankFull": "Bin full",
        "pulpWarning": "Pulp alert",
        "vibration": "Vibration",
        "haptic": "Haptic",
        "juicingSound": "Juice sound",
        "whileRunning": "While running",
        "startup": "Startup",
        "startupSound": "Startup sound",
        "finish": "Finish",
        "finishWhenDone": "On finish",
        "silentMode": "Silent mode",
        "quietHours": "22:00 - 07:00",
        "device": "Device",
        "model": "Model",
        "serialNumber": "Serial No",
        "software": "Software",
        "manufacturer": "Maker",
        "brand": "Brand",
        "year": "Year",
        "today": "Today",
        "yesterday": "Yesterday",
        "twoDaysAgo": "2 days ago",
        "enabledShort": "on",
        "silent": "Silent",
        "minuteShort": "min"
    ],
    .de: [
        "back": "Zurück",
        "welcome": "Willkommen",
        "onboardingSubtitle": "Säfte am Handgelenk starten und verfolgen",
        "startIntro": "Start",
        "skip": "Überspringen",
        "login": "Anmelden",
        "connectAccount": "FreshPress Konto verbinden",
        "mock": "Mock",
        "syncPhone": "Telefon syncen",
        "appleSignIn": "Mit Apple anmelden",
        "thisWeek": "DIESE WOCHE",
        "user": "Nutzer",
        "goal": "Ziel",
        "remainingSuffix": "übrig",
        "start": "Start",
        "connectAction": "Verbinden",
        "open": "Öffnen",
        "edit": "Ändern",
        "recordSuffix": "Einträge",
        "alertSuffix": "Hinweise",
        "connection": "Verbindung",
        "history": "Verlauf",
        "notifications": "Hinweise",
        "settings": "Einstellungen",
        "programs": "Programme",
        "juicing": "Entsaften",
        "paused": "Pausiert",
        "completed": "Fertig",
        "detail": "Detail",
        "addDevice": "Gerät",
        "language": "Sprache",
        "about": "Info",
        "sound": "Saftton",
        "bluetooth": "Bluetooth",
        "general": "Allgemein",
        "other": "Andere",
        "types": "Arten",
        "soundSection": "Ton",
        "vibrationSection": "Vibration",
        "recommended": "Empfohlen",
        "connected": "Verbunden",
        "connectedShort": "Verbunden",
        "connecting": "Verbindet",
        "disconnectedShort": "Getrennt",
        "disconnectedTitle": "Getrennt",
        "battery": "Akku",
        "disconnect": "Trennen",
        "searchingFreshPress": "FreshPress wird gesucht",
        "mockBluetoothSim": "Bluetooth Verbindung simuliert",
        "cancel": "Abbrechen",
        "deviceNotFound": "Gerät nicht gefunden",
        "bringDeviceClose": "Gerät näher bringen",
        "reconnect": "Neu verbinden",
        "addDeviceSubtitle": "Mock Bluetooth Scan",
        "devicePlural": "Geräte",
        "addDeviceTitle": "Gerät",
        "bringFreshPressClose": "FreshPress näher bringen",
        "chooseMockDevice": "Mock Gerät wählen",
        "foundDevices": "Gefundene Geräte",
        "returnConnection": "Zur Verbindung",
        "signal": "Signal",
        "pair": "Koppeln",
        "programsSection": "Programme",
        "more": "Mehr",
        "noDevice": "Gerät getrennt",
        "connectForProgram": "Mock Bluetooth vor Programmstart verbinden.",
        "bluetoothGo": "Zu Bluetooth",
        "juicingStatus": "Entsaftet",
        "pausedStatus": "Pausiert",
        "stop": "Stoppen",
        "resume": "Weiter",
        "cancelUpper": "Abbrechen",
        "completedUpper": "Fertig",
        "viewDetail": "Details",
        "newJuice": "Neuer Saft",
        "home": "Startseite",
        "close": "Schließen",
        "juicingCompleted": "Entsaften fertig",
        "duration": "Dauer",
        "time": "Zeit",
        "status": "Status",
        "good": "Gut",
        "runningHistory": "Läuft",
        "pausedHistory": "Pausiert",
        "canceledHistory": "Abgebrochen",
        "completedHistory": "Fertig",
        "repeatJuice": "Wiederholen",
        "emptyHistoryTitle": "Noch keine Säfte",
        "emptyHistorySubtitle": "Ersten Saft starten",
        "emptyNotificationsTitle": "Keine Hinweise",
        "emptyNotificationsSubtitle": "Alles in Ordnung",
        "version": "Version",
        "logout": "Abmelden",
        "finishJuice": "Saft fertig",
        "completeWhenDone": "Bei Abschluss",
        "maintenance": "Wartung",
        "reminder": "Erinnerung",
        "error": "Fehler",
        "deviceWarning": "Gerätehinweis",
        "tankFull": "Behälter voll",
        "pulpWarning": "Tresterhinweis",
        "vibration": "Vibration",
        "haptic": "Haptik",
        "juicingSound": "Saftton",
        "whileRunning": "Während Lauf",
        "startup": "Start",
        "startupSound": "Startton",
        "finish": "Ende",
        "finishWhenDone": "Bei Ende",
        "silentMode": "Stumm",
        "quietHours": "22:00 - 07:00",
        "device": "Gerät",
        "model": "Modell",
        "serialNumber": "Seriennr.",
        "software": "Software",
        "manufacturer": "Hersteller",
        "brand": "Marke",
        "year": "Jahr",
        "today": "Heute",
        "yesterday": "Gestern",
        "twoDaysAgo": "Vor 2 Tagen",
        "enabledShort": "aktiv",
        "silent": "Stumm",
        "minuteShort": "Min."
    ],
    .es: [
        "back": "Atrás",
        "welcome": "Bienvenido",
        "onboardingSubtitle": "Inicia y sigue zumos desde tu muñeca",
        "startIntro": "Empezar",
        "skip": "Omitir",
        "login": "Entrar",
        "connectAccount": "Conecta tu cuenta FreshPress",
        "mock": "Mock",
        "syncPhone": "Sincronizar",
        "appleSignIn": "Entrar con Apple",
        "thisWeek": "ESTA SEMANA",
        "user": "Usuario",
        "goal": "Meta",
        "remainingSuffix": "restan",
        "start": "Iniciar",
        "connectAction": "Conectar",
        "open": "Abrir",
        "edit": "Editar",
        "recordSuffix": "registros",
        "alertSuffix": "avisos",
        "connection": "Conexión",
        "history": "Historial",
        "notifications": "Avisos",
        "settings": "Ajustes",
        "programs": "Programas",
        "juicing": "Exprimiendo",
        "paused": "Pausado",
        "completed": "Completado",
        "detail": "Detalle",
        "addDevice": "Añadir",
        "language": "Idioma",
        "about": "Acerca",
        "sound": "Sonido",
        "bluetooth": "Bluetooth",
        "general": "General",
        "other": "Otros",
        "types": "Tipos",
        "soundSection": "Sonido",
        "vibrationSection": "Vibración",
        "recommended": "Recomendado",
        "connected": "Conectado",
        "connectedShort": "Conectado",
        "connecting": "Conectando",
        "disconnectedShort": "Sin conexión",
        "disconnectedTitle": "Sin conexión",
        "battery": "Batería",
        "disconnect": "Desconectar",
        "searchingFreshPress": "Buscando FreshPress",
        "mockBluetoothSim": "Simulando Bluetooth",
        "cancel": "Cancelar",
        "deviceNotFound": "Dispositivo no encontrado",
        "bringDeviceClose": "Acerca el dispositivo",
        "reconnect": "Reconectar",
        "addDeviceSubtitle": "Escaneo Bluetooth mock",
        "devicePlural": "dispositivos",
        "addDeviceTitle": "Añadir",
        "bringFreshPressClose": "Acerca FreshPress",
        "chooseMockDevice": "Elige un dispositivo mock",
        "foundDevices": "Dispositivos",
        "returnConnection": "Volver a conexión",
        "signal": "Señal",
        "pair": "Vincular",
        "programsSection": "Programas",
        "more": "Más",
        "noDevice": "Dispositivo desconectado",
        "connectForProgram": "Conecta Bluetooth mock antes de iniciar.",
        "bluetoothGo": "Ir a Bluetooth",
        "juicingStatus": "Exprimiendo",
        "pausedStatus": "Pausado",
        "stop": "Detener",
        "resume": "Continuar",
        "cancelUpper": "Cancelar",
        "completedUpper": "Completado",
        "viewDetail": "Ver detalle",
        "newJuice": "Nuevo zumo",
        "home": "Inicio",
        "close": "Cerrar",
        "juicingCompleted": "Zumo completado",
        "duration": "Duración",
        "time": "Hora",
        "status": "Estado",
        "good": "Bien",
        "runningHistory": "En curso",
        "pausedHistory": "Pausado",
        "canceledHistory": "Cancelado",
        "completedHistory": "Completado",
        "repeatJuice": "Repetir",
        "emptyHistoryTitle": "Sin zumos",
        "emptyHistorySubtitle": "Inicia tu primer zumo",
        "emptyNotificationsTitle": "Sin avisos",
        "emptyNotificationsSubtitle": "Todo va bien",
        "version": "Versión",
        "logout": "Salir",
        "finishJuice": "Zumo listo",
        "completeWhenDone": "Al terminar",
        "maintenance": "Mantenimiento",
        "reminder": "Recordatorio",
        "error": "Error",
        "deviceWarning": "Aviso de dispositivo",
        "tankFull": "Depósito lleno",
        "pulpWarning": "Aviso de pulpa",
        "vibration": "Vibración",
        "haptic": "Háptico",
        "juicingSound": "Sonido",
        "whileRunning": "En marcha",
        "startup": "Inicio",
        "startupSound": "Sonido inicio",
        "finish": "Fin",
        "finishWhenDone": "Al terminar",
        "silentMode": "Silencio",
        "quietHours": "22:00 - 07:00",
        "device": "Dispositivo",
        "model": "Modelo",
        "serialNumber": "N. serie",
        "software": "Software",
        "manufacturer": "Fabricante",
        "brand": "Marca",
        "year": "Año",
        "today": "Hoy",
        "yesterday": "Ayer",
        "twoDaysAgo": "Hace 2 días",
        "enabledShort": "act.",
        "silent": "Silencio",
        "minuteShort": "min"
    ],
    .fr: [
        "back": "Retour",
        "welcome": "Bienvenue",
        "onboardingSubtitle": "Lancez et suivez vos jus au poignet",
        "startIntro": "Démarrer",
        "skip": "Passer",
        "login": "Connexion",
        "connectAccount": "Connectez votre compte FreshPress",
        "mock": "Mock",
        "syncPhone": "Sync téléphone",
        "appleSignIn": "Connexion Apple",
        "thisWeek": "CETTE SEMAINE",
        "user": "Utilisateur",
        "goal": "Objectif",
        "remainingSuffix": "restants",
        "start": "Démarrer",
        "connectAction": "Connecter",
        "open": "Ouvrir",
        "edit": "Modifier",
        "recordSuffix": "entrées",
        "alertSuffix": "alertes",
        "connection": "Connexion",
        "history": "Historique",
        "notifications": "Alertes",
        "settings": "Réglages",
        "programs": "Programmes",
        "juicing": "Pressage",
        "paused": "En pause",
        "completed": "Terminé",
        "detail": "Détail",
        "addDevice": "Ajouter",
        "language": "Langue",
        "about": "À propos",
        "sound": "Son",
        "bluetooth": "Bluetooth",
        "general": "Général",
        "other": "Autres",
        "types": "Types",
        "soundSection": "Son",
        "vibrationSection": "Vibration",
        "recommended": "Recommandé",
        "connected": "Connecté",
        "connectedShort": "Connecté",
        "connecting": "Connexion",
        "disconnectedShort": "Déconnecté",
        "disconnectedTitle": "Déconnecté",
        "battery": "Batterie",
        "disconnect": "Déconnecter",
        "searchingFreshPress": "Recherche FreshPress",
        "mockBluetoothSim": "Bluetooth simulé",
        "cancel": "Annuler",
        "deviceNotFound": "Appareil introuvable",
        "bringDeviceClose": "Rapprochez l'appareil",
        "reconnect": "Reconnecter",
        "addDeviceSubtitle": "Scan Bluetooth mock",
        "devicePlural": "appareils",
        "addDeviceTitle": "Ajouter",
        "bringFreshPressClose": "Rapprochez FreshPress",
        "chooseMockDevice": "Choisissez un appareil mock",
        "foundDevices": "Appareils trouvés",
        "returnConnection": "Retour connexion",
        "signal": "Signal",
        "pair": "Associer",
        "programsSection": "Programmes",
        "more": "Plus",
        "noDevice": "Appareil déconnecté",
        "connectForProgram": "Connectez le Bluetooth mock avant de lancer.",
        "bluetoothGo": "Aller au Bluetooth",
        "juicingStatus": "Pressage",
        "pausedStatus": "En pause",
        "stop": "Arrêter",
        "resume": "Continuer",
        "cancelUpper": "Annuler",
        "completedUpper": "Terminé",
        "viewDetail": "Voir détail",
        "newJuice": "Nouveau jus",
        "home": "Accueil",
        "close": "Fermer",
        "juicingCompleted": "Jus terminé",
        "duration": "Durée",
        "time": "Heure",
        "status": "État",
        "good": "Bien",
        "runningHistory": "En cours",
        "pausedHistory": "En pause",
        "canceledHistory": "Annulé",
        "completedHistory": "Terminé",
        "repeatJuice": "Refaire",
        "emptyHistoryTitle": "Aucun jus",
        "emptyHistorySubtitle": "Lancez votre premier jus",
        "emptyNotificationsTitle": "Aucune alerte",
        "emptyNotificationsSubtitle": "Tout va bien",
        "version": "Version",
        "logout": "Déconnexion",
        "finishJuice": "Jus prêt",
        "completeWhenDone": "À la fin",
        "maintenance": "Entretien",
        "reminder": "Rappel",
        "error": "Erreur",
        "deviceWarning": "Alerte appareil",
        "tankFull": "Bac plein",
        "pulpWarning": "Alerte pulpe",
        "vibration": "Vibration",
        "haptic": "Haptique",
        "juicingSound": "Son jus",
        "whileRunning": "En marche",
        "startup": "Démarrage",
        "startupSound": "Son démarrage",
        "finish": "Fin",
        "finishWhenDone": "À la fin",
        "silentMode": "Silencieux",
        "quietHours": "22:00 - 07:00",
        "device": "Appareil",
        "model": "Modèle",
        "serialNumber": "N. série",
        "software": "Logiciel",
        "manufacturer": "Fabricant",
        "brand": "Marque",
        "year": "Année",
        "today": "Aujourd'hui",
        "yesterday": "Hier",
        "twoDaysAgo": "Il y a 2 jours",
        "enabledShort": "actif",
        "silent": "Silencieux",
        "minuteShort": "min"
    ]
]

private let localizedMockContent: [LanguageCode: [String: String]] = [
    .en: [
        "Sabah Smoothie": "Morning Smoothie",
        "Öğle Detoks": "Mini Detox",
        "Akşam Detoks": "Evening Detox",
        "Yeşil Detoks": "Green Detox",
        "C Vitamini": "Vitamin C",
        "Yeşil Şok": "Green Shot",
        "Elma · Havuç · Zencefil": "Apple · Carrot · Ginger",
        "Salatalık · Limon": "Cucumber · Lemon",
        "Pancar · Elma": "Beet · Apple",
        "Ispanak · Kereviz": "Spinach · Celery",
        "Portakal · Zerdeçal": "Orange · Turmeric",
        "Sıkım bitti": "Juice ready",
        "Hazne doldu": "Bin full",
        "Posalığı boşalt": "Empty pulp bin",
        "Bakım zamanı": "Maintenance due",
        "Filtreyi temizle": "Clean filter",
        "Su azaldı": "Low water",
        "Su haznesini doldur": "Fill water tank"
    ],
    .de: [
        "Sabah Smoothie": "Morgen-Smoothie",
        "Öğle Detoks": "Mini-Detox",
        "Akşam Detoks": "Abend-Detox",
        "Yeşil Detoks": "Grüner Detox",
        "C Vitamini": "Vitamin C",
        "Yeşil Şok": "Grüner Shot",
        "Elma · Havuç · Zencefil": "Apfel · Karotte · Ingwer",
        "Salatalık · Limon": "Gurke · Zitrone",
        "Pancar · Elma": "Rote Bete · Apfel",
        "Ispanak · Kereviz": "Spinat · Sellerie",
        "Portakal · Zerdeçal": "Orange · Kurkuma",
        "Sıkım bitti": "Saft fertig",
        "Hazne doldu": "Behälter voll",
        "Posalığı boşalt": "Trester leeren",
        "Bakım zamanı": "Wartung fällig",
        "Filtreyi temizle": "Filter reinigen",
        "Su azaldı": "Wenig Wasser",
        "Su haznesini doldur": "Wassertank füllen"
    ],
    .es: [
        "Sabah Smoothie": "Smoothie matinal",
        "Öğle Detoks": "Mini detox",
        "Akşam Detoks": "Detox nocturno",
        "Yeşil Detoks": "Detox verde",
        "C Vitamini": "Vitamina C",
        "Yeşil Şok": "Shot verde",
        "Elma · Havuç · Zencefil": "Manzana · Zanahoria · Jengibre",
        "Salatalık · Limon": "Pepino · Limón",
        "Pancar · Elma": "Remolacha · Manzana",
        "Ispanak · Kereviz": "Espinaca · Apio",
        "Portakal · Zerdeçal": "Naranja · Cúrcuma",
        "Sıkım bitti": "Zumo listo",
        "Hazne doldu": "Depósito lleno",
        "Posalığı boşalt": "Vacía la pulpa",
        "Bakım zamanı": "Mantenimiento",
        "Filtreyi temizle": "Limpia el filtro",
        "Su azaldı": "Poca agua",
        "Su haznesini doldur": "Llena el depósito"
    ],
    .fr: [
        "Sabah Smoothie": "Smoothie matin",
        "Öğle Detoks": "Mini détox",
        "Akşam Detoks": "Détox du soir",
        "Yeşil Detoks": "Détox verte",
        "C Vitamini": "Vitamine C",
        "Yeşil Şok": "Shot vert",
        "Elma · Havuç · Zencefil": "Pomme · Carotte · Gingembre",
        "Salatalık · Limon": "Concombre · Citron",
        "Pancar · Elma": "Betterave · Pomme",
        "Ispanak · Kereviz": "Épinard · Céleri",
        "Portakal · Zerdeçal": "Orange · Curcuma",
        "Sıkım bitti": "Jus prêt",
        "Hazne doldu": "Bac plein",
        "Posalığı boşalt": "Vider la pulpe",
        "Bakım zamanı": "Entretien requis",
        "Filtreyi temizle": "Nettoyer le filtre",
        "Su azaldı": "Eau faible",
        "Su haznesini doldur": "Remplir le réservoir"
    ]
]

/// In-memory mock store driving the whole watch app (Turkish copy from Figma).
final class JuicerStore: ObservableObject {
    private let languageDefaultsKey = "freshpress.watch.languageCode"

    // MARK: Auth / user
    @Published var isAuthenticated = false
    let account = MockAccount(
        name: "Erdem",
        phone: "+90 532 000 12 73",
        plan: "Demo aile hesabı",
        lastSync: "Az önce eşitlendi"
    )
    var userName: String { account.name }

    // MARK: Connection
    @Published var connection: ConnectionState = .connected(name: "FreshPress 127325", battery: 87)
    @Published var pairingDeviceID: UUID?

    let availableDevices: [MockDevice] = [
        .init(name: "FreshPress 127325", serial: "FP-X1-127325", signal: 92, battery: 87, isKnown: true),
        .init(name: "FreshPress Demo Lab", serial: "FP-X1-884201", signal: 74, battery: 64, isKnown: false),
        .init(name: "FreshPress Mutfak", serial: "FP-X1-552019", signal: 58, battery: 91, isKnown: false),
    ]

    // MARK: Weekly progress
    @Published var weeklyCount = 12
    @Published var weeklyGoal = 20

    // MARK: Active juicing session
    @Published var activeProgram: Program?
    @Published var progress: Double = 0        // 0...1
    @Published var isJuicing = false
    @Published var showCompletionSheet = false
    @Published var lastCompletedEntry: JuiceEntry?

    private var timer: AnyCancellable?
    private var activeHistoryEntryID: UUID?

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
        .init(code: .tr, name: "Türkçe", region: "Türkiye", group: "recommended"),
        .init(code: .en, name: "English", region: "United States", group: "recommended"),
        .init(code: .de, name: "Deutsch", region: "Deutschland", group: "recommended"),
        .init(code: .es, name: "Español", region: "España", group: "other"),
        .init(code: .fr, name: "Français", region: "France", group: "other"),
    ]

    let programs: [Program] = [
        .init(name: "Sabah Smoothie", estimate: "≈ 3 dk", volumeMl: 240, ingredients: "Elma · Havuç · Zencefil", durationSeconds: 180),
        .init(name: "Öğle Detoks", estimate: "≈ 2 dk", volumeMl: 180, ingredients: "Salatalık · Limon", durationSeconds: 120),
        .init(name: "Akşam Detoks", estimate: "≈ 4 dk", volumeMl: 300, ingredients: "Pancar · Elma", durationSeconds: 240),
        .init(name: "Yeşil Detoks", estimate: "≈ 5 dk", volumeMl: 260, ingredients: "Ispanak · Kereviz", durationSeconds: 300),
        .init(name: "C Vitamini", estimate: "≈ 2 dk", volumeMl: 150, ingredients: "Portakal · Zerdeçal", durationSeconds: 120),
    ]

    @Published var history: [JuiceEntry] = [
        .init(name: "Sabah Smoothie", time: "07:09", volumeMl: 240, group: "BUGÜN", ingredients: "Elma · Havuç · Zencefil", durationLabel: "3:12"),
        .init(name: "Öğle Detoks", time: "12:30", volumeMl: 180, group: "BUGÜN", ingredients: "Salatalık · Limon", durationLabel: "2:04"),
        .init(name: "Akşam Detoks", time: "22:32", volumeMl: 300, group: "DÜN", ingredients: "Pancar · Elma", durationLabel: "4:01"),
        .init(name: "Yeşil Detoks", time: "08:15", volumeMl: 320, group: "2 GÜN ÖNCE", ingredients: "Ispanak · Kereviz", durationLabel: "5:10"),
    ]

    @Published var notices: [DeviceNotice] = [
        .init(title: "Sıkım bitti", detail: "240 ml · Sabah Smoothie", time: "17:26", group: "BUGÜN", tint: .green),
        .init(title: "Hazne doldu", detail: "Posalığı boşalt", time: "08:46", group: "BUGÜN", tint: .yellow),
        .init(title: "Bakım zamanı", detail: "Filtreyi temizle", time: "09:03", group: "DÜN", tint: .blue),
        .init(title: "Su azaldı", detail: "Su haznesini doldur", time: "13:25", group: "DÜN", tint: .red),
    ]

    init() {
        let savedCode = UserDefaults.standard.string(forKey: languageDefaultsKey)
        let initialLanguage = languages.first { $0.code.rawValue == savedCode } ?? languages[0]
        selectedLanguageID = initialLanguage.id
    }

    // MARK: - Actions

    func authenticate() {
        isAuthenticated = true
    }

    func authenticateWithPhone() {
        authenticate()
    }

    func authenticateWithApple() {
        authenticate()
    }

    func signOut() {
        stopJuicing()
        isAuthenticated = false
    }

    // MARK: Juicing session
    func startJuicing(_ program: Program) {
        guard isConnected else { return }
        cancelOpenRunIfNeeded()
        activeProgram = program
        progress = 0
        isJuicing = true
        showCompletionSheet = false
        lastCompletedEntry = nil
        createActiveHistoryEntry(for: program)
        startJuicingTimer()
    }

    func pauseJuicing() {
        guard activeProgram != nil, isJuicing, progress < 1 else { return }
        isJuicing = false
        timer?.cancel()
        timer = nil
        updateActiveHistory(status: .paused)
    }

    func resumeJuicing() {
        guard isConnected, activeProgram != nil, !isJuicing, progress > 0, progress < 1 else { return }
        isJuicing = true
        updateActiveHistory(status: .running)
        startJuicingTimer()
    }

    func cancelJuicing() {
        updateActiveHistory(status: .canceled)
        isJuicing = false
        timer?.cancel()
        timer = nil
        progress = 0
        activeProgram = nil
        showCompletionSheet = false
        lastCompletedEntry = nil
        activeHistoryEntryID = nil
    }

    private func startJuicingTimer() {
        timer?.cancel()
        // Advance to 100% over a short, demo-friendly window.
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
        cancelJuicing()
    }

    func finishJuicing() {
        isJuicing = false
        timer?.cancel()
        timer = nil
        progress = 1.0
        if let p = activeProgram {
            weeklyCount += 1
            let entry = completeActiveHistoryEntry(for: p)
            lastCompletedEntry = entry
            activeHistoryEntryID = nil
            notices.insert(
                DeviceNotice(title: "Sıkım bitti", detail: "\(p.volumeMl) ml · \(p.name)", time: currentClock(), group: "BUGÜN", tint: .green),
                at: 0
            )
        }
        showCompletionSheet = false
    }

    /// Remaining time label for the active session, e.g. "01:12 kaldı".
    var remainingLabel: String {
        guard let p = activeProgram else { return "00:00 \(t("remainingSuffix"))" }
        let remaining = Int(Double(p.durationSeconds) * (1 - progress))
        return "\(formatDuration(remaining)) \(t("remainingSuffix"))"
    }

    var progressPercent: Int { Int(progress * 100) }

    var isJuicingPaused: Bool {
        activeProgram != nil && !isJuicing && progress > 0 && progress < 1
    }

    private func createActiveHistoryEntry(for program: Program) {
        let entry = JuiceEntry(
            name: program.name,
            time: currentClock(),
            volumeMl: program.volumeMl,
            group: "BUGÜN",
            ingredients: program.ingredients,
            durationLabel: "00:00",
            status: .running
        )
        history.insert(entry, at: 0)
        activeHistoryEntryID = entry.id
    }

    private func cancelOpenRunIfNeeded() {
        guard activeHistoryEntryID != nil, activeProgram != nil, progress < 1 else { return }
        updateActiveHistory(status: .canceled)
        activeHistoryEntryID = nil
    }

    private func updateActiveHistory(status: JuiceEntryStatus) {
        guard let activeHistoryEntryID, let index = history.firstIndex(where: { $0.id == activeHistoryEntryID }) else { return }
        history[index].status = status
        if let activeProgram {
            history[index].durationLabel = elapsedDurationLabel(for: activeProgram)
        }
    }

    private func completeActiveHistoryEntry(for program: Program) -> JuiceEntry {
        if let activeHistoryEntryID, let index = history.firstIndex(where: { $0.id == activeHistoryEntryID }) {
            history[index].status = .completed
            history[index].durationLabel = formatDuration(program.durationSeconds)
            return history[index]
        }

        let entry = JuiceEntry(
            name: program.name,
            time: currentClock(),
            volumeMl: program.volumeMl,
            group: "BUGÜN",
            ingredients: program.ingredients,
            durationLabel: formatDuration(program.durationSeconds),
            status: .completed
        )
        history.insert(entry, at: 0)
        return entry
    }

    // MARK: Connection
    func disconnect() {
        stopJuicing()
        connection = .disconnected
        pairingDeviceID = nil
    }

    func reconnect() {
        let preferred = availableDevices.first { $0.isKnown } ?? availableDevices[0]
        connect(to: preferred)
    }

    func pair() {
        let preferred = availableDevices.first { $0.isKnown } ?? availableDevices[0]
        pair(preferred)
    }

    func pair(_ device: MockDevice) {
        connect(to: device)
    }

    private func connect(to device: MockDevice) {
        pairingDeviceID = device.id
        connection = .connecting
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) { [weak self] in
            guard let self else { return }
            self.connection = .connected(name: device.name, battery: device.battery)
            self.pairingDeviceID = nil
        }
    }

    func cancelConnecting() {
        connection = .disconnected
        pairingDeviceID = nil
    }

    // MARK: Language
    func selectLanguage(_ lang: AppLanguage) {
        selectedLanguageID = lang.id
        UserDefaults.standard.set(lang.code.rawValue, forKey: languageDefaultsKey)
    }

    var selectedLanguageName: String {
        languages.first { $0.id == selectedLanguageID }?.name ?? "Türkçe"
    }

    var selectedLanguageCode: LanguageCode {
        languages.first { $0.id == selectedLanguageID }?.code ?? .tr
    }

    func t(_ key: String) -> String {
        localizedCopy[selectedLanguageCode]?[key] ?? localizedCopy[.tr]?[key] ?? key
    }

    func upper(_ key: String) -> String {
        t(key).uppercased(with: Locale(identifier: selectedLanguageCode.localeIdentifier))
    }

    func localizedMock(_ text: String) -> String {
        localizedMockContent[selectedLanguageCode]?[text] ?? text
    }

    func localizedEstimate(_ estimate: String) -> String {
        estimate.replacingOccurrences(of: " dk", with: " \(t("minuteShort"))")
    }

    func localizedNoticeDetail(_ detail: String) -> String {
        let pieces = detail.components(separatedBy: " · ")
        guard pieces.count == 2 else { return localizedMock(detail) }
        return "\(pieces[0]) · \(localizedMock(pieces[1]))"
    }

    func languageGroupTitle(_ group: String) -> String {
        upper(group)
    }

    func historyGroupTitle(_ group: String) -> String {
        switch group {
        case "BUGÜN": return upper("today")
        case "DÜN": return upper("yesterday")
        case "2 GÜN ÖNCE": return upper("twoDaysAgo")
        default: return group
        }
    }

    func historyStatus(_ status: JuiceEntryStatus) -> String {
        t(status.localizationKey)
    }

    var isConnected: Bool {
        if case .connected = connection { return true }
        return false
    }

    var deviceName: String {
        if case .connected(let name, _) = connection { return name }
        return availableDevices.first { $0.isKnown }?.name ?? "FreshPress 127325"
    }

    var connectionSummary: String {
        switch connection {
        case .connected(_, let battery): return "\(t("connectedShort")) · %\(battery)"
        case .connecting: return t("connecting")
        case .disconnected: return t("disconnectedShort")
        }
    }

    var connectionAccent: NoticeTint {
        switch connection {
        case .connected: return .green
        case .connecting: return .yellow
        case .disconnected: return .red
        }
    }

    var notificationSummary: String {
        let enabled = [notifyFinish, notifyMaintenance, notifyError, notifyTankFull, notifyVibration].filter { $0 }.count
        return "\(enabled)/5 \(t("enabledShort"))"
    }

    var soundSummary: String {
        let enabled = [soundJuicing, soundStart, soundFinish, hapticVibration].filter { $0 }.count
        return silentMode ? t("silent") : "\(enabled)/4 \(t("enabledShort"))"
    }

    func program(matching entry: JuiceEntry) -> Program? {
        programs.first { $0.name == entry.name }
    }

    // MARK: Helpers
    private func formatDuration(_ seconds: Int) -> String {
        String(format: "%02d:%02d", seconds / 60, seconds % 60)
    }

    private func elapsedDurationLabel(for program: Program) -> String {
        let elapsed = Int(Double(program.durationSeconds) * progress)
        return formatDuration(max(0, min(program.durationSeconds, elapsed)))
    }

    private func currentClock() -> String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.string(from: Date())
    }
}
