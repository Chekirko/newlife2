import { clsx } from 'clsx'
import Link from 'next/link'

// =====================
// Social Platform Type
// =====================
export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'linkedin' 
  | 'youtube' 
  | 'github' 
  | 'dribbble'
  | 'pinterest'
  | 'behance'
  | 'vimeo'
  | 'skype'
  | 'tumblr'
  | 'rss'

// =====================
// Social Icon Variants
// =====================
export type SocialIconsVariant = 
  | 'default'
  | 'dark'
  | 'light'
  | 'colored-bg'
  | 'colored-on-hover'
  | 'colored-bg-on-hover'

export type SocialIconsShape = 'default' | 'round' | 'square'
export type SocialIconsSize = 'default' | 'medium' | 'large'

// =====================
// Social Link Interface
// =====================
export interface SocialLink {
  platform: SocialPlatform
  url: string
}

// =====================
// Props Interface
// =====================
export interface SocialIconsProps {
  links: SocialLink[]
  variant?: SocialIconsVariant
  shape?: SocialIconsShape
  size?: SocialIconsSize
  showBorder?: boolean
  className?: string
}

// =====================
// Icon Class Map
// =====================
const iconClasses: Record<SocialPlatform, string> = {
  facebook: 'fab fa-facebook-f',
  instagram: 'fab fa-instagram',
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin-in',
  youtube: 'fab fa-youtube',
  github: 'fab fa-github',
  dribbble: 'fab fa-dribbble',
  pinterest: 'fab fa-pinterest-p',
  behance: 'fab fa-behance',
  vimeo: 'fab fa-vimeo-v',
  skype: 'fab fa-skype',
  tumblr: 'fab fa-tumblr',
  rss: 'fas fa-rss',
}

// =====================
// Variant Class Map
// =====================
const variantClasses: Record<SocialIconsVariant, string> = {
  default: '',
  dark: 'dark',
  light: 'light',
  'colored-bg': 'si-colored-bg',
  'colored-on-hover': 'si-colored-on-hover',
  'colored-bg-on-hover': 'si-colored-bg-on-hover',
}

const shapeClasses: Record<SocialIconsShape, string> = {
  default: '',
  round: 'round',
  square: 'square',
}

const sizeClasses: Record<SocialIconsSize, string> = {
  default: '',
  medium: 'si-medium',
  large: 'si-large',
}

// =====================
// Social Icons Component
// =====================
export const SocialIcons = ({
  links,
  variant = 'default',
  shape = 'default',
  size = 'default',
  showBorder = false,
  className,
}: SocialIconsProps) => {
  return (
    <ul className={clsx(
      'social-icons',
      variantClasses[variant],
      shapeClasses[shape],
      sizeClasses[size],
      showBorder && 'si-border',
      className
    )}>
      {links.map((link) => (
        <li 
          key={link.platform} 
          className={`social-icons-item social-${link.platform}`}
        >
          <Link 
            href={link.url} 
            className="social-icons-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={iconClasses[link.platform]} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
