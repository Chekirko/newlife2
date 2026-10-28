import { Icon } from '@/components/ui/Icon'
import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { LISTING_PER_PAGE as ITEMS_PER_PAGE, listingHref } from '@/lib/listing-params'
import { getPageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { PageHero } from '@/components'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { formatEventDate } from '@/lib/utils'
import type { SanityEvent } from '@/sanity/lib/types'
import {
  EVENTS_PAGINATED_QUERY,
  EVENTS_COUNT_QUERY,
  EVENTS_RECENT_QUERY,
} from './queries'
import { EventCard } from './components/EventCard'
import { EventsPagination } from './components/EventsPagination'
import { SidebarRecentEvents } from './components/SidebarRecentEvents'


type Props = { page?: number }

export async function eventsMetadata({ page = 1 }: Props = {}): Promise<Metadata> {
  const canonical = listingHref('/events', page)
  const { items } = await getEventsListing(page)
  return getPageMetadata(canonical, {
    title: 'Події | Церква «Нове Життя»',
    description: 'Події, заходи та оголошення церкви «Нове Життя» у Бориславі.',
    alternates: { canonical },
    listingItems: items,
  })
}

export const getEventsListing = cache(async (page: number) => {
  const totalCount = await sanityFetch<number>(EVENTS_COUNT_QUERY, {}, ['event'])
  if (page > 1 && page > Math.ceil(totalCount / ITEMS_PER_PAGE)) notFound()
  const start = (page - 1) * ITEMS_PER_PAGE
  const items = await sanityFetch<SanityEvent[]>(EVENTS_PAGINATED_QUERY, {
    start, end: start + ITEMS_PER_PAGE,
  }, ['event'])
  if (page > 1 && items.length === 0) notFound()
  return { items, totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) }
})

interface RecentEventTransformed {
  _id: string
  title: string
  slug: string
  startDate: string
  imageUrl: string | null
}

export async function EventsListing({ page: currentPage = 1 }: Props = {}) {

  const [{ items: eventsRaw, totalPages }, recentRaw, heroes] = await Promise.all([
    getEventsListing(currentPage),
    sanityFetch<Array<{ _id: string; title: string; slug: string; startDate: string; image: unknown }>>(EVENTS_RECENT_QUERY, {}, ['event']),
    getPageHeroes(),
  ])

  const recentEvents: RecentEventTransformed[] = recentRaw.map((e) => ({
    _id: e._id,
    title: e.title,
    slug: e.slug,
    startDate: e.startDate,
    imageUrl: e.image
      ? urlFor(e.image).width(140).height(140).url()
      : null,
  }))

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Події"
        backgroundImage={heroes.eventsHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Події' },
        ]}
      />

      {/* Content + Sidebar */}
      <section className="pb-0">
        <div className="container-larexa">
          <div className="flex flex-wrap -mx-4">
            {/* -------- MAIN CONTENT -------- */}
            <div className="w-full md:w-3/4 px-4 order-2 md:order-1">
              {eventsRaw.length > 0 ? (
                <div className="columns-1 sm:columns-2 gap-6 mb-8">
                {eventsRaw.map((e) => (
                  <EventCard
                    key={e._id}
                    title={e.title}
                    slug={e.slug}
                    date={formatEventDate(e.startDate)}
                    type={e.type}
                    tag={e.tag}
                    description={e.description}
                    imageUrl={
                      e.image
                        ? urlFor(e.image).ignoreImageParams().width(900).fit('max').auto('format').url()
                        : null
                    }
                    imageDimensions={e.imageDimensions}
                  />
                ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Icon className="far fa-calendar-alt text-5xl text-gray-300 mb-4 block" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Подій не знайдено
                  </h2>
                  <p className="text-gray-500">Скоро тут зʼявляться нові події та оголошення.</p>
                </div>
              )}

              <EventsPagination currentPage={currentPage} totalPages={totalPages} />
            </div>

            {/* -------- SIDEBAR -------- */}
            <aside className="w-full md:w-1/4 px-4 order-1 md:order-2 mb-8 md:mb-0">
              <SidebarRecentEvents events={recentEvents} />

              {/* CTA box */}
              <div
                className="bg-grad-readable rounded-xl p-6 text-white text-center"
              >
                <h2 className="text-white font-bold text-lg mb-2">Запрошуєте на подію?</h2>
                <p className="text-white text-sm mb-4">
                  Хочете додати подію чи оголошення — напишіть нам!
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Написати нам
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
