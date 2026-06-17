import Image from 'next/image'
import Link from 'next/link'

// =========================================
// PageHero — Shared frosted-glass hero
// Used on: History, Ministry Detail, etc.
// =========================================

export interface Breadcrumb {
  label: string
  href?: string
}

export interface PageHeroProps {
  title: string
  backgroundImage?: string
  breadcrumbs?: Breadcrumb[]
  className?: string
}

export function PageHero({
  title,
  backgroundImage = '/images/ministries-hero.jpg',
  breadcrumbs = [],
  className,
}: PageHeroProps) {
  return (
    <section
      className={`relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden ${className || ''}`}
    >
      {/* Background image (optimized; decorative — empty alt) */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-10"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Frosted glass card */}
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
          {title}
        </h1>
        {breadcrumbs.length > 0 && (
          <nav>
            <ol className="flex items-center justify-center gap-1.5 text-white/75 text-xs sm:text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <span className="text-white/40">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/55">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  )
}

export default PageHero
