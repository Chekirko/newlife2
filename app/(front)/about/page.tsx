import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components'
import { AboutWithStats } from '../components/AboutWithStats'
import { getPageHeroes } from '@/lib/page-heroes'
import { getHomepage } from '@/lib/homepage'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { jsonLdHtml } from '@/lib/utils'
import {
  ABOUT_DENOMINATION,
  ABOUT_MISSION,
  ABOUT_HISTORY,
  ABOUT_BELIEFS,
  ABOUT_VALUES,
  ABOUT_EXPECTATIONS,
  type AboutValue,
} from '@/lib/about-data'

// Line (outline) icons for the values bento — currentColor follows the card text.
const svgIcon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9" aria-hidden="true">
    {children}
  </svg>
)

const VALUE_ICONS: Record<string, ReactNode> = {
  heart: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />),
  book: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />),
  spirit: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />),
  community: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />),
  mercy: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.39 3.954a3.286 3.286 0 0 1 .39-3.954" />),
  mission: svgIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />),
}

function ValueCard({ value }: { value: AboutValue }) {
  const featured = value.featured
  return (
    <div className={`rounded-lg p-7 lg:p-8 ${featured ? 'bg-grad text-white' : 'bg-gray-50'}`}>
      <span className={`inline-block mb-5 ${featured ? 'text-white' : 'text-primary'}`}>
        {VALUE_ICONS[value.iconKey]}
      </span>
      <h3 className={`text-lg font-bold mb-2 ${featured ? 'text-white' : 'text-gray-800'}`}>{value.title}</h3>
      <p className={`text-sm leading-relaxed m-0 ${featured ? 'text-white/90' : 'text-gray-600'}`}>{value.text}</p>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Про нас | Церква «Нове Життя»',
  description:
    'Історія, місія, цінності та віровчення церкви «Нове Життя» у Бориславі — частини УЦХВЄ. Дізнайтеся, у що ми віримо і чого очікувати на богослужінні.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Про нас — Церква «Нове Життя»',
    description: 'Хто ми, наша історія, цінності та у що ми віримо.',
    url: `${SITE_URL}/about`,
    type: 'website',
  },
}

export const revalidate = 60

export default async function AboutPage() {
  const [heroes, homepage, settings] = await Promise.all([
    getPageHeroes(),
    getHomepage(),
    getSiteSettings(),
  ])

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `Про нас — ${settings.name}`,
    url: `${SITE_URL}/about`,
    description:
      'Історія, місія, цінності та віровчення церкви «Нове Життя» у Бориславі.',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website` },
    about: { '@type': 'Church', '@id': `${SITE_URL}/#church`, name: settings.name },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Про нас', item: `${SITE_URL}/about` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbJsonLd) }}
      />

      <PageHero
        title="Про нас"
        backgroundImage={heroes.aboutHero}
        breadcrumbs={[{ label: 'Головна', href: '/' }, { label: 'Про нас' }]}
      />

      {/* WHO WE ARE + MISSION */}
      <section className="py-16 lg:py-24">
        <div className="container-larexa max-w-4xl">
          <div className="text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
              Хто ми
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Спільнота, що знаходить щастя в Бозі й дарує його іншим
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {ABOUT_DENOMINATION}
            </p>
            <div className="bg-grad rounded-2xl p-8 lg:p-10 text-white">
              <span className="block text-base opacity-90 mb-2">Наша місія</span>
              <p className="text-xl lg:text-2xl font-semibold leading-snug m-0">
                {ABOUT_MISSION}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="py-16 lg:py-24 bg-gray-100">
        <div className="container-larexa max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
              Наш шлях
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
              Наша історія
            </h2>
          </div>
          <div className="space-y-5">
            {ABOUT_HISTORY.map((paragraph, idx) => (
              <p key={idx} className="text-gray-600 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Повна хронологія церкви
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* BELIEFS */}
      <section className="py-16 lg:py-24">
        <div className="container-larexa">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
              Наша віра
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              У що ми віримо
            </h2>
            <p className="text-gray-600 text-lg">
              Ключові істини нашого сповідання. Повне віровчення братства —{' '}
              <a
                href="https://www.chve.org.ua/doctrine/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                на сайті УЦХВЄ
              </a>
              .
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT_BELIEFS.map((belief) => (
              <div
                key={belief.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card hover:shadow-hover-lg transition-shadow border-t-4 border-t-primary"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{belief.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed m-0">{belief.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES — staggered 3-column "services" layout (intro integrated, one gradient card) */}
      <section className="py-16 lg:py-24">
        <div className="container-larexa">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-7">
            {/* Column 1 — intro + cards */}
            <div className="w-full lg:flex-1 flex flex-col gap-6">
              <div>
                <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
                  Що для нас важливо
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight mb-4">
                  Цінності, що нас формують
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Принципи, на яких будується наше служіння, спільнота та щоденне життя віри.
                </p>
              </div>
              <ValueCard value={ABOUT_VALUES[0]} />
              <ValueCard value={ABOUT_VALUES[5]} />
            </div>

            {/* Column 2 — offset down */}
            <div className="w-full lg:flex-1 flex flex-col gap-6 lg:mt-16">
              <ValueCard value={ABOUT_VALUES[1]} />
              <ValueCard value={ABOUT_VALUES[2]} />
            </div>

            {/* Column 3 — featured (gradient) on top */}
            <div className="w-full lg:flex-1 flex flex-col gap-6">
              <ValueCard value={ABOUT_VALUES[4]} />
              <ValueCard value={ABOUT_VALUES[3]} />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="py-16 lg:py-24">
        <div className="container-larexa">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
              Вперше у нас?
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Чого очікувати
            </h2>
            <p className="text-gray-600 text-lg">
              Ми розуміємо, що перший візит може хвилювати. Ось що на вас чекає.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT_EXPECTATIONS.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className={`${item.icon} text-primary text-lg`} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed m-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="btn btn-grad">
              Розклад і як нас знайти
            </Link>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-16 lg:py-24 bg-gray-100">
        <div className="container-larexa max-w-3xl text-center">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">
            Служителі
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Наше керівництво
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Церкву ведуть рукопокладені служителі — пастори, диякони та відповідальні за
            різні напрями служіння, які з любов’ю піклуються про спільноту.
          </p>
          <Link href="/team" className="btn btn-outline-grad">
            Познайомитися з командою
          </Link>
        </div>
      </section>

      {/* STATS (moved here from the homepage) */}
      <AboutWithStats
        preTitle="Церква в цифрах"
        title="Кілька штрихів про нас"
        description="За роки служіння Бог зробив чимало — і ми вдячні бути частиною цієї історії."
        stats={homepage.stats}
        className="py-16 lg:py-24"
      />

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container-larexa">
          <div
            className="rounded-2xl p-10 lg:p-14 text-center text-white"
            style={{ background: 'linear-gradient(150deg, #97c74e 0%, #2ab9a5 100%)' }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Готові зробити наступний крок?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Будемо раді познайомитися з вами особисто. Заплануйте свій перший візит або
              напишіть нам.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn btn-white">
                Запланувати візит
              </Link>
              <Link href="/ministries" className="btn btn-outline-white">
                Наші служіння
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
