import type { MetadataRoute } from 'next'
import { defineQuery } from 'next-sanity'
import { SITE_URL } from '@/lib/site'
import { isListingIndexable, isPageIndexable, STATIC_SEO_ROUTES } from '@/lib/seo-readiness'
import { LISTING_PER_PAGE } from '@/lib/listing-params'
import { client } from '@/sanity/lib/client'

// Regenerate alongside ISR so approved published content appears automatically.
export const revalidate = 60

const SITEMAP_QUERY = defineQuery(`{
  "news": *[_type == "news"] | order(publishedAt desc){ _id, "slug": slug.current, _updatedAt },
  "ministries": *[_type == "ministry" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "events": *[_type == "event"] | order(startDate desc){ _id, "slug": slug.current, _updatedAt, startDate },
  "hasMedia": count(*[_type == "mediaItem"]) > 0
}`)

type SlugDoc = { _id: string; slug: string | null; _updatedAt: string | null; startDate?: string | null }
type SitemapData = { news: SlugDoc[]; ministries: SlugDoc[]; team: SlugDoc[]; events: SlugDoc[]; hasMedia: boolean }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch<SitemapData>(SITEMAP_QUERY, {}, { perspective: 'published' })

  const staticEntries: MetadataRoute.Sitemap = STATIC_SEO_ROUTES.filter((route) => {
    if (route === '/news') return isListingIndexable(route, data.news.slice(0, LISTING_PER_PAGE))
    if (route === '/events') return isListingIndexable(route, data.events.filter((event) => event.startDate != null).slice(0, LISTING_PER_PAGE))
    if (route === '/media' && !data.hasMedia) return false
    return isPageIndexable(route)
  }).map((route) => ({
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
