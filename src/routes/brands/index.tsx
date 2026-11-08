import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchVehicles } from '@/lib/vehicle-fns'
import { breadcrumbLd, pageHead } from '@/lib/seo'
import { BRAND_PAGES } from '@/data/brands'
import { brandSlug, displayMake, type VehicleRow } from '@/lib/vehicle-utils'
import { PageHeader } from '@/components/ui'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Brands', path: '/brands' },
]

export const Route = createFileRoute('/brands/')({
  loader: () => fetchVehicles(),
  head: ({ matches }) =>
    pageHead({
      path: '/brands',
      matches,
      title: 'Japanese Car Brands for Sale in Sri Lanka | Amila Car Sale',
      description: 'Toyota, Honda, Nissan, Suzuki, Daihatsu, Mitsubishi, Mazda, Subaru and Lexus vehicles imported from Japan to Sri Lanka by Amila Car Sale, Bandarawela.',
      jsonLd: [breadcrumbLd(CRUMBS)],
    }),
  component: BrandsIndex,
})

function BrandsIndex() {
  const vehicles = (Route.useLoaderData() as VehicleRow[]).filter(v => v.status !== 'Sold')
  const count = (slug: string) => vehicles.filter(v => brandSlug(v.make) === slug).length
  const curated = new Set(BRAND_PAGES.map(b => b.slug))
  const others = Array.from(new Set(vehicles.map(v => displayMake(v.make)))).filter(m => !curated.has(brandSlug(m))).sort()

  return (
    <main id="main">
      <PageHeader crumbs={CRUMBS} tag="Shop by manufacturer" title="Japanese Car Brands We Import">
        <p className="lead">Choose a brand to see the vehicles we currently have, popular models in Sri Lanka and import tax guidance for that brand.</p>
      </PageHeader>
      <section className="container section">
        <h2 className="sr-only">Japanese brands</h2>
        <div className="grid-3">
          {BRAND_PAGES.map(b => (
            <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} className="vehicle-card" style={{ padding: '1.6rem' }}>
              <h3 className="h3" style={{ fontSize: '1.35rem' }}>{b.name}</h3>
              <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1rem' }}>{b.tagline}</p>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: count(b.slug) ? 'var(--gold-light)' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {count(b.slug) ? `${count(b.slug)} in stock →` : 'Import on request →'}
              </span>
            </Link>
          ))}
        </div>
        {others.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h2 className="h3">Other brands currently in stock</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {others.map(m => (
                <Link key={m} to="/vehicles" search={{ make: m }} className="chip">{m}</Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
