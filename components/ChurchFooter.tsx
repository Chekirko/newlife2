import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import Image from '@/components/ui/SiteImage'
import { defineQuery } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import type { SiteSettings } from '@/lib/site-settings'

const quickLinks = [
  { label: 'Про нас', href: '/about' },
  { label: 'Служіння', href: '/ministries' },
  { label: 'Новини', href: '/news' },
  { label: 'Контакти', href: '/contact' },
  { label: 'Відео', href: '/media' },
  { label: 'Фото', href: '/media/photos' },
]

// Top ministries for the footer column — dynamic so links never 404.
const FOOTER_MINISTRIES_QUERY = defineQuery(`
  *[_type == "ministry"] | order(order asc, title asc)[0...5]{
    _id,
    title,
    "slug": slug.current
  }
`)

type FooterMinistry = { _id: string; title: string; slug: string | null }

export default async function ChurchFooter({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear()
  const ministries = await client.fetch<FooterMinistry[]>(FOOTER_MINISTRIES_QUERY)
  const { address, phone, phoneDisplay, email, social, services } = settings

  return (
    <footer className="footer">
      <div className="container-larexa">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <Link href="/" aria-label="Церква «Нове життя» — головна" className="mb-6 inline-flex max-w-full">
              <Image
                src="/images/logo-white.svg"
                alt="Нове життя — церква, м. Борислав"
                width={1203}
                height={461}
                className="h-auto w-56 max-w-full"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом 
              та ділитися любов&apos;ю Христа з кожним.
            </p>
            <div className="social-icons">
              <ul className="flex gap-2">
                {social.map((s) => (
                  <li key={s.platform + s.url} className="social-icons-item">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      style={{ backgroundColor: s.color }}
                      className="social-icons-link rounded-full text-white"
                    >
                      <Icon className={s.icon}></Icon>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="footer-title">Швидкі посилання</h2>
            <ul className="footer-links">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    <Icon className="fas fa-chevron-right text-xs mr-2 text-primary"></Icon>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministry Links */}
          <div>
            <h2 className="footer-title">Служіння</h2>
            <ul className="footer-links">
              {ministries.length > 0 ? (
                ministries.map((m) =>
                  m.slug ? (
                    <li key={m._id}>
                      <Link href={`/ministries/${m.slug}`} className="hover:text-white transition-colors">
                        <Icon className="fas fa-chevron-right text-xs mr-2 text-primary"></Icon>
                        {m.title}
                      </Link>
                    </li>
                  ) : null,
                )
              ) : (
                <li>
                  <Link href="/ministries" className="hover:text-white transition-colors">
                    <Icon className="fas fa-chevron-right text-xs mr-2 text-primary"></Icon>
                    Усі служіння
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="footer-title">Контакти</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Icon className="fas fa-map-marker-alt text-primary mt-1"></Icon>
                <span>
                  {address.street},<br />
                  {address.city}, {address.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon className="fas fa-phone text-primary"></Icon>
                <a href={`tel:${phone}`} className="hover:text-white">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon className="fas fa-envelope text-primary"></Icon>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              {services.length > 0 && (
                <li className="flex items-start gap-3">
                  <Icon className="far fa-clock text-primary mt-1"></Icon>
                  <span>
                    {services.map((s, idx) => (
                      <span key={idx}>
                        {s.day}: {s.time}
                        {idx < services.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="m-0">
              © {currentYear} Церква «Нове Життя». Всі права захищено.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="hover:text-white">
                Політика конфіденційності
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
