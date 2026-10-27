'use server'

import { client } from '@/sanity/lib/client'
import { toMediaCard, toMatchQuery, type RawMediaItem } from '@/lib/media'
import { renderMediaCards, type MediaCardItem } from './components/MediaCard'
import type { ReactNode } from 'react'
import { MEDIA_SEARCH_QUERY, MEDIA_COUNT_QUERY, MEDIA_PER_PAGE } from './queries'

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
}: LoadMoreParams): Promise<{ cards: MediaCardItem[]; views: ReactNode[] }> {
  const raw = await client.fetch<RawMediaItem[]>(MEDIA_SEARCH_QUERY, {
    category: category || '',
    speaker: speaker || '',
    q: toMatchQuery(q),
    start,
    end: start + MEDIA_PER_PAGE,
  })
  const cards = raw.map(toMediaCard)
  return { cards, views: renderMediaCards(cards) }
}

// searchMedia — first page + total for a filter change (tab / speaker / search),
// fetched client-side so only the grid updates (no full-page navigation).
export interface SearchParams {
  category: string
  speaker: string
  q: string
}

export async function searchMedia({
  category,
  speaker,
  q,
}: SearchParams): Promise<{ cards: MediaCardItem[]; views: ReactNode[]; total: number }> {
  const params = {
    category: category || '',
    speaker: speaker || '',
    q: toMatchQuery(q),
  }
  const [raw, total] = await Promise.all([
    client.fetch<RawMediaItem[]>(MEDIA_SEARCH_QUERY, { ...params, start: 0, end: MEDIA_PER_PAGE }),
    client.fetch<number>(MEDIA_COUNT_QUERY, params),
  ])
  const cards = raw.map(toMediaCard)
  return { cards, views: renderMediaCards(cards), total }
}
