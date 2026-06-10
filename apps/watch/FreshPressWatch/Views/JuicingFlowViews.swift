import SwiftUI

// MARK: - Programs "Program Seç"
struct ProgramsView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    private var featured: [Program] { Array(store.programs.prefix(3)) }
    private var more: [Program] { Array(store.programs.dropFirst(3)) }

    var body: some View {
        WatchScreen(title: store.t("programs")) {
            VStack(spacing: 6) {
                if store.isConnected {
                    SectionHeader(title: store.upper("programsSection"))
                    ForEach(featured) { p in row(p) }
                    SectionHeader(title: store.upper("more"))
                    ForEach(more) { p in row(p) }
                } else {
                    Card {
                        VStack(alignment: .leading, spacing: 6) {
                            Image(systemName: "wifi.slash")
                                .font(.fp(18, .bold))
                                .foregroundStyle(Theme.red)
                            Text(store.t("noDevice"))
                                .font(.fp(13, .bold))
                                .foregroundStyle(Theme.textPrimary)
                            Text(store.t("connectForProgram"))
                                .font(.fp(9))
                                .foregroundStyle(Theme.textSecondary)
                                .fixedSize(horizontal: false, vertical: true)
                            PrimaryButton(title: store.t("bluetoothGo")) {
                                path.append(Route.connection)
                            }
                        }
                    }
                }
            }
        }
    }

    private func row(_ p: Program) -> some View {
        Button {
            if store.isConnected {
                store.startJuicing(p)
                path.append(Route.juicing)
            } else {
                path.append(Route.connection)
            }
        } label: {
            HStack(spacing: 8) {
                VStack(alignment: .leading, spacing: 1) {
                    Text(store.localizedMock(p.name)).font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                    Text("\(p.volumeMl) ml · \(store.localizedEstimate(p.estimate))").font(.fp(9)).foregroundStyle(Theme.textSecondary)
                }
                Spacer(minLength: 4)
                VolumeBadge(volumeMl: p.volumeMl)
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

// MARK: - Juicing "Sıkılıyor"
struct JuicingView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath
    @State private var pulse = false
    @State private var didNavigateToCompletion = false

    var body: some View {
        WatchScreen(title: store.isJuicingPaused ? store.t("paused") : store.t("juicing"), scrolls: false, horizontalPadding: 12) {
            VStack(spacing: 8) {
                ZStack {
                    ProgressRing(progress: store.progress, tint: store.isJuicingPaused ? Theme.yellow : Theme.orange)
                        .frame(width: 96, height: 96)
                    VStack(spacing: 1) {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(store.isJuicingPaused ? Theme.yellow : Theme.orange)
                                .frame(width: 6, height: 6)
                                .opacity(store.isJuicing ? (pulse ? 0.3 : 1) : 1)
                            Text(store.isJuicingPaused ? store.t("pausedStatus") : store.t("juicingStatus"))
                                .font(.fp(8, .semibold))
                                .foregroundStyle(Theme.textSecondary)
                        }
                        Text("%\(store.progressPercent)")
                            .font(.fp(26, .heavy))
                            .foregroundStyle(Theme.textPrimary)
                    }
                }
                .animation(.easeInOut(duration: 0.2), value: store.isJuicingPaused)
                .onAppear { withAnimation(.easeInOut(duration: 0.7).repeatForever()) { pulse = true } }

                VStack(spacing: 1) {
                    Text(store.localizedMock(store.activeProgram?.name ?? ""))
                        .font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                    Text(store.remainingLabel)
                        .font(.fp(9)).foregroundStyle(Theme.textSecondary)
                }

                if store.isJuicingPaused {
                    HStack(spacing: 6) {
                        PrimaryButton(title: store.upper("cancelUpper"), tint: Theme.red.opacity(0.25), fg: Theme.red) {
                            store.cancelJuicing()
                            path = NavigationPath()
                        }
                        PrimaryButton(title: store.upper("resume"), tint: Theme.green, fg: .black) {
                            store.resumeJuicing()
                        }
                    }
                    .transition(.opacity.combined(with: .scale(scale: 0.96)))
                } else {
                    PrimaryButton(title: store.upper("stop"), tint: Theme.red.opacity(0.25), fg: Theme.red) {
                        store.pauseJuicing()
                    }
                    .transition(.opacity.combined(with: .scale(scale: 0.96)))
                }
            }
        }
        .onChange(of: store.progress) { _, progress in
            if progress >= 1, store.lastCompletedEntry != nil, !didNavigateToCompletion {
                didNavigateToCompletion = true
                path.append(Route.completed)
            }
        }
    }
}

// MARK: - Completed "TAMAMLANDI"
struct CompletedView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        WatchScreen(title: store.t("completed"), scrolls: false, horizontalPadding: 12) {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.fp(44))
                    .foregroundStyle(Theme.green)
                    .symbolEffect(.bounce, value: store.lastCompletedEntry?.id)
                Text(store.upper("completedUpper"))
                    .font(.fp(8, .bold))
                    .foregroundStyle(Theme.textSecondary)
                if let entry = store.lastCompletedEntry {
                    Text("\(entry.volumeMl) ml · \(store.localizedMock(entry.name))")
                        .font(.fp(10, .semibold))
                        .foregroundStyle(Theme.textPrimary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                }
                PrimaryButton(title: store.t("viewDetail")) {
                    if let entry = store.lastCompletedEntry ?? store.history.first {
                        path.append(Route.detail(entry))
                    }
                }
                PrimaryButton(title: store.t("newJuice"), tint: Theme.cardElevated, fg: Theme.textPrimary) {
                    path = NavigationPath()
                    path.append(Route.programs)
                }
                TextButton(title: store.t("home")) {
                    path = NavigationPath()
                }
            }
        }
    }
}

// MARK: - Completion sheet "Sıkım tamamlandı"
struct CompletionSheet: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        WatchScreen(title: store.t("completed"), showsBack: false) {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.fp(20))
                    .foregroundStyle(Theme.green)
                Text(store.t("juicingCompleted"))
                    .font(.fp(18, .bold))
                    .foregroundStyle(Theme.textPrimary)
                if let p = store.activeProgram {
                    Text("\(p.volumeMl) ml · \(store.localizedMock(p.name))")
                        .font(.fp(9)).foregroundStyle(Theme.textSecondary)
                }
                PrimaryButton(title: store.t("viewDetail")) {
                    if let p = store.activeProgram, let entry = store.history.first(where: { $0.name == p.name }) {
                        dismiss()
                        path.append(Route.detail(entry))
                    } else {
                        dismiss()
                    }
                }
                .padding(.top, 4)
                TextButton(title: store.t("close")) { dismiss() }
            }
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - Detail "Detay"
struct DetailView: View {
    @EnvironmentObject var store: JuicerStore
    let entry: JuiceEntry
    @Binding var path: NavigationPath

    var body: some View {
        WatchScreen(title: store.t("detail")) {
            VStack(spacing: 6) {
                Text(store.localizedMock(entry.name))
                    .font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                Text("\(entry.volumeMl) ml")
                    .font(.fp(31, .heavy)).foregroundStyle(Theme.orange)
                Text(entry.ingredients.isEmpty ? "—" : store.localizedMock(entry.ingredients))
                    .font(.fp(8)).foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)

                HStack(spacing: 6) {
                    StatTile(label: store.upper("duration"), value: entry.durationLabel)
                    StatTile(label: store.upper("time"), value: entry.time)
                    StatTile(label: store.upper("status"), value: "\(entry.status.symbol) \(store.historyStatus(entry.status))")
                }

                PrimaryButton(title: store.t("repeatJuice")) {
                    guard store.isConnected else {
                        path.append(Route.connection)
                        return
                    }
                    if let p = store.program(matching: entry) {
                        store.startJuicing(p)
                    } else if let p = store.programs.first {
                        store.startJuicing(p)
                    }
                    path.append(Route.juicing)
                }
                .padding(.top, 2)
            }
        }
    }
}
