#!/usr/bin/env python3
"""Verify the App Store app and choose an unused build number before archiving."""
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def choose_build_number(latest, current, ci_number):
    values = [str(current), str(ci_number or "0")]
    if latest not in (None, ""):
        values.append(str(latest))
    if any(not re.fullmatch(r"[0-9]+", value) for value in values):
        raise ValueError("Build numbers must be positive integers; check the existing TestFlight version.")
    return max(int(current), int(ci_number or 0) + 1, int(latest or 0) + 1)


def cli_json(*arguments):
    # Preserve authentication injected by the named Codemagic integration.
    # Failed authentication/network calls stop deployment; never treat them as an empty app.
    output = subprocess.check_output(["app-store-connect", "--json", *arguments], text=True)
    return json.loads(output) if output.strip() else None


def main():
    app_id = os.environ.get("APP_STORE_APPLE_ID", "").strip()
    if not re.fullmatch(r"[0-9]+", app_id):
        raise SystemExit("Create the App Store Connect app first, then set its numeric Apple ID as APP_STORE_APPLE_ID in Codemagic group riyadh_polo_app_store.")
    config_path = ROOT / "Configuration/App.xcconfig"
    config = config_path.read_text()
    bundle_id = re.search(r"^PRODUCT_BUNDLE_IDENTIFIER\s*=\s*(\S+)\s*$", config, re.M).group(1)
    app = cli_json("apps", "get", app_id)
    if not isinstance(app, dict) or app.get("attributes", {}).get("bundleId") != bundle_id:
        raise SystemExit("The App Store Apple ID does not match " + bundle_id + ". Check the app record before publishing.")
    latest = cli_json("get-latest-testflight-build-number", app_id)
    current = re.search(r"^CURRENT_PROJECT_VERSION\s*=\s*([0-9]+)\s*$", config, re.M).group(1)
    number = choose_build_number(latest, current, os.environ.get("PROJECT_BUILD_NUMBER") or os.environ.get("BUILD_NUMBER"))
    config_path.write_text(re.sub(r"^CURRENT_PROJECT_VERSION\s*=.*$", "CURRENT_PROJECT_VERSION = " + str(number), config, flags=re.M))
    print("Verified App Store app " + app_id + " for " + bundle_id + "; archive build number " + str(number))


if __name__ == "__main__":
    main()
