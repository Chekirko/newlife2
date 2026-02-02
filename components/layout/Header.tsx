'use client'

import { ReactNode, useState, useEffect } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'

// =====================
// Header Variants
// =====================
export type HeaderVariant = 
  | 'default' 
  | 'transparent' 
  | 'dark' 
  | 'primary' 
  | 'floating'

// =====================
// Nav Item Interface
// =====================
export interface NavItem {
  label: string
  href: string
  isActive?: boolean
  children?: NavItem[]
}

// =====================
// Top Bar Props
// =====================
export interface TopBarProps {
  leftContent?: ReactNode
  rightContent?: ReactNode
  className?: string
}

// =====================
// Header Props
// =====================
export interface HeaderProps {
  logo: string | StaticImageData
  logoAlt?: string
  navItems?: NavItem[]
  variant?: HeaderVariant
  sticky?: boolean
  showTopBar?: boolean
  topBarProps?: TopBarProps
  rightContent?: ReactNode
  className?: string
}

// =====================
// Top Bar Component
// =====================
const TopBar = ({ leftContent, rightContent, className }: TopBarProps) => {
  return (
    <div className={clsx('navbar-top', className)}>
      <div className="container-larexa flex justify-between items-center">
        <div>{leftContent}</div>
        <div>{rightContent}</div>
      </div>
    </div>
  )
}

// =====================
// Header Component
// =====================
export const Header = ({
  logo,
  logoAlt = 'Logo',
  navItems = [],
  variant = 'default',
  sticky = true,
  showTopBar = false,
  topBarProps,
  rightContent,
  className,
}: HeaderProps) => {
  const [isSticky, setIsSticky] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Sticky scroll handler
  useEffect(() => {
    if (!sticky) return

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  const variantClasses = {
    default: 'bg-white',
    transparent: 'navbar-transparent',
    dark: 'navbar-dark bg-gray-800',
    primary: 'navbar-primary bg-primary',
    floating: 'navbar-floating',
  }

  return (
    <header className={clsx(
      'navbar relative z-[99]',
      variantClasses[variant],
      sticky && isSticky && 'navbar-sticky-on',
      className
    )}>
      {/* Top Bar */}
      {showTopBar && <TopBar {...topBarProps} />}

      {/* Main Nav */}
      <nav className={variant === 'floating' ? '' : 'container-larexa'}>
        <div className={clsx(
          'flex items-center justify-between',
          variant === 'floating' && 'container-larexa bg-white rounded px-8'
        )}>
          {/* Logo */}
          <Link href="/" className="navbar-brand">
            <Image 
              src={logo} 
              alt={logoAlt}
              className="navbar-brand-item"
              width={150}
              height={40}
            />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800" />
          </button>

          {/* Navigation */}
          <div className={clsx(
            'lg:flex lg:items-center',
            isMobileMenuOpen ? 'block absolute top-full left-0 right-0 bg-white shadow-lg p-4 lg:p-0 lg:static lg:shadow-none' : 'hidden'
          )}>
            <ul className="navbar-nav flex flex-col lg:flex-row gap-1 lg:gap-0">
              {navItems.map((item, idx) => (
                <li key={idx} className="nav-item relative">
                  {item.children ? (
                    // Dropdown
                    <DropdownMenu item={item} />
                  ) : (
                    <Link 
                      href={item.href}
                      className={clsx(
                        'nav-link px-4 block',
                        item.isActive && 'text-primary'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Right content (buttons, etc) */}
            {rightContent && (
              <div className="mt-4 lg:mt-0 lg:ml-4">
                {rightContent}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

// =====================
// Dropdown Menu Component
// =====================
const DropdownMenu = ({ item }: { item: NavItem }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="dropdown relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={clsx(
          'nav-link px-4 flex items-center gap-1',
          item.isActive && 'text-primary'
        )}
      >
        {item.label}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && item.children && (
        <div className="dropdown-menu absolute top-full left-0 bg-white shadow-dropdown rounded min-w-[200px] py-2 z-50">
          {item.children.map((child, idx) => (
            <Link 
              key={idx}
              href={child.href}
              className="dropdown-item block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header
