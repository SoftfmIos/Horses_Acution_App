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

Development starts the API on port 3001 and Vite on 5173. Vite proxies `/api` to the API with the same browser origin. `PORT` and `WEB_PORT` can override these. There are no seeded accounts, sample financial records, or default passwords. Create a stable account, add horses and prices, then schedule classes. Invite members from the Members screen; invitations are single-use and expire after seven days. An invitation is required to join an existing stable. Public registration without an invitation creates a **separate** stable.

```sh
npm run build
npm start
```

The Node server serves both the built website and API. Running `dist` on a static-only host will not provide login, bookings or database features. The original browser demo's local data is not imported into the real database.

## Implemented workflows

| Area | Available now |
| --- | --- |
| Accounts | Stable registration, member invitations, login/logout, salted scrypt passwords, opaque hashed server sessions, HttpOnly cookies, server-enforced manager/member permissions |
| Shared data | Organization-scoped server records, transactional writes, persistent SQLite database, audit events |
| Classes | Create/edit dated classes and rides; instructor, arena, horse roster, capacity and price; reject overlapping resources; edit only without active bookings |
| Member portal | Personal upcoming sessions, lesson-credit balance/history, outstanding payment requests, own bookings and instructor filtering |
| Bookings | Members book/cancel their own sessions; managers see all; server checks duplicates, rider overlap, capacity and horse availability; concurrent reservations cannot oversell |
| Horses | Profiles, breed, birth date, microchip/passport, notes and riding status |
| Medical | Editable visits/care, medication instructions, due dates, vet, completion record and riding restrictions; affected booking members receive review notifications |
| Feeding | Editable daily horse/feed/quantity plans with assigned member; daily tasks generated in Riyadh time while the service runs |
| Tasks | Due dates, assignments, completion and reminders; members can complete only their assigned tasks |
| Pricing | Configurable SAR prices for group classes, private lessons, rides, boarding, other services and prepaid lesson packages |
| Discounts | Percentage or fixed SAR codes, minimum spend, expiry, total redemption limit, active/inactive state |
| Vouchers | Manager-issued, high-entropy codes, expiry, stored balance, partial redemption; applied after discounts |
| Payment requests | Booking-generated or manually created pro formas, recorded external payments/refunds and external invoice/credit-note references |
| Inventory | Quantities, units, reorder thresholds, expiry dates, editable stock and low-stock reminders |
| Reports | Operational totals for gross requests, discounts, vouchers, recorded payments, outstanding amounts, bookings, members, low stock and overdue tasks |
| Notifications | Persistent, per-user in-app inbox and read state; booking/payment events, upcoming class, task, medical and stock reminders; optional durable SMTP email outbox |

UI data refreshes every 30 seconds. Reminder jobs run every minute and deduplicate repeated reminders. Feeding tasks are created for the current Riyadh day, not retroactively for days when the server was stopped. A medically restricted horse cannot receive new bookings. Existing affected bookings are flagged through notifications rather than silently cancelled or reassigned. Completing a medical record does not automatically clear rest; a manager must explicitly return the horse to ready after clearance.

## Pricing and ZATCA boundary

**This app does not issue tax invoices, implement e-invoicing, calculate VAT, generate ZATCA QR codes, or submit documents to ZATCA.** Official invoicing remains in your separate system. All printable documents here say **PRO FORMA — NOT A TAX INVOICE** in the selected language.

Prices are manager-entered agreed amounts in SAR, stored/calculated as integer halalas. Only one discount and one voucher may be applied to a booking. Percentage discounts round down to a halala; discounts cannot exceed the gross amount. Quotes are revalidated on booking, and price changes require a fresh quote. Payment records describe money already received externally; this app does not collect funds. References prevent duplicate payment recordings. Refund records require a reference from the external credit-note/refund process and retain signed ledger entries.

Default cancellation rule: future unpaid bookings can be cancelled; the pro forma is voided, the voucher restored and discount redemption released. Bookings with recorded payments require an externally completed refund to be recorded first. Past/started bookings cannot be cancelled. Managers cannot edit a class with active bookings. Voucher value cannot be edited after issuance; issue another voucher if required. These are current operational defaults, not finalized business policies.

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

## Remaining scope

This is a functional first server-backed release, not the entire long-term specification. Granular instructor/vet/caregiver roles, password recovery/email verification, recurring classes, attendance, waitlists, recurring subscription billing, document uploads, detailed breeding/foaling workflows, full purchasing/stock-movement accounting, advanced analytics, configurable cancellation rules, online payments, automated integration with the separate invoicing system, native apps and offline synchronization remain future work. Current medical fields record veterinary instructions; they do not prescribe doses. Managers and members are the two enforced roles in this release.

## Brand and source

Theme aligned with `SoftfmIos/Riyadh_PoloAcademy` (`website`, `37f387f`): navy `#0d2d45`, deep navy `#082237`, ivory `#f7f3eb`, stone `#eae4d8`, gold `#b88e50` and gold text `#806233`. Tajawal is hosted locally with its license/source metadata in `public/fonts/`. The academy crest is the original from the user's reference repository, matching the supplied logo; its geometry is preserved. The four uploaded projects were used as functional references, not copied as application source.
