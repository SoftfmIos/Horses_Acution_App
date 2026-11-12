import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import codemagic_status


class AppStoreStatusTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.config = self.root / "Configuration/App.xcconfig"
        self.config.parent.mkdir()
        self.original = "PRODUCT_BUNDLE_IDENTIFIER = com.riyadhpolohills.academy\nCURRENT_PROJECT_VERSION = 3\n"
        self.config.write_text(self.original)
        self.app = {"attributes": {"bundleId": "com.riyadhpolohills.academy", "name": "Riyadh Polo Hills"}}

    def collect(self, responses):
        with patch.object(codemagic_status, "ROOT", self.root), patch.dict(os.environ, {"APP_STORE_APPLE_ID": "6834111389"}, clear=True), patch.object(codemagic_status, "cli_json", side_effect=responses) as command:
            report = codemagic_status.collect_status()
            return report, [call.args for call in command.call_args_list]

    def test_empty_list_is_not_reported_as_rejection_or_successful_processing(self):
        report, commands = self.collect([self.app, []])
        self.assertEqual(report["availableBuildCount"], 0)
        self.assertIn("does not distinguish", report["note"])
        self.assertEqual(commands, [("apps", "get", "6834111389"), ("apps", "builds", "6834111389")])
        self.assertEqual(self.config.read_text(), self.original)

    def test_versions_and_all_processing_states_are_reported_without_filters(self):
        builds = [{"id": state, "attributes": {"version": str(index), "processingState": state, "uploadedDate": f"2026-11-13T0{index}:00:00Z", "expired": index == 0}, "relationships": {"preReleaseVersion": {"data": {"id": "release"}}}} for index, state in enumerate(["VALID", "PROCESSING", "FAILED", "INVALID"])]
        report, commands = self.collect([self.app, builds, [{"id": "release", "attributes": {"version": "1.0.2"}}]])
        self.assertEqual(report["availableBuildCount"], 4)
        self.assertEqual(report["latestBuilds"][0]["processingState"], "INVALID")
        self.assertTrue(all(build["appVersion"] == "1.0.2" for build in report["latestBuilds"]))
        self.assertEqual(commands[1], ("apps", "builds", "6834111389"))
        self.assertEqual(self.config.read_text(), self.original)

    def test_auth_or_network_failure_never_becomes_an_empty_build_list(self):
        with self.assertRaises(subprocess.CalledProcessError):
            self.collect([self.app, subprocess.CalledProcessError(1, "apps builds")])
        self.assertEqual(self.config.read_text(), self.original)

    def test_mismatched_app_or_malformed_response_stops_diagnosis(self):
        for responses in [[{"attributes": {"bundleId": "another.app"}}], [self.app, None]]:
            with self.subTest(responses=responses), self.assertRaises(ValueError):
                self.collect(responses)
        self.assertEqual(self.config.read_text(), self.original)


if __name__ == "__main__":
    unittest.main()
