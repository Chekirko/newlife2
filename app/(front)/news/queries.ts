import { defineQuery } from 'next-sanity'

// ============================================
// NEWS LIST PAGE QUERIES (pagination, sidebar)
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
