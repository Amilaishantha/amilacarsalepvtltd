# AGENTS.md — Amila Car Sale Pvt Ltd Website

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

Company website for **Amila Car Sale Pvt Ltd**, direct vehicle importers to Sri Lanka, located in Bandarawela. Includes a vehicle marketplace, import tax calculator, and contact page.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Language | TypeScript 5 |
| Deployment | Netlify |

## Directory Structure

```
public/
  logo.png                 # Company logo
  placeholder.png          # Vehicle image placeholder (replace with real photos)
src/
  data/
    vehicles.ts            # Vehicle inventory typed array — edit to add/update stock
  routes/
    __root.tsx             # Nav + Footer shell for all pages
    index.tsx              # Homepage (hero, stats, why us, featured, CTA)
    marketplace/
      index.tsx            # Vehicle listing grid with search + filters
      $vehicleId.tsx       # Vehicle detail page with enquiry CTA
    tax-calculator.tsx     # Sri Lanka import duty calculator (gazette rates)
    contact.tsx            # Contact channels page
  styles.css               # CSS variables, utility classes, animations
```

## Key Concepts

### Vehicle Data
All vehicles are in `src/data/vehicles.ts` as a typed array. To add stock: add an entry. To mark sold: set `status: 'Sold'`. For real vehicle photos, place images in `public/` and update the `image` field.

### Tax Calculator
All XID gazette rate logic is pure JavaScript inside `src/routes/tax-calculator.tsx`. The `getCCRate()` and `getEVRate()` functions contain the rate tables. Update these when the Sri Lanka Customs Gazette is revised.

### Design System
CSS custom properties are defined in `styles.css`:
- `--gold` / `--gold-light` / `--gold-dim` — brand gold tones
- `--crimson` — red accent
- `--dark` / `--dark-2` / `--dark-3` / `--dark-4` — dark background layers
- Shared classes: `.btn-gold`, `.btn-outline`, `.vehicle-card`, `.spec-badge`, `.section-tag`, `.nav-link`

### No Payments
Ecommerce template was used as a starting point but Stripe/payments were removed. Vehicle enquiries go through WhatsApp (`wa.me/94754543533`) and phone.

## Company Details

- **Name**: Amila Car Sale Pvt Ltd
- **Phone**: 075 454 3533 (+94754543533)
- **Email**: amilacarsale1pvtltd2@gmail.com
- **Location**: Bandarawela, Uva Province, Sri Lanka

## Conventions

- Inline styles for page-level layout; CSS classes for reusable components
- Route components are self-contained (loader + component in one file)
- TypeScript strict — use the `Vehicle` type from `src/data/vehicles.ts`
- `@/` path alias maps to `src/`
