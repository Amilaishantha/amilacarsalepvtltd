import { createFileRoute, Link } from '@tanstack/react-router'
import { breadcrumbLd, faqLd, pageHead, BUSINESS_ID } from '@/lib/seo'
import { site } from '@/data/site'
import { IMPORT_FAQS } from '@/data/faqs'
import GeneralEnquiryForm from '@/components/GeneralEnquiryForm'
import { FaqList, PageHeader } from '@/components/ui'
import { canonicalUrl } from '@/data/site'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Import a car from Japan', path: '/import-from-japan' },
]

export const Route = createFileRoute('/import-from-japan')({
  head: ({ matches }) =>
    pageHead({
      path: '/import-from-japan',
      matches,
      title: 'Import Cars from Japan to Sri Lanka | Vehicle Import Service | Amila Car Sale',
      description: 'Import a car from Japan to Sri Lanka with Amila Car Sale Pvt Ltd. We source from Japanese auctions and dealers, share auction sheets, estimate import tax and handle shipping and clearance.',
      jsonLd: [
        breadcrumbLd(CRUMBS),
        faqLd(IMPORT_FAQS),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Vehicle import from Japan to Sri Lanka',
          serviceType: 'Vehicle import',
          provider: { '@id': BUSINESS_ID, '@type': 'AutoDealer', name: site.name },
          areaServed: { '@type': 'Country', name: 'Sri Lanka' },
          url: canonicalUrl('/import-from-japan'),
        },
      ],
    }),
  component: ImportPage,
})

const STEPS = [
  ['Tell us what you want', 'Make, model, grade, colour, year range, mileage and budget — or just the type of vehicle you need.'],
  ['We search Japan', 'We look through Japanese auctions and dealer stock and shortlist vehicles that match.'],
  ['Review the auction sheet', 'You see the auction sheet, photos and a translation of the important notes before anything is bought.'],
  ['Know the landed cost', 'We estimate the CIF value and all import taxes so there are no surprises.'],
  ['Purchase, shipping & clearance', 'We purchase the vehicle, arrange export and shipping, and clear it through Sri Lanka Customs.'],
  ['Registration & handover', 'We help with registration and hand over your vehicle at our Bandarawela showroom.'],
]

function ImportPage() {
  return (
    <main id="main">
      <PageHeader crumbs={CRUMBS} tag="Import-to-order service" title="Import a Car from Japan to Sri Lanka">
        <p className="lead">Can’t find the right vehicle in Sri Lanka? We import it for you directly from Japan — with full transparency on condition, auction grade and import taxes.</p>
      </PageHeader>

      <div className="container section">
        <div className="layout-sidebar">
          <div>
            <h2 className="h2">How our vehicle import service works</h2>
            <ol style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 2.5rem', display: 'grid', gap: '1rem' }}>
              {STEPS.map(([t, b], i) => (
                <li key={t} className="card" style={{ display: 'flex', gap: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--gold)', lineHeight: 1, minWidth: '2.2rem' }} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="h3">{t}</h3>
                    <p className="muted" style={{ margin: 0, lineHeight: 1.7, fontSize: '0.92rem' }}>{b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="h2">Plan your budget first</h2>
            <p className="muted" style={{ lineHeight: 1.8 }}>
              Import tax is usually the biggest part of the cost. Engine capacity, fuel type and CIF value all change the amount. Try a few options in our{' '}
              <Link to="/tax-calculator" style={{ color: '#fff' }}>vehicle import tax calculator</Link>, and read{' '}
              <Link to="/blog/$slug" params={{ slug: 'sri-lanka-vehicle-import-tax-explained' }} style={{ color: '#fff' }}>Sri Lanka vehicle import tax explained</Link>.
            </p>
            <Link to="/tax-calculator" className="btn-gold" style={{ margin: '0.5rem 0 2.5rem' }}>Calculate your vehicle import taxes</Link>

            <h2 className="h2">Import FAQs</h2>
            <FaqList faqs={IMPORT_FAQS} />
          </div>
          <aside>
            <GeneralEnquiryForm
              source="import-request"
              heading="Request a vehicle import"
              intro="Tell us the vehicle you want. We reply with options from Japan and an estimated landed cost."
              showVehicleField
              messagePlaceholder="Preferred colour, grade, mileage limit, when you need it…"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
