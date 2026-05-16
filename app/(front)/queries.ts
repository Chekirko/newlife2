import { defineQuery } from 'next-sanity'

// ============================================
// HOMEPAGE QUERIES
// ============================================

/** All events for the events slider */
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
