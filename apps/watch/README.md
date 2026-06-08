# FreshPress — Apple Watch app (watchOS, SwiftUI)

A wrist-first companion for the FreshPress smart juicer. Start and track juicing
sessions from your watch. **On-device mock data only — no backend/API.**

## Setup

```bash
brew install xcodegen          # one-time
cd apps/watch
xcodegen generate              # produces FreshPressWatch.xcodeproj
open FreshPressWatch.xcodeproj
```

Then in Xcode select the **FreshPressWatch** scheme and a **watchOS Simulator**
(e.g. Apple Watch Series 10) and Run. Deployment target: watchOS 10.0.

## Architecture

- One shared `JuicerStore: ObservableObject` (`Models.swift`) injected via
  `.environmentObject`. Holds auth, connection, weekly progress, active juicing
  session, settings toggles, language, history and notices.
- App entry `FreshPressWatchApp.swift` gates **Onboarding → Login → Home** using
  `@AppStorage("onboarded")` + `store.isAuthenticated`.
- Home hosts a single `NavigationStack` with a central `Route` table; every screen
  is pushed as a `Route`. Back chevrons are provided by the stack.
- Design tokens in `Theme.swift`; reusable views in `Views/Components.swift`.

## Navigation graph

```
Onboarding (Başla / Atla) → Login
Login (Telefonla Eşitle / Apple ile Giriş Yap) → Home
Home ──BAŞLAT──→ Programs ──(tap program → start session)──→ Juicing
Juicing ──(timer reaches 100%)──→ Completed + Completion sheet
Juicing ──DURDUR──→ Home
Completed ──Yeni Sıkım──→ Programs
Completion sheet ──Detayı Gör──→ Detail / ──Kapat──→ dismiss
Home ──→ Connection | History | Notifications | Settings
Connection (Bağlı / Bağlanıyor… / Bağlı Değil) ──Cihaz Ekle──→ AddDevice
History row → Detail ──Tekrar Sık──→ Juicing
Settings ──→ Connection | NotificationSettings | SoundSettings | Language | About
```

## How actions / mock data are wired

- **Auth:** both login buttons call `store.authenticate()` (sets `isAuthenticated`).
- **Juicing:** `startJuicing(program)` runs a `Timer` advancing `progress` 0→1
  (~6s demo). At 100% `finishJuicing()` increments `weeklyCount`, prepends a
  `JuiceEntry` to history + a green notice, and shows the completion `.sheet`.
- **Connection:** `disconnect()` / `reconnect()` / `pair()` mutate
  `store.connection`; connecting auto-advances to connected after ~1.6s.
- **Toggles:** Notification & Sound settings bind real `Toggle`s to `@Published`
  store flags.
- **Language:** selecting a row sets `selectedLanguageID`; the ✓ moves and the
  Settings "Dil" value updates.

## Screens

1. Onboarding "Hoş Geldin"  2. Login "Giriş Yap"  3. Home "FreshPress"
4. Programs "Program Seç"  5. Juicing "Sıkılıyor"  6. Completed "TAMAMLANDI"
7. Completion sheet  8. Detail "Detay"  9. History "Geçmiş" (+ empty state)
10. Notifications "Bildirimler" (+ empty state)  11–13. Connection
(Bağlı / Bağlanıyor… / Bağlı Değil)  14. Cihaz Ekle  15. Settings "Ayarlar"
16. Notification settings  17. Sound settings  18. Language "Dil"  19. About "Hakkında"
