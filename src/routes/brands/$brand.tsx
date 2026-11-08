import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { fetchVehicles } from '@/lib/vehicle-fns'
import { breadcrumbLd, faqLd, itemListLd, pageHead } from '@/lib/seo'
import { findBrandPage, type BrandPage } from '@/data/brands'
import { brandSlug, displayModel, formatEngine, hasEngineSpec, type VehicleRow } from '@/lib/vehicle-utils'
import { FaqList, PageHeader, VehicleGrid, WhatsAppIcon } from '@/components/ui'
import { whatsappLink, site } from '@/data/site'

type Data = { brand: BrandPage; vehicles: VehicleRow[] }

export const Route = createFileRoute('/brands/$brand')({
  loader: async ({ params }): Promise<Data> => {
    const brand = findBrandPage(params.brand.toLowerCase())
    if (!brand) throw notFound()
    const all = await fetchVehicles()
    const vehicles = all
      .filter(v => brandSlug(v.make) === brand.slug && v.status !== 'Sold')
      .sort((a, b) => Number(b.featured) - Number(a.featured) || (a.status === 'Available' ? -1 : 1) - (b.status === 'Available' ? -1 : 1) || b.id - a.id)
    return { brand, vehicles }
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) return {}
    const { brand, vehicles } = loaderData
    const path = `/brands/${brand.slug}`
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Brands', path: '/brands' },
      { name: brand.name, path },
    ]
    return pageHead({
      path,
      matches,
      title: `${brand.name} Cars for Sale in Sri Lanka | Imported from Japan | Amila Car Sale`,
      description: `${vehicles.length ? `${vehicles.length} ${brand.name} vehicle${vehicles.length > 1 ? 's' : ''} available now. ` : ''}${brand.tagline}. Import ${brand.name} vehicles directly from Japan with Amila Car Sale, Bandarawela.`,
      image: vehicles.find(v => !/placeholder/.test(v.image))?.image,
      jsonLd: [breadcrumbLd(crumbs), faqLd(brand.faqs), ...(vehicles.length ? [itemListLd(`${brand.name} vehicles for sale`, vehicles)] : [])],
    })
  },
  component: BrandPageView,
})

function BrandPageView() {
  const { brand, vehicles } = Route.useLoaderData() as Data
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Brands', path: '/brands' },
    { name: brand.name, path: `/brands/${brand.slug}` },
  ]
  // Real models currently in stock, with their recorded engine sizes
  const stockModels = Array.from(
    vehicles.reduce((m, v) => {
      const key = displayModel(v.model)
      const entry = m.get(key) ?? { count: 0, engines: new Set<string>() }
      entry.count++
      if (hasEngineSpec(v)) entry.engines.add(formatEngine(v))
      m.set(key, entry)
      return m
    }, new Map<string, { count: number; engines: Set<string> }>()),
  )

  return (
    <main id="main">
      <PageHeader crumbs={crumbs} tag={`${brand.name} · Direct from Japan`} title={`${brand.name} Cars for Sale in Sri Lanka`}>
        {brand.intro.map(p => <p key={p.slice(0, 20)} className="lead" style={{ marginBottom: '0.75rem' }}>{p}</p>)}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
          <a href={whatsappLink(`Hello ${site.shortName}, I'm looking for a ${brand.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track={`brand-${brand.slug}`}>
            <WhatsAppIcon /> Enquire about {brand.name}
          </a>
          <Link to="/import-from-japan" className="btn-outline">Import a {brand.name}</Link>
        </div>
      </PageHeader>

      <section className="container section" aria-labelledby="stock-h">
        <h2 id="stock-h" className="h2">{brand.name} vehicles available now</h2>
        {vehicles.length ? (
          <>
            <p className="muted" style={{ margin: '0 0 1.5rem' }}>
              {vehicles.length} {brand.name} vehicle{vehicles.length > 1 ? 's' : ''} in stock or arriving. Prices shown where confirmed.
            </p>
            <VehicleGrid vehicles={vehicles} priorityCount={3} />
          </>
        ) : (
          <div className="card">
            <p className="muted" style={{ margin: '0 0 1rem' }}>
              We don’t have a {brand.name} in stock right now. Tell us the model you want and we’ll source it directly from Japan.
            </p>
            <Link to="/import-from-japan" className="btn-gold">Request a {brand.name} import</Link>
          </div>
        )}
      </section>

      {stockModels.length > 0 && (
        <section className="container" style={{ paddingBottom: '1rem' }} aria-labelledby="spec-h">
          <h2 id="spec-h" className="h3">{brand.name} models in our stock</h2>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead><tr>{['Model', 'Units', 'Engine sizes in stock'].map(h => <th key={h} scope="col" style={{ textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {stockModels.map(([model, e]) => (
                  <tr key={model}>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>{brand.name} {model}</td>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{e.count}</td>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{[...e.engines].join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="section-alt section" aria-labelledby="pop-h">
        <div className="container">
          <h2 id="pop-h" className="h2">Popular {brand.name} models in Sri Lanka</h2>
          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            {brand.popularModels.map(m => (
              <div key={m.name} className="card card-accent">
                <h3 className="h3">{m.name}</h3>
                <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="imp-h">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2.5rem' }}>
          <div>
            <h2 id="imp-h" className="h2">Importing a {brand.name} to Sri Lanka</h2>
            <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              {brand.importNotes.map(n => <li key={n}>{n}</li>)}
              <li>Read our <Link to="/blog/$slug" params={{ slug: 'how-to-import-a-car-from-japan-to-sri-lanka' }} style={{ color: '#fff' }}>step-by-step import guide</Link>.</li>
            </ul>
            <Link to="/tax-calculator" className="btn-gold" style={{ marginTop: '0.5rem' }}>Calculate your vehicle import taxes</Link>
          </div>
          <div>
            <h2 className="h2">{brand.name} FAQs</h2>
            <FaqList faqs={brand.faqs} />
          </div>
        </div>
      </section>
    </main>
  )
}
