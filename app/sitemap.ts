import type { MetadataRoute } from 'next'
import { defineQuery } from 'next-sanity'
import { SITE_URL } from '@/lib/site'
import { isIndexingEnabled } from '@/lib/indexing'
import { LISTING_PER_PAGE, listingHref } from '@/lib/listing-params'
import { sanityFetch } from '@/sanity/lib/fetch'

const SITEMAP_QUERY = defineQuery(`{
  "news": *[_type == "news"] | order(publishedAt desc, _id asc){ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex },
  "ministries": *[_type == "ministry"]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex },
  "team": *[_type == "teamMember"]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex },
  "events": *[_type == "event"] | order(startDate desc, _id asc){ "slug": slug.current, _updatedAt, startDate, "noIndex": seo.noIndex },
  "settings": *[_type in ["siteSettings", "pageHeroes"]]{ _updatedAt },
  "homepage": *[_type == "homepage"]{ _updatedAt },
  "about": *[_type == "aboutPage"]{ _updatedAt },
  "media": *[_type == "mediaItem"]{ _updatedAt }
}`)

type UpdatedDoc = { _updatedAt: string | null }
type SlugDoc = UpdatedDoc & { slug: string | null; noIndex: boolean | null; startDate?: string | null }
type SitemapData = {
  news: SlugDoc[]; ministries: SlugDoc[]; team: SlugDoc[]; events: SlugDoc[]
  settings: UpdatedDoc[]; homepage: UpdatedDoc[]; about: UpdatedDoc[]; media: UpdatedDoc[]
}

function lastModified(docs: UpdatedDoc[]): Date | undefined {
  const dates = docs.flatMap(doc => doc._updatedAt && Number.isFinite(Date.parse(doc._updatedAt)) ? [Date.parse(doc._updatedAt)] : [])
  return dates.length ? new Date(Math.max(...dates)) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingEnabled()) return []
  const data = await sanityFetch<SitemapData>(SITEMAP_QUERY, {}, ['news','event','ministry','teamMember','mediaItem','siteSettings','pageHeroes','homepage','aboutPage'])
  const datedEvents = data.events.filter(event => event.startDate != null)
  const staticRoutes: [string, UpdatedDoc[]][] = [
    ['/', [...data.homepage, ...data.news, ...data.events, ...data.ministries, ...data.team, ...data.media]],
    ['/about', data.about], ['/history', []], ['/team', data.team], ['/ministries', data.ministries],
    ['/media/photos', data.ministries], ['/contact', []],
    ...(data.news.length ? [['/news', data.news] as [string, UpdatedDoc[]]] : []),
    ...(datedEvents.length ? [['/events', datedEvents] as [string, UpdatedDoc[]]] : []),
    ...(data.media.length ? [['/media', data.media] as [string, UpdatedDoc[]]] : []),
  ]
  const entries: MetadataRoute.Sitemap = staticRoutes.map(([path, docs]) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: lastModified([...data.settings, ...docs]),
  }))
  for (const [base, docs] of [['news', data.news], ['events', data.events], ['ministries', data.ministries], ['team', data.team]] as const) {
    for (const doc of docs) {
      if (doc.slug && !doc.noIndex) entries.push({
        url: `${SITE_URL}/${base}/${doc.slug}`,
        lastModified: lastModified([doc]),
      })
    }
  }
  for (const [kind, docs] of [['news', data.news], ['events', datedEvents]] as const) {
    for (let page = 2; page <= Math.ceil(docs.length / LISTING_PER_PAGE); page++) entries.push({
      url: `${SITE_URL}${listingHref(`/${kind}`, page)}`,
      lastModified: lastModified([...data.settings, ...docs.slice((page - 1) * LISTING_PER_PAGE, page * LISTING_PER_PAGE)]),
    })
  }
  return entries
}
