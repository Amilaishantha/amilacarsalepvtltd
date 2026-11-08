/**
 * Lightweight analytics bridge. Events go to Google Tag Manager's dataLayer and, if GA4 is loaded
 * directly, to gtag(). Nothing is sent unless an ID is configured in Admin → Settings.
 * Only public tag IDs are used in the browser — no credentials.
 */
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type TrackEvent =
  | 'vehicle_enquiry_submit'
  | 'contact_form_submit'
  | 'import_request_submit'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'tax_calculator_use'
  | 'vehicle_search'

export function track(event: TrackEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === 'undefined') return
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
    if (typeof window.gtag === 'function') window.gtag('event', event, params)
  } catch { /* analytics must never break the page */ }
}

/** Tracks every WhatsApp, phone and email link click site-wide with one delegated listener. */
export function installClickTracking() {
  if (typeof document === 'undefined') return () => {}
  const handler = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
    if (!a) return
    const href = a.getAttribute('href') || ''
    const location = a.dataset.track || window.location.pathname
    if (href.startsWith('tel:')) track('phone_click', { link_location: location })
    else if (/wa\.me|api\.whatsapp\.com/.test(href)) track('whatsapp_click', { link_location: location })
    else if (href.startsWith('mailto:')) track('email_click', { link_location: location })
  }
  document.addEventListener('click', handler, { capture: true })
  return () => document.removeEventListener('click', handler, { capture: true })
}

/** Inline bootstrap scripts for the configured tags (IDs are validated server-side before saving). */
export function analyticsScripts(ids: { ga4Id?: string; gtmId?: string }) {
  const scripts: { src?: string; async?: boolean; children?: string }[] = []
  const gtm = ids.gtmId && /^GTM-[A-Z0-9]{4,15}$/.test(ids.gtmId) ? ids.gtmId : ''
  const ga4 = ids.ga4Id && /^G-[A-Z0-9]{4,20}$/.test(ids.ga4Id) ? ids.ga4Id : ''
  if (gtm) {
    scripts.push({
      children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
    })
  }
  if (ga4) {
    scripts.push({ src: `https://www.googletagmanager.com/gtag/js?id=${ga4}`, async: true })
    scripts.push({
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4}');`,
    })
  }
  return scripts
}
