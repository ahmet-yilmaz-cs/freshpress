#!/usr/bin/env bash
# Build + install + launch the FreshPress watchOS app on a watch simulator.
# Mirrors `pnpm mobile` (native build, not Expo Go) for the watch.
set -uo pipefail
cd "$(dirname "$0")"

SCHEME="FreshPressWatch"
PROJECT="FreshPressWatch.xcodeproj"
BUNDLE_ID="com.freshpress.watch"

# 1. Need Xcode.
if ! xcode-select -p >/dev/null 2>&1; then
  echo "✗ Xcode is required. Install it from the App Store, then run again."
  exit 1
fi

# 2. Need XcodeGen to produce the .xcodeproj.
if ! command -v xcodegen >/dev/null 2>&1; then
  echo "✗ xcodegen not found. Install it with:  brew install xcodegen"
  echo "  (it turns project.yml into ${PROJECT})"
  exit 1
fi

echo "→ Generating ${PROJECT} from project.yml..."
xcodegen generate

# 3. Pick a watchOS simulator (first available device) — portable JSON parse.
WATCH_UDID=$(xcrun simctl list devices available --json | python3 -c '
import json, sys
data = json.load(sys.stdin)["devices"]
for runtime, devices in data.items():
    if "watchOS" in runtime:
        for d in devices:
            if d.get("isAvailable", True):
                print(d["udid"]); sys.exit(0)
')

if [ -z "${WATCH_UDID:-}" ]; then
  echo "⚠ No watchOS simulator found. Opening Xcode — add a watch simulator and press ⌘R."
  open "${PROJECT}"
  exit 0
fi

echo "→ Building ${SCHEME}..."
set -e
xcodebuild \
  -project "${PROJECT}" \
  -scheme "${SCHEME}" \
  -configuration Debug \
  -destination "id=${WATCH_UDID}" \
  -derivedDataPath build \
  build | tail -5

APP_PATH=$(find build/Build/Products -name "${SCHEME}.app" -type d | head -1)
if [ -z "${APP_PATH}" ]; then
  echo "⚠ Build product not found. Opening Xcode instead."
  open "${PROJECT}"
  exit 0
fi

echo "→ Booting simulator + installing..."
xcrun simctl boot "${WATCH_UDID}" 2>/dev/null || true
open -a Simulator
xcrun simctl install "${WATCH_UDID}" "${APP_PATH}"
xcrun simctl launch "${WATCH_UDID}" "${BUNDLE_ID}"
echo "✓ FreshPress is running on the watch simulator."
