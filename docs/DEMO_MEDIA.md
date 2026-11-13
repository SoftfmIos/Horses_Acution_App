# Add demo photos, user avatars and horse documents — without resetting

Pull `main` version **1.31.2** in cPanel. Keep the existing database and demo users. This command does **not** invoke the reset, change passwords, revoke sessions, recreate bookings or modify payments/balances.

Activate the Node 24 environment shown in cPanel and change to the application root:

```sh
source /home/softfm5/nodevenv/repositories/Horses_Acution_App/24/bin/activate
cd /home/softfm5/repositories/Horses_Acution_App
```

`DATABASE_PATH` must identify the same existing SQLite database as the running backend. Retain the value from the previous demo reset or export the exact value from cPanel's environment settings. Never point at a new database file.

Optional preview:

```sh
npm run demo:media -- --preview
```

Add photos and documents:

```sh
npm run demo:media
```

The importer recognises Abdul's current email `a.alsagier@riyadhpolohills.com` and the original `abdul@softfm.com`. If both addresses exist as separate accounts, or the administrator changes email again, select the current login explicitly:

```sh
npm run demo:media -- --admin-email a.alsagier@riyadhpolohills.com
```

The selected account must still be an administrator of the existing demo academy. Matching uses the existing user ID for photo linkage; the command does not edit the login email or create a replacement account.

The bundled assets need no browser or image-processing software on cPanel. The command downloads the remaining ready-made photos through the Wikimedia Commons API, selecting only CC0/public-domain JPEG/PNG thumbnails, saves a validated private download cache, then backs up the database and imports everything in one transaction. It reports **37 profile photos** and **24 documents** on a new demo dataset. Refresh the website and iOS app afterward; deploy the new web build to see the account-photo control in Account & security.

- Six horse images use the photos already generated for this demonstration: Shams, Badr, Najma, Sahab, Rimal and Barq. Optimized copies use the same canvas sizing as a normal website photo upload; the generation originals were retained during preparation.
- The remaining six horse photos come from ready-made online images. The five instructor avatars use equestrian equipment/arena photos rather than invented human faces. An instructor's user profile uses the same avatar as the instructor profile.
- The other fictional users get a mix of horse and academy imagery. Abdul gets the club crest if he has no existing photo.
- Each horse receives two bilingual PDFs: a demonstration profile sheet and a care/feeding summary. Every page identifies the file as fictional demonstration material, not an official passport, proof of ownership or veterinary advice. Dates and ownership changes should be read from the live horse record.
- Documents appear under the existing horse's Documents section and use the same authenticated download API in the app and website.

Existing photos and the importer's previously attached documents are **skipped by default**. Repeating the command fills missing media without resetting anything. `--replace` explicitly replaces these demo photo/document targets; other uploaded documents remain intact. Use `--academy-id ID` only if Abdul manages more than one demo academy.

Source/creator/licence information is saved in the photo's `demoSource` metadata and private cache entries. Generated demo horses and equipment avatars do not identify real instructors or members. Bundled originals and online images are illustrative, not evidence of a horse's actual identity or a member's appearance.

## Network failures

Online acquisition requires outbound HTTPS to `commons.wikimedia.org` and `upload.wikimedia.org` from the cPanel server. This development environment cannot reach those domains, so live online acquisition must be verified by running the command in cPanel. The downloader is covered by simulated API tests, including licence checks, download-host restrictions and failure handling.

If a search/download fails, **no database records are changed**. Successfully downloaded files remain cached so retrying the same command does not download them again. Do not run `demo:reset` to fix a photo download.

If Wikimedia is blocked or no suitable public-domain image is returned, supply a folder using:

```sh
npm run demo:media -- --photos-dir /absolute/private/remaining-demo-photos
```

This folder needs `horse-07.jpg` through `horse-12.jpg` and `instructor-01.jpg` through `instructor-05.jpg` (PNG/JPEG also accepted, at most 512 KB each). The six bundled generated horses and academy avatars are retained. Use the normal website Change photo controls for individual custom photos.

## Integrity and backup

The importer requires an existing demo academy, the expected 12 horse IDs/names, the five instructor profiles and all 19 fictional users. It refuses to attach media to an ambiguous or unexpected dataset. Bundled files and cached images are checksum-validated. Document content and ownership links are inserted atomically. Backups are private files beside the existing database under `backups`, with the existing SMTP key copied when present. No reset function is called by this command or by normal deployment.
