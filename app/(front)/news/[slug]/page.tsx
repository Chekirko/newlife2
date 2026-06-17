import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { PortableTextBody } from '@/components'
import type { SanityNews } from '@/sanity/lib/types'
import { defineQuery } from 'next-sanity'

export const revalidate = 60 // Revalidate page every 60 seconds

const NEWS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    mainCategory,
    categories,
    text,
    body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } },
    image
  }
`)

import { formatDate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const news = await client.fetch<SanityNews | null>(NEWS_BY_SLUG_QUERY, { slug })
  if (!news) return { title: 'Новину не знайдено' }

  return {
    title: `${news.title} | Новини | Церква «Нове Життя»`,
    description: news.text?.substring(0, 160),
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [news, heroes, settings] = await Promise.all([
    client.fetch<SanityNews | null>(NEWS_BY_SLUG_QUERY, { slug }),
    getPageHeroes(),
    getSiteSettings(),
  ])

  if (!news) notFound()

  const articleUrl = `${SITE_URL}/news/${news.slug}`
  const articleImage = news.image
    ? urlFor(news.image).width(1200).height(675).url()
    : undefined
  const articleDescription =
    news.text?.trim() || (news.body ? toPlainText(news.body).slice(0, 160) : undefined)

  // NewsArticle JSON-LD (schema-markup skill)
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    datePublished: news.publishedAt,
    dateModified: news._updatedAt || news.publishedAt,
    ...(articleImage ? { image: [articleImage] } : {}),
    ...(articleDescription ? { description: articleDescription } : {}),
    ...(news.mainCategory ? { articleSection: news.mainCategory } : {}),
    author: { '@type': 'Organization', name: settings.name, url: SITE_URL },
    publisher: { '@type': 'Organization', name: settings.name, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  }

  // BreadcrumbList JSON-LD (schema-markup skill)
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Новини', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: news.title, item: articleUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section
        className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroes.newsHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div
          className="relative z-10 text-center mx-6 sm:mx-0 w-full sm:w-auto sm:min-w-[360px] lg:min-w-[480px] px-6 py-4 lg:px-10 lg:py-6 rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(151,199,78,0.15) 0%, rgba(42,185,165,0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-4xl mb-2 leading-tight">
            {news.title}
          </h1>
          <nav>
            <ol className="flex items-center justify-center gap-1.5 text-white/75 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Головна
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Новини
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white/55">{news.title}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container-larexa">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <i className="far fa-calendar-alt" />
                {formatDate(news.publishedAt)}
              </span>
              {news.mainCategory && (
                <Link
                  href={`/news?category=${encodeURIComponent(news.mainCategory)}`}
                  className="bg-grad text-white text-xs font-semibold px-3 py-1 rounded"
                >
                  {news.mainCategory}
                </Link>
              )}
              {news.categories &&
                news.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded"
                  >
                    {cat}
                  </span>
                ))}
            </div>

            {/* Image */}
            {news.image && (
              <div
                className="relative rounded-xl overflow-hidden mb-8"
                style={{ aspectRatio: '16 / 9' }}
              >
                <Image
                  src={urlFor(news.image).width(1200).height(675).url()}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Body */}
            <div className="max-w-none">
              <PortableTextBody value={news.body ?? news.text} />
            </div>

            {/* Back link */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Повернутися до новин
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
