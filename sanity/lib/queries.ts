import { defineQuery } from 'next-sanity'

// ============================================
// SHARED QUERIES
// Used on multiple pages — keep centralized
// ============================================

/** All news ordered by publish date (newest first)
 *  Used on: Homepage (NewsSlider) + Ministry Detail (NewsSlider)
 */
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

/** Site-wide settings singleton (church NAP, schedule, socials, OG defaults)
 *  Used on: layout (header + footer), homepage (JSON-LD), contact page
 *  Read through `getSiteSettings()` in `lib/site-settings.ts`, which falls
 *  back to `lib/church.ts` for any empty field.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    name,
    legalName,
    city,
    email,
    phone,
    phoneDisplay,
    address,
    geo,
    social[]{ platform, url, label },
    services,
    defaultDescription
  }
`)
