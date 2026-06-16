import { defineQuery } from 'next-sanity'

// ============================================
// EVENTS LIST PAGE QUERIES (pagination, sidebar, detail)
// ============================================

/** Paginated events/announcements, newest first (incl. past). Params: $start, $end */
export const EVENTS_PAGINATED_QUERY = defineQuery(`
  *[_type == "event" && defined(startDate)] | order(startDate desc) [$start...$end] {
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

/** Total count of events (incl. past) */
export const EVENTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "event" && defined(startDate)])
`)

/** 10 most recent events for the sidebar */
export const EVENTS_RECENT_QUERY = defineQuery(`
  *[_type == "event" && defined(startDate)] | order(startDate desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    startDate,
    image
  }
`)

/** Single event by slug (detail page) */
export const EVENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    type,
    title,
    "slug": slug.current,
    startDate,
    activeUntil,
    location,
    tag,
    description,
    body,
    image
  }
`)
