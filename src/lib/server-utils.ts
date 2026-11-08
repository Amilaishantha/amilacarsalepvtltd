/**
 * Server-only helpers. Only import these from inside createServerFn handlers or server routes.
 */
import staticVehicles from '@/data/vehicles'
import { VEHICLE_DEFAULTS, type VehicleRow } from '@/lib/vehicle-utils'

// ─────────────────────────── helpers ───────────────────────────

export function safeJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  try {
    const parsed = JSON.parse(String(value ?? '[]'))
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function parseRow(row: Record<string, unknown>): VehicleRow {
  const r = row as Record<string, any>
  return {
    ...VEHICLE_DEFAULTS,
    ...(r as Omit<VehicleRow, 'features' | 'gallery' | 'updatedAt'>),
    features: safeJsonArray(r.features),
    gallery: safeJsonArray(r.gallery),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date(0).toISOString(),
  }
}

/** Demo stock from src/data/vehicles.ts — only used in local development when no database is reachable. */
export function devFallback(): VehicleRow[] {
  if (!import.meta.env.DEV) return []
  return staticVehicles.map(v => parseRow({ ...v, noindex: true } as unknown as Record<string, unknown>))
}

export async function getDb() {
  const { db } = await import('../../db/index.js')
  const schema = await import('../../db/schema.js')
  const orm = await import('drizzle-orm')
  return { db, schema, orm }
}

/** Constant-time comparison; an unset ADMIN_KEY never authorises anyone. */
export function isAdmin(key: unknown): boolean {
  const expected = process.env.ADMIN_KEY ?? ''
  if (!expected || typeof key !== 'string' || key.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ key.charCodeAt(i)
  return diff === 0
}

export function requireAdmin(key: unknown) {
  if (!isAdmin(key)) throw new Error('Unauthorized')
}

