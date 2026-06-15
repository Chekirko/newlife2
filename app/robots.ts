import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// ⚠️ PRE-LAUNCH: the whole site is closed to search engines on purpose.
// RE-OPEN at launch only when the user confirms — see
// context/progress-tracker.md → "Launch checklist". To open: replace the
// rule with `{ userAgent: '*', allow: '/', disallow: '/studio' }`.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
