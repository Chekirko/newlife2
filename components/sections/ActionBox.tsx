'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// ACTION BOX VARIANT 1: Split Image + Gradient with List
// (home demo style)
// =========================================
export interface ActionBoxSplitListProps {
  preTitle?: string
  title: string
  description?: string
  features?: string[][]  // Array of column arrays
  backgroundImage: string | StaticImageData
  imagePosition?: 'left' | 'right'
  className?: string
}

export const ActionBoxSplitList = ({
  preTitle,
  title,
  description,
  features = [],
  backgroundImage,
  imagePosition = 'left',
  className,
}: ActionBoxSplitListProps) => {
  return (
    <section className={clsx('p-0', className)}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap rounded overflow-hidden',
          imagePosition === 'right' && 'flex-row-reverse'
        )}>
          {/* Image side */}
          <div 
            className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[400px] hidden lg:block bg-cover bg-center"
            style={{
              backgroundImage: typeof backgroundImage === 'string' 
                ? `url(${backgroundImage})` 
                : `url(${backgroundImage.src})`
            }}
          />
          
          {/* Content side */}
          <div className="w-full lg:w-1/2 bg-grad px-6 py-8 lg:p-10 all-text-white">
            <div className="title text-left p-0">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              <h2>{title}</h2>
              {description && <p>{description}</p>}
            </div>
            
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {features.map((column, colIdx) => (
                  <ul key={colIdx} className="list-group list-group-borderless">
                    {column.map((feature, idx) => (
                      <li key={idx} className="list-group-item text-white flex gap-2">
                        <i className="fa fa-check mt-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 2: Dark Quote Box
// (home demo ActionBox2 style)
// =========================================
export interface ActionBoxQuoteProps {
  quote: string
  className?: string
}

export const ActionBoxQuote = ({
  quote,
  className,
}: ActionBoxQuoteProps) => {
  return (
    <section className={clsx('p-0', className)}>
      <div className="container-larexa">
        <div className="bg-gray-800 rounded py-6 all-text-white">
          <h2 className="font-alt p-4 md:p-10 text-center">
            "{quote}"
          </h2>
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 3: Gradient + Pattern CTA
// (home demo ActionBox3 style)
// =========================================
export interface ActionBoxGradientCTAProps {
  title: string
  description?: string
  buttonText?: string
  buttonHref?: string
  onButtonClick?: () => void
  patternOverlay?: 1 | 2 | 3 | 4
  className?: string
}

export const ActionBoxGradientCTA = ({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  patternOverlay = 3,
  className,
}: ActionBoxGradientCTAProps) => {
  return (
    <section className={clsx('py-8', className)}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-col md:flex-row bg-grad p-6 md:p-10 all-text-white rounded',
          `pattern-overlay-${patternOverlay}`
        )}>
          <div className="flex-1 text-center md:text-left">
            <h3>{title}</h3>
            {description && <p className="m-0">{description}</p>}
          </div>
          {buttonText && (
            <div className="mt-4 md:mt-0 text-center md:text-right md:ml-auto self-center">
              {buttonHref ? (
                <a href={buttonHref} className="btn btn-white mb-0">
                  {buttonText}
                </a>
              ) : (
                <button onClick={onButtonClick} className="btn btn-white mb-0">
                  {buttonText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 4: Simple Inline CTA
// (corporate-startUp demo style)
// =========================================
export interface ActionBoxInlineProps {
  text: string
  buttonText?: string
  buttonHref?: string
  buttonVariant?: 'primary' | 'outline-light' | 'grad' | 'white'
  className?: string
}

export const ActionBoxInline = ({
  text,
  buttonText,
  buttonHref,
  buttonVariant = 'outline-light',
  className,
}: ActionBoxInlineProps) => {
  return (
    <section className={clsx('py-8', className)}>
      <div className="container-larexa">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left">
            <h4 className="m-0">{text}</h4>
          </div>
          {buttonText && (
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <a href={buttonHref || '#'} className={`btn btn-${buttonVariant} mb-0`}>
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 5: Split Image + Dark with Contact
// (landing-trendy demo style)
// =========================================
export interface ActionBoxContactProps {
  title: string
  description?: string
  description2?: string
  contactTitle?: string
  phone?: string
  email?: string
  backgroundImage: string | StaticImageData
  imagePosition?: 'left' | 'right'
  className?: string
}

export const ActionBoxContact = ({
  title,
  description,
  description2,
  contactTitle,
  phone,
  email,
  backgroundImage,
  imagePosition = 'left',
  className,
}: ActionBoxContactProps) => {
  return (
    <section className={clsx('py-0', className)}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap',
          imagePosition === 'right' && 'flex-row-reverse'
        )}>
          {/* Image side */}
          <div 
            className="w-full md:w-1/2 min-h-[300px] md:min-h-[400px] rounded-l bg-cover bg-center"
            style={{
              backgroundImage: typeof backgroundImage === 'string' 
                ? `url(${backgroundImage})` 
                : `url(${backgroundImage.src})`
            }}
          />
          
          {/* Content side */}
          <div className="w-full md:w-1/2 p-6 md:p-10 bg-gray-800 all-text-white rounded-r">
            <h4 className="mb-4">{title}</h4>
            {description && <p>{description}</p>}
            {description2 && <p>{description2}</p>}
            
            {(phone || email) && (
              <>
                {contactTitle && <h5>{contactTitle}</h5>}
                <div className="text-xl md:text-2xl mt-4">
                  {phone && (
                    <>
                      <Link href={`tel:${phone.replace(/\D/g, '')}`} className="text-white hover:text-primary mb-2 inline-block">
                        {phone}
                      </Link>
                      {email && <span> or </span>}
                    </>
                  )}
                  {email && (
                    <Link href={`mailto:${email}`} className="text-white hover:text-primary inline-block">
                      {email}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 6: Full Width Background
// (classic-corporate demo style)
// =========================================
export interface ActionBoxFullWidthProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  backgroundImage?: string | StaticImageData
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  isGradient?: boolean
  className?: string
}

export const ActionBoxFullWidth = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundImage,
  overlayDark = 5,
  isGradient = false,
  className,
}: ActionBoxFullWidthProps) => {
  return (
    <section 
      className={clsx(
        'py-16',
        isGradient && 'bg-grad',
        backgroundImage && `bg-overlay-dark-${overlayDark} bg-cover bg-center`,
        'all-text-white',
        className
      )}
      style={backgroundImage ? {
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`
      } : undefined}
    >
      <div className="container-larexa text-center">
        <h2 className="text-white">{title}</h2>
        {subtitle && <p className="text-white/80 mb-6">{subtitle}</p>}
        <div className="flex justify-center gap-4 flex-wrap">
          {buttonText && (
            <a href={buttonHref || '#'} className="btn btn-white">
              {buttonText}
            </a>
          )}
          {secondaryButtonText && (
            <a href={secondaryButtonHref || '#'} className="btn btn-outline-white">
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// =========================================
// ACTION BOX VARIANT 7: Feature Highlight
// (creative-agency demo style)
// =========================================
export interface ActionBoxFeatureProps {
  items: {
    icon: string
    title: string
    description: string
  }[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ActionBoxFeature = ({
  items,
  columns = 3,
  className,
}: ActionBoxFeatureProps) => {
  const colClass = columns === 2 ? 'md:w-1/2' : columns === 4 ? 'md:w-1/4' : 'md:w-1/3'
  
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-4 mb-8', colClass)}>
              <div className="feature-box h-full icon-grad">
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
// ACTION BOX VARIANT 8: Stats/Counter Row
// (agency-startUp demo style)
// =========================================
export interface ActionBoxStatsProps {
  stats: {
    value: string
    label: string
    icon?: string
  }[]
  isDark?: boolean
  isGradient?: boolean
  className?: string
}

export const ActionBoxStats = ({
  stats,
  isDark = false,
  isGradient = false,
  className,
}: ActionBoxStatsProps) => {
  return (
    <section className={clsx(
      'py-10',
      isGradient && 'bg-grad all-text-white',
      isDark && !isGradient && 'bg-gray-800 all-text-white',
      !isDark && !isGradient && 'bg-white',
      className
    )}>
      <div className="container-larexa">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              {stat.icon && (
                <div className={clsx(
                  'text-4xl mb-3',
                  isGradient || isDark ? 'text-white' : 'text-primary'
                )}>
                  <i className={stat.icon} />
                </div>
              )}
              <div className={clsx(
                'text-4xl lg:text-5xl font-bold mb-2',
                isGradient || isDark ? 'text-white' : 'text-gray-800'
              )}>
                {stat.value}
              </div>
              <p className="m-0">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// Simple CTABox (shorthand for common patterns)
// =========================================
export interface CTABoxProps {
  title: string
  description?: string
  buttonText?: string
  buttonHref?: string
  onButtonClick?: () => void
  variant?: 'gradient' | 'dark' | 'light' | 'primary'
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const CTABox = ({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  variant = 'gradient',
  align = 'center',
  className,
}: CTABoxProps) => {
  const variantClasses = {
    gradient: 'bg-grad all-text-white',
    dark: 'bg-gray-800 text-white',
    light: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-white',
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={clsx(
      'py-10 px-8 rounded',
      variantClasses[variant],
      alignClasses[align],
      className
    )}>
      <h3 className="mb-2">{title}</h3>
      {description && <p className="mb-4">{description}</p>}
      {buttonText && (
        buttonHref ? (
          <a 
            href={buttonHref}
            className={clsx('btn', variant === 'light' ? 'btn-grad' : 'btn-white')}
          >
            {buttonText}
          </a>
        ) : (
          <button 
            onClick={onButtonClick}
            className={clsx('btn', variant === 'light' ? 'btn-grad' : 'btn-white')}
          >
            {buttonText}
          </button>
        )
      )}
    </div>
  )
}

// =========================================
// Default export
// =========================================
export { ActionBoxGradientCTA as ActionBox }
export default ActionBoxGradientCTA
