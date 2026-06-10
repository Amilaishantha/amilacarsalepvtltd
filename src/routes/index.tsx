import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchVehicles, type VehicleRow } from '@/lib/vehicle-fns'

export const Route = createFileRoute('/')({
  loader: () => fetchVehicles(),
  component: HomePage,
})

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{label}</div>
    </div>
  )
}

function WhyCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{
      background: 'var(--dark-2)',
      border: '1px solid var(--border)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '3px',
        height: '100%',
        background: 'linear-gradient(to bottom, var(--gold), transparent)',
      }} />
      <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{body}</div>
    </div>
  )
}

function HomePage() {
  const vehicles = Route.useLoaderData() as VehicleRow[]
  const featuredVehicles = vehicles.filter(v => v.status === 'Available').slice(0, 3)

  return (
    <main>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--dark)',
      }}>
        {/* Background video — place your video at /hero-video.mp4 in the public folder */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.28,
            zIndex: 0,
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay on top of video */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(12,14,18,0.85) 0%, rgba(12,14,18,0.6) 60%, rgba(12,14,18,0.8) 100%)',
          zIndex: 1,
        }} />

        {/* Background orbs */}
        <div className="hero-orb" style={{ width: '600px', height: '600px', background: 'rgba(184,0,0,0.07)', top: '-200px', right: '-100px', zIndex: 1 }} />
        <div className="hero-orb" style={{ width: '800px', height: '800px', background: 'rgba(201,165,61,0.05)', bottom: '-400px', left: '-300px', zIndex: 1 }} />

        {/* Grid lines decoration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,165,61,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,61,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          zIndex: 1,
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <div className="section-tag animate-fade-up" style={{ marginBottom: '1.5rem' }}>
              Direct Importers · Bandarawela, Sri Lanka
            </div>

            <h1 className="animate-fade-up-delay-1" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              margin: '0 0 1.5rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Drive Your
              <br />
              <span style={{ color: 'var(--gold)' }}>Dream Vehicle</span>
              <br />
              <span style={{ fontSize: '0.65em', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-muted)' }}>
                Straight from Japan
              </span>
            </h1>

            <p className="animate-fade-up-delay-2" style={{
              color: 'var(--text-muted)',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              maxWidth: '560px',
              marginBottom: '2.5rem',
            }}>
              Amila Car Sale Pvt Ltd brings you quality Japanese vehicles directly to Sri Lanka — no middlemen, unbeatable prices, and full import transparency with our dedicated tax calculator.
            </p>

            <div className="animate-fade-up-delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/marketplace" className="btn-gold">
                Browse Vehicles
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/tax-calculator" className="btn-outline">
                Import Tax Calculator
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up-delay-4" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)',
            }}>
              {['Direct Importer', 'Full Inspection', 'Transparent Pricing', 'Bank Finance Available'].map(badge => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>✦</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-dim)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          animation: 'fadeIn 2s ease both',
          zIndex: 2,
        }}>
          <span>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold-dim), transparent)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 2rem',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2.5rem',
        }}>
          <StatCard value="12+" label="Years Experience" />
          <StatCard value="500+" label="Vehicles Imported" />
          <StatCard value="100%" label="Direct from Japan" />
          <StatCard value="24/7" label="Customer Support" />
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            The Amila Difference
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <WhyCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
            title="Direct Import — No Middlemen"
            body="We source vehicles directly from Japanese auctions and dealerships, cutting out all intermediaries. You pay the true market price, not inflated reseller margins."
          />
          <WhyCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>}
            title="Full Tax Transparency"
            body="Use our import tax calculator to know exactly what your vehicle will cost before you commit. No hidden surprises — we show you the complete breakdown of XID, CID, VAT, and all levies."
          />
          <WhyCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>}
            title="Expert Local Knowledge"
            body="Based in Bandarawela, we understand Sri Lankan roads and conditions. Our team recommends the right vehicle for your terrain — whether it's highland mountain routes or coastal highways."
          />
          <WhyCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            title="Bank Finance Available"
            body="We work with leading Sri Lankan banks to help you secure the best financing rates. Drive home your vehicle with flexible repayment options tailored to your budget."
          />
        </div>
      </section>

      {/* ── FEATURED VEHICLES ── */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>New Arrivals</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0 }}>
              Featured Vehicles
            </h2>
          </div>
          <Link to="/marketplace" className="btn-outline">View All Vehicles →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {featuredVehicles.map(vehicle => (
            <Link key={vehicle.id} to="/marketplace/$vehicleId" params={{ vehicleId: vehicle.id.toString() }} className="vehicle-card">
              <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--dark-3)' }}>
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12,14,18,0.9) 0%, transparent 50%)',
                }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className={`spec-badge status-${vehicle.status.toLowerCase()}`} style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', padding: '0.25rem 0.6rem' }}>
                    {vehicle.status}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.2rem', right: '1.2rem' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                </div>
              </div>
              <div style={{ padding: '1.2rem 1.4rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  <span className="spec-badge">{vehicle.fuel}</span>
                  <span className="spec-badge">{vehicle.transmission}</span>
                  <span className="spec-badge">{vehicle.engineCC ? `${vehicle.engineCC}cc` : `${vehicle.motorKW}kW`}</span>
                  <span className="spec-badge">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Asking Price</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>
                      Rs. {vehicle.price.toLocaleString('en-LK')}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TAX CALCULATOR BANNER ── */}
      <section style={{
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-orb" style={{ width: '500px', height: '500px', background: 'rgba(201,165,61,0.06)', top: '-200px', right: '-100px' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            Free Tool
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, margin: '0 0 1rem', color: 'var(--text-primary)' }}>
            Know Your Import Costs <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Before You Buy</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Our Sri Lanka vehicle import tax calculator uses the latest gazette XID rates to give you an accurate breakdown of all duties — XID, CID, SUR, SSCL, VAT, Luxury Tax, and VEL.
          </p>
          <Link to="/tax-calculator" className="btn-gold" style={{ fontSize: '0.85rem', padding: '1rem 2.5rem' }}>
            Open Tax Calculator
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '1rem' }}>Find Us</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 1.5rem' }}>
              Visit Our Showroom in Bandarawela
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Come see our vehicles in person at our Bandarawela showroom. Our team is ready to help you find the perfect vehicle and walk you through the full import process.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Address', value: 'Bandarawela, Uva Province, Sri Lanka' },
                { label: 'Phone', value: '075 454 3533', href: 'tel:+94754543533' },
                { label: 'Email', value: 'amilacarsale1pvtltd2@gmail.com', href: 'mailto:amilacarsale1pvtltd2@gmail.com' },
              ].map(({ label, value, href }) => (
                <div key={label} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', paddingTop: '2px' }}>{label}</div>
                  {href ? (
                    <a href={href} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >{value}</a>
                  ) : (
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn-gold">Get in Touch</Link>
          </div>

          <div style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Request a Vehicle
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>
              Don't see what you're looking for? Tell us the make, model, and year you want — we'll source it directly from Japan for you.
            </p>
            <a
              href="https://wa.me/94754543533?text=Hello Amila Car Sale, I would like to enquire about a vehicle."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#25D366',
                color: '#fff',
                padding: '1rem 1.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="tel:+94754543533"
              className="btn-outline"
              style={{ textAlign: 'center', justifyContent: 'center' }}
            >
              Call Us: 075 454 3533
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
