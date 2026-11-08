import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { VEHICLE_DEFAULTS, type NewVehicle } from '@/lib/vehicle-utils'
import { devFallback, getDb, isAdmin, parseRow, requireAdmin } from '@/lib/server-utils'

export type { VehicleRow, NewVehicle } from '@/lib/vehicle-utils'

const adminKeySchema = z.string().max(500)

const vehicleInput = z.object({
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(120),
  year: z.number().int().min(1950).max(2100),
  type: z.string().trim().max(40),
  fuel: z.string().trim().max(40),
  engineCC: z.number().int().min(0).max(20000).nullable(),
  motorKW: z.number().int().min(0).max(2000).nullable(),
  mileage: z.number().int().min(0).max(2_000_000),
  color: z.string().trim().max(60),
  transmission: z.string().trim().max(40),
  price: z.number().int().min(0).max(10_000_000_000),
  image: z.string().trim().max(1000),
  features: z.array(z.string().trim().max(200)).max(60),
  description: z.string().max(5000),
  status: z.enum(['Available', 'Reserved', 'Sold']),
  grade: z.string().max(120),
  gallery: z.array(z.string().trim().max(1000)).max(30),
  imageAlt: z.string().max(250),
  seoTitle: z.string().max(120),
  seoDescription: z.string().max(320),
  visibility: z.enum(['published', 'draft']),
  featured: z.boolean(),
  noindex: z.boolean(),
  condition: z.string().max(60),
  manufactureDate: z.string().max(40),
  auctionGrade: z.string().max(20),
  chassisNumber: z.string().max(40),
})

function toDbValues(v: z.infer<typeof vehicleInput>) {
  return {
    ...v,
    features: JSON.stringify(v.features.filter(Boolean)),
    gallery: JSON.stringify(v.gallery.filter(Boolean)),
    updatedAt: new Date(),
  }
}

// ─────────────────────────── public vehicle reads ───────────────────────────

/** All published vehicles (drafts excluded). */
export const fetchVehicles = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { db, schema, orm } = await getDb()
    const rows = await db
      .select()
      .from(schema.vehicles)
      .where(orm.eq(schema.vehicles.visibility, 'published'))
      .orderBy(orm.desc(schema.vehicles.id))
    if (rows.length === 0) return devFallback()
    return rows.map(row => parseRow(row as Record<string, unknown>))
  } catch {
    return devFallback()
  }
})

export const fetchVehicleById = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: number }) => ({ id: z.number().int().positive().parse(d.id) }))
  .handler(async ({ data }) => {
    try {
      const { db, schema, orm } = await getDb()
      const [row] = await db.select().from(schema.vehicles).where(orm.eq(schema.vehicles.id, data.id))
      if (row && (row as { visibility: string }).visibility === 'published') return parseRow(row as Record<string, unknown>)
      if (row) return null
    } catch { /* fall through */ }
    return devFallback().find(v => v.id === data.id) ?? null
  })

// ─────────────────────────── admin: auth + vehicles ───────────────────────────

export const verifyAdminKey = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string }) => ({ adminKey: adminKeySchema.parse(d.adminKey) }))
  .handler(async ({ data }) => ({ valid: isAdmin(data.adminKey) }))

/** Every vehicle including drafts — admin only. */
export const fetchAdminVehicles = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string }) => ({ adminKey: adminKeySchema.parse(d.adminKey) }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const rows = await db.select().from(schema.vehicles).orderBy(orm.desc(schema.vehicles.id))
    return rows.map(row => parseRow(row as Record<string, unknown>))
  })

export const addVehicle = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; vehicle: NewVehicle }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    vehicle: vehicleInput.parse({ ...VEHICLE_DEFAULTS, ...d.vehicle }),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema } = await getDb()
    const [inserted] = await db.insert(schema.vehicles).values(toDbValues(data.vehicle)).returning()
    return parseRow(inserted as Record<string, unknown>)
  })

export const updateVehicle = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number; vehicle: NewVehicle }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
    vehicle: vehicleInput.parse(d.vehicle),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const [updated] = await db
      .update(schema.vehicles)
      .set(toDbValues(data.vehicle))
      .where(orm.eq(schema.vehicles.id, data.id))
      .returning()
    return parseRow(updated as Record<string, unknown>)
  })

export const deleteVehicle = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    await db.delete(schema.vehicles).where(orm.eq(schema.vehicles.id, data.id))
    return { success: true }
  })

export const updateVehicleStatus = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number; status: string }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
    status: z.enum(['Available', 'Reserved', 'Sold']).parse(d.status),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const [updated] = await db
      .update(schema.vehicles)
      .set({ status: data.status, updatedAt: new Date() })
      .where(orm.eq(schema.vehicles.id, data.id))
      .returning()
    return parseRow(updated as Record<string, unknown>)
  })

/** Quick toggles from the admin table (featured / draft / noindex). */
export const updateVehicleFlags = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number; featured?: boolean; visibility?: string; noindex?: boolean }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
    featured: z.boolean().optional().parse(d.featured),
    visibility: z.enum(['published', 'draft']).optional().parse(d.visibility),
    noindex: z.boolean().optional().parse(d.noindex),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    const patch: Record<string, unknown> = { updatedAt: new Date() }
    if (data.featured !== undefined) patch.featured = data.featured
    if (data.visibility !== undefined) patch.visibility = data.visibility
    if (data.noindex !== undefined) patch.noindex = data.noindex
    const [updated] = await db.update(schema.vehicles).set(patch).where(orm.eq(schema.vehicles.id, data.id)).returning()
    return parseRow(updated as Record<string, unknown>)
  })

// ─────────────────────────── enquiries ───────────────────────────

export type EnquiryRow = {
  id: number
  vehicleId: number | null
  vehicleTitle: string
  vehicleImage: string
  vehiclePrice: number | null
  customerName: string
  customerPhone: string
  customerMessage: string
  createdAt: string
  source: string
}

export type NewEnquiry = Omit<EnquiryRow, 'id' | 'createdAt' | 'source'> & {
  source?: string
  /** Honeypot — real visitors never fill this in. */
  website?: string
  /** Milliseconds the form was open before submitting (bots submit instantly). */
  elapsedMs?: number
}

const enquiryInput = z.object({
  vehicleId: z.number().int().positive().nullable(),
  vehicleTitle: z.string().max(300).default(''),
  vehicleImage: z.string().max(600).default(''),
  vehiclePrice: z.number().int().nullable(),
  customerName: z.string().trim().min(2, 'Please enter your name').max(120),
  customerPhone: z
    .string()
    .trim()
    .max(40)
    .refine(p => p.replace(/\D/g, '').length >= 9 && /^[+\d\s()-]+$/.test(p), 'Please enter a valid phone number'),
  customerMessage: z.string().trim().max(1500).default(''),
  source: z.enum(['vehicle', 'contact', 'tax-calculator', 'import-request']).default('vehicle'),
  website: z.string().max(200).optional(),
  elapsedMs: z.number().optional(),
})

export const saveEnquiry = createServerFn({ method: 'POST' })
  .inputValidator((d: NewEnquiry) => enquiryInput.parse(d))
  .handler(async ({ data }) => {
    // Spam traps: silently accept without storing so bots learn nothing.
    if ((data.website && data.website.trim()) || (data.elapsedMs !== undefined && data.elapsedMs < 2500)) {
      return { saved: false, id: null }
    }
    try {
      const { db, schema, orm } = await getDb()
      // Basic flood protection: at most 5 enquiries per phone number in 10 minutes.
      const since = new Date(Date.now() - 10 * 60 * 1000)
      const recent = await db
        .select({ id: schema.enquiries.id })
        .from(schema.enquiries)
        .where(orm.and(orm.eq(schema.enquiries.customerPhone, data.customerPhone), orm.gt(schema.enquiries.createdAt, since)))
      if (recent.length >= 5) return { saved: false, id: null }

      const [inserted] = await db
        .insert(schema.enquiries)
        .values({
          vehicleId: data.vehicleId,
          vehicleTitle: data.vehicleTitle,
          vehicleImage: data.vehicleImage,
          vehiclePrice: data.vehiclePrice,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerMessage: data.customerMessage,
          source: data.source,
        })
        .returning()
      return { saved: true, id: (inserted as { id: number }).id }
    } catch {
      // The customer's WhatsApp hand-off must never be blocked by a storage hiccup.
      return { saved: false, id: null }
    }
  })

export const fetchEnquiries = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string }) => ({ adminKey: adminKeySchema.parse(d.adminKey) }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    try {
      const { db, schema, orm } = await getDb()
      const rows = await db.select().from(schema.enquiries).orderBy(orm.desc(schema.enquiries.createdAt))
      return rows.map(row => ({
        ...(row as Omit<EnquiryRow, 'createdAt'>),
        createdAt: new Date((row as { createdAt: Date }).createdAt).toISOString(),
      })) as EnquiryRow[]
    } catch {
      return [] as EnquiryRow[]
    }
  })

export const deleteEnquiry = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number }) => ({
    adminKey: adminKeySchema.parse(d.adminKey),
    id: z.number().int().positive().parse(d.id),
  }))
  .handler(async ({ data }) => {
    requireAdmin(data.adminKey)
    const { db, schema, orm } = await getDb()
    await db.delete(schema.enquiries).where(orm.eq(schema.enquiries.id, data.id))
    return { success: true }
  })

