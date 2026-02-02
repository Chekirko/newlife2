'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// TEAM MEMBER INTERFACE
// =========================================
export interface TeamMember {
  id: string
  name: string
  position: string
  image: string | StaticImageData
  description?: string
  socialLinks?: {
    platform: string
    url: string
    icon: string
  }[]
}

// =========================================
// TEAM VARIANT 1: Grid Layout
// (basic grid of team cards)
// =========================================
export interface TeamGridProps {
  preTitle?: string
  title?: string
  description?: string
  members: TeamMember[]
  columns?: 2 | 3 | 4
  cardVariant?: 'default' | 'overlay' | 'bordered'
  showSocial?: boolean
  className?: string
}

export const TeamGrid = ({
  preTitle,
  title,
  description,
  members,
  columns = 4,
  cardVariant = 'default',
  showSocial = true,
  className,
}: TeamGridProps) => {
  const columnClasses = {
    2: 'sm:w-1/2',
    3: 'sm:w-1/2 lg:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  const cardClasses = {
    default: 'team-item',
    overlay: 'team-item team-overlay',
    bordered: 'team-item team-bordered',
  }

  return (
    <section className={clsx('team', className)}>
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
          {members.map((member) => (
            <div key={member.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className={cardClasses[cardVariant]}>
                <div className="team-avatar">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={300}
                    height={300}
                    className="rounded w-full"
                  />
                </div>
                <div className="team-desc text-center">
                  <h4 className="team-name">{member.name}</h4>
                  <span className="team-position text-gray-500">{member.position}</span>
                  
                  {showSocial && member.socialLinks && member.socialLinks.length > 0 && (
                    <ul className="social-icons flex justify-center gap-2 mt-3">
                      {member.socialLinks.map((link, idx) => (
                        <li key={idx} className={`social-icons-item social-${link.platform}`}>
                          <Link href={link.url} className="social-icons-link">
                            <i className={link.icon} />
                          </Link>
                        </li>
                      ))}
                    </ul>
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
// TEAM VARIANT 2: Grid Slider (carousel)
// (agency-startUp demo style)
// =========================================
export interface TeamCarouselProps {
  preTitle?: string
  title?: string
  description?: string
  members: TeamMember[]
  showDots?: boolean
  showArrows?: boolean
  autoplay?: boolean
  className?: string
}

export const TeamCarousel = ({
  preTitle,
  title,
  description,
  members,
  showDots = true,
  showArrows = false,
  autoplay = true,
  className,
}: TeamCarouselProps) => {
  // Simple CSS-based infinite scroll carousel
  return (
    <section className={clsx('team team-grid', className)}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {members.map((member) => (
            <div key={member.id} className="team-item">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="team-avatar flex-shrink-0 w-full md:w-1/3">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded w-full"
                  />
                </div>
                <div className="team-desc flex-1">
                  <h4 className="team-name">{member.name}</h4>
                  <span className="team-position text-gray-500">{member.position}</span>
                  {member.description && <p className="mt-3">{member.description}</p>}
                  
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <ul className="social-icons light si-colored-bg-on-hover flex gap-2 mt-3">
                      {member.socialLinks.map((link, idx) => (
                        <li key={idx} className={`social-icons-item social-${link.platform}`}>
                          <Link href={link.url} className="social-icons-link">
                            <i className={link.icon} />
                          </Link>
                        </li>
                      ))}
                    </ul>
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
// TEAM VARIANT 3: Split Layout (text + slider)
// (landing-trendy demo style)
// =========================================
export interface TeamSplitProps {
  title: string
  description?: string
  hiringText?: string
  buttonText?: string
  buttonHref?: string
  members: TeamMember[]
  contentPosition?: 'left' | 'right'
  className?: string
}

export const TeamSplit = ({
  title,
  description,
  hiringText,
  buttonText,
  buttonHref,
  members,
  contentPosition = 'left',
  className,
}: TeamSplitProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap items-center gap-8',
          contentPosition === 'right' && 'flex-row-reverse'
        )}>
          {/* Content side */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {hiringText && <h6 className="mb-4">{hiringText}</h6>}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad">
                {buttonText}
              </Link>
            )}
          </div>

          {/* Team members side */}
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {members.slice(0, 4).map((member) => (
                <div key={member.id} className="team-item text-center">
                  <div className="team-avatar">
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      width={180}
                      height={180}
                      className="rounded w-full"
                    />
                  </div>
                  <div className="team-desc mt-3">
                    <h5 className="team-name mb-1">{member.name}</h5>
                    <span className="team-position text-sm text-gray-500">{member.position}</span>
                    
                    {member.socialLinks && (
                      <ul className="social-icons si-colored-on-hover flex justify-center gap-2 mt-2">
                        {member.socialLinks.map((link, idx) => (
                          <li key={idx} className={`social-icons-item social-${link.platform}`}>
                            <Link href={link.url} className="social-icons-link">
                              <i className={link.icon} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
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
// TEAM VARIANT 4: About Section Style
// (classic-corporate demo - intro with gallery)
// =========================================
export interface TeamAboutItem {
  id: string
  number: string
  title: string
  description: string
  links?: { label: string; href: string }[]
}

export interface TeamAboutProps {
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  galleryImages?: (string | StaticImageData)[]
  items: TeamAboutItem[]
  className?: string
}

export const TeamAbout = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonHref,
  galleryImages = [],
  items,
  className,
}: TeamAboutProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap items-center">
          {/* Left content */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl">{title}</h2>
            {subtitle && <h5 className="mt-4">{subtitle}</h5>}
            {description && <p>{description}</p>}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad">
                {buttonText}
              </Link>
            )}
          </div>

          {/* Right gallery */}
          {galleryImages.length > 0 && (
            <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <div key={idx} className={clsx(
                    idx === 0 && 'col-span-1 row-span-1',
                    idx === 1 && 'col-span-1',
                    idx === 2 && 'col-span-1',
                    idx === 3 && 'col-span-1'
                  )}>
                    <Image 
                      src={img} 
                      alt=""
                      width={250}
                      height={200}
                      className="rounded w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Numbered items */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {items.map((item) => (
              <div key={item.id} className="mt-6 lg:mt-0">
                <h6 className="text-primary">{item.number}</h6>
                <h4 className="mb-2">{item.title}</h4>
                <p>{item.description}</p>
                {item.links && item.links.length > 0 && (
                  <ul className="list-none">
                    {item.links.map((link, idx) => (
                      <li key={idx} className="font-bold">
                        <Link href={link.href} className="hover:text-primary">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// =========================================
// TEAM VARIANT 5: Social Hover Cards
// (team-overlay style with social on hover)
// =========================================
export interface TeamOverlayProps {
  preTitle?: string
  title?: string
  members: TeamMember[]
  columns?: 2 | 3 | 4
  className?: string
}

export const TeamOverlay = ({
  preTitle,
  title,
  members,
  columns = 4,
  className,
}: TeamOverlayProps) => {
  const columnClasses = {
    2: 'sm:w-1/2',
    3: 'sm:w-1/2 lg:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={clsx('team', className)}>
      <div className="container-larexa">
        {(preTitle || title) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {members.map((member) => (
            <div key={member.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="team-item team-overlay group relative overflow-hidden rounded">
                <div className="team-avatar">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={300}
                    height={350}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay with social */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {member.socialLinks && (
                      <ul className="social-icons flex gap-3">
                        {member.socialLinks.map((link, idx) => (
                          <li key={idx} className="social-icons-item">
                            <Link 
                              href={link.url} 
                              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                              <i className={link.icon} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="team-desc text-center py-4">
                  <h4 className="team-name mb-1">{member.name}</h4>
                  <span className="team-position text-gray-500">{member.position}</span>
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
// Default exports
// =========================================
export { TeamGrid as Team }
export default TeamGrid
