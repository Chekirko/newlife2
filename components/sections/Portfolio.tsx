'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// PORTFOLIO ITEM INTERFACE
// =========================================
export interface PortfolioItem {
  id: string
  image: string | StaticImageData
  title: string
  category: string
  description?: string
  href?: string
  tags?: string[]
}

// =========================================
// PORTFOLIO VARIANT 1: Filterable Grid
// =========================================
export interface PortfolioSectionProps {
  preTitle?: string
  title?: string
  description?: string
  items: PortfolioItem[]
  columns?: 2 | 3 | 4
  showFilter?: boolean
  allLabel?: string
  className?: string
}

export const PortfolioSection = ({
  preTitle,
  title,
  description,
  items,
  columns = 3,
  showFilter = true,
  allLabel = 'All',
  className,
}: PortfolioSectionProps) => {
  const categories = [...new Set(items.map(item => item.category))]
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filteredItems = activeFilter 
    ? items.filter(item => item.category === activeFilter)
    : items

  const columnClasses = {
    2: 'w-full md:w-1/2',
    3: 'w-full md:w-1/2 lg:w-1/3',
    4: 'w-full sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
              {description && <p className="mb-0">{description}</p>}
            </div>
          </div>
        )}

        {showFilter && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={clsx(
                'px-4 py-2 rounded transition-colors',
                activeFilter === null
                  ? 'bg-grad text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {allLabel}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={clsx(
                  'px-4 py-2 rounded transition-colors',
                  activeFilter === cat
                    ? 'bg-grad text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap -mx-3">
          {filteredItems.map((item) => (
            <div key={item.id} className={clsx('px-3 mb-6', columnClasses[columns])}>
              <div className="portfolio-item group relative overflow-hidden rounded">
                <Image 
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="portfolio-overlay absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h4 className="text-white">{item.title}</h4>
                  <span className="text-white/70">{item.category}</span>
                  {item.href && (
                    <Link href={item.href} className="btn btn-sm btn-white mt-3">
                      View Project
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// PORTFOLIO VARIANT 2: Masonry Grid
// =========================================
export interface PortfolioMasonryProps {
  items: PortfolioItem[]
  className?: string
}

export const PortfolioMasonry = ({
  items,
  className,
}: PortfolioMasonryProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <div className="portfolio-item group relative overflow-hidden rounded">
                <Image 
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h5 className="text-white m-0">{item.title}</h5>
                  <span className="text-white/70 text-sm">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// PORTFOLIO VARIANT 3: Full Width Slider
// =========================================
export interface PortfolioFullWidthProps {
  items: PortfolioItem[]
  showDetails?: boolean
  className?: string
}

export const PortfolioFullWidth = ({
  items,
  showDetails = true,
  className,
}: PortfolioFullWidthProps) => {
  return (
    <section className={clsx('p-0', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="portfolio-item group relative overflow-hidden">
            <Image 
              src={item.image}
              alt={item.title}
              width={400}
              height={400}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {showDetails && (
              <div className="portfolio-overlay absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                <h5 className="text-white">{item.title}</h5>
                <span className="text-white/70">{item.category}</span>
                {item.href && (
                  <Link href={item.href} className="btn btn-sm btn-outline-white mt-3">
                    <i className="fas fa-arrow-right" />
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// =========================================
// PORTFOLIO VARIANT 4: Company Portfolio
// (portfolio-modern demo style)
// =========================================
export interface CompanyPortfolioProps {
  preTitle?: string
  title?: string
  items: PortfolioItem[]
  buttonText?: string
  buttonHref?: string
  className?: string
}

export const CompanyPortfolio = ({
  preTitle,
  title,
  items,
  buttonText,
  buttonHref,
  className,
}: CompanyPortfolioProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4 items-center">
          {/* Left content */}
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            {preTitle && <span className="pre-title">{preTitle}</span>}
            {title && <h2>{title}</h2>}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad mt-4">
                {buttonText}
              </Link>
            )}
          </div>

          {/* Right portfolio items */}
          <div className="w-full md:w-2/3 px-4">
            <div className="grid grid-cols-2 gap-4">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="portfolio-item group relative overflow-hidden rounded">
                  <Image 
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link href={item.href || '#'} className="text-white text-xl">
                      <i className="fas fa-plus" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { PortfolioSection as Portfolio }
export default PortfolioSection
