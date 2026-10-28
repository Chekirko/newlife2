import Image from '@/components/ui/SiteImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import { ImagePlaceholder, NewsSlider, PageHero, PhotoViewer, PortableTextBody, type PhotoItem } from '@/components'
import { PhotoGalleryGrid } from './components/PhotoGalleryGrid'
import { sanityFetch } from '@/sanity/lib/fetch'
import { toPhotoItem, urlFor } from '@/sanity/lib/image'
import {
  MINISTRY_BY_SLUG_QUERY,
  MINISTRY_SLUGS_QUERY,
  OTHER_MINISTRIES_QUERY,
  MINISTRY_NEWS_QUERY,
} from './queries'
import { getPageHeroes } from '@/lib/page-heroes'
import { getPageMetadata } from '@/lib/metadata'
import type { SanityMinistry, SanityMinistryLink, SanityNews } from '@/sanity/lib/types'

// ============================================
// Static params for all ministry slugs

// ============================================
export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(MINISTRY_SLUGS_QUERY, {}, ['ministry'])
  return slugs.map((s) => ({ slug: s.slug }))
}

// ============================================
// Dynamic metadata
// ============================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ministry = await sanityFetch<SanityMinistry | null>(MINISTRY_BY_SLUG_QUERY, { slug }, ['ministry','teamMember'])
  if (!ministry) return { title: 'Служіння не знайдено' }

  const description = ministry.shortDescription?.trim() ||
    (typeof ministry.fullDescription === 'string' ? ministry.fullDescription :
      ministry.fullDescription ? toPlainText(ministry.fullDescription) : '')

  return getPageMetadata(`/ministries/${slug}`, {
    seo: ministry.seo,
    title: ministry.title || 'Служіння',
    description: description.slice(0, 160),
    alternates: { canonical: `/ministries/${slug}` },
    image: ministry.image ? {
      url: urlFor(ministry.image).width(1200).height(630).fit('crop').url(),
      width: 1200,
      height: 630,
      alt: ministry.title,
    } : undefined,
  })
}

import { formatDate } from '@/lib/utils'

// ============================================
// PAGE (Server Component)
// ============================================
export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [ministry, otherMinistries, newsRaw, heroes] = await Promise.all([
    sanityFetch<SanityMinistry | null>(MINISTRY_BY_SLUG_QUERY, { slug }, ['ministry','teamMember']),
    sanityFetch<SanityMinistryLink[]>(OTHER_MINISTRIES_QUERY, { slug }, ['ministry']),
    sanityFetch<SanityNews[]>(MINISTRY_NEWS_QUERY, { slug }, ['news','ministry']),
    getPageHeroes(),
  ])

  if (!ministry) notFound()

  const leaders = (ministry.leaders ?? []).filter(
    (leader): leader is NonNullable<typeof leader> => Boolean(leader?.slug && leader.name),
  )

  // Transform news for NewsSlider
  const newsData = newsRaw.map((n) => ({
    _id: n._id,
    title: n.title,
    slug: n.slug,
    date: formatDate(n.publishedAt),
    mainCategory: n.mainCategory,
    ministry: n.ministry ?? null,
    text: n.text,
    image: n.image ? urlFor(n.image).width(600).height(400).url() : null,
  }))

  // Transform gallery images into lightbox-ready photos (thumb + full + lqip)
  const galleryPhotos: PhotoItem[] = (ministry.gallery ?? []).flatMap((img, i) => {
    const { width, height } = img.dimensions ?? {}
    if (!img.asset?._ref || !width || !height) return []
    return [toPhotoItem(img as SanityImageSource, {
      id: img._key ?? `${ministry.slug}-${i}`,
      lqip: img.lqip ?? undefined,
      alt: `Фото — ${ministry.title}`,
      width,
      height,
    })]
  })
  const mainPhoto: PhotoItem | null = ministry.image ? toPhotoItem(ministry.image, {
    id: 'main',
    alt: ministry.title,
    width: ministry.imageDimensions?.width ?? 1200,
    height: ministry.imageDimensions?.height ?? 675,
  }) : null
  const viewerPhotos = mainPhoto ? [mainPhoto, ...galleryPhotos] : galleryPhotos

  return (
    <>
      <PageHero
        title={ministry.title}
        backgroundImage={heroes.ministriesHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Служіння', href: '/ministries' },
          { label: ministry.title },
        ]}
      />


      {/* Main Content + Sidebar */}
      <section className="py-12 lg:py-20">
        <div className="container-larexa">
          <div className="flex flex-wrap -mx-4">
            {/* -------- SIDEBAR -------- */}
            <aside className="w-full md:w-1/4 px-4 order-last md:order-first">
              {/* All Ministries List */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-primary">
                  Інші служіння
                </h2>
                <ul className="space-y-1">
                  {otherMinistries.map((m) => (
                    <li key={m._id}>
                      <Link
                        href={`/ministries/${m.slug}`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-text transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4 text-primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {m.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact CTA */}
              <div className="bg-grad-readable rounded-xl p-6 text-white text-center">
                <h2 className="text-white font-bold text-lg mb-2">Хочете долучитися?</h2>
                <p className="text-white text-sm mb-4">
                  Зв&apos;яжіться з нами, щоб дізнатися, як приєднатися до цього служіння.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Написати нам
                </Link>
              </div>
            </aside>

            {/* -------- CONTENT -------- */}
            <div className="w-full md:w-3/4 px-4 mb-10 md:mb-0">
              {/* Ministry Image */}
              <div className="relative rounded-xl overflow-hidden mb-8" style={{ aspectRatio: '16 / 9' }}>
                {mainPhoto ? (
                  <PhotoViewer photos={viewerPhotos} className="absolute inset-0 h-full">
                  <Image
                    src={mainPhoto.thumbUrl}
                    alt={ministry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="object-cover"
                  />
                  </PhotoViewer>
                ) : (
                  <ImagePlaceholder className="absolute inset-0" />
                )}
              </div>

              {/* Full Description */}
              <div className="max-w-none mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  {ministry.title}
                </h2>
                <PortableTextBody value={ministry.fullDescription} />
              </div>

              {/* Bible Quote */}
              {ministry.bibleQuoteText && (
                <blockquote className="relative my-10 py-6 px-8 rounded-xl bg-gray-50 border-l-4 border-primary">
                  <svg className="absolute top-4 right-4 w-10 h-10 text-primary-text/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  <p className="text-lg lg:text-xl italic text-gray-700 mb-3 leading-relaxed">
                    &ldquo;{ministry.bibleQuoteText}&rdquo;
                  </p>
                  {ministry.bibleQuoteReference && (
                    <cite className="text-primary-text font-semibold text-sm not-italic">
                      — {ministry.bibleQuoteReference}
                    </cite>
                  )}
                </blockquote>
              )}

              {/* Responsible(s) — clickable link(s) to /team/[slug] */}
              {leaders.length === 1 && (
                <Link
                  href={`/team/${leaders[0].slug}`}
                  className="flex items-center gap-5 bg-gray-50 rounded-xl p-6 mt-8 group hover:bg-gray-100 transition-colors no-underline"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative ring-2 ring-transparent group-hover:ring-primary transition-all">
                    {leaders[0].photo && <Image
                      src={urlFor(leaders[0].photo).width(160).height(160).url()}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Відповідальний за служіння</p>
                    <h3 className="text-lg font-bold text-gray-800 m-0 group-hover:text-primary-text transition-colors">
                      {leaders[0].name}
                    </h3>
                  </div>
                </Link>
              )}

              {leaders.length > 1 && (
                <div className="bg-gray-50 rounded-xl p-6 mt-8">
                  <h3 className="font-base text-lg lg:text-xl font-bold text-gray-800 mb-5">Відповідальні за служіння</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {leaders.map((leader) => (
                      <Link
                        key={leader._id}
                        href={`/team/${leader.slug}`}
                        className="flex items-center gap-4 group no-underline"
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative ring-2 ring-transparent group-hover:ring-primary transition-all">
                          {leader.photo && <Image
                            src={urlFor(leader.photo).width(160).height(160).url()}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />}
                        </div>
                        <h4 className="text-base font-bold text-gray-800 m-0 group-hover:text-primary-text transition-colors">
                          {leader.name}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {galleryPhotos.length > 0 && (
                <PhotoGalleryGrid
                  photos={galleryPhotos}
                  viewerPhotos={viewerPhotos}
                  title="Фотогалерея"
                  className="mt-10"
                />
              )}

            </div>
          </div>
        </div>
      </section>

      {/* News Slider */}
      {newsData.length > 0 && (
        <NewsSlider
          preTitle="Останні новини"
          title="Новини служіння"
          description={`Останні новини та оновлення, пов'язані зі служінням «${ministry.title}»`}
          news={newsData}
          className="bg-gray-50"
        />
      )}
    </>
  )
}
