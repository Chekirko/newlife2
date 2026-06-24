import { defineQuery } from 'next-sanity'

// ============================================
// PHOTOS GALLERY QUERY
// Aggregates every ministry gallery photo (single source of truth: the same
// `ministry.gallery` field shown on each ministry page). LQIP + dimensions are
// fetched for blur placeholders and lightbox sizing (Sanity image best practices).
// ============================================

export const MINISTRY_GALLERIES_QUERY = defineQuery(`
  *[_type == "ministry" && count(gallery) > 0] | order(order asc) {
    "ministry": title,
    gallery[]{
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  }
`)
