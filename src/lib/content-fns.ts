import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb, requireAdmin } from '@/lib/server-utils'

// ─────────────────────────── Site settings ───────────────────────────

export type Testimonial = { name: string; text: string; source: string; date: string; url: string }
export type PageSeo = { title: string; description: string }

export type PublicSettings = {
  ga4Id: string
  gtmId: string
  googleVerification: string
  bingVerification: string
  googleBusinessUrl: string
  testimonials: Testimonial[]
  pageSeo: Record<string, PageSeo>
}

export const EMPTY_SETTINGS: PublicSettings = {
  ga4Id: '',
  gtmId: '',
  googleVerification: '',
  bingVerification: '',
  googleBusinessUrl: '',
  testimonials: [],
  pageSeo: {},
}

/** Pages whose title/description can be overridden from the admin dashboard. */
export const EDITABLE_PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'Homepage' },
  { path: '/vehicles', label: 'Vehicles for sale (marketplace)' },
  { path: '/tax-calculator', label: 'Vehicle import tax calculator' },
  { path: '/brands', label: 'Brands index' },
  { path: '/import-from-japan', label: 'Import from Japan service page' },
  { path: '/blog', label: 'Knowledge centre' },
  { path: '/about', label: 'About the company' },
  { path: '/location', label: 'Showroom location' },
  { path: '/contact', label: 'Contact' },
]

const settingsSchema = z.object({
  ga4Id: z.string().trim().regex(/^(G-[A-Z0-9]{4,20})?$/, 'GA4 ID must look like G-XXXXXXXXXX'),
  gtmId: z.string().trim().regex(/^(GTM-[A-Z0-9]{4,15})?$/, 'GTM ID must look like GTM-XXXXXXX'),
  googleVerification: z.string().trim().regex(/^[A-Za-z0-9_-]{0,120}$/, 'Paste only the content="…" value of the Google meta tag'),
  bingVerification: z.string().trim().regex(/^[A-Za-z0-9_-]{0,120}$/, 'Paste only the content="…" value of the Bing meta tag'),
  googleBusinessUrl: z
    .string()
    .trim()
    .max(500)
    .refine(u => !u || /^https:\/\/(www\.)?(google\.[a-z.]+|maps\.app\.goo\.gl|g\.page|goo\.gl|maps\.google\.[a-z.]+)\//.test(u), 'Must be a Google Maps / Business Profile link'),
  testimonials: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        text: z.string().trim().min(1).max(800),
        source: z.string().trim().max(60),
        date: z.string().trim().max(30),
        url: z.string().trim().max(500).refine(u => !u || /^https:\/\//.test(u), 'Link must start with https://'),
      }),
    )
    .max(30),
  pageSeo: z.record(z.string().max(100), z.object({ title: z.string().max(120), description: z.string().max(320) })),
})

const KEYS = Object.keys(EMPTY_SETTINGS) as (keyof PublicSettings)[]

async function readSettings(): Promise<PublicSettings> {
  try {
    const { db, schema } = await getDb()
    const rows = await db.select().from(schema.siteSettings)
    const out: PublicSettings = { ...EMPTY_SETTINGS, testimonials: [], pageSeo: {} }
    for (const row of rows as { key: string; value: string }[]) {
      if (!KEYS.includes(row.key as keyof PublicSettings)) continue
      if (row.key === 'testimonials' || row.key === 'pageSeo') {
        try {
          ;(out as Record<string, unknown>)[row.key] = JSON.parse(row.value)
        } catch { /* ignore corrupt value */ }
      } else {
        ;(out as Record<string, unknown>)[row.key] = row.value
      }
    }
    const parsed = settingsSchema.safeParse(out)
    return parsed.success ? parsed.data : EMPTY_SETTINGS
  } catch {
    return EMPTY_SETTINGS
  }
}

/** Public — every value here ends up in public HTML anyway (tag IDs, verification tokens). */
export const fetchPublicSettings = createServerFn({ method: 'GET' }).handler(async () => readSettings())

export const saveSettings = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; settings: PublicSettings }) => ({
    adminKey: z.string().max(500).parse(d.adminKey),
    settings: settingsSchema.parse(d.settings),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema } = await getDb()
    for (const key of KEYS) {
      const raw = data.settings[key]
      const value = typeof raw === 'string' ? raw : JSON.stringify(raw)
      await db
        .insert(schema.siteSettings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: new Date() } })
    }
    return readSettings()
  })

// ─────────────────────────── Blog posts (admin-authored) ───────────────────────────

export type BlogPostRow = {
  id: number
  slug: string
  title: string
  seoTitle: string
  description: string
  image: string
  imageAlt: string
  body: string
  author: string
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

function toPost(r: Record<string, any>): BlogPostRow {
  return {
    ...(r as BlogPostRow),
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
  }
}

export const fetchPublishedPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { db, schema, orm } = await getDb()
    const rows = await db
      .select()
      .from(schema.blogPosts)
      .where(orm.eq(schema.blogPosts.status, 'published'))
      .orderBy(orm.desc(schema.blogPosts.publishedAt))
    return rows.map(r => toPost(r as Record<string, any>))
  } catch {
    return [] as BlogPostRow[]
  }
})

export const fetchPostBySlug = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => ({ slug: z.string().max(200).parse(d.slug) }))
  .handler(async ({ data }) => {
    try {
      const { db, schema, orm } = await getDb()
      const [row] = await db
        .select()
        .from(schema.blogPosts)
        .where(orm.and(orm.eq(schema.blogPosts.slug, data.slug), orm.eq(schema.blogPosts.status, 'published')))
      return row ? toPost(row as Record<string, any>) : null
    } catch {
      return null
    }
  })

export const fetchAllPosts = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string }) => ({ adminKey: z.string().max(500).parse(d.adminKey) }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const rows = await db.select().from(schema.blogPosts).orderBy(orm.desc(schema.blogPosts.updatedAt))
    return rows.map(r => toPost(r as Record<string, any>))
  })

const postInput = z.object({
  id: z.number().int().positive().nullable(),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens only'),
  title: z.string().trim().min(5).max(160),
  seoTitle: z.string().trim().max(120),
  description: z.string().trim().max(320),
  image: z.string().trim().max(1000),
  imageAlt: z.string().trim().max(250),
  body: z.string().max(60_000),
  author: z.string().trim().max(120),
  status: z.enum(['draft', 'published']),
})

export type PostInput = z.infer<typeof postInput>

export const savePost = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; post: PostInput }) => ({
    adminKey: z.string().max(500).parse(d.adminKey),
    post: postInput.parse(d.post),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const { id, ...fields } = data.post
    const now = new Date()
    if (id) {
      const [existing] = await db.select().from(schema.blogPosts).where(orm.eq(schema.blogPosts.id, id))
      const publishedAt =
        fields.status === 'published' ? ((existing as { publishedAt: Date | null } | undefined)?.publishedAt ?? now) : null
      const [row] = await db
        .update(schema.blogPosts)
        .set({ ...fields, publishedAt, updatedAt: now })
        .where(orm.eq(schema.blogPosts.id, id))
        .returning()
      return toPost(row as Record<string, any>)
    }
    const [row] = await db
      .insert(schema.blogPosts)
      .values({ ...fields, publishedAt: fields.status === 'published' ? now : null, updatedAt: now })
      .returning()
    return toPost(row as Record<string, any>)
  })

export const deletePost = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number }) => ({
    adminKey: z.string().max(500).parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    await db.delete(schema.blogPosts).where(orm.eq(schema.blogPosts.id, data.id))
    return { success: true }
  })
