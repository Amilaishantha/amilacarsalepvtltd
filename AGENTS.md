# AGENTS.md — Amila Car Sale Pvt Ltd Website

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

Company website for **Amila Car Sale Pvt Ltd**, direct importers of Japanese vehicles to Sri Lanka, with a showroom on Diyathalawa Road, Kahagolla, Bandarawela. Includes a vehicle marketplace with SEO URLs, brand landing pages, an import tax calculator, a knowledge centre (blog), local-SEO pages and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (SSR) |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| Fonts | Montserrat (display) + DM Sans (body) via Google Fonts |
| Data | Netlify Database (Postgres) via Drizzle ORM (`db/schema.ts`) |
| Images | Netlify Image CDN (`/.netlify/images`) — Cloudinary account allow-listed in `netlify.toml` |
| Deployment | Netlify |

## Directory Structure

```
db/schema.ts               # vehicles, enquiries, site_settings, blog_posts tables
netlify/database/migrations # never edit applied migrations — add new ones
public/                    # logo, og-image.jpg, robots.txt, favicons
src/
  components/
    ui.tsx                 # VehicleCard, SmartImage (responsive CDN images), Breadcrumbs, FaqList, icons
    VehicleEnquiryForm.tsx # Vehicle enquiry/reservation → saves enquiry, opens WhatsApp pre-filled
    GeneralEnquiryForm.tsx # Contact / import-request / tax-quote form (same save + WhatsApp flow)
    Markdown.tsx           # Safe markdown renderer for articles (no raw HTML)
    FacebookOffers.tsx     # Homepage Facebook panel + shared FacebookIcon
  data/
    site.ts                # NAP details, SITE_URL, geo, hours, stats, helpers — single source of truth
    brands.ts              # Brand landing-page content (/brands/:brand)
    articles.ts            # Built-in knowledge-centre guides + OFFICIAL_SOURCES
    faqs.ts                # Homepage / import / tax FAQs (shown on page + FAQPage JSON-LD)
    vehicles.ts            # Demo stock — used ONLY in local dev when the DB is unreachable
  lib/
    vehicle-utils.ts       # Pure helpers: slugs, price rules, ALT text, SEO status, duplicate & missing-spec checks
    vehicle-fns.ts         # Server functions: vehicles, admin CRUD, enquiries (validated with zod)
    content-fns.ts         # Server functions: site settings (analytics IDs, page SEO, testimonials), blog posts
    server-utils.ts        # Server-only: DB access, admin-key check, row parsing
    seo.ts                 # pageHead() meta/canonical/OG/Twitter + JSON-LD builders
    sitemap.ts             # Sitemap builder (shared by /sitemap.xml and the admin SEO tab)
    analytics.ts           # dataLayer/gtag events + GA4/GTM bootstrap
  routes/
    __root.tsx             # Nav, footer, mobile call/WhatsApp bar, analytics + verification tags, 404
    index.tsx              # Homepage
    vehicles/index.tsx     # Marketplace listing (filters in URL)
    vehicles/$slug.tsx     # Vehicle page: /vehicles/toyota-raize-2025-32 (trailing stock ID)
    marketplace/*          # 301 redirects from the old /marketplace URLs
    brands/                # /brands and /brands/:brand
    blog/                  # /blog and /blog/:slug
    tax-calculator.tsx     # Calculator + educational content
    import-from-japan.tsx, about.tsx, location.tsx, contact.tsx
    sitemap[.]xml.ts       # Live XML sitemap
    admin/index.tsx        # Admin dashboard (ADMIN_KEY protected)
```

## Key Concepts

### Vehicle data & data rules
Vehicles live in the `vehicles` table and are managed from **/admin**. Rules enforced in code:
- A price below Rs. 100,000 (e.g. 0) is never shown — it displays **"Price on Request"**. Prices below Rs. 2,000,000 are flagged for review and left out of structured data.
- Specs are shown only when recorded; nothing is invented.
- `visibility = 'draft'` hides a vehicle from the public site. `noindex` hides it from Google only.
- A vehicle page is indexed (and in the sitemap) only if it is published, not Sold, has a real photo, has engine cc/kW, isn't manually noindexed, and isn't the secondary listing in a possible-duplicate group. See `vehicleSeoStatus()`.
- Duplicates are only flagged (same make, model, year, grade, colour, mileage) — never deleted automatically.

### Vehicle enquiries
Forms save to the `enquiries` table (`source` = vehicle / contact / import-request / tax-calculator), then open WhatsApp pre-filled. Storage failures are swallowed so the WhatsApp hand-off is never blocked. Spam protection: honeypot field, minimum fill time, phone validation, and max 5 enquiries per phone per 10 minutes.

### SEO
Every route uses `pageHead()` from `src/lib/seo.ts` (title, description, canonical on `https://www.amilacarsalepvtltd.com`, robots, OG/Twitter, JSON-LD). Admins can override titles/descriptions for main pages (Admin → Page SEO) and per vehicle.

### Tax Calculator
All XID gazette rate logic is pure JavaScript inside `src/routes/tax-calculator.tsx` (`getCCRate()`, `getEVRate()`, `LUXURY_MAP`). Only change rates after verifying the official Gazette. The rate table on the page is generated from these functions, so it updates automatically.

### Analytics
GA4 ID, GTM ID, Google/Bing verification tokens and the Google Business Profile link are stored in `site_settings` and edited in Admin → Analytics & settings. These are public identifiers — never store secrets there.

### Design System
Brand is black / red / white (matches the logo). CSS custom properties in `styles.css`; **`--gold*` variable names are kept for compatibility but hold the brand red**. Shared classes: `.btn-gold` (primary red), `.btn-outline`, `.btn-wa`, `.vehicle-card`, `.card`, `.container`, `.section`, `.layout-sidebar`, `.prose`, `.faq`, `.chip`.

## Company Details (keep consistent — edit only in `src/data/site.ts`)

- **Name**: Amila Car Sale Pvt Ltd
- **Address**: Diyathalawa Road, Kahagolla, Bandarawela, Sri Lanka (6.819781, 80.975232)
- **Phone/WhatsApp**: 075 454 3533 (+94754543533)
- **Email**: amilacarsale1pvtltd@gmail.com
- **Hours**: Mon–Sat, 8:00 AM – 6:00 PM
- **Facebook**: https://www.facebook.com/amilacarsale (linked as "Click for More Offers")

## Conventions

- Inline styles for page-level layout; CSS classes for reusable components
- Route components are self-contained (loader + head + component in one file)
- TypeScript strict — use `VehicleRow` from `src/lib/vehicle-utils.ts`
- `@/` path alias maps to `src/`
- Never hard-code contact details — import from `src/data/site.ts`
- Never edit an applied migration; add a new one with `npx drizzle-kit generate --name <name>`
