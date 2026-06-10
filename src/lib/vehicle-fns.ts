import { createServerFn } from '@tanstack/react-start'
import staticVehicles from '@/data/vehicles'

export type VehicleRow = {
  id: number
  make: string
  model: string
  year: number
  type: string
  fuel: string
  engineCC: number | null
  motorKW: number | null
  mileage: number
  color: string
  transmission: string
  price: number
  image: string
  features: string[]
  description: string
  status: string
  grade: string
}

export type NewVehicle = Omit<VehicleRow, 'id'>

function parseRow(row: Record<string, unknown>): VehicleRow {
  return {
    ...(row as Omit<VehicleRow, 'features'>),
    features: JSON.parse(row.features as string) as string[],
  }
}

export const fetchVehicles = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { db } = await import('../../db/index.js')
    const { vehicles: vehiclesTable } = await import('../../db/schema.js')
    const rows = await db.select().from(vehiclesTable)
    if (rows.length === 0) return staticVehicles as VehicleRow[]
    return rows.map(row => parseRow(row as Record<string, unknown>))
  } catch {
    return staticVehicles as VehicleRow[]
  }
})

export const fetchVehicleById = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    const { id } = data
    try {
      const { db } = await import('../../db/index.js')
      const { vehicles: vehiclesTable } = await import('../../db/schema.js')
      const { eq } = await import('drizzle-orm')
      const [row] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id))
      if (row) return parseRow(row as Record<string, unknown>)
    } catch { /* fall through */ }
    return (staticVehicles.find(v => v.id === id) as VehicleRow | undefined) ?? null
  })

export const verifyAdminKey = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string }) => d)
  .handler(async ({ data }) => {
    const valid = data.adminKey === (process.env.ADMIN_KEY ?? '')
    return { valid }
  })

export const addVehicle = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; vehicle: NewVehicle }) => d)
  .handler(async ({ data }) => {
    if (data.adminKey !== (process.env.ADMIN_KEY ?? '')) throw new Error('Unauthorized')
    const { db } = await import('../../db/index.js')
    const { vehicles: vehiclesTable } = await import('../../db/schema.js')
    const [inserted] = await db
      .insert(vehiclesTable)
      .values({ ...data.vehicle, features: JSON.stringify(data.vehicle.features) })
      .returning()
    return parseRow(inserted as Record<string, unknown>)
  })

export const deleteVehicle = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number }) => d)
  .handler(async ({ data }) => {
    if (data.adminKey !== (process.env.ADMIN_KEY ?? '')) throw new Error('Unauthorized')
    const { db } = await import('../../db/index.js')
    const { vehicles: vehiclesTable } = await import('../../db/schema.js')
    const { eq } = await import('drizzle-orm')
    await db.delete(vehiclesTable).where(eq(vehiclesTable.id, data.id))
    return { success: true }
  })

export const updateVehicleStatus = createServerFn({ method: 'POST' })
  .inputValidator((d: { adminKey: string; id: number; status: string }) => d)
  .handler(async ({ data }) => {
    if (data.adminKey !== (process.env.ADMIN_KEY ?? '')) throw new Error('Unauthorized')
    const { db } = await import('../../db/index.js')
    const { vehicles: vehiclesTable } = await import('../../db/schema.js')
    const { eq } = await import('drizzle-orm')
    const [updated] = await db
      .update(vehiclesTable)
      .set({ status: data.status })
      .where(eq(vehiclesTable.id, data.id))
      .returning()
    return parseRow(updated as Record<string, unknown>)
  })
