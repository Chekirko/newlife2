/**
 * Canonical public origin of the site (no trailing slash).
 *
 * Single source of truth for absolute URLs across the app:
 * `metadataBase`, sitemap, robots, and `item`/`url` fields in JSON-LD.
 *
 * Override per environment via `NEXT_PUBLIC_SITE_URL`
 * (e.g. set it in Vercel project settings for production/preview).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://newlife.church'
).replace(/\/+$/, '')
