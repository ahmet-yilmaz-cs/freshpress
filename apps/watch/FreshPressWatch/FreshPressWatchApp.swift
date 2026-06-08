import SwiftUI

/// Navigation destinations pushed onto the Home NavigationStack.
enum Route: Hashable {
    case programs
    case juicing
    case completed
    case detail(JuiceEntry)
    case history
    case notifications
    case connection
    case addDevice
    case settings
    case notificationSettings
    case soundSettings
    case language
    case about
}

@main
struct FreshPressWatchApp: App {
    @StateObject private var store = JuicerStore()
    @AppStorage("onboarded") private var onboarded = false

    var body: some Scene {
        WindowGroup {
            RootView(onboarded: $onboarded)
                .environmentObject(store)
                .preferredColorScheme(.dark)
        }
    }
}

/// Gates onboarding -> login -> home.
struct RootView: View {
    @Binding var onboarded: Bool
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        if !onboarded {
            OnboardingView(onboarded: $onboarded)
        } else if !store.isAuthenticated {
            LoginView()
        } else {
            HomeView()
        }
    }
}
