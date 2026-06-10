import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { fetchVehicles, type VehicleRow } from '@/lib/vehicle-fns'

export const Route = createFileRoute('/marketplace/')({
  loader: () => fetchVehicles(),
  component: MarketplacePage,
})

const FUEL_TYPES = ['All', 'Hybrid', 'Petrol', 'Diesel', 'Electric', 'Plug-in Hybrid']
const TYPES = ['All', 'Sedan', 'SUV', 'Hatchback', 'Van', 'Pickup']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'mileage', label: 'Lowest Mileage' },
]

function MarketplacePage() {
  const vehicles = Route.useLoaderData() as VehicleRow[]
  const [fuelFilter, setFuelFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [search, setSearch] = useState('')
  const [showSold, setShowSold] = useState(false)

  let filtered = vehicles
    .filter(v => (showSold ? true : v.status !== 'Sold'))
    .filter(v => fuelFilter === 'All' || v.fuel === fuelFilter)
    .filter(v => typeFilter === 'All' || v.type === typeFilter)
    .filter(v => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.year.toString().includes(q) ||
        v.color.toLowerCase().includes(q)
      )
    })

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sortBy === 'mileage') filtered = [...filtered].sort((a, b) => a.mileage - b.mileage)
  else filtered = [...filtered].sort((a, b) => b.year - a.year)

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--dark-2)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 2rem 2.5rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>Direct Imports from Japan</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '0 0 0.5rem' }}>
            Vehicle Marketplace
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Filters bar */}
        <div style={{
          background: 'var(--dark-2)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
            <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search make, model, year..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="calc-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            />
          </div>

          {/* Fuel filter */}
          <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className="calc-input" style={{ flex: '0 1 160px', fontSize: '0.82rem' }}>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f === 'All' ? 'All Fuel Types' : f}</option>)}
          </select>

          {/* Type filter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="calc-input" style={{ flex: '0 1 150px', fontSize: '0.82rem' }}>
            {TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="calc-input" style={{ flex: '0 1 180px', fontSize: '0.82rem' }}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Show sold */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={showSold}
              onChange={e => setShowSold(e.target.checked)}
              style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }}
            />
            Show Sold
          </label>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>No vehicles found</div>
            <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or <button onClick={() => { setSearch(''); setFuelFilter('All'); setTypeFilter('All') }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>clear all filters</button></p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(vehicle => (
              <Link key={vehicle.id} to="/marketplace/$vehicleId" params={{ vehicleId: vehicle.id.toString() }} className="vehicle-card" style={{ opacity: vehicle.status === 'Sold' ? 0.6 : 1 }}>
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--dark-3)' }}>
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,14,18,0.85) 0%, transparent 55%)' }} />

                  {/* Status */}
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span className={`spec-badge status-${vehicle.status.toLowerCase()}`} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Fuel type tag */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span className="spec-badge" style={{ fontSize: '0.65rem', background: vehicle.fuel === 'Hybrid' || vehicle.fuel === 'Plug-in Hybrid' ? 'rgba(15,118,110,0.3)' : vehicle.fuel === 'Electric' ? 'rgba(37,99,235,0.3)' : 'rgba(201,165,61,0.15)', color: vehicle.fuel === 'Hybrid' || vehicle.fuel === 'Plug-in Hybrid' ? '#34d399' : vehicle.fuel === 'Electric' ? '#93c5fd' : 'var(--gold)', border: 'none' }}>
                      {vehicle.fuel}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      {vehicle.year} {vehicle.make}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{vehicle.model}</div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '1.1rem 1.3rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.9rem' }}>
                    <span className="spec-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {vehicle.mileage.toLocaleString()} km
                    </span>
                    <span className="spec-badge">{vehicle.transmission}</span>
                    <span className="spec-badge">{vehicle.engineCC ? `${vehicle.engineCC}cc` : `${vehicle.motorKW}kW`}</span>
                    <span className="spec-badge">{vehicle.color}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Price (LKR)</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                        {vehicle.price.toLocaleString('en-LK')}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, opacity: 0.8 }}>Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
