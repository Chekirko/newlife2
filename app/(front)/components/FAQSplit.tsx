import { Icon } from '@/components/ui/Icon'

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
                <details key={item.id} name="faq" open={idx === 0} className="group accordion-item border-b border-gray-200">
                  <summary className="accordion-header w-full cursor-pointer list-none text-left py-4 flex justify-between items-center gap-4 font-bold">
                    {item.question}
                    <span className="transition-transform group-open:rotate-180">
                      <Icon className="fas fa-chevron-down" />
                    </span>
                  </summary>
                  <div className="accordion-body pb-4">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact side */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="bg-grad-readable rounded p-6 lg:p-8 all-text-white">
              {contactTitle && <h3 className="text-h4">{contactTitle}</h3>}
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
