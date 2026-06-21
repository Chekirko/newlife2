'use client'

import Link from 'next/link'

// =========================================
// AboutWithStats - Simple Text with Stats
// Extracted from Larexa About (variant 3)
// =========================================
export interface AboutStat {
  value: string
  label: string
}

export interface AboutWithStatsProps {
  preTitle?: string
  title: string
  description?: string
  description2?: string
  stats?: AboutStat[]
  buttonText?: string
  buttonHref?: string
  className?: string
}

export const AboutWithStats = ({
  preTitle,
  title,
  description,
  description2,
  stats = [],
  buttonText,
  buttonHref,
  className,
}: AboutWithStatsProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            {preTitle && <span className="pre-title">{preTitle}</span>}
            <h2 className="text-4xl mb-4">{title}</h2>
            {description && <p className="text-lg leading-relaxed">{description}</p>}
            {description2 && <p className="leading-relaxed">{description2}</p>}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad mt-4">
                {buttonText}
              </Link>
            )}
          </div>

          {stats.length > 0 && (
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center bg-gray-100 rounded-2xl px-6 py-8">
                    <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="m-0 text-gray-600 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutWithStats
