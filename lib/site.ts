/**
 * Canonical public origin of the site (no trailing slash).
 *
 * Single source of truth for absolute URLs across the app:
 * `metadataBase`, sitemap, robots, and `item`/`url` fields in JSON-LD.
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` — explicit override (set once a custom domain exists).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — the stable Vercel production host
 *    (e.g. `newlife2.vercel.app`). Auto-upgrades to the custom domain once attached.
 * 3. `https://newlife.church` — last-resort default for local / non-Vercel builds.
 *
 * Note: only consumed in Server Components (layout metadata, JSON-LD), so the
 * server-only `VERCEL_PROJECT_PRODUCTION_URL` is safe to read here.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://newlife.church')
).replace(/\/+$/, '')
