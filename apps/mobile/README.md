# FreshPress — Mobile app (Expo / React Native)

The companion app for the **JuiceLab Pro X1** smart cold-press juicer. Built with
**Expo SDK 52 + expo-router + NativeWind**, **Turkish-first**, and driven entirely by
**on-device mock data** (`@freshpress/data`) — no backend required.

## Setup

```bash
pnpm install            # from the repo root (pnpm workspace)
pnpm mobile             # expo start — press i (iOS), a (Android), w (web)
# or build & run a dev client directly:
pnpm ios                # expo run:ios
pnpm android            # expo run:android
```

### Demo login

```
demo@freshpress.app / Demo1234
```

or tap **Apple ile Devam Et** (mocked Sign in with Apple) to enter as the demo user.
Other predefined users live in `packages/data`.

## Environment

Public config only (no secrets). Copy the example and adjust if needed:

```bash
cp .env.example .env
```

| Var                   | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | Base URL of the reference Flask API (not wired in).  |

`EXPO_PUBLIC_*` vars are embedded in the client bundle — never put secrets here.

## Structure

```
app/                       file-based routes (expo-router)
  (auth)/                  welcome · login · register   (unauthenticated flow)
  (tabs)/                  index(Makine) · explore · stock · goals · profile
  recipe/[id], juicing, ready, pairing, notifications,
  account, calories, device-info, help, history, settings
src/
  components/ui/           Text · Button · Card · Badge · Input · Screen · BackBar
                           · AppleButton · AppleLogo
  components/              AppHeader · BottomSheet (gorhom) · FreshPressPrimitives
  i18n/strings.ts          Turkish UI copy + enum label maps (single source of strings)
  lib/                     preferences (persisted toggles) · visuals · storage · cn
  auth/AuthContext.tsx     mock session (login/register/apple/updateProfile/logout)
  api/client.ts            local mock "API" over @freshpress/data (simulated latency)
plugins/
  withFmtConstevalFix.js   config plugin — patches the fmt pod for Apple clang 16+/Xcode 16+
assets/                    icon · adaptive-icon · monochrome · splash · favicon
```

## Conventions

- **Strings:** add UI copy to `src/i18n/strings.ts` (`t.*`). Semantic enum values
  (device status/speed, history group, quality, units) stay as English keys in the
  data layer and are mapped to Turkish via `labels` — never translate the data value.
- **Design tokens:** use `@freshpress/design-system` NativeWind classes; never hardcode
  hex in screens.
- **Mock data is the contract:** new screen data goes in `@freshpress/data`, not inline.
- **Bottom sheets** use `@gorhom/bottom-sheet` via the shared `BottomSheet` component.

## Native build note

`apps/mobile/ios` and `android` are git-ignored (Continuous Native Generation). On
Apple clang 16+/Xcode 16+, the bundled `fmt 11.0.2` breaks the iOS build with a
`consteval` error — the `withFmtConstevalFix` config plugin patches `fmt/base.h`
during `pod install`, so it survives `expo prebuild`. Nothing to run manually.
