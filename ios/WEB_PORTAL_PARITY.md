# Web portal and native iOS comparison — 1.1.6

Backend/web prerequisite: **1.30.1**. Native version: **1.1.6**, base build **20** (Codemagic assigns a newer unused build when needed).

| Flow | Member app | Staff app |
| --- | --- | --- |
| Home | Own upcoming rides, session totals, owned horses | Permitted upcoming bookings and assigned open tasks |
| Bookings | Defaults to My bookings; separate available-session catalogue for new rides; only own reservations; search/status filters; quote, book and eligible cancellation | Explicit member selection; Add/Delete grants enforced; search/status filters |
| Lesson credits | Remaining, purchased, used, restored, refunded, package state and monthly ledger | Member balances used by server when booking for a member |
| Packages | Request active lesson packages; activation follows full staff-confirmed payment | Package/pricing administration stays in the web portal |
| Horses | Owned-horse directory; full authorized owned-horse profile and own ride history | Directory/profile sections follow module permissions |
| Photos | Authenticated horse and instructor images on profiles/bookings | Same; web portal manages image uploads |
| Horse records | Identity, medical/care, feeding, horse-specific tasks, boarding, documents, ride/attendance history, monthly timeline | Same sections where authorized; document download and horse-card PDF share/print |
| Tasks | No academy tasks page; owned-horse care status is read-only inside its profile | Assigned/all permitted tasks, search/completion filters, completion/reopen according to grants and historical-date policy |
| Invoices | Own pro formas and payment history; share/print | View by grant; record payments by Edit grant; email invoice/payment copies when academy email is configured |
| Payment reports | Own payments, month/search filtering and printable PDF | Member/invoice grouping, months/search, share/print filtered report |
| Stalls & boarding | Owned-horse boarding history | View availability; assign/edit/end according to grants; original invoice prices and paid-term locks retained |
| Calendar/reminders | Calendar event editor; local alerts 30 minutes before confirmed sessions | Relevant linked-instructor reminders and booking calendar actions |
| Notifications | Own inbox only | Own inbox; service messages follow the web backend |
| Account | Change email/password with current password; delete account in app | Same; sole administrator/staff owner transfers access first |
| Administrative work | Provided through web portal where authorized | System/email settings, users/permissions, bulk class scheduling, care-plan authoring, stock setup and advanced administration use the web portal |

## Privacy and account behavior

- Known staff roles and current grants are required for work screens; member authentication cannot inherit a stale staff snapshot.
- Transport responses from an old login and data responses from a prior account/academy scope are ignored. Navigation resets when the account, academy or access policy changes.
- Member data is filtered again before display: own reservations, invoices, payments and notifications; no staff grants or academy tasks. Shared/booked horse identities do not expose private notes or microchips.
- The server independently enforces ownership. A member can read their owned horse's complete care/document profile. A booked/shared horse exposes basic identity and that member's rides, not another owner's private care.
- Photos use authenticated, stable-scoped JSON requests rather than public image URLs.
- Account email/password changes preserve the account ID/history and revoke old sessions. Deletion anonymizes the retained financial/service identity, removes profile data and access, and flags relevant payments for reconciliation. It does not silently issue refunds or erase financial history.

## Validation

Backend: `npm test`; after building, run `CHROMIUM_PATH=/usr/bin/chromium node tests/account-security-browser.mjs`, `tests/member-account.mjs` and `tests/boarding-browser.mjs`.

Native packaging/syntax: `python3 ios/scripts/validate_project.py`. On macOS run `bash ios/scripts/run_simulator_tests.sh`. The branch push starts Codemagic simulator checks; select **Riyadh Polo Hills - signed TestFlight deployment** after backend deployment for a device build.

Test two distinct member accounts and staff with different module/action grants. Compare horse ownership, booking lists, invoice/customer scope and instructor images with the web portal. Test switching account/academy and revoked grants, an incorrect current password, email/password re-login and deletion using a disposable non-administrator account. Account deletion is permanent; use test records. Review the simulator result and test real iPhone/iPad photo loading, PDF sharing, Calendar and notifications before external beta distribution.
