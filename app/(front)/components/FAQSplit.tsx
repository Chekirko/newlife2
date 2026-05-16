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
// FAQSplit - Split FAQ with Contact sidebar
// Extracted from Larexa FAQ (variant 3)
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

export default FAQSplit
