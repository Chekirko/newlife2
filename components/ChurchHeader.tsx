'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import type { SiteSettings } from '@/lib/site-settings'

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Головна', href: '/' },
  { 
    label: 'Про нас',
    href: '#',
    children: [
      { label: 'Про церкву', href: '/about' },
      { label: 'Історія', href: '/history' },
      { label: 'Команда', href: '/team' }
    ]
  },
  { label: 'Служіння', href: '/ministries' },
  { label: 'Новини', href: '/news' },
  { label: 'Події', href: '/events' },
  {
    label: 'Медіа',
    href: '#',
    children: [
      { label: 'Відео', href: '/media' },
      { label: 'Фото', href: '/media/photos' }
    ]
  },
  { label: 'Контакти', href: '/contact' },
]

const TOP_BAR_HEIGHT = 44

export default function ChurchHeader({ settings }: { settings: SiteSettings }) {
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const { phone, phoneDisplay, email, social } = settings
  // Sunday service time for the top bar (falls back to the first service).
  const sundayService =
    settings.services.find((s) => s.day === 'Неділя') ?? settings.services[0]

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Показати sticky header після прокрутки top bar
  const isSticky = scrollY > TOP_BAR_HEIGHT

  return (
    <>
      {/* Top Bar - зникає при скролі через transform */}
      <div 
        className="fixed top-0 left-0 right-0 z-[1001] bg-gray-100 border-b border-gray-200"
        style={{ 
          height: TOP_BAR_HEIGHT,
          transform: isSticky ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        <div className="container-larexa h-full">
          <div className="flex justify-between items-center h-full text-sm">
            {/* Left side */}
            <div className="hidden md:flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <i className="fas fa-phone text-primary" aria-hidden="true"></i>
                <a href={`tel:${phone}`} className="hover:text-primary">{phoneDisplay}</a>
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-envelope text-primary" aria-hidden="true"></i>
                <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
              {sundayService && (
                <span className="hidden sm:inline text-gray-600">
                  <i className="far fa-clock text-primary mr-1" aria-hidden="true"></i>
                  {sundayService.day}: {sundayService.time}
                </span>
              )}
              <div className="flex gap-2">
                {social.map((s) => (
                  <a
                    key={s.platform + s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ backgroundColor: s.color }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs hover:opacity-80"
                  >
                    <i className={s.icon} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header — always white, opaque */}
      <header 
        className="fixed left-0 right-0 z-[1000] bg-white"
        style={{ 
          top: isSticky ? 0 : TOP_BAR_HEIGHT,
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          transition: 'top 0.3s ease'
        }}
      >
        <div className="container-larexa py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="navbar-brand flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="text-white font-bold text-lg">НЖ</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg block leading-tight text-gray-800">
                  Нове Життя
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <ul className="navbar-nav flex items-center">
                {navItems.map((item, idx) => (
                  <li key={idx} className="nav-item relative">
                    {item.children ? (
                      <DropdownMenu item={item} pathname={pathname} />
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className={clsx(
                          'nav-link px-4 py-2 block font-medium text-[15px] transition-colors hover:text-primary',
                          pathname === item.href ? 'text-primary' : 'text-gray-700',
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="btn btn-grad ml-4">
                Відвідати
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="lg:hidden p-2 z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span 
                className="block w-6 h-0.5 mb-1.5 bg-gray-800"
                style={{ 
                  transform: isMobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <span 
                className="block w-6 h-0.5 mb-1.5 bg-gray-800"
                style={{ 
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transition: 'all 0.3s ease'
                }}
              />
              <span 
                className="block w-6 h-0.5 bg-gray-800"
                style={{ 
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-50 overflow-hidden"
          style={{
            maxHeight: isMobileMenuOpen ? '500px' : '0',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'max-height 0.3s ease, opacity 0.3s ease'
          }}
        >
          <div className="container-larexa py-4">
            <ul className="space-y-2">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  {item.children ? (
                    <MobileDropdown
                      item={item}
                      pathname={pathname}
                      onClose={() => setIsMobileMenuOpen(false)}
                    />
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className={clsx(
                        'block py-2 px-4 rounded hover:text-primary hover:bg-gray-50',
                        pathname === item.href ? 'text-primary' : 'text-gray-700',
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t">
              <Link 
                href="/contact" 
                className="btn btn-grad w-full text-center block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Відвідати
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

// A dropdown parent is "active" when the current route is one of its children
// (e.g. «Медіа» highlights on /media and /media/photos; «Про нас» on /about etc.).
function isParentActive(item: NavItem, pathname: string): boolean {
  return Boolean(
    item.children?.some(
      (c) => pathname === c.href || (c.href !== '/' && pathname.startsWith(c.href)),
    ),
  )
}

// Desktop Dropdown Menu — keyboard-accessible disclosure (opens on hover + click,
// closes on Escape or when focus/pointer leaves the group)
function DropdownMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const menuId = `dropdown-${item.label.replace(/\s+/g, '-')}`
  const isActive = isParentActive(item, pathname)

  return (
    <div
      className="dropdown relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'nav-link px-4 py-2 flex items-center gap-1 font-medium text-[15px] transition-colors hover:text-primary',
          isActive ? 'text-primary' : 'text-gray-700',
        )}
      >
        {item.label}
        <svg
          className={clsx('w-3 h-3 transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={menuId}
        className={clsx(
          'dropdown-menu absolute top-full left-0 bg-white shadow-dropdown rounded min-w-[200px] py-2 z-50 transition-all',
          open ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
      >
        {item.children?.map((child, idx) => (
          <Link
            key={idx}
            href={child.href}
            aria-current={pathname === child.href ? 'page' : undefined}
            onClick={() => setOpen(false)}
            className={clsx(
              'dropdown-item block px-4 py-2 hover:text-primary hover:bg-gray-50 transition-colors',
              pathname === child.href ? 'text-primary' : 'text-gray-600',
            )}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Mobile Dropdown Menu
function MobileDropdown({
  item,
  pathname,
  onClose,
}: {
  item: NavItem
  pathname: string
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const isActive = isParentActive(item, pathname)

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        className={clsx(
          'w-full flex items-center justify-between py-2 px-4 rounded hover:text-primary hover:bg-gray-50',
          isActive ? 'text-primary' : 'text-gray-700',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
        <svg
          className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && item.children && (
        <div className="pl-4 mt-1 space-y-1">
          {item.children.map((child, idx) => (
            <Link
              key={idx}
              href={child.href}
              aria-current={pathname === child.href ? 'page' : undefined}
              className={clsx(
                'block py-2 px-4 rounded text-sm hover:text-primary hover:bg-gray-50',
                pathname === child.href ? 'text-primary' : 'text-gray-500',
              )}
              onClick={onClose}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
