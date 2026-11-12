#!/usr/bin/env bash
set -euo pipefail
DEVICE_ID=$(xcrun simctl list devices available --json | python3 -c 'import json,sys; data=json.load(sys.stdin); print(next(device["udid"] for devices in data["devices"].values() for device in devices if device["name"].startswith("iPhone")))')
xcodebuild test \
  -project ios/RiyadhPoloHills.xcodeproj \
  -scheme RiyadhPoloHills \
  -destination "platform=iOS Simulator,id=$DEVICE_ID" \
  -derivedDataPath ios/DerivedData \
  -resultBundlePath ios/TestResults.xcresult \
  CODE_SIGNING_ALLOWED=NO
