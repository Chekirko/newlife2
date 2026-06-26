import { defineQuery } from 'next-sanity'

// ============================================
// MINISTRY DETAIL PAGE QUERIES
// ============================================

/** Single ministry by slug — full detail */
export const MINISTRY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "ministry" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    fullDescription[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } },
    image,
    leader->{
      _id,
      name,
      "slug": slug.current,
      photo
    },
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

/** News tagged with this ministry (by slug) — newest first. Params: $slug */
export const MINISTRY_NEWS_QUERY = defineQuery(`
  *[_type == "news" && $slug in ministries[]->slug.current] | order(publishedAt desc) {
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
