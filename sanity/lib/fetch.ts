import 'server-only'

import type { QueryParams } from 'next-sanity'
import { client } from './client'

export const SANITY_CACHE_TAGS = [
  'siteSettings', 'homepage', 'pageHeroes', 'aboutPage',
  'news', 'event', 'ministry', 'teamMember', 'mediaItem', 'sanity.imageAsset',
] as const

export type SanityCacheTag = (typeof SANITY_CACHE_TAGS)[number]

/** Include every document type read by the query, including dereferenced data. */
export function sanityFetch<T>(
  query: string,
  params: QueryParams,
  tags: SanityCacheTag[],
  revalidate: number | false = false,
): Promise<T> {
  return client.fetch<T>(query, params, {
    perspective: 'published',
    cache: 'force-cache',
    next: { tags: [...tags, 'sanity.imageAsset'], revalidate },
  })
}
