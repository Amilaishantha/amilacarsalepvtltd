import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { fetchVehicles } from '@/lib/vehicle-fns'
import VehicleEnquiryForm from '@/components/VehicleEnquiryForm'
import { site, whatsappLink, canonicalUrl } from '@/data/site'
import { breadcrumbLd, pageHead, vehicleLd } from '@/lib/seo'
import {
  brandSlug,
  displayMake,
  displayModel,
  formatEngine,
  formatMileage,
  formatPrice,
  hasValidPrice,
  idFromSlug,
  tidyCase,
  vehicleAlt,
  vehicleFullName,
  vehicleImages,
  vehiclePath,
  vehicleSeoDescription,
  vehicleSeoStatus,
  vehicleSeoTitle,
  vehicleSlug,
  isPlaceholderImage,
  type VehicleRow,
} from '@/lib/vehicle-utils'
import { Breadcrumbs, PhoneIcon, SmartImage, StatusBadge, VehicleGrid, WhatsAppIcon } from '@/components/ui'
import { findBrandPage } from '@/data/brands'

type LoaderData = { vehicle: VehicleRow; similar: VehicleRow[]; indexable: boolean }

export const Route = createFileRoute('/vehicles/$slug')({
  loader: async ({ params }): Promise<LoaderData> => {
    const id = idFromSlug(params.slug)
    if (!id) throw notFound()
    const all = await fetchVehicles()
    const vehicle = all.find(v => v.id === id)
    if (!vehicle) throw notFound()
    const canonical = vehicleSlug(vehicle)
    if (params.slug !== canonical) throw redirect({ to: '/vehicles/$slug', params: { slug: canonical }, statusCode: 301 })

    const brand = brandSlug(vehicle.make)
    const pool = all.filter(v => v.id !== vehicle.id && v.status !== 'Sold')
    const score = (v: VehicleRow) =>
      (displayModel(v.model).toLowerCase() === displayModel(vehicle.model).toLowerCase() ? 4 : 0) +
      (brandSlug(v.make) === brand ? 2 : 0) +
      (v.type === vehicle.type ? 1 : 0) +
      (v.status === 'Available' ? 0.5 : 0)
    const similar = pool
      .map(v => ({ v, s: score(v) }))
      .filter(x => x.s >= 1)
      .sort((a, b) => b.s - a.s || b.v.id - a.v.id)
      .slice(0, 4)
      .map(x => x.v)

    return { vehicle, similar, indexable: vehicleSeoStatus(vehicle, all).indexable }
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) return {}
    const { vehicle: v, indexable } = loaderData
    const path = vehiclePath(v)
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Vehicles', path: '/vehicles' },
      { name: displayMake(v.make), path: findBrandPage(brandSlug(v.make)) ? `/brands/${brandSlug(v.make)}` : `/vehicles?make=${encodeURIComponent(displayMake(v.make))}` },
      { name: vehicleFullName(v), path },
    ]
    return pageHead({
      path,
      matches,
      title: vehicleSeoTitle(v),
      description: vehicleSeoDescription(v),
      image: isPlaceholderImage(v.image) ? undefined : v.image,
      imageAlt: vehicleAlt(v),
      type: 'product',
      noindex: !indexable,
      jsonLd: [breadcrumbLd(crumbs), vehicleLd(v)],
    })
  },
  component: VehicleDetailPage,
})

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--dark-2)', padding: '0.95rem 1.1rem' }}>
      <dt style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>{label}</dt>
      <dd style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{value}</dd>
    </div>
  )
}

function VehicleDetailPage() {
  const { vehicle, similar } = Route.useLoaderData() as LoaderData
  const images = vehicleImages(vehicle)
  const [active, setActive] = useState(0)
  const brand = findBrandPage(brandSlug(vehicle.make))
  const name = vehicleFullName(vehicle)

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: displayMake(vehicle.make), path: brand ? `/brands/${brand.slug}` : `/vehicles?make=${encodeURIComponent(displayMake(vehicle.make))}` },
    { name, path: vehiclePath(vehicle) },
  ]

  // Only facts that are actually recorded are shown — nothing is invented.
  const specs: { label: string; value: string }[] = [
    { label: 'Manufacturer', value: displayMake(vehicle.make) },
    { label: 'Model', value: displayModel(vehicle.model) },
    { label: 'Model year', value: String(vehicle.year) },
    ...(vehicle.manufactureDate ? [{ label: 'Manufactured', value: vehicle.manufactureDate }] : []),
    ...(vehicle.grade.trim() ? [{ label: 'Grade / trim', value: tidyCase(vehicle.grade) }] : []),
    { label: 'Engine', value: formatEngine(vehicle) },
    { label: 'Fuel type', value: vehicle.fuel },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Mileage', value: formatMileage(vehicle) },
    ...(vehicle.color.trim() ? [{ label: 'Colour', value: tidyCase(vehicle.color.toLowerCase()) }] : []),
    { label: 'Body type', value: vehicle.type },
    ...(vehicle.auctionGrade ? [{ label: 'Auction grade', value: vehicle.auctionGrade }] : []),
    ...(vehicle.condition ? [{ label: 'Condition', value: vehicle.condition }] : []),
    ...(vehicle.chassisNumber ? [{ label: 'Chassis no.', value: vehicle.chassisNumber }] : []),
    { label: 'Stock ID', value: `#${vehicle.id}` },
    { label: 'Status', value: vehicle.status },
  ]

  const quickWa = whatsappLink(`Hello ${site.shortName}, I'm interested in the ${name} (Stock #${vehicle.id}).\n${canonicalUrl(vehiclePath(vehicle))}`)

  return (
    <main id="main" style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border)', padding: '0.9rem 0' }}>
        <div className="container"><Breadcrumbs items={crumbs} /></div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="layout-sidebar">
          <div>
            {/* Gallery */}
            <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--dark-3)', border: '1px solid var(--border)' }}>
              <SmartImage
                src={images[active] ?? vehicle.image}
                alt={vehicleAlt(vehicle, active)}
                priority
                widths={[480, 800, 1200, 1600]}
                sizes="(max-width: 960px) 100vw, 860px"
                style={{ objectFit: 'contain', background: '#000' }}
              />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}><StatusBadge status={vehicle.status} /></div>
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', overflowX: 'auto' }} role="list" aria-label="Vehicle photos">
                {images.map((src, i) => (
                  <button key={src} type="button" role="listitem" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === active}
                    style={{ flex: '0 0 96px', height: '64px', padding: 0, border: i === active ? '2px solid var(--gold)' : '1px solid var(--border)', background: 'var(--dark-3)', cursor: 'pointer' }}>
                    <SmartImage src={src} alt="" widths={[192]} sizes="96px" ratio={1.5} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ margin: '1.75rem 0 1.5rem' }}>
              <h1 className="h1" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.5rem)', marginBottom: '0.5rem' }}>{name}</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {vehicle.fuel} {vehicle.type.toLowerCase()} for sale in Sri Lanka · {site.shortName}, Bandarawela
              </p>
            </div>

            <section aria-labelledby="specs-h" style={{ marginBottom: '2rem' }}>
              <h2 id="specs-h" className="h3" style={{ marginBottom: '0.9rem' }}>Vehicle specifications</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', margin: 0 }}>
                {specs.map(s => <Spec key={s.label} {...s} />)}
              </dl>
            </section>

            {vehicle.description.trim() && (
              <section aria-labelledby="about-h" style={{ marginBottom: '2rem' }}>
                <h2 id="about-h" className="h3">About this vehicle</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-line' }}>{vehicle.description}</p>
              </section>
            )}

            {vehicle.features.length > 0 && (
              <section aria-labelledby="feat-h" style={{ marginBottom: '2rem' }}>
                <h2 id="feat-h" className="h3">Key features</h2>
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.55rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {vehicle.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }} aria-hidden="true">◆</span>{f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="buy-h" className="card card-accent">
              <h2 id="buy-h" className="h3">Buying this vehicle from Amila Car Sale</h2>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.2rem' }}>
                <li>View and inspect it at our showroom — <Link to="/location" style={{ color: '#fff' }}>{site.addressLine}</Link>.</li>
                <li>Ask us for the auction sheet and documents. <Link to="/blog/$slug" params={{ slug: 'understanding-japanese-vehicle-auction-grades' }} style={{ color: '#fff' }}>How to read auction grades</Link>.</li>
                <li>Reserve with a WhatsApp message — see <Link to="/blog/$slug" params={{ slug: 'how-to-reserve-a-japanese-vehicle' }} style={{ color: '#fff' }}>how reservations work</Link>.</li>
                <li>Bank finance assistance is available.</li>
              </ul>
            </section>
          </div>

          <aside aria-label="Price and enquiry">
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.6rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                {hasValidPrice(vehicle) ? 'Asking price' : 'Price'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: hasValidPrice(vehicle) ? '2rem' : '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>
                {formatPrice(vehicle)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
                {hasValidPrice(vehicle) ? 'Negotiable · Bank finance available' : 'Contact us for the current price and availability'}
              </div>
              <div style={{ display: 'grid', gap: '0.6rem', marginTop: '1.25rem' }}>
                <a href={quickWa} target="_blank" rel="noopener noreferrer" data-track="vehicle-quick" className="btn-wa"><WhatsAppIcon /> WhatsApp us now</a>
                <a href={`tel:${site.phoneIntl}`} data-track="vehicle" className="btn-outline" style={{ justifyContent: 'center' }}><PhoneIcon /> Call {site.phoneDisplay}</a>
              </div>
            </div>

            <div id="enquire" style={{ scrollMarginTop: '90px', marginBottom: '1rem' }}>
              <VehicleEnquiryForm vehicle={vehicle} />
            </div>

            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', padding: '1.2rem 1.4rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Importing a similar car?</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.6, margin: '0 0 0.7rem' }}>
                Estimate excise duty, CID, VAT and other levies for a {formatEngine(vehicle)} {vehicle.fuel.toLowerCase()} vehicle.
              </p>
              <Link to="/tax-calculator" style={{ color: 'var(--gold-light)', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none' }}>Calculate import tax →</Link>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="similar-h" style={{ marginTop: '3.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.25rem' }}>
              <h2 id="similar-h" className="h2" style={{ margin: 0 }}>Similar vehicles</h2>
              {brand ? (
                <Link to="/brands/$brand" params={{ brand: brand.slug }} className="btn-outline">All {brand.name} vehicles</Link>
              ) : (
                <Link to="/vehicles" className="btn-outline">All vehicles</Link>
              )}
            </div>
            <VehicleGrid vehicles={similar} />
          </section>
        )}
      </div>
    </main>
  )
}
