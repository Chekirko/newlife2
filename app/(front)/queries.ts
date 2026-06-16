import { defineQuery } from 'next-sanity'

// ============================================
// HOMEPAGE QUERIES
// ============================================

/** Current events/announcements for the homepage slider (soonest first).
 *  "Current" = the deadline (activeUntil, else startDate) has not passed.
 *  Param: $now (ISO string). */
export const EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(startDate) && coalesce(activeUntil, startDate) >= $now]
    | order(startDate asc) {
    _id,
    type,
    title,
    "slug": slug.current,
    startDate,
    tag,
    description,
    image
  }
`)
