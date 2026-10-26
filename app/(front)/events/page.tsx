import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
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

export const revalidate = 60 // Revalidate page every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('/events', {
    title: 'Події | Церква «Нове Життя»',
    description: 'Події, заходи та оголошення церкви «Нове Життя» у Бориславі.',
    alternates: { canonical: '/events' },
  })
}

const ITEMS_PER_PAGE = 6

interface RecentEventTransformed {
  _id: string
  title: string
  slug: string
  startDate: string
  imageUrl: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10))
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  const [eventsRaw, totalCount, recentRaw, heroes] = await Promise.all([
    client.fetch<SanityEvent[]>(EVENTS_PAGINATED_QUERY, { start, end }),
    client.fetch<number>(EVENTS_COUNT_QUERY),
    client.fetch<
      Array<{ _id: string; title: string; slug: string; startDate: string; image: unknown }>
    >(EVENTS_RECENT_QUERY),
    getPageHeroes(),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const recentEvents: RecentEventTransformed[] = recentRaw.map((e) => ({
    _id: e._id,
    title: e.title,
    slug: e.slug,
    startDate: e.startDate,
    imageUrl: e.image
      ? urlFor(e.image).width(140).height(140).url()
      : '/images/placeholder.jpg',
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
                        : '/images/placeholder.jpg'
                    }
                    imageDimensions={e.imageDimensions}
                  />
                ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <i className="far fa-calendar-alt text-5xl text-gray-300 mb-4 block" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Подій не знайдено
                  </h3>
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
                <h6 className="text-white font-bold text-lg mb-2">Запрошуєте на подію?</h6>
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
