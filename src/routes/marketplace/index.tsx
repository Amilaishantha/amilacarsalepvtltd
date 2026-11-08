import { createFileRoute, redirect } from '@tanstack/react-router'

/** Old marketplace URL — permanently redirected to /vehicles (query string preserved). */
export const Route = createFileRoute('/marketplace/')({
  beforeLoad: ({ search }) => {
    throw redirect({ to: '/vehicles', search: search as Record<string, unknown>, statusCode: 301 })
  },
})
