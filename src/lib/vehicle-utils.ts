import { site } from '@/data/site'

/** Shape of a vehicle as returned by the server functions (DB row, parsed). */
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
  gallery: string[]
  imageAlt: string
  seoTitle: string
  seoDescription: string
  visibility: string
  featured: boolean
  noindex: boolean
  condition: string
  manufactureDate: string
  auctionGrade: string
  chassisNumber: string
  updatedAt: string
}

export type NewVehicle = Omit<VehicleRow, 'id' | 'updatedAt'>

export const VEHICLE_DEFAULTS: Omit<NewVehicle, 'make' | 'model' | 'year' | 'type' | 'fuel' | 'mileage' | 'color' | 'transmission' | 'price'> = {
  engineCC: null,
  motorKW: null,
  image: '/placeholder.png',
  features: [],
  description: '',
  status: 'Available',
  grade: '',
  gallery: [],
  imageAlt: '',
  seoTitle: '',
  seoDescription: '',
  visibility: 'published',
  featured: false,
  noindex: false,
  condition: '',
  manufactureDate: '',
  auctionGrade: '',
  chassisNumber: '',
}

export const CONDITIONS = ['', 'Brand New', 'Unregistered (Reconditioned)', 'Registered (Used)']

/** Prices below this are treated as "not entered" (e.g. 0 or a typo such as 135). */
export const MIN_VALID_PRICE = 100_000

// ─────────────────────────── Names & display ───────────────────────────

/** Known spelling variants of manufacturer names found in stock data → display name. */
const MAKE_ALIASES: Record<string, string> = {
  TOYOTA: 'Toyota',
  HONDA: 'Honda',
  NISSAN: 'Nissan',
  SUZUKI: 'Suzuki',
  DAIHATSU: 'Daihatsu',
  MITSUBISHI: 'Mitsubishi',
  MITSUBSHI: 'Mitsubishi',
  MAZDA: 'Mazda',
  SUBARU: 'Subaru',
  LEXUS: 'Lexus',
  'ALFA ROMEO': 'Alfa Romeo',
  LANDROVER: 'Land Rover',
  'LAND ROVER': 'Land Rover',
  AUDI: 'Audi',
  'ROLLS ROYCE': 'Rolls-Royce',
  'ROLLS-ROYCE': 'Rolls-Royce',
  VOLKSWAGEN: 'Volkswagen',
  BMW: 'BMW',
  MERCEDES: 'Mercedes-Benz',
  'MERCEDES-BENZ': 'Mercedes-Benz',
  ISUZU: 'Isuzu',
  KIA: 'Kia',
  HYUNDAI: 'Hyundai',
}

const MISSPELT_MAKES = new Set(['MITSUBSHI', 'LANDROVER'])

/** Title-cases fully upper-case words longer than 3 letters ("YARIS CROSS" → "Yaris Cross"); keeps codes like RAV4, GT-R, EKX. */
export function tidyCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => (/^[A-Z]{4,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w))
    .join(' ')
}

export function displayMake(make: string): string {
  const key = make.trim().replace(/\s+/g, ' ').toUpperCase()
  return MAKE_ALIASES[key] ?? tidyCase(make)
}

export function displayModel(model: string): string {
  return tidyCase(model)
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function brandSlug(make: string): string {
  return slugify(displayMake(make))
}

/** "2024 Toyota Raize" */
export function vehicleName(v: Pick<VehicleRow, 'year' | 'make' | 'model'>): string {
  return `${v.year} ${displayMake(v.make)} ${displayModel(v.model)}`
}

/** "2024 Toyota Raize Z" — includes trim grade when present. */
export function vehicleFullName(v: Pick<VehicleRow, 'year' | 'make' | 'model' | 'grade'>): string {
  const grade = tidyCase(v.grade || '')
  const name = vehicleName(v)
  // Avoid "Raize Z Turbo Z Turbo" when the model text already includes the grade
  if (!grade || name.toLowerCase().endsWith(grade.toLowerCase())) return name
  return `${name} ${grade}`
}

/** SEO URL slug: /vehicles/toyota-raize-2025-32 — the trailing stock ID keeps every URL unique. */
export function vehicleSlug(v: Pick<VehicleRow, 'id' | 'year' | 'make' | 'model'>): string {
  return `${slugify(displayMake(v.make))}-${slugify(v.model)}-${v.year}-${v.id}`
}

export function vehiclePath(v: Pick<VehicleRow, 'id' | 'year' | 'make' | 'model'>): string {
  return `/vehicles/${vehicleSlug(v)}`
}

/** Extracts the stock ID from a slug (or accepts a bare numeric ID from old /marketplace/12 URLs). */
export function idFromSlug(slug: string): number | null {
  const m = slug.match(/(?:^|-)(\d+)$/)
  if (!m) return null
  const id = Number(m[1])
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

// ─────────────────────────── Price ───────────────────────────

export function hasValidPrice(v: Pick<VehicleRow, 'price'>): boolean {
  return Number.isFinite(v.price) && v.price >= MIN_VALID_PRICE
}

/** Below this a displayed price is flagged for admin review and kept out of structured data. */
export const SUSPICIOUS_PRICE = 2_000_000

export function isTrustedPrice(v: Pick<VehicleRow, 'price'>): boolean {
  return hasValidPrice(v) && v.price >= SUSPICIOUS_PRICE
}

/** Never returns "Rs. 0" — missing prices become "Price on Request". */
export function formatPrice(v: Pick<VehicleRow, 'price'>): string {
  return hasValidPrice(v) ? `Rs. ${v.price.toLocaleString('en-LK')}` : 'Price on Request'
}

// ─────────────────────────── Specs ───────────────────────────

export function hasEngineSpec(v: Pick<VehicleRow, 'engineCC' | 'motorKW'>): boolean {
  return (v.engineCC ?? 0) > 0 || (v.motorKW ?? 0) > 0
}

export function formatEngine(v: Pick<VehicleRow, 'engineCC' | 'motorKW'>): string {
  if ((v.engineCC ?? 0) > 0) return `${v.engineCC!.toLocaleString()} cc`
  if ((v.motorKW ?? 0) > 0) return `${v.motorKW} kW motor`
  return 'Not specified'
}

export function formatMileage(v: Pick<VehicleRow, 'mileage'>): string {
  return `${(v.mileage ?? 0).toLocaleString()} km`
}

export function isPlaceholderImage(src: string): boolean {
  return !src || /placeholder\.png$/i.test(src)
}

export function vehicleImages(v: Pick<VehicleRow, 'image' | 'gallery'>): string[] {
  const all = [v.image, ...(v.gallery ?? [])].filter(src => src && src.trim())
  return Array.from(new Set(all))
}

/** Descriptive ALT text — the admin can override it per vehicle. */
export function vehicleAlt(v: VehicleRow, index = 0): string {
  if (index === 0 && v.imageAlt.trim()) return v.imageAlt.trim()
  const color = v.color ? ` in ${tidyCase(v.color.toLowerCase())}` : ''
  const base = `${vehicleFullName(v)}${color} for sale at ${site.shortName}, Bandarawela`
  return index === 0 ? base : `${base} — photo ${index + 1}`
}

export function isBrandNewCondition(v: Pick<VehicleRow, 'condition'>): boolean {
  return /brand\s*new/i.test(v.condition)
}

// ─────────────────────────── SEO meta ───────────────────────────

export function vehicleSeoTitle(v: VehicleRow): string {
  if (v.seoTitle.trim()) return v.seoTitle.trim()
  return `${vehicleFullName(v)} for Sale in Sri Lanka | ${site.shortName}`
}

export function vehicleSeoDescription(v: VehicleRow): string {
  if (v.seoDescription.trim()) return v.seoDescription.trim()
  const parts = [
    `${vehicleFullName(v)}`,
    hasEngineSpec(v) ? formatEngine(v) : '',
    v.fuel,
    v.transmission,
    `${formatMileage(v)}`,
    v.color ? tidyCase(v.color.toLowerCase()) : '',
  ].filter(Boolean)
  const price = hasValidPrice(v) ? `${formatPrice(v)}.` : 'Price on request.'
  const status = v.status === 'Reserved' ? ' Currently reserved.' : v.status === 'Sold' ? ' Sold.' : ''
  return `${parts.join(', ')}. ${price}${status} Available at Amila Car Sale, Bandarawela — enquire on WhatsApp ${site.phoneDisplay}.`
}

// ─────────────────────────── Quality checks (admin) ───────────────────────────

export type VehicleIssue = { level: 'error' | 'warning'; message: string }

/** Missing or suspicious specifications — shown to admins, never auto-fixed. */
export function vehicleIssues(v: VehicleRow): VehicleIssue[] {
  const issues: VehicleIssue[] = []
  if (isPlaceholderImage(v.image)) issues.push({ level: 'error', message: 'No real photo (placeholder image)' })
  if (!hasValidPrice(v)) {
    if (v.price > 0) issues.push({ level: 'warning', message: `Price Rs. ${v.price.toLocaleString()} looks incomplete — shown as "Price on Request"` })
    else issues.push({ level: 'warning', message: 'No price — shown as "Price on Request"' })
  } else if (v.price < SUSPICIOUS_PRICE) {
    issues.push({ level: 'warning', message: `Price Rs. ${v.price.toLocaleString()} is unusually low — please double-check` })
  }
  if (!hasEngineSpec(v) && v.fuel !== 'Electric') issues.push({ level: 'error', message: 'Engine capacity missing' })
  if (!v.color.trim()) issues.push({ level: 'warning', message: 'Colour missing' })
  if (!v.grade.trim()) issues.push({ level: 'warning', message: 'Grade / trim missing' })
  if (!v.description.trim()) issues.push({ level: 'warning', message: 'No description' })
  if (!v.condition.trim()) issues.push({ level: 'warning', message: 'Condition not stated (Brand New / Reconditioned / Used)' })
  const currentYear = new Date().getFullYear()
  if (v.year < 1990 || v.year > currentYear + 1) issues.push({ level: 'error', message: `Year ${v.year} looks wrong` })
  if (v.year >= currentYear - 2 && v.mileage > 150_000) issues.push({ level: 'warning', message: `Mileage ${v.mileage.toLocaleString()} km is unusually high for a ${v.year} vehicle` })
  if (MISSPELT_MAKES.has(v.make.trim().toUpperCase())) {
    issues.push({ level: 'warning', message: `Make "${v.make.trim()}" looks misspelt — displayed as "${displayMake(v.make)}"` })
  }
  if (/\s{2,}|^\s|\s$/.test(v.grade) || /[.]{1,}\s*$/.test(v.grade.trim())) issues.push({ level: 'warning', message: 'Grade text has stray spaces or punctuation' })
  return issues
}

function dupKey(v: VehicleRow): string {
  return [displayMake(v.make).toLowerCase(), displayModel(v.model).toLowerCase().trim(), v.year, v.grade.trim().toLowerCase(), v.color.trim().toLowerCase(), v.mileage].join('|')
}

/**
 * Groups listings that look like the same car (same make, model, year, grade, colour and mileage).
 * Returns stockId → list of the other IDs in its group. Nothing is deleted automatically.
 */
export function findDuplicates(vehicles: VehicleRow[]): Map<number, number[]> {
  const groups = new Map<string, number[]>()
  for (const v of vehicles) {
    if (v.status === 'Sold') continue
    const key = dupKey(v)
    groups.set(key, [...(groups.get(key) ?? []), v.id])
  }
  const result = new Map<number, number[]>()
  for (const ids of groups.values()) {
    if (ids.length < 2) continue
    for (const id of ids) result.set(id, ids.filter(o => o !== id))
  }
  return result
}

/**
 * Picks which listing in a duplicate group stays indexable: the one with a real photo, then the lowest ID.
 */
function primaryOfGroup(ids: number[], byId: Map<number, VehicleRow>): number {
  const sorted = [...ids].sort((a, b) => {
    const pa = isPlaceholderImage(byId.get(a)?.image ?? '') ? 1 : 0
    const pb = isPlaceholderImage(byId.get(b)?.image ?? '') ? 1 : 0
    return pa - pb || a - b
  })
  return sorted[0]
}

export type SeoStatus = { indexable: boolean; reasons: string[] }

/** Decides whether a public vehicle page should be indexed and listed in the sitemap. */
export function vehicleSeoStatus(v: VehicleRow, all: VehicleRow[]): SeoStatus {
  const reasons: string[] = []
  if (v.visibility !== 'published') reasons.push('Draft — hidden from public')
  if (v.noindex) reasons.push('Manually set to noindex')
  if (v.status === 'Sold') reasons.push('Sold — kept for history, not indexed')
  if (isPlaceholderImage(v.image)) reasons.push('Incomplete — no real photo')
  if (!hasEngineSpec(v) && v.fuel !== 'Electric') reasons.push('Incomplete — engine capacity missing')
  const dups = findDuplicates(all).get(v.id)
  if (dups) {
    const byId = new Map(all.map(x => [x.id, x]))
    const primary = primaryOfGroup([v.id, ...dups], byId)
    if (primary !== v.id) reasons.push(`Possible duplicate of #${primary}`)
  }
  return { indexable: reasons.length === 0, reasons }
}

// ─────────────────────────── Images ───────────────────────────

/**
 * Routes an image through Netlify Image CDN (resized, WebP/AVIF by content negotiation).
 * Only local files and the showroom's Cloudinary account are allow-listed in netlify.toml.
 */
export function optimizedImage(src: string, width: number, height?: number): string {
  if (!src) return src
  const isLocal = src.startsWith('/') && !src.startsWith('//')
  const isAllowedRemote = /^https:\/\/res\.cloudinary\.com\//.test(src)
  if (!isLocal && !isAllowedRemote) return src
  if (/\.svg$/i.test(src)) return src
  const params = new URLSearchParams({ url: src, w: String(width) })
  if (height) {
    params.set('h', String(height))
    params.set('fit', 'cover')
  }
  params.set('q', '72')
  return `/.netlify/images?${params.toString()}`
}

export function imageSrcSet(src: string, widths: number[], ratio?: number): string {
  return widths.map(w => `${optimizedImage(src, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`).join(', ')
}
