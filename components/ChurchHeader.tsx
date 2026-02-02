'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Головна', href: '/' },
  { label: 'Про нас', href: '/about' },
  { 
    label: 'Служіння', 
    href: '/ministries',
    children: [
      { label: 'Дитяче служіння', href: '/ministries/children' },
      { label: 'Молодіжне служіння', href: '/ministries/youth' },
      { label: 'Жіноче служіння', href: '/ministries/women' },
      { label: 'Чоловіче служіння', href: '/ministries/men' },
    ]
  },
  { label: 'Новини', href: '/news' },
  { label: 'Медіа', href: '/media' },
  { label: 'Контакти', href: '/contact' },
]

const TOP_BAR_HEIGHT = 44

export default function ChurchHeader() {
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
                <i className="fas fa-phone text-primary"></i>
                <a href="tel:+380501234567" className="hover:text-primary">+38 (050) 123-45-67</a>
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                <a href="mailto:info@newlife.church" className="hover:text-primary">info@newlife.church</a>
              </span>
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="hidden sm:inline text-gray-600">
                <i className="far fa-clock text-primary mr-1"></i>
                Неділя: 10:00
              </span>
              <div className="flex gap-2">
                <a href="#" className="w-7 h-7 rounded-full bg-[#3b5998] flex items-center justify-center text-white text-xs hover:opacity-80">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-7 h-7 rounded-full bg-[#e4405f] flex items-center justify-center text-white text-xs hover:opacity-80">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-7 h-7 rounded-full bg-[#ff0000] flex items-center justify-center text-white text-xs hover:opacity-80">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className="fixed left-0 right-0 z-[1000]"
        style={{ 
          top: isSticky ? 0 : TOP_BAR_HEIGHT,
          backgroundColor: isSticky ? 'white' : 'transparent',
          boxShadow: isSticky ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'top 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <div className="container-larexa py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="navbar-brand flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: isSticky ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                  backdropFilter: isSticky ? 'none' : 'blur(4px)',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <span className="text-white font-bold text-lg">НЖ</span>
              </div>
              <div className="hidden sm:block">
                <span 
                  className="font-heading font-bold text-lg block leading-tight"
                  style={{ 
                    color: isSticky ? '#343a40' : 'white',
                    transition: 'color 0.3s ease'
                  }}
                >
                  Нове Життя
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <ul className="navbar-nav flex items-center">
                {navItems.map((item, idx) => (
                  <li key={idx} className="nav-item relative group">
                    {item.children ? (
                      <DropdownMenu item={item} isSticky={isSticky} />
                    ) : (
                      <Link 
                        href={item.href}
                        className="nav-link px-4 py-2 block font-medium text-[15px]"
                        style={{ 
                          color: isSticky ? '#495057' : 'rgba(255,255,255,0.9)',
                          transition: 'color 0.3s ease'
                        }}
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
              className="lg:hidden p-2 z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span 
                className="block w-6 h-0.5 mb-1.5"
                style={{ 
                  backgroundColor: isSticky ? '#343a40' : 'white',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <span 
                className="block w-6 h-0.5 mb-1.5"
                style={{ 
                  backgroundColor: isSticky ? '#343a40' : 'white',
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transition: 'all 0.3s ease'
                }}
              />
              <span 
                className="block w-6 h-0.5"
                style={{ 
                  backgroundColor: isSticky ? '#343a40' : 'white',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
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
                    <MobileDropdown item={item} onClose={() => setIsMobileMenuOpen(false)} />
                  ) : (
                    <Link 
                      href={item.href}
                      className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
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

// Desktop Dropdown Menu
function DropdownMenu({ item, isSticky }: { item: NavItem; isSticky: boolean }) {
  return (
    <div className="dropdown relative group">
      <button 
        className="nav-link px-4 py-2 flex items-center gap-1 font-medium text-[15px]"
        style={{ 
          color: isSticky ? '#495057' : 'rgba(255,255,255,0.9)',
          transition: 'color 0.3s ease'
        }}
      >
        {item.label}
        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="dropdown-menu absolute top-full left-0 bg-white shadow-dropdown rounded min-w-[200px] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {item.children?.map((child, idx) => (
          <Link 
            key={idx}
            href={child.href}
            className="dropdown-item block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Mobile Dropdown Menu
function MobileDropdown({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button 
        className="w-full flex items-center justify-between py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
        <svg className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && item.children && (
        <div className="pl-4 mt-1 space-y-1">
          {item.children.map((child, idx) => (
            <Link 
              key={idx}
              href={child.href}
              className="block py-2 px-4 text-gray-500 hover:text-primary hover:bg-gray-50 rounded text-sm"
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
