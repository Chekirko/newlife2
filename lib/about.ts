// =========================================
// getAboutPage — single entry point for the /about page's editable content.
//
// Fetches the `aboutPage` Sanity singleton and merges it over ABOUT_FALLBACK
// (lib/about-data.ts) FIELD BY FIELD: an empty CMS string falls back to the
// default, and an empty CMS array falls back to the default array — so the page
// never shows blank sections. Mirrors the `getSiteSettings()` merge approach.
//
// Server-only (uses the Sanity client). Consumer: app/(front)/about/page.tsx.
// Stats numbers live here too (moved off the homepage singleton) — `stats.items`.
// =========================================

import { client } from '@/sanity/lib/client'
import { ABOUT_PAGE_QUERY } from '@/sanity/lib/queries'
import type { ABOUT_PAGE_QUERYResult } from '@/sanity/lib/sanity.types'
import {
  ABOUT_FALLBACK,
  type AboutContent,
  type AboutBelief,
  type AboutIconItem,
  type AboutValue,
  type AboutValueIcon,
  type AboutStat,
} from '@/lib/about-data'

const VALUE_ICON_KEYS: AboutValueIcon[] = [
  'heart', 'book', 'spirit', 'community', 'mercy', 'mission',
]

/** CMS string if present and non-empty, otherwise the fallback. */
function str(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback
}

export async function getAboutPage(): Promise<AboutContent> {
  const data = await client.fetch<ABOUT_PAGE_QUERYResult>(
    ABOUT_PAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  )

  const fb = ABOUT_FALLBACK
  if (!data) return fb

  const paragraphs = (data.historyParagraphs ?? []).filter(
    (p): p is string => typeof p === 'string' && p.trim().length > 0,
  )

  const beliefs = (data.beliefs ?? [])
    .filter((b) => b.title && b.text)
    .map((b): AboutBelief => ({ title: b.title!, text: b.text! }))

  const values = (data.values ?? [])
    .filter((v) => v.title && v.text)
    .map((v): AboutValue => ({
      iconKey: VALUE_ICON_KEYS.includes(v.iconKey as AboutValueIcon)
        ? (v.iconKey as AboutValueIcon)
        : 'heart',
      title: v.title!,
      text: v.text!,
      featured: v.featured ?? false,
    }))

  const whatToExpect = (data.whatToExpect ?? [])
    .filter((w) => w.icon && w.title && w.text)
    .map((w): AboutIconItem => ({ icon: w.icon!, title: w.title!, text: w.text! }))

  const stats = (data.stats ?? [])
    .filter((s) => s.value && s.label)
    .map((s): AboutStat => ({ value: s.value!, label: s.label! }))

  return {
    heroTitle: str(data.heroTitle, fb.heroTitle),
    whoWeAre: {
      preTitle: str(data.whoPreTitle, fb.whoWeAre.preTitle),
      heading: str(data.whoHeading, fb.whoWeAre.heading),
      denomination: str(data.denomination, fb.whoWeAre.denomination),
      missionLabel: str(data.missionLabel, fb.whoWeAre.missionLabel),
      mission: str(data.mission, fb.whoWeAre.mission),
    },
    history: {
      preTitle: str(data.historyPreTitle, fb.history.preTitle),
      title: str(data.historyTitle, fb.history.title),
      paragraphs: paragraphs.length > 0 ? paragraphs : fb.history.paragraphs,
    },
    beliefs: {
      preTitle: str(data.beliefsPreTitle, fb.beliefs.preTitle),
      title: str(data.beliefsTitle, fb.beliefs.title),
      items: beliefs.length > 0 ? beliefs : fb.beliefs.items,
    },
    values: {
      preTitle: str(data.valuesPreTitle, fb.values.preTitle),
      title: str(data.valuesTitle, fb.values.title),
      description: str(data.valuesDescription, fb.values.description),
      items: values.length > 0 ? values : fb.values.items,
    },
    whatToExpect: {
      preTitle: str(data.expectPreTitle, fb.whatToExpect.preTitle),
      title: str(data.expectTitle, fb.whatToExpect.title),
      description: str(data.expectDescription, fb.whatToExpect.description),
      ctaText: str(data.expectCtaText, fb.whatToExpect.ctaText),
      items: whatToExpect.length > 0 ? whatToExpect : fb.whatToExpect.items,
    },
    leadership: {
      preTitle: str(data.leadershipPreTitle, fb.leadership.preTitle),
      title: str(data.leadershipTitle, fb.leadership.title),
      intro: str(data.leadershipIntro, fb.leadership.intro),
      ctaText: str(data.leadershipCtaText, fb.leadership.ctaText),
    },
    stats: {
      preTitle: str(data.statsPreTitle, fb.stats.preTitle),
      title: str(data.statsTitle, fb.stats.title),
      description: str(data.statsDescription, fb.stats.description),
      items: stats.length > 0 ? stats : fb.stats.items,
    },
    finalCta: {
      title: str(data.ctaTitle, fb.finalCta.title),
      text: str(data.ctaText, fb.finalCta.text),
      primaryText: str(data.ctaPrimaryText, fb.finalCta.primaryText),
      secondaryText: str(data.ctaSecondaryText, fb.finalCta.secondaryText),
    },
  }
}
