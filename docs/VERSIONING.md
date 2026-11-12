# Release versions

The baseline release is **1.10.0**. Each subsequent published build increments the middle number: **1.11.0**, **1.12.0**, and so on. Start a new major version only when deliberately releasing a new application version.

Before preparing the next release, run `npm run version:next` once. This updates package.json and package-lock.json together. Commit the release version with the changes, validate, and tag that commit `v1.11.0` (using the actual declared version). Deploy the same commit to Vercel and cPanel.

`npm run build` intentionally preserves the committed version: local checks, retries and deployment rebuilds must not create different frontend/backend versions from the same source commit. The frontend footer and backend `/api/health` both read package.json, so their version labels match when deployed from the same release.

## 1.11.0

Recurring-class saves verify every generated date through a stable-scoped series read-back, merge the complete schedule into the calendar even when a collection read is delayed, and reset calendar filters after publishing. The form lists the exact dates before saving. A one-off class can be expanded with **Schedule selected days** without duplicating its original date. A partial save from an outdated backend is reported as incomplete and cannot be silently retried from the same form. Existing production classes are not automatically duplicated or repaired.
