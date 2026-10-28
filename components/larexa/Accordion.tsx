import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

interface AccordionProps {
  items: { q: string; a: ReactNode }[]
  /** Shared `<details name>` keeps one answer open at a time, without JS. */
  name: string
}

/** Larexa gradient accordion on native details/summary; the first answer starts open. */
export function Accordion({ items, name }: AccordionProps) {
  return (
    <div className="accordion-icon-gradient">
      {items.map((item, index) => (
        <details key={index} name={name} open={index === 0} className="group accordion-item">
          <summary className="accordion-header">
            {item.q}
            <span className="shrink-0 text-xs group-open:hidden"><Icon className="fas fa-plus" /></span>
            <span className="hidden shrink-0 text-xs group-open:inline"><Icon className="fas fa-minus" /></span>
          </summary>
          <div className="accordion-body">
            {typeof item.a === 'string' ? <p className="mb-0">{item.a}</p> : item.a}
          </div>
        </details>
      ))}
    </div>
  )
}
