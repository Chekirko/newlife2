import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'

// =========================================
// SERVICES VARIANT 1: Feature Boxes Grid
// (home demo style - f-style-2)
// =========================================
export interface ServiceItem {
  icon: string
  title: string
  description: string
  link?: string
  linkText?: string
}

export interface ServicesGridProps {
  preTitle?: string
  title?: string
  description?: string
  items: ServiceItem[]
  columns?: 2 | 3 | 4
  featureStyle?: 'default' | 'style-1' | 'style-2' | 'style-3' | 'style-4' | 'style-5'
  iconStyle?: 'grad' | 'primary' | 'none'
  className?: string
}

export const ServicesGrid = ({
  preTitle,
  title,
  description,
  items,
  columns = 3,
  featureStyle = 'style-2',
  iconStyle = 'grad',
  className,
}: ServicesGridProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
  }

  const styleClasses = {
    default: '',
    'style-1': 'f-style-1',
    'style-2': 'f-style-2',
    'style-3': 'f-style-3',
    'style-4': 'f-style-4',
    'style-5': 'f-style-5',
  }

  const iconClasses = {
    grad: 'icon-grad',
    primary: 'icon-primary',
    none: '',
  }

  return (
    <section className={clsx('service', className)}>
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
        
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4 mt-8', columnClasses[columns])}>
              <div className={clsx(
                'feature-box h-full',
                styleClasses[featureStyle],
                iconClasses[iconStyle]
              )}>
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
                {item.link && (
                  <Link href={item.link} className="mt-3 inline-block">
                    {item.linkText || 'Know more!'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 2: Masonry Cards Layout
// (corporate-startUp demo style)
// =========================================
export interface ServicesMasonryProps {
  leftTitle?: string
  leftSubtitle?: string
  leftDescription?: string
  leftItem?: {
    icon: string
    title: string
    description: string
  }
  middleItems?: {
    icon: string
    title: string
    description: string
  }[]
  rightItems?: {
    icon: string
    title: string
    description: string
    highlight?: boolean
  }[]
  className?: string
}

export const ServicesMasonry = ({
  leftTitle,
  leftSubtitle,
  leftDescription,
  leftItem,
  middleItems = [],
  rightItems = [],
  className,
}: ServicesMasonryProps) => {
  return (
    <section className={clsx('pb-6', className)}>
      <div className="container-larexa">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Left column */}
          <div>
            {leftTitle && <h5 className="text-primary">{leftTitle}</h5>}
            {leftSubtitle && <h2 className="text-3xl">{leftSubtitle}</h2>}
            {leftDescription && <p>{leftDescription}</p>}
            
            {leftItem && (
              <div className="bg-gray-100 p-6 lg:p-8">
                <span className="text-4xl icon-primary">
                  <i className={leftItem.icon} />
                </span>
                <h5 className="mt-4">{leftItem.title}</h5>
                <p className="mb-0">{leftItem.description}</p>
              </div>
            )}
          </div>
          
          {/* Middle column */}
          <div className="mt-10">
            {middleItems.map((item, idx) => (
              <div key={idx} className="bg-gray-100 p-6 lg:p-8 mb-8">
                <span className="text-4xl icon-primary">
                  <i className={item.icon} />
                </span>
                <h5 className="mt-4">{item.title}</h5>
                <p className="mb-0">{item.description}</p>
              </div>
            ))}
          </div>
          
          {/* Right column */}
          <div>
            {rightItems.map((item, idx) => (
              <div 
                key={idx} 
                className={clsx(
                  'p-6 lg:p-8 mb-8',
                  item.highlight ? 'bg-grad all-text-white' : 'bg-gray-100'
                )}
              >
                <span className={clsx('text-4xl', item.highlight ? 'text-white' : 'icon-primary')}>
                  <i className={item.icon} />
                </span>
                <h5 className="mt-4">{item.title}</h5>
                <p className="mb-0">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 3: Simple Grid without Box
// (landing-trendy demo style)
// =========================================
export interface ServicesSimpleGridProps {
  items: ServiceItem[]
  columns?: 2 | 3 | 4 | 6
  iconStyle?: 'grad' | 'primary'
  className?: string
}

export const ServicesSimpleGrid = ({
  items,
  columns = 3,
  iconStyle = 'grad',
  className,
}: ServicesSimpleGridProps) => {
  const columnClasses = {
    2: 'sm:w-1/2',
    3: 'sm:w-1/2 md:w-1/3',
    4: 'sm:w-1/2 md:w-1/4',
    6: 'w-1/2 md:w-1/3 lg:w-1/6',
  }

  return (
    <section className={clsx('pt-0', className)}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4 mt-6">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4', columnClasses[columns])}>
              <div className={clsx('feature-box h-full', iconStyle === 'grad' ? 'icon-grad' : 'icon-primary')}>
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 4: Cards with Shadow
// (f-style-1 - shadow on hover)
// =========================================
export interface ServicesCardsProps {
  preTitle?: string
  title?: string
  description?: string
  items: ServiceItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ServicesCards = ({
  preTitle,
  title,
  description,
  items,
  columns = 3,
  className,
}: ServicesCardsProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
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
        
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="feature-box f-style-1 icon-grad h-full">
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
                {item.link && (
                  <Link href={item.link} className="mt-3 inline-block">
                    {item.linkText || 'Learn more'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 5: Bordered Style
// (f-style-3)
// =========================================
export interface ServicesBorderedProps {
  items: ServiceItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ServicesBordered = ({
  items,
  columns = 3,
  className,
}: ServicesBorderedProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="feature-box f-style-3 icon-primary h-full">
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 6: Icon Left Compact
// (f-style-4)
// =========================================
export interface ServicesIconLeftProps {
  items: ServiceItem[]
  columns?: 1 | 2
  className?: string
}

export const ServicesIconLeft = ({
  items,
  columns = 2,
  className,
}: ServicesIconLeftProps) => {
  const columnClasses = columns === 1 ? 'w-full' : 'w-full md:w-1/2'

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('px-4 mb-8', columnClasses)}>
              <div className="feature-box f-style-4 icon-grad">
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// SERVICES VARIANT 7: Circular Icon Style
// (f-style-5)
// =========================================
export interface ServicesCircularIconProps {
  items: ServiceItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ServicesCircularIcon = ({
  items,
  columns = 4,
  className,
}: ServicesCircularIconProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="feature-box f-style-5 icon-grad h-full text-center">
                <div className="feature-box-icon">
                  <i className={item.icon} />
                </div>
                <h3 className="feature-box-title">{item.title}</h3>
                <p className="feature-box-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { ServicesGrid as Services }
export default ServicesGrid
