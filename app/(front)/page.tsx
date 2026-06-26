import type { Metadata } from 'next'
import {
  HeroSlider,
  HeroGradientImage,
  NewsSlider,
} from '@/components'
import dynamic from 'next/dynamic'
const TestimonialsGrid = dynamic(() => import('./components/TestimonialsGrid').then(m => m.TestimonialsGrid))
const FAQSplit = dynamic(() => import('./components/FAQSplit').then(m => m.FAQSplit))
const ActionBoxFullWidth = dynamic(() => import('./components/ActionBoxFullWidth').then(m => m.ActionBoxFullWidth))
import { PastorGreeting } from './components/PastorGreeting'
import { OurVision } from './components/OurVision'
import { Ministries } from './components/Ministries'
import { EventsSlider } from './components/EventsSlider'
import { FeaturedSermon } from './components/FeaturedSermon'
import { client } from '@/sanity/lib/client'
import { NEWS_QUERY } from '@/sanity/lib/queries'
import { EVENTS_QUERY, SENIOR_PASTOR_QUERY } from './queries'
import { LATEST_SERMON_QUERY } from './media/queries'
import type { SanityNews, SanityEvent } from '@/sanity/lib/types'
import type { SENIOR_PASTOR_QUERYResult } from '@/sanity/lib/sanity.types'
import { toMediaCard, type RawMediaItem } from '@/lib/media'
import { urlFor } from '@/sanity/lib/image'
import { SITE_URL } from '@/lib/site'
import { getSiteSettings } from '@/lib/site-settings'
import { getHomepage } from '@/lib/homepage'

// ============================================
// HOMEPAGE - Церква "Нове Життя"
// Using actual Larexa components
// ============================================

import { formatDate, formatEventDate, jsonLdHtml } from '@/lib/utils'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function HomePage() {
  // Fetch news, events, site settings and homepage content from Sanity.
  // Homepage events: type "подія" hides after its own day (startDate >= start of today),
  // type "оголошення" stays until activeUntil/startDate >= now — see EVENTS_QUERY.
  const _now = new Date()
  const eventParams = {
    now: _now.toISOString(),
    today: new Date(_now.getFullYear(), _now.getMonth(), _now.getDate()).toISOString(),
  }
  const [newsRaw, eventsRaw, settings, homepage, pastor, latestSermonRaw] = await Promise.all([
    client.fetch<SanityNews[]>(NEWS_QUERY),
    client.fetch<SanityEvent[]>(EVENTS_QUERY, eventParams),
    getSiteSettings(),
    getHomepage(),
    client.fetch<SENIOR_PASTOR_QUERYResult>(SENIOR_PASTOR_QUERY),
    client.fetch<RawMediaItem | null>(LATEST_SERMON_QUERY),
  ])

  // "Актуальне слово": the manually-picked sermon (homepage.featuredSermon) wins;
  // otherwise fall back to the newest sermon. Null → section is hidden.
  const sermonRaw = homepage.featuredSermon ?? latestSermonRaw
  const featuredSermon = sermonRaw ? toMediaCard(sermonRaw) : null

  // Transform Sanity data for components
  const newsData = newsRaw.map((n) => ({
    _id: n._id,
    title: n.title,
    slug: n.slug,
    date: formatDate(n.publishedAt),
    mainCategory: n.mainCategory,
    categories: n.categories,
    text: n.text,
    image: n.image ? urlFor(n.image).width(600).height(400).url() : '/images/placeholder.jpg',
  }))

  const eventsData = eventsRaw.map((e) => ({
    _id: e._id,
    title: e.title,
    slug: e.slug,
    image: e.image ? urlFor(e.image).width(800).height(533).url() : '/images/placeholder.jpg',
    date: formatEventDate(e.startDate),
    tag: e.tag,
    description: e.description ?? '',
  }))

  const churchJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Church',
        '@id': `${SITE_URL}/#church`,
        name: settings.name,
        legalName: settings.legalName,
        url: SITE_URL,
        email: settings.email,
        telephone: settings.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address.street,
          addressLocality: settings.address.city,
          addressRegion: settings.address.region,
          postalCode: settings.address.postalCode,
          addressCountry: settings.address.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: settings.geo.lat,
          longitude: settings.geo.lng,
        },
        sameAs: settings.sameAs,
        ...(settings.openingHours.length > 0 && {
          openingHoursSpecification: settings.openingHours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes,
          })),
        }),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.name,
        inLanguage: 'uk',
      },
    ],
  }

  // Service schedule line for the CTA — built from CMS data (single source of truth).
  const scheduleSummary = settings.services
    .map((s) => `${s.day} ${s.time}${s.endTime ? `–${s.endTime}` : ''} — ${s.label}`)
    .join(' | ')

  // FAQPage JSON-LD — built from the same homepage FAQ data shown on the page.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homepage.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(churchJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd) }}
      />

      {/* HERO SECTION - HeroSlider з Larexa (slides from Sanity homepage singleton) */}
      <HeroSlider
        slides={homepage.heroSlides}
        height="h-[500px] lg:h-[750px]"
        autoplay={true}
        autoplaySpeed={6000}
        showArrows={true}
        showDots={true}
      />

      {/* EVENTS - EventsSlider (під Hero) */}
      {eventsData.length > 0 && (
        <EventsSlider
          preTitle="Не пропустіть"
          title="Найближчі події"
          description="Анонси подій та заходів нашої церкви"
          events={eventsData}
          className="bg-gray-100"
        />
      )}

      {/* OUR VISION - Before Pastor Greeting */}
      <OurVision
        preTitle="Хто ми"
        title="Люди, які знаходять Щастя і  дарують Його іншим"
        subtitle="Церква «Нове Життя» — це спільнота людей, які вірять у силу Божої любові та прагнуть ділитися нею з кожним."
        visionHighlight="Наша місія —"
        visionText="Допомагати кожній людині пізнати Бога як джерело істинного Щастя, відновлювати сім'ї та служити громаді через практичну любов, змінюючи атмосферу в Україні."
        image1="/images/vision1.jpg"
        image2="/images/vision2.jpg"
        ctaText="Дізнатися більше про нас"
        ctaHref="/about"
      />

      {/* PASTOR WELCOME - PastorGreeting з Larexa demo style */}
      <PastorGreeting
        preTitle="Вітання пастора"
        title="Ласкаво просимо до нашої церковної родини"
        subtitle="Наша дружня команда завжди готова допомогти вам зрозуміти ваші духовні потреби та підтримати на шляху віри."
        description="Дорогі друзі! Я вірю, що ваш візит на наш сайт — не випадковість. Бог має чудовий план для вашого життя, і ми хочемо допомогти вам відкрити його."
        description2="У церкві «Нове Життя» ви знайдете теплу атмосферу, щирі стосунки та можливість зростати духовно. Ми віримо, що разом ми можемо змінювати наше місто та світ навколо."
        quote={{
          author: pastor?.name ?? 'Пастор',
          role: pastor?.title ?? 'Старший пастор',
        }}
        image={pastor?.photo ? urlFor(pastor.photo).width(800).height(800).url() : '/images/pastor-welcome.jpg'}
      />

      {/* SERVICE SCHEDULE - розклад богослужінь рано (коли/де — ключове для гостя) */}
      <HeroGradientImage
        preTitle="Приєднуйтесь до нас"
        title="Розклад богослужінь"
        subtitle={scheduleSummary}
        primaryButtonText="Запланувати візит"
        primaryButtonHref="/contact"
        secondaryButtonText="Як нас знайти"
        secondaryButtonHref="/contact#map"
        showWaveDivider={true}
        className="py-12"
      />

      {/* WHAT YOU'LL FIND - Що ви знайдете в церкві */}
      <Ministries
        preTitle="Що ви знайдете"
        title="Більше, ніж просто церква"
        description="Церква — це місце, де кожен може знайти спільноту, підтримку та духовне зростання."
        items={homepage.whatYouFind}
        columns={3}
        className="bg-gray-100"
      />

      {/* NEWS - NewsSlider (після розкладу богослужінь) */}
      {newsData.length > 0 && (
        <NewsSlider
          preTitle="Останні новини"
          title="Що нового в церкві"
          description="Новини та оновлення з життя нашої спільноти"
          news={newsData}
          className="bg-gray-50"
        />
      )}

      {/* TESTIMONIALS - TestimonialsGrid з Larexa */}
      <TestimonialsGrid
        preTitle="Свідчення"
        title="Що кажуть наші члени"
        testimonials={homepage.testimonials}
        columns={2}
        className="py-16 lg:py-24 bg-gray-100"
      />

      {/* FAQ - FAQSplit з Larexa */}
      <FAQSplit
        title="Часті запитання"
        description="Ми розуміємо, що перший візит до нової церкви може викликати питання. Ось відповіді на найпоширеніші з них."
        items={homepage.faq}
        contactTitle="Залишились питання?"
        contactDescription="Не знайшли відповідь? Зв'яжіться з нами, і ми з радістю допоможемо!"
        contactButtonText="Зв'язатися"
        contactButtonHref="/contact"
        className="py-16 lg:py-24"
      />

      {/* ACTUAL WORD - «Актуальне слово» (ручний вибір у Studio або найновіша) */}
      {featuredSermon && <FeaturedSermon sermon={featuredSermon} />}

      {/* CONNECT CTA - ActionBoxFullWidth з Larexa (has subtitle and multiple buttons) */}
      <ActionBoxFullWidth
        title="Готові зробити наступний крок?"
        subtitle="Ми будемо раді познайомитися з вами особисто. Заплануйте свій перший візит або зв'яжіться з нами."
        buttonText="Запланувати візит"
        buttonHref="/contact"
        secondaryButtonText="Дізнатися більше"
        secondaryButtonHref="/about"
        isGradient={true}
        className="py-16 lg:py-20"
      />
    </>
  )
}

