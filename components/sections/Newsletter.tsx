'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

// =========================================
// NEWSLETTER VARIANT 1: Centered with Pattern
// (creative-agency demo style)
// =========================================
export interface NewsletterCenteredProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  bottomText?: string
  patternOverlay?: 1 | 2 | 3 | 4
  onSubmit?: (email: string) => void
  className?: string
}

export const NewsletterCentered = ({
  title = "Get started for free! You'll Love it!",
  description = "One account for all Larexa apps - 30 days free trial, no credit card required!",
  placeholder = "Enter your email...",
  buttonText = "Get started now",
  bottomText = "Free 30 day trial. Easy setup. Cancel any time",
  patternOverlay = 1,
  onSubmit,
  className,
}: NewsletterCenteredProps) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <section className={clsx(
      'bg-gray-100',
      `pattern-overlay-${patternOverlay}-dark`,
      className
    )}>
      <div className="container-larexa">
        <div className="max-w-3xl mx-auto p-6 md:p-10 relative">
          <div className="text-center px-0 md:px-10">
            <h2>{title}</h2>
            <p className="mb-4 text-lg">{description}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="flex max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 px-4 py-3 border border-r-0 border-gray-300 rounded-l focus:outline-none focus:border-primary"
                  required
                />
                <button type="submit" className="btn btn-grad m-0 rounded-l-none">
                  <span className="hidden md:block">{buttonText}</span>
                  <span className="md:hidden">
                    <i className="far fa-paper-plane" />
                  </span>
                </button>
              </div>
            </form>
            
            {bottomText && <small className="mt-4 block text-gray-600">{bottomText}</small>}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// NEWSLETTER VARIANT 2: Split with Image
// =========================================
export interface NewsletterSplitProps {
  title: string
  description?: string
  placeholder?: string
  buttonText?: string
  features?: string[]
  isGradient?: boolean
  onSubmit?: (email: string) => void
  className?: string
}

export const NewsletterSplit = ({
  title,
  description,
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  features = [],
  isGradient = true,
  onSubmit,
  className,
}: NewsletterSplitProps) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <section className={clsx(
      isGradient && 'bg-grad all-text-white',
      className
    )}>
      <div className="container-larexa">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h2 className={isGradient ? 'text-white' : ''}>{title}</h2>
            {description && <p>{description}</p>}
            
            {features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <i className="fa fa-check text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-primary text-gray-800"
                required
              />
              <button type="submit" className="btn btn-grad w-full">
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// NEWSLETTER VARIANT 3: Inline CTA
// =========================================
export interface NewsletterInlineProps {
  title: string
  placeholder?: string
  buttonText?: string
  isDark?: boolean
  isGradient?: boolean
  onSubmit?: (email: string) => void
  className?: string
}

export const NewsletterInline = ({
  title,
  placeholder = "Your email",
  buttonText = "Subscribe",
  isDark = false,
  isGradient = false,
  onSubmit,
  className,
}: NewsletterInlineProps) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <section className={clsx(
      'py-10',
      isGradient && 'bg-grad all-text-white',
      isDark && !isGradient && 'bg-gray-800 text-white',
      className
    )}>
      <div className="container-larexa">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <h4 className="m-0 flex-shrink-0">{title}</h4>
          <form onSubmit={handleSubmit} className="flex-1 flex w-full max-w-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 border-0 rounded-l focus:outline-none text-gray-800"
              required
            />
            <button 
              type="submit" 
              className={clsx(
                'btn m-0 rounded-l-none',
                isGradient || isDark ? 'btn-white' : 'btn-grad'
              )}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { NewsletterCentered as Newsletter }
export default NewsletterCentered
