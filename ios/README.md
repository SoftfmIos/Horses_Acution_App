# Riyadh Polo Hills — iOS

Native SwiftUI app for existing academy members and staff. English and Arabic, iPhone and iPad, iOS 17+. The native app has its own version, currently **1.0.2 (3)**; web/backend releases are versioned separately. Development is isolated on branch **iOSApp**.

## Open and run

1. On a Mac with **Xcode 16 or later**, open `ios/RiyadhPoloHills.xcodeproj`.
2. Select the **RiyadhPoloHills** scheme and an iPhone simulator. Run. No third-party Swift packages, CocoaPods, or project generator installation is required.
3. To install on an iPhone, select the app target → Signing & Capabilities → choose your Apple team. Change `com.riyadhpolohills.academy` to a bundle ID registered to that team if needed.
4. Sign in with an existing member or staff account. New users and administrator settings are managed through the website.

The app includes no demo login, embedded credentials or sample financial records. An existing reachable academy backend and valid login are required for live data.

## Connections

`Configuration/App.xcconfig` configures two public values:

- `ACADEMY_API_ORIGIN`: `https://riyadhpolo.softfm.com`, the persistent Node API server.
- `ACADEMY_WEBSITE_ORIGIN`: `https://app.riyadhpolohills.com`, which **must match the backend's `PUBLIC_ORIGIN` exactly**. This is sent as the request Origin to satisfy the existing CSRF policy. If your live website origin changes, update this value and rebuild.

The `https:/$()/...` syntax prevents `.xcconfig` from interpreting `//` as a comment. Both values expand to ordinary HTTPS URLs in Info.plist. Do not put SMTP credentials or other secrets in this file. The app uses the existing `/api` endpoints without changing server authentication, enabling CORS, or deploying a separate backend. Use valid HTTPS certificates; App Transport Security remains enabled. Cross-host redirects are rejected rather than forwarding session headers.

Sessions are kept in the iPhone Keychain with device-only, unlocked access. Passwords are never persisted. Cookie storage and response caching are disabled in the ephemeral URLSession. Signing out revokes the server session and clears local data; when offline, retry sign-out once connected. Expired sessions return to sign-in. Switching academies clears previous data before loading the new scope. There is no offline mutation queue: financial and booking operations require a live server response.

## Native features

- Branded home screen, crest, website photography, navy/ivory/gold palette, Dynamic Type, system Arabic shaping and RTL layout.
- Member and staff authentication, multiple-academy selection, pull-to-refresh and foreground refresh.
- Available sessions, live price quotes, member selection for staff bookings, lesson credits, discounts and vouchers, booking confirmation/cancellation and payment-hold details.
- Native Calendar event editor for confirmed bookings. Events use the session's actual UTC timestamps and display in Riyadh time. Calendar insertion happens only when the user chooses and saves it.
- Horse directory and profile with history grouped by Riyadh month.
- Staff task search, assignment/completion filters and completion/reopening according to page/action grants and historical-task rules.
- Pro forma list, grouped payment history per invoice, remaining balances, authorized staff payment recording and native PDF sharing/printing.
- Lesson-package payment requests; credits activate only after full payment is recorded by the academy.
- Personal notification inbox and read status, plus iOS local notifications 30 minutes before confirmed classes. The app refreshes while active and when brought to the foreground. Remote APNs delivery is not implemented; existing server emails continue independently.
- Support and account privacy information. **System settings, email settings, user administration and permission management stay in the web portal.** Basic account controls cover language, academy selection and sign-out only.

This is a native daily-work app, not a full replacement for every administrator/editor workflow in the website. Email configuration, user creation, bulk scheduling, care-plan authoring, stock configuration and administrative reporting remain in the web portal.

## Tests and verification

From Xcode use Product → Test, or run on a Mac:

```sh
xcodebuild test -project ios/RiyadhPoloHills.xcodeproj \
  -scheme RiyadhPoloHills -destination 'platform=iOS Simulator,name=iPhone 16' \
  CODE_SIGNING_ALLOWED=NO
```

Pick a simulator installed on your Mac if `iPhone 16` is unavailable. Fictional contract fixtures can be regenerated with `node ios/scripts/make_contract_fixtures.mjs`; this runs only against an isolated in-memory backend. `python3 ios/scripts/validate_project.py` checks packaging on Linux or macOS. Tests cover backend JSON decoding, sparse permission-filtered responses, permission boundaries, exact SAR minor-unit input, and Riyadh month boundaries. A branch-scoped GitHub Actions workflow selects an available simulator and builds/tests without signing. The project is generated deterministically by `python3 ios/scripts/generate_project.py`; regenerate after adding Swift files.

The development workspace is Linux and has no Xcode or iOS Simulator. Source syntax, project structure, plist/asset manifests and the existing web/backend tests can be checked here; an actual SwiftUI type-check, simulator run, device run and signing validation require Xcode/macOS. Do not interpret Linux checks as a passed iOS build. Review the macOS workflow result before distributing.

## Device / TestFlight release

You will need your Apple Developer team, registered bundle ID, signing certificates/provisioning and an App Store Connect app. Configure signing locally in Xcode; never commit private keys, certificates or Apple passwords. Archive with a real-device destination and upload through Xcode Organizer. Before submission, validate both languages and staff/member accounts, ensure your production origin is correct, supply support/privacy-policy URLs, age rating, App Privacy disclosures, screenshots and a review account. The in-app privacy page is not a substitute for the public policy URL required by App Store Connect.

Push notification delivery, if requested later, requires backend APNs device registration/sending plus Apple push capability and keys; it is not enabled merely by adding an entitlement. No App Store/TestFlight upload or signing has been performed by creating this branch.

## Codemagic and TestFlight

A root `codemagic.yaml` defines an automatic unsigned simulator-check workflow and a manually started signed TestFlight workflow. Follow [Apple registration and Codemagic setup](APP_STORE_SETUP.md). The TestFlight workflow expects the App Store Connect integration named **Riyadh Polo Hills** and declares the public Apple ID **6834111389** as **APP_STORE_APPLE_ID** directly in the workflow. No environment-variable group is needed. No signing secrets are stored in this repository.

## Class reminders (1.0.1)

After syncing confirmed bookings, the app asks for iOS notification permission and schedules a single alert **30 minutes before class**. Alerts use the selected Arabic/English language and include the class, Riyadh start time and location. Members receive reminders for their own confirmed bookings. Linked instructors also receive one reminder per confirmed assigned class when the deployed backend supplies `myInstructorProfiles` and class instructor IDs. Unrelated staff bookings do not generate reminders.

These are **on-device local notifications**, not server/APNs pushes. Once scheduled, iOS can show them while the app is closed. No APNs key or Push Notifications entitlement is required for these local alerts; the capability already selected in Apple Developer may remain enabled. Delivery depends on permission, iOS Focus/notification settings and the device being available. Changes made on another device while this app stays closed are reflected only on the next successful sync. Open the app after making bookings in the web portal. A remote APNs service would be needed to update reminders without opening the app.

A successful refresh replaces changed reminders and removes cancelled/pending bookings. Changing academy or signing out removes reminders and delivered notifications from the previous scope. Only the currently selected academy is scheduled. At most the nearest 60 class reminders are queued, leaving space below iOS's pending-notification limit. A class first synced after its 30-minute reminder time does not produce an immediate late alert. The confirmed-booking page explains notification permission and links to iPhone notification settings if permission is denied.

The app icon is already packaged in the asset catalog; a review/download copy is in `ios/AppStoreAssets/AppIcon-1024.png`. Both are identical, opaque RGB 1024px PNGs using the existing crest on ivory.

Notification scheduling, permission prompts and physical-device delivery must be tested in Xcode/TestFlight. The Linux workspace can validate source syntax and packaging but cannot run iOS notification delivery tests.

## App Store public links (1.0.2)

The in-app privacy screen links to the public privacy policy and Apple's standard EULA. Website release 1.28.0 includes the public pages; deploy it before distributing this app build.

- Marketing: https://app.riyadhpolohills.com/app.html
- Support: https://app.riyadhpolohills.com/app.html#support
- Privacy: https://app.riyadhpolohills.com/privacy.html
- Standard EULA: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

Use Apple's Standard EULA in App Store Connect. No custom license text is required. The deployment helper can raise the archive build number above 3 to avoid previously uploaded builds.

## Codemagic version declaration

The signed workflow declares `APP_VERSION: "1.0.2"` in `codemagic.yaml`. Preparation validates and writes it to `MARKETING_VERSION` in `Configuration/App.xcconfig` before tests/archiving, and prints both the version and assigned build number. Local builds use the checked-in Xcode configuration. Build numbers remain automatic and advance beyond the latest TestFlight build/CI counter; do not hardcode a reused build number in YAML.
