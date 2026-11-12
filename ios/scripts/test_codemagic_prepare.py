import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import codemagic_prepare
from codemagic_prepare import choose_build_number


class BuildNumberTests(unittest.TestCase):
    def test_first_upload(self):
        self.assertEqual(choose_build_number(None, 1, None), 1)

    def test_existing_build_and_ci_counter(self):
        self.assertEqual(choose_build_number("17", 1, "6"), 18)
        self.assertEqual(choose_build_number("17", 1, "42"), 43)

    def test_invalid_remote_number_is_not_ignored(self):
        with self.assertRaises(ValueError):
            choose_build_number("1.2.3", 1, 1)
        with self.assertRaises(ValueError):
            choose_build_number("network error", 1, 1)


class DeploymentPreparationTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.config = self.root / "Configuration/App.xcconfig"
        self.config.parent.mkdir()
        self.original = "PRODUCT_BUNDLE_IDENTIFIER = com.riyadhpolohills.academy\nMARKETING_VERSION = 1.0.2\nCURRENT_PROJECT_VERSION = 2\n"
        self.config.write_text(self.original)
        self.app = json.dumps({"attributes": {"bundleId": "com.riyadhpolohills.academy"}})
        self.environment = {"APP_STORE_APPLE_ID": "6834111389"}

    def prepare(self, responses):
        with patch.object(codemagic_prepare, "ROOT", self.root), patch.dict(os.environ, self.environment, clear=True), patch("builtins.print"), patch.object(codemagic_prepare.subprocess, "check_output", side_effect=responses) as command:
            codemagic_prepare.main()
            return [call.args[0] for call in command.call_args_list]

    def test_app_json_is_a_command_option_and_build_number_is_plain_text(self):
        commands = self.prepare([self.app, "17\n"])
        self.assertEqual(commands, [
            ["app-store-connect", "--no-color", "--log-stream", "stderr", "apps", "get", "6834111389", "--json"],
            ["app-store-connect", "--no-color", "--log-stream", "stderr", "get-latest-testflight-build-number", "6834111389"],
        ])
        self.assertIn("CURRENT_PROJECT_VERSION = 18", self.config.read_text())

    def test_first_upload_has_no_remote_build_number(self):
        self.prepare([self.app, ""])
        self.assertEqual(self.config.read_text(), self.original)

    def test_workflow_version_is_written_to_the_xcode_archive_configuration(self):
        self.environment["APP_VERSION"] = "1.0.3"
        self.prepare([self.app, "17"])
        config = self.config.read_text()
        self.assertIn("MARKETING_VERSION = 1.0.3", config)
        self.assertNotIn("MARKETING_VERSION = 1.0.2", config)
        self.assertIn("CURRENT_PROJECT_VERSION = 18", config)

    def test_invalid_workflow_version_stops_before_contacting_apple(self):
        for version in ["", "1.0", "latest", "1.0.2; echo invalid"]:
            with self.subTest(version=version):
                self.environment["APP_VERSION"] = version
                with patch.object(codemagic_prepare, "cli_json") as remote:
                    with self.assertRaises(ValueError):
                        self.prepare([])
                    remote.assert_not_called()
                self.assertEqual(self.config.read_text(), self.original)

    def test_ci_counter_avoids_reusing_a_pending_upload_number(self):
        self.environment["PROJECT_BUILD_NUMBER"] = "42"
        self.prepare([self.app, "17"])
        self.assertIn("CURRENT_PROJECT_VERSION = 43", self.config.read_text())

    def test_mismatched_app_never_changes_build_number(self):
        with self.assertRaises(SystemExit):
            self.prepare([json.dumps({"attributes": {"bundleId": "another.app"}})])
        self.assertEqual(self.config.read_text(), self.original)

    def test_failed_lookup_is_not_treated_as_a_first_upload(self):
        for responses in [
            [subprocess.CalledProcessError(1, "apps get")],
            [self.app, subprocess.CalledProcessError(1, "get-latest-testflight-build-number")],
        ]:
            with self.subTest(responses=responses), self.assertRaises(subprocess.CalledProcessError):
                self.prepare(responses)
            self.assertEqual(self.config.read_text(), self.original)

    def test_invalid_build_output_never_changes_build_number(self):
        with self.assertRaises(ValueError):
            self.prepare([self.app, "not a build number"])
        self.assertEqual(self.config.read_text(), self.original)


if __name__ == "__main__":
    unittest.main()
