import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { breadcrumbLd, businessLd, pageHead } from '@/lib/seo'
import { site, mapsDirectionsUrl, mapsEmbedUrl, mapsUrl, whatsappLink } from '@/data/site'
import { EMPTY_SETTINGS, type PublicSettings } from '@/lib/content-fns'
import { PageHeader, PhoneIcon, WhatsAppIcon } from '@/components/ui'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Showroom location', path: '/location' },
]

export const Route = createFileRoute('/location')({
  head: ({ matches }) => {
    const settings = (matches[0]?.loaderData as { settings?: PublicSettings } | undefined)?.settings ?? EMPTY_SETTINGS
    return pageHead({
      path: '/location',
      matches,
      title: 'Japanese Car Showroom in Bandarawela — Location & Directions | Amila Car Sale',
      description: `Find ${site.name}, vehicle importer in Bandarawela: ${site.addressLine}. Directions from Badulla, Diyatalawa, Welimada and Haputale. Open ${site.hoursDisplay}.`,
      jsonLd: [breadcrumbLd(CRUMBS), businessLd(settings)],
    })
  },
  component: LocationPage,
})

function LocationPage() {
  const settings = (useLoaderData({ from: '__root__' }) as { settings?: PublicSettings })?.settings ?? EMPTY_SETTINGS
  return (
    <main id="main">
      <PageHeader crumbs={CRUMBS} tag="Bandarawela · Badulla District · Uva Province" title="Our Vehicle Showroom in Bandarawela">
        <p className="lead">Visit {site.name} on Diyathalawa Road in Kahagolla, Bandarawela to see our Japanese vehicles in person, inspect documents and take a test drive.</p>
      </PageHeader>

      <div className="container section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '2.5rem' }}>
        <div>
          <h2 className="h2">Address & opening hours</h2>
          <address style={{ fontStyle: 'normal', lineHeight: 1.9, fontSize: '1.02rem', marginBottom: '1.25rem' }}>
            <strong>{site.name}</strong><br />
            {site.address.street}<br />
            {site.address.locality}, {site.address.district}<br />
            {site.address.region}, {site.address.country}
          </address>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1.5rem', margin: '0 0 1.5rem' }}>
            <dt className="muted">Hours</dt><dd style={{ margin: 0 }}>{site.hoursDisplay}</dd>
            <dt className="muted">Phone</dt><dd style={{ margin: 0 }}><a href={`tel:${site.phoneIntl}`} data-track="location" style={{ color: '#fff' }}>{site.phoneDisplay}</a></dd>
            <dt className="muted">Email</dt><dd style={{ margin: 0, wordBreak: 'break-all' }}><a href={`mailto:${site.email}`} style={{ color: '#fff' }}>{site.email}</a></dd>
            <dt className="muted">GPS</dt><dd style={{ margin: 0 }}><a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>{site.geo.lat}, {site.geo.lng}</a></dd>
          </dl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">Get directions in Google Maps</a>
            {settings.googleBusinessUrl && <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Google Business Profile</a>}
          </div>

          <h2 className="h3">Getting here</h2>
          <p className="muted" style={{ lineHeight: 1.8 }}>
            We are on Diyathalawa Road at Kahagolla, on the Diyatalawa side of Bandarawela town. Customers regularly visit us from Badulla, Welimada, Haputale,
            Ella, Diyatalawa and across the Uva Province. Call or WhatsApp us before you set off and we will make sure the vehicle you want to see is ready.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
            <a href={`tel:${site.phoneIntl}`} className="btn-outline" data-track="location"><PhoneIcon /> Call before visiting</a>
            <a href={whatsappLink(`Hello ${site.shortName}, I would like to visit the showroom.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track="location"><WhatsAppIcon /> Book a viewing</a>
          </div>
        </div>
        <div style={{ minHeight: '420px', border: '1px solid var(--border)', background: 'var(--dark-3)' }}>
          <iframe title={`Google Map — ${site.name}, ${site.addressLine}`} src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: '100%', minHeight: '420px', border: 0, display: 'block' }} />
        </div>
      </div>

      <section className="section-alt section">
        <div className="container">
          <h2 className="h2">Vehicle sales across Badulla District and Sri Lanka</h2>
          <p className="lead">
            As a direct vehicle import company based in Bandarawela, we serve buyers throughout Badulla District and the rest of Sri Lanka. Browse{' '}
            <Link to="/vehicles" style={{ color: '#fff' }}>vehicles for sale</Link>, read about <Link to="/import-from-japan" style={{ color: '#fff' }}>importing a car from Japan</Link>, or{' '}
            <Link to="/about" style={{ color: '#fff' }}>learn more about us</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
