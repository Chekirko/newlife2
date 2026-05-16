import { defineQuery } from 'next-sanity'

// ============================================
// MINISTRIES LIST PAGE QUERIES
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
