import type { MetadataRoute } from 'next'
import { defineQuery } from 'next-sanity'
import { SITE_URL } from '@/lib/site'
import { client } from '@/sanity/lib/client'

// Regenerate alongside ISR so new CMS content appears in the sitemap.
export const revalidate = 60

// Static routes that hold real, indexable content.
// NOTE: /about, /media, /privacy are intentionally excluded while they are
// `noindex` placeholders — add them here once they become real pages.
const STATIC_ROUTES = ['', '/history', '/team', '/ministries', '/news', '/events', '/contact'] as const

const SITEMAP_QUERY = defineQuery(`{
  "news": *[_type == "news" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "ministries": *[_type == "ministry" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "events": *[_type == "event" && defined(slug.current) && defined(startDate)]{ "slug": slug.current, _updatedAt }
}`)

type SlugDoc = { slug: string | null; _updatedAt: string }
type SitemapData = { news: SlugDoc[]; ministries: SlugDoc[]; team: SlugDoc[]; events: SlugDoc[] }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch<SitemapData>(SITEMAP_QUERY)
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...data.news.map((d) => ({ base: '/news', ...d })),
    ...data.ministries.map((d) => ({ base: '/ministries', ...d })),
    ...data.team.map((d) => ({ base: '/team', ...d })),
    ...data.events.map((d) => ({ base: '/events', ...d })),
  ]
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${SITE_URL}${d.base}/${d.slug}`,
      lastModified: d._updatedAt ? new Date(d._updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...staticEntries, ...dynamicEntries]
}
