import { createFileRoute } from '@tanstack/react-router'
import { getDb, parseRow } from '@/lib/server-utils'
import { buildSitemap, sitemapXml } from '@/lib/sitemap'
import type { VehicleRow } from '@/lib/vehicle-utils'

/** XML sitemap — generated live from published, indexable vehicles, brand pages and guides. */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let vehicles: VehicleRow[] = []
        let posts: { slug: string; updatedAt: string }[] = []
        try {
          const { db, schema, orm } = await getDb()
          const rows = await db.select().from(schema.vehicles).where(orm.eq(schema.vehicles.visibility, 'published'))
          vehicles = rows.map(r => parseRow(r as Record<string, unknown>))
          const p = await db
            .select({ slug: schema.blogPosts.slug, updatedAt: schema.blogPosts.updatedAt })
            .from(schema.blogPosts)
            .where(orm.eq(schema.blogPosts.status, 'published'))
          posts = p.map(x => ({ slug: x.slug, updatedAt: new Date(x.updatedAt).toISOString() }))
        } catch { /* still serve static pages */ }
        const { entries } = buildSitemap(vehicles, posts)
        return new Response(sitemapXml(entries), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
