import { Icon } from '@/components/ui/Icon'
import Image from '@/components/ui/SiteImage'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { toPhotoItem, urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { getSiteSettings } from '@/lib/site-settings'
import { getPageMetadata } from '@/lib/metadata'
import { CHURCH_ID, CHURCH_LOGO } from '@/lib/structured-data'
import { SITE_URL } from '@/lib/site'
import { PhotoViewer, PortableTextBody, type PhotoItem } from '@/components'
import type { SanityNews } from '@/sanity/lib/types'
import { defineQuery } from 'next-sanity'
import { jsonLdHtml, schemaDate } from '@/lib/utils'
import { NewsPhotoGallery } from './components/NewsPhotoGallery'
import { NEWS_SLUGS_QUERY } from '../queries'

export const dynamicParams = true

export async function generateStaticParams() {
  return sanityFetch<{ slug: string }[]>(NEWS_SLUGS_QUERY, {}, ['news'])
}


const NEWS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    seo,
    title,
    "slug": slug.current,
    publishedAt,
    mainCategory,
    categories,
    text,
    body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } },
    image,
    "imageDimensions": image.asset->metadata.dimensions,
    gallery[defined(asset->_id)][0...10]{
      _key,
      asset,
      alt,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  }
`)

import { formatDate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const news = await sanityFetch<SanityNews | null>(NEWS_BY_SLUG_QUERY, { slug }, ['news'])
  if (!news) return { title: 'Новину не знайдено' }

  const description = news.text?.trim() ||
    (typeof news.body === 'string' ? news.body : news.body ? toPlainText(news.body) : '')

  return getPageMetadata(`/news/${slug}`, {
    seo: news.seo,
    title: news.title || 'Новина',
    description: description.slice(0, 160),
    article: { publishedTime: news.publishedAt, modifiedTime: news._updatedAt },
    alternates: { canonical: `/news/${slug}` },
    image: news.image ? {
      url: urlFor(news.image).width(1200).height(630).fit('crop').url(),
      width: 1200,
      height: 630,
      alt: news.title,
    } : undefined,
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [news, heroes, settings] = await Promise.all([
    sanityFetch<SanityNews | null>(NEWS_BY_SLUG_QUERY, { slug }, ['news']),
    getPageHeroes(),
    getSiteSettings(),
  ])

  if (!news) notFound()

  const galleryPhotos: PhotoItem[] = (news.gallery ?? []).flatMap((photo, index) => {
    const { width, height } = photo.dimensions ?? {}
    if (!photo.asset?._ref || !width || !height) return []
    return [toPhotoItem(photo, {
      id: photo._key ?? `gallery-${index}`,
      alt: photo.alt?.trim() || `${news.title} — фото ${index + 1}`,
      width,
      height,
      lqip: photo.lqip ?? undefined,
    })]
  }).slice(0, 10)
  const mainPhoto: PhotoItem | null = news.image ? toPhotoItem(news.image, {
    id: 'main',
    alt: news.title,
    width: news.imageDimensions?.width ?? 1200,
    height: news.imageDimensions?.height ?? 675,
  }) : null
  const photos = mainPhoto ? [mainPhoto, ...galleryPhotos] : galleryPhotos

  const articleUrl = `${SITE_URL}/news/${slug}`
  const articleImage = news.image
    ? urlFor(news.image).width(1200).height(675).url()
    : undefined
  const visibleBody = news.body ?? news.text
  const articleDescription = typeof visibleBody === 'string'
    ? visibleBody.trim().slice(0, 160)
    : visibleBody ? toPlainText(visibleBody).trim().slice(0, 160) : undefined
  const publishedAt = schemaDate(news.publishedAt)
  const modifiedAt = schemaDate(news._updatedAt)

  // NewsArticle JSON-LD (schema-markup skill)
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${articleUrl}#article`,
    url: articleUrl,
    headline: news.title,
    datePublished: publishedAt,
    ...(modifiedAt && (!publishedAt || Date.parse(modifiedAt) >= Date.parse(publishedAt)) ? { dateModified: modifiedAt } : {}),
    ...(articleImage ? { image: [articleImage] } : {}),
    ...(articleDescription ? { description: articleDescription } : {}),
    ...(news.mainCategory ? { articleSection: news.mainCategory } : {}),
    author: { '@type': 'Organization', '@id': CHURCH_ID, name: settings.name, url: SITE_URL },
    publisher: { '@type': 'Organization', '@id': CHURCH_ID, name: settings.name, url: SITE_URL,
      logo: { '@type': 'ImageObject', url: CHURCH_LOGO, width: 1203, height: 461 } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(newsArticleJsonLd) }}
      />

      {/* Hero */}
      <section className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src={heroes.newsHero}
          preload
          alt=""
          fill
          sizes="(max-width: 991px) max(100vw, 623px), max(100vw, 800px)"
          className="object-cover -z-10"
        />
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
          <Breadcrumbs items={[
            { label: 'Головна', href: '/' },
            { label: 'Новини', href: '/news' },
            { label: news.title },
          ]} />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container-larexa">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {publishedAt && <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Icon className="far fa-calendar-alt" />
                {formatDate(news.publishedAt)}
              </span>}
              {news.mainCategory && (
                <Link
                  href={`/news/category/${encodeURIComponent(news.mainCategory)}`}
                  className="bg-grad-readable text-white text-xs font-semibold px-3 py-1 rounded"
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
            {mainPhoto && (
              <PhotoViewer photos={photos}
                className="relative rounded-xl overflow-hidden mb-8"
              >
                <Image
                  src={mainPhoto.thumbUrl}
                  alt={news.title}
                  width={mainPhoto.width}
                  height={mainPhoto.height}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="w-full h-auto"
                />
              </PhotoViewer>
            )}

            {/* Body */}
            <div className="max-w-none">
              <PortableTextBody value={news.body ?? news.text} />
            </div>

            <NewsPhotoGallery photos={photos} startIndex={mainPhoto ? 1 : 0} />

            {/* Back link */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary-text hover:text-primary-text font-semibold transition-colors"
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
