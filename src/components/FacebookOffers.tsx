import { site } from '@/data/site'

export function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.684 4.533-4.684 1.312 0 2.686.236 2.686.236v2.954H15.83c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

/**
 * Homepage panel pointing customers to the company Facebook page,
 * labelled with the wording the showroom asked for.
 */
export default function FacebookOffers() {
  return (
    <section
      style={{
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="hero-orb"
        style={{ width: '520px', height: '520px', background: 'rgba(24,119,242,0.10)', top: '-220px', left: '-120px' }}
      />

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="section-tag" style={{ marginBottom: '1rem' }}>Follow Us on Facebook</div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              margin: '0 0 1rem',
              lineHeight: 1.1,
            }}
          >
            Special Deals Land on
            <br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Our Facebook Page</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 2rem' }}>
            Fresh arrivals, price drops and limited-time offers are posted to the {site.name} Facebook page first. Follow
            us so you never miss a deal on your next vehicle.
          </p>

          <a
            href={site.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              background: '#1877F2',
              color: '#fff',
              padding: '1rem 2.2rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 30px rgba(24,119,242,0.25)',
            }}
          >
            <FacebookIcon />
            {site.facebookLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Page card */}
        <a
          href={site.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            background: 'var(--dark-3)',
            border: '1px solid var(--border)',
            padding: '2rem',
            textDecoration: 'none',
            transition: 'border-color 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#1877F2'
            e.currentTarget.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src="/logo.png" alt={site.name} style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {site.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1877F2', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.2rem' }}>
                <FacebookIcon size={13} />
                Facebook Page
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {['New stock posted weekly', 'Limited-time offer prices', 'Customer handover photos', 'Direct messages answered daily'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border)',
              color: '#1877F2',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {site.facebookLabel} →
          </div>
        </a>
      </div>
    </section>
  )
}
