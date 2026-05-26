# PropEdge Intelligence — Frontend


>> The Bloomberg Terminal for Sports Betting

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark mode)
- **Fonts**: Playfair Display + Inter (Google Fonts, loaded via CSS)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Redirects to `/dashboard` | |
| `/dashboard` | Dashboard | 6 widgets, Prop of Day, Risk Gauge, Live Odds |
| `/player-analytics` | Player Analytics | Hit rate chart, game log, CL column, tooltips, paywall |
| `/player/[id]` | Player Detail | Full game log, radar chart |
| `/line-movement` | Line Movement | **Premium locked** — full paywall modal |
| `/sportsbook-comparison` | Sportsbook Compare | Live odds table, arbitrage, value props |
| `/game-portfolio` | Game Portfolio | KPIs, P&L charts, league exposure |
| `/insights` | Analytics Insights | Capital Momentum, EV Feed, Volatility Heatmap |
| `/pricing` | Pricing | 3 tiers with monthly/annual toggle |
| `/login` | Login | Email + Google OAuth UI |
| `/register` | Register | Plan selection + signup |
| `/admin` | Admin Dashboard | Users, revenue, subscriptions, prop setter |
| `/profile` | Profile | Theme toggle, notifications, subscription |

## Design System

Colors, fonts, and spacing follow the PropEdge design spec:
- **Background**: `#F5F1E8` (light) / `#121816` (dark)  
- **Primary**: `#1E4D3A` emerald
- **Loss**: `#C44B3A` coral
- **Gold**: `#B89A5B` (accents, dividers)
- **Typography**: Playfair Display (headings) + Inter (body)

All tokens are CSS variables in `src/app/globals.css`.

## Mock Data

All data is in `src/data/mockData.ts` and mirrors **The Odds API** response structure exactly.
When the backend is ready, replace mock imports with API calls — data shape is identical.

## Milestone 2 Notes (Backend)
- API key goes in `.env.local` as `ODDS_API_KEY`
- All odds data should flow: Odds API → Node.js backend → PostgreSQL → `/api/odds` endpoint → frontend
- Replace `mockData.ts` imports with `fetch('/api/...')` calls using the same TypeScript types from `src/types/index.ts`
