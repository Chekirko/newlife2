import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextBody } from '@/components'
import { getSiteSettings } from '@/lib/site-settings'
import { getPageHeroes } from '@/lib/page-heroes'
import { SITE_URL } from '@/lib/site'
import { formatEventDate, jsonLdHtml } from '@/lib/utils'
import type { SanityEvent } from '@/sanity/lib/types'
import { EVENT_BY_SLUG_QUERY } from '../queries'

export const revalidate = 60 // Revalidate page every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await client.fetch<SanityEvent | null>(EVENT_BY_SLUG_QUERY, { slug })
  if (!event) return { title: 'Подію не знайдено' }

  const plainDescription =
    event.description || (event.body ? toPlainText(event.body) : undefined)

  return {
    title: `${event.title} | Події | Церква «Нове Життя»`,
    description: plainDescription?.substring(0, 160),
    alternates: { canonical: `/events/${slug}` },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [event, settings, heroes] = await Promise.all([
    client.fetch<SanityEvent | null>(EVENT_BY_SLUG_QUERY, { slug }),
    getSiteSettings(),
    getPageHeroes(),
  ])

  if (!event) notFound()

  const imageUrl = event.image ? urlFor(event.image).width(1600).height(900).url() : null

  // Event JSON-LD — only for actual events (not announcements).
  const eventJsonLd =
    event.type === 'подія'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          startDate: event.startDate,
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: event.location || settings.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: settings.address.street,
              addressLocality: settings.address.city,
              addressRegion: settings.address.region,
              postalCode: settings.address.postalCode,
              addressCountry: settings.address.country,
            },
          },
          ...(event.description || event.body
            ? {
                description:
                  event.description || (event.body ? toPlainText(event.body) : undefined),
              }
            : {}),
          ...(imageUrl ? { image: imageUrl } : {}),
          organizer: { '@type': 'Organization', name: settings.name, url: SITE_URL },
        }
      : null

  const badge = event.tag || (event.type === 'оголошення' ? 'Оголошення' : 'Подія')

  return (
    <>
      {eventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(eventJsonLd) }}
        />
      )}

      {/* Hero */}
      <section className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src={heroes.eventsHero}
          alt=""
          fill
          priority
          sizes="100vw"
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
            {event.title}
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
                <Link href="/events" className="hover:text-white transition-colors">
                  Події
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white/55">{event.title}</li>
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
                {formatEventDate(event.startDate)}
              </span>
              <span className="bg-grad text-white text-xs font-semibold px-3 py-1 rounded">
                {badge}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <i className="fas fa-map-marker-alt" />
                  {event.location}
                </span>
              )}
            </div>

            {/* Image */}
            {imageUrl && (
              <div
                className="relative rounded-xl overflow-hidden mb-8"
                style={{ aspectRatio: '16 / 9' }}
              >
                <Image
                  src={urlFor(event.image!).width(1200).height(675).url()}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Body */}
            <div className="max-w-none">
              <PortableTextBody value={event.body ?? event.description} />
            </div>

            {/* Back link */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Повернутися до подій
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
