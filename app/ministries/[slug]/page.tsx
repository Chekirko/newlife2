import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { NewsSlider } from '@/components/sections/NewsSlider'
import { PhotoGalleryGrid } from '@/components/sections/PhotoGalleryGrid'
import { ministriesData } from '@/data/ministriesData'
import { newsData } from '@/data/newsData'

// ============================================
// Static params for all ministry slugs
// ============================================
export function generateStaticParams() {
  return ministriesData.map((m) => ({ slug: m.slug }))
}

// ============================================
// Dynamic metadata
// ============================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ministry = ministriesData.find((m) => m.slug === slug)
  if (!ministry) return { title: 'Служіння не знайдено' }

  return {
    title: `${ministry.title} | Церква «Нове Життя»`,
    description: ministry.shortDescription,
  }
}

// ============================================
// PAGE (Server Component)
// ============================================
export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ministry = ministriesData.find((m) => m.slug === slug)
  if (!ministry) notFound()

  const otherMinistries = ministriesData.filter((m) => m.slug !== slug)

  return (
    <>
      {/* Hero — fixed shared image, frosted-glass text box */}
      <section
        className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/ministries-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Frosted glass card — compact, centered in visible space */}
        <div
          className="relative z-10 text-center mx-6 sm:mx-0 w-full sm:w-auto sm:min-w-[360px] lg:min-w-[480px] px-6 py-4 lg:px-10 lg:py-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(151,199,78,0.15) 0%, rgba(42,185,165,0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-4xl mb-2 leading-tight">
            {ministry.title}
          </h1>
          {/* Breadcrumbs */}
          <nav>
            <ol className="flex items-center justify-center gap-1.5 text-white/75 text-xs sm:text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Головна</Link></li>
              <li className="text-white/40">/</li>
              <li><Link href="/ministries" className="hover:text-white transition-colors">Служіння</Link></li>
              <li className="text-white/40">/</li>
              <li className="text-white/55">{ministry.title}</li>
            </ol>
          </nav>
        </div>
      </section>

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
                    <li key={m.id}>
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
                <Image
                  src={typeof ministry.image === 'string' ? ministry.image : ministry.image}
                  alt={ministry.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Full Description */}
              <div className="prose prose-lg max-w-none mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  {ministry.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                  {ministry.fullDescription}
                </p>
              </div>

              {/* Bible Quote */}
              {ministry.bibleQuote && (
                <blockquote className="relative my-10 py-6 px-8 rounded-xl bg-gray-50 border-l-4 border-primary">
                  <svg className="absolute top-4 right-4 w-10 h-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  <p className="text-lg lg:text-xl italic text-gray-700 mb-3 leading-relaxed">
                    &ldquo;{ministry.bibleQuote.text}&rdquo;
                  </p>
                  <cite className="text-primary font-semibold text-sm not-italic">
                    — {ministry.bibleQuote.reference}
                  </cite>
                </blockquote>
              )}

              {/* Leader Info */}
              <div className="flex items-center gap-5 bg-gray-50 rounded-xl p-6 mt-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
                  <Image
                    src={typeof ministry.leaderPhoto === 'string' ? ministry.leaderPhoto : ministry.leaderPhoto}
                    alt={ministry.leaderName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Відповідальний за служіння</p>
                  <h4 className="text-lg font-bold text-gray-800 m-0">
                    {ministry.leaderName}
                  </h4>
                </div>
              </div>

              {/* Photo Gallery */}
              {ministry.gallery && ministry.gallery.length > 0 && (
                <PhotoGalleryGrid
                  images={ministry.gallery}
                  title="Фотогалерея"
                  className="mt-10"
                />
              )}

            </div>
          </div>
        </div>
      </section>

      {/* News Slider */}
      <NewsSlider
        preTitle="Останні новини"
        title="Новини служіння"
        description={`Останні новини та оновлення, пов'язані зі служінням «${ministry.title}»`}
        news={newsData}
        className="bg-gray-50"
      />
    </>
  )
}
