#!/usr/bin/env python3
"""Read App Store Connect build status without archiving, signing or uploading."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
import re

from codemagic_prepare import ROOT, cli_json


def collect_status():
    app_id = os.environ.get("APP_STORE_APPLE_ID", "").strip()
    if not re.fullmatch(r"[0-9]+", app_id):
        raise ValueError("APP_STORE_APPLE_ID must be the numeric App Store Connect app ID.")
    config = (ROOT / "Configuration/App.xcconfig").read_text()
    bundle_id = re.search(r"^PRODUCT_BUNDLE_IDENTIFIER\s*=\s*(\S+)\s*$", config, re.M).group(1)
    app = cli_json("apps", "get", app_id)
    if not isinstance(app, dict) or app.get("attributes", {}).get("bundleId") != bundle_id:
        raise ValueError("The Apple app record does not match the configured bundle ID.")
    # No processing-state, version or expiry filters: include every available state.
    builds = cli_json("apps", "builds", app_id)
    if not isinstance(builds, list):
        raise ValueError("Apple did not return a build list; this is not an empty-build result.")
    versions = cli_json("apps", "pre-release-versions", app_id) if builds else []
    if not isinstance(versions, list):
        raise ValueError("Apple did not return the version list.")
    version_names = {v["id"]: v.get("attributes", {}).get("version") for v in versions}
    result = []
    for build in builds:
        attributes = build.get("attributes", {})
        relationships = build.get("relationships") or {}
        relationship = (relationships.get("preReleaseVersion") or {}).get("data") or {}
        result.append({
            "buildId": build.get("id"),
            "appVersion": version_names.get(relationship.get("id")),
            "buildNumber": attributes.get("version"),
            "processingState": attributes.get("processingState"),
            "uploadedDate": attributes.get("uploadedDate"),
            "expired": attributes.get("expired"),
        })
    result.sort(key=lambda b: b["uploadedDate"] or "", reverse=True)
    return {
        "checkedAtUTC": datetime.now(timezone.utc).isoformat(),
        "appleId": app_id,
        "bundleId": bundle_id,
        "appName": app.get("attributes", {}).get("name"),
        "availableBuildCount": len(result),
        "latestBuilds": result[:20],
        "note": (
            "Apple returned no build records. This does not distinguish delayed processing from a pre-processing validation failure. Compare the upload receipt/time in the Publishing log; if still missing, contact Apple Developer Support with that receipt."
            if not result else
            "Compare the version/build number with the Publishing log. PROCESSING is still being processed; VALID has completed processing; FAILED or INVALID needs Apple's validation details. This report does not submit builds for review or change tester access."
        ),
    }


def main():
    report = collect_status()
    Path("/tmp/app-store-status.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
