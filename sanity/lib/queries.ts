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
    "ministry": ministries[0]->title,
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
    services[]{ label, day, time, endTime },
    liveStream{ channelId, label },
    defaultDescription
  }
`)

/** Page heroes singleton (editable hero background images for section pages)
 *  Used on: /news + /news/[slug] (newsHero), /events + /events/[slug] (eventsHero).
 *  Read through `getPageHeroes()` in `lib/page-heroes.ts`, which falls back to
 *  the static `/public/images` files when a field is empty.
 */
export const PAGE_HEROES_QUERY = defineQuery(`
  *[_type == "pageHeroes"][0]{
    newsHero,
    eventsHero,
    ministriesHero,
    teamHero,
    historyHero,
    contactHero,
    aboutHero,
    mediaHero,
    privacyHero
  }
`)

/** Homepage singleton (editable homepage content; hero slider for now)
 *  Used on: homepage. Read through `getHomepage()` in `lib/homepage.ts`,
 *  which falls back to `lib/homepage.ts` defaults when the array is empty.
 */
export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage"][0]{
    featuredSermon->{
      _id, title, category, youtubeUrl, scripture, description, date, image, speaker, tags
    },
    heroSlides[]{
      preTitle,
      title,
      subtitle,
      buttonText,
      buttonHref,
      secondaryButtonText,
      secondaryButtonHref,
      align,
      image
    },
    testimonials[]{
      quote,
      name,
      position,
      rating,
      avatar
    },
    faq[]{
      question,
      answer
    },
    whatYouFind[]{
      icon,
      title,
      description,
      image
    }
  }
`)

/** About page singleton (editable /about content — headings + content).
 *  Used on: /about. Read through `getAboutPage()` in `lib/about.ts`, which
 *  merges CMS values over `ABOUT_FALLBACK` (lib/about-data.ts) field-by-field.
 *  Stats numbers come from the homepage singleton — only headings live here.
 */
export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0]{
    heroTitle,
    whoPreTitle,
    whoHeading,
    denomination,
    missionLabel,
    mission,
    historyPreTitle,
    historyTitle,
    historyParagraphs,
    beliefsPreTitle,
    beliefsTitle,
    beliefs[]{ title, text },
    valuesPreTitle,
    valuesTitle,
    valuesDescription,
    values[]{ iconKey, title, text, featured },
    expectPreTitle,
    expectTitle,
    expectDescription,
    whatToExpect[]{ icon, title, text },
    expectCtaText,
    leadershipPreTitle,
    leadershipTitle,
    leadershipIntro,
    leadershipCtaText,
    statsPreTitle,
    statsTitle,
    statsDescription,
    stats[]{ value, label },
    ctaTitle,
    ctaText,
    ctaPrimaryText,
    ctaSecondaryText
  }
`)
