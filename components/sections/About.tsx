'use client'

import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// ABOUT VARIANT 1: Feature Boxes with Title
// (creative-agency demo style)
// =========================================
export interface AboutFeature {
  id: string
  icon?: string
  image?: string | StaticImageData
  title: string
  description: string
  isHighlighted?: boolean
}

export interface AboutFeaturesProps {
  title: string
  subtitle?: string
  description?: string
  features: AboutFeature[]
  columns?: 2 | 3 | 4
  className?: string
}

export const AboutFeatures = ({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  className,
}: AboutFeaturesProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold">{title}</h2>
          {subtitle && <h5>{subtitle}</h5>}
          {description && <p>{description}</p>}
        </div>
        
        <div className="flex flex-wrap -mx-4">
          {features.map((feature) => (
            <div key={feature.id} className={clsx('w-full px-4', columnClasses[columns])}>
              <div className={clsx(
                'feature-box h-full text-center px-6 py-8',
                feature.isHighlighted && 'all-text-white bg-grad rounded'
              )}>
                {feature.image && (
                  <div className="feature-box-icon">
                    <Image src={feature.image} alt="" width={80} height={80} className="w-1/4 mx-auto" />
                  </div>
                )}
                {feature.icon && (
                  <div className="feature-box-icon">
                    <i className={feature.icon} />
                  </div>
                )}
                <h3 className="feature-box-title">{feature.title}</h3>
                <p className="feature-box-desc">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// ABOUT VARIANT 2: Split Layout with Gallery
// (home Contact style - repurposed as About)
// =========================================
export interface AboutSplitGalleryProps {
  title: string
  subtitle?: string
  description?: string
  description2?: string
  buttonText?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  galleryImages?: (string | StaticImageData)[]
  quote?: { label: string; text: string }
  imagePosition?: 'left' | 'right'
  className?: string
}

export const AboutSplitGallery = ({
  title,
  subtitle,
  description,
  description2,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
  galleryImages = [],
  quote,
  imagePosition = 'left',
  className,
}: AboutSplitGalleryProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap items-center',
          imagePosition === 'right' && 'flex-row-reverse'
        )}>
          {/* Gallery side */}
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-12 gap-3">
              {galleryImages[0] && (
                <div className="col-span-5 col-start-2 self-end">
                  <Image 
                    src={galleryImages[0]} 
                    alt=""
                    width={200}
                    height={250}
                    className="rounded w-full"
                  />
                </div>
              )}
              {galleryImages[1] && (
                <div className="col-span-6">
                  <Image 
                    src={galleryImages[1]} 
                    alt=""
                    width={250}
                    height={300}
                    className="rounded w-full"
                  />
                </div>
              )}
              {quote && (
                <div className="col-span-7">
                  <div className="rounded bg-grad p-4 lg:p-6 all-text-white">
                    <span>{quote.label}</span>
                    <h3 className="font-bold">"{quote.text}"</h3>
                  </div>
                </div>
              )}
              {galleryImages[2] && (
                <div className="col-span-5 self-start">
                  <Image 
                    src={galleryImages[2]} 
                    alt=""
                    width={200}
                    height={250}
                    className="rounded w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content side */}
          <div className="w-full md:w-1/2 md:pl-10 mt-8 md:mt-0">
            <h2 className="text-4xl">{title}</h2>
            {subtitle && <p className="text-xl">{subtitle}</p>}
            {description && <p>{description}</p>}
            {description2 && <p>{description2}</p>}
            {(buttonText || secondaryButtonText) && (
              <div className="mt-4">
                {buttonText && (
                  <Link href={buttonHref || '#'} className="btn btn-dark">
                    {buttonText}
                  </Link>
                )}
                {secondaryButtonText && (
                  <Link href={secondaryButtonHref || '#'} className="btn btn-link">
                    {secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// ABOUT VARIANT 3: Simple Text with Stats
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
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            {preTitle && <span className="pre-title">{preTitle}</span>}
            <h2 className="text-4xl">{title}</h2>
            {description && <p className="text-lg">{description}</p>}
            {description2 && <p>{description2}</p>}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad mt-4">
                {buttonText}
              </Link>
            )}
          </div>
          
          {stats.length > 0 && (
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center bg-gray-100 rounded p-6">
                    <div className="text-4xl lg:text-5xl font-bold text-primary">{stat.value}</div>
                    <p className="m-0">{stat.label}</p>
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

// =========================================
// ABOUT VARIANT 4: Company Info (AboutUs)
// (corporate-startUp demo style)
// =========================================
export interface AboutUsProps {
  preTitle?: string
  title: string
  subtitle?: string
  description?: string
  features?: { icon: string; title: string; description: string }[]
  buttonText?: string
  buttonHref?: string
  image?: string | StaticImageData
  imagePosition?: 'left' | 'right'
  className?: string
}

export const AboutUs = ({
  preTitle,
  title,
  subtitle,
  description,
  features = [],
  buttonText,
  buttonHref,
  image,
  imagePosition = 'right',
  className,
}: AboutUsProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap items-center',
          imagePosition === 'left' && 'flex-row-reverse'
        )}>
          <div className={clsx('w-full', image ? 'md:w-1/2' : '')}>
            {preTitle && <span className="pre-title">{preTitle}</span>}
            <h2 className="text-4xl">{title}</h2>
            {subtitle && <h5>{subtitle}</h5>}
            {description && <p>{description}</p>}
            
            {features.length > 0 && (
              <div className="mt-6 space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-3xl text-primary flex-shrink-0">
                      <i className={feature.icon} />
                    </div>
                    <div>
                      <h5 className="mb-1">{feature.title}</h5>
                      <p className="text-sm m-0">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad mt-6">
                {buttonText}
              </Link>
            )}
          </div>
          
          {image && (
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <Image 
                src={image}
                alt=""
                width={500}
                height={400}
                className="rounded shadow w-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { AboutFeatures as About }
export default AboutFeatures
