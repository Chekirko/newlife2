import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { LISTING_PER_PAGE as ITEMS_PER_PAGE, normalizeListingParams, type ListingSearchParams } from '@/lib/listing-params'
import { getPageMetadata } from '@/lib/metadata'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { formatDate } from '@/lib/utils'
import {
  NEWS_PAGINATED_QUERY,
  NEWS_COUNT_QUERY,
  NEWS_RECENT_QUERY,
  NEWS_CATEGORIES_QUERY,
} from './queries'
import type { SanityNews } from '@/sanity/lib/types'
import { NewsCard } from './components/NewsCard'
import { NewsPagination } from './components/NewsPagination'
import { SidebarRecentPosts } from './components/SidebarRecentPosts'
import { SidebarCategories } from './components/SidebarCategories'
import Link from 'next/link'

export const revalidate = 60 // Revalidate page every 60 seconds

type Props = { searchParams: Promise<ListingSearchParams> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, filters, filtered, canonical } = normalizeListingParams('/news', await searchParams, ITEMS_PER_PAGE)
  const { items } = await getNewsListing(page, filters.category)
  return getPageMetadata(canonical, {
    title: 'Новини | Церква «Нове Життя»',
    description: 'Останні новини та оновлення церкви «Нове Життя» у Бориславі.',
    alternates: { canonical },
    listingItems: items,
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  })
}

const getNewsListing = cache(async (page: number, category: string) => {
  const totalCount = await client.fetch<number>(NEWS_COUNT_QUERY, { category })
  if (page > 1 && page > Math.ceil(totalCount / ITEMS_PER_PAGE)) notFound()
  const start = (page - 1) * ITEMS_PER_PAGE
  const items = await client.fetch<SanityNews[]>(NEWS_PAGINATED_QUERY, {
    start, end: start + ITEMS_PER_PAGE, category,
  })
  if (page > 1 && items.length === 0) notFound()
  return { items, totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) }
})

// Sidebar recent post shape (after urlFor transform)
interface RecentPostTransformed {
  _id: string
  title: string
  slug: string
  publishedAt: string
  imageUrl: string
}

export default async function NewsPage({
  searchParams,
}: Props) {
  const { page: currentPage, filters: { category } } = normalizeListingParams('/news', await searchParams, ITEMS_PER_PAGE)

  // Parallel fetches
  const [{ items: newsRaw, totalPages }, recentRaw, categories, heroes] = await Promise.all([
    getNewsListing(currentPage, category),
    client.fetch<Array<{
      _id: string
      title: string
      slug: string
      publishedAt: string
      image: SanityNews['image'] | null
    }>>(NEWS_RECENT_QUERY),
    client.fetch<string[]>(NEWS_CATEGORIES_QUERY),
    getPageHeroes(),
  ])

  // Transform recent posts for sidebar
  const recentPosts: RecentPostTransformed[] = recentRaw.map((p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
    imageUrl: p.image
      ? urlFor(p.image).width(140).height(140).url()
      : '/images/placeholder.jpg',
  }))

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Новини"
        backgroundImage={heroes.newsHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Новини' },
        ]}
      />

      {/* Content + Sidebar */}
      <section className="pb-0">
        <div className="container-larexa">
          <div className="flex flex-wrap -mx-4">
            {/* -------- MAIN CONTENT (9 col) -------- */}
            <div className="w-full md:w-3/4 px-4 order-2 md:order-1">
              {/* Active category badge */}
              {category && (
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-sm text-gray-500">Фільтр:</span>
                  <span className="bg-grad-readable text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    {category}
                  </span>
                  <Link
                    href="/news"
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    title="Скинути фільтр"
                  >
                    <i className="fas fa-times" aria-hidden="true" /> Скинути
                  </Link>
                </div>
              )}

              {/* News grid */}
              {newsRaw.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {newsRaw.map((n) => (
                  <NewsCard
                    key={n._id}
                    title={n.title}
                    slug={n.slug}
                    date={formatDate(n.publishedAt)}
                    mainCategory={n.mainCategory}
                    text={n.text}
                    imageUrl={
                      n.image
                      ? urlFor(n.image).width(1200).height(675).url()
                        : '/images/placeholder.jpg'
                    }
                  />
                ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <i className="far fa-newspaper text-5xl text-gray-300 mb-4 block" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Новин не знайдено
                  </h2>
                  <p className="text-gray-500">
                    {category
                      ? `Немає новин у категорії «${category}».`
                      : 'Скоро тут з\'являться нові публікації.'}
                  </p>
                </div>
              )}

              {/* Pagination */}
              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                category={category}
              />
            </div>

            {/* -------- SIDEBAR (3 col) -------- */}
            <aside className="w-full md:w-1/4 px-4 order-1 md:order-2 mb-8 md:mb-0">
              {/* Categories */}
              <SidebarCategories
                categories={categories}
                activeCategory={category}
              />

              {/* Recent posts */}
              <SidebarRecentPosts posts={recentPosts} />

              {/* CTA box */}
              <div
                className="bg-grad-readable rounded-xl p-6 text-white text-center"
              >
                <h2 className="text-white font-bold text-lg mb-2">Маєте новину?</h2>
                <p className="text-white text-sm mb-4">
                  Якщо у вас є цікава новина або свідчення — напишіть нам!
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
