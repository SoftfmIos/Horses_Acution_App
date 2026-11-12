# Stable workflow comparison

Four uploaded projects were inspected as source only; none was executed or imported into this application. The Mazad archive exceeded the attachment transfer limit (32 MiB) and could not be reviewed.

| Reference | Observed logic | Application improvement |
| --- | --- | --- |
| stable-management-java | Spring StableService validates capacity and duplicate stable names inside transactions. | Keep server validation and atomic writes for recurring openings and bulk feeding. |
| Equistable | src/lib/db.js scopes collections to an organisation and reconciles saved records; separate horse, instructor, lesson, invoice and diet collections. | Retain stable isolation, separate catalogues and server-confirmed saves. |
| Oshri-Stables | HorseTimeline.jsx merges dated visits, vaccinations and pregnancies into a chronological horse history. | Care details retain dated occurrences and completion history rather than a single undated checkbox. |
| petercare | Treatment creation accepts multiple horse IDs; feeding separates assignment from completion; event permission helpers restrict mutations. | Bulk feeding entry, per-course task progress, dated planners and staff-only completion with actor/time audit. |

## Implemented workflow

Staff manage the system; members see their own bookings, horses, assigned instructors and invoices. Existing internal owner membership represents staff, preserving database compatibility. Legacy specialist accounts migrate to staff access.

Generated openings appear on the calendar with available, held and confirmed seat counts. Unpaid reservations expire after 72 hours or at class start, whichever comes first. Expiry releases capacity and restores promotional value once. Partial payments remain recorded and require reconciliation.

Feeding can create individual plans for several horses in one transaction. Tasks are grouped by plan/course and each group has its own completion rate, dated detail and daily/weekly/monthly printable planner.

Pricing includes boarding with food, full-inclusive boarding and boarding with medical care. Discount titles generate three-letter/three-digit codes. Printable voucher QR codes open booking with the voucher prefilled; normal server validation still controls redemption.

## Deployment

Pull the same commit in cPanel and deploy the frontend. Run npm install for the new QR dependency, then edit/save lowercase tmp/restart.txt to reload Passenger. Keep DATABASE_PATH pointing outside the repository. No production database replacement is required.
