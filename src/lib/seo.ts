import { SITE_URL, canonicalUrl, site, mapsUrl } from '@/data/site'
import type { PublicSettings } from '@/lib/content-fns'
import {
  displayMake,
  displayModel,
  hasEngineSpec,
  isTrustedPrice,
  isBrandNewCondition,
  vehicleFullName,
  vehicleImages,
  vehiclePath,
  vehicleSeoDescription,
  type VehicleRow,
} from '@/lib/vehicle-utils'

type Meta = Record<string, unknown>

export type HeadInput = {
  path: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  jsonLd?: object[]
  /** Pass the route `matches` so admin page-SEO overrides from the root loader apply. */
  matches?: Array<{ loaderData?: unknown }>
  extraMeta?: Meta[]
}

export const BUSINESS_ID = `${SITE_URL}/#business`
export const WEBSITE_ID = `${SITE_URL}/#website`

function overridesFrom(matches: HeadInput['matches']): PublicSettings['pageSeo'] {
  const root = matches?.[0]?.loaderData as { settings?: PublicSettings } | undefined
  return root?.settings?.pageSeo ?? {}
}

/** Builds title, description, canonical, robots, Open Graph, Twitter and JSON-LD for a page. */
export function pageHead(input: HeadInput) {
  const o = overridesFrom(input.matches)[input.path]
  const title = o?.title?.trim() || input.title
  const description = o?.description?.trim() || input.description
  const url = canonicalUrl(input.path)
  const image = canonicalUrl(input.image || site.ogImage)
  const imageAlt = input.imageAlt || `${site.name} — Japanese vehicle importers, Bandarawela, Sri Lanka`

  const meta: Meta[] = [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: input.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1' },
    { property: 'og:type', content: input.type === 'article' ? 'article' : input.type === 'product' ? 'product' : 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: imageAlt },
    ...(input.extraMeta ?? []),
    ...(input.jsonLd ?? []).map(ld => ({ 'script:ld+json': ld })),
  ]

  return {
    meta,
    links: input.noindex ? [] : [{ rel: 'canonical', href: url }],
  }
}

// ─────────────────────────── Structured data builders ───────────────────────────

export function businessLd(settings?: Pick<PublicSettings, 'googleBusinessUrl'>) {
  const sameAs = [site.facebookUrl, settings?.googleBusinessUrl].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    // AutoDealer ⊂ AutomotiveBusiness ⊂ LocalBusiness ⊂ Organization
    '@type': ['AutoDealer', 'Organization'],
    '@id': BUSINESS_ID,
    name: site.name,
    alternateName: site.shortName,
    description:
      'Direct importer of Japanese vehicles to Sri Lanka. Brand-new and reconditioned cars, SUVs, kei cars and vans sold from our showroom on Diyathalawa Road, Kahagolla, Bandarawela.',
    url: SITE_URL,
    logo: canonicalUrl('/logo-square.png'),
    image: [canonicalUrl(site.ogImage), canonicalUrl('/logo.png')],
    telephone: site.phoneIntl,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: settings?.googleBusinessUrl || mapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.hoursSchema.days,
        opens: site.hoursSchema.opens,
        closes: site.hoursSchema.closes,
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Bandarawela' },
      { '@type': 'AdministrativeArea', name: 'Badulla District' },
      { '@type': 'AdministrativeArea', name: 'Uva Province' },
      { '@type': 'Country', name: 'Sri Lanka' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phoneIntl,
        contactType: 'sales',
        areaServed: 'LK',
        availableLanguage: ['en', 'si'],
      },
    ],
    knowsAbout: [
      'Japanese vehicle imports',
      'Sri Lanka vehicle import tax',
      'Japanese car auctions',
      'Toyota',
      'Honda',
      'Nissan',
      'Suzuki',
      'Daihatsu',
    ],
    sameAs,
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    inLanguage: 'en-LK',
    publisher: { '@id': BUSINESS_ID },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  }
}

export type Faq = { q: string; a: string }

/**
 * FAQPage markup. Google currently shows FAQ rich results only for a small set of authoritative sites,
 * but the markup is still valid and describes visible on-page Q&A — we only use it where the FAQs are shown.
 */
export function faqLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function articleLd(a: {
  path: string
  title: string
  description: string
  image?: string
  author: string
  published: string
  modified: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title.slice(0, 110),
    description: a.description,
    image: [canonicalUrl(a.image || site.ogImage)],
    datePublished: a.published,
    dateModified: a.modified,
    author: a.author === site.name ? { '@id': BUSINESS_ID, '@type': 'Organization', name: site.name, url: SITE_URL } : { '@type': 'Person', name: a.author },
    publisher: { '@id': BUSINESS_ID, '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: canonicalUrl('/logo-square.png') } },
    mainEntityOfPage: canonicalUrl(a.path),
    inLanguage: 'en-LK',
  }
}

/**
 * Car listing markup. An Offer (with price) is only included when a real price is entered —
 * listings without a price are described as a Car without an offer rather than inventing one.
 */
export function vehicleLd(v: VehicleRow) {
  const url = canonicalUrl(vehiclePath(v))
  const condition = v.condition
    ? isBrandNewCondition(v)
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition'
    : undefined
  const availability =
    v.status === 'Sold'
      ? 'https://schema.org/SoldOut'
      : v.status === 'Reserved'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/InStock'

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': `${url}#vehicle`,
    name: vehicleFullName(v),
    description: v.description?.trim() || vehicleSeoDescription(v),
    url,
    image: vehicleImages(v).filter(src => !/placeholder/.test(src)).map(src => canonicalUrl(src)),
    brand: { '@type': 'Brand', name: displayMake(v.make) },
    manufacturer: { '@type': 'Organization', name: displayMake(v.make) },
    model: displayModel(v.model),
    vehicleModelDate: String(v.year),
    modelDate: String(v.year),
    bodyType: v.type,
    fuelType: v.fuel,
    vehicleTransmission: v.transmission,
    color: v.color || undefined,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileage, unitCode: 'KMT' },
    sku: `ACS-${v.id}`,
    vehicleConfiguration: v.grade?.trim() || undefined,
    itemCondition: condition,
  }
  if (hasEngineSpec(v)) {
    ld.vehicleEngine = (v.engineCC ?? 0) > 0
      ? { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: v.engineCC, unitCode: 'CMQ' }, fuelType: v.fuel }
      : { '@type': 'EngineSpecification', enginePower: { '@type': 'QuantitativeValue', value: v.motorKW, unitCode: 'KWT' }, fuelType: v.fuel }
  }
  if (v.manufactureDate?.trim()) ld.productionDate = v.manufactureDate.trim()
  if (v.chassisNumber?.trim()) ld.vehicleIdentificationNumber = v.chassisNumber.trim()
  // Offers only for confirmed, plausible prices (a likely typo is never published as structured data)
  if (isTrustedPrice(v)) {
    ld.offers = {
      '@type': 'Offer',
      price: v.price,
      priceCurrency: 'LKR',
      availability,
      itemCondition: condition,
      url,
      seller: { '@id': BUSINESS_ID, '@type': 'AutoDealer', name: site.name },
    }
  }
  // Remove undefined keys so the JSON stays clean
  return JSON.parse(JSON.stringify(ld))
}

export function itemListLd(name: string, vehicles: VehicleRow[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: vehicles.length,
    itemListElement: vehicles.slice(0, 50).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: canonicalUrl(vehiclePath(v)),
      name: vehicleFullName(v),
    })),
  }
}

