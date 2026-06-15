import {
  HeroSlider,
  HeroGradientImage,
  NewsSlider,
} from '@/components'
import dynamic from 'next/dynamic'
import { AboutWithStats } from './components/AboutWithStats'
const TestimonialsGrid = dynamic(() => import('./components/TestimonialsGrid').then(m => m.TestimonialsGrid))
const FAQSplit = dynamic(() => import('./components/FAQSplit').then(m => m.FAQSplit))
import { type FAQItem } from './components/FAQSplit'
const ActionBoxFullWidth = dynamic(() => import('./components/ActionBoxFullWidth').then(m => m.ActionBoxFullWidth))
import { PastorGreeting } from './components/PastorGreeting'
import { OurVision } from './components/OurVision'
import { Ministries, type MinistryItem } from './components/Ministries'
import { EventsSlider } from './components/EventsSlider'
import { client } from '@/sanity/lib/client'
import { NEWS_QUERY } from '@/sanity/lib/queries'
import { EVENTS_QUERY } from './queries'
import type { SanityNews, SanityEvent } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { SITE_URL } from '@/lib/site'
import { getSiteSettings } from '@/lib/site-settings'
import { getHomepage } from '@/lib/homepage'

// ============================================
// HOMEPAGE - Церква "Нове Життя"
// Using actual Larexa components
// ============================================

import { formatDate } from '@/lib/utils'

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function HomePage() {
  // Fetch news, events, site settings and homepage content from Sanity
  const [newsRaw, eventsRaw, settings, homepage] = await Promise.all([
    client.fetch<SanityNews[]>(NEWS_QUERY),
    client.fetch<SanityEvent[]>(EVENTS_QUERY),
    getSiteSettings(),
    getHomepage(),
  ])

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
    image: e.image ? urlFor(e.image).width(600).height(400).url() : '/images/placeholder.jpg',
    date: e.date,
    tag: e.tag,
    description: e.description,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
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
      />

      {/* PASTOR WELCOME - PastorGreeting з Larexa demo style */}
      <PastorGreeting
        preTitle="Вітання пастора"
        title="Ласкаво просимо до нашої церковної родини"
        subtitle="Наша дружня команда завжди готова допомогти вам зрозуміти ваші духовні потреби та підтримати на шляху віри."
        description="Дорогі друзі! Я вірю, що ваш візит на наш сайт — не випадковість. Бог має чудовий план для вашого життя, і ми хочемо допомогти вам відкрити його."
        description2="У церкві «Нове Життя» ви знайдете теплу атмосферу, щирі стосунки та можливість зростати духовно. Ми віримо, що разом ми можемо змінювати наше місто та світ навколо."
        quote={{
          author: 'Пастор Іван Петренко',
          role: 'Старший пастор церкви'
        }}
        image="/images/pastor-welcome.jpg"
      />

      {/* WHAT YOU'LL FIND - Що ви знайдете в церкві */}
      <Ministries
        preTitle="Що ви знайдете"
        title="Більше, ніж просто церква"
        description="Церква — це місце, де кожен може знайти спільноту, підтримку та духовне зростання."
        items={whatYouFindItems}
        columns={3}
        className="bg-gray-100"
      />

      {/* SERVICE SCHEDULE - HeroGradientImage з Larexa (як CTA) */}
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

      {/* ABOUT WITH STATS - AboutWithStats з Larexa */}
      <AboutWithStats
        preTitle="Про нашу церкву"
        title="Ми — спільнота віруючих людей"
        description="Церква «Нове Життя» заснована у 2005 році. За ці роки ми виросли з маленької групи в велику церковну сім'ю."
        description2="Наша місія — допомагати людям знайти Бога, будувати міцні стосунки та служити громаді."
        stats={churchStats}
        buttonText="Дізнатися більше"
        buttonHref="/about"
        className="py-16 lg:py-24"
      />

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
        items={faqItems}
        contactTitle="Залишились питання?"
        contactDescription="Не знайшли відповідь? Зв'яжіться з нами, і ми з радістю допоможемо!"
        contactButtonText="Зв'язатися"
        contactButtonHref="/contact"
        className="py-16 lg:py-24"
      />

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

// ============================================
// DATA - What You'll Find Items (static — UI content)
// ============================================
const whatYouFindItems: MinistryItem[] = [
  {
    icon: 'fas fa-book-bible',
    title: 'Проповідь Слова Божого',
    description: 'Зрозуміле викладання Біблії, яке допомагає застосувати біблійні принципи у повсякденному житті та дає відповіді на важливі питання.',
    image: '/images/action1.jpg',
  },
  {
    icon: 'fas fa-music',
    title: 'Прославлення',
    description: 'Жива музика, щирі пісні та атмосфера Божої присутності, де ви можете вільно висловити свою любов до Бога.',
    image: '/images/action2.jpg',
  },
  {
    icon: 'fas fa-heart',
    title: 'Дружня спільнота',
    description: 'Теплі стосунки, щира дружба та люди, які стануть для вас справжньою сім\'єю у вірі.',
    image: '/images/action3.jpg',
  },
  {
    icon: 'fas fa-hands-helping',
    title: 'Практична допомога',
    description: 'Підтримка у складних життєвих ситуаціях: душпастирська опіка, матеріальна допомога та молитвенна підтримка.',
    image: '/images/action4.jpg',
  },
  {
    icon: 'fas fa-child',
    title: 'Робота з молоддю та дітьми',
    description: 'Цікаві програми для молоді та дітей, де вони можуть розвиватися, дружити та пізнавати Бога.',
    image: '/images/action5.jpg',
  },
  {
    icon: 'fas fa-door-open',
    title: 'Атмосфера прийняття',
    description: 'Місце, де вас приймуть такими, якими ви є, без осуду. Божа любов для кожного.',
    image: '/images/action6.jpg',
  },
]

// ============================================
// DATA - Church Stats (static)
// ============================================
const churchStats = [
  { value: '19+', label: 'Років служіння' },
  { value: '350+', label: 'Членів церкви' },
  { value: '6', label: 'Служінь' },
  { value: '50+', label: 'Волонтерів' },
]

// ============================================
// DATA - FAQ Items (static)
// ============================================
const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Який дрес-код у церкві?',
    answer: 'У нас немає суворого дрес-коду. Одягайтеся так, як вам комфортно. Більшість людей приходять у повсякденному одязі.'
  },
  {
    id: '2',
    question: 'Де залишити дітей під час богослужіння?',
    answer: 'У нас є дитяче служіння для різних вікових груп, яке проходить одночасно з дорослим богослужінням. Волонтери зустрінуть вас біля входу.'
  },
  {
    id: '3',
    question: 'Чи є парковка біля церкви?',
    answer: 'Так, у нас є безкоштовна парковка біля будівлі церкви. Волонтери допоможуть вам знайти місце для паркування.'
  },
  {
    id: '4',
    question: 'Скільки триває богослужіння?',
    answer: 'Недільне богослужіння зазвичай триває близько 1,5 години і включає час прославлення, проповідь та спільну молитву.'
  },
  {
    id: '5',
    question: 'Чи потрібно бути членом церкви?',
    answer: 'Ні, членство не є обов\'язковим для відвідування. Ми раді всім гостям!'
  },
]
