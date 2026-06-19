import type { Metadata } from 'next'
import { PageHero } from '@/components'
import { ContactInfoCard } from './components/ContactInfoCard'
import { ContactForm } from './components/ContactForm'
import { MapEmbed } from './components/MapEmbed'
import { getSiteSettings } from '@/lib/site-settings'
import { getPageHeroes } from '@/lib/page-heroes'

export const metadata: Metadata = {
  title: 'Контакти | Церква «Нове Життя»',
  description:
    'Контактна інформація церкви «Нове Життя» в м. Борислав. Адреса, телефон, розклад богослужінь та форма зворотного зв\'язку.',
  alternates: { canonical: '/contact' },
}

// SVG icons for contact cards
const MapIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default async function ContactPage() {
  const [settings, heroes] = await Promise.all([getSiteSettings(), getPageHeroes()])
  const { address, email, phone, phoneDisplay, geo, services } = settings

  // Google Maps embed centered on the church's exact pin (no API key needed).
  const googleMapsEmbed = `https://maps.google.com/maps?q=${geo.lat},${geo.lng}&z=17&hl=uk&output=embed`

  return (
    <>
      <PageHero
        title="Контакти"
        backgroundImage={heroes.contactHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Контакти' },
        ]}
      />

      {/* Main Contact Section */}
      <section className="py-12 md:py-20">
        <div className="container-larexa">
          {/* Section Title */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
              Як ми можемо допомогти?
            </h2>
            <p className="text-gray-500 text-base">
              Ми завжди раді вітати нових людей. Зв&apos;яжіться з нами будь-яким зручним способом
              або завітайте на богослужіння.
            </p>
          </div>

          {/* 3-Column Grid: Info | Map | Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Contact Info Card — dark background with image overlay */}
            <div className="md:col-span-3">
              <div
                className="relative h-full rounded-xl overflow-hidden px-5 py-7 flex flex-col justify-between"
                style={{
                  backgroundImage: 'url(/images/hero-church-1.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 z-0" />

                <div className="relative z-10">
                  <ContactInfoCard icon={<MapIcon />} title="Адреса">
                    <p>{address.street},<br />{address.city},<br />{address.region}</p>
                  </ContactInfoCard>

                  <ContactInfoCard icon={<EmailIcon />} title="E-mail">
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                      {email}
                    </a>
                  </ContactInfoCard>

                  <ContactInfoCard icon={<PhoneIcon />} title="Телефон">
                    <p>
                      <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                        {phoneDisplay}
                      </a>
                    </p>
                  </ContactInfoCard>

                  {services.length > 0 && (
                    <ContactInfoCard icon={<ClockIcon />} title="Розклад">
                      <p>
                        {services.map((s, idx) => (
                          <span key={idx}>
                            {s.day}: {s.time}
                            {idx < services.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </ContactInfoCard>
                  )}
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="md:col-span-3">
              <MapEmbed
                src={googleMapsEmbed}
                className="h-full min-h-[400px] md:min-h-0"
              />
            </div>

            {/* Contact Form */}
            <div className="md:col-span-6">
              <div className="h-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Info Section */}
      <section className="pb-12 md:pb-16">
        <div className="container-larexa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <h5 className="font-heading font-semibold text-gray-800 mb-2">Молитовна підтримка</h5>
              <p className="text-gray-500 text-sm">
                Якщо вам потрібна молитва, напишіть на{' '}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
              </p>
            </div>
            <div>
              <h5 className="font-heading font-semibold text-gray-800 mb-2">Загальні питання</h5>
              <p className="text-gray-500 text-sm">
                Для загальних запитань або пропозицій{' '}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
