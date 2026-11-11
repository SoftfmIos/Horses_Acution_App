# Connect the Vercel website to the academy backend

The frontend currently lives at **https://horsesacutionapp.vercel.app**. The application uses SQLite plus a continuous reminder worker. They require a running Node service and a persistent disk; they do not run inside a stateless Vercel Function.

The architecture in this repository is:

```
Browser → Vercel website → /api/* → api/backend.js proxy → persistent Node service → SQLite disk
```

The browser continues using `/api` on the Vercel hostname. The proxy preserves login cookies, request origin and stable identity. You do **not** set a browser `VITE_API_URL`, enable cross-origin credentials, or store the SQLite file under `/tmp` on Vercel.

## 1. Deploy the backend

Choose a Docker-capable Node host with a persistent disk. The supplied `Dockerfile` builds the application and runs the server as a non-root user (UID 1000). Mount a writable persistent volume at `/var/lib/academy`. Use one service instance with this SQLite file.

For Render, an optional `render.yaml` Blueprint is supplied. Connect `SoftfmIos/Horses_Acution_App`, branch `main`, using Render's Blueprint flow. **Review the paid Starter service and persistent disk cost before creating it.** The file is a configuration proposal; it has not created or deployed a service. Ensure the mounted disk is writable by the container's UID 1000.

Backend settings:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `PUBLIC_ORIGIN` | `https://horsesacutionapp.vercel.app` |
| `DATABASE_PATH` | `/var/lib/academy/academy.sqlite` |

Use the platform-assigned `PORT`. Keep the Docker runtime start command; do not start Vite on the backend host. Wait until `https://riyadhpolo.softfm.com/api/health` responds with `{"status":"ok","database":true}`. Save that backend HTTPS origin.

The origin must be your **real backend address**, not an example value or the Vercel website URL. Do not add `/api` to it. If you change the public website hostname later, update `PUBLIC_ORIGIN` on the backend to that exact origin.

## 2. Connect Vercel

Production uses `config/backend.json` with `https://riyadhpolo.softfm.com` by default. In the Vercel project's **Settings → Environment Variables**, remove an outdated override or set:

```
ACADEMY_BACKEND_URL=https://riyadhpolo.softfm.com
```

Set it for **Production**, then redeploy the latest `main` commit. The variable belongs to the Vercel server function; it does not need a `VITE_` prefix. Use Node.js 24 and leave the output directory as `dist`; `vercel.json` configures the Vite build and API function. Do not set a project root of `src` or `dist`: the project root must include the top-level `api` directory. Preserve any existing environment settings unrelated to this connection.

Preview deployments have different origins. They should use a separate staging backend/database with its own matching `PUBLIC_ORIGIN`; do not broaden the production origin check to accept arbitrary previews.

## 3. Verify the public connection

Open `https://horsesacutionapp.vercel.app/api/health`. It must return JSON with `database: true`. Then create the academy manager account and invite members. Log out and log back in. Existing records must remain after restarting the backend.

Diagnostic responses:

| Response | Meaning / action |
| --- | --- |
| `503 BACKEND_NOT_CONFIGURED` | Add `ACADEMY_BACKEND_URL` to Vercel and redeploy. |
| `503 BACKEND_CONFIG_INVALID` | Use only the backend HTTPS origin, without a path, query, credentials or `/api`. |
| `502 BACKEND_UNREACHABLE` | Backend is stopped, address is wrong, connection timed out, or the address returns HTML instead of API JSON. Check backend deployment logs and its health endpoint. |
| `403 Request origin rejected` | Backend `PUBLIC_ORIGIN` does not exactly match the website's origin. |
| `401 Please sign in` at `/api/auth/me` | Normal when signed out; proves the API route is responding. |
| HTML at `/api/health` | Old/static deployment or a rewrite overriding the API function. Redeploy with the root `api` directory included and remove conflicting catch-all rewrites. |

The proxy itself never writes a database. Frontend redeploys do not reset the backend database. Keep the backend disk, backups and reminder process running. SMTP credentials belong on the backend service, not in the browser or repository. Official tax invoices continue to be issued by the separate ZATCA invoicing system.

## Local container check

```sh
docker build -t academy .
docker volume create academy-data
docker run --rm -p 3001:3001 --mount source=academy-data,target=/var/lib/academy \
  -e PUBLIC_ORIGIN=https://horsesacutionapp.vercel.app academy
```

This is a backend health/startup check. Login mutations must originate from the configured public website through its proxy. For ordinary local development, use `npm run dev` without `NODE_ENV=production`.

## Backend subdomain

The supplied subdomain is `riyadhpolo.softfm.com`. Enable a valid HTTPS certificate and reverse proxy that hostname to the persistent Node service (default port 3001). Preserve the `/api/*` path. The supplied HTTP address alone is insufficient for the production proxy, which requires HTTPS for authentication and payment data. Set `HOST=0.0.0.0`, mount the persistent database disk, and retain `PUBLIC_ORIGIN=https://horsesacutionapp.vercel.app` when browsers use that frontend. `PUBLIC_ORIGIN` is the browser website origin, not the backend hostname. No DNS, hosting, TLS or Vercel environment settings are changed by a Git push.

Verify `https://riyadhpolo.softfm.com/api/health` returns API JSON, then redeploy the frontend and backend from the same commit. An existing `ACADEMY_BACKEND_URL` overrides the repository default and must be updated if it still points at an old host.

## cPanel / Phusion Passenger

Use Node.js 24 or newer, application root `repositories/Horses_Acution_App`, production mode and **startup file `passenger.cjs`**. The CommonJS entry point uses dynamic `import()` to load the asynchronous ES module backend. It disables Passenger's automatic server installation and explicitly listens on Passenger's socket; do not use `server/index.js` as the Passenger startup file. Direct Node/Docker startup still uses `server/index.js` and the configured TCP port.

Set `PUBLIC_ORIGIN=https://horsesacutionapp.vercel.app` (or the actual frontend HTTPS origin) and `DATABASE_PATH=/home/softfm5/academy-data/academy.sqlite`. Run NPM Install, save and restart. Check `https://riyadhpolo.softfm.com/api/health`. For a backend-only installation, building the Vite frontend is unnecessary; the frontend remains on Vercel. Use `passenger.log` outside the domain's public document root for startup diagnostics. Keep the database directory outside the public document root as well.

After pulling future updates, rerun NPM Install when dependencies change and restart the application. Ensure Passenger keeps the process running if continuous reminders and SMTP jobs are required; an idle-stopped application cannot run background jobs.

All `/api/:path*` requests are explicitly rewritten to the single `api/backend.js` function. The rewrite forwards the full nested path (including `auth/register`, `auth/me`, record IDs and payment actions) through a reserved query parameter. This avoids relying on filesystem catch-all matching for nested URLs. Redeploy Vercel after pulling this routing update; changing backend environment variables alone does not apply routing configuration.

## Create the first admin from cPanel

Pull the latest `main`. In Setup Node.js App, keep `DATABASE_PATH` set to the same absolute persistent path the running backend uses. Add `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 6 characters) in the application's environment settings, then Save. Optionally set `ADMIN_NAME` and `ADMIN_STABLE_NAME`. Never commit the password to Git.

Choose **Run JS Script → admin:create**. The script creates a manager account in the existing academy, or creates the academy if the database is empty. If multiple academies exist, set `ADMIN_STABLE_ID` explicitly. It does not reset existing passwords, overwrite accounts or promote an existing member. Repeated runs for an existing owner are safe and leave the password unchanged. This is a manual server-only command; startup and public requests never invoke it.

After success, remove `ADMIN_PASSWORD` and other `ADMIN_*` environment settings, Save and Restart (startup file remains `passenger.cjs`). Sign in normally using the email/password supplied; no invitation is required. If cPanel does not offer the script picker, activate the application's Node environment using cPanel's displayed command and run `npm run admin:create` from the application root with the same environment settings.
