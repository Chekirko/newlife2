'use client'

import { clsx } from 'clsx'
import { MinistryCard, MinistryCardGrid } from '@/components/ui/MinistryCard'
import type { Ministry } from '@/types/ministryTypes'

// =========================================
// MINISTRY GRID SECTION
// =========================================

export interface MinistryGridSectionProps {
  preTitle?: string
  title?: string
  description?: string
  items: Ministry[]
  columns?: 2 | 3 | 4
  className?: string
}

export const MinistryGridSection = ({
  preTitle,
  title,
  description,
  items,
  columns = 3,
  className,
}: MinistryGridSectionProps) => {
  return (
    <section className={clsx(className)}>
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

        <MinistryCardGrid columns={columns}>
          {items.map((item) => (
            <MinistryCard
              key={item.id}
              title={item.title}
              shortDescription={item.shortDescription}
              image={item.image}
              href={`/ministries/${item.slug}`}
            />
          ))}
        </MinistryCardGrid>
      </div>
    </section>
  )
}

export default MinistryGridSection
