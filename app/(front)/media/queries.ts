import { defineQuery } from 'next-sanity'

// ============================================
// MEDIA LIBRARY QUERY
// All media items (broadcasts, sermons, songs, misc), newest first.
// Filtered client-side by category tabs on /media.
// ============================================

export const MEDIA_ALL_QUERY = defineQuery(`
  *[_type == "mediaItem"] | order(date desc) {
    _id,
    title,
    category,
    youtubeUrl,
    scripture,
    description,
    date,
    image,
    speaker
  }
`)
