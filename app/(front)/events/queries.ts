import { defineQuery } from 'next-sanity'

// ============================================
// EVENTS LIST PAGE QUERIES (pagination, sidebar, detail)
// ============================================

/** Paginated events/announcements, newest first (incl. past). Params: $start, $end */
export const EVENTS_PAGINATED_QUERY = defineQuery(`
  *[_type == "event" && defined(startDate)] | order(startDate desc, _id asc) [$start...$end] {
    _id,
    type,
    title,
    "slug": slug.current,
    startDate,
    tag,
    description,
    image,
    "imageDimensions": image.asset->metadata.dimensions
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
    seo,
    type,
    title,
    "slug": slug.current,
    startDate,
    activeUntil,
    endDate,
    eventStatus,
    locationAddress,
    organizer,
    isAccessibleForFree,
    location,
    tag,
    description,
    body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } },
    image,
    "imageDimensions": image.asset->metadata.dimensions
  }
`)

export const EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)]{ "slug": slug.current }
`)
