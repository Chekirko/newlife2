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
