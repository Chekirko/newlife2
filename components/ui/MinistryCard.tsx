'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

// =====================
// Ministry Card Component
// =====================

export interface MinistryCardProps {
  title: string
  shortDescription?: string
  /** Image URL — either a Sanity CDN URL (from urlFor()) or a static path */
  image: string
  href?: string
  className?: string
}

export const MinistryCard = ({
  title,
  shortDescription,
  image,
  href = '#',
  className,
}: MinistryCardProps) => {
  return (
    <Link href={href} className={clsx('group block overflow-hidden rounded-lg relative', className)}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        <Image
          src={image}
          alt={title}
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Bottom blurred banner — green gradient theme */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 py-5 z-10"
        style={{
          background: 'linear-gradient(150deg, rgba(151, 199, 78, 0.75) 0%, rgba(42, 185, 165, 0.75) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <h6 className="text-white text-xl font-semibold m-0">{title}</h6>
      </div>
    </Link>
  )
}

// =====================
// Ministry Card Grid Container
// =====================

export type MinistryGridColumns = 2 | 3 | 4

export interface MinistryCardGridProps {
  children: React.ReactNode
  columns?: MinistryGridColumns
  className?: string
}

const gridClasses: Record<MinistryGridColumns, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export const MinistryCardGrid = ({
  children,
  columns = 3,
  className,
}: MinistryCardGridProps) => {
  return (
    <div className={clsx(
      'grid gap-4',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}

export default MinistryCard
