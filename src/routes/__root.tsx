import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import '../styles.css'
import { useState } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Amila Car Sale Pvt Ltd — Direct Vehicle Importers, Sri Lanka' },
      { name: 'description', content: 'Amila Car Sale Pvt Ltd — direct vehicle importers to Sri Lanka. Quality Japanese vehicles, competitive prices. Located in Bandarawela.' },
    ],
    links: [
      { rel: 'icon', href: '/logo.png', type: 'image/png' },
    ],
  }),
  shellComponent: RootDocument,
})

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(12,14,18,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,165,61,0.12)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Amila Car Sale"
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              AMILA CAR SALE
            </span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase' }}>
              Pvt Ltd · Direct Importers
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden-mobile">
          <Link to="/" className="nav-link" activeProps={{ className: 'nav-link active' }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/marketplace" className="nav-link" activeProps={{ className: 'nav-link active' }}>Marketplace</Link>
          <Link to="/tax-calculator" className="nav-link" activeProps={{ className: 'nav-link active' }}>Tax Calculator</Link>
          <Link to="/contact" className="nav-link" activeProps={{ className: 'nav-link active' }}>Contact</Link>
          <Link to="/admin" className="nav-link" activeProps={{ className: 'nav-link active' }} style={{ opacity: 0.5, fontSize: '0.75rem' }}>Admin</Link>
        </div>

        {/* Phone */}
        <a
          href="tel:+94754543533"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--gold)',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
          }}
          className="hidden-mobile"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z"/>
          </svg>
          075 454 3533
        </a>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', padding: '0.5rem' }}
          className="show-mobile"
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--dark-2)',
          borderTop: '1px solid var(--border)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/marketplace" className="nav-link" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          <Link to="/tax-calculator" className="nav-link" onClick={() => setMenuOpen(false)}>Tax Calculator</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)} style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin</Link>
          <a href="tel:+94754543533" style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>075 454 3533</a>
        </div>
      )}
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{
      background: 'var(--dark-2)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/logo.png" alt="Amila Car Sale" style={{ height: '40px', width: 'auto' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              Direct vehicle importers to Sri Lanka. Providing quality Japanese vehicles at competitive prices since our founding in Bandarawela.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['/', 'Home'], ['/marketplace', 'Vehicle Marketplace'], ['/tax-calculator', 'Import Tax Calculator'], ['/contact', 'Contact Us']].map(([href, label]) => (
                <Link key={href} to={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', marginTop: '2px' }}>📍</span>
                <span>Bandarawela, Uva Province, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--gold)' }}>📞</span>
                <a href="tel:+94754543533" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>075 454 3533</a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--gold)' }}>✉️</span>
                <a href="mailto:amilacarsale1pvtltd2@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', wordBreak: 'break-all' }}>amilacarsale1pvtltd2@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          <span>© {new Date().getFullYear()} Amila Car Sale Pvt Ltd. All rights reserved.</span>
          <span>Direct Vehicle Importers · Bandarawela, Sri Lanka</span>
        </div>
      </div>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ paddingTop: '70px' }}>
        <div className="noise-overlay" />
        <NavBar />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
