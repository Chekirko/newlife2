'use client'

import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// CLIENT LOGO INTERFACE
// =========================================
export interface ClientLogo {
  id: string
  name: string
  logo: string | StaticImageData
  href?: string
}

// =========================================
// CLIENTS VARIANT 1: Simple Grid
// (static grid layout)
// =========================================
export interface ClientsGridProps {
  logos: ClientLogo[]
  title?: string
  grayscale?: boolean
  columns?: 3 | 4 | 5 | 6
  className?: string
}

export const ClientsGrid = ({
  logos,
  title,
  grayscale = true,
  columns = 5,
  className,
}: ClientsGridProps) => {
  const columnClasses = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <section className={clsx('py-8', className)}>
      <div className="container-larexa">
        {title && (
          <h5 className="text-center text-gray-600 mb-6">{title}</h5>
        )}
        <div className={clsx('grid gap-6 items-center', columnClasses[columns])}>
          {logos.map((client) => (
            <div key={client.id} className="text-center">
              {client.href ? (
                <Link href={client.href} className="inline-block">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={150}
                    height={60}
                    className={clsx(
                      'max-h-16 w-auto mx-auto transition-all duration-300',
                      grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                    )}
                  />
                </Link>
              ) : (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={150}
                  height={60}
                  className={clsx(
                    'max-h-16 w-auto mx-auto transition-all duration-300',
                    grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// CLIENTS VARIANT 2: Auto-Scrolling Carousel
// (home demo style - continuous scroll)
// =========================================
export interface ClientsCarouselProps {
  logos: ClientLogo[]
  title?: string
  showArrows?: boolean
  grayscale?: boolean
  speed?: number
  className?: string
}

export const ClientsCarousel = ({
  logos,
  title,
  showArrows = true,
  grayscale = true,
  speed = 30,
  className,
}: ClientsCarouselProps) => {
  return (
    <section className={clsx('client pt-0', className)}>
      <div className="container-larexa">
        {title && (
          <h5 className="text-center text-gray-600 mb-6">{title}</h5>
        )}
        <div className="relative overflow-hidden">
          {/* Infinite scroll container */}
          <div 
            className="flex animate-scroll"
            style={{
              width: 'fit-content',
              animation: `scroll ${speed}s linear infinite`,
            }}
          >
            {/* Double the logos for seamless loop */}
            {[...logos, ...logos].map((client, idx) => (
              <div key={idx} className="flex-shrink-0 mx-4 md:mx-8">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={128}
                  height={42}
                  className={clsx(
                    'transition-all duration-300',
                    grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

// =========================================
// CLIENTS VARIANT 3: With Feature Boxes
// (corporate-startUp demo style)
// =========================================
export interface ClientFeature {
  id: string
  image: string | StaticImageData
  title: string
  description: string
}

export interface ClientsFeatureProps {
  preTitle?: string
  title?: string
  description?: string
  features: ClientFeature[]
  className?: string
}

export const ClientsFeature = ({
  preTitle,
  title,
  description,
  features,
  className,
}: ClientsFeatureProps) => {
  return (
    <section className={clsx('service pt-0', className)}>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="feature-box h-full text-center">
              <div className="feature-box-icon">
                <Image 
                  src={feature.image} 
                  alt={feature.title}
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto"
                />
              </div>
              <h3 className="feature-box-title">{feature.title}</h3>
              <p className="feature-box-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// CLIENTS VARIANT 4: Overlapping / Z-Index Style
// (agency-startUp demo style)
// =========================================
export interface ClientsOverlappingProps {
  logos: ClientLogo[]
  className?: string
}

export const ClientsOverlapping = ({
  logos,
  className,
}: ClientsOverlappingProps) => {
  return (
    <section className={clsx('client p-0 mt-10 md:mt-0 relative z-10', className)}>
      <div className="container-larexa">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((client) => (
            <div key={client.id} className="flex-shrink-0">
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={40}
                className="w-3/4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// CLIENTS VARIANT 5: With Background
// (dark/gradient background)
// =========================================
export interface ClientsWithBgProps {
  logos: ClientLogo[]
  title?: string
  isDark?: boolean
  isGradient?: boolean
  className?: string
}

export const ClientsWithBg = ({
  logos,
  title,
  isDark = false,
  isGradient = false,
  className,
}: ClientsWithBgProps) => {
  return (
    <section className={clsx(
      'py-10',
      isGradient && 'bg-grad',
      isDark && !isGradient && 'bg-gray-800',
      className
    )}>
      <div className="container-larexa">
        {title && (
          <h5 className={clsx(
            'text-center mb-6',
            (isDark || isGradient) ? 'text-white' : 'text-gray-600'
          )}>
            {title}
          </h5>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {logos.map((client) => (
            <div key={client.id} className="text-center">
              <Image
                src={client.logo}
                alt={client.name}
                width={128}
                height={42}
                className={clsx(
                  'mx-auto transition-all duration-300',
                  (isDark || isGradient) ? 'brightness-0 invert opacity-60 hover:opacity-100' : 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// CLIENTS VARIANT 6: Compact Row (no section)
// =========================================
export interface ClientsRowProps {
  logos: ClientLogo[]
  grayscale?: boolean
  className?: string
}

export const ClientsRow = ({
  logos,
  grayscale = true,
  className,
}: ClientsRowProps) => {
  return (
    <div className={clsx('flex flex-wrap justify-center items-center gap-6 md:gap-10', className)}>
      {logos.map((client) => (
        <div key={client.id}>
          {client.href ? (
            <Link href={client.href}>
              <Image
                src={client.logo}
                alt={client.name}
                width={100}
                height={35}
                className={clsx(
                  'transition-all duration-300',
                  grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                )}
              />
            </Link>
          ) : (
            <Image
              src={client.logo}
              alt={client.name}
              width={100}
              height={35}
              className={clsx(
                'transition-all duration-300',
                grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// =========================================
// Default exports
// =========================================
export { ClientsGrid as Clients }
export { ClientsGrid as Partners }
export default ClientsGrid
