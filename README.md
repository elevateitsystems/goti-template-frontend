# PropEdge Intelligence


>> The Bloomberg Terminal for Sports Betting

The Next.js App Router serves both the UI and the `/api` backend. The legacy Express project is not required at runtime.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL + Prisma
- **Services**: Stripe, UploadThing, SMTP/Nodemailer
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark mode)
- **Fonts**: Playfair Display + Inter (Google Fonts, loaded via CSS)

## Getting Started

1. Copy `.env.example` to `.env` and add the required credentials.
2. Run `bun install` and `bun run db:generate`.
3. Apply pending migrations with `bun run db:migrate:prod`.
4. Create the configured administrator with `bun run db:seed`.
5. Start the application with `bun run dev`.

Open [http://localhost:3000](http://localhost:3000)

Stripe webhooks should target `/api/subscription/webhook`. Service health is available at `/health`.

Create the founding Product and its two Prices in Stripe first, then open **Admin → Pricing Plans** and paste the Product ID, three-month introductory Price ID, and monthly renewal Price ID. The app validates and stores the connection; it never modifies those Stripe catalog resources.

Use `db:migrate:prod` (`prisma migrate deploy`) for shared Neon databases. Run `db:migrate` only against a development database with a separate `SHADOW_DATABASE_URL`.

## Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | PrimeIQ landing page | Founding offer, Free Play, video, testimonials |
| `/dashboard` | Member Dashboard | Admin-curated card, plays, videos, results, and review usage |
| `/primeiq` | Daily PrimeIQ Card | Published plays, analysis, updates, and attached videos |
| `/videos` | PrimeIQ Videos | Published embedded video library |
| `/results` | Results | Permanent Win/Loss/Push history |
| `/my-requests` | Send Me Your Plays | Weekly submissions and private responses |
| `/login` | Login | Email + Google OAuth UI |
| `/register` | Register | Plan selection + signup |
| `/admin` | Admin Dashboard | Users, billing, publishing, plays, cards, videos, testimonials, review inbox |
| `/profile` | Profile | Theme toggle, notifications, subscription |

## Design System

Colors, fonts, and spacing follow the PropEdge design spec:
- **Background**: `#F5F1E8` (light) / `#121816` (dark)  
- **Primary**: `#1E4D3A` emerald
- **Loss**: `#C44B3A` coral
- **Gold**: `#B89A5B` (accents, dividers)
- **Typography**: Playfair Display (headings) + Inter (body)

All tokens are CSS variables in `src/app/globals.css`.

## Phase 1 operational notes

- Admin scheduling inputs are interpreted in `America/New_York`; timestamps are stored in UTC.
- The founding offer uses an introductory Stripe price billed once for three months, then a monthly renewal price under a Subscription Schedule.
- `bun run db:seed` is idempotent and creates/updates the configured administrator plus the approved featured Brayden testimonial.
- Daily PrimeIQ email delivery is intentionally inactive until the client confirms its send time and default preference.
- Direct video uploads remain intentionally inactive until the hosting provider and upload limits are selected; hosted URLs are embedded inside PrimeIQ.
- Legacy Moneyline-backed APIs remain available for rollback compatibility, but their analytics pages are hidden from the member experience.
