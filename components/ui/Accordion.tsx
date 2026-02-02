'use client'

import { ReactNode, useState } from 'react'
import { clsx } from 'clsx'

// =====================
// Accordion Variants
// =====================
export type AccordionVariant = 
  | 'default' 
  | 'icon-primary' 
  | 'icon-gradient' 
  | 'icon-dark' 
  | 'line'

// =====================
// Props Interfaces
// =====================
export interface AccordionItemData {
  id: string
  title: string
  content: ReactNode
}

export interface AccordionProps {
  items: AccordionItemData[]
  variant?: AccordionVariant
  defaultActiveKey?: string
  className?: string
}

export interface AccordionItemProps {
  item: AccordionItemData
  isOpen: boolean
  onToggle: () => void
  variant: AccordionVariant
}

// =====================
// Variant Class Map
// =====================
const variantClasses: Record<AccordionVariant, string> = {
  default: '',
  'icon-primary': 'accordion-icon-primary',
  'icon-gradient': 'accordion-icon-gradient',
  'icon-dark': 'accordion-icon-dark',
  line: 'accordion-line',
}

// =====================
// Accordion Item Component
// =====================
const AccordionItem = ({ item, isOpen, onToggle, variant }: AccordionItemProps) => {
  const isColored = variant === 'icon-primary' || variant === 'icon-gradient' || variant === 'icon-dark'
  
  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <button
          className={clsx(
            'accordion-button',
            !isOpen && 'collapsed'
          )}
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span>{item.title}</span>
          {!isColored && (
            <svg
              className={clsx(
                'w-4 h-4 transition-transform duration-300',
                isOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {isColored && (
            <span className="text-xs font-bold">
              {isOpen ? '−' : '+'}
            </span>
          )}
        </button>
      </div>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="accordion-body">
          {item.content}
        </div>
      </div>
    </div>
  )
}

// =====================
// Accordion Component
// =====================
export const Accordion = ({
  items,
  variant = 'default',
  defaultActiveKey,
  className,
}: AccordionProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(defaultActiveKey || null)

  const handleToggle = (key: string) => {
    setActiveKey(activeKey === key ? null : key)
  }

  return (
    <div className={clsx('accordion', variantClasses[variant], className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={activeKey === item.id}
          onToggle={() => handleToggle(item.id)}
          variant={variant}
        />
      ))}
    </div>
  )
}

export default Accordion
