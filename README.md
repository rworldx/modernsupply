# Modern Supply — الإمداد العصري

A premium, bilingual (English / Arabic, LTR + RTL), fully responsive **full-stack storefront**
for Modern Supply — an F&B ingredients distributor in the Sultanate of Oman (est. 2014).

A "house of brands" hub (7 brands), a live-inventory catalog, WhatsApp-based ordering,
customer order tracking, and a complete admin dashboard (orders, delivery tracking,
inventory management, and sales charts).

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) + **TypeScript**
- **Tailwind CSS v4** — "Liquid Gold" design system (dark chocolate + ivory + gold), light/dark themes
- **Prisma 6** ORM — **SQLite** in dev, **Postgres** in production (see below)
- **jose** httpOnly-cookie admin auth · **Framer Motion** · **Recharts** · **Radix UI** · **lucide-react**

## Getting started

```bash
npm install
npm run db:migrate      # create/apply the SQLite schema (prisma/dev.db)
npm run db:seed         # seed 168 products from the static catalog (stock starts at 0)
npm run dev             # http://localhost:3000  (redirects / → /en)
```

Then set real stock counts in the admin at `/admin` (see credentials below), or ask the
catalog owner to. On a fresh clone the storefront shows everything as "Out of stock" until
stock is entered — that is expected.

## Environment (`.env.local`, git-ignored — never commit real values)

```env
DATABASE_URL="file:./dev.db"      # dev; Postgres URL in production
ADMIN_USERNAME="<admin-username>"  # ask the site owner; never commit the real value
ADMIN_PASSWORD="<admin-password>"  # checked server-side only, never shipped to the browser
AUTH_SECRET="<long-random-string>" # signs the admin session cookie; `openssl rand -base64 32`
NEXT_PUBLIC_SITE_URL="https://modernsupply.om"  # for metadata/OG (optional)
```

> Prisma's CLI reads `.env`; the app runtime reads `.env.local`. `DATABASE_URL` lives in
> `.env` (for migrations); the admin secrets live in `.env.local`. Both are git-ignored.

## Routes

**Storefront** (`/[lang]`, lang = `en` | `ar`)
- `/[lang]` — home brand hub (7 brands, 3 card states: stocked / catalog-soon / coming-soon)
- `/[lang]/brands` — all brands
- `/[lang]/[brand]` — brand storefront (live stock, category filter, search) — *dynamic*
- `/[lang]/order` — cart review → details → governorate/wilayat → branch → WhatsApp handoff
- `/[lang]/track` — customer order tracking (order number + phone)
- `/[lang]/about`, `/[lang]/contact`

**Admin** (`/admin`, separate root layout, cookie-guarded)
- `/admin/login` · `/admin` (dashboard + sales charts) · `/admin/orders` · `/admin/inventory`

**APIs** — `/api/orders` (create + stock decrement), `/api/track`, `/api/admin/*` (auth-guarded).

## How it works

- **Inventory:** every product has a live `stock` count. Green = healthy, Yellow = at/below
  `lowStockThreshold`, Red = out. Customers see the status; ordering decrements stock in a
  transaction (oversell is rejected with 409); admin restocks (adds to current), sets exact
  counts, edits thresholds, delists (hides), or deletes (blocked if the product has order history).
- **Orders:** saved to the DB with a tracking number (`MS-YYYY-NNNNN`). Placing an order also
  opens a pre-filled WhatsApp message to the chosen branch. No prices/payment — the branch
  confirms availability and total, sets a delivery company + fee, and advances the status.
- **Tracking:** customers look up an order by number + phone and see a live status timeline.
- **i18n:** URL-prefixed locale (`/en`, `/ar`) via `proxy.ts` (Next 16's renamed middleware),
  `<html lang dir>` set per request, logical CSS properties throughout for correct RTL.

## Data

The catalog lives in `src/data/` (`brand.ts`, `products.ts`, `wilayats.ts`) — the source of
truth for brands, categories, product names/units, branches, and Oman governorates. The DB
`Product` table is seeded from it and holds the mutable stock/availability.

Adding the 2 future brands or filling the empty catalogs (Torino, Italian Master, Gusto)
only requires editing `src/data/*` and re-running `npm run db:seed`.

## Deploying to production (Postgres)

1. In `prisma/schema.prisma`, change `datasource.provider` from `"sqlite"` to `"postgresql"`.
2. Set `DATABASE_URL` to your Neon/Supabase/Vercel-Postgres connection string.
3. `npx prisma migrate deploy` then `npm run db:seed`.
4. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` in the host's
   env. Deploy (`npm run build` runs `prisma generate` first). Runs as a Node app (not static export).

## Useful scripts

`npm run db:studio` (browse data) · `npm run db:reset` (wipe + re-migrate) · `npm run db:seed`.
