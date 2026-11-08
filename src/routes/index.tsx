import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { fetchVehicles } from '@/lib/vehicle-fns'
import FacebookOffers from '@/components/FacebookOffers'
import { breadcrumbLd, businessLd, faqLd, pageHead, websiteLd } from '@/lib/seo'
import { site, mapsDirectionsUrl, mapsEmbedUrl, whatsappLink } from '@/data/site'
import { HOME_FAQS } from '@/data/faqs'
import { BRAND_PAGES } from '@/data/brands'
import { ARTICLES } from '@/data/articles'
import { EMPTY_SETTINGS, type PublicSettings } from '@/lib/content-fns'
import { ArrowIcon, FaqList, PhoneIcon, PinIcon, SmartImage, VehicleGrid, WhatsAppIcon } from '@/components/ui'
import { brandSlug, displayMake, isBrandNewCondition, isPlaceholderImage, vehicleAlt, vehicleFullName, vehicleSlug, type VehicleRow } from '@/lib/vehicle-utils'

export const Route = createFileRoute('/')({
  loader: () => fetchVehicles(),
  head: ({ matches }) => {
    const settings = (matches[0]?.loaderData as { settings?: PublicSettings } | undefined)?.settings ?? EMPTY_SETTINGS
    return pageHead({
      path: '/',
      matches,
      title: 'Japanese Cars for Sale in Sri Lanka | Amila Car Sale Pvt Ltd',
      description:
        'Buy brand-new and quality Japanese vehicles in Sri Lanka with Amila Car Sale Pvt Ltd. Explore available vehicles, Japan imports, reservations and vehicle import tax calculations.',
      jsonLd: [websiteLd(), businessLd(settings), faqLd(HOME_FAQS), breadcrumbLd([{ name: 'Home', path: '/' }])],
    })
  },
  component: HomePage,
})

function SectionTitle({ id, tag, title, action }: { id: string; tag: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
      <div>
        <div className="section-tag" style={{ marginBottom: '0.75rem' }}>{tag}</div>
        <h2 id={id} className="h2" style={{ margin: 0 }}>{title}</h2>
      </div>
      {action}
    </div>
  )
}

const SERVICES = [
  { title: 'Vehicles in stock', body: 'Browse Japanese cars, SUVs, kei cars and vans already in Sri Lanka or arriving soon, at our Bandarawela showroom.', to: '/vehicles', cta: 'Browse vehicles' },
  { title: 'Import to order from Japan', body: 'Tell us the model, grade and budget. We source from Japanese auctions and dealers and share the auction sheet before you buy.', to: '/import-from-japan', cta: 'Request an import' },
  { title: 'Import tax estimates', body: 'Estimate excise duty, CID, surcharge, luxury tax, SSCL, VAT and VEL with our free calculator — then ask us for a confirmed quote.', to: '/tax-calculator', cta: 'Open the calculator' },
  { title: 'Finance & registration help', body: 'We help arrange bank finance and leasing, and guide you through registration with the Department of Motor Traffic.', to: '/contact', cta: 'Talk to us' },
]

const STEPS = [
  { n: '01', title: 'Choose a vehicle', body: 'Pick a car from our stock or tell us what you want imported.' },
  { n: '02', title: 'Send a WhatsApp enquiry', body: 'Use the reserve button on the vehicle page — the full vehicle details are sent for you.' },
  { n: '03', title: 'Confirm price & terms', body: 'We confirm availability, price and the reservation terms in writing.' },
  { n: '04', title: 'Inspect & drive home', body: 'Inspect the vehicle at our showroom, complete the paperwork and collect your car.' },
]

const WHY = [
  { title: 'Direct importer — no middlemen', body: 'We source vehicles directly from Japanese auctions and dealers, so you pay a fair market price.' },
  { title: 'Full tax transparency', body: 'Know the import costs before you commit, with a clear breakdown of every duty and levy.' },
  { title: 'Local hill-country knowledge', body: 'Based in Bandarawela, we recommend vehicles that suit Uva Province roads and your daily routes.' },
  { title: 'Bank finance available', body: 'We work with Sri Lankan banks and leasing companies to help you finance your vehicle.' },
]

function HomePage() {
  const vehicles = Route.useLoaderData() as VehicleRow[]
  const settings = (useLoaderData({ from: '__root__' }) as { settings?: PublicSettings })?.settings ?? EMPTY_SETTINGS
  const live = vehicles.filter(v => v.status !== 'Sold')
  const withPhoto = live.filter(v => !isPlaceholderImage(v.image))

  const featured = (() => {
    const flagged = withPhoto.filter(v => v.featured)
    const rest = withPhoto.filter(v => !v.featured && v.status === 'Available')
    return [...flagged, ...rest].slice(0, 6)
  })()
  const shown = new Set(featured.map(v => v.id))
  const latest = [...withPhoto].sort((a, b) => b.id - a.id).filter(v => !shown.has(v.id)).slice(0, 6)
  latest.forEach(v => shown.add(v.id))
  const brandNew = withPhoto
    .filter(v => isBrandNewCondition(v) || (v.mileage === 0 && v.year >= new Date().getFullYear() - 1))
    .filter(v => !shown.has(v.id))
    .slice(0, 6)
  const hero = featured[0] ?? withPhoto[0]
  const makes = Array.from(new Set(live.map(v => displayMake(v.make)))).sort()

  return (
    <main id="main">
      {/* ── HERO + SEARCH ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 80% 20%, rgba(229,20,27,0.18), transparent 55%), var(--dark)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: '2.5rem', alignItems: 'center', paddingTop: 'clamp(2.5rem, 6vw, 4.5rem)', paddingBottom: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '1.1rem' }}>Direct vehicle importers · Bandarawela</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.1rem, 5.2vw, 3.9rem)', lineHeight: 1.05, margin: '0 0 1.1rem', letterSpacing: '-0.025em' }}>
              Japanese Cars for Sale <span style={{ color: 'var(--gold)' }}>in Sri Lanka</span>
            </h1>
            <p className="lead" style={{ marginBottom: '1.75rem' }}>
              {site.name} imports brand-new and quality used Japanese vehicles directly from Japan — Toyota, Honda, Nissan, Suzuki, Daihatsu and more —
              with transparent import tax estimates and a showroom on Diyathalawa Road, Kahagolla, Bandarawela.
            </p>

            <form action="/vehicles" method="get" role="search" aria-label="Search available vehicles" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '0.6rem', marginBottom: '1.25rem', maxWidth: '620px' }}>
              <label htmlFor="home-q" className="sr-only">Search vehicles</label>
              <input id="home-q" name="q" type="search" placeholder="Search e.g. Raize, Vezel, Yaris 2024" className="calc-input" style={{ flex: '1 1 200px', fontSize: '16px' }} />
              <label htmlFor="home-make" className="sr-only">Make</label>
              <select id="home-make" name="make" className="calc-input" style={{ flex: '0 1 150px' }} defaultValue="">
                <option value="">All makes</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button type="submit" className="btn-gold" style={{ flex: '0 0 auto' }}>Search</button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link to="/vehicles" className="btn-outline">Browse {live.length} vehicles <ArrowIcon /></Link>
              <a href={whatsappLink(`Hello ${site.shortName}, I would like to enquire about a vehicle.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track="hero"><WhatsAppIcon /> WhatsApp us</a>
            </div>
          </div>

          {hero && (
            <Link to="/vehicles/$slug" params={{ slug: vehicleSlug(hero) }} style={{ position: 'relative', display: 'block', aspectRatio: '4/3', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--dark-3)', textDecoration: 'none' }}>
              <SmartImage src={hero.image} alt={vehicleAlt(hero)} ratio={4 / 3} priority widths={[480, 720, 960, 1280]} sizes="(max-width: 900px) 100vw, 640px" />
              <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: '1.25rem', background: 'linear-gradient(to top, rgba(9,9,10,0.95), transparent)' }}>
                <div style={{ fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 700 }}>Featured vehicle</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{vehicleFullName(hero)}</div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ── STATS ── */}
      <section aria-label="Company highlights" style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
          {site.stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.45rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section className="container section" aria-labelledby="featured-h">
          <SectionTitle id="featured-h" tag="Hand-picked" title="Featured Vehicles" action={<Link to="/vehicles" className="btn-outline">View all vehicles →</Link>} />
          <VehicleGrid vehicles={featured} />
        </section>
      )}

      {/* ── LATEST ARRIVALS ── */}
      {latest.length > 0 && (
        <section className="section-alt section" aria-labelledby="latest-h">
          <div className="container">
            <SectionTitle id="latest-h" tag="Just added" title="Latest Arrivals from Japan" action={<Link to="/vehicles" className="btn-outline">See all stock →</Link>} />
            <VehicleGrid vehicles={latest} />
          </div>
        </section>
      )}

      {/* ── BRAND NEW ── */}
      {brandNew.length > 0 && (
        <section className="container section" aria-labelledby="new-h">
          <SectionTitle id="new-h" tag="Zero mileage" title="Brand-New Japanese Vehicles" />
          <p className="muted" style={{ margin: '-0.75rem 0 1.5rem', fontSize: '0.92rem' }}>Recent model-year vehicles recorded with 0 km or listed as brand new. Check each listing for its condition.</p>
          <VehicleGrid vehicles={brandNew} />
        </section>
      )}

      {/* ── BRANDS ── */}
      <section className="container" style={{ paddingBottom: '3rem' }} aria-labelledby="brands-h">
        <h2 id="brands-h" className="h3">Browse by brand</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {BRAND_PAGES.map(b => {
            const n = live.filter(v => brandSlug(v.make) === b.slug).length
            return (
              <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} className="chip">
                {b.name} {n > 0 && <span style={{ color: 'var(--gold-light)' }}>({n})</span>}
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-alt section" aria-labelledby="services-h">
        <div className="container">
          <SectionTitle id="services-h" tag="What we do" title="Vehicle Import Services in Sri Lanka" />
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))' }}>
            {SERVICES.map(s => (
              <div key={s.title} className="card card-accent" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className="h3">{s.title}</h3>
                <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1rem', flex: 1 }}>{s.body}</p>
                <Link to={s.to} style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO RESERVE ── */}
      <section className="container section" aria-labelledby="reserve-h">
        <SectionTitle id="reserve-h" tag="Simple process" title="How to Reserve a Vehicle" action={<Link to="/blog/$slug" params={{ slug: 'how-to-reserve-a-japanese-vehicle' }} className="btn-outline">Full guide →</Link>} />
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }} className="grid-3">
          {STEPS.map(s => (
            <li key={s.n} className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.75rem' }} aria-hidden="true">{s.n}</div>
              <h3 className="h3">{s.title}</h3>
              <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── TAX CALCULATOR PROMO ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a0405, var(--dark-2) 60%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className="section" aria-labelledby="tax-h">
        <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Free tool</div>
          <h2 id="tax-h" className="h2">Vehicle Import Tax Calculator — Sri Lanka</h2>
          <p className="lead" style={{ margin: '0 auto 1.75rem' }}>
            Estimate excise duty (XID), Customs Import Duty, surcharge, luxury tax, SSCL, VAT and VEL for any car imported from Japan using the Gazette XID rates.
          </p>
          <Link to="/tax-calculator" className="btn-gold" style={{ padding: '1rem 2.25rem', fontSize: '0.85rem' }}>
            Calculate your vehicle import taxes <ArrowIcon size={16} />
          </Link>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="container section" aria-labelledby="why-h">
        <SectionTitle id="why-h" tag="Why choose us" title="Why Choose Amila Car Sale?" />
        <div className="grid-3">
          {WHY.map(w => (
            <div key={w.title} className="card card-accent">
              <h3 className="h3">{w.title}</h3>
              <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS (genuine, admin-entered only) ── */}
      {settings.testimonials.length > 0 && (
        <section className="section-alt section" aria-labelledby="testi-h">
          <div className="container">
            <SectionTitle id="testi-h" tag="Customer feedback" title="What Our Customers Say" />
            <div className="grid-3">
              {settings.testimonials.map(t => (
                <figure key={t.name + t.date} className="card" style={{ margin: 0 }}>
                  <blockquote style={{ margin: '0 0 1rem', color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>“{t.text}”</blockquote>
                  <figcaption style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#fff' }}>{t.name}</strong>
                    {t.source && <> · {t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--text-muted)' }}>{t.source}</a> : t.source}</>}
                    {t.date && <> · {t.date}</>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FACEBOOK ── */}
      <FacebookOffers />

      {/* ── FAQ ── */}
      <section className="container section" aria-labelledby="faq-h" style={{ maxWidth: '900px' }}>
        <SectionTitle id="faq-h" tag="Questions" title="Frequently Asked Questions" />
        <FaqList faqs={HOME_FAQS} />
        <p className="muted" style={{ fontSize: '0.9rem', marginTop: '1.5rem' }}>
          More answers in our <Link to="/blog" style={{ color: '#fff' }}>knowledge centre</Link> — for example{' '}
          <Link to="/blog/$slug" params={{ slug: ARTICLES[0].slug }} style={{ color: '#fff' }}>how to import a car from Japan to Sri Lanka</Link>.
        </p>
      </section>

      {/* ── CONTACT & LOCATION ── */}
      <section className="section-alt section" aria-labelledby="loc-h">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2.5rem', alignItems: 'stretch' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '0.75rem' }}>Visit us</div>
            <h2 id="loc-h" className="h2">Japanese Vehicle Showroom in Bandarawela</h2>
            <p className="muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
              See our vehicles in person at our showroom in Kahagolla, Bandarawela — serving customers across Badulla District, Uva Province and all of Sri Lanka.
            </p>
            <address style={{ fontStyle: 'normal', display: 'grid', gap: '0.9rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--gold)' }}><PinIcon /></span><span><strong>{site.name}</strong><br />{site.addressLine}</span></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--gold)' }}><PhoneIcon size={16} /></span><a href={`tel:${site.phoneIntl}`} data-track="home-contact" style={{ color: '#fff', textDecoration: 'none' }}>{site.phoneDisplay}</a></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{site.hoursDisplay}</div>
            </address>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <a href={whatsappLink(`Hello ${site.shortName}, I would like to visit your showroom.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track="home-contact"><WhatsAppIcon /> Chat on WhatsApp</a>
              <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Get directions</a>
              <Link to="/location" className="btn-outline">Showroom details</Link>
            </div>
          </div>
          <div style={{ minHeight: '320px', border: '1px solid var(--border)', background: 'var(--dark-3)' }}>
            <iframe
              title={`Map showing ${site.name}, ${site.addressLine}`}
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', minHeight: '320px', border: 0, display: 'block' }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
