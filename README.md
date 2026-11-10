# Rasan — Stable Management

An original Arabic/English web foundation for stable teams and members. Built with React and Vite; no code was copied from the supplied reference projects.

## Run locally

Requires Node.js 20+ and npm.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm test
```

## Implemented

- Responsive English/Arabic interface, including RTL layout.
- Dashboard with illustrative stable activity and sample schedule.
- Horse directory, search, and manager-only horse creation in the interface.
- Session booking/cancellation and personal booking list.
- Booking rules for duplicate bookings, class capacity and overlapping member bookings.
- Manager task completion, read-only sample medical records and sample member directory.
- Browser-local persistence and explicit demo profile switching.

## Current limits

This is a local prototype, not a production service. Demo profiles are not authentication, and browser-local data is not shared between users or devices. UI role checks are not a security boundary. Medical records, member records, sessions and chart data are seeded examples; medical editing, class creation and real notifications are not implemented. Bookings currently use one shared sample date, set when the app loads. No payment, email, push, or external data service is connected.

## Next implementation milestones

1. PostgreSQL schema with organizations, stable memberships, horses, resources, sessions, bookings, care records and audit events. Every request must verify identity and organization membership.
2. Real authentication and server-side role authorization. Stable onboarding plus member invitation flow.
3. Transactional bookings with server-side capacity, overlapping rider/instructor/horse/arena checks, medical restrictions and workload limits. Never rely on browser checks to protect inventory.
4. Manager scheduling, recurring classes, waitlists, attendance and lesson credits.
5. Medical/treatment editing, vaccinations, farrier/dental records, medication administration, documents, feeding plans and scheduled reminders.
6. Billing, inventory, reports, owner/rider portal and branch management.
7. Expo phone applications after the web workflow is validated.

Reference archives remain outside this repository. Licensing must be checked before importing any reference code; Peter Care is marked UNLICENSED.

## Visual theme

Aligned with `SoftfmIos/Riyadh_PoloAcademy`, `website` branch at `37f387f`:
navy `#0d2d45`, deep navy `#082237`, ivory `#f7f3eb`, stone `#eae4d8`, gold `#b88e50`, and gold text `#806233`. The same Tajawal Regular/Medium/Bold fonts are served locally for English and Arabic. Font license and source metadata are included in `public/fonts/`. Buttons and panels follow the reference's flat corners, thin borders and restrained heading weights, adapted to a denser dashboard layout.
