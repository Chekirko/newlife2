import Link from 'next/link'

const quickLinks = [
  { label: 'Про нас', href: '/about' },
  { label: 'Служіння', href: '/ministries' },
  { label: 'Новини', href: '/news' },
  { label: 'Контакти', href: '/contact' },
  { label: 'Медіа', href: '/media' },
]

const ministryLinks = [
  { label: 'Дитяче служіння', href: '/ministries/children' },
  { label: 'Молодіжне служіння', href: '/ministries/youth' },
  { label: 'Жіноче служіння', href: '/ministries/women' },
  { label: 'Чоловіче служіння', href: '/ministries/men' },
  { label: 'Музичне служіння', href: '/ministries/worship' },
]

export default function ChurchFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container-larexa">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">НЖ</span>
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-white block leading-tight">
                  Нове Життя
                </span>
                <span className="text-xs text-gray-400">
                  Євангельська церква
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом 
              та ділитися любов'ю Христа з кожним.
            </p>
            <div className="social-icons si-colored-bg">
              <ul className="flex gap-2">
                <li className="social-icons-item social-facebook">
                  <a href="#" className="social-icons-link rounded-full"><i className="fab fa-facebook-f"></i></a>
                </li>
                <li className="social-icons-item social-instagram">
                  <a href="#" className="social-icons-link rounded-full"><i className="fab fa-instagram"></i></a>
                </li>
                <li className="social-icons-item social-youtube">
                  <a href="#" className="social-icons-link rounded-full"><i className="fab fa-youtube"></i></a>
                </li>
                <li className="social-icons-item social-telegram">
                  <a href="#" className="social-icons-link rounded-full bg-[#0088cc]"><i className="fab fa-telegram-plane"></i></a>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Швидкі посилання</h4>
            <ul className="footer-links">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-primary"></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministry Links */}
          <div>
            <h4 className="footer-title">Служіння</h4>
            <ul className="footer-links">
              {ministryLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-primary"></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-title">Контакти</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                <span>
                  м. Борислав,<br />
                  вул. Шевченка 45
                </span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-primary"></i>
                <a href="tel:+380501234567" className="hover:text-white">
                  +38 (050) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-primary"></i>
                <a href="mailto:info@newlife.church" className="hover:text-white">
                  info@newlife.church
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="far fa-clock text-primary mt-1"></i>
                <span>
                  Неділя: 10:00 — 12:00<br />
                  Середа: 18:00 — 19:30
                </span>
              </li>
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
              <Link href="/sitemap" className="hover:text-white">
                Карта сайту
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
