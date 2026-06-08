# FreshPress — CLAUDE.md

Guidance for working in this repository. FreshPress is the companion app suite for a
**smart cold-press juicer** (the "JuiceLab Pro X1"). It ships a mobile app, an Apple
Watch app, and a mock backend, all driven from a shared design system.

## Monorepo layout

```
freshpress/implementation/            # repo root (pnpm workspace)
├── apps/
│   ├── mobile/    # Expo SDK 52 + expo-router + NativeWind (iOS/Android/web)
│   ├── watch/     # SwiftUI watchOS app (XcodeGen project) — mock data only
│   └── api/       # Flask + SQLite + JWT mock backend (kept for reference)
├── packages/
│   ├── design-system/  # tokens (colors/type/spacing) + Tailwind/NativeWind preset
│   ├── data/           # hardcoded mock data: predefined users + per-user data
│   ├── types/          # shared TS domain types
│   ├── validation/     # zod schemas (login/register) + fieldErrors()
│   └── utils/          # small pure helpers (clamp, formatMl, formatDuration, sleep)
└── pnpm-workspace.yaml, tsconfig.base.json, package.json
```

## Data strategy (important)

The **mobile app runs entirely on on-device mock data** from `@freshpress/data` — it does
**not** call the network. Predefined users have hardcoded credentials and distinct
per-user history/goals/device state. The mock service layer in the app simulates latency
and error responses (bad credentials, duplicate email) so the auth UX is realistic.

The **watch app** is fully mocked in Swift via `JuicerStore` (`apps/watch/.../Models.swift`) —
no API wiring.

The **Flask API (`apps/api`) is kept but not wired into the apps.** It's a working
reference (register/login/me/refresh + device/recipes) if a real backend is ever needed.
Leave it as-is unless explicitly asked.

## Commands (run from repo root)

```bash
pnpm install              # install JS workspace deps (hoisted, see .npmrc)
pnpm mobile               # expo start
pnpm ios / pnpm android / pnpm web
pnpm typecheck            # tsc across all packages
pnpm api                  # run Flask mock backend (reference only) on :5050

# Watch (needs xcodegen + Xcode):
cd apps/watch && xcodegen generate && open FreshPressWatch.xcodeproj
```

## Design system — single source of truth

Tokens live in `packages/design-system/src/tokens.ts` and are exposed to the app as
NativeWind classes via `src/tailwind-preset.js`. **Always use these tokens; never hardcode
hex values in screens.**

- Brand: `orange #ff8200`, `amber #954a00` (deep CTA/heading), `green #91f68d` (action)
- Neutrals: `ink #1a1c1c`, `muted #574235`, `bg #f9f9f9`, `card #fff`, `subtle #f3f3f4`,
  `track #e2e2e2`, `hairline #eeeeee`, `border-warm #dec1af`
- Font: **Plus Jakarta Sans** (400/500/600/700/800) via `@expo-google-fonts`
- Type scale: display 40/48, h2 32/40, h3 20/28, body 16/24, eyebrow 12/16 (+0.6 tracking)
- Radius: cards 12, small 8, pills full

The watch app mirrors these as a **dark** theme in `apps/watch/.../Theme.swift`
(bg `#000`, cards `#1c1c1e`/`#2c2c2e`, system green `#30d158`, brand orange `#ff8200`).

## Conventions

- TypeScript strict, `noUncheckedIndexedAccess` on — guard array/object index access.
- UI is composed from `apps/mobile/src/components/ui/*` (Text, Button, Card, Badge, Input,
  Screen). Add new primitives there; keep screens declarative.
- Routing is file-based (`expo-router`): `app/(auth)/*` for the unauthenticated flow,
  `app/(tabs)/*` for the main app; the root layout gates on auth status.
- Shared packages are imported as `@freshpress/*` (workspace + tsconfig path aliases).
- Prettier: single quotes, trailing commas, width 100.
- Mock data is the contract — when adding a screen, add its data to `@freshpress/data`
  rather than inlining literals in the component.

## The app (FreshPress) at a glance

Smart-juicer companion: onboarding/auth → Device Control home (connection status, battery,
START JUICING, yield/capacity) → Explore (recipes) → Goals (weekly stats + calories) →
Profile/Settings. The juicing flow goes Recipe/Program → Preparing → Ready. The watch app
is a wrist remote: weekly counter, start a program, live juicing progress, history,
notifications, connection management, and settings — all in Turkish to match the design.
