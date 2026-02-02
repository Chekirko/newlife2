'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'

// =========================================
// FAQ ITEM INTERFACE
// =========================================
export interface FAQItem {
  id: string
  question: string
  answer: string
  learnMoreHref?: string
}

// =========================================
// FAQ VARIANT 1: Grid Cards (Dark)
// (agency-startUp demo style)
// =========================================
export interface FAQGridProps {
  preTitle?: string
  title?: string
  description?: string
  items: FAQItem[]
  columns?: 2 | 3 | 4
  buttonText?: string
  buttonHref?: string
  bottomText?: string
  isDark?: boolean
  className?: string
}

export const FAQGrid = ({
  preTitle,
  title,
  description,
  items,
  columns = 4,
  buttonText,
  buttonHref,
  bottomText,
  isDark = true,
  className,
}: FAQGridProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'md:w-1/4',
  }

  return (
    <section className={clsx(
      isDark && 'bg-gray-800',
      className
    )}>
      <div className="container-larexa">
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className={clsx('title', isDark && 'all-text-white')}>
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
              {description && <p>{description}</p>}
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {items.map((item) => (
            <div key={item.id} className={clsx('w-full px-4 mb-6', columnClasses[columns])}>
              <div className={clsx(
                'border-l-2 border-dotted border-primary py-6 pl-4',
                isDark && 'all-text-white'
              )}>
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
                {item.learnMoreHref && (
                  <Link href={item.learnMoreHref} className="text-primary">
                    Learn more <i className="ti-arrow-right text-primary" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {(buttonText || bottomText) && (
          <div className="text-center mt-6">
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad mb-2">
                {buttonText}
              </Link>
            )}
            {bottomText && (
              <p className={clsx('small', isDark && 'text-white')}>{bottomText}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// =========================================
// FAQ VARIANT 2: Accordion Style
// =========================================
export interface FAQAccordionProps {
  preTitle?: string
  title?: string
  description?: string
  items: FAQItem[]
  variant?: 'default' | 'icon-primary' | 'icon-gradient'
  defaultOpen?: number
  className?: string
}

export const FAQAccordion = ({
  preTitle,
  title,
  description,
  items,
  variant = 'icon-gradient',
  defaultOpen = 0,
  className,
}: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  const variantClasses = {
    default: 'accordion',
    'icon-primary': 'accordion accordion-icon-primary',
    'icon-gradient': 'accordion accordion-icon-gradient',
  }

  return (
    <section className={className}>
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

        <div className="max-w-4xl mx-auto">
          <div className={variantClasses[variant]}>
            {items.map((item, idx) => (
              <div key={item.id} className="accordion-item border-b border-gray-200">
                <button
                  className="accordion-header w-full text-left py-4 flex justify-between items-center font-bold"
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                >
                  {item.question}
                  <span className={clsx(
                    'transition-transform',
                    openIndex === idx && 'rotate-180'
                  )}>
                    <i className="fas fa-chevron-down" />
                  </span>
                </button>
                <div className={clsx(
                  'accordion-body overflow-hidden transition-all duration-300',
                  openIndex === idx ? 'max-h-96 pb-4' : 'max-h-0'
                )}>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// FAQ VARIANT 3: Split with Contact
// =========================================
export interface FAQSplitProps {
  title: string
  description?: string
  items: FAQItem[]
  contactTitle?: string
  contactDescription?: string
  contactButtonText?: string
  contactButtonHref?: string
  className?: string
}

export const FAQSplit = ({
  title,
  description,
  items,
  contactTitle,
  contactDescription,
  contactButtonText,
  contactButtonHref,
  className,
}: FAQSplitProps) => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {/* FAQ side */}
          <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
            <h2 className="text-3xl mb-4">{title}</h2>
            {description && <p className="mb-6">{description}</p>}
            
            <div className="accordion">
              {items.map((item, idx) => (
                <div key={item.id} className="accordion-item border-b border-gray-200">
                  <button
                    className="accordion-header w-full text-left py-4 flex justify-between items-center font-bold"
                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  >
                    {item.question}
                    <span className={clsx(
                      'transition-transform',
                      openIndex === idx && 'rotate-180'
                    )}>
                      <i className="fas fa-chevron-down" />
                    </span>
                  </button>
                  <div className={clsx(
                    'accordion-body overflow-hidden transition-all duration-300',
                    openIndex === idx ? 'max-h-96 pb-4' : 'max-h-0'
                  )}>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact side */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="bg-grad rounded p-6 lg:p-8 all-text-white">
              {contactTitle && <h4>{contactTitle}</h4>}
              {contactDescription && <p>{contactDescription}</p>}
              {contactButtonText && (
                <Link href={contactButtonHref || '#'} className="btn btn-white">
                  {contactButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { FAQAccordion as FAQ }
export { FAQAccordion as Faqs }
export default FAQAccordion
