# Riyadh Polo Club Academy

Arabic/English stable and member management with the Academy's navy, ivory and gold theme, Tajawal fonts, full crest and RTL layouts. This version replaces the browser-only prototype with an authenticated Node.js API and a shared persistent SQLite database.

## Vercel hosting

For `https://horsesacutionapp.vercel.app`, follow [Connect Vercel to the backend](docs/VERCEL.md). The repo now includes a Vercel API proxy, a tested Docker container, and an optional Render Blueprint. Vercel still needs `ACADEMY_BACKEND_URL` pointing to a separately deployed persistent Node service. The backend has not been publicly deployed by this code change.

## Run

Requires **Node.js 24+** and npm. Use the existing checkout; no worktree is needed.

```sh
npm ci
cp .env.example .env
npm run dev
```

Development starts the API on port 3001 and Vite on 5173. Vite proxies `/api` to the API with the same browser origin. `PORT` and `WEB_PORT` can override these. There are no seeded accounts, sample financial records, or default passwords. Create a stable account, add horses and prices, then schedule classes. Invite members from the Members screen; invitations are single-use and expire after seven days. Managers can also create members directly with a temporary password of at least 6 characters. Public registration requires an invitation to join an existing stable. Public registration without an invitation creates a **separate** stable.

```sh
npm run build
npm start
```

The Node server serves both the built website and API. Running `dist` on a static-only host will not provide login, bookings or database features. The original browser demo's local data is not imported into the real database.

## Implemented workflows

| Area | Available now |
| --- | --- |
| Accounts | Stable registration, member invitations, login/logout, salted scrypt passwords, opaque hashed server sessions, HttpOnly cookies, server-enforced manager, member, instructor, vet and caregiver permissions |
| Shared data | Organization-scoped server records, transactional writes, persistent SQLite database, audit events |
| Classes | Create/edit dated classes and rides; instructor, arena, horse roster, capacity and price; reject overlapping resources; safe edits preserve booked seats, horse assignments and prices; weekly series up to 52 weeks |
| Member portal | Personal upcoming sessions, lesson-credit balance/history, outstanding payment requests, own bookings and instructor filtering |
| Bookings | Members book/cancel their own sessions; managers see all; server checks duplicates, rider overlap, capacity and horse availability; concurrent reservations cannot oversell |
| Horses | Profiles, breed, birth date, microchip/passport, notes and riding status |
| Medical | Medical records and dose schedules from first dose time, interval and duration; assignees record each completion with actor/time; riding restrictions and reminders |
| Feeding | Daily feeding plans, date ranges, duration and assignee; tasks generated 28 days ahead; feeding windows block horse bookings |
| Tasks | Due dates, assignments, completion and reminders; members can complete only their assigned tasks |
| Pricing | Configurable SAR prices for group classes, private lessons, rides, boarding, other services and prepaid lesson packages |
| Discounts | Percentage or fixed SAR codes, minimum spend, expiry, total redemption limit, active/inactive state |
| Vouchers | Manager-issued, high-entropy codes, expiry, stored balance, partial redemption; applied after discounts |
| Payment requests | Booking-generated or manually created pro formas, recorded external payments/refunds and external invoice/credit-note references |
| Inventory | Quantities, units, reorder thresholds, expiry dates, editable stock and low-stock reminders |
| Reports | Operational totals for gross requests, discounts, vouchers, recorded payments, outstanding amounts, bookings, members, low stock and overdue tasks |
| Notifications | Persistent, per-user in-app inbox and read state; booking/payment events, upcoming class, task, medical and stock reminders; optional durable SMTP email outbox |

UI data refreshes every 30 seconds. Reminder jobs run every minute and deduplicate repeated reminders. Feeding tasks are generated 28 days ahead in Riyadh time while the service runs. Pending overdue tasks are retained; completed tasks are never regenerated. A medically restricted horse cannot receive new bookings. Existing affected bookings are flagged through notifications rather than silently cancelled or reassigned. Completing a medical record does not automatically clear rest; a manager must explicitly return the horse to ready after clearance.

## Pricing and ZATCA boundary

**This app does not issue tax invoices, implement e-invoicing, calculate VAT, generate ZATCA QR codes, or submit documents to ZATCA.** Official invoicing remains in your separate system. All printable documents here say **PRO FORMA — NOT A TAX INVOICE** in the selected language.

Prices are manager-entered agreed amounts in SAR, stored/calculated as integer halalas. Only one discount and one voucher may be applied to a booking. Percentage discounts round down to a halala; discounts cannot exceed the gross amount. Quotes are revalidated on booking, and price changes require a fresh quote. Payment records describe money already received externally; this app does not collect funds. References prevent duplicate payment recordings. Refund records require a reference from the external credit-note/refund process and retain signed ledger entries.

Default cancellation rule: future unpaid bookings can be cancelled; the pro forma is voided, the voucher restored and discount redemption released. Bookings with recorded payments require an externally completed refund to be recorded first. Past/started bookings cannot be cancelled. Managers can edit future booked classes while preserving booked capacity, assigned horses and the original price; rider and resource conflicts are rechecked and affected members notified. Voucher value cannot be edited after issuance; issue another voucher if required. These are current operational defaults, not finalized business policies.

## Academy portal and member portal

The same authenticated application presents two different workspaces. Managers enter the **Academy portal**, with horses, scheduling, care, members, pricing, accounts and reports. Invited clients enter the **Member portal**, with their own upcoming sessions, instructor-filtered class catalogue, booking management, financial balances and lesson-credit history. Members cannot access manager-only APIs or other members' financial/credit records.

Create a pricing plan with category **Lesson package**, its SAR price and number of credits. Members request the package, which creates a pro forma payment request. Credits are awarded exactly once after the academy records full external payment. Partial payments do not release credits. Managers can also create package payment requests for a selected member.

Each class has a configurable credit cost (default one). Members can choose to pay the session price or use sufficient credits; discounts and monetary vouchers cannot be combined with lesson credits. Credit use and booking happen in the same transaction. Eligible cancellation restores the exact credits consumed. Package credit-backed bookings produce zero-value operational pro formas, avoiding double-counting the package price in reports. Package refunds require a complete externally recorded refund and enough unused credits to reverse the package allocation; the package payment request is then voided. Credits are currently pooled across eligible class types and have no automatic expiry. Package discount redemption and recurring subscriptions are not implemented.

## Notifications and configuration

In-app notifications work without external services. To enable email, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` securely on the server; never put secret values in Git or chat. The sender must be authorized by your SMTP provider. TLS verification remains enabled; port 465 uses TLS and other ports require STARTTLS. Failed emails remain queued for up to five attempts. Email notification delivery is at-least-once; the outbox uses stable message IDs. Actual delivery needs a real provider and has not been validated in this environment. Web/native push, SMS and WhatsApp are not integrated.

`DATABASE_PATH` selects the shared database file (default `data/academy.sqlite`, ignored by Git). `PUBLIC_ORIGIN` must be the exact HTTPS website origin in production, with no trailing slash. `NODE_ENV=production` enables Secure cookies and requires an HTTPS origin. The app checks request origins and a custom header on every mutation and rate-limits authentication/API requests. The server binds to loopback by default; `HOST=0.0.0.0` is available for containers behind a controlled TLS ingress.

## Deployment and backups

Run one Node instance against a persistent local disk and terminate HTTPS at a reverse proxy. Set `NODE_ENV=production`, `PUBLIC_ORIGIN=https://your-approved-domain`, and an absolute persistent `DATABASE_PATH`. This is a **single-instance SQLite architecture**, not a horizontally scaled service. Keep the process running for reminder jobs. Back up the database consistently using SQLite's backup API (`npm run db:backup -- /secure/path/academy.sqlite`) or stop the process before copying the database and WAL files together. Backups contain account and business records; restrict access and verify restores in an isolated environment.

```sh
npm ci
npm run build
NODE_ENV=production PUBLIC_ORIGIN=https://your-approved-domain npm start
```

An actual public deployment, domain/TLS configuration, SMTP sender verification and backup schedule remain deployment work. No live production site is provisioned by committing this code.

## Validation

```sh
npm test
npm run build
# Install a Playwright browser, or use an existing compatible Chromium:
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

API integration tests use temporary databases and cover authentication, stable isolation, permissions, CSRF, invitation reuse, password hashing, reservation concurrency, resource/medical restrictions, discount and voucher accounting, pro forma cancellation, external payments/refunds, notification ownership/deduplication, the email outbox and database persistence. The browser test uses an isolated in-memory API and built frontend to exercise account creation, horse/pricing/class setup, booking, discount redemption, pro formas, medical care, feeding, inventory, vouchers, payment/refund recording, reports, a separate invited member account, package purchase requests, credit-backed bookings/cancellation, and Arabic mobile layout. Browser screenshots are written to ignored `test-results/`.

## Scheduling and member administration

The booking screen defaults to a full month and has day, week, month and quarter calendars in Riyadh time, date navigation, and instructor, horse and arena filters. The calendar complements the session cards. New classes have a **Repeat weekly** field (1–52); creating a series validates every occurrence and rolls back the whole series on a conflict. Each occurrence can be edited independently. Series-wide editing and recurrence exceptions are not implemented.

Managers can create members, edit their names, assign staff roles and remove academy access. Temporary passwords require 6 characters. Names of accounts shared across academies cannot be changed by one academy. Removal preserves financial history and is blocked until bookings, open payment requests and credit balances are reconciled. Instructors manage classes and attendance; vets manage horses and medical records; caregivers manage feeding and tasks. Staff cannot see other members' payment or credit records or manage billing/roles.

Attendance (present, absent, excused) is available on activated bookings. Full classes offer a waitlist. Cancellation notifies waiting members when a place opens; joining the waitlist does not reserve a place or bypass payment, and members must explicitly book the available place.

## Payment voucher approval and activation

Cash-priced bookings start as **Pending payment** (`pending_payment`), holding capacity and the assigned horse. Services and packages also remain pending. Managers use **Record payment** to enter the received amount, unique payment voucher reference and voucher details/invoice reference. Details are required and stored in the payment ledger, visible from the payment request. Partial payments remain pending. Full payment changes the payment request to **Paid** (`settled`), activates the booking/service and releases package credits exactly once. Only managers may record payments.

Bookings using previously paid lesson credits, or fully covered by gift vouchers/discounts with no remaining amount due, activate immediately. Refunding a paid booking suspends its activation until the balance is paid again. Payment activation rejects a started class or a medically unavailable assigned horse. Existing unpaid confirmed bookings migrate to pending on database startup. Pending places do not expire automatically; managers must cancel/reconcile abandoned requests to release capacity. Service activation is an operational status on its payment request; there is no automated third-party service provisioning.

Production API traffic defaults to **https://riyadhpolo.softfm.com**, configured in `config/backend.json`. An existing `ACADEMY_BACKEND_URL` environment variable overrides it. See [backend deployment instructions](docs/VERCEL.md). DNS creation alone does not deploy the Node service; HTTPS and a persistent database must be configured on the backend host.

## Remaining scope

This is a functional first server-backed release, not the entire long-term specification. Password recovery/email verification, recurring subscription billing, document uploads, detailed breeding/foaling workflows, full purchasing/stock-movement accounting, advanced analytics, configurable cancellation rules, online payments, automated integration with the separate invoicing system, native apps and offline synchronization remain future work. Current medical fields record veterinary instructions; they do not prescribe doses. Instructor, vet and caregiver permissions are enforced by the API; managers control role assignment.

## Brand and source

Theme aligned with `SoftfmIos/Riyadh_PoloAcademy` (`website`, `37f387f`): navy `#0d2d45`, deep navy `#082237`, ivory `#f7f3eb`, stone `#eae4d8`, gold `#b88e50` and gold text `#806233`. Tajawal is hosted locally with its license/source metadata in `public/fonts/`. The academy crest is the original from the user's reference repository, matching the supplied logo; its geometry is preserved. The four uploaded projects were used as functional references, not copied as application source.

## Settings, stables and client portal

Managers have a Settings hub for academy details, Arabic/English names, horse breeds, instructors, training locations/arenas, horses, members, scheduling defaults, pricing and care. Instructors, breeds and arenas are reusable catalogues. Arena addresses are stored alongside names. Existing free-text instructor/arena/breed entries remain supported. New member and stable forms open as dialogs. Passwords require 6 characters with no composition rules.

Settings → Stable management creates independent stable workspaces. The same manager can switch between them; horses, bookings, prices, care and members remain scoped to the selected stable. Members can be invited, created, or linked by an existing account email. Linking never changes their existing password. Do not create another stable as a substitute for adding a physical training arena.

Clients receive a mobile portal with upcoming lessons, pending/active status, booking/cancellation, balance, packages and payments. Calendar browsing is optional in the client booking view. Administration tools remain restricted by role. All interface controls use Tajawal, and Arabic/English displays use Western digits (0–9). Bilingual names use the selected language with a legacy-name fallback; stored names are not machine-translated.

Generic record saves clear search filters, invalidate older refresh responses and verify the saved record ID in a fresh server list before displaying success. Refresh failures are reported distinctly; a completed save is not silently treated as a failed write or automatically retried.

## Medication and feeding tasks

For medication scheduling, enter the veterinarian's prescribed medication/dose, first-dose date/time, interval in hours, duration in days and assignee. All doses are generated at save time (maximum 1000 per course). Leaving interval/duration at 0 creates a medical record without dose tasks. Mark each dose complete from its schedule or the Tasks screen; completion stores actor ID and timestamp, with an append-only completed/reopened event history. Repeated completion requests are idempotent. Assigned trainers and caregivers can complete tasks. Changing a course cancels obsolete pending doses while preserving completed doses/history. Completing the medical record cancels the remaining pending dose tasks.

Each feeding plan defines one daily feeding time, duration (default 30 minutes), assignee and optional start/end dates. Use multiple plans for multiple daily meals. Tasks are generated on a rolling 28-day horizon; generation extends while the Node process runs. Feeding windows reserve the horse even if the task is checked early, including windows crossing midnight. Booking assignment and payment activation exclude feeding overlaps. Creating/editing a plan that overlaps an existing confirmed or pending horse booking is rejected; reconcile those bookings first. Future unbooked classes remain visible but their available places reflect feeding restrictions. Stopping a plan cancels pending tasks without deleting completed records.

Passenger must keep the Node process running to extend schedules and deliver reminders; an idle-stopped process does not execute background work. Existing generated tasks remain stored in SQLite. These operational schedules record prescribed care; the application does not prescribe medication or dose.
