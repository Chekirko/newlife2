import type { Metadata } from 'next'
import { HeroSlider, type HeroSlide } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
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

export const metadata: Metadata = {
  title: 'Новини | Церква «Нове Життя»',
  description: 'Останні новини та оновлення церкви «Нове Життя» у Бориславі.',
}

const ITEMS_PER_PAGE = 6

const heroSlide: HeroSlide[] = [
  {
    id: '1',
    backgroundImage: '/images/ministries-hero.jpg',
    title: 'Новини',
    align: 'center',
  },
]

import { formatDate } from '@/lib/utils'

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
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageStr, category } = await searchParams
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10))
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  // Parallel fetches
  const [newsRaw, totalCount, recentRaw, categories] = await Promise.all([
    client.fetch<SanityNews[]>(NEWS_PAGINATED_QUERY, {
      start,
      end,
      category: category || '',
    }),
    client.fetch<number>(NEWS_COUNT_QUERY, {
      category: category || '',
    }),
    client.fetch<Array<{
      _id: string
      title: string
      slug: string
      publishedAt: string
      image: any
    }>>(NEWS_RECENT_QUERY),
    client.fetch<string[]>(NEWS_CATEGORIES_QUERY),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

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
      <HeroSlider
        slides={heroSlide}
        height="h-[500px] lg:h-[750px]"
        overlayDark={4}
        autoplay={false}
        showArrows={false}
        showDots={false}
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
                  <span className="bg-grad text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    {category}
                  </span>
                  <Link
                    href="/news"
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    title="Скинути фільтр"
                  >
                    <i className="fas fa-times" /> Скинути
                  </Link>
                </div>
              )}

              {/* News grid */}
              {newsRaw.length > 0 ? (
                newsRaw.map((n) => (
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
                ))
              ) : (
                <div className="text-center py-20">
                  <i className="far fa-newspaper text-5xl text-gray-300 mb-4 block" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Новин не знайдено
                  </h3>
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
                className="rounded-xl p-6 text-white text-center"
                style={{
                  background:
                    'linear-gradient(150deg, #97c74e 0%, #2ab9a5 100%)',
                }}
              >
                <h6 className="font-bold text-lg mb-2">Маєте новину?</h6>
                <p className="text-white/90 text-sm mb-4">
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
