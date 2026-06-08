import SwiftUI

// MARK: - Programs "Program Seç"
struct ProgramsView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    private var featured: [Program] { Array(store.programs.prefix(3)) }
    private var more: [Program] { Array(store.programs.dropFirst(3)) }

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                SectionHeader(title: "PROGRAMLAR")
                ForEach(featured) { p in row(p) }
                SectionHeader(title: "DAHA FAZLA")
                ForEach(more) { p in row(p) }
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Program Seç")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func row(_ p: Program) -> some View {
        Button {
            store.startJuicing(p)
            path.append(Route.juicing)
        } label: {
            HStack(spacing: 8) {
                VStack(alignment: .leading, spacing: 1) {
                    Text(p.name).font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                    Text("\(p.volumeMl) ml · \(p.estimate)").font(.fp(9)).foregroundStyle(Theme.textSecondary)
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

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                ProgressRing(progress: store.progress)
                    .frame(width: 96, height: 96)
                VStack(spacing: 1) {
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Theme.orange)
                            .frame(width: 6, height: 6)
                            .opacity(pulse ? 0.3 : 1)
                        Text("Sıkılıyor").font(.fp(8, .semibold)).foregroundStyle(Theme.textSecondary)
                    }
                    Text("%\(store.progressPercent)")
                        .font(.fp(26, .heavy))
                        .foregroundStyle(Theme.textPrimary)
                }
            }
            .onAppear { withAnimation(.easeInOut(duration: 0.7).repeatForever()) { pulse = true } }

            VStack(spacing: 1) {
                Text(store.activeProgram?.name ?? "")
                    .font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                Text(store.remainingLabel)
                    .font(.fp(9)).foregroundStyle(Theme.textSecondary)
            }

            PrimaryButton(title: "DURDUR", tint: Theme.red.opacity(0.25), fg: Theme.red) {
                store.stopJuicing()
                path = NavigationPath()
            }
        }
        .padding(.horizontal, 12)
        .background(Theme.bg)
        .navigationTitle("Sıkılıyor")
        .navigationBarTitleDisplayMode(.inline)
        .onChange(of: store.showCompletionSheet) { _, shown in
            // when timer completes, advance the stack to Completed
            if shown { path.append(Route.completed) }
        }
    }
}

// MARK: - Completed "TAMAMLANDI"
struct CompletedView: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.fp(44))
                .foregroundStyle(Theme.green)
            Text("TAMAMLANDI")
                .font(.fp(8, .bold))
                .foregroundStyle(Theme.textSecondary)
            if let p = store.activeProgram {
                Text("\(p.volumeMl) ml · \(p.name)")
                    .font(.fp(10, .semibold))
                    .foregroundStyle(Theme.textPrimary)
            }
            PrimaryButton(title: "Yeni Sıkım") {
                path = NavigationPath()
                path.append(Route.programs)
            }
            .padding(.top, 4)
        }
        .padding(.horizontal, 12)
        .background(Theme.bg)
        .navigationTitle("Tamamlandı")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Completion sheet "Sıkım tamamlandı"
struct CompletionSheet: View {
    @EnvironmentObject var store: JuicerStore
    @Binding var path: NavigationPath
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.fp(20))
                    .foregroundStyle(Theme.green)
                Text("Sıkım tamamlandı")
                    .font(.fp(18, .bold))
                    .foregroundStyle(Theme.textPrimary)
                if let p = store.activeProgram {
                    Text("\(p.volumeMl) ml · \(p.name)")
                        .font(.fp(9)).foregroundStyle(Theme.textSecondary)
                }
                PrimaryButton(title: "Detayı Gör") {
                    if let p = store.activeProgram, let entry = store.history.first(where: { $0.name == p.name }) {
                        dismiss()
                        path.append(Route.detail(entry))
                    } else {
                        dismiss()
                    }
                }
                .padding(.top, 4)
                TextButton(title: "Kapat") { dismiss() }
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
        }
        .background(Theme.bg)
    }
}

// MARK: - Detail "Detay"
struct DetailView: View {
    @EnvironmentObject var store: JuicerStore
    let entry: JuiceEntry
    @Binding var path: NavigationPath

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text(entry.name)
                    .font(.fp(12, .semibold)).foregroundStyle(Theme.textPrimary)
                Text("\(entry.volumeMl) ml")
                    .font(.fp(36, .heavy)).foregroundStyle(Theme.orange)
                Text(entry.ingredients.isEmpty ? "—" : entry.ingredients)
                    .font(.fp(8)).foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)

                HStack(spacing: 6) {
                    StatTile(label: "SÜRE", value: entry.durationLabel)
                    StatTile(label: "SAAT", value: entry.time)
                    StatTile(label: "DURUM", value: "✓ İyi")
                }

                PrimaryButton(title: "Tekrar Sık") {
                    if let p = store.programs.first(where: { $0.name == entry.name }) {
                        store.startJuicing(p)
                    } else if let p = store.programs.first {
                        store.startJuicing(p)
                    }
                    path.append(Route.juicing)
                }
                .padding(.top, 2)
            }
            .padding(.horizontal, 10)
        }
        .background(Theme.bg)
        .navigationTitle("Detay")
        .navigationBarTitleDisplayMode(.inline)
    }
}
