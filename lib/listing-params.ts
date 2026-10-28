import { notFound, redirect } from 'next/navigation'
export const LISTING_PER_PAGE = 6

export function listingHref(path: '/news' | '/events', page = 1, category = ''): string {
  const base = category ? `${path}/category/${encodeURIComponent(category)}` : path
  return page > 1 ? `${base}/page/${page}` : base
}

export function listingPageNumber(raw: string): number {
  const page = /^\d+$/.test(raw) ? Number(raw) : NaN
  if (!Number.isSafeInteger(page) || page < 1 || page > Math.floor(Number.MAX_SAFE_INTEGER / LISTING_PER_PAGE)) notFound()
  return page
}

export function parseListingPage(raw: string, path: '/news' | '/events', category = ''): number {
  const page = listingPageNumber(raw)
  if (page === 1 || raw !== String(page)) redirect(listingHref(path, page, category))
  return page
}
