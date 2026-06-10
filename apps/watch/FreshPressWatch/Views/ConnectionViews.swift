import SwiftUI

// MARK: - Connection (Bağlı / Bağlanıyor… / Bağlı Değil)
struct ConnectionView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath
    @State private var pulse = false

    var body: some View {
        WatchScreen(title: store.t("connection")) {
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
                ActionRow(
                    title: store.t("addDevice"),
                    subtitle: store.t("addDeviceSubtitle"),
                    trailing: "\(store.availableDevices.count) \(store.t("devicePlural"))",
                    systemImage: "plus.circle.fill",
                    tint: Theme.blue
                ) {
                    path.append(Route.addDevice)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }

    private func connected(name: String, battery: Int) -> some View {
        VStack(spacing: 6) {
            ZStack {
                Circle().stroke(Theme.green.opacity(0.25), lineWidth: 6).frame(width: 68, height: 68)
                Circle().stroke(Theme.green, lineWidth: 6).frame(width: 54, height: 54)
                Image(systemName: "checkmark")
                    .font(.fp(24, .bold)).foregroundStyle(Theme.green)
            }
            Text(store.t("connected")).font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text(name).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text("\(store.t("battery")) %\(battery)").font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: store.t("disconnect"), tint: Theme.red.opacity(0.25), fg: Theme.red) {
                store.disconnect()
            }
            .padding(.top, 4)
        }
    }

    private var connecting: some View {
        VStack(spacing: 6) {
            ZStack {
                Circle()
                    .stroke(Theme.orange.opacity(pulse ? 0.08 : 0.22), lineWidth: 8)
                    .frame(width: pulse ? 76 : 56, height: pulse ? 76 : 56)
                ProgressView()
                    .progressViewStyle(.circular)
                    .tint(Theme.orange)
                    .scaleEffect(1.25)
            }
            .frame(height: 76)
            Text("\(store.t("connecting"))...").font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("searchingFreshPress")).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("mockBluetoothSim")).font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: store.t("cancel"), tint: Theme.cardElevated, fg: Theme.textPrimary) {
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
            Text(store.t("disconnectedTitle")).font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("deviceNotFound")).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
            Text(store.t("bringDeviceClose")).font(.fp(9)).foregroundStyle(Theme.textSecondary)
            PrimaryButton(title: store.t("reconnect")) {
                store.reconnect()
            }
            .padding(.top, 4)
        }
    }
}

// MARK: - Cihaz Ekle (pairing)
struct AddDeviceView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        WatchScreen(title: store.t("addDevice")) {
            VStack(spacing: 8) {
                Image(systemName: "plus.circle")
                    .font(.fp(40)).foregroundStyle(Theme.orange)
                Text(store.t("addDeviceTitle")).font(.fp(22, .bold)).foregroundStyle(Theme.textPrimary)
                Text(store.t("bringFreshPressClose")).font(.fp(11, .semibold)).foregroundStyle(Theme.textPrimary)
                Text(store.t("chooseMockDevice")).font(.fp(9)).foregroundStyle(Theme.textSecondary)

                SectionHeader(title: store.upper("foundDevices"))
                ForEach(store.availableDevices) { device in
                    deviceRow(device)
                }

                if store.isConnected {
                    PrimaryButton(title: store.t("returnConnection"), tint: Theme.cardElevated, fg: Theme.textPrimary) {
                        if !path.isEmpty { path.removeLast() }
                    }
                }
            }
            .frame(maxWidth: .infinity)
        }
    }

    private func deviceRow(_ device: MockDevice) -> some View {
        Button {
            store.pair(device)
        } label: {
            HStack(spacing: 8) {
                Image(systemName: device.isKnown ? "checkmark.seal.fill" : "sensor.tag.radiowaves.forward.fill")
                    .font(.fp(13, .bold))
                    .foregroundStyle(device.isKnown ? Theme.green : Theme.orange)
                    .frame(width: 18)

                VStack(alignment: .leading, spacing: 1) {
                    Text(device.name)
                        .font(.fp(11, .semibold))
                        .foregroundStyle(Theme.textPrimary)
                    Text("\(device.serial) · \(store.t("signal")) %\(device.signal)")
                        .font(.fp(8))
                        .foregroundStyle(Theme.textSecondary)
                }
                .lineLimit(1)
                .minimumScaleFactor(0.7)

                Spacer(minLength: 4)

                if store.pairingDeviceID == device.id {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(Theme.orange)
                        .scaleEffect(0.7)
                } else if case .connected(let name, _) = store.connection, name == device.name {
                    Image(systemName: "checkmark")
                        .font(.fp(11, .bold))
                        .foregroundStyle(Theme.green)
                } else {
                    Text(store.t("pair"))
                        .font(.fp(8, .bold))
                        .foregroundStyle(Theme.orange)
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
