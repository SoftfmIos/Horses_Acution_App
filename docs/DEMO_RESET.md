# Reset the existing database and create a demonstration academy

This is an explicitly destructive operator command. It removes **all existing operational data, all other academies and every existing user except `abdul@softfm.com`**. Abdul's ID, email, name, password and bilingual name profile are preserved. He becomes the sole administrator of the chosen existing academy. Every previous login session, including Abdul's, is revoked.

The command has no public HTTP endpoint. It does nothing until run from the backend server with `--apply`. GitHub pushes, normal deployment, application startup and schema migrations never run a reset.

## cPanel steps

1. Pull the latest `main`, run NPM Install, and activate the Node.js environment using the command shown in cPanel. Node 24+ is required.
2. Stop the Node.js application and keep it stopped until the reset is complete.
3. Open a terminal in the application directory. Set `DATABASE_PATH` to the **same existing absolute SQLite filename** shown in the Node application's environment settings. If cPanel has already exported this variable, retain its existing value. Never use a new filename; the tool refuses missing databases.
4. Preview the affected row counts and selected academy:

```sh
npm run demo:preview
```

If Abdul belongs to multiple academies, select which one to retain using `-- --academy-id YOUR_ACADEMY_ID`. All other academies will still be removed. The preview displays no passwords and makes no database changes.

5. Run the replacement using today's date in Riyadh:

```sh
npm run demo:reset
```

For an empty academy containing only Abdul, instead use:

```sh
npm run demo:reset -- --empty
```

6. Restart Node.js and sign in as `abdul@softfm.com` with the existing password. Check `/api/health` reports **1.31.0**. The website and iOS app read the same database, so refresh both.

## What is generated

- 20 total users: the preserved Abdul administrator, 5 fictional instructors, 2 care staff and 12 members. Every fictional user has an independently generated password and an address under `demo.example.test`.
- 12 bilingual horses: 8 academy-owned, 3 member-owned and 1 care-staff-owned; 5 linked instructors, 3 arenas, 3 breeds and 6 two-horse stalls.
- 100 bookings: 40 historical and 60 future, including 10 cancellations, 10 awaiting full payment, attendance, cash payments and session-balance bookings. An additional 20 future class slots remain available to book.
- Paid session packages, partial and pending package requests, distinct payment receipts grouped under invoices, and balances backed by real credit-ledger entries. Cancelled credit bookings have matching restoration entries.
- 36 feeding plans covering one calendar month before the reset date through two months after it. Historical feeding tasks are marked complete. Upcoming feeding tasks use the existing rolling 28-day scheduler; later tasks materialize as the application runs. Daily grooming tasks cover the full three-month date range, with historical completion and future pending work.
- 24 fictional care records and 8 boarding assignments, with invoices in paid, partial and pending states.
- In-app demonstration notifications. SMTP settings and the old email queue are removed; a disabled mail configuration blocks environment-variable fallback. No demonstration emails or actual financial transactions are sent.

Care descriptions and quantities are illustrative, not veterinary instructions. Financial references and microchip identifiers are clearly marked DEMO. Arabic and English names, class titles, care notes and feeding notes are included.

## Photos

Individual horse and instructor portraits are **not bundled**. The accessible `Riyadh_PoloAcademy` website branch contains facility illustrations, not a suitable set of individual animal/instructor portraits. The reset without a photo folder will report **zero photos** rather than mislabel facility images as portraits.

To populate all profile photos in the same operation, put approved JPEG/PNG files (at most 2 MB each) in a private server folder and run:

```sh
npm run demo:reset -- --photos-dir /absolute/private/demo-photos
```

Required names: `horse-01.jpg` through `horse-12.jpg`, and `instructor-01.jpg` through `instructor-05.jpg`. `.jpeg` or `.png` is also accepted. Any missing/invalid image stops the operation **before deletion**. Images are stored in the protected database photo records used by both the website and app. If you reset without photos, add them later through the normal horse/instructor profile photo controls; do not rerun the destructive reset just to upload portraits.

Horse names in order: Shams/شمس, Badr/بدر, Najma/نجمة, Sahab/سحاب, Rimal/رمال, Barq/برق, Lulwa/لؤلؤة, Faris/فارس, Al Anoud/العنود, Sultan/سلطان, Reem/ريم, Wadi/وادي. Instructor names follow the five profiles in the private credentials file.

## Backup, passwords and recovery

Before deletion, the tool locks out other database writers and uses SQLite's backup API to capture the committed database. The original email-encryption key is copied alongside the backup when present. Backups are created under `backups` beside the database with restricted permissions. Keep the database directory, backups and credentials outside the website's public document root. `--backup-dir /absolute/private/path` overrides the backup directory.

The result prints the backup filename and a private `*.demo-logins.json` filename containing the 19 new demo logins. It never prints their passwords to console logs. Read the credentials file privately in cPanel; never commit, publish or email it. Abdul's existing password is neither exported nor changed.

Unknown tables, a missing/disabled Abdul account, ambiguous academy selection, missing photos, backup failures and foreign-key errors stop the operation. Deletion and seed insertion share one transaction, so a failed seed rolls back the entire reset. Keep the backup even after a successful demo.

To recover: stop Node.js; move the current database and any `-wal`/`-shm` companions into a private recovery folder; copy the selected backup to the original `DATABASE_PATH`, along with its `.email-key` when present; restrict permissions to the backend account; restart Node.js. Restore the full backup, not individual table exports. The backup includes the old users, financial records and settings.
