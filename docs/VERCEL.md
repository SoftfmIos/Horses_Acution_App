# Connect the Vercel website to the academy backend

The frontend currently lives at **https://horsesacutionapp.vercel.app**. The application uses SQLite plus a continuous reminder worker. They require a running Node service and a persistent disk; they do not run inside a stateless Vercel Function.

The architecture in this repository is:

```
Browser → Vercel website → /api/[...path] proxy → persistent Node service → SQLite disk
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

Use the platform-assigned `PORT`. Keep the Docker runtime start command; do not start Vite on the backend host. Wait until `https://YOUR-BACKEND-HOST/api/health` responds with `{"status":"ok","database":true}`. Save that backend HTTPS origin.

The origin must be your **real backend address**, not an example value or the Vercel website URL. Do not add `/api` to it. If you change the public website hostname later, update `PUBLIC_ORIGIN` on the backend to that exact origin.

## 2. Connect Vercel

In the Vercel project's **Settings → Environment Variables**, add:

```
ACADEMY_BACKEND_URL=https://YOUR-ACTUAL-BACKEND-HOST
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
