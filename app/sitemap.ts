import type { MetadataRoute } from 'next'
import { defineQuery } from 'next-sanity'
import { SITE_URL } from '@/lib/site'
import { isListingIndexable, isPageIndexable, STATIC_SEO_ROUTES } from '@/lib/seo-readiness'
import { LISTING_PER_PAGE, listingHref } from '@/lib/listing-params'
import { sanityFetch } from '@/sanity/lib/fetch'


const SITEMAP_QUERY = defineQuery(`{
  "news": *[_type == "news"] | order(publishedAt desc, _id asc){ _id, "slug": slug.current, _updatedAt },
  "ministries": *[_type == "ministry" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && defined(slug.current)]{ _id, "slug": slug.current, _updatedAt },
  "events": *[_type == "event"] | order(startDate desc, _id asc){ _id, "slug": slug.current, _updatedAt, startDate },
  "hasMedia": count(*[_type == "mediaItem"]) > 0
}`)

type SlugDoc = { _id: string; slug: string | null; _updatedAt: string | null; startDate?: string | null }
type SitemapData = { news: SlugDoc[]; ministries: SlugDoc[]; team: SlugDoc[]; events: SlugDoc[]; hasMedia: boolean }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<SitemapData>(SITEMAP_QUERY, {}, ['news','event','ministry','teamMember','mediaItem'])

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

  const paginationEntries: MetadataRoute.Sitemap = (['news', 'events'] as const).flatMap(kind => {
    const items = kind === 'events' ? data.events.filter(event => event.startDate != null) : data.news
    return Array.from({ length: Math.max(0, Math.ceil(items.length / LISTING_PER_PAGE) - 1) }, (_, i) => {
      const page = i + 2
      const path = listingHref(`/${kind}`, page)
      return isListingIndexable(path, items.slice((page - 1) * LISTING_PER_PAGE, page * LISTING_PER_PAGE))
        ? [{ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: 0.5 }]
        : []
    }).flat()
  })
  return [...new Map([...staticEntries, ...dynamicEntries, ...paginationEntries].map((entry) => [entry.url, entry])).values()]
}
