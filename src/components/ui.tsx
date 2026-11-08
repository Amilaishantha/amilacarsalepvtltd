import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  formatEngine,
  formatMileage,
  formatPrice,
  hasEngineSpec,
  hasValidPrice,
  imageSrcSet,
  optimizedImage,
  tidyCase,
  vehicleAlt,
  vehicleFullName,
  vehicleSlug,
  type VehicleRow,
} from '@/lib/vehicle-utils'
import type { Crumb, Faq } from '@/lib/seo'

// ─────────────────────────── Icons ───────────────────────────

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function PhoneIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z" />
    </svg>
  )
}

export function PinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

export function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

// ─────────────────────────── Images ───────────────────────────

/** Responsive, CDN-optimised image with fixed aspect ratio (prevents layout shift). */
export function SmartImage({
  src,
  alt,
  ratio = 16 / 10,
  widths = [360, 560, 800, 1100],
  sizes = '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw',
  priority = false,
  style,
}: {
  src: string
  alt: string
  ratio?: number
  widths?: number[]
  sizes?: string
  priority?: boolean
  style?: React.CSSProperties
}) {
  const base = widths[Math.min(1, widths.length - 1)]
  return (
    <img
      src={optimizedImage(src, base, Math.round(base / ratio))}
      srcSet={imageSrcSet(src, widths, ratio)}
      sizes={sizes}
      alt={alt}
      width={base}
      height={Math.round(base / ratio)}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  )
}

// ─────────────────────────── Vehicle bits ───────────────────────────

export function StatusBadge({ status }: { status: string }) {
  return <span className={`spec-badge status-pill status-${status.toLowerCase()}`}>{status}</span>
}

export function VehicleCard({ vehicle, priority = false, headingLevel = 3 }: { vehicle: VehicleRow; priority?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link
      to="/vehicles/$slug"
      params={{ slug: vehicleSlug(vehicle) }}
      className="vehicle-card"
      style={{ opacity: vehicle.status === 'Sold' ? 0.65 : 1 }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--dark-3)' }}>
        <SmartImage src={vehicle.image} alt={vehicleAlt(vehicle)} priority={priority} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,10,0.85) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          <StatusBadge status={vehicle.status} />
        </div>
        {vehicle.featured && (
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span className="spec-badge status-pill" style={{ background: 'var(--gold)', color: '#fff', border: 'none' }}>Featured</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem' }}>
          <H style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: 0 }}>
            {vehicleFullName(vehicle)}
          </H>
        </div>
      </div>
      <div style={{ padding: '1rem 1.15rem 1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.9rem' }}>
          <span className="spec-badge">{vehicle.fuel}</span>
          <span className="spec-badge">{vehicle.transmission}</span>
          {hasEngineSpec(vehicle) && <span className="spec-badge">{formatEngine(vehicle)}</span>}
          <span className="spec-badge">{formatMileage(vehicle)}</span>
          {vehicle.color && <span className="spec-badge">{tidyCase(vehicle.color.toLowerCase())}</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {hasValidPrice(vehicle) ? 'Asking price' : 'Price'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: hasValidPrice(vehicle) ? '1.2rem' : '1rem', fontWeight: 800, color: hasValidPrice(vehicle) ? '#fff' : 'var(--text-muted)', lineHeight: 1.1 }}>
              {formatPrice(vehicle)}
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-light)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}

export function VehicleGrid({ vehicles, priorityCount = 0, headingLevel = 3 }: { vehicles: VehicleRow[]; priorityCount?: number; headingLevel?: 2 | 3 }) {
  return (
    <div className="grid-cards">
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id} vehicle={v} priority={i < priorityCount} headingLevel={headingLevel} />
      ))}
    </div>
  )
}

// ─────────────────────────── Navigation & content ───────────────────────────

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((c, i) =>
          i === items.length - 1 ? (
            <li key={c.path} aria-current="page" style={{ color: 'var(--text-muted)' }}>{c.name}</li>
          ) : (
            <li key={c.path}>
              <a href={c.path}>{c.name}</a>
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}

export function PageHeader({ crumbs, tag, title, children }: { crumbs?: Crumb[]; tag?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {crumbs && <div style={{ marginBottom: '1.25rem' }}><Breadcrumbs items={crumbs} /></div>}
        {tag && <div className="section-tag" style={{ marginBottom: '0.75rem' }}>{tag}</div>}
        <h1 className="h1">{title}</h1>
        {children}
      </div>
    </header>
  )
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map(f => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <div className="faq-a">{f.a}</div>
        </details>
      ))}
    </div>
  )
}
