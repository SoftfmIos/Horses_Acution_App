#!/usr/bin/env python3
"""Validate checked-in iOS packaging on Linux or macOS (not a Swift compiler)."""
from pathlib import Path
import json
import plistlib
import re
import subprocess
import xml.etree.ElementTree as XML

ROOT = Path(__file__).resolve().parents[1]
project = ROOT/'RiyadhPoloHills.xcodeproj/project.pbxproj'
original = project.read_bytes()
subprocess.run(['python3',str(ROOT/'scripts/generate_project.py')],check=True)
assert project.read_bytes() == original, 'Project must be regenerated after source changes'
for file in ROOT.rglob('*.plist'): plistlib.loads(file.read_bytes())
for file in ROOT.rglob('*.xcprivacy'): plistlib.loads(file.read_bytes())
XML.parse(ROOT/'RiyadhPoloHills.xcodeproj/xcshareddata/xcschemes/RiyadhPoloHills.xcscheme')
for file in ROOT.rglob('Contents.json'):
    data=json.loads(file.read_text())
    for item in data.get('images',[]):
        if 'filename' in item: assert (file.parent/item['filename']).is_file(), file
text = project.read_text()
for source in (ROOT/'RiyadhPoloHills').rglob('*.swift'):
    assert str(source.relative_to(ROOT/'RiyadhPoloHills')) in text, source
assert not re.search(r'NSAllowsArbitraryLoads|NSExceptionAllowsInsecureHTTPLoads', (ROOT/'RiyadhPoloHills/Resources/Info.plist').read_text())
# Optional syntax parser: install tree-sitter and tree-sitter-swift to enable it.
try:
    from tree_sitter import Language, Parser
    import tree_sitter_swift
except ImportError:
    print('Optional Swift syntax parser not installed; Xcode build remains required.')
else:
    parser = Parser(Language(tree_sitter_swift.language()))
    for source in ROOT.rglob('*.swift'):
        assert not parser.parse(source.read_bytes()).root_node.has_error, source
print('PASS: deterministic Xcode project, Swift file references, assets, plist/manifest and shared scheme.')
