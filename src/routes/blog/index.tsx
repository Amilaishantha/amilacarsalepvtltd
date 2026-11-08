import { createFileRoute, Link } from '@tanstack/react-router'
import { ARTICLES } from '@/data/articles'
import { fetchPublishedPosts, type BlogPostRow } from '@/lib/content-fns'
import { breadcrumbLd, pageHead } from '@/lib/seo'
import { PageHeader, SmartImage } from '@/components/ui'
import { site } from '@/data/site'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Knowledge centre', path: '/blog' },
]

type Card = { slug: string; title: string; description: string; image: string; imageAlt: string; category: string; date: string }

export const Route = createFileRoute('/blog/')({
  loader: () => fetchPublishedPosts(),
  head: ({ matches }) =>
    pageHead({
      path: '/blog',
      matches,
      title: 'Vehicle Import Guides & Car Buying Advice Sri Lanka | Amila Car Sale',
      description:
        'Guides to importing cars from Japan to Sri Lanka, vehicle import tax, CIF value, auction grades, model buying guides and reservation advice from Amila Car Sale Pvt Ltd.',
      jsonLd: [breadcrumbLd(CRUMBS)],
    }),
  component: BlogIndex,
})

function BlogIndex() {
  const posts = Route.useLoaderData() as BlogPostRow[]
  const builtIn = new Set(ARTICLES.map(a => a.slug))
  const cards: Card[] = [
    ...posts
      .filter(p => !builtIn.has(p.slug))
      .map(p => ({ slug: p.slug, title: p.title, description: p.description, image: p.image || site.ogImage, imageAlt: p.imageAlt || p.title, category: 'News', date: (p.publishedAt ?? p.createdAt).slice(0, 10) })),
    ...ARTICLES.map(a => ({ slug: a.slug, title: a.title, description: a.description, image: a.image, imageAlt: a.imageAlt, category: a.category, date: a.updated })),
  ]

  return (
    <main id="main">
      <PageHeader crumbs={CRUMBS} tag="Knowledge centre" title="Vehicle Import Guides & Buying Advice">
        <p className="lead">Practical, plain-language guides for Sri Lankan buyers — from importing a car from Japan and understanding import tax to reading auction sheets and choosing the right model.</p>
      </PageHeader>
      <section className="container section">
        <h2 className="sr-only">All guides</h2>
        <div className="grid-cards">
          {cards.map((c, i) => (
            <Link key={c.slug} to="/blog/$slug" params={{ slug: c.slug }} className="vehicle-card">
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--dark-3)' }}>
                <SmartImage src={c.image} alt={c.imageAlt} ratio={16 / 9} priority={i < 2} />
              </div>
              <div style={{ padding: '1.2rem 1.3rem 1.4rem' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>{c.category}</div>
                <h3 className="h3" style={{ fontSize: '1.05rem', lineHeight: 1.35 }}>{c.title}</h3>
                <p className="muted" style={{ fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{c.description}</p>
                <time dateTime={c.date} style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Updated {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
