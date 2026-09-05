export const site = {
  name: 'Amila Car Sale Pvt Ltd',
  phoneDisplay: '075 454 3533',
  phoneIntl: '+94754543533',
  whatsappNumber: '94754543533',
  email: 'amilacarsale1pvtltd2@gmail.com',
  location: 'Bandarawela, Uva Province, Sri Lanka',
  facebookUrl: 'https://www.facebook.com/amilacarsale',
  facebookLabel: 'Click for More Offers',
} as const

/** Turns a site-relative image path into an absolute URL so WhatsApp can render its preview. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}
