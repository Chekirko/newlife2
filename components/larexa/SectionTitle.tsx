import { clsx } from 'clsx'

interface SectionTitleProps {
  preTitle?: string
  title: string
  text?: string
  /** White text for dark or gradient sections. */
  light?: boolean
  as?: 'h2' | 'h3'
  className?: string
}

/** Larexa `.title`: Playfair pre-title, heading and an optional lead paragraph. */
export function SectionTitle({ preTitle, title, text, light, as: Heading = 'h2', className }: SectionTitleProps) {
  return (
    <div className={clsx('title', light && 'title-light', className)}>
      {preTitle && <span className="pre-title">{preTitle}</span>}
      <Heading>{title}</Heading>
      {text && <p className="mb-0">{text}</p>}
    </div>
  )
}
