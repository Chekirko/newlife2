import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =====================
// Social Link Interface
// =====================
export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'github' | 'dribbble'
  url: string
}

// =====================
// Team Card Variants
// =====================
export type TeamCardVariant = 
  | 'default' 
  | 'overlay' 
  | 'bordered' 
  | 'grid' 
  | 'social-hover'

// =====================
// Props Interface
// =====================
export interface TeamCardProps {
  image: string | StaticImageData
  name: string
  position: string
  description?: string
  socialLinks?: SocialLink[]
  variant?: TeamCardVariant
  className?: string
}

// =====================
// Social Icon Map
// =====================
const socialIconMap: Record<SocialLink['platform'], string> = {
  facebook: 'fab fa-facebook-f',
  instagram: 'fab fa-instagram',
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin-in',
  youtube: 'fab fa-youtube',
  github: 'fab fa-github',
  dribbble: 'fab fa-dribbble',
}

// =====================
// Social Icons Component
// =====================
const SocialIcons = ({ 
  links, 
  variant = 'default' 
}: { 
  links: SocialLink[]
  variant?: 'default' | 'light' | 'colored-on-hover' | 'colored-bg-on-hover'
}) => {
  const socialVariantClasses = {
    default: 'si-colored-on-hover',
    light: 'light si-colored-bg-on-hover',
    'colored-on-hover': 'si-colored-on-hover',
    'colored-bg-on-hover': 'si-colored-bg-on-hover',
  }

  return (
    <ul className={clsx('social-icons', socialVariantClasses[variant])}>
      {links.map((link) => (
        <li key={link.platform} className={`social-icons-item social-${link.platform}`}>
          <Link href={link.url} className="social-icons-link">
            <i className={socialIconMap[link.platform]} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

// =====================
// Team Card Component
// =====================
export const TeamCard = ({
  image,
  name,
  position,
  description,
  socialLinks = [],
  variant = 'default',
  className,
}: TeamCardProps) => {
  // Determine wrapper classes based on variant
  const wrapperClasses = clsx(
    'team',
    variant === 'overlay' && 'team-overlay',
    variant === 'bordered' && 'team-bordered',
    variant === 'grid' && 'team-grid',
    variant === 'social-hover' && 'team-overlay social-hover'
  )

  // For grid variant
  if (variant === 'grid') {
    return (
      <div className={clsx(wrapperClasses, className)}>
        <div className="team-item">
          <div className="team-avatar">
            <Image 
              src={image} 
              alt={name} 
              className="rounded"
              width={300}
              height={300}
            />
          </div>
          <div className="team-desc">
            <h4 className="team-name">{name}</h4>
            <span className="team-position">{position}</span>
            {description && <p>{description}</p>}
            {socialLinks.length > 0 && (
              <SocialIcons links={socialLinks} variant="light" />
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default, overlay, bordered, social-hover variants
  return (
    <div className={clsx(wrapperClasses, className)}>
      <div className={clsx(
        'team-item text-center',
        variant === 'social-hover' && 'hover-overlay'
      )}>
        <div className="team-avatar">
          <Image 
            src={image} 
            alt={name}
            width={300}
            height={300}
          />
        </div>
        <div className="team-desc">
          <h5 className="team-name">{name}</h5>
          <span className="team-position">{position}</span>
          {description && <p>{description}</p>}
          {socialLinks.length > 0 && (
            <SocialIcons links={socialLinks} />
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamCard
