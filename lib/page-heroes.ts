// =========================================
// getPageHeroes — editable hero (header) background images for section pages.
//
// Reads the `pageHeroes` Sanity singleton and resolves each image to a CDN URL
// via `urlFor()`. When a field is empty, falls back to the static file that was
// previously hardcoded, so the hero is never blank. One image per section is
// shared by the list page and all its detail pages.
//
// Server-only (uses the Sanity client). Consumers: /news, /news/[slug],
// /events, /events/[slug].
// =========================================

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PAGE_HEROES_QUERY } from '@/sanity/lib/queries'
import type { PAGE_HEROES_QUERYResult } from '@/sanity/lib/sanity.types'

const NEWS_HERO_FALLBACK = '/images/ministries-hero.jpg'
const EVENTS_HERO_FALLBACK = '/images/hero-church-3.jpg'

export async function getPageHeroes(): Promise<{ newsHero: string; eventsHero: string }> {
  const data = await client.fetch<PAGE_HEROES_QUERYResult>(
    PAGE_HEROES_QUERY,
    {},
    { next: { revalidate: 60 } },
  )

  return {
    newsHero: data?.newsHero
      ? urlFor(data.newsHero).width(1600).height(900).url()
      : NEWS_HERO_FALLBACK,
    eventsHero: data?.eventsHero
      ? urlFor(data.eventsHero).width(1600).height(900).url()
      : EVENTS_HERO_FALLBACK,
  }
}
