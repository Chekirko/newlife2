// =========================================
// getHomepage — single entry point for the homepage's editable content.
//
// Fetches the `homepage` Sanity singleton and resolves it into the shapes the
// homepage components already consume. For the hero slider: if the CMS array
// has slides, each Sanity image is resolved to a CDN URL via `urlFor()`;
// otherwise the typed `HERO_SLIDES_FALLBACK` defaults render so the hero is
// never blank. `HERO_SLIDES_FALLBACK` is also the canonical SHAPE.
//
// Server-only (uses the Sanity client). Consumer: app/(front)/page.tsx.
// =========================================

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { HOMEPAGE_QUERY } from '@/sanity/lib/queries'
import type { HOMEPAGE_QUERYResult } from '@/sanity/lib/sanity.types'
import type { HeroSlide } from '@/components/sections/Hero'
import type { TestimonialData } from '@/app/(front)/components/TestimonialsGrid'
import { HERO_SLIDES_FALLBACK } from '@/lib/hero-slides-data'
import { TESTIMONIALS_FALLBACK } from '@/lib/testimonials-data'

export { HERO_SLIDES_FALLBACK }

/** Use a CMS value when present and non-empty, otherwise `undefined`. */
function opt(value: string | null | undefined): string | undefined {
  return value && value.trim() ? value : undefined
}

export async function getHomepage(): Promise<{
  heroSlides: HeroSlide[]
  testimonials: TestimonialData[]
}> {
  const data = await client.fetch<HOMEPAGE_QUERYResult>(
    HOMEPAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  )

  const cmsSlides = (data?.heroSlides ?? [])
    .filter((s) => s.image && s.title)
    .map((s, i): HeroSlide => ({
      id: String(i),
      backgroundImage: urlFor(s.image!).width(1920).height(1080).url(),
      preTitle: opt(s.preTitle),
      title: s.title!,
      subtitle: opt(s.subtitle),
      buttonText: opt(s.buttonText),
      buttonHref: opt(s.buttonHref),
      secondaryButtonText: opt(s.secondaryButtonText),
      secondaryButtonHref: opt(s.secondaryButtonHref),
      align: (s.align as HeroSlide['align']) ?? 'center',
    }))

  const cmsTestimonials = (data?.testimonials ?? [])
    .filter((t) => t.quote && t.name)
    .map((t, i): TestimonialData => ({
      id: String(i),
      quote: t.quote!,
      name: t.name!,
      position: opt(t.position),
      rating: typeof t.rating === 'number' ? t.rating : undefined,
      avatar: t.avatar ? urlFor(t.avatar).width(100).height(100).url() : undefined,
    }))

  return {
    heroSlides: cmsSlides.length > 0 ? cmsSlides : HERO_SLIDES_FALLBACK,
    testimonials: cmsTestimonials.length > 0 ? cmsTestimonials : TESTIMONIALS_FALLBACK,
  }
}
