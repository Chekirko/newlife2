import type { MetadataRoute } from 'next'
import { defineQuery } from 'next-sanity'
import { SITE_URL } from '@/lib/site'
import { isPageIndexable, STATIC_SEO_ROUTES } from '@/lib/seo-readiness'
import { client } from '@/sanity/lib/client'

// Regenerate alongside ISR so approved published content appears automatically.
export const revalidate = 60

const SITEMAP_QUERY = defineQuery(`{
  "news": *[_type == "news" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "ministries": *[_type == "ministry" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "events": *[_type == "event" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt }
}`)

type SlugDoc = { _id: string; slug: string | null; _updatedAt: string | null }
type SitemapData = { news: SlugDoc[]; ministries: SlugDoc[]; team: SlugDoc[]; events: SlugDoc[] }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch<SitemapData>(SITEMAP_QUERY, {}, { perspective: 'published' })

  const staticEntries: MetadataRoute.Sitemap = STATIC_SEO_ROUTES.filter((route) => isPageIndexable(route)).map((route) => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...data.news.map((d) => ({ base: '/news', ...d })),
    ...data.ministries.map((d) => ({ base: '/ministries', ...d })),
    ...data.team.map((d) => ({ base: '/team', ...d })),
    ...data.events.map((d) => ({ base: '/events', ...d })),
  ]
    .filter((d) => d.slug && isPageIndexable(`${d.base}/${d.slug}`, d._id))
    .map((d) => ({
      url: `${SITE_URL}${d.base}/${d.slug}`,
      ...(d._updatedAt && Number.isFinite(Date.parse(d._updatedAt))
        ? { lastModified: new Date(d._updatedAt) } : {}),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...new Map([...staticEntries, ...dynamicEntries].map((entry) => [entry.url, entry])).values()]
}
