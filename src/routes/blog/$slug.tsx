import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ARTICLES, findArticle, type Source } from '@/data/articles'
import { fetchPostBySlug } from '@/lib/content-fns'
import { fetchVehicles } from '@/lib/vehicle-fns'
import { articleLd, breadcrumbLd, pageHead } from '@/lib/seo'
import Markdown, { readingMinutes } from '@/components/Markdown'
import { Breadcrumbs, SmartImage, VehicleGrid, WhatsAppIcon } from '@/components/ui'
import { site, whatsappLink } from '@/data/site'
import { displayModel, type VehicleRow } from '@/lib/vehicle-utils'

type ArticleView = {
  slug: string
  title: string
  seoTitle: string
  description: string
  image: string
  imageAlt: string
  author: string
  published: string
  updated: string
  category: string
  sources: Source[]
  body: string
}

/** Model guides show matching real stock underneath. */
const RELATED_MODELS: Record<string, string[]> = {
  'toyota-raize-price-and-specifications-sri-lanka': ['raize'],
  'honda-vezel-specifications-and-buying-guide': ['vezel'],
  'toyota-yaris-cross-vs-toyota-raize': ['yaris cross', 'raize'],
}

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    let article: ArticleView | null = findArticle(params.slug) ?? null
    if (!article) {
      const post = await fetchPostBySlug({ data: { slug: params.slug } })
      if (post)
        article = {
          slug: post.slug,
          title: post.title,
          seoTitle: post.seoTitle || post.title,
          description: post.description,
          image: post.image || site.ogImage,
          imageAlt: post.imageAlt || post.title,
          author: post.author || site.name,
          published: (post.publishedAt ?? post.createdAt).slice(0, 10),
          updated: post.updatedAt.slice(0, 10),
          category: 'News',
          sources: [],
          body: post.body,
        }
    }
    if (!article) throw notFound()
    const models = RELATED_MODELS[article.slug]
    let related: VehicleRow[] = []
    if (models) {
      const all = await fetchVehicles()
      related = all.filter(v => v.status !== 'Sold' && models.some(m => displayModel(v.model).toLowerCase() === m)).slice(0, 6)
    }
    return { article, related }
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) return {}
    const a = loaderData.article
    const path = `/blog/${a.slug}`
    return pageHead({
      path,
      matches,
      title: `${a.seoTitle} | Amila Car Sale`,
      description: a.description,
      image: a.image,
      imageAlt: a.imageAlt,
      type: 'article',
      jsonLd: [
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Knowledge centre', path: '/blog' }, { name: a.title, path }]),
        articleLd({ path, title: a.title, description: a.description, image: a.image, author: a.author, published: a.published, modified: a.updated }),
      ],
      extraMeta: [
        { property: 'article:published_time', content: a.published },
        { property: 'article:modified_time', content: a.updated },
      ],
    })
  },
  component: ArticlePage,
})

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function ArticlePage() {
  const { article: a, related } = Route.useLoaderData() as { article: ArticleView; related: VehicleRow[] }
  const more = ARTICLES.filter(x => x.slug !== a.slug).slice(0, 4)
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Knowledge centre', path: '/blog' }, { name: a.title, path: `/blog/${a.slug}` }]

  return (
    <main id="main">
      <article>
        <header className="page-header">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '1.25rem' }}><Breadcrumbs items={crumbs} /></div>
            <div className="section-tag" style={{ marginBottom: '0.75rem' }}>{a.category}</div>
            <h1 className="h1" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.7rem)' }}>{a.title}</h1>
            <p className="lead" style={{ marginBottom: '1rem' }}>{a.description}</p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.25rem' }}>
              <span>By <Link to="/about" style={{ color: 'var(--text-muted)' }}>{a.author}</Link></span>
              <span>Published <time dateTime={a.published}>{fmt(a.published)}</time></span>
              <span>Updated <time dateTime={a.updated}>{fmt(a.updated)}</time></span>
              <span>{readingMinutes(a.body)} min read</span>
            </div>
          </div>
        </header>

        <div className="container" style={{ maxWidth: '900px', paddingTop: '2rem', paddingBottom: '3rem' }}>
          <figure style={{ margin: '0 0 2rem', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--dark-3)' }}>
            <SmartImage src={a.image} alt={a.imageAlt} ratio={16 / 9} priority widths={[480, 800, 1200]} sizes="(max-width: 900px) 100vw, 860px" />
          </figure>

          <Markdown source={a.body} />

          {a.sources.length > 0 && (
            <aside aria-labelledby="src-h" className="card" style={{ marginTop: '2.5rem' }}>
              <h2 id="src-h" className="h3">Official sources & further reading</h2>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.9 }}>
                {a.sources.map(s => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>{s.label}</a></li>
                ))}
              </ul>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0.9rem 0 0' }}>
                Tax rates and import rules change through Gazette notifications. This guide is general information, not legal or tax advice.
              </p>
            </aside>
          )}

          <div className="card card-accent" style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Questions about importing a vehicle?</div>
              <div className="muted" style={{ fontSize: '0.88rem' }}>Talk to {site.name} — {site.phoneDisplay}</div>
            </div>
            <a href={whatsappLink(`Hello ${site.shortName}, I read your guide "${a.title}" and have a question.`)} target="_blank" rel="noopener noreferrer" className="btn-wa" data-track="article">
              <WhatsAppIcon /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container" style={{ paddingBottom: '3rem' }} aria-labelledby="rel-h">
          <h2 id="rel-h" className="h2">Matching vehicles in stock</h2>
          <VehicleGrid vehicles={related} />
        </section>
      )}

      <section className="section-alt section" aria-labelledby="more-h">
        <div className="container">
          <h2 id="more-h" className="h2">More guides</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.75rem' }}>
            {more.map(m => (
              <li key={m.slug}>
                <Link to="/blog/$slug" params={{ slug: m.slug }} className="chip" style={{ display: 'block', padding: '1rem 1.1rem', height: '100%' }}>{m.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
