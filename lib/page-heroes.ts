// =========================================
// getPageHeroes — editable hero (header) background images for every page
// except the homepage (which has its own slider).
//
// Reads the `pageHeroes` Sanity singleton and resolves each image to a CDN URL
// via `urlFor()`. When a field is empty, falls back to the static file that was
// previously hardcoded, so the hero is never blank. Section pages (news,
// events, ministries, team) share one image across their list + detail pages.
//
// Server-only (uses the Sanity client). Consumers: every (front) page hero.
// =========================================

import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PAGE_HEROES_QUERY } from '@/sanity/lib/queries'
import type { PAGE_HEROES_QUERYResult } from '@/sanity/lib/sanity.types'

// Field name -> static fallback (the value each page used before the CMS field).
const FALLBACKS = {
  newsHero: '/images/ministries-hero.jpg',
  eventsHero: '/images/hero-church-3.jpg',
  ministriesHero: '/images/ministries-hero.jpg',
  teamHero: '/images/team.jpg',
  historyHero: '/images/ministries-hero.jpg',
  contactHero: '/images/hero-church-2.jpg',
  aboutHero: '/images/ministries-hero.jpg',
  mediaHero: '/images/ministries-hero.jpg',
  privacyHero: '/images/ministries-hero.jpg',
} as const

type PageHeroKey = keyof typeof FALLBACKS

export async function getPageHeroes(): Promise<Record<PageHeroKey, string>> {
  const data = await client.fetch<PAGE_HEROES_QUERYResult>(
    PAGE_HEROES_QUERY,
    {},
    { next: { revalidate: 60 } },
  )

  const result = {} as Record<PageHeroKey, string>
  for (const key of Object.keys(FALLBACKS) as PageHeroKey[]) {
    const image = data?.[key] as SanityImageSource | null | undefined
    result[key] = image
      ? urlFor(image).width(1600).height(900).url()
      : FALLBACKS[key]
  }
  return result
}
