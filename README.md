# FreshPress

Companion app suite for the **FreshPress** smart cold-press juicer — a mobile app, an
Apple Watch app, and a (reference) mock backend, all built from one design system.

> Monorepo managed with **pnpm workspaces**. Mobile uses **Expo SDK 52 + expo-router +
> NativeWind**. Watch is **SwiftUI (watchOS)**. The mobile app runs on **on-device mock
> data** with predefined users — no backend required.

## Quick start

```bash
pnpm install

# Mobile (Expo)
pnpm mobile          # then press i / a / w, or scan the QR with Expo Go

# Watch (needs Xcode + xcodegen: `brew install xcodegen`)
cd apps/watch && xcodegen generate && open FreshPressWatch.xcodeproj

# Mock backend (optional reference — the apps don't depend on it)
pnpm api             # http://localhost:5050
```

### Demo login

The app ships predefined users (see `packages/data`). Try:

```
demo@freshpress.app / Demo1234
```

or tap **Continue with Apple** (mocked) to sign straight in.

## Structure

| Path                     | What                                                         |
| ------------------------ | ----------------------------------------------------------- |
| `apps/mobile`            | Expo app (auth, device control, explore, goals, profile)    |
| `apps/watch`             | SwiftUI watchOS app (all screens, full mock, Turkish copy)  |
| `apps/api`               | Flask + SQLite + JWT mock backend (reference, not wired in) |
| `packages/design-system` | Tokens + Tailwind/NativeWind preset                         |
| `packages/data`          | Hardcoded mock data: predefined users + per-user data       |
| `packages/types`         | Shared TypeScript domain types                              |
| `packages/validation`    | zod schemas for auth forms                                  |
| `packages/utils`         | Small pure helpers                                          |

See [`CLAUDE.md`](./CLAUDE.md) for architecture, the design-token reference, and
conventions.
