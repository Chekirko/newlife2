import { defineQuery } from 'next-sanity'

// ============================================
// HOMEPAGE QUERIES
// ============================================

/** Current events/announcements for the homepage slider (soonest first).
 *  "Current" differs by type:
 *   - "подія" (event): visible through the end of its own day (startDate >= $today).
 *   - "оголошення" (announcement): visible until its deadline (activeUntil, else startDate) >= $now.
 *  Params: $now (ISO instant) and $today (ISO start-of-today). */
export const EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(startDate) && (
    (type == "подія" && startDate >= $today) ||
    (type != "подія" && coalesce(activeUntil, startDate) >= $now)
  )]
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
