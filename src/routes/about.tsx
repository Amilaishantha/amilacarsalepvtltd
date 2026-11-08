import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { breadcrumbLd, businessLd, pageHead } from '@/lib/seo'
import { site, mapsUrl } from '@/data/site'
import { EMPTY_SETTINGS, type PublicSettings } from '@/lib/content-fns'
import { PageHeader } from '@/components/ui'
import { BRAND_PAGES } from '@/data/brands'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About us', path: '/about' },
]

export const Route = createFileRoute('/about')({
  head: ({ matches }) => {
    const settings = (matches[0]?.loaderData as { settings?: PublicSettings } | undefined)?.settings ?? EMPTY_SETTINGS
    return pageHead({
      path: '/about',
      matches,
      title: 'About Amila Car Sale Pvt Ltd — Japanese Vehicle Importer, Bandarawela',
      description: `${site.name} is a direct importer of Japanese vehicles based in Bandarawela, Sri Lanka. Our services, import process, location and contact details.`,
      jsonLd: [
        breadcrumbLd(CRUMBS),
        businessLd(settings),
        { '@context': 'https://schema.org', '@type': 'AboutPage', url: 'https://www.amilacarsalepvtltd.com/about', name: `About ${site.name}`, about: { '@id': 'https://www.amilacarsalepvtltd.com/#business' } },
      ],
    })
  },
  component: AboutPage,
})

function AboutPage() {
  const settings = (useLoaderData({ from: '__root__' }) as { settings?: PublicSettings })?.settings ?? EMPTY_SETTINGS
  return (
    <main id="main">
      <PageHeader crumbs={CRUMBS} tag="Company information" title={`About ${site.name}`}>
        <p className="lead">{site.name} is a Sri Lankan company that imports Japanese vehicles directly from Japan and sells them from its showroom in Bandarawela, in the Uva Province.</p>
      </PageHeader>

      <div className="container section" style={{ maxWidth: '980px' }}>
        <section aria-labelledby="facts-h" style={{ marginBottom: '3rem' }}>
          <h2 id="facts-h" className="h2">Company at a glance</h2>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <tbody>
                {[
                  ['Legal name', site.name],
                  ['Business', 'Direct import and sale of Japanese vehicles; import-to-order service'],
                  ['Address', site.addressLine],
                  ['Service area', 'Bandarawela, Badulla District, Uva Province and all of Sri Lanka'],
                  ['Phone / WhatsApp', site.phoneDisplay],
                  ['Email', site.email],
                  ['Opening hours', site.hoursDisplay],
                  ['Experience', `${site.stats[0].value} years · ${site.stats[1].value} vehicles imported`],
                  ['Facebook', site.facebookUrl],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" style={{ textAlign: 'left', padding: '0.7rem 1rem 0.7rem 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600, width: '200px', verticalAlign: 'top' }}>{k}</th>
                    <td style={{ padding: '0.7rem 0', borderBottom: '1px solid var(--border)', wordBreak: 'break-word' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="prose" style={{ maxWidth: 'none' }}>
          <h2>What we do</h2>
          <p>
            We specialise in Japanese vehicles — compact cars, kei cars, SUVs, hybrids, vans and commercial vehicles from manufacturers such as{' '}
            {BRAND_PAGES.slice(0, 6).map((b, i) => (
              <span key={b.slug}>{i > 0 && ', '}<Link to="/brands/$brand" params={{ brand: b.slug }}>{b.name}</Link></span>
            ))}
            . Customers can buy a vehicle from our <Link to="/vehicles">current stock</Link> or ask us to <Link to="/import-from-japan">import a specific vehicle from Japan</Link>.
          </p>
          <h2>Our services</h2>
          <ul>
            <li><strong>Vehicle sales</strong> — brand-new, zero-mileage and quality used Japanese vehicles at our Bandarawela showroom.</li>
            <li><strong>Import to order</strong> — sourcing from Japanese auctions and dealers, with auction sheets and photos shared before purchase.</li>
            <li><strong>Import tax guidance</strong> — a free <Link to="/tax-calculator">vehicle import tax calculator</Link> and confirmed landed-cost quotes.</li>
            <li><strong>Reservations</strong> — reserve vehicles in stock or on their way from Japan.</li>
            <li><strong>Finance assistance</strong> — help arranging bank finance and leasing.</li>
          </ul>
          <h2>How the import process works</h2>
          <ol>
            <li>We agree the vehicle specification and budget with you.</li>
            <li>We find matching vehicles in Japan and share the auction sheet, photos and an estimated landed cost.</li>
            <li>Once you approve, we purchase the vehicle and arrange export and shipping to Sri Lanka.</li>
            <li>The vehicle is cleared through Sri Lanka Customs and the duties are paid.</li>
            <li>We help with registration at the Department of Motor Traffic and hand the vehicle over at our showroom.</li>
          </ol>
          <p>Read the full <Link to="/blog/$slug" params={{ slug: 'how-to-import-a-car-from-japan-to-sri-lanka' }}>guide to importing a car from Japan to Sri Lanka</Link>.</p>
          <h2>Where to find us</h2>
          <p>
            Our showroom is at {site.addressLine} (<a href={settings.googleBusinessUrl || mapsUrl} target="_blank" rel="noopener noreferrer">open in Google Maps</a>). See the{' '}
            <Link to="/location">location page</Link> for directions, or <Link to="/contact">contact us</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
