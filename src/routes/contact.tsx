import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { breadcrumbLd, businessLd, pageHead } from '@/lib/seo'
import { site, mapsDirectionsUrl, mapsEmbedUrl, whatsappLink } from '@/data/site'
import { EMPTY_SETTINGS, type PublicSettings } from '@/lib/content-fns'
import GeneralEnquiryForm from '@/components/GeneralEnquiryForm'
import { FacebookIcon } from '@/components/FacebookOffers'
import { MailIcon, PageHeader, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export const Route = createFileRoute('/contact')({
  head: ({ matches }) => {
    const settings = (matches[0]?.loaderData as { settings?: PublicSettings } | undefined)?.settings ?? EMPTY_SETTINGS
    return pageHead({
      path: '/contact',
      matches,
      title: 'Contact Amila Car Sale — Vehicle Importer in Bandarawela | 075 454 3533',
      description: `Contact ${site.name}: call or WhatsApp ${site.phoneDisplay}, email ${site.email}, or visit our showroom at ${site.addressLine}. ${site.hoursDisplay}.`,
      jsonLd: [breadcrumbLd(CRUMBS), businessLd(settings)],
    })
  },
  component: ContactPage,
})

function Channel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card card-accent">
      <div style={{ color: 'var(--gold)', marginBottom: '0.75rem' }}>{icon}</div>
      <h2 className="h3">{title}</h2>
      {children}
    </div>
  )
}

function ContactPage() {
  const settings = (useLoaderData({ from: '__root__' }) as { settings?: PublicSettings })?.settings ?? EMPTY_SETTINGS
  return (
    <main id="main" style={{ minHeight: '100vh' }}>
      <PageHeader crumbs={CRUMBS} tag="We're here to help" title="Contact Amila Car Sale">
        <p className="lead">Vehicle enquiries, reservations, import requests and tax questions — reach us by phone, WhatsApp, email or visit the showroom in Bandarawela.</p>
      </PageHeader>

      <div className="container section">
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <Channel icon={<PhoneIcon size={26} />} title="Phone">
            <a href={`tel:${site.phoneIntl}`} data-track="contact" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', textDecoration: 'none', display: 'block' }}>{site.phoneDisplay}</a>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>{site.hoursDisplay}</div>
          </Channel>
          <Channel icon={<WhatsAppIcon size={26} />} title="WhatsApp">
            <p className="muted" style={{ fontSize: '0.88rem', margin: '0 0 0.9rem' }}>Fastest way to reach us — send photos, questions or a vehicle link.</p>
            <a href={whatsappLink(`Hello ${site.shortName}, I would like to enquire about a vehicle.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track="contact"><WhatsAppIcon /> Start chat</a>
          </Channel>
          <Channel icon={<MailIcon size={26} />} title="Email">
            <a href={`mailto:${site.email}`} style={{ color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>{site.email}</a>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>We reply within one business day.</div>
          </Channel>
          <Channel icon={<PinIcon size={26} />} title="Showroom">
            <address style={{ fontStyle: 'normal', color: 'var(--text-primary)', lineHeight: 1.6 }}>{site.name}<br />{site.addressLine}</address>
            <a href={settings.googleBusinessUrl || mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.85rem', display: 'inline-block', marginTop: '0.6rem' }}>Get directions →</a>
          </Channel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
          <GeneralEnquiryForm source="contact" heading="Send us a message" intro="Leave your details and we will get back to you — your message also opens in WhatsApp so you can send it instantly." />
          <div>
            <div style={{ border: '1px solid var(--border)', background: 'var(--dark-3)', aspectRatio: '4/3' }}>
              <iframe title={`Map of ${site.name}, Bandarawela`} src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: '100%', border: 0, display: 'block' }} />
            </div>
            <div className="card" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: '0.88rem' }}>New arrivals and offers are posted on Facebook first.</span>
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1877F2', color: '#fff', padding: '0.65rem 1rem', textDecoration: 'none', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <FacebookIcon size={14} /> {site.facebookLabel}
              </a>
            </div>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '1rem' }}>
              Looking for a specific car? <Link to="/import-from-japan" style={{ color: '#fff' }}>Request an import from Japan</Link> or <Link to="/vehicles" style={{ color: '#fff' }}>browse current stock</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
