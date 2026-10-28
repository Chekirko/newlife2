import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface TimelineItem {
  date: string
  title: string
  text: string
  /** Photo or video shown under the text. */
  media?: ReactNode
}

/** Larexa timeline: cards alternate around a central line from md up; one column on mobile. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index} className="md:grid md:grid-cols-[1fr_4rem_1fr]">
          <div aria-hidden="true" className="timeline-line relative hidden md:col-start-2 md:row-start-1 md:block">
            <span className="timeline-dot" />
          </div>
          <div className={clsx('py-2 md:row-start-1', index % 2 ? 'md:col-start-1' : 'md:col-start-3')}>
            <div className="overflow-hidden rounded border border-gray-300 bg-white">
              <div className="p-4">
                <span className="float-right ml-3 text-xs">{item.date}</span>
                <h3 className="mb-2 text-h4">{item.title}</h3>
                <p className="mb-0">{item.text}</p>
              </div>
              {item.media}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
