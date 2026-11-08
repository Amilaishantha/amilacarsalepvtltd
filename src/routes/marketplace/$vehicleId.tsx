import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { fetchVehicleById } from '@/lib/vehicle-fns'
import { idFromSlug, vehicleSlug } from '@/lib/vehicle-utils'

/**
 * Old numeric vehicle URLs (/marketplace/14) — permanently redirected to the SEO URL
 * (/vehicles/toyota-yaris-2025-14). Links already shared on WhatsApp/Facebook keep working.
 */
export const Route = createFileRoute('/marketplace/$vehicleId')({
  loader: async ({ params }) => {
    const id = idFromSlug(params.vehicleId)
    if (!id) throw notFound()
    const vehicle = await fetchVehicleById({ data: { id } })
    if (!vehicle) throw notFound()
    throw redirect({ to: '/vehicles/$slug', params: { slug: vehicleSlug(vehicle) }, statusCode: 301 })
  },
})
