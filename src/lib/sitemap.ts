import { canonicalUrl } from '@/data/site'
import { ARTICLES } from '@/data/articles'
import { BRAND_PAGES } from '@/data/brands'
import { isPlaceholderImage, vehicleFullName, vehiclePath, vehicleSeoStatus, type VehicleRow } from '@/lib/vehicle-utils'

export type SitemapEntry = { loc: string; lastmod?: string; changefreq?: string; priority?: number; images?: { loc: string; title: string }[] }

type PostLite = { slug: string; updatedAt: string }

const today = () => new Date().toISOString().slice(0, 10)

/** Single source of truth for the XML sitemap and the admin "Sitemap status" panel. */
export function buildSitemap(vehicles: VehicleRow[], posts: PostLite[]) {
  const newest = vehicles.reduce((m, v) => (v.updatedAt > m ? v.updatedAt : m), '').slice(0, 10) || today()
  const entries: SitemapEntry[] = [
    { loc: canonicalUrl('/'), lastmod: newest, changefreq: 'daily', priority: 1 },
    { loc: canonicalUrl('/vehicles'), lastmod: newest, changefreq: 'daily', priority: 0.9 },
    { loc: canonicalUrl('/tax-calculator'), changefreq: 'monthly', priority: 0.9 },
    { loc: canonicalUrl('/import-from-japan'), changefreq: 'monthly', priority: 0.8 },
    { loc: canonicalUrl('/brands'), changefreq: 'weekly', priority: 0.7 },
    ...BRAND_PAGES.map(b => ({ loc: canonicalUrl(`/brands/${b.slug}`), lastmod: newest, changefreq: 'weekly', priority: 0.7 })),
    { loc: canonicalUrl('/blog'), changefreq: 'weekly', priority: 0.6 },
    ...ARTICLES.map(a => ({ loc: canonicalUrl(`/blog/${a.slug}`), lastmod: a.updated, changefreq: 'monthly', priority: 0.6 })),
    ...posts.filter(p => !ARTICLES.some(a => a.slug === p.slug)).map(p => ({ loc: canonicalUrl(`/blog/${p.slug}`), lastmod: p.updatedAt.slice(0, 10), changefreq: 'monthly', priority: 0.5 })),
    { loc: canonicalUrl('/about'), changefreq: 'yearly', priority: 0.5 },
    { loc: canonicalUrl('/location'), changefreq: 'yearly', priority: 0.6 },
    { loc: canonicalUrl('/contact'), changefreq: 'yearly', priority: 0.6 },
  ]
  const excluded: { id: number; name: string; reasons: string[] }[] = []
  for (const v of vehicles) {
    const status = vehicleSeoStatus(v, vehicles)
    if (!status.indexable) {
      excluded.push({ id: v.id, name: vehicleFullName(v), reasons: status.reasons })
      continue
    }
    entries.push({
      loc: canonicalUrl(vehiclePath(v)),
      lastmod: v.updatedAt.slice(0, 10),
      changefreq: 'weekly',
      priority: 0.8,
      images: [v.image, ...v.gallery].filter(src => src && !isPlaceholderImage(src)).slice(0, 10).map(src => ({ loc: canonicalUrl(src), title: vehicleFullName(v) })),
    })
  }
  return { entries, excluded }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(e => {
      const parts = [`<loc>${esc(e.loc)}</loc>`]
      if (e.lastmod) parts.push(`<lastmod>${e.lastmod}</lastmod>`)
      if (e.changefreq) parts.push(`<changefreq>${e.changefreq}</changefreq>`)
      if (e.priority !== undefined) parts.push(`<priority>${e.priority.toFixed(1)}</priority>`)
      for (const img of e.images ?? []) parts.push(`<image:image><image:loc>${esc(img.loc)}</image:loc><image:title>${esc(img.title)}</image:title></image:image>`)
      return `  <url>${parts.join('')}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
}
