# Riyadh Polo Hills — Club Management System
## Knowledge base for drafting Standard Operating Procedures

| Document control | Value |
| --- | --- |
| Document ID | RPH-CMS-KB-001 |
| Revision | 1.0 |
| Prepared | 20 November 2026, Asia/Riyadh |
| Purpose | Supply another AI with reliable context to draft SOPs for the club management system and its connected operating workflows. |
| Scope | Authenticated club/academy management web portal, member portal, shared backend, and native iOS companion app. |
| Explicit exclusion | The public Riyadh Polo Hills project/marketing website, its design, its content, and proposed destination facilities. Do not edit or infer operating procedures from that website. |
| Status | Knowledge base for SOP drafting. It is not an approved operating manual, veterinary protocol, contract, tax opinion, or confirmation of live deployment. |
| Intended readers | Club management, authorised operations staff, finance, instructors, horse-care personnel, system administrators, and an AI SOP drafter. |
| Information handling | Internal operational reference. Contains no passwords, SMTP secrets, private keys, reviewer credentials, or live customer records. |

## 1. Instructions to the AI receiving this file

Use this file to draft a complete, modular SOP manual for the **club management system**. Do not redesign, rewrite, deploy, or change the public project website. Do not execute system actions while drafting SOPs.

Separate four categories throughout your work:

- **CONFIRMED SYSTEM RULE:** Behaviour verified in the inspected application source or its focused tests. Explain it accurately, including restrictions.
- **OWNER-CONFIRMED CONTEXT:** Business intent or an operating preference explicitly provided by the club operator.
- **PROPOSED CONTROL:** A recommended responsibility, review, checklist, or handover practice. Label it as proposed until management approves it.
- **TBC — MANAGEMENT APPROVAL REQUIRED:** A commercial, safety, veterinary, legal, staffing, or facility policy not established by the available evidence. Ask for it or leave a visible placeholder. Never invent it.

The presence of a software module does not prove a service is currently offered, a facility is open, an employee is qualified, or a policy has been approved. A technical validation limit is not a safe operating limit.

Do not convert demo prices, people, horse records, feeding quantities, medical entries, images, or PDFs into real club policy. Do not assume that a past test pass proves the production server or a physical iPhone currently works.

Draft usable procedures with clear triggers, prerequisites, permissions, numbered actions, expected results, exceptions, records, handovers, and approval points. Use English with Arabic screen labels/terminology where helpful. If full bilingual SOPs are requested, maintain matching SOP IDs and meaning in both languages; mark translations for human review.

## 2. Evidence, versions, and confidence

### 2.1 Reference baseline

- Club management web/backend source inspected: **1.31.3**, commit `bc8d886`, in `SoftfmIos/Horses_Acution_App`.
- Native iOS source inspected: **1.1.6** on branch `iOSApp`; the last submitted build identified by the operator was **1.1.6 (21)**.
- The web application and iOS app use the same authenticated backend and database. The installed app, deployed frontend, and deployed backend can have different version numbers.
- Latest production deployment, actual fleet/staff counts, live account permissions, SMTP delivery, completion of demo media imports, and current App Store approval status were **not verified for this document**.
- The public project website is outside this document's scope and is not an evidence source for club operations.

### 2.2 Source precedence

When information conflicts, use: current server enforcement and focused tests; current web/iOS implementation; current operating documentation; then older explanatory text. Flag unresolved conflicts rather than silently choosing the most convenient statement.

Examples of older wording that must not override current behaviour:

1. Descriptions of members completing assigned staff tasks are superseded by current staff-only task controls. Ordinary members do not gain access to academy work merely because an account is named as an assignee.
2. Descriptions of the iOS Account screen as language/sign-out only are superseded by current email/password changes and account deletion.
3. Database/schema terminology such as `owner` can represent staff-class membership; it does not automatically mean business ownership or system-administrator status.
4. A demo seed's record counts and financial values are synthetic, not the club's actual operating figures.

### 2.3 Source index

The knowledge in this file is self-contained, but a technical reviewer can consult:

| Subject | Main evidence files |
| --- | --- |
| Navigation and web operations | `src/main.jsx`, `src/Scheduling.jsx`, `src/BookingCredits.jsx`, `src/AccountSecurity.jsx` |
| Authentication, bookings, finance, settings | `server/app.js` |
| Own account changes/deletion | `server/account.js` |
| Horses, photos, documents, boarding, inventory movements | `server/stable-operations.js` |
| Roles and action mapping | `shared/permissions.js`, `src/UserPermissions.jsx` |
| Holds, availability and recurrence | `shared/booking-policy.js`, `shared/class-openings.js`, `shared/recurrence.js` |
| Care and feeding generation | `server/care.js`, `shared/medication-schedule.js` |
| Money/session reporting | `shared/session-credits.js`, report helpers under `src/` and `tests/` |
| Email | `server/email-settings.js`, `server/email-template.js`, `server/index.js` |
| Database and administrative tools | `server/db.js`, `scripts/backup.mjs`, `scripts/create-admin.mjs` |
| Existing workflow descriptions | `README.md`, `docs/STABLE_WORKFLOWS.md`, `docs/VERSIONING.md` |
| Native app rules | `ios/RiyadhPoloHills/`, `ios/WEB_PORTAL_PARITY.md` |
| Demo replacement and media | `docs/DEMO_RESET.md`, `docs/DEMO_MEDIA.md`, `server/reset-demo.js`, `server/demo-media.js` |
| Regression evidence | `tests/system.test.js`, `tests/account-security-browser.mjs`, `tests/boarding-browser.mjs`, `tests/member-account.mjs`, other focused `tests/*.test.js`, native contract tests |

## 3. Club context and system boundaries

### 3.1 Confirmed operating intent

The system supports management of an equestrian/polo club and academy associated with Riyadh Polo Hills in Riyadh, Saudi Arabia. Core activities represented in the software are riding/polo session scheduling, member administration, horse ownership and records, horse care, feeding, staff tasks, boarding/stall allocation, prepaid session balances, external-payment recording, reporting, and communications.

The operator requested Arabic and English support, consistent branding, a member/staff iOS app, private member data, member-owned horse visibility, and restoration of session balance when an eligible credit-funded booking is cancelled.

Registered legal entity, full facility address, operating hours, actual services, approved tariffs, membership terms, professional qualifications, and responsible managers must be confirmed by management. Do not infer these from application branding or demo records.

### 3.2 Platforms

| Platform | Purpose | Operating boundary |
| --- | --- | --- |
| Management web portal | Staff/administrator control of club operations | Administrative setup and most authoring are performed here. |
| Member web portal | Customer access to personal bookings, packages, balances, invoices and owned horses | Access is account- and academy-scoped. |
| Native iOS app | Daily member/staff use | Not a replacement for all web administration. |
| Shared Node.js API and SQLite database | Authentication, authoritative rules and records | Server validation overrides a stale screen or apparent UI permission. |
| External invoicing/accounting process | Official tax invoices, payment verification, credit notes and actual refunds | This management system records operational references; it does not replace that process. |
| Configured SMTP service | Transactional email and password recovery | Delivery depends on valid configuration and provider availability. |

### 3.3 Addresses and communication

| Item | Known reference | Qualification |
| --- | --- | --- |
| Management portal | `https://app.riyadhpolohills.com` | Established system URL; live availability must be checked. |
| Persistent API | `https://riyadhpolo.softfm.com` | Backend service, not a separate customer portal. |
| Support mailbox | `support@riyadhpolohills.com` | Operator reported creating it. Confirm monitoring and response ownership. |
| Notifications mailbox | `notifications@riyadhpolohills.com` | Operator reported creating it. Authorised sender/SMTP setup still required. |
| Privacy page | `https://app.riyadhpolohills.com/privacy.html` | Check the deployed page and actual practices before relying on it. |
| Customer support page | `https://app.riyadhpolohills.com/app.html#support` | App-support information, not evidence that every club service is live. |

Keep individual administrator logins, customer contacts, passwords and provider secrets out of public SOP copies. Maintain an approved internal responsibility/contact directory separately.

### 3.4 Language, time and money conventions

- English and Arabic interfaces; Arabic uses RTL layouts.
- Store bilingual names/titles where supported. Do not create a second record merely to provide an Arabic translation.
- Staff, horse, arena, price and plan IDs are more reliable for reconciliation than names alone.
- Operational calendars and date locks use **Asia/Riyadh**. Backend timestamps are commonly stored in UTC; display and interpret the relevant local date/time carefully.
- Currency is **SAR**. Monetary calculations use integer halalas: SAR 1.00 = 100 halalas.
- Monetary balance, voucher balance, physical inventory quantity and session credits are four different things.
- A horse owner is a linked user account in the selected academy, not merely a matching display name or email in a note.

## 4. Roles, permissions and responsibility

### 4.1 Access categories

| Access category | Confirmed meaning | SOP implications |
| --- | --- | --- |
| System administrator | Administrator flag plus academy access; can manage permission assignments and administrator status | Restrict to designated people; retain an eligible administrator/staff owner when transferring access. |
| Staff | Academy worker with granted pages and actions | A staff label alone does not grant all operations. |
| Instructor / veterinarian / caregiver labels | May appear in legacy role handling, UI or staff assignments | Treat professional duties and qualifications separately from software labels. Verify actual permissions. |
| Member/client | Personal customer workspace | Own bookings, personal finances/session balance and owned horses; no academy-wide staff work. |
| Horse owner | A relationship between a horse and an account | Can apply to a member or staff user. Ownership access is distinct from horse-management permission. |
| Instructor profile linked to user | Public/operational instructor identity linked to a staff account | Enables instructor self-photo management and instructor-related reminders; verify the correct link. |
| Hosting/deployment operator | Person with cPanel/GitHub/Vercel/Codemagic access | This authority is separate from in-app administrator status. |

An account can belong to more than one academy. Always verify the selected academy before creating or changing records. No role may bypass academy isolation.

### 4.2 Page and action grants

System administrators manage Users & Permissions. Page access allows viewing; **Add**, **Edit**, and **Delete** are independent. View-only does not permit mutations. Edit does not imply Add or Delete.

Permission areas include classes/bookings, horses, medical, feeding, tasks, pricing, billing, inventory, reports, members, settings, instructors, training locations/arenas, breeds, stalls, boarding, discounts, vouchers, stable management, and email settings.

| Operation | Relevant action mapping |
| --- | --- |
| Create record / create booking | Relevant module Add |
| Change record | Relevant module Edit |
| Cancel booking / end boarding | Relevant module Delete |
| Complete/reopen task; attendance | Relevant module Edit |
| Record payment or external refund | Billing Edit, plus business approval requirements TBC |
| Change another authorised profile photo | Relevant module Edit |
| Delete another authorised profile photo | Relevant module Delete |
| Upload horse document | Horses Add |
| Delete horse document | Horses Delete |
| Receive inventory | Inventory Add |
| Change settings | Appropriate settings Edit |
| Grant roles/permissions; repair eligible missing package credits | System-administrator operations |

Ownership exceptions allow eligible personal/owned-horse reads and own-photo controls. They do not authorise editing the academy's other horses, users or payments.

The API independently enforces access even if the screen shows a button. Conversely, a hidden screen does not justify direct API workarounds. Have an administrator correct access appropriately.

### 4.3 Proposed responsibility map — management must approve

| Operational responsibility | Proposed responsible function | Proposed approval/escalation |
| --- | --- | --- |
| Member onboarding and contact corrections | Reception/member services | Club manager; system admin for login-email/admin changes |
| Scheduling, rider/horse assignment | Scheduling officer/head instructor | Head instructor/operations manager |
| Payment verification, references, reconciliation | Finance | Designated financial approver; limits TBC |
| Medical clearance and treatment directions | Qualified veterinarian/designated clinical authority | Veterinary lead; qualifications and scope TBC |
| Feeding/grooming execution | Assigned care staff | Stable/horse-care supervisor |
| Stock receipt/count reconciliation | Stores/care supervisor | Finance/procurement approver TBC |
| Boarding capacity and moves | Stable manager | Operations manager; finance if billing terms change |
| Access provisioning and reviews | System administrator | Club manager/data owner |
| Backups, deployment and incidents | Technical operator | System owner/change approver |

These are proposed work responsibilities, not claims that the named positions exist or that the software contains those exact role titles.

## 5. Records and relationships

| Record | Key relationships / fields |
| --- | --- |
| Account/user | Stable user ID, login email, name and bilingual name fields; may have several academy memberships. |
| Academy/stable | Scope for records, permissions, settings and most business operations. |
| Membership | Links account to academy and access class. |
| Instructor | Names, active flag, optional linked staff user, photo. |
| Horse | Names, breed, birth date, microchip/identifier, owner account, assigned instructor, status and notes. |
| Arena/training location | Name, bilingual labels, active flag, location type; stored independently of a class. |
| Price plan | Category, amount, active state, package credit quantity when applicable. |
| Class/session | Title, start/end, instructor, location, eligible horse roster, capacity, price plan, credit cost. |
| Booking/reservation | Member, class, assigned horse, status, creation time, payment-hold deadline where applicable. |
| Pro forma/payment request | Billed member, description, optional booking link, amount, discount, voucher, due/paid/status, price/package snapshot. |
| Payment entry | Pro forma, signed amount, unique reference, external voucher/credit-note details, timestamp. |
| Credit ledger | Member, integer session delta, reason, optional booking/pro forma link, timestamp. |
| Discount | Code, fixed/percent rule, minimum amount, expiry, limit, active state, redemption count. |
| Voucher | Code, initial/remaining monetary value and expiry. |
| Medical/care record | Horse, care type, date/due date, course/recurrence where used, assignee, notes, restriction and completion. |
| Feeding plan | Horse, feed/quantity, time, duration, start/end dates, assignee, optional inventory item/units. |
| Task occurrence | Actual due timestamp, assignee, horse, optional originating care/feeding plan, completion actor/time, cancellation flag. |
| Inventory | Item, unit, quantity, reorder threshold, expiry; linked stock movements document changes. |
| Stall | Name, capacity and active state. |
| Boarding stay | Horse, billed account, stall, inclusive dates, price plan, linked pro forma, active/ended state. |
| Horse document | Horse, title/translations, category, filename, MIME, creation details and protected content. |
| Photo | Academy + profile kind + target ID; protected image data and update timestamp. |
| Notification/email job | Recipient, event, read/delivery state and event details. |
| Audit/task history | Actor, action, record reference and time; not a substitute for signed business approval. |

The staff member entering a booking or payment is the **operator**. The selected member owns the booking/pro forma and receives its balance effects. Do not substitute the operator for the customer.

## 6. End-to-end operating chain

The normal dependency chain is:

**Configure academy and access → create/link users → prepare instructors, locations, horses and prices → publish future classes → quote/book for the correct member → verify external payment or consume credits → deliver session and record attendance → handle exceptions/cancellation → reconcile reports and communications.**

Parallel horse-care operations are:

**Maintain horse identity/status → author approved care/feeding plans → assign occurrences → perform and record work → account for linked stock → review exceptions and clearance → maintain timeline/documents.**

Boarding follows:

**Create active stall and boarding price → check date-range capacity → assign horse/billed member/dates → reserve stall and create pro forma → record payments → move/edit within restrictions or end stay → reconcile final financial position.**

## 7. User administration and account lifecycle

### 7.1 Onboarding and membership

Confirmed routes include adding a user with a temporary/generated password, linking an existing account by email, and issuing an invitation. Invitations are single-use and expire after seven days.

Web registration with an invitation joins the intended academy. Registration without an invitation creates a separate academy. Member-onboarding SOPs must avoid accidentally directing a new club member to create a different academy.

Recommended process for the SOP:

1. Confirm intended academy, identity/contact details, member/staff classification and requested access.
2. Search for an existing account before adding a duplicate.
3. Create or link the account through the approved screen.
4. Assign bilingual names and the correct membership/role; request only necessary grants.
5. If applicable, link the instructor profile and horse ownership to the correct user ID.
6. Supply initial access through an approved private channel and confirm successful login.
7. Record completion, operator, access granted and any pending consent/eligibility approvals.

The code accepts passwords of at least six characters in the relevant flows. This minimum is a technical rule, not a recommended security standard or an approved password policy. Management/IT must set its operational standard.

### 7.2 Login, recovery and email/password changes

- Custom email/password login and server sessions; no mandatory email OTP or third-party social login in the inspected native build.
- Passwords are salted/hashed, not recoverable plaintext.
- Password reset emails use single-use, expiring tokens; the inspected expiry is 30 minutes. Successful reset revokes previous sessions.
- A forgotten-login-email assistance option exists in the web login/recovery experience; establish how staff will verify identity without revealing other members' accounts.
- Self-service email/password changes require the current password and sign the account out of existing sessions/devices. The user then signs in with the new details.
- An administrator changing another user's login email requires the appropriate administrator authority and revokes that account's sessions.
- An account shared across academies may be required to update its own profile rather than allowing one academy to change global identity fields.
- The system does not recover an existing password for emailing. Optional welcome/login emails can include a supplied valid password under explicit controls; prefer recovery or a secure onboarding process rather than routinely sending passwords.

SOPs must verify the correct account after sign-in, especially after switching users on a shared device. Never work under the previous user's displayed identity.

### 7.3 Removal versus deletion

**Removing a member from one academy** and **self-service deletion of the global account** are different workflows.

Academy membership removal is blocked where protected administrator status, the last staff owner, active bookings, nonzero session balance or open invoices require reconciliation. Do not bypass the checks by editing the database.

Self-service deletion is available in Account & security. It requires the current password and explicit confirmation (`DELETE` in the native flow). It revokes sign-in, removes/anonymises profile information and removes academy memberships; financial/service records needed for reconciliation or retention may remain with a deleted-account identity. It cancels applicable upcoming bookings and flags money requiring reconciliation. Deletion does not itself execute monetary refunds.

The last academy staff owner/administrator must transfer responsibility before deleting the account. Club retention periods, legal basis, customer wording, access-request handling and reconciliation ownership require management approval.

A supervisor's offboarding review should also consider live care assignments, linked instructor profiles, owned horses and current boarding responsibilities. Do not assume the deletion workflow automatically reassigns every operational relationship. This is a proposed handover control, not an additional software deletion blocker or authority to obstruct a lawful account-deletion request.

## 8. Horse records, ownership, photos and documents

### 8.1 Horse identity and ownership

Maintain one authoritative horse record with names, breed, birth date, identifier, owner link, assigned instructor, status and relevant notes. A linked owner must belong to the academy. Verify IDs/relationships instead of assigning ownership by similar names.

Horse status values:

| Status | System meaning |
| --- | --- |
| `ready` | Eligible for new bookings if all other checks pass. |
| `rest` | Not eligible for new riding bookings. |
| `retired` | Not eligible for new riding bookings. |

Software readiness is not a professional fitness assessment. The authority to clear a horse, the required evidence, review frequency, assessment criteria and transport/intake checks are TBC.

### 8.2 Visibility

- Members receive full permitted information for horses linked to their own account.
- A member's booking on another horse does not give them ownership of it or its private medical, feeding, task, document or other-client records. Shared/booked horses can expose basic identity and that member's own riding information.
- Staff can see academy horse records according to page permissions; detailed care sections also follow relevant grants.
- A staff user who owns a horse can access their own horse records without academy-wide horse-management permission.
- The iOS My horses view uses ownership data independently of general catalogue access; an empty view may mean the wrong login/academy or a missing owner link, not that the horse should be recreated.

### 8.3 Photos

Web Change photo accepts JPEG/PNG up to 10 MB, then resizes/compresses for upload. The protected photo API has a smaller limit of approximately 512 KB. Different limits apply to documents.

Horse, instructor and member/user photos are supported. Instructors can manage their linked instructor photo; users can manage their own account photo. Editing/deleting other profiles requires the appropriate authority. Member avatars may be objects/club imagery rather than faces.

Use approved images and record rights/source where relevant. Do not represent a generated demo horse image as evidence of a real horse's identity, condition, pedigree or ownership.

### 8.4 Horse profile and document workflow

The horse profile includes its card, history, care, rides and documents. Timelines/cards are grouped by Riyadh month, with print/export options where available.

Documents use a horse link, title, optional English/Arabic titles, category and protected file content. Categories include passport, vaccination, medical, ownership and other. Accepted formats are PDF, PNG and JPEG up to 2 MB each. Upload and deletion are permission-controlled; owners can read their authorised horse documents.

Draft document-control SOP steps: verify horse identity → confirm document type, provenance and approval → upload with an accurate bilingual title → open/download it to verify the correct attachment → confirm owner/staff visibility → record any replacement or removal. Define who can certify records and whether older versions must be archived; the system is not a formal document-signature or legal-certification service.

## 9. Catalogues, pricing and schedules

### 9.1 Setup catalogues

Maintain instructors and their user links/photos, training locations/arenas, horse breeds, active horses and prices before scheduling. Locations can include saved open areas, indoor arenas and trails. A software location entry does not prove a route is approved for riding.

Deactivate records where supported instead of casually deleting referenced data. Confirm impacts on existing bookings/stays before changes. The correct dependencies and conflict checks must remain intact.

### 9.2 Pricing

Price categories include class/group session, private lesson, ride, boarding variants, lesson package and other service. Boarding selectors accept the boarding categories defined by the application, not an unrelated price renamed to look like boarding.

Lesson packages require a positive session quantity; credits do not belong on normal per-session or boarding prices. Editing package prices/quantities must be read back after saving. Existing invoices retain their applicable snapshots; editing the catalogue is not an automatic correction of old invoices or package entitlements.

Actual tariffs, package eligibility, staff discounts, promotions, tax treatment, price-change approvals, refund approval limits and commercial terms are TBC. Never use synthetic seed prices as the club's published fee schedule.

### 9.3 Publishing classes

Create a future opening with title, instructor, location, start/end, horse roster, capacity, price plan and credit cost. The server checks resources, rider overlaps, duplicate bookings, capacity and horse availability.

Recurring schedules support selected dates/days and recurrence parameters. Weekly-series limits and recurrence validation are technical constraints, not an instruction to book every future week automatically. Multi-instructor expansion creates separate eligible openings with distinct available resources; resource shortages/conflicts cause rejection rather than permission to overbook.

When expanding an existing class into more dates, preserve the original occurrence and verify the saved dates for every selected instructor. Read back the schedule after save; do not assume a success message proves every intended occurrence was created.

Editing a booked future class must retain booked capacity, assigned resources and original financial snapshots as enforced by the server. Conflicts are rechecked and affected members can be notified. Management must approve a rescheduling/communication policy and specify who may offer alternatives.

## 10. Booking, payment holds, attendance and cancellation

### 10.1 Standard booking workflow

1. Verify the academy, intended member, session date/time, instructor and availability.
2. For staff booking, explicitly choose **Book for member**. The staff account is the operator, not the customer by default.
3. Choose normal monetary pricing or sufficient session credits.
4. Enter any permitted discount/voucher only for the applicable monetary route.
5. Calculate a fresh quote and check the selected customer and financial terms.
6. Confirm and verify booking state, assigned horse, linked pro forma and any hold deadline.
7. Confirm that the member can see the booking and that balance/payment effects match the chosen route.

The server revalidates the quote at confirmation. A changed price/member/credit amount or stale availability requires a new quote; do not repeatedly confirm an outdated screen.

### 10.2 Reservation states

| State | Meaning and handling |
| --- | --- |
| `pending_payment` | A timed hold; it consumes applicable availability until settled, cancelled or expired. |
| `confirmed` | Booking has met the system's confirmation conditions; it is not proof the customer attended. |
| `cancelled` | Cancelled through an allowed workflow; inspect related financial/credit entries. |
| `expired` | Payment hold released after deadline/class start; inspect whether money needs reconciliation. |

Attendance is a separate record (for example attended/absent). Do not assume attendance rewrites the booking into a different financial state or automatically changes refund/credit entitlement.

### 10.3 Holds

- Default configured hold duration: 72 hours.
- Configuration range: 1–720 hours.
- New deadline is the earlier of the configured duration after booking and the class start.
- Previously stored hold deadlines are retained when settings change.
- Partial payment does not confirm a booking or automatically extend its hold.
- On expiry, the seat is released. A request with no recorded money is voided; one with recorded money becomes refund/reconciliation required.
- A late payment must not be forced onto an expired/closed request. Reconcile or create a valid new booking through the authorised process.

The business may want stricter timing, but do not invent a 24-hour/48-hour cancellation rule. Record the current configured value and obtain any policy decision separately.

### 10.4 Cancellations and balance restoration

| Situation | Confirmed system treatment |
| --- | --- |
| Eligible future booking made using session credits, no recorded money on the booking | Cancel booking, void its operational pro forma and restore the exact credits consumed. No monetary refund request is needed. |
| Future monetary booking with no recorded money | Cancel/void under the system rules; restore applied voucher balance and release discount redemption where applicable. |
| Booking with recorded money | Reconcile externally and record the refund/adjustment through billing before eligible cancellation; direct cancellation is blocked. |
| Partially paid hold expires | Booking expires; money remains recorded and request is flagged for reconciliation. No automatic cash transfer occurs. |
| Started/past booking | Standard cancellation is blocked. Escalate under the approved exception/no-show policy rather than editing history. |
| Refund of the original paid session package | Separate financial process, not the same as returning credits after a cancelled lesson. |

These same backend rules apply to web and iOS. Prevent duplicate restoration: a repeated cancellation must not add credits again.

### 10.5 Attendance and waitlists

Authorised staff record attendance for the correct reservation/member/session. Confirm the absence/no-show and any proposed makeup/refund policy before changing entitlement; those commercial consequences are not automatically established by the attendance label.

Waitlist entries are scoped to a class and customer. Availability notices may be generated when capacity is released. There is no confirmed automatic seat allocation, automatic payment, or guaranteed waitlist position/priority policy in this knowledge base. Staff should verify availability and a new confirmed booking instead of telling a customer that a notice guarantees a seat.

## 11. Session packages and balances

### 11.1 Package lifecycle

**Active package price with quantity → member/staff creates payment request → academy receives money externally → authorised staff records the full amount → credits awarded once → credits consumed by bookings → eligible cancellation restores consumed credits.**

Partial package payment releases no credits. Buying/requesting a single paid lesson is not automatically buying a package. A payment history entry alone does not prove credits should have been issued.

Each class has a credit cost; default is one, but verify its configured value. A booking requires sufficient balance and records its credit use atomically. Credits cannot be combined with a monetary discount or voucher for the same credit-funded booking.

Current implementation pools credits for eligible class use and does not automatically expire them. No recurring subscription, automatic renewal or per-package usage-expiry rule should be invented.

### 11.2 Ledger and reconciliation

| Ledger reason | Expected effect |
| --- | --- |
| `package.paid` | Add purchased sessions once. |
| `booking.used` | Subtract the booking's actual credit cost. |
| `booking.cancelled` | Restore credits for an eligible cancellation. |
| `package.refunded` | Reverse the package credit quantity for an authorised full package refund. |

**Remaining sessions = purchased − used + restored − refunded**, subject to any separately authorised adjustment records. The server ledger is authoritative; a stale card is not permission to manually grant more sessions.

Illustrative arithmetic only: 10 purchased − 3 used + 1 restored − 2 refunded = 6 remaining. This is not a club tariff or package promise.

For a paid request showing no balance, check: correct account/academy; package versus single-service price; recorded full settlement; saved package session quantity; existing credit-award entry; current backend/frontend/app; then refresh/read the dedicated balance view.

Eligible legacy package requests can require an administrator-reviewed correction with matching package, confirmed quantity and reason. Duplicate credit awards are rejected. Do not change today's catalogue quantity merely to force a historic invoice to issue arbitrary credits. Preserve the correction audit.

### 11.3 Package refunds

Where package credits have been awarded, the inspected refund route requires a full externally completed refund and sufficient unused credits to reverse the original allocation. Used bookings must be reconciled first. Record the external credit-note/reference and inspect both the payment ledger and credit ledger afterward. Authority to approve refunds and customer-facing conditions remain TBC.

## 12. Payment requests, payments, refunds and reporting

### 12.1 Financial boundary

The management system creates **pro formas/payment requests**, not official tax invoices. It does not calculate VAT, submit to ZATCA, create compliant ZATCA tax QR codes or execute bank/card payments. A QR code used for another operational feature is not evidence of tax-invoice compliance.

Official invoices and credit notes belong to the club's separate approved accounting/invoicing process. The system records references to external transactions. Accounting and tax policy must be supplied by authorised finance advisers.

### 12.2 Payment entry

Confirm receipt outside the app before entering it. Verify billed customer, pro forma, amount outstanding, supporting receipt and unique reference. The system rejects a payment above the remaining amount or duplicate reference and blocks payments onto closed/expired requests needing reconciliation.

Several payment entries can belong to one pro forma. A partial payment normally leaves it open; full settlement marks it settled and can confirm an eligible pending booking or award package credits. Final booking payment still checks that the class has not started and the horse is ready/available.

A signed payment record is not a payment gateway. Staff must not claim funds were collected merely because they entered an amount.

### 12.3 Financial statuses

| Status/display | Meaning |
| --- | --- |
| Open / awaiting payment | Outstanding amount remains. |
| Partial display | Some recorded payment, less than due. This is often a presentation of an open request, not a separate stored invoice status. |
| Settled / paid in full | Recorded payment has satisfied the applicable due amount. |
| Void | Request closed/voided; does not erase its audit or payment history. |
| Refund/reconciliation required | Recorded money needs staff financial resolution, for example after a hold expires or account deletion. |

Payment-request backgrounds distinguish fully paid (light green), partial (light yellow) and pending (orange). Colours assist reading; verify numeric due/paid/outstanding amounts and status rather than relying on colour alone.

### 12.4 External refunds

Perform the authorised external refund/credit-note process first. Record a positive refund amount in the refund form with unique reference and external credit-note details. The system stores a negative payment entry and updates the request. Refunds cannot exceed the amount recorded as paid.

A recorded refund does not universally cancel a booking or end a boarding stay. Review the resulting reservation/request state: ordinary refunded bookings may return to pending-payment handling until subsequently cancelled/reconciled. Package refunds have their additional credit checks.

### 12.5 Search, grouping, print and period close

Payment history can be grouped by customer, pro forma and Riyadh month. Multiple receipts for one invoice must not duplicate its lifetime invoice amount. Search/date filters select the relevant payments; interpret lifetime invoice balances separately.

Print controls exist for payment reports and individual documents. Printed pro formas must retain their **not a tax invoice** designation. Operational summaries include bookings, members, payment requests, recorded receipts, outstanding values, low stock and overdue tasks; they are not recognised revenue, a bank statement, a trial balance or a statutory tax return.

Proposed close controls: match receipts/refunds to external evidence; resolve duplicate-reference attempts; investigate open/expired/partial requests; reconcile cash versus credit-funded bookings; compare totals to the external accounting system; approve period exceptions and retain evidence. Frequency, materiality and sign-off limits are TBC.

## 13. Discounts and monetary vouchers

Discounts can be percentage or fixed SAR, with minimum spend, expiry, active state and redemption limit. Generated codes use a controlled prefix/number scheme; issued codes remain stable on edit. Verify the approved promotion, validity dates and eligibility before publication.

Only one discount and one voucher can be applied to an eligible monetary booking. The discount is applied before the voucher. Percentage rounding is in halalas, and a discount cannot exceed gross value. Quotes and booking confirmation revalidate these amounts.

Vouchers have a monetary stored balance, expiry and code. Partial redemption is possible. Issued voucher value is not directly editable through the normal workflow; issue/reconcile through an authorised process instead. Protect codes as redeemable value. Record the person, approval and issuance/redemption evidence required by the club; commercial gifting, transfer, loss and expiry terms are TBC.

Cancellation/hold-expiry handling restores applicable voucher value and discount-use counts through the server. Staff should verify those effects, not create a second voucher as an assumed refund.

## 14. Medical records, recurring care and horse fitness

### 14.1 Authoring and assignment

Medical/care records can hold a horse, care type, date, due date, notes, restriction status, assignee and treatment/recurrence fields. Examples represented by the workflow include vaccinations, farrier reviews, dental checks and treatment courses. These labels do not establish a clinical regimen.

Multiple horses can be selected when creating a plan. Each receives an independent record and occurrence schedule; invalid batches roll back. Editing one existing horse's plan does not silently change every horse in the original batch.

Recommended SOP inputs: a verified horse, an authorised instruction/source, care type, prescribed schedule if relevant, responsible person, review/clearance conditions, and supporting document. Do not create medication instructions from an AI-generated plan or demo example.

### 14.2 Dose/appointment schedules

The system supports scheduled dose/appointment occurrences, repeat patterns, selected weekdays and an end/duration. For scheduled medication, relevant medication and dose details are required. The displayed interval value **0 hours is a software alias for once every 24 hours**, not an instruction to give zero medication or give doses continuously.

Selected weekdays filter occurrences within the relevant course/date range. A four-day duration with only selected weekdays is not necessarily four administrations. Review the actual preview dates/times before saving and after any change.

Staff record the performance of each occurrence with actor/time; a record's overall completion state and its individual task history are related but distinct. Preserve completed occurrences and audit corrections rather than recreating a course to hide discrepancies.

### 14.3 Restrictions and clearance

A medically restricted/resting horse is unavailable for new bookings. Existing affected bookings can be notified for human review; the system does not guarantee that they have been automatically cancelled or safely reassigned.

Completing a care record does **not** automatically clear the horse for riding. An authorised operator must explicitly return it to `ready` after the required clinical/management clearance. Software permission to edit status is not veterinary authorisation.

TBC: authorised prescribers, clinical sign-off, medication storage/administration controls, withdrawal periods, infection control, emergency veterinary arrangements, required records and retention. The AI SOP drafter must not invent clinical doses, vaccine intervals, exercise-rest periods or treatment thresholds.

### 14.4 Reminders
The overview/care screens show upcoming and overdue work. Medical reminders consider due dates within seven days and distinguish upcoming from overdue events. Reminders support follow-up; they are not proof that a prescribed appointment was booked, delivered or clinically approved.

## 15. Feeding plans and daily execution

A feeding plan identifies a horse, feed description, quantity, local feeding time, duration, assignee, start/end dates and optional inventory linkage. The plan's quantity must come from an approved horse-specific instruction, not a standard quantity copied from demo data.

Confirmed behaviour:

- Date ranges and active state determine applicability.
- The running service generates feeding occurrences on a rolling **28-day** future window. A plan spanning two months is not evidence that every future task has already been materialised.
- Existing completed occurrences are preserved; the generator does not recreate them as new unfinished work.
- Feeding windows reserve the horse's time. New bookings and plan edits are checked for relevant conflicts.
- Bulk plan creation is atomic: an invalid horse/assignee/date/conflict can reject the batch.
- The task/planner gives actual due dates, assignment, completion progress and actor/time.
- When inventory is linked, stock is deducted on completion, not merely because a plan was created or a date arrived.

Suggested sequence: verify horse and authorised ration → choose correct feed/unit and stock linkage → assign time/date range/person → check conflicts → review generated dates → save/read back → perform the actual feeding → record completion → review remaining stock and exceptions.

TBC: individual rations, water checks, feed changes, preparation/hygiene, storage segregation, missed-feeding escalation, substitute feeds, clinical approval and supervisor handover. Do not treat a software completion checkbox as evidence that a ration was medically appropriate.

## 16. Staff tasks, calendars, completion and paper handover

### 16.1 Planning

The Tasks workspace supports calendar/checklist views, day/week/month periods, employee filters and plan-specific views. Feeding, medical and other tasks can be grouped. Period statistics use the selected filters; cancelled occurrences are excluded. A period with no scheduled work shows 0/0 rather than an assumed completion rate.

Assignments help allocate work. Completion authority also depends on module/action grants and date rules; do not promise that assignment alone prevents every other authorised staff user from operating a task. The current staff permissions can be broader than a personal task list.

### 16.2 Completion and reopening

Record completion only after the activity is performed or according to an explicitly approved supervisor-verification process. The system records operator and time. Repeating the same completion state is idempotent; it should not deduct stock twice.

Reopening is a controlled correction, not a way to erase performance history. It records a reopening event and reverses linked feed-stock consumption where applicable. Retain the reason and approvals required by the club, even where a dedicated reason field is not present.

Task completion/reopening is blocked for cancelled work. A discrepancy in stock or expired feed can prevent linked feeding completion without partially marking the task done.

### 16.3 Historical date protection

Historical controls use Riyadh civil dates. Ordinary staff with the appropriate grant can update yesterday, today and future dates. Older occurrences require a system administrator.

Example: on Thursday, Wednesday is yesterday and may be eligible; Tuesday is older and requires administrator correction. This is not a rolling 24-hour rule. It applies to relevant direct completion, reopening, task editing and rescheduling controls. Do not alter the system clock or due date to evade it.

### 16.4 Print and signatures

Printable planners reflect the selected employee/date/period filters. Daily handouts provide checkboxes, actual-time/signature spaces and a supervisor area. A paper signature does not automatically complete the digital task. Define who transcribes/validates signed forms, how discrepancies are handled and where originals are retained.

A printed planner is a point-in-time copy; check for changes after printing. Protect documents containing member/employee details and retrieve obsolete handouts according to the club's retention policy.

## 17. Inventory, receipts and stock movements

Inventory items include name, unit, quantity, reorder threshold and expiry. Select whole stock units appropriate to the measurement: grams can represent fractional kilograms without changing an integer-unit workflow.

Core rules:

1. Feed plans may reference an inventory item and specify stock units per occurrence.
2. Completing a linked feeding task consumes stock once.
3. Reopening returns the original amount consumed, even if the plan has since changed.
4. Insufficient or expired stock can block completion; the task and stock change are rolled back together.
5. Receipt entry requires quantity and delivery reference; it creates a positive stock movement.
6. Manual stock changes are logged; do not substitute arbitrary changes for an unexplained discrepancy.
7. Units cannot be changed while referenced by a feeding plan. Use a properly reconciled new item where necessary.
8. Daily planned use, remaining-days estimates and purchasing needs are forecasts. Reconcile to actual physical counts and delivery evidence.

TBC: authorised suppliers, purchasing limits, purchase orders, goods-received inspection, lot/batch traceability, expiry disposal, count frequency, variance approval and storage conditions. There is no confirmed full procurement/accounts-payable module; if needed, keep those controls in an approved external/manual process.

## 18. Stalls and boarding

### 18.1 Stall setup and capacity

Stalls have bilingual names, capacity and active state. Current/future reservations must fit on every relevant date boundary. The correct calculation is peak simultaneous occupancy, not the sum of all stays touching a long reporting window.

A stall with two separate non-overlapping stays can still have capacity between/around them. Conversely, a free slot today does not prove availability throughout a future requested stay.

Occupied/reserved stalls cannot be disabled or reduced below the allowed capacity without resolving existing stays. An inactive stall cannot accept a new assignment.

### 18.2 Assignment and billing

Select the horse, billed member, active eligible boarding price, stall and inclusive start/end dates. The server prevents overlapping stays for the same horse and checks the entire requested stall period.

A saved assignment reserves physical capacity and creates/links a pro forma. Pending payment does not make that stall available to another horse. Today's occupancy distinguishes future and ended stays; date-range availability must use the intended stay dates.

The selected plan amount is charged **once for the selected period** in the current workflow. Do not assume automatic nightly/monthly multiplication, proration or renewal. Confirm the actual boarding tariff and how periods are quoted with management.

### 18.3 Editing and ending

An active stay can be edited/moved within validations, excluding itself from the capacity calculation. Moving releases its former capacity and uses its new capacity. The original invoice is retained.

Invoices with recorded payments or other locked/adjusted terms protect the billed member and price. Reconcile before attempting a financial change. Displayed existing-stay prices should be based on the original invoice, not today's edited catalogue price.

Ending a stay releases its physical assignment but does not automatically erase, cancel or refund its invoice. Renewals require an explicit new/authorised arrangement. Reconcile billing, physical handover and records separately.

TBC: boarding contract, owner consent, intake/quarantine, included services, notice periods, charges, renewal procedure, departure checks, transport authority and outstanding-payment escalation.

## 19. Notifications, transactional emails and customer communications

### 19.1 In-app messages

The system maintains per-user notifications and read state. Events cover relevant account, booking, payment, boarding, care, task and stock activity. A read/unread state is not proof a service was performed or that a customer accepted new terms.

The running backend performs reminder work about every minute and deduplicates events. Confirmed classes within the upcoming 24-hour window can generate backend reminders. This is separate from the native 30-minute local reminder.

### 19.2 Email settings and delivery

Email settings are a dedicated web settings area with independent permission control. Configure authorised host, port, username, password, sender and optional reply-to. A host is a hostname, not a full URL with embedded port. Saved credentials are protected server-side; leaving an existing password field blank preserves it where supported.

Settings can be enabled/disabled by academy. Delivery requires a usable SMTP account, correctly authorised sender and provider availability. TLS verification remains enabled. The existing notification queue retries failures up to its configured limit (documented as five attempts); do not confuse a queued/sent-attempt state with confirmed inbox delivery. Message IDs support stable retries, but at-least-once delivery means a recipient might receive a duplicate.

Customer emails can include logo/branding, Arabic/English information, session details, operational invoice copies, payment receipts and calendar actions where applicable. A pending payment hold must not be represented as a fully confirmed event. Calendar actions are for eligible confirmed bookings.

New-account/welcome messages and optional supplied-password emails require explicit handling; current passwords are not retrievable from hashes. Password reset is the appropriate recovery route. Never put SMTP secrets or account passwords into a knowledge base, public handout, GitHub issue, video or customer group chat.

The demo reset disables outgoing mail and removes old mail configuration. Re-enable and test the intended configuration before relying on recovery/receipt emails in a live or review workflow.

### 19.3 Escalation and content

Assign responsibility for monitoring support and mail delivery, verifying failed addresses, handling bounce/retry cases and correcting inaccurate notifications. Response times, customer wording, holiday coverage, language ownership and complaint escalation are TBC. SMS, WhatsApp and browser push integrations are not confirmed in the inspected system.

## 20. Settings, reports and audit administration

### 20.1 System settings

A dedicated system settings page covers academy identity/contact details, language-specific names, calendar defaults, lesson duration, capacity, credit cost and payment-hold duration. Separate controls exist for stable/academy management and email settings. Similar-looking cards do not imply identical permissions.

Changing a default does not necessarily rewrite existing records. In particular, existing hold deadlines and financial snapshots retain their own history. After configuration changes, test the relevant new-record workflow and inspect older active items for unintended assumptions.

### 20.2 Reports and audits

Use operational reports and filtered printouts to review exceptions, workload, payments, outstanding requests and stock. Include period, academy, operator, filters and extraction date in retained reports. Apply access and handling rules to exported personal/financial information.

Audit entries and task events identify changes, operator and time. They do not supply an approved segregation-of-duties policy or an electronic signature standard. Define who reviews logs and how they approve unusual refunds, credit repairs, historical changes, permission escalations and access removal.

### 20.3 Proposed management review cycle

These frequencies are suggestions, **not confirmed club policy**:

- Opening/shift review: operating readiness, horse status, instructor availability, bookings/holds, care work, expected boarding movements and stock exceptions.
- End-of-shift review: delivered sessions/attendance, unfinished care, actual receipts, expired/partial holds, handover and incidents.
- Periodic review: session/financial reconciliation, physical inventory, access permissions, data quality, backup recovery readiness and overdue policy decisions.

Management must approve actual frequency, named owners, evidence, deadlines and escalation thresholds.

## 21. Native iOS app: parity and limits

The app is native SwiftUI for iPhone/iPad, with English/Arabic, member/staff login and the same authoritative backend rules. App access does not create a separate balance database.

| Workflow | Native daily use | Main web responsibility |
| --- | --- | --- |
| Login/logout, academy selection, refresh | Supported; credentials stored in Keychain, previous-session responses rejected | Account setup and membership administration |
| Member dashboard and balances | Purchased/used/restored/refunded/remaining totals and history | Package/pricing administration and eligible credit correction |
| Booking and eligible cancellation | Supported, including staff customer selection where authorised | Bulk schedule creation, expansion and advanced schedule management |
| Horse profiles | Owned/permitted horses, photos, history, care, rides, documents; sharing/printing where available | Horse/care authoring and document/photo administration |
| Tasks | Permitted daily work and completion/reopening | Plan authoring, bulk work and advanced administration |
| Payments/boarding | Permission-based views and implemented daily actions | Full financial/stall/catalogue configuration and exceptions |
| Account security | Change own email/password; in-app deletion | Administrator/other-user permissions and membership management |
| Email/system settings | Not included by design | Web portal only |
| User creation and permission grants | Not included by design | Web portal only |
| Calendar | Optional user-controlled save of a confirmed session | Not an attendance or booking-confirmation substitute |
| Class alerts | Local iOS reminder approximately 30 minutes before eligible confirmed classes | Backend inbox/email reminder process is separate |

The app refreshes on relevant actions, foregrounding, manual pull-to-refresh and while active (approximately once per minute). The website uses periodic refresh around every 30 seconds. Refresh/request protections were added for cancelled view tasks and intermediary caching; still verify the actual installed build and live deployment when investigating stale data.

Local reminders depend on permission, Focus/notification settings and the next successful sync. They do not guarantee that a change made elsewhere while the app remains closed has reached the device. Remote APNs delivery is not implemented merely because a portal capability was enabled. Do not promise SMS or server push.

Current account flow clears local identity on sign-out and verifies that post-login account information matches the entered email. If a mismatch appears, stop sensitive work and investigate the session/data source rather than dismissing the protection.

## 22. Troubleshooting reference for SOP exception sections

| Symptom | First checks | Required handling |
| --- | --- | --- |
| Member sees no owned horses | Correct login/academy; owner-account link; deployed versions; refreshed ownership data | Repair the ownership/access link through authorised administration; do not duplicate the horse. |
| Paid request but zero sessions | Package category, full payment, saved quantity, credit-award ledger, correct account and refresh | Administrator-reviewed legacy correction only when eligible; never issue duplicate credits. |
| Session quantity returns to zero in Pricing | Package category, validation error, backend/frontend mismatch, read-back | Fix category/save/deployment; do not assume a success toast proves persistence. |
| Class unavailable although capacity seems free | Horse readiness, feeding window, held seats, rider/resource conflicts and dates | Follow the specific validation; do not bypass checks to force a booking. |
| Hold expired after partial payment | Deadline/class start and request state | Finance reconciliation; no automatic cash refund or guaranteed reinstatement. |
| Cannot cancel | Recorded money, started/past session, current role/action and booking state | Correct financial/approval route; no manual record deletion. |
| Cannot complete an older task | Riyadh date, yesterday boundary, administrator flag | Authorised historical correction with retained evidence. |
| Feeding completion fails | Stock units, quantity, expiry and task state | Reconcile stock/approved feed instruction; do not tick work as completed without performance. |
| Boarding prices empty | Active price and eligible boarding category | Configure the intended plan rather than using an unrelated catalogue item. |
| Stall slots appear wrong | Requested date range, overlap peak, future/ended stays, recent move/save and refresh | Verify actual stay interval; do not count every separate stay as simultaneous. |
| Staff's own avatar does not load | Academy context, own-user ID, photo presence and backend own-photo permission update | Correct deployment/access, not a general grant to all member photos. |
| Email/recovery not delivered | SMTP enabled, correct sender/provider, recipient and queue; demo email disabled state | Preserve access via approved support verification; inspect delivery without exposing passwords. |
| Request origin rejected | Approved website origin and backend configuration | Technical operator fixes configuration/restart; do not disable origin protection. |
| Old version or stale data | Health version, frontend deployment commit, backend restart, installed app build, refresh | Compare the actual layers; deploying one does not update all three. |
| npm cannot find package.json | Working directory | Use the application root, not the account's home folder. |
| Node rejects modern options | Active Node environment | Activate cPanel Node 24 environment; do not use the host's old default Node. |
| Media importer cannot find administrator | Current login email versus historic alias | Use the media importer's explicit administrator-email option; do not rename accounts or reset data as a workaround. |
| Media download stops at a specific horse | Search/licence/format/size constraints and cache | Use current broader-search version or validated local files; a failed acquisition must not reset operational records. |

## 23. Technical administration and change management

This section provides context for **separate, authorised IT SOPs**. It does not authorise the receiving AI to execute commands or change production.

### 23.1 Architecture and deployment

- Repository: `SoftfmIos/Horses_Acution_App` despite the historical repository name; do not infer an auction business/module from that name.
- Management web/backend work is maintained on `main`; native work uses `iOSApp`.
- Do not merge native-only changes into the production web branch as a routine shortcut. Backend changes may be synchronised into the native branch deliberately.
- Web frontend is hosted through Vercel and proxies browser API requests to the persistent backend; native configuration points to the backend directly.
- Backend uses Node.js 24+, a persistent SQLite database and the existing cPanel/Passenger configuration. The configured startup entry is `passenger.cjs`.
- Confirm the application root and activate its Node environment before package/maintenance commands. The server operator previously confirmed the repository root as `/home/softfm5/repositories/Horses_Acution_App`.
- `DATABASE_PATH` must identify the same existing persistent database for every maintenance command. It should be outside the public document root. A terminal does not necessarily inherit every cPanel application setting.
- `.env not found` is not itself proof of an error if the needed environment variables are correctly supplied. Never invent a new database path to silence an error.
- Deploy the intended commits, restart the relevant backend, verify health, and inspect the active frontend build. Normal deployment is not a database reset.

### 23.2 Backup and recovery

Backups must be consistent SQLite backups, not casual copies of an actively changing file. Retain the necessary SMTP encryption key with the matching backup. Treat backups, WAL/SHM companions, exports and private demo credentials as sensitive.

Create an IT SOP specifying backup frequency, location, encryption, access, retention, recovery-point objective, recovery-time objective and isolated restore testing. These values are TBC. Do not restore a backup over a live service without an approved recovery process and verification.

After restoration, confirm account access, academy scope, key-backed configuration, critical balances, booking/stall state and document/photo downloads. Document the restoration point and any later transactions needing reconstruction.

### 23.3 Incident and security handling

Classify availability, access leakage, stale/wrong-account data, lost financial entries, document exposure, SMTP failure and corrupted backups. Protect affected records, stop unsafe operations where necessary, preserve evidence and involve the designated system/data owner. Reporting thresholds, breach assessment, notification duties and escalation contacts require approved policy.

The API uses session authentication, academy scoping and mutation-origin/request protections. Do not disable them to make an SOP easier. A role label is not approval to use cPanel or raw SQL for a business correction.

### 23.4 Native releases and Apple review

Codemagic builds/signs the native app using a configured App Store Connect integration. Signing keys, certificates and passwords remain in secure service settings, never this knowledge base.

A release SOP should verify Arabic/English flows, account switching, member/staff boundaries, horses/photos/documents, booking and balance effects, payment requests, deletion, Calendar and local notifications on supported physical devices. Source/simulator checks and upload acceptance do not prove device functionality or App Store approval.

The last review request supplied by the operator concerned app 1.1.6 (21) and requested a physical-device recording, purpose/audience, working review logins, feature instructions, external services, regional behaviour and applicable authorisation evidence. That historic message is not confirmation of current review status.

Use dedicated member/staff review accounts plus a disposable deletion account, rather than a personal administrator. Keep review accounts and sample bookings available throughout review. A public screenshot does not replace a required video; review passwords belong only in the private App Store Connect review information. Public-store, unlisted or organisation-specific distribution must reflect the intended audience and current Apple requirements.

## 24. Demo data and protected media operations

Demo records are fictional examples. One requested dataset comprised 20 total users including the retained administrator, 12 horses, 5 instructors, 100 bookings, 36 feeding plans, 24 care records, boarding examples and generated task history. These are not verified club headcounts or service commitments.

Two very different operator tools exist:

| Tool | Purpose | Essential distinction |
| --- | --- | --- |
| Demo preview/reset | Inspect and explicitly replace an existing dataset, preserving the designated account and selected academy | Destructive when applied. It can remove other users, settings, academies and operational records. Not a normal maintenance/update step. |
| Demo media import | Attach photos/avatars and 24 bilingual PDFs to an already seeded academy | Preserves accounts, passwords, sessions, bookings and financial data; skips existing media by default; backs up before writes. |

The media importer recognises the operator's updated login or an explicit administrator-email selector. It validates the expected demo academy and records, caches online downloads, verifies files and uses a transaction. Six generated horse photos/academy avatars are bundled; other suitable media is downloaded from eligible CC0/public-domain sources, with broader fallback searches in 1.31.3. Actual completion on the live server was not confirmed in the available history.

The 24 sample PDFs comprise a profile and care/feeding summary per demo horse, labelled DEMO and not valid as official passports, ownership certificates or clinical instructions. Some user avatars deliberately use horses, objects or club imagery rather than faces.

A demo reset disables SMTP and generates private login-credential files. Never publish those files. Do not execute a reset to fix a missing image, login, invoice or current member balance. Never run a reset while a real operational or Apple review workflow depends on stable accounts/data without separate explicit authorisation and recovery planning.

Do not include runnable destructive commands in general staff SOPs. Place them in a restricted operator runbook with purpose, target, approval, backup, verification and recovery requirements.

## 25. Required SOP catalogue

The following is a drafting inventory, not a claim that each procedure has already been approved. Group or split documents only if every function and control remains traceable. Owners below are proposed functions to be confirmed. P1 = address before relying on the operation; P2 = routine controlled operation; P3 = specialist/periodic operation.

| SOP ID | Procedure to draft | Proposed owner | Priority |
| --- | --- | --- | --- |
| GOV-001 | SOP/document approval, revision, distribution and withdrawal | Club management | P1 |
| GOV-002 | Opening, closing and shift handover using system exceptions | Operations | P1 |
| GOV-003 | Master-data ownership and bilingual data-quality review | Operations/system admin | P2 |
| ACC-001 | Add a new member or staff account and deliver access privately | Member services | P1 |
| ACC-002 | Invite a member or link an existing account to the intended academy | Member services | P1 |
| ACC-003 | Verify login identity, select academy, sign out and switch users | All users | P1 |
| ACC-004 | Forgotten email/password recovery and support identity verification | Member services/IT | P1 |
| ACC-005 | Change own email/password and verify reauthentication | Account holder/support | P2 |
| ACC-006 | Administrator profile/login-email correction and shared-account restrictions | System admin | P1 |
| ACC-007 | Remove academy membership after reconciliation | System admin/member services | P1 |
| ACC-008 | Self-service account deletion, administrator transfer and retained-record follow-up | Account holder/data owner | P1 |
| IAM-001 | Grant page access and independent Add/Edit/Delete permissions | System admin | P1 |
| IAM-002 | Review/revoke access for role changes or departure | System admin/management | P1 |
| IAM-003 | Privileged administrator continuity and transfer | System owner | P1 |
| CAT-001 | Create/update instructor profiles and link staff users | Scheduling/admin | P2 |
| CAT-002 | Maintain locations/arenas and active states | Operations | P2 |
| CAT-003 | Maintain breeds and other relevant controlled catalogues | Horse-care admin | P2 |
| HOR-001 | Register and verify a horse's master record | Stable manager | P1 |
| HOR-002 | Assign/change horse owner and assigned instructor; verify private visibility | Stable manager/admin | P1 |
| HOR-003 | Apply rest/retired status and process authorised return to ready | Veterinary/horse-care authority | P1 |
| HOR-004 | Add/change/remove approved horse, instructor and user photos | Authorised profile operator | P2 |
| HOR-005 | Upload, verify, classify, replace/remove and retrieve horse documents | Horse-care admin | P1 |
| HOR-006 | Review/print horse cards and monthly history | Horse-care supervisor | P2 |
| PRC-001 | Approve and maintain price plans and categories | Finance/management | P1 |
| PRC-002 | Configure package quantities and verify saved values/snapshots | Finance/admin | P1 |
| PRC-003 | Authorise/create/maintain discounts and redemption limits | Finance/management | P2 |
| PRC-004 | Issue, protect, redeem and reconcile monetary vouchers | Finance/member services | P1 |
| SCH-001 | Create a future session with approved instructor, horse and location | Scheduling | P1 |
| SCH-002 | Publish recurring/multi-instructor schedules and verify all saved openings | Scheduling | P1 |
| SCH-003 | Amend booked sessions safely and notify affected customers | Scheduling/operations | P1 |
| SCH-004 | Filter and print member/instructor booking calendars | Scheduling | P2 |
| BKG-001 | Member self-booking with a fresh quote | Member/member services | P1 |
| BKG-002 | Staff booking for an explicitly selected member | Member services | P1 |
| BKG-003 | Monitor holds, deadlines, partial payments and expiry | Member services/finance | P1 |
| BKG-004 | Join/remove/review a waitlist and respond to availability | Member services | P2 |
| BKG-005 | Cancel an eligible session and verify credit/voucher restoration | Member services/finance | P1 |
| BKG-006 | Record/correct attendance and escalate no-shows | Instructor/scheduling | P1 |
| CRD-001 | Request/purchase a lesson package through the external-payment process | Member services/finance | P1 |
| CRD-002 | Verify session totals, usage, restoration and exceptions | Finance/member services | P1 |
| CRD-003 | Review and repair eligible historic missing package credits | System admin/finance | P1 |
| FIN-001 | Create a manual or booking-linked pro forma for the correct customer | Finance | P1 |
| FIN-002 | Verify external receipt and record payment once with references | Finance | P1 |
| FIN-003 | Receive several payments against one request and monitor settlement | Finance | P1 |
| FIN-004 | Authorise/perform an external refund and record the signed transaction | Finance/approver | P1 |
| FIN-005 | Reconcile a package refund with remaining session credits | Finance/admin | P1 |
| FIN-006 | Resolve expired/closed/refund-required requests | Finance/operations | P1 |
| FIN-007 | Search/group/print payments by member, invoice and Riyadh month | Finance | P2 |
| FIN-008 | Reconcile operational reports with official accounting and period close | Finance/management | P1 |
| CARE-001 | Record authorised medical/care work and due dates | Clinical/horse-care authority | P1 |
| CARE-002 | Create independent multi-horse care plans and verify the batch | Horse-care supervisor | P1 |
| CARE-003 | Review treatment/recurrence previews and record each actual occurrence | Authorised care staff | P1 |
| CARE-004 | Review overdue/upcoming care and clear riding restrictions only with authority | Veterinary/horse-care authority | P1 |
| FEED-001 | Create/approve horse-specific feeding plans and date/time windows | Horse-care authority | P1 |
| FEED-002 | Execute feeding and record actual completion/exceptions | Assigned care staff | P1 |
| FEED-003 | Link feeding plans to correct stock units and check availability | Care/stores supervisor | P1 |
| TASK-001 | Assign/review personal and team work by calendar/checklist filters | Operations supervisor | P2 |
| TASK-002 | Complete an occurrence accurately and retain actor/time evidence | Authorised performer | P1 |
| TASK-003 | Reopen/correct an occurrence and verify stock reversal | Supervisor/authorised staff | P1 |
| TASK-004 | Administrator correction of work older than yesterday | System admin/supervisor | P1 |
| TASK-005 | Print, sign, reconcile and retain daily handouts/planners | Operations supervisor | P2 |
| INV-001 | Create inventory items with controlled units/opening stock | Stores | P1 |
| INV-002 | Record delivery receipts and supporting references | Stores/finance | P1 |
| INV-003 | Reconcile physical counts and approve stock adjustments | Stores/finance | P1 |
| INV-004 | Handle reorder, expiry, shortage and forecast exceptions | Stores/care supervisor | P1 |
| BRD-001 | Configure stalls, capacity and active state | Stable manager | P1 |
| BRD-002 | Assign boarding using full date-range availability and correct billed member | Stable manager | P1 |
| BRD-003 | Move/edit an active stay while preserving invoice restrictions | Stable manager/finance | P1 |
| BRD-004 | End boarding, release capacity and reconcile charges/handovers | Stable manager/finance | P1 |
| BRD-005 | Review occupancy, upcoming stays and manual renewals | Stable manager | P2 |
| COM-001 | Configure/test/disable SMTP securely | Authorised IT/email admin | P1 |
| COM-002 | Send appropriate welcome, booking, pro forma and payment communications | Member services/finance | P2 |
| COM-003 | Investigate queued/failed/duplicate email and recovery failures | IT/support | P1 |
| COM-004 | Review personal notifications and escalate unresolved events | Relevant recipient/supervisor | P2 |
| SYS-001 | Change system defaults/contact details and verify impact | System admin | P1 |
| SYS-002 | Maintain academy/stable scope and link existing users safely | System admin | P1 |
| SYS-003 | Diagnose stale data, wrong-account display and access incidents | IT/system owner | P1 |
| SYS-004 | Back up database, required keys and protected records | Technical operator | P1 |
| SYS-005 | Restore/test recovery and reconstruct any later activity | Technical operator/approver | P1 |
| SYS-006 | Deploy compatible frontend/backend versions and verify health | Technical operator | P1 |
| SYS-007 | Test/release the iOS app and verify permissions on physical devices | Release owner | P1 |
| SYS-008 | Maintain App Review evidence, review logins and release approval | App owner/release owner | P3 |
| DEMO-001 | Mark, segregate and handle fictional records/credentials | System owner | P1 |
| DEMO-002 | Authorise a destructive demo replacement with recovery controls | Restricted technical operator | P3 |
| DEMO-003 | Import demo photos/documents without resetting other data | Restricted technical operator | P3 |
| DATA-001 | Control access/export/printing and respond to privacy requests | Data owner | P1 |
| DATA-002 | Approve content rights, images and document provenance | Data/content owner | P1 |
| DATA-003 | Audit sensitive changes and maintain exception evidence | Management/data owner | P2 |

For manual operating dependencies that the management system does not define, create additional SOPs only with approved input. Relevant examples include rider eligibility/consent, instructor-to-rider assessment, horse fitness approval, tack/PPE checks, emergencies, hot-weather decisions, welfare incidents, quarantine/intake and physical boarding handovers. Label these as **manual/approval-required**, not implemented software modules. Do not expand this catalogue into unrelated public-project marketing, café, workspace or destination procedures without a separate scope instruction.

## 26. Management decisions still required

The following gaps must be visible to the SOP-drafting AI. A reasonable-sounding industry practice is not an approved club rule.

| Decision ID | Missing decision/input | Why it matters | Suggested approval function |
| --- | --- | --- | --- |
| DEC-01 | Registered legal/operator name, address and actual operating services | Document authority, contracts and customer communications | Club owner/legal |
| DEC-02 | Current organisation chart and named deputies/escalation contacts | Clear responsibility and absence cover | Club management |
| DEC-03 | Operating hours, shifts, opening/closing and handover cadence | Timely work and exception ownership | Operations |
| DEC-04 | Member eligibility, age/guardian consent and identity verification | Admission and safeguarding | Management/qualified advisers |
| DEC-05 | Rider experience/fitness assessment and suitable horse/instructor allocation | Safe session decisions beyond software availability | Head instructor/clinical authority |
| DEC-06 | PPE/tack inspection standards, facility/arena readiness and supervision limits | Operational safety; not implied by class capacity | Qualified operations/safety lead |
| DEC-07 | Weather/heat/lightning/visibility stop-resume criteria | Local operating risk; no thresholds supplied | Qualified safety/operations lead |
| DEC-08 | Medical/veterinary authority, prescribed plans and clearance evidence | Prevent unauthorised treatment or return to work | Veterinary lead/management |
| DEC-09 | Individual feeding/water instructions and permitted substitutions | Demo quantities are not real rations | Veterinary/horse-care authority |
| DEC-10 | Horse intake, disease/quarantine, handling and transport requirements | Welfare and physical handover | Veterinary/stable lead |
| DEC-11 | Current prices, package eligibility and approved promotions | Avoid using synthetic rates or assumptions | Finance/management |
| DEC-12 | Commercial cancellation, no-show, late arrival, reschedule and makeup rules | System permits certain operations but does not define every customer entitlement | Management/finance/legal |
| DEC-13 | Package expiry/transfer/freeze rules, if any | Current software has no automatic expiry; policy must not promise unsupported automation | Management/finance |
| DEC-14 | Refund authorisation limits, evidence and segregation of duties | Permission to enter a refund is not approval to pay one | Finance/management |
| DEC-15 | Official invoicing provider, tax workflow and reconciliation ownership | Operational pro formas are not tax invoices | Finance/qualified tax adviser |
| DEC-16 | Boarding contract, inclusions, period pricing, renewals, departure and notice rules | Current software charges a selected amount once per stay | Stable manager/finance/legal |
| DEC-17 | Inventory units, suppliers, ordering, receipt inspection, counts and variance approvals | Forecasts do not replace physical stock control | Stores/finance |
| DEC-18 | Communication response times, languages, complaint ownership and mailbox monitoring | A queued notification is not a completed service response | Member services/management |
| DEC-19 | Password standard, onboarding channel, access-review/offboarding timing | Technical minimum is not sufficient business security policy | IT/data owner |
| DEC-20 | Retention, privacy requests, deletion/anonymisation evidence and incident reporting duties | System preserves some financial/service history | Legal/data owner |
| DEC-21 | Backup frequency, encryption/location, retention, RPO/RTO and restore-test schedule | Recovery cannot be assumed from an untested file | IT/system owner |
| DEC-22 | System outage, emergency contacts, temporary paper operations and recovery reconciliation | Staff need a controlled fallback | Operations/IT |
| DEC-23 | Printed planner signatures, transcription and original-paper custody | Paper completion does not update digital records | Operations/data owner |
| DEC-24 | Which data is live versus demo, current import completion and media approvals | Prevent fictional records entering customer/clinical decisions | System owner/operations |
| DEC-25 | Current release/deployment versions, store availability and supported device QA | Source implementation is not proof of a working deployment | Release/system owner |
| DEC-26 | Signed approval of Arabic terminology and bilingual customer wording | Avoid inconsistent or misleading commitments | Management/language reviewer |

Where a policy would conflict with current system enforcement, the SOP must identify that gap. Do not write a workaround that bypasses validations. Obtain a policy decision and, if needed, a separately approved software change.

## 27. Illustrative acceptance and training scenarios

These examples explain expected system outcomes. They are not real member records or approved commercial terms.

### Scenario A — Credit booking and cancellation

A member has 10 session credits and books a future class costing 2 credits. Expected remaining balance: 8; the booking has a zero-money operational pro forma and records 2 credits used. The member cancels before class start under the allowed no-recorded-money route. Expected remaining balance: 10, with one +2 restoration entry; the booking is cancelled and its operational pro forma void. The original package payment remains recorded. Repeating cancellation must not add another +2 or initiate a money refund.

### Scenario B — Partial package payment

A package contains 5 sessions, but only part of its external payment has been recorded. Expected package credits: zero. After the correct final payment settles the request, expected award: +5 once. Re-reading/refreshing must not award another +5. Payment for an unrelated single riding lesson is not evidence that 5 package sessions are owed.

### Scenario C — Paid hold expires

A future monetary booking has a partial recorded receipt but its hold expires before settlement. Expected reservation: expired; capacity released; related request: refund/reconciliation required. The payment entry remains. Staff verify external handling; the system does not send money back or automatically promise a replacement place.

### Scenario D — Staff owner without academy horse-management access

A care staff account is linked as owner of a horse but has no general Horses page grant. The user should still have access to their own permitted horse/profile/photos/documents through ownership rules. They must not gain the ability to edit all horses or view unrelated owners' private records. Verify the linked owner ID and academy if access is empty.

### Scenario E — Feeding completion and correction

A plan consumes 2 stock units per occurrence. Stock is 10. Completing one occurrence records completion once and leaves 8. Repeating the same completion request leaves 8. Reopening restores the original 2 and returns to 10, with history retained. If the plan was edited to 3 after completion, reopening must still return the original 2. Insufficient/expired stock must not leave a partially completed transaction.

### Scenario F — Boarding date overlap

A stall has capacity 2. One horse stays on dates 1–3; another stays on dates 4–6. Those two stays do not occupy two slots simultaneously throughout dates 1–6. Availability must use actual overlap boundaries. A third request is checked across its own entire interval. Ending/moving a stay must release the former capacity without silently erasing financial records.

### Scenario G — Historical correction

An ordinary authorised worker discovers on Thursday that Tuesday's task was recorded incorrectly. They escalate for system-administrator correction instead of changing the due date. Wednesday is yesterday in Riyadh and is subject to the ordinary date rule; Tuesday is older. The historical correction retains its actor/time evidence and any linked stock reversal.

### Scenario H — Account security and deletion

A user changes their login email after confirming the current password. Previous sessions are revoked; the same account ID/history remains associated with the new login. Media/maintenance operations must identify the current account rather than creating a replacement user. Global deletion requires a separate explicit confirmation; membership removal from one academy is not equivalent.

### Scenario I — Photo/document import failure

An online image lookup cannot return a suitable file for a specific description. Expected: no operational record changes; valid downloads remain cached; an operator retries the corrected photo-only process or supplies approved local files. A destructive reset is not an appropriate remedy for a media failure.

## 28. Records and evidence to specify in each SOP

Use only relevant fields; do not require staff to maintain redundant uncontrolled copies.

- SOP ID/revision, effective date, operator and applicable academy.
- User/member ID, horse ID, instructor/location, class/booking ID where relevant.
- Local date/time plus the system's original timestamp/reference where reconciliation matters.
- Pro forma ID, amount/currency, receipt/refund reference, supporting external evidence and required approval.
- Credit ledger reason, quantity, before/after balance and related booking/package.
- Plan/task occurrence ID, assignee, actual completion, exceptions, correction reason and actor/time.
- Inventory item/unit, count/movement/reference, expected and actual quantities, approval of variance.
- Stall/stay ID, interval, capacity check, physical handover and billing link.
- Document title/category/version/provenance and visibility verification.
- Configuration/deployment version, approved change, backup reference, validation result and recovery decision.
- Communication recipient/channel/template, queue/delivery evidence where available, and unresolved follow-up owner.
- Privacy classification, retention location and approved retention/destruction rule.

Do not put a password, secret token, SMTP credential, private key or complete payment-card data into these logs. The inspected system does not need card entry to record an external receipt.

## 29. Standard SOP structure for the receiving AI

For every SOP, use this structure:

1. **Control header:** ID, English title, Arabic title, version, status, owner, approver, effective/review dates and related SOPs.
2. **Purpose:** The operational result to achieve.
3. **Scope and exclusions:** Web/app/manual steps; academy and role boundaries.
4. **Trigger and frequency:** Event or approved schedule. Mark frequency TBC where not supplied.
5. **Responsible roles:** Operator, verifier, approver, escalation deputy; label proposed assignments.
6. **Prerequisites:** Identity, permissions, approved plan/instruction, records, funds/stock/resources and system readiness.
7. **Inputs and evidence:** Required IDs, source documents, approvals and relevant records.
8. **Procedure:** Numbered steps with screen/action, required verification and expected result. Include distinct member/staff and web/app variants where necessary.
9. **Validation and stop conditions:** Conditions that block work; how to preserve records and escalate.
10. **Exception/correction handling:** Error messages, duplicate prevention, historical locks, reconciliation and authorised alternatives.
11. **Outputs and handover:** Resulting states, notifications, physical handovers and follow-up owner.
12. **Records/privacy/retention:** Where evidence is kept and who can access it; retention value TBC unless approved.
13. **Monitoring:** Relevant measures and a review/sign-off checklist. Targets TBC unless approved.
14. **Safety/legal/professional boundaries:** Applicable approved authority; no invented medical or legal requirements.
15. **Training/competence:** Who may perform the task and how competence is verified; approval TBC.
16. **Source trace and change log:** Relevant section of this knowledge base, code/evidence reference when available, unresolved decisions and revision history.

An SOP is complete only after its human owner resolves critical TBCs and approves it. An AI draft must not label itself Approved, assign signatures, or assert compliance/certification.

## 30. Suggested measurements — definitions before targets

Management may approve measures such as booking-to-confirmation time, hold-expiry rate, cancellation/restoration accuracy, unmatched external receipts, unresolved refund-required requests, duplicate-reference attempts, overdue care/task counts, actual completion recording delay, stock variance, expiring-stock exposure, boarding utilisation by period, missing owner links, mail failures, access-review completion and tested restore outcomes.

Define period, denominator, exclusions, source, responsible reviewer and action threshold before using a metric. Do not invent service-level targets, financial tolerances, clinical performance thresholds or disciplinary consequences. A task completion percentage alone is not proof of quality, safety or animal welfare.

## 31. Bilingual working glossary

Arabic terms below are practical drafting references, not a final signed terminology standard. Preserve the actual interface label where it differs and request the club's preferred translation.

| English | Arabic reference | Clarification |
| --- | --- | --- |
| Club management system | نظام إدارة النادي | Scope of this knowledge base |
| Academy portal | بوابة الأكاديمية | Staff/administrative workspace |
| Member portal | بوابة الأعضاء | Personal customer workspace |
| System administrator | مسؤول النظام | Privileged access category |
| Staff | الموظفون | Duties depend on job and grants |
| Member | عضو | Customer/account, not a software administrator |
| Horse owner | مالك الحصان | Linked user relationship |
| Instructor | مدرب | Professional authority/qualifications need separate approval |
| Caregiver / horse-care staff | مسؤول رعاية الخيل | Operational role reference |
| Permissions | الصلاحيات | Pages plus independent actions |
| Add / Edit / Delete | إضافة / تعديل / حذف | Separate grants |
| Read-only | عرض فقط | View without mutation authority |
| Class / riding session | حصة / جلسة ركوب | Scheduled opening |
| Booking / reservation | حجز | Customer-specific reservation |
| Book for member | الحجز لعضو | Staff selects the customer explicitly |
| Payment hold | مهلة حجز بانتظار الدفع | Not a fully confirmed paid booking |
| Confirmed | مؤكد | Separate from attendance |
| Cancelled | ملغى | Verify resulting financial/credit state |
| Expired | منتهي المهلة | Hold released |
| Attendance / absence | حضور / غياب | Separate attendance record |
| Session credits | رصيد الحصص | Count of sessions/credit units, not money |
| Lesson package | باقة حصص | Quantity awarded after full settlement |
| Credits restored | حصص معادة إلى الرصيد | Restoration after eligible cancellation |
| Payment request | طلب دفع | Operational billing request |
| Pro forma | فاتورة مبدئية | Not an official tax invoice |
| Tax invoice | فاتورة ضريبية | External approved invoicing process |
| Partial payment | دفعة جزئية | Does not activate a package/booking by itself |
| Payment reference | مرجع الدفع | Unique reconciliation reference || External credit note | إشعار دائن خارجي | Evidence used for external refund recording |
| Refund required | يلزم استرداد أو تسوية | A reconciliation state, not an executed bank transfer |
| Discount | خصم | Pricing reduction rule |
| Voucher | قسيمة مالية | Monetary value/code, not session credits |
| Horse profile/card | ملف / بطاقة الحصان | Identity and authorised records |
| Medical rest | راحة طبية | No new riding bookings while restricted |
| Ready | جاهز | Software status, not a substitute for professional clearance |
| Retired | متقاعد | Not available for new riding bookings |
| Care plan | خطة رعاية | Must have an authorised basis |
| Dose interval | الفاصل بين الجرعات | Actual instructions require clinical authority |
| Feeding plan | خطة تغذية | Horse-specific schedule/instruction |
| Task occurrence | مهمة مجدولة محددة | A particular date/time, not the whole plan |
| Complete / reopen | إكمال / إعادة فتح | Can affect linked stock |
| Daily handout | كشف العمل اليومي | Paper evidence requires digital reconciliation |
| Inventory / stock | المخزون | Physical quantities and units |
| Reorder threshold | حد إعادة الطلب | Operational threshold requiring approval |
| Stock receipt | استلام مخزون | Delivery quantity plus reference |
| Stall | مربط | Capacity-limited physical space |
| Boarding | إيواء الخيل | Physical stay plus separate billing |
| Occupancy / availability | الإشغال / الأماكن المتاحة | Date-range dependent |
| Audit trail | سجل التدقيق | Recorded actor/action/time |
| Account deletion | حذف الحساب | Global process distinct from membership removal |
| Backup / restore | نسخ احتياطي / استعادة | Restricted IT processes |
| Demo / fictional record | سجل تجريبي / خيالي | Never evidence of real operational facts |

## 32. Copy-ready prompt for the next AI

> You are preparing an SOP manual for the Riyadh Polo Hills club management system. Use the attached RPH-CMS-KB-001 as the operating knowledge base. Scope is the authenticated management web portal, member portal, native iOS app and directly connected club workflows. The public project/marketing website is explicitly out of scope; do not modify it or use its proposed facilities as evidence of live operations.
>
> First produce a coverage matrix mapping every SOP in section 25 to its module, responsible function, records, permissions, exception controls, relevant knowledge-base sections and unresolved decisions. Identify gaps and duplicates. Separate confirmed software rules from proposed controls and TBC management policies.
>
> Then draft the P1 procedures using the structure in section 29, followed by P2/P3 procedures. Include bilingual titles and the actual English/Arabic screen terms where useful. Provide clear member/staff and web/iOS distinctions, states, stop conditions, reconciliation steps, approval gates and evidence. Propose forms/checklists only where the system lacks an essential record; label them Proposed manual controls, not existing screens.
>
> Preserve these critical rules: money is handled externally; operational pro formas are not tax invoices; only full package settlement awards credits once; eligible credit-funded cancellation restores consumed credits without a money refund; paid/expired cases require reconciliation; members' private data is scoped to their account/academy; horse ownership is an account relationship; completed care does not automatically clear riding rest; task corrections obey Riyadh-date locks; feeding completion/reopening affects stock once; boarding capacity is checked over the whole date range and ending a stay does not refund its invoice.
>
> Do not invent clinical prescriptions, rider age/weight limits, staffing ratios, weather thresholds, prices, cancellation penalties, package expiry, retention periods, response times, legal approvals or facility availability. Use the decision register in section 26. Never turn demo data into business facts. Do not execute commands, reset/import data, deploy, issue refunds, send messages or change permissions while drafting. Protect passwords and secrets.
>
> Deliver a document-control page, SOP index/coverage matrix, responsibility matrix, process maps where helpful, individual SOP drafts, required forms/checklists, training/approval checklist, policy-gap register and acceptance scenarios. Clearly state that all drafts require review and approval by the club's designated operational, financial, veterinary, safety, legal and technical owners as applicable.

## 33. Final boundary and handover statement

This file documents the inspected **club management system** and the known operating context. It is intended to help an AI draft SOPs without inventing rules or changing the system. No application code, production database, public project website, configuration, user account or business policy was changed in preparing this knowledge base.

Before approving any SOP, the club must verify its current deployment, real organisational responsibilities, operational service availability and the unresolved management decisions. Keep this knowledge base versioned with the SOP manual and revisit it after material system/policy changes.