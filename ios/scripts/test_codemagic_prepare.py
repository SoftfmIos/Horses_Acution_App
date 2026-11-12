import unittest
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


if __name__ == "__main__":
    unittest.main()
