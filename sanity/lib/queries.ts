import { defineQuery } from 'next-sanity'

// ============================================
// SHARED QUERIES
// Used on multiple pages — keep centralized
// ============================================

/** All news ordered by publish date (newest first)
 *  Used on: Homepage (NewsSlider) + Ministry Detail (NewsSlider)
 */
export const NEWS_QUERY = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainCategory,
    categories,
    text,
    image
  }
`)
