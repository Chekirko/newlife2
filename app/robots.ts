import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { isIndexingEnabled } from '@/lib/indexing'

export default function robots(): MetadataRoute.Robots {
  const enabled = isIndexingEnabled()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      ...(enabled ? { disallow: '/studio' } : {}),
    },
    ...(enabled ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  }
}
