'use server'

import { client } from '@/sanity/lib/client'
import { toMediaCard, toMatchQuery, type RawMediaItem } from '@/lib/media'
import type { MediaCardItem } from './components/MediaCard'
import { MEDIA_SEARCH_QUERY, MEDIA_PER_PAGE } from './queries'

// =========================================
// loadMoreMedia — "Load More" server action. Fetches the next batch for the
// current filters (category / speaker / search) starting at `start`, transforms
// it to MediaCardItem and returns it for the client to append. Slice pagination
// mirrors /news and /events; fine for the realistic scale (hundreds–low thousands).
// =========================================

export interface LoadMoreParams {
  category: string
  speaker: string
  q: string
  start: number
}

export async function loadMoreMedia({
  category,
  speaker,
  q,
  start,
}: LoadMoreParams): Promise<MediaCardItem[]> {
  const raw = await client.fetch<RawMediaItem[]>(MEDIA_SEARCH_QUERY, {
    category: category || '',
    speaker: speaker || '',
    q: toMatchQuery(q),
    start,
    end: start + MEDIA_PER_PAGE,
  })
  return raw.map(toMediaCard)
}
