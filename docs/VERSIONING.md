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

## 1.17.0

Task checklists now use Feeding, Medical and Other task groups with accurate period completion. Tasks → Print daily handout prints the selected date's filtered tasks, grouped by type, with assigned staff, instructions, completion checkbox, existing digital completion, and a blank actual-time/signature field beside every task. Supervisor review/signature and staff-name fields document handover. Print planner produces the same signed follow-up layout for the selected week/month. Paper signatures do not update electronic completion automatically.

Classes & riding includes a separate Member & instructor booking calendar section. Staff can filter by member, instructor, status and daily/weekly/monthly period; members see only their own server-authorised bookings. Print booking calendar prints the exact selected schedule in a landscape calendar with rider, horse, instructor, location, time and booking status. Task handouts use portrait paper; printing a pro forma does not accidentally include the booking calendar.

## 1.18.0

Adds secure password generation and printable account details when creating users. Settings now includes outgoing SMTP configuration per stable, with notifications@riyadhpolohills.com as the default sender and support@riyadhpolohills.com as Reply-to. Passwords are encrypted server-side and retained when an edit leaves the password blank. The notification worker picks up saved configuration without restarting. SMTP settings respect existing Settings edit permissions. Database backups include the email encryption key when present; restore the matching `.email-key` file alongside the database.

Deploy the same release to the frontend and backend; pull the repository and restart the backend. Schema changes apply automatically. Saving SMTP settings does not verify credentials or send a test message.

## 1.19.0

Users & Permissions now includes Add user, password generation, printable account details and Edit user alongside the permissions editor. User lists show email addresses; administrators can edit English/Arabic names and login emails. Email changes reject duplicates and shared accounts and invalidate existing sessions. Deploy matching frontend and backend versions so the new profile fields and email updates are available together.

## 1.20.0

Settings is a hub with dedicated System Settings and Email Settings pages. Email settings have independent view/update grants; User Management has independent Add/Update/Delete grants for each staff user. Staff with user-management access can open the user management page; only administrators can assign permissions and change login emails or staff access.

Outgoing messages use the academy crest, bilingual Arabic/English layouts and Riyadh timestamps. Booking and upcoming-session emails include session, instructor, horse, location and confirmation/payment details; confirmed sessions include a Google Calendar link and an ICS attachment for Apple Calendar/Outlook. Pro forma emails include a self-contained printable HTML invoice copy and payment history. Partial/final payment receipts show the current payment, total paid and remaining balance. Boarding creation/end notifications include stay and payment details. Invoice and receipt emails can be resent from the pro forma dialog.

New users receive a welcome/login email when delivery is configured. Account creation can opt out and can explicitly include the password. Generated passwords can also be emailed from the creation card; existing users can be emailed their login link. Passwords in queued account emails are encrypted with the server email key and removed from the outbox after successful sending. Existing passwords cannot be retrieved; resending a password requires the current known password to match its hash.

Billing includes searchable payment reports grouped by pro forma or user, with date filters, individual payments/refunds, lifetime invoice balances and a printable report. Date/search filters affect the selected payments; invoice balances remain lifetime totals.

Deploy frontend and backend from the same release and restart the backend. Existing SMTP settings continue working. Preserve the database and its `.email-key` file. Pro forma copies and payment reports are operational documents, not official tax invoices.

## 1.21.0

Email Settings and System Settings now use the same icon cards and Manage controls as the other settings modules. User-management buttons share sizing, spacing and shape, and the User and Access Level selectors have matching widths. Horse timelines, rides, medical records, care tasks, documents and boarding stays are grouped by month using Riyadh time, newest first. Print horse card & history prints a compact horse summary and the selected section, with month headers and without editing/upload controls. English and Arabic month labels follow the current language.

## 1.22.0

Login now offers Forgot password and Forgot login email recovery. Password reset emails use an encrypted queued link, a hashed single-use token with a 30-minute expiry, generic account-existence responses and authentication rate limiting. A reset invalidates existing sessions; reset tokens stay in a URL fragment and are removed from the address bar when the form opens. Forgotten email assistance goes to the academy support mailbox for identity verification.

Instructor profiles can link to a staff account, or match its login email when no explicit link exists. The linked instructor can upload/remove their own photo from Overview without general instructor-edit permissions. They cannot modify another instructor's photo. Members can see instructor photos for published upcoming sessions and their historical bookings. Photos appear in session/booking cards, booking details and the booking calendar, and update live across mounted views.

Deploy both frontend and backend and restart the backend. The password-reset table is created automatically. Email delivery must be configured for at least one academy associated with the recovering account. The `iOSApp` branch remains separate.

## 1.23.0

The backend explicitly trusts the production website `https://app.riyadhpolohills.com` and the existing Vercel frontend. This fixes login and password-reset requests rejected when the deployed PUBLIC_ORIGIN still named the older site. Origins remain exact allowlisted matches; absent/null origins, lookalike domains, different ports and spoofed forwarding headers remain rejected. Recovery and account-login email links use the verified requesting origin so custom-domain users return to their site. Other deployment domains can be added explicitly through ADDITIONAL_PUBLIC_ORIGINS.

For the current deployment, set `PUBLIC_ORIGIN=https://app.riyadhpolohills.com` in the backend Node application and restart it. Pull/deploy this backend version to apply the repository allowlist and update/redeploy the frontend for the clearer configuration error. The Docker runtime now includes the config directory required by the backend.

## 1.24.0

The member portal has a direct Buy sessions page for active lesson packages, linked from Home, My balance and navigation. Purchases create a pro forma through the existing payment process; staff still confirm full payment before sessions activate. My balance shows each package's payment/credit state and refreshes when opened or when the tab regains focus.

Package requests now persist their plan ID and validated immutable session quantity. Fully paid requests with a saved positive quantity and no grant flag are reconciled transactionally on scoped data reads; existing grant-ledger entries prevent double credits even if a flag is stale. Legacy paid requests without a quantity are flagged for review. System administrators can verify the original purchase and apply missing credits once from the pro forma dialog, with an audit entry and correction reason. Refunds, unpaid requests and booking invoices cannot receive this correction. Do not infer a historical session quantity automatically from a package that may have changed.

Payment reports support a month filter and collapsible month sections inside user/invoice groups, using Riyadh dates. Print payment report sits beside Create payment request in the top toolbar. Print preview expands every matching month and retains the current filters.

Boarding cards display the horse photo and consistently sized actions. Active stays can be edited with overlap/capacity checks while retaining the original invoice. Paid/adjusted invoices keep their original billed member and price. Unpaid, unadjusted requests can update those details with the stay; dates are not automatically prorated. Stall edits return to the boarding screen rather than a nearly empty generic record card. Availability uses peak simultaneous occupancy for a selected date range, excludes the current stay during edits, and exposes occupancy-only data to authorized stall viewers without revealing boarding customer details.

Deploy the frontend and backend together and restart Node.js. Database updates are additive. No live production database was accessed during development; repairs apply to eligible records only after the new backend is deployed, and missing historical package counts require administrator review.

## 1.25.0

Booking dialogs fetch the selected member’s current session balance directly instead of relying on member-summary data. Changing member, reopening the dialog, or refreshing updates the balance. Loading and request failures no longer appear as zero. Purchased, used, restored and refunded totals explain the balance, and missing paid-package allocations link to the existing invoice review workflow. Class staff may read balances within their stable; members may read only their own. Missing historical session counts still require an administrator to verify the original purchase; this release does not guess or automatically allocate them.

Payment requests and grouped payment report rows use pale green for fully paid invoices, pale yellow for partially paid invoices, and pale orange for pending invoices. A text legend preserves status meaning independently of color. Voided/refund-required invoices retain neutral styling.

Deploy frontend and backend together and restart Node.js. Health should report version 1.25.0. No live production database was changed during development.

## 1.26.0

Pricing no longer silently discards session counts on regular class, private lesson, boarding or other non-package prices. The form retains entered values and explains that Category must be Lesson package; the API rejects inconsistent creates/updates before changing the saved record. Add session package opens the correct category directly, with a required whole-number count from 1 to 1000 and bilingual guidance on credit activation after full payment. Package session counts persist through create, edit and reload. Changing a current package count does not change an existing purchase's saved session snapshot.

Deploy frontend and backend together and restart Node.js; health should report version 1.26.0. Previously discarded counts cannot be recovered from zero automatically. Confirm the intended quantity and edit the plan; already paid requests with missing historical snapshots still use the administrator's Review missing sessions workflow.

## 1.27.0

Successful sign-in resets the current page, search and open dialogs so members land on My account even after signing out from another page. My account displays the login email, remaining sessions, total purchased, used, restored after cancellation, refunded and awaiting-full-payment sessions. My balance uses the same totals. Used sessions show gross deductions; restored sessions are listed separately and the remaining-balance formula explains the relationship. Unpaid/partially paid packages are excluded from available credits, and paid packages with missing allocations show a review notice.

Session totals and the staff booking-credit lookup share one ledger calculation. Opening My account refreshes its data; members can also refresh the balance or open the session history directly. Initial loading is labelled instead of briefly displaying a zero balance. The member navigation stays in a single horizontally scrollable row on narrow screens. Arabic and English labels, desktop layout and Arabic mobile layout are supported.

Validation: `npm test` and, after `npm run build`, `CHROMIUM_PATH=/usr/bin/chromium node tests/member-account.mjs`. The browser scenario covers staff-to-member login, member relogin from invoices, actual paid packages, credit bookings, cancellation, refund, partial payment, matching account/balance totals, refresh, Arabic and mobile overflow.

Deploy the frontend and backend together and restart Node.js. Health should report version 1.27.0. Historical missing paid-package counts still require administrator review; this change does not alter live production balances.

## 1.28.0

Adds public bilingual marketing/support and privacy pages at `/app.html` and `/privacy.html`, with the academy logo, local fonts, responsive layouts and links from the portal footer and sign-in page. Both pages are static HTML and work without authentication or JavaScript. The marketing page links to Apple's standard iOS EULA and explains TestFlight access, academy payment confirmation and local class reminders. The privacy notice describes the current app/portal data, access, optional device features, retention and account/data-request contact.

The static files are copied into `dist` by Vite and served directly by Vercel or the standalone Node server. Deploy the frontend to publish the URLs. The release version is 1.28.0; update the backend too to keep version labels aligned. No database changes are included. Validation covers the production build, unauthenticated HTML responses, logo, links, canonical URLs, no-JavaScript access and Arabic mobile overflow. Live website access from the development environment is blocked, so publication must be confirmed after deployment.

## 1.29.0

Stalls & boarding includes Add boarding price, opening a new Pricing form with the Boarding category already selected and returning to boarding after save. An empty price dropdown explains the eligible active categories and provides a creation shortcut when authorized. The selected stay price is shown separately from the dropdown. Existing stays display their invoice's original price snapshot rather than a subsequently changed catalogue rate. Active defaults for legacy stalls/prices are applied consistently; explicitly inactive prices still cannot be assigned.

Assign boarding inherits the availability-filter dates. After create/edit, cards switch to the saved stay's dates. Successful create, edit and end operations update the local stay and occupancy snapshot directly, so a stale data refresh does not leave slot counts unchanged. Moving a horse releases the old stall and occupies the new one. Availability remains based on peak simultaneous occupancy in the selected date range, includes assigned unpaid stays and excludes ended stays. Full stalls are still rejected atomically without creating another invoice. Paid-invoice protections remain enforced.

Validation: 95 tests and `CHROMIUM_PATH=/usr/bin/chromium node tests/boarding-browser.mjs` after building. The browser check covers the empty-price state, price creation, visible SAR amount, future date inheritance, a deliberately stale refresh, full capacity, moving/ending stays, invoice preservation and Arabic mobile layout. API checks include legacy catalogue records, original price snapshots and restricted staff data.

Deploy this same main commit to frontend and backend and restart Node.js. Both version labels should read 1.29.0. No production database was accessed or existing price category automatically changed; activate/reclassify intended prices or use Add boarding price.

## 1.30.0

Members no longer receive staff grants or academy tasks. Member horse summaries preserve complete owned-horse records and restrict booked/shared horses to public identity fields. Public instructor identities and photos are available for upcoming classes and owned-horse assignments; private instructor contact/notes are omitted. Owned-horse profiles retain care, feeding, horse-specific tasks, boarding, documents and the member's ride history. Staff profile sections follow their module grants, including class-booking visibility.

Adds password-confirmed self-service email/password changes and account deletion, available in Account & security on the web and through authenticated account endpoints for iOS. Login changes revoke every existing session/reset token and retain the user's ID/history. Deletion revokes access across academies, removes memberships, names, personal profile photos, queued personal messages and account credentials, and anonymizes the retained identity. Upcoming bookings are cancelled; paid/open amounts are flagged for staff reconciliation and financial/service records are retained. No refund is automatically issued. Sole academy administrators/staff owners must transfer access first. An additive deleted_accounts marker prevents login resurrection; no database replacement is required.

New endpoints are PUT /api/auth/account/email, PUT /api/auth/account/password, GET /api/auth/account/deletion and DELETE /api/auth/account. They require authentication without a stable header, current-password confirmation for mutations, and DELETE confirmation for deletion. Mutations are rate-limited. Health advertises accountVersion 1. Boarding responses also expose whether financial terms are locked so restricted staff cannot accidentally edit partially paid terms.

Validation: 99 API/system tests and the account-security, member-account and boarding browser scenarios. Deploy the same commit to frontend/backend, restart Node.js, then distribute native iOS 1.1.0. The native app depends on these new account endpoints and privacy filters. No production accounts or balances were changed during development.

## 1.30.1

Account snapshots now include a dedicated ownedHorses collection for both member and staff horse owners. Restricted staff retain ownership fields and notes for their own horses, and may read their own horse profile, photo, assigned instructor photo and documents without academy horse-management permission. Management mutations and unrelated horse profile access still require the existing grants.

Deploy frontend/backend from this release and restart Node.js for the owned-horse fixes used by iOS 1.1.3. No production ownership links were changed.

## 1.31.0

Adds operator-only `demo:preview` and `demo:reset` commands for the explicitly requested existing-database demo replacement. Apply backs up the committed database and SMTP encryption key before deleting anything, preserves only abdul@softfm.com and its password, retains a selected academy with administrator access, revokes old sessions and transactionally creates bilingual demo users, horses, instructors, bookings, invoices, payments, session balances, feeding/care work and boarding. `--empty` performs a reset without adding demo records. Startup, deployment and public APIs never invoke this command.

Demo email is explicitly disabled. New login credentials are generated independently and saved only in a private file; approved profile portraits can be imported from a validated `--photos-dir`. No individual portraits are bundled. See docs/DEMO_RESET.md for cPanel execution and recovery. No live database was accessed or reset during development.
