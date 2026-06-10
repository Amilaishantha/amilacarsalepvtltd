import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--dark-2)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-orb" style={{ width: '400px', height: '400px', background: 'rgba(201,165,61,0.06)', bottom: '-200px', right: '5%' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>We're here to help</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '0 0 0.5rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Reach out for vehicle enquiries, import assistance, or just to say hello.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Phone */}
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
            <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone</div>
            <a href="tel:+94754543533" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: '0.3rem' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            >075 454 3533</a>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Mon–Sat, 8:00 AM – 6:00 PM</div>
          </div>

          {/* Email */}
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
            <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</div>
            <a href="mailto:amilacarsale1pvtltd2@gmail.com" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', wordBreak: 'break-all', display: 'block', marginBottom: '0.3rem' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            >amilacarsale1pvtltd2@gmail.com</a>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>We reply within 24 hours</div>
          </div>

          {/* Location */}
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
            <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>Location</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Bandarawela</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Uva Province, Sri Lanka</div>
          </div>

          {/* WhatsApp */}
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, #25D366, transparent)' }} />
            <div style={{ color: '#25D366', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>WhatsApp</div>
            <a
              href="https://wa.me/94754543533?text=Hello Amila Car Sale, I would like to enquire."
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.9rem', fontWeight: 600, color: '#25D366', textDecoration: 'none', display: 'block', marginBottom: '0.3rem' }}
            >Chat with us now</a>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Fastest response method</div>
          </div>
        </div>

        {/* Company info */}
        <div style={{
          background: 'var(--dark-2)',
          border: '1px solid var(--border)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          <img src="/logo.png" alt="Amila Car Sale Pvt Ltd" style={{ height: '80px', width: 'auto' }} />
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
              Amila Car Sale Pvt Ltd
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 1rem', fontSize: '0.9rem', maxWidth: '600px' }}>
              We are direct vehicle importers to Sri Lanka, bringing quality Japanese vehicles to your doorstep. Located in the beautiful hill country town of Bandarawela, we serve customers across Sri Lanka with transparent pricing and expert guidance through the entire import process.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <Link to="/marketplace" className="btn-gold" style={{ fontSize: '0.78rem' }}>Browse Vehicles</Link>
              <Link to="/tax-calculator" className="btn-outline" style={{ fontSize: '0.78rem' }}>Tax Calculator</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
