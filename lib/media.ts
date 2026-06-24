import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import type { MediaCardItem } from '@/app/(front)/media/components/MediaCard'

// =========================================
// Shared media transform — raw `mediaItem` (from MEDIA_SEARCH_QUERY) → MediaCardItem.
// Resolves the YouTube id + cover thumbnail (Sanity image, else YouTube frame).
// Used by both the /media page (first batch) and the loadMoreMedia server action,
// so the two stay in sync. Pure, no side effects.
// =========================================

export interface RawMediaItem {
  _id: string
  title: string | null
  category: string | null
  youtubeUrl: string | null
  scripture: string | null
  description: string | null
  date: string | null
  image: SanityImageSource | null
  speaker: string | null
  tags: string[] | null
}

/**
 * Turn a raw search box value into a GROQ `match` argument: each word becomes a
 * prefix token ("love grace" → "love* grace*") so partial typing matches. Empty
 * input returns '' — the queries treat '' as "no text filter".
 */
export function toMatchQuery(q: string | undefined | null): string {
  if (!q) return ''
  return q
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => `${w}*`)
    .join(' ')
}

export function toMediaCard(m: RawMediaItem): MediaCardItem {
  const youtubeId = getYouTubeId(m.youtubeUrl)
  const thumbnailUrl = m.image
    ? urlFor(m.image).width(800).height(450).url()
    : youtubeId
      ? getYouTubeThumbnail(youtubeId)
      : '/images/placeholder.jpg'
  return {
    _id: m._id,
    title: m.title ?? 'Без назви',
    category: m.category ?? 'різне',
    youtubeId,
    thumbnailUrl,
    date: m.date ? formatDate(m.date) : '',
    speaker: m.speaker ?? null,
    scripture: m.scripture ?? null,
    description: m.description ?? null,
    tags: m.tags ?? null,
  }
}
