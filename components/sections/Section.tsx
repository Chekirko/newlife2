import { ReactNode } from 'react'
import { clsx } from 'clsx'

// =====================
// Section Title Variants
// =====================
export type TitleAlign = 'left' | 'center' | 'right'

// =====================
// Section Title Props
// =====================
export interface SectionTitleProps {
  preTitle?: string
  title: string
  description?: string
  align?: TitleAlign
  isLight?: boolean
  className?: string
}

// =====================
// Section Title Component
// =====================
export const SectionTitle = ({
  preTitle,
  title,
  description,
  align = 'center',
  isLight = false,
  className,
}: SectionTitleProps) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={clsx(
      'title',
      alignClasses[align],
      isLight && 'title-light',
      className
    )}>
      {preTitle && (
        <span className="pre-title">{preTitle}</span>
      )}
      <h2>{title}</h2>
      {description && <p className="mb-0">{description}</p>}
    </div>
  )
}

// =====================
// Section Wrapper Props
// =====================
export interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  noPaddingTop?: boolean
  noPaddingBottom?: boolean
  backgroundImage?: string
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  patternOverlay?: 1 | 2 | 3 | 4
  bgColor?: string
}

// =====================
// Section Component
// =====================
export const Section = ({
  children,
  id,
  className,
  noPaddingTop = false,
  noPaddingBottom = false,
  backgroundImage,
  overlayDark,
  patternOverlay,
  bgColor,
}: SectionProps) => {
  const style = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {}

  return (
    <section
      id={id}
      className={clsx(
        noPaddingTop && 'pt-0',
        noPaddingBottom && 'pb-0',
        overlayDark && `bg-overlay-dark-${overlayDark}`,
        patternOverlay && `pattern-overlay-${patternOverlay}`,
        bgColor,
        className
      )}
      style={style}
    >
      {children}
    </section>
  )
}

export default Section
