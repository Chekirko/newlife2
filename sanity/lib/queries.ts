import { defineQuery } from 'next-sanity'

// ============================================
// MINISTRY QUERIES
// ============================================

/** All ministries ordered by sort order */
export const MINISTRIES_QUERY = defineQuery(`
  *[_type == "ministry"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    order
  }
`)

/** Single ministry by slug — full detail */
export const MINISTRY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "ministry" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    fullDescription,
    image,
    leaderName,
    leaderPhoto,
    gallery,
    bibleQuoteText,
    bibleQuoteReference,
    order
  }
`)

/** All ministry slugs — for generateStaticParams */
export const MINISTRY_SLUGS_QUERY = defineQuery(`
  *[_type == "ministry"] { "slug": slug.current }
`)

/** All ministries except one (for sidebar) */
export const OTHER_MINISTRIES_QUERY = defineQuery(`
  *[_type == "ministry" && slug.current != $slug] | order(order asc) {
    _id,
    title,
    "slug": slug.current
  }
`)

// ============================================
// NEWS QUERIES
// ============================================

/** All news ordered by publish date (newest first) */
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
// ============================================
// NEWS PAGE QUERIES (pagination, sidebar)
// ============================================

/** Paginated news (optional category filter). Params: $start, $end, $category (nullable) */
export const NEWS_PAGINATED_QUERY = defineQuery(`
  *[_type == "news" && select(
    defined($category) && $category != "" => mainCategory == $category,
    true
  )] | order(publishedAt desc) [$start...$end] {
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

/** Count of news (optional category filter). Params: $category (nullable) */
export const NEWS_COUNT_QUERY = defineQuery(`
  count(*[_type == "news" && select(
    defined($category) && $category != "" => mainCategory == $category,
    true
  )])
`)

/** 10 most recent news for sidebar (no filter) */
export const NEWS_RECENT_QUERY = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    image
  }
`)

/** All unique mainCategory values */
export const NEWS_CATEGORIES_QUERY = defineQuery(`
  array::unique(*[_type == "news" && defined(mainCategory)].mainCategory)
`)

// ============================================
// EVENT QUERIES
// ============================================

/** All events */
export const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    tag,
    description,
    image
  }
`)
