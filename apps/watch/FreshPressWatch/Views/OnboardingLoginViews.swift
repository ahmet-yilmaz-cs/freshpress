import SwiftUI

// MARK: - Onboarding "Hoş Geldin"
struct OnboardingView: View {
    @Binding var onboarded: Bool
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        WatchScreen(showsBack: false) {
            VStack(spacing: 8) {
                LogoMark(size: 56)
                    .padding(.top, 6)
                Text(store.t("welcome"))
                    .font(.fp(18, .bold))
                    .foregroundStyle(Theme.textPrimary)
                Text(store.t("onboardingSubtitle"))
                    .font(.fp(9))
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 6)

                PrimaryButton(title: store.t("startIntro")) { onboarded = true }
                    .padding(.top, 6)
                TextButton(title: store.t("skip")) { onboarded = true }
            }
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - Login "Giriş Yap"
struct LoginView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        WatchScreen(showsBack: false) {
            VStack(spacing: 6) {
                HStack(spacing: 8) {
                    LogoMark(size: 30)
                    Text(store.t("login"))
                        .font(.fp(16, .bold))
                        .foregroundStyle(Theme.textPrimary)
                }
                Text(store.t("connectAccount"))
                    .font(.fp(8))
                    .foregroundStyle(Theme.textSecondary)

                Card {
                    HStack(spacing: 8) {
                        StatusDot(connected: true, tint: Theme.green)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(store.account.name)
                                .font(.fp(11, .bold))
                                .foregroundStyle(Theme.textPrimary)
                            Text(store.account.lastSync)
                                .font(.fp(8, .semibold))
                                .foregroundStyle(Theme.green)
                        }
                        Spacer(minLength: 4)
                        Text(store.t("mock"))
                            .font(.fp(8, .bold))
                            .foregroundStyle(Theme.textSecondary)
                    }
                }

                PrimaryButton(title: store.t("syncPhone")) { store.authenticateWithPhone() }
                AppleSignInButton(title: store.t("appleSignIn")) { store.authenticateWithApple() }
            }
            .frame(maxWidth: .infinity)
        }
    }
}
