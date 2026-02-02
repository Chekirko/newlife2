import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'
import SocialIcons, { SocialLink } from '../ui/SocialIcons'

// =====================
// Footer Link Interface
// =====================
export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

// =====================
// Footer Props
// =====================
export interface FooterProps {
  logo?: ReactNode
  description?: string
  columns?: FooterColumn[]
  socialLinks?: SocialLink[]
  copyrightText?: string
  bottomLinks?: FooterLink[]
  isDark?: boolean
  className?: string
  children?: ReactNode
}

// =====================
// Footer Component
// =====================
export const Footer = ({
  logo,
  description,
  columns = [],
  socialLinks = [],
  copyrightText = `© ${new Date().getFullYear()} All rights reserved.`,
  bottomLinks = [],
  isDark = true,
  className,
  children,
}: FooterProps) => {
  return (
    <footer className={clsx(
      'py-12',
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
      className
    )}>
      <div className="container-larexa">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div>
            {logo && <div className="mb-4">{logo}</div>}
            {description && (
              <p className={clsx(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div className="mt-4">
                <SocialIcons 
                  links={socialLinks} 
                  variant={isDark ? 'light' : 'dark'}
                  shape="round"
                />
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((column, idx) => (
            <div key={idx}>
              <h5 className={clsx(
                'font-bold mb-4',
                isDark ? 'text-white' : 'text-gray-800'
              )}>
                {column.title}
              </h5>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className={clsx(
                        'text-sm hover:text-primary transition-colors',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Custom children */}
        {children}

        {/* Divider */}
        <div className={clsx(
          'border-t pt-6 mt-6',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className={clsx(
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {copyrightText}
            </p>

            {/* Bottom links */}
            {bottomLinks.length > 0 && (
              <ul className="flex gap-4">
                {bottomLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      href={link.href}
                      className={clsx(
                        'text-sm hover:text-primary transition-colors',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
