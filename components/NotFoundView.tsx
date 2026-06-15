import Link from 'next/link'

// =========================================
// NotFoundView — shared 404 body
// Reused by app/(front)/not-found.tsx (in-site bad slugs, gets chrome
// from the front layout) and app/not-found.tsx (unmatched URLs, which
// wraps it with header/footer manually).
// =========================================

const quickLinks = [
  { label: 'Служіння', href: '/ministries' },
  { label: 'Новини', href: '/news' },
  { label: 'Команда', href: '/team' },
  { label: 'Контакти', href: '/contact' },
]

export function NotFoundView() {
  return (
    <section className="min-h-[60vh] flex items-center py-16 lg:py-24">
      <div className="container-larexa">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="bg-grad bg-clip-text text-transparent font-heading font-bold text-7xl lg:text-8xl leading-none"
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="font-heading font-bold text-2xl lg:text-3xl text-gray-800 mt-4 mb-3">
            Сторінку не знайдено
          </h1>
          <p className="text-gray-700 leading-relaxed mb-8">
            Можливо, сторінку переміщено або видалено, а посилання застаріло.
            Перевірте адресу або скористайтеся посиланнями нижче.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn btn-grad">
              На головну
            </Link>
            <Link href="/contact" className="btn btn-outline-grad">
              Зв&apos;язатися з нами
            </Link>
          </div>

          <nav aria-label="Корисні посилання" className="mt-10 pt-8 border-t border-gray-200">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary hover:underline focus-visible:underline focus-visible:outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}

export default NotFoundView
