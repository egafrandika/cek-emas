# CekEmas

Indonesian gold price utility site — compare live prices, calculate gram ↔ rupiah, track a 30-day chart (after enough daily samples), and read short educational articles.

## Stack

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS
- Logam Mulia public API (Cloudflare Workers)
- Turso (libSQL / SQLite) for daily price history

## Setup

```bash
npm install
cp .env.example .env.local
# fill TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, CRON_SECRET
npm run dev
```

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TURSO_DATABASE_URL` | for history | Turso DB URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | for history | Turso auth token (never commit) |
| `CRON_SECRET` | for cron | Protects `/api/cron/collect-price` |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical site URL (default `https://cekemas.com`) |
| `DEMO_HISTORY` | optional | Set `1` to preview the 30-day chart with static sample data (shows “Simulasi” badge). Turn off for production. |

If Turso env vars are missing, live prices still work; the history chart is hidden.

**Security:** if a Turso token was ever shared in chat or committed, revoke and regenerate it in the Turso dashboard.

## Daily price collect

Cron (Vercel) runs daily at `0 2 * * *` (02:00 UTC ≈ 09:00 WIB) against `/api/cron/collect-price`.

Manual collect (local or production):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/collect-price
```

On Vercel, set the same `CRON_SECRET` in project env so cron requests are authorized.

The chart on the home page shows a progress state until **30 distinct Jakarta dates** are stored for Logam Mulia 1g, then renders the 30-day line chart.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm start` — serve production build

## Notes

- Live prices: `/api/prices` and helpers in `lib/prices.js`
- History: `/api/history` and collect job in `app/api/cron/collect-price`
- Ad slots are placeholders until AdSense is connected
- Copy is Indonesian-first
