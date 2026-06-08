import SwiftUI

// MARK: - Connection (Bağlı / Bağlanıyor… / Bağlı Değil)
struct ConnectionView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                switch store.connection {
                case .connected(let name, let battery):
                    connected(name: name, battery: battery)
                case .connecting:
                    connecting
                case .disconnected:
                    disconnected
                }

                // pairing entry point
                Button { path.append(Route.addDevice) } label: {
                    Text("Cihaz Ekle")
                        .font(.fp(11, .semibold))
                        .foregroundStyle(Theme.blue)
                        .padding(.top, 2)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.bg)
        .navigationTitle("Bağlantı")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func connected(name: String, battery: Int) -> some View {
        VStack(spacing: 6) {
            ZStack {
                Circle().stroke(Theme.green, lineWidth: 6).frame(width: 64, height: 64)
                Image(systemName: "checkmark")
                    .font(.fp(24, .bold)).foregroundStyle(Theme.green)
            }
            Text("Bağlı").font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text(name).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("Batarya %\(battery)").font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: "Bağlantıyı Kes", tint: Theme.red.opacity(0.25), fg: Theme.red) {
                store.disconnect()
            }
            .padding(.top, 4)
        }
    }

    private var connecting: some View {
        VStack(spacing: 6) {
            ProgressView()
                .progressViewStyle(.circular)
                .tint(Theme.orange)
                .scaleEffect(1.4)
                .frame(height: 56)
            Text("Bağlanıyor…").font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text("FreshPress aranıyor").font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("Lütfen bekleyin").font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: "İptal", tint: Theme.cardElevated, fg: Theme.textPrimary) {
                store.cancelConnecting()
            }
            .padding(.top, 4)
        }
    }

    private var disconnected: some View {
        VStack(spacing: 6) {
            ZStack {
                Circle().stroke(Theme.textTertiary, lineWidth: 6).frame(width: 64, height: 64)
                Image(systemName: "wifi.slash")
                    .font(.fp(22, .bold)).foregroundStyle(Theme.textTertiary)
            }
            Text("Bağlı Değil").font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text("Cihaz bulunamadı").font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("Cihazı yakınına getir").font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: "Yeniden Bağlan") {
                store.reconnect()
            }
            .padding(.top, 4)
        }
    }
}

// MARK: - Cihaz Ekle (pairing)
struct AddDeviceView: View {
    @EnvironmentObject var store: JuicerStore

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Image(systemName: "plus.circle")
                    .font(.fp(40)).foregroundStyle(Theme.orange)
                Text("Cihaz Ekle").font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
                Text("FreshPress'i yakınına getir").font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                Text("Eşleştirme modu").font(.fp(9)).foregroundStyle(Theme.textSecondary)
                PrimaryButton(title: "Eşleştir") { store.pair() }
                    .padding(.top, 4)

                if case .connecting = store.connection {
                    Text("Bağlanıyor…").font(.fp(9)).foregroundStyle(Theme.orange)
                } else if case .connected = store.connection {
                    Text("Bağlandı ✓").font(.fp(9)).foregroundStyle(Theme.green)
                }
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.bg)
        .navigationTitle("Cihaz Ekle")
        .navigationBarTitleDisplayMode(.inline)
    }
}
