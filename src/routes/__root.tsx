import { HeadContent, Scripts, createRootRoute, Link, useRouterState } from '@tanstack/react-router'
import '../styles.css'
import { useEffect, useState } from 'react'
import { site, mapsUrl, whatsappLink } from '@/data/site'
import { FacebookIcon } from '@/components/FacebookOffers'
import { fetchPublicSettings, EMPTY_SETTINGS, type PublicSettings } from '@/lib/content-fns'
import { analyticsScripts, installClickTracking, resolveGtmId } from '@/lib/analytics'
import { PhoneIcon, WhatsAppIcon, PinIcon, MailIcon } from '@/components/ui'
import { BRAND_PAGES } from '@/data/brands'

export const Route = createRootRoute({
  loader: async () => {
    try {
      return { settings: await fetchPublicSettings() }
    } catch {
      return { settings: EMPTY_SETTINGS }
    }
  },
  // Settings change rarely — don't refetch them on every client-side navigation.
  staleTime: Infinity,
  head: ({ loaderData, matches }) => {
    const settings: PublicSettings = loaderData?.settings ?? EMPTY_SETTINGS
    const isNotFound = matches.some(m => m.status === 'notFound' || (m as { globalNotFound?: boolean }).globalNotFound)
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#09090A' },
        { name: 'format-detection', content: 'telephone=no' },
        { title: 'Japanese Cars for Sale in Sri Lanka | Amila Car Sale Pvt Ltd' },
        {
          name: 'description',
          content:
            'Amila Car Sale Pvt Ltd — direct importers of Japanese vehicles to Sri Lanka. Showroom on Diyathalawa Road, Kahagolla, Bandarawela. Call 075 454 3533.',
        },
        ...(isNotFound ? [{ title: 'Page Not Found | Amila Car Sale Pvt Ltd' }, { name: 'robots', content: 'noindex, follow' }] : []),
        { property: 'og:site_name', content: site.name },
        { property: 'og:locale', content: 'en_LK' },
        ...(settings.googleVerification ? [{ name: 'google-site-verification', content: settings.googleVerification }] : []),
        ...(settings.bingVerification ? [{ name: 'msvalidate.01', content: settings.bingVerification }] : []),
      ],
      links: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/logo-square.png', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@600;700;800&display=swap',
        },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
      ],
      scripts: analyticsScripts(settings),
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

const NAV_LINKS: { to: string; label: string }[] = [
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/brands', label: 'Brands' },
  { to: '/import-from-japan', label: 'Import from Japan' },
  { to: '/tax-calculator', label: 'Tax Calculator' },
  { to: '/blog', label: 'Guides' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: s => s.location.pathname })
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <nav
      aria-label="Main"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(9,9,10,0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container" style={{ height: 'var(--nav-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <Link to="/" aria-label={`${site.name} — home`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <picture>
            <source srcSet="/logo-nav.webp" type="image/webp" />
            <img src="/logo-nav.png" alt={`${site.name} logo`} width={128} height={50} style={{ height: '50px', width: 'auto', display: 'block' }} />
          </picture>
        </Link>

        <div style={{ alignItems: 'center', gap: '1.4rem' }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className="nav-link" activeProps={{ className: 'nav-link active' }} style={{ fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden-mobile" style={{ alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="fb-nav" title={`${site.name} on Facebook`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1877F2', color: '#fff', padding: '0.5rem 0.8rem', textDecoration: 'none', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <FacebookIcon size={13} />
            {site.facebookLabel}
          </a>
          <a href={`tel:${site.phoneIntl}`} data-track="nav" className="btn-gold" style={{ padding: '0.55rem 0.95rem', whiteSpace: 'nowrap' }}>
            <PhoneIcon size={13} /> {site.phoneDisplay}
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}
          className="show-mobile"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', maxHeight: 'calc(100vh - var(--nav-h))', overflowY: 'auto' }}>
          <Link to="/" className="nav-link">Home</Link>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className="nav-link">{l.label}</Link>
          ))}
          <Link to="/location" className="nav-link">Showroom Location</Link>
          <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#1877F2', color: '#fff', padding: '0.75rem 1rem', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <FacebookIcon size={15} />
            {site.facebookLabel}
          </a>
        </div>
      )}
      <style>{`@media (max-width: 1240px) { .fb-nav { display: none !important; } } @media (max-width: 1080px) and (min-width: 769px) { .nav-link { font-size: 0.68rem !important; } }`}</style>
    </nav>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.86rem' }}>
      {children}
    </Link>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', padding: '3.5rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <picture>
              <source srcSet="/logo-nav.webp" type="image/webp" />
              <img src="/logo-nav.png" alt={`${site.name} logo`} width={154} height={60} loading="lazy" style={{ height: '60px', width: 'auto', marginBottom: '1rem' }} />
            </picture>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.7, margin: 0 }}>
              Direct importers of quality Japanese vehicles to Sri Lanka, selling from our showroom in Bandarawela.
            </p>
          </div>

          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Explore</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <FooterLink to="/vehicles">Vehicles for Sale</FooterLink>
              <FooterLink to="/import-from-japan">Import a Car from Japan</FooterLink>
              <FooterLink to="/tax-calculator">Vehicle Import Tax Calculator</FooterLink>
              <FooterLink to="/blog">Knowledge Centre</FooterLink>
              <FooterLink to="/about">About Amila Car Sale</FooterLink>
              <FooterLink to="/location">Showroom Location</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </div>
          </div>

          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Brands</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {BRAND_PAGES.map(b => (
                <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.86rem' }}>
                  {b.name} cars
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Contact</div>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{site.name}</strong>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }}><PinIcon size={15} /></span>
                {site.addressLine}
              </a>
              <a href={`tel:${site.phoneIntl}`} data-track="footer" style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <span style={{ color: 'var(--gold)' }}><PhoneIcon size={15} /></span>{site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none', wordBreak: 'break-all' }}>
                <span style={{ color: 'var(--gold)' }}><MailIcon size={15} /></span>{site.email}
              </a>
              <span>{site.hoursDisplay}</span>
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: '0.5rem', background: '#1877F2', color: '#fff', padding: '0.6rem 1rem', textDecoration: 'none', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <FacebookIcon size={14} />
                {site.facebookLabel}
              </a>
            </address>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Japanese vehicle importers · Bandarawela, Sri Lanka</span>
            <Link to="/admin" rel="nofollow" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

function MobileActionBar() {
  return (
    <div className="mobile-bar" role="region" aria-label="Quick contact">
      <a href={`tel:${site.phoneIntl}`} data-track="mobile-bar" style={{ background: 'var(--gold)' }}>
        <PhoneIcon size={16} /> Call
      </a>
      <a href={whatsappLink(`Hello ${site.shortName}, I would like to enquire about a vehicle.`)} target="_blank" rel="noopener noreferrer" data-track="mobile-bar" style={{ background: '#1FAF55' }}>
        <WhatsAppIcon size={17} /> WhatsApp
      </a>
    </div>
  )
}

function NotFound() {
  return (
    <main id="main" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>
        <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Error 404</div>
        <h1 className="h1">This page could not be found</h1>
        <p className="lead" style={{ margin: '0 auto 2rem' }}>
          The vehicle may have been sold or the link may be out of date. Browse our current stock or get in touch — we can source the vehicle you want from Japan.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/vehicles" className="btn-gold">Browse vehicles</Link>
          <Link to="/" className="btn-outline">Homepage</Link>
          <Link to="/contact" className="btn-outline">Contact us</Link>
        </div>
      </div>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => installClickTracking(), [])
  const gtmId = useRouterState({
    select: s => resolveGtmId((s.matches[0]?.loaderData as { settings?: PublicSettings } | undefined)?.settings?.gtmId),
  })
  return (
    <html lang="en-LK">
      <head>
        <HeadContent />
      </head>
      <body style={{ paddingTop: 'var(--nav-h)' }}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <a href="#main" className="skip-link">Skip to content</a>
        <NavBar />
        {children}
        <Footer />
        <MobileActionBar />
        <Scripts />
      </body>
    </html>
  )
}
