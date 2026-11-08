# Amila Car Sale Pvt Ltd — Official Website

Company website for **Amila Car Sale Pvt Ltd**, direct vehicle importers to Sri Lanka, located in Bandarawela.

## Features

- **Homepage** — Hero section, company stats, "Why Choose Us", featured vehicles, tax calculator CTA, contact section
- **Vehicle Marketplace** — Filterable/searchable grid of all vehicles with status badges, specs, and pricing
- **Vehicle Detail Pages** — Full specs, features, direct WhatsApp enquiry, price display
- **Import Tax Calculator** — Full Sri Lanka vehicle import tax calculator (XID/CID/SUR/SSCL/VAT/Luxury Tax/VEL) based on latest gazette rates
- **Contact Page** — All contact channels including WhatsApp, phone, email, and location

## Tech Stack

- **Framework**: TanStack Start (React, SSR)
- **Styling**: Tailwind CSS v4 + custom CSS with CSS variables
- **Routing**: TanStack Router (file-based)
- **Fonts**: Cormorant Garamond (serif display) + DM Sans (body) via Google Fonts
- **Deployment**: Netlify

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Contact

- **Phone**: 075 454 3533
- **Email**: amilacarsale1pvtltd@gmail.com
- **Location**: Diyathalawa Road, Kahagolla, Bandarawela, Sri Lanka

## Deployment & rollback

- Every pull request gets a **Netlify Deploy Preview** with its own copy of the production database. Review it before merging.
- Merging to `main` deploys to production. Database migrations in `netlify/database/migrations` are applied automatically just before the deploy is published; if a migration fails, the deploy is not published.
- **Rollback:** in the Netlify dashboard → Deploys, open the previous successful production deploy and choose **Publish deploy**. Database migrations in this project are additive (new columns/tables only), so older code keeps working against the upgraded schema.
- A copy of the `vehicles` and `enquiries` tables taken before the SEO upgrade is stored in `backup_20261108_vehicles` and `backup_20261108_enquiries`.

## After deploying

1. Admin → **Analytics & settings**: add the GA4 / GTM IDs, Google Search Console and Bing verification tokens, and the Google Business Profile link.
2. In Google Search Console and Bing Webmaster Tools, verify the site and submit `https://www.amilacarsalepvtltd.com/sitemap.xml`.
3. Admin → **Vehicles** → filter *Possible duplicates* and *Missing specs* to review listings.
