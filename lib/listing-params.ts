import { redirect } from 'next/navigation'

export type ListingSearchParams = Record<string, string | string[] | undefined>
export const LISTING_PER_PAGE = 6

/** Repeated filters are ambiguous; keep only nonempty scalar values. */
export function readFilter(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeListingParams(
  path: '/news' | '/events' | '/media',
  params: ListingSearchParams,
  perPage = LISTING_PER_PAGE,
) {
  const keys = path === '/media' ? ['category', 'speaker', 'q'] : path === '/news' ? ['category'] : []
  const filters: Record<string, string> = Object.fromEntries(keys.map((key) => [key, readFilter(params[key])]))
  const query = new URLSearchParams()
  let needsRedirect = keys.some((key) => params[key] !== undefined && params[key] !== (filters[key] || undefined))

  const rawPage = params.page
  const parsedPage = typeof rawPage === 'string' && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN
  const validPage = Number.isSafeInteger(parsedPage) && parsedPage > 0 &&
    parsedPage <= Math.floor(Number.MAX_SAFE_INTEGER / perPage)
  const page = path !== '/media' && validPage ? parsedPage : 1
  if (rawPage !== undefined && (path === '/media' || rawPage !== (page > 1 ? String(page) : undefined))) needsRedirect = true

  if (page > 1) query.set('page', String(page))
  for (const key of keys) if (filters[key]) query.set(key, filters[key])
  const suffix = query.toString()
  const normalizedPath = `${path}${suffix ? `?${suffix}` : ''}`
  if (needsRedirect) redirect(normalizedPath)

  const filtered = keys.some((key) => !!filters[key])
  return {
    page,
    filters,
    filtered,
    canonical: filtered || page === 1 ? path : `${path}?page=${page}`,
  }
}
