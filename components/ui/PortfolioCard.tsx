import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =====================
// Portfolio Card Variants
// =====================
export type PortfolioCardVariant = 'default' | 'style-2'

// =====================
// Props Interface
// =====================
export interface PortfolioCardProps {
  title: string
  category?: string
  image: string | StaticImageData
  href?: string
  lightboxHref?: string
  variant?: PortfolioCardVariant
  className?: string
}

// =====================
// Portfolio Card Component
// =====================
export const PortfolioCard = ({
  title,
  category,
  image,
  href = '#',
  lightboxHref,
  variant = 'default',
  className,
}: PortfolioCardProps) => {
  const isStyle2 = variant === 'style-2'

  return (
    <div className={clsx(
      'portfolio-card',
      isStyle2 && 'portfolio-style-2',
      className
    )}>
      <div className="portfolio-card-body">
        {/* Image */}
        <div className="portfolio-card-header">
          <Image 
            src={image} 
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Footer/Info */}
        <div className="portfolio-card-footer">
          {/* Lightbox button */}
          {lightboxHref && (
            <button 
              className="full-screen"
              aria-label="View fullscreen"
            >
              <i className="ti-fullscreen" />
            </button>
          )}

          {/* Title */}
          <h5 className="info-title">
            <Link href={href}>{title}</Link>
          </h5>

          {/* Category */}
          {category && (
            <p className={isStyle2 ? 'text-white' : 'text-gray-600'}>
              {category}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// =====================
// Portfolio Grid Container
// =====================
export type PortfolioGridColumns = 2 | 3 | 4 | 5 | 6

export interface PortfolioGridProps {
  children: React.ReactNode
  columns?: PortfolioGridColumns
  variant?: PortfolioCardVariant
  withPadding?: boolean
  className?: string
}

export const PortfolioGrid = ({
  children,
  columns = 3,
  variant = 'default',
  withPadding = false,
  className,
}: PortfolioGridProps) => {
  return (
    <div className={clsx(
      'portfolio clearfix',
      variant === 'style-2' && 'portfolio-style-2',
      `items-${columns}`,
      withPadding && 'items-padding',
      className
    )}>
      {children}
    </div>
  )
}

// =====================
// Portfolio Filter
// =====================
export interface PortfolioFilterItem {
  id: string
  label: string
}

export interface PortfolioFilterProps {
  items: PortfolioFilterItem[]
  activeId?: string
  onFilterChange?: (id: string) => void
  style?: 1 | 2 | 3 | 4
  className?: string
}

export const PortfolioFilter = ({
  items,
  activeId = 'all',
  onFilterChange,
  style = 1,
  className,
}: PortfolioFilterProps) => {
  const styleClass = style > 1 ? `nav-tabs-style-${style}` : ''

  return (
    <nav className={clsx('portfolio-filter mb-6', className)}>
      <ul className={clsx('nav nav-tabs flex gap-4 justify-center', styleClass)}>
        {items.map((item) => (
          <li key={item.id} className="nav-filter">
            <button
              className={clsx(
                'px-3 py-2 text-gray-800 transition-colors',
                activeId === item.id && 'text-primary active'
              )}
              onClick={() => onFilterChange?.(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default PortfolioCard
