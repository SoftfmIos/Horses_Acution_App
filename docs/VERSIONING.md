# Release versions

The baseline release is **1.10.0**. Each subsequent published build increments the middle number: **1.11.0**, **1.12.0**, and so on. Start a new major version only when deliberately releasing a new application version.

Before preparing the next release, run `npm run version:next` once. This updates package.json and package-lock.json together. Commit the release version with the changes, validate, and tag that commit `v1.11.0` (using the actual declared version). Deploy the same commit to Vercel and cPanel.

`npm run build` intentionally preserves the committed version: local checks, retries and deployment rebuilds must not create different frontend/backend versions from the same source commit. The frontend footer and backend `/api/health` both read package.json, so their version labels match when deployed from the same release.

## 1.11.0

Recurring-class saves verify every generated date through a stable-scoped series read-back, merge the complete schedule into the calendar even when a collection read is delayed, and reset calendar filters after publishing. The form lists the exact dates before saving. A one-off class can be expanded with **Schedule selected days** without duplicating its original date. A partial save from an outdated backend is reported as incomplete and cannot be silently retried from the same form. Existing production classes are not automatically duplicated or repaired.

## 1.12.0

Class creation selects multiple instructor catalogue records. Each selected date generates one single-seat slot per instructor with a distinct available horse. The whole batch is atomic; shortages, instructor conflicts and horse conflicts reject it. The chosen arena may be shared by slots in this same simultaneous schedule; unrelated overlapping schedules remain blocked. Existing group classes are retained; new instructor slots have one seat each.

Saving no longer requires the class-series endpoint: the normal data response and existing record-read endpoint verify every date/instructor pair. A health capability check blocks multi-instructor writes against an outdated backend before any class is submitted. Discounts display and submit real three-letter/three-digit codes instead of a placeholder; issued codes remain unchanged and the backend handles generated-code collisions.

The footer displays frontend and backend versions, links to health and labels version mismatches. The health response for this release includes `version: "1.12.0"` and `schedulingVersion: 2`. Pull in cPanel and restart Passenger before using the new instructor workflow; deploy the same commit in Vercel. Merely redeploying Vercel does not update cPanel.

## 1.13.0

Staff select **Book for member** when booking from a pre-created class card or calendar slot. Selection is required. The selected member owns the booking and pro forma, receives the booking notification and supplies lesson credits if used. Changing the selected member clears the quote and credit-payment choice. The actual staff operator remains the audit actor.

Members have no booker dropdown: the server uses the signed-in member and rejects attempts to book for another account. Both quotes and booking confirmation validate stable membership; confirmation checks that the quoted member has not changed. Staff cannot submit a booking with an omitted member. Health includes `bookingVersion: 1`; the frontend checks this before staff quotes to prevent old backends silently booking the logged-in staff account. Update both deployments and restart the cPanel app.

## 1.14.0

- Stable Settings configure booking hold hours (1–720, default 72). New reservations and refund-created holds use this policy, capped at class start. Existing reservations retain their stored deadline. Calendar labels show the configured policy; member bookings show their actual expiry.
- Horse, instructor and optional member profile photos upload through authenticated, stable-scoped endpoints. Staff manage horse/instructor photos and member photos; members can manage only their own. Browser uploads resize to 512 pixels and JPEG; backend accepts JPEG/PNG up to 512 KB. Photos are stored in SQLite and included in database backups, not Git or bulk data responses.
- Medication interval 0 means once daily. Medication intervals can combine with selected weekdays: treatment duration limits the course and the weekday schedule filters dose days. Preview and persistence share one scheduler. No matching dose dates produces a clear validation error. Backend capability checks prevent new medication semantics from being sent to older deployments.
- Horse profiles use a master-detail layout with persistent identity, photo, owner and instructor, plus history, dated care completion, feeding, boarding, ride bookings/attendance and documents. Shared-school-horse access continues to hide private care/documents from unrelated riders.
- Daily feeding plans continue to generate dated tasks automatically over a rolling 28-day horizon, respecting plan start/end dates. Each plan has a Daily feeding planner shortcut. Tasks open a day/week/month calendar with one-click checkboxes, staff assignments and completion stamps. A checklist layout and printable planners remain available.

Deploy frontend and backend together, pull in cPanel, run npm install and update lowercase tmp/restart.txt. Health should report version 1.14.0 and medicalScheduleVersion 2. No database replacement is required.

Additional 1.14.0 workflow controls:

- Task calendar and checklist show daily, weekly and monthly completion percentages for the selected date, employee and care plan. Cancelled tasks are excluded. Individual day cells also show completion percentages.
- Ordinary staff can update task occurrences dated yesterday or later in Riyadh time. Older occurrences are locked in the UI and API, including attempts to move an old task to a newer date. Staff care-plan edits preserve locked historical occurrences. System administrators can correct historical completion with the normal audit trail.
- System administrators have a dedicated Users & Permissions page to grant administrator/staff/member access and staff module permissions. The API enforces modules and filters protected bulk data. Staff cannot elevate themselves or remove administrators. At least one administrator must remain.
- Migration grants administrator status to the initial existing staff owner for each stable and accounts recorded through the administrator bootstrap command. New stable creators become administrators; other staff promotions do not. Administrator assignments and module grants persist in new SQLite tables. No existing business records are replaced.

## 1.15.0

Task-calendar dates now contain collapsible Feeding, Medical and Other task groups. Each group shows completed/total and its own completion percentage. Daily view opens the groups for immediate check-off; weekly and monthly views start collapsed to keep the calendar compact. A group filter can show only feeding, medical or other work. Status filtering does not inflate the group's completion percentage: progress uses all uncancelled tasks in that date/category. Existing checkboxes, assignee filtering, audit stamps and historical editing limits remain enforced.

## 1.16.0

Users & Permissions now separates page access (viewing) from independent Add, Edit and Delete permissions. Instructors, arenas, breeds, stalls, boarding, discounts, vouchers and stable management each have separate rows. Reports are view-only and preferences use Edit; unavailable operations are disabled in the matrix.

The API checks the action for every protected function, including POST-based operations: booking cancellation and ending boarding require Delete; task completion/reopening, attendance, payments, refunds and profile-photo changes require Edit; invitations, documents, stock receipts and new bookings require Add. Expanding an existing class requires both Add and Edit. Administrator-only controls and task-date locks remain additional restrictions.

Existing staff page grants migrate to their previous full actions and associated function pages. A new nullable SQLite column stores explicit action grants without replacing existing data. Older module-only permission clients retain their previous semantics; the new matrix refuses to save against a backend that does not advertise permissionVersion 2. Update and restart cPanel together with the frontend.
