import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { fetchVehicles } from '@/lib/vehicle-fns'
import { breadcrumbLd, itemListLd, pageHead } from '@/lib/seo'
import { brandSlug, displayMake, displayModel, hasValidPrice, type VehicleRow } from '@/lib/vehicle-utils'
import { PageHeader, VehicleGrid } from '@/components/ui'
import { BRAND_PAGES } from '@/data/brands'
import { track } from '@/lib/analytics'

type Search = { q?: string; make?: string; fuel?: string; type?: string; sort?: string; sold?: boolean }

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest arrivals' },
  { value: 'year', label: 'Newest model year' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'mileage', label: 'Lowest mileage' },
]

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Vehicles for sale', path: '/vehicles' },
]

export const Route = createFileRoute('/vehicles/')({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === 'string' ? s.q.slice(0, 80) : undefined,
    make: typeof s.make === 'string' ? s.make.slice(0, 40) : undefined,
    fuel: typeof s.fuel === 'string' ? s.fuel.slice(0, 40) : undefined,
    type: typeof s.type === 'string' ? s.type.slice(0, 40) : undefined,
    sort: typeof s.sort === 'string' ? s.sort.slice(0, 20) : undefined,
    sold: s.sold === true || s.sold === 'true' ? true : undefined,
  }),
  loader: () => fetchVehicles(),
  head: ({ loaderData, matches }) => {
    const list = (loaderData ?? []).filter(v => v.status !== 'Sold')
    return pageHead({
      path: '/vehicles',
      matches,
      title: 'Japanese Cars for Sale in Sri Lanka — Available Vehicles | Amila Car Sale',
      description: `Browse ${list.length} Japanese and imported vehicles for sale in Sri Lanka — Toyota, Honda, Nissan, Suzuki, Daihatsu and more. Brand-new and low-mileage imports at our Bandarawela showroom.`,
      jsonLd: [breadcrumbLd(CRUMBS), itemListLd('Vehicles for sale at Amila Car Sale', list)],
    })
  },
  component: VehiclesPage,
})

function VehiclesPage() {
  const vehicles = Route.useLoaderData() as VehicleRow[]
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/vehicles/' })
  const [q, setQ] = useState(search.q ?? '')

  useEffect(() => setQ(search.q ?? ''), [search.q])

  const setSearch = (patch: Partial<Search>) =>
    navigate({ search: prev => ({ ...prev, ...patch }), replace: true, resetScroll: false })

  // Debounce free-text search into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? '') !== q) {
        setSearch({ q: q || undefined })
        if (q) track('vehicle_search', { search_term: q })
      }
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const makes = useMemo(() => Array.from(new Set(vehicles.map(v => displayMake(v.make)))).sort(), [vehicles])
  const fuels = useMemo(() => Array.from(new Set(vehicles.map(v => v.fuel))).sort(), [vehicles])
  const types = useMemo(() => Array.from(new Set(vehicles.map(v => v.type))).sort(), [vehicles])

  const filtered = useMemo(() => {
    const needle = (search.q ?? '').toLowerCase().trim()
    let list = vehicles
      .filter(v => (search.sold ? true : v.status !== 'Sold'))
      .filter(v => !search.make || displayMake(v.make) === search.make)
      .filter(v => !search.fuel || v.fuel === search.fuel)
      .filter(v => !search.type || v.type === search.type)
      .filter(v => {
        if (!needle) return true
        const hay = `${displayMake(v.make)} ${displayModel(v.model)} ${v.year} ${v.color} ${v.grade} ${v.fuel} ${v.type}`.toLowerCase()
        return needle.split(/\s+/).every(w => hay.includes(w))
      })
    const priced = (v: VehicleRow) => (hasValidPrice(v) ? v.price : null)
    switch (search.sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => (priced(a) ?? Infinity) - (priced(b) ?? Infinity))
        break
      case 'price-desc':
        list = [...list].sort((a, b) => (priced(b) ?? -Infinity) - (priced(a) ?? -Infinity))
        break
      case 'mileage':
        list = [...list].sort((a, b) => a.mileage - b.mileage)
        break
      case 'year':
        list = [...list].sort((a, b) => b.year - a.year || b.id - a.id)
        break
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id)
    }
    return list
  }, [vehicles, search])

  const hasFilters = !!(search.q || search.make || search.fuel || search.type)

  return (
    <main id="main" style={{ minHeight: '100vh' }}>
      <PageHeader crumbs={CRUMBS} tag="Direct imports from Japan" title="Japanese Cars & Vehicles for Sale in Sri Lanka">
        <p className="lead">
          Every vehicle below is in our Bandarawela showroom, on its way from Japan, or recently reserved. Prices are shown where confirmed —
          otherwise ask us for a quotation. Can’t find what you need? <Link to="/import-from-japan" style={{ color: '#fff' }}>We can import it for you</Link>.
        </p>
      </PageHeader>

      <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }} aria-label="Browse by brand">
          {BRAND_PAGES.filter(b => vehicles.some(v => brandSlug(v.make) === b.slug)).map(b => (
            <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} className="chip">{b.name}</Link>
          ))}
        </div>

        <form role="search" onSubmit={e => e.preventDefault()} style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <label className="sr-only" htmlFor="veh-q">Search vehicles</label>
          <input id="veh-q" type="search" placeholder="Search make, model, year, colour…" value={q} onChange={e => setQ(e.target.value)} className="calc-input" style={{ flex: '1 1 220px', fontSize: '16px' }} />
          <label className="sr-only" htmlFor="veh-make">Make</label>
          <select id="veh-make" value={search.make ?? ''} onChange={e => setSearch({ make: e.target.value || undefined })} className="calc-input" style={{ flex: '0 1 160px' }}>
            <option value="">All makes</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <label className="sr-only" htmlFor="veh-fuel">Fuel type</label>
          <select id="veh-fuel" value={search.fuel ?? ''} onChange={e => setSearch({ fuel: e.target.value || undefined })} className="calc-input" style={{ flex: '0 1 150px' }}>
            <option value="">All fuel types</option>
            {fuels.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="sr-only" htmlFor="veh-type">Body type</label>
          <select id="veh-type" value={search.type ?? ''} onChange={e => setSearch({ type: e.target.value || undefined })} className="calc-input" style={{ flex: '0 1 140px' }}>
            <option value="">All body types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <label className="sr-only" htmlFor="veh-sort">Sort by</label>
          <select id="veh-sort" value={search.sort ?? 'latest'} onChange={e => setSearch({ sort: e.target.value === 'latest' ? undefined : e.target.value })} className="calc-input" style={{ flex: '0 1 180px' }}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={!!search.sold} onChange={e => setSearch({ sold: e.target.checked || undefined })} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
            Show sold
          </label>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.25rem' }} aria-live="polite">
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} {hasFilters ? 'match your search' : search.sold ? 'listed' : 'available or reserved'}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <h2 className="h2" style={{ color: 'var(--text-muted)' }}>No vehicles found</h2>
            <p style={{ fontSize: '0.95rem' }}>
              Try{' '}
              <button onClick={() => { setQ(''); navigate({ search: {}, replace: true }) }} style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', fontSize: '0.95rem', padding: 0, textDecoration: 'underline' }}>
                clearing the filters
              </button>{' '}
              or <Link to="/import-from-japan" style={{ color: '#fff' }}>ask us to import one</Link>.
            </p>
          </div>
        ) : (
          <VehicleGrid vehicles={filtered} priorityCount={3} headingLevel={2} />
        )}
      </div>
    </main>
  )
}
