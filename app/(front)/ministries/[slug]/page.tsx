import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ImagePlaceholder, NewsSlider, PageHero, PortableTextBody } from '@/components'
import { PhotoGalleryGrid } from './components/PhotoGalleryGrid'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  MINISTRY_BY_SLUG_QUERY,
  MINISTRY_SLUGS_QUERY,
  OTHER_MINISTRIES_QUERY,
  MINISTRY_NEWS_QUERY,
} from './queries'
import { getPageHeroes } from '@/lib/page-heroes'
import { SITE_URL } from '@/lib/site'
import type { SanityMinistry, SanityMinistryLink, SanityNews } from '@/sanity/lib/types'

// ============================================
// Static params for all ministry slugs
export const revalidate = 60 // Revalidate page every 60 seconds

// ============================================
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(MINISTRY_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug }))
}

// ============================================
// Dynamic metadata
// ============================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ministry = await client.fetch<SanityMinistry | null>(MINISTRY_BY_SLUG_QUERY, { slug })
  if (!ministry) return { title: 'Служіння не знайдено' }

  return {
    title: `${ministry.title} | Церква «Нове Життя»`,
    description: ministry.shortDescription,
    alternates: { canonical: `/ministries/${slug}` },
  }
}

import { formatDate, jsonLdHtml } from '@/lib/utils'

// ============================================
// PAGE (Server Component)
// ============================================
export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [ministry, otherMinistries, newsRaw, heroes] = await Promise.all([
    client.fetch<SanityMinistry | null>(MINISTRY_BY_SLUG_QUERY, { slug }),
    client.fetch<SanityMinistryLink[]>(OTHER_MINISTRIES_QUERY, { slug }),
    client.fetch<SanityNews[]>(MINISTRY_NEWS_QUERY, { slug }),
    getPageHeroes(),
  ])

  if (!ministry) notFound()

  // Transform news for NewsSlider
  const newsData = newsRaw.map((n) => ({
    _id: n._id,
    title: n.title,
    slug: n.slug,
    date: formatDate(n.publishedAt),
    mainCategory: n.mainCategory,
    ministry: n.ministry ?? null,
    text: n.text,
    image: n.image ? urlFor(n.image).width(600).height(400).url() : '/images/placeholder.jpg',
  }))

  // Transform gallery images
  const galleryImages = ministry.gallery
    ? ministry.gallery.map((img) => urlFor(img).width(800).height(600).url())
    : []

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

      {/* BreadcrumbList JSON-LD (schema-markup skill) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Служіння', item: `${SITE_URL}/ministries` },
              { '@type': 'ListItem', position: 3, name: ministry.title, item: `${SITE_URL}/ministries/${ministry.slug}` },
            ],
          }),
        }}
      />

      {/* Main Content + Sidebar */}
      <section className="py-12 lg:py-20">
        <div className="container-larexa">
          <div className="flex flex-wrap -mx-4">
            {/* -------- SIDEBAR -------- */}
            <aside className="w-full md:w-1/4 px-4 order-last md:order-first">
              {/* All Ministries List */}
              <div className="mb-8">
                <h5 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-primary">
                  Інші служіння
                </h5>
                <ul className="space-y-1">
                  {otherMinistries.map((m) => (
                    <li key={m._id}>
                      <Link
                        href={`/ministries/${m.slug}`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {m.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact CTA */}
              <div className="rounded-xl p-6 text-white text-center" style={{ background: 'linear-gradient(150deg, #97c74e 0%, #2ab9a5 100%)' }}>
                <h6 className="font-bold text-lg mb-2">Хочете долучитися?</h6>
                <p className="text-white/90 text-sm mb-4">
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
                {ministry.image ? (
                  <Image
                    src={urlFor(ministry.image).width(1200).height(675).url()}
                    alt={ministry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="object-cover"
                    priority
                  />
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
                  <svg className="absolute top-4 right-4 w-10 h-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  <p className="text-lg lg:text-xl italic text-gray-700 mb-3 leading-relaxed">
                    &ldquo;{ministry.bibleQuoteText}&rdquo;
                  </p>
                  {ministry.bibleQuoteReference && (
                    <cite className="text-primary font-semibold text-sm not-italic">
                      — {ministry.bibleQuoteReference}
                    </cite>
                  )}
                </blockquote>
              )}

              {/* Leader Info — clickable link to /team/[slug] */}
              {ministry.leader && (
                <Link
                  href={`/team/${ministry.leader.slug}`}
                  className="flex items-center gap-5 bg-gray-50 rounded-xl p-6 mt-8 group hover:bg-gray-100 transition-colors no-underline"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <Image
                      src={urlFor(ministry.leader.photo).width(160).height(160).url()}
                      alt={ministry.leader.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Відповідальний за служіння</p>
                    <h4 className="text-lg font-bold text-gray-800 m-0 group-hover:text-primary transition-colors">
                      {ministry.leader.name}
                    </h4>
                  </div>
                </Link>
              )}

              {/* Photo Gallery */}
              {galleryImages.length > 0 && (
                <PhotoGalleryGrid
                  images={galleryImages}
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
