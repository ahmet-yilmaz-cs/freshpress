import SwiftUI

// MARK: - Onboarding "Hoş Geldin"
struct OnboardingView: View {
    @Binding var onboarded: Bool

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                LogoMark(size: 56)
                    .padding(.top, 6)
                Text("Hoş Geldin")
                    .font(.fp(18, .bold))
                    .foregroundStyle(Theme.textPrimary)
                Text("Bileğinden sıkım başlat ve takip et")
                    .font(.fp(9))
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 6)

                PrimaryButton(title: "Başla") { onboarded = true }
                    .padding(.top, 6)
                TextButton(title: "Atla") { onboarded = true }
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.bg)
    }
}

// MARK: - Login "Giriş Yap"
struct LoginView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                LogoMark(size: 48)
                    .padding(.top, 4)
                Text("Giriş Yap")
                    .font(.fp(18, .bold))
                    .foregroundStyle(Theme.textPrimary)
                Text("FreshPress hesabını bağla")
                    .font(.fp(9))
                    .foregroundStyle(Theme.textSecondary)

                PrimaryButton(title: "Telefonla Eşitle") { store.authenticate() }
                    .padding(.top, 6)
                AppleSignInButton { store.authenticate() }
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.bg)
    }
}
