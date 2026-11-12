# Apple Developer → Codemagic → TestFlight

The native app is **Riyadh Polo Hills**, version **1.0.1**, branch **iOSApp**. It uses bundle ID **com.riyadhpolohills.academy** and the website **https://app.riyadhpolohills.com**. Administrative settings stay in the web portal.

## 1. Register the Bundle ID in Apple Developer

1. Sign in at https://developer.apple.com/account and select your paid Apple Developer team.
2. Open **Certificates, Identifiers & Profiles → Identifiers**.
3. Click **+ → App IDs → Continue → App → Continue**.
4. Description: **Riyadh Polo Hills**.
5. Bundle ID: **Explicit**, then enter **com.riyadhpolohills.academy** exactly.
6. Leave capabilities unchanged. On-device class reminders do not require the Push Notifications capability; if you have already enabled it, it can remain enabled. Remote APNs delivery still requires separate backend/key setup. Sign in with Apple, iCloud, and In-App Purchase capabilities are not used. Its optional Calendar editor does not require a portal capability.
7. Click **Continue → Register**.

If the identifier already exists, use that identifier on the same team. Do not create a wildcard ID. If the Identifiers section is unavailable, check membership and team permissions with the account holder.

## 2. Create the app record in App Store Connect

1. Open https://appstoreconnect.apple.com/apps using the same Apple team.
2. Click **+ → New App**.
3. Platform: **iOS**.
4. Name: **Riyadh Polo Hills** (if Apple says unavailable, choose an available name without changing the Bundle ID).
5. Primary language: **English**. The app itself includes Arabic and English.
6. Bundle ID: select **com.riyadhpolohills.academy**. Refresh the page if it was just registered and is not listed.
7. SKU: **RPH-IOS-001**. This is an internal identifier; it is not the Bundle ID or numeric Apple ID.
8. User access: select the appropriate team access, then **Create**.
9. Open **App Information** and copy the numeric **Apple ID**. This number is safe to share and is needed in the next step.

The Apple ID does not exist until the app record has been created. Do not enter an Apple login email into the Apple ID field in Codemagic.

## 3. Connect Apple to Codemagic

1. In Codemagic open your team's **Integrations → App Store Connect** integration area.
2. Create/use an integration named **Riyadh Polo Hills** (exact spelling matches `codemagic.yaml`).
3. If prompted for an App Store Connect API key, create a **team API key** in **App Store Connect → Users and Access → Integrations → App Store Connect API**. An account holder/admin may need to enable API access first. Use sufficient privileges for app distribution and signing management; Codemagic commonly uses an **App Manager** key, with Apple Developer certificate access available to the team.
4. Enter the key ID, issuer ID and downloaded `.p8` private key directly into Codemagic's secure integration form. Never paste the private key, Apple password or signing certificate into chat or Git.
5. Under Codemagic's iOS signing settings, configure automatic **App Store** signing for **com.riyadhpolohills.academy**, using the same team. Allow Codemagic to fetch/generate the required Apple Distribution certificate and App Store provisioning profile. If a certificate already exists, its matching private key must also be available to Codemagic.
6. In your Codemagic application, create an environment-variable group named **riyadh_polo_app_store**. Add **APP_STORE_APPLE_ID** with the numeric Apple ID from step 2, and make the group available to this app/workflow. The number is not a secret.

If Codemagic reports certificate/profile permissions errors, have the Apple team administrator complete signing setup. API publishing access and usable signing identities are both required.

## 4. Start the TestFlight deployment

1. In Codemagic choose the GitHub repository **SoftfmIos/Horses_Acution_App**.
2. Refresh its repository configuration so it detects the root **codemagic.yaml** on branch **iOSApp**.
3. Choose **Start new build → iOSApp → Riyadh Polo Hills - signed TestFlight deployment**.
4. Start the build. It verifies that the numeric Apple ID belongs to the configured Bundle ID, selects a build number newer than the previous TestFlight build, runs simulator tests, applies signing profiles, builds the IPA, and uploads through the named App Store Connect integration.
5. When Apple finishes processing, open **App Store Connect → Riyadh Polo Hills → TestFlight**.
6. Resolve any export-compliance questions if Apple asks. Create/select an internal testing group and add your testers. Install Apple's **TestFlight** app on each iPhone and accept the invitation.

The workflow does **not** submit for public App Store review. External testing may require Apple's beta review and review information. Before external testing or store submission, supply a review login, public privacy/support URLs, screenshots, age rating and accurate privacy disclosures. Those steps are separate from the first internal TestFlight upload.

## Important checks

- The backend's `PUBLIC_ORIGIN` must support **https://app.riyadhpolohills.com**. Deploy the website's origin fix and restart the backend before testing login in the native app.
- Use one signed deployment at a time. Build numbers are assigned using the latest TestFlight build and the Codemagic CI build counter.
- The unsigned `ios-simulator` workflow runs on branch pushes. The signed publishing workflow is manual so incomplete Apple setup does not trigger accidental uploads.
- The native project needs Xcode/macOS. Linux packaging checks are not a simulator build or a successful TestFlight upload.
