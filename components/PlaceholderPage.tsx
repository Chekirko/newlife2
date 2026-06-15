import Link from 'next/link'
import { PageHero } from './sections/PageHero'

// =========================================
// PlaceholderPage — shared "coming soon" page
// Used for routes that are linked in nav but not yet built
// (e.g. /about, /media, /privacy). Brand-styled, a11y-safe.
// =========================================

export interface PlaceholderPageProps {
  /** Page title (also the last breadcrumb and the <h1>) */
  title: string
  /** Short explanation of what will appear here */
  description?: string
  /** Hero background image (defaults to PageHero's own default) */
  backgroundImage?: string
}

export function PlaceholderPage({
  title,
  description = 'Ця сторінка зараз у розробці. Невдовзі тут зʼявиться корисний контент.',
  backgroundImage,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHero
        title={title}
        backgroundImage={backgroundImage}
        breadcrumbs={[{ label: 'Головна', href: '/' }, { label: title }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container-larexa">
          <div className="max-w-xl mx-auto text-center">
            <span className="bg-grad inline-flex w-16 h-16 rounded-full items-center justify-center mb-6">
              <i className="fas fa-screwdriver-wrench text-white text-2xl" aria-hidden="true" />
            </span>
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-gray-800 mb-3">
              Сторінка у розробці
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn btn-grad">
                На головну
              </Link>
              <Link href="/contact" className="btn btn-outline-grad">
                {'Зв\'язатися з нами'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PlaceholderPage
