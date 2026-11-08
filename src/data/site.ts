/** Canonical production origin — used for canonical URLs, sitemap and structured data. */
export const SITE_URL = 'https://www.amilacarsalepvtltd.com'

export const site = {
  name: 'Amila Car Sale Pvt Ltd',
  shortName: 'Amila Car Sale',
  phoneDisplay: '075 454 3533',
  phoneLocal: '0754543533',
  phoneIntl: '+94754543533',
  whatsappNumber: '94754543533',
  email: 'amilacarsale1pvtltd@gmail.com',
  address: {
    street: 'Diyathalawa Road, Kahagolla',
    locality: 'Bandarawela',
    district: 'Badulla District',
    region: 'Uva Province',
    country: 'Sri Lanka',
    countryCode: 'LK',
  },
  /** One-line address used everywhere so NAP stays identical. */
  addressLine: 'Diyathalawa Road, Kahagolla, Bandarawela, Sri Lanka',
  geo: { lat: 6.819781, lng: 80.975232 },
  /** Opening hours as confirmed by the showroom. */
  hoursDisplay: 'Mon–Sat, 8:00 AM – 6:00 PM',
  hoursSchema: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
  stats: [
    { value: '12+', label: 'Years Experience' },
    { value: '500+', label: 'Vehicles Imported' },
    { value: '100%', label: 'Direct from Japan' },
    { value: '24/7', label: 'Customer Support' },
  ],
  facebookUrl: 'https://www.facebook.com/amilacarsale',
  facebookLabel: 'Click for More Offers',
  facebookVideosUrl: 'https://www.facebook.com/amilacarsale/videos',
  /**
   * Optional: paste Facebook video links here (e.g. https://www.facebook.com/amilacarsale/videos/123…)
   * to pin them in the homepage "Videos" tab. Leave empty to link to the page's videos instead.
   */
  facebookFeaturedVideos: [] as string[],
  logo: '/logo.png',
  ogImage: '/og-image.jpg',
} as const

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=15&output=embed`

export function whatsappLink(text: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
}

/** Turns a site-relative path into an absolute URL. Uses the browser origin when available (so previews work). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Absolute URL on the canonical production domain (never a preview URL). */
export function canonicalUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
