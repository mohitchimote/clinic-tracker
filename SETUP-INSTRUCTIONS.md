# Clinic Pay Tracker — Setup & Architecture
## pay.drmonica.in · Dr Monica

---

## Architecture

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | GitHub Pages | `mohitchimote/clinic-tracker` repo, custom domain `pay.drmonica.in` |
| Backend API | Cloudflare Worker | `clinic-tracker.mohit-chimote.workers.dev` |
| Database | Cloudflare D1 (`los-db`) | Table: `clinic_days` — shared DB, only this table belongs to this project |

---

## Files

- `index.html` — the full app (hosted on GitHub Pages)
- `worker/worker.js` — Cloudflare Worker (API)
- `worker/wrangler.toml` — Worker deployment config
- `worker/schema.sql` — D1 table definition (run once to create table)
- `SETUP-INSTRUCTIONS.md` — this file

---

## App password

`monica2024` — set in two places (must match):
- `index.html` → `const APP_PASSWORD`
- `worker/worker.js` → `const PASSWORD`

---

## Deploying changes

### Update the frontend (index.html)
1. Edit `index.html`
2. Push to the `main` branch of `mohitchimote/clinic-tracker`
3. GitHub Pages redeploys automatically within ~1 minute

```bash
# From the repo root
git add index.html
git commit -m "your message"
git push
```

### Update the Worker
```bash
cd worker
wrangler deploy
```

### Update the database schema
Only needed if adding new columns/tables. The `clinic_days` table already exists.
```bash
cd worker
wrangler d1 execute los-db --file=schema.sql --remote
```

---

## D1 Database

- **Database name:** `los-db`
- **Database ID:** `6dca6263-551a-4774-8406-7cd88bc4f8b5`
- **Table:** `clinic_days`

> ⚠️ `los-db` is shared with another project. Only ever query or modify the `clinic_days` table.

### clinic_days schema

| Column | Type | Notes |
|--------|------|-------|
| key | TEXT (PK) | Date string `YYYY-MM-DD` |
| date | TEXT | Display date e.g. `12 May 2026` |
| date_obj | TEXT | Same as key |
| hours | REAL | Hours worked |
| t6 | INTEGER | 6% treatments count |
| t3 | INTEGER | 3% treatments count |
| cons | INTEGER | Cons-only count |
| bonus | INTEGER | 0 or 1 |
| indem | INTEGER | 0 or 1 |
| gdc | INTEGER | 0 or 1 |
| start_time | TEXT | e.g. `09:00` |
| end_time | TEXT | e.g. `17:00` |
| total | REAL | Day earnings in £ |

### Manually inserting or editing records
```bash
# Insert / update a record
curl -X POST https://clinic-tracker.mohit-chimote.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"pwd":"monica2024","action":"save","record":{"key":"2026-05-20","date":"20 May 2026","dateObj":"2026-05-20","hours":7,"t6":5,"t3":0,"cons":0,"bonus":true,"indem":true,"gdc":true,"start":"10:00","end":"17:00","total":172}}'

# View all records
curl "https://clinic-tracker.mohit-chimote.workers.dev?action=getAll&pwd=monica2024"

# Delete a record
curl -X POST https://clinic-tracker.mohit-chimote.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"pwd":"monica2024","action":"delete","key":"2026-05-20"}'
```

---

## Daily use (for Monica)

1. Open `pay.drmonica.in` on any device
2. Enter password → app loads and syncs automatically
3. Log the day → tap **Save this day**
4. Data saves to Cloudflare D1 instantly and is visible on all devices
5. End of month → **Invoice** tab → **Copy invoice text** → send to clinic
