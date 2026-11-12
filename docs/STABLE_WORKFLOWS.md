# Horse and stable workflows

## Horse profiles and documents

Use **Horses → Open horse profile** for a chronological history of classes, medical records, completed care, boarding and uploaded documents. The care tab shows feeding plans and next medical due dates. Assign the horse's owner and instructor through its edit form.

Staff can upload bilingual document titles and PDF, PNG or JPEG attachments up to 2 MB each. Files live in SQLite alongside the records, outside Git, and are included in the normal database backup. Downloads require an authenticated, stable-scoped request. Owners can read their own horse's documents; a member merely riding a shared horse gets basic horse details and their own bookings, without the horse's private care/documents. Staff can remove documents.

## Vaccinations, farrier visits and dental checks

Create a medical record with the care type and **Due at** date. The overview and medical screens show overdue care and care due within seven days. In-app notifications distinguish the upcoming reminder from a later overdue reminder. Existing reminders and the email outbox remain in use; actual email delivery requires email configuration.

Select several horses when creating a medical plan. Each horse receives an independent record and dose/appointment schedule. The whole batch succeeds or rolls back together. Editing an existing plan changes that horse only. Mark individual tasks complete to retain the actual actor/time; completing the medical record closes the course. Set the next due date or create the next plan when appropriate.

## Stalls and boarding

Create bilingual stalls with a capacity from **Settings → Stalls** or **Stalls & boarding → Add stall**. Assign a horse, billed member, boarding price and inclusive start/end dates. Capacity checks cover every date boundary, including future reservations. Horses cannot have overlapping boarding stays. The selected price is charged once for the selected period; renewals are manual.

Assignment reserves the physical stall. Its linked invoice remains pending until the existing payment-voucher workflow records full payment. Ending a stay releases the stall but does not erase or refund its invoice; reconcile payments in billing. Today's occupancy excludes future and ended stays. Disabled stalls cannot accept new stays, and occupied/reserved stalls cannot be disabled or reduced below capacity.

## Staff planner

The Tasks screen includes staff workload and scheduled checkboxes for the selected day, week or month. Filter by employee to hand over a personal planner. Each plan's card still shows its own completion percentage. The printable planner lists scheduled dates, assignee, completion and actor/time. Print using the planner's Print button.

## Feed inventory

Create an inventory item with its unit and opening quantity, then select that stock item and the number of stock units per feeding on a feeding plan. Use whole units (for example grams for fractional kilograms). Physical stock is deducted only when a feeding task is completed. Repeating completion is idempotent. Reopening returns the exact amount previously deducted, even if the plan has since changed. Insufficient or expired stock prevents completion without changing the task.

Inventory displays planned daily use, estimated remaining days and purchasing needs, plus receipts and stock-movement history. Record deliveries with a quantity and delivery reference. Manual quantity edits are also logged. Units cannot change while a feeding plan references the item; create a separate item to change units. Forecasts are estimates based on active plans; reconcile actual deliveries and physical counts.

## Deployment and validation

Deploy both the frontend and backend from the same commit. In cPanel pull the latest code, run npm install and edit/save lowercase tmp/restart.txt. Keep DATABASE_PATH outside the repository. New data uses the existing records table; no database replacement or destructive migration is needed. The API proxy accepts up to 3 MB only on the protected document-upload path, retaining the normal 100 KB limit elsewhere.

Run npm test, npm run build, CHROMIUM_PATH=/usr/bin/chromium npm run test:browser and CHROMIUM_PATH=/usr/bin/chromium npm run test:stable-browser. The latter exercises boarding invoices, document upload/download, multiple-horse care, planner printing and stock movements in the real UI.
