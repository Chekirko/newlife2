'use client'

import { clsx } from 'clsx'
import { StaticImageData } from 'next/image'

// =========================================
// ActionBoxFullWidth - Full Width Background CTA
// Extracted from Larexa ActionBox (variant 6)
// =========================================
export interface ActionBoxFullWidthProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  backgroundImage?: string | StaticImageData
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  isGradient?: boolean
  className?: string
}

export const ActionBoxFullWidth = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundImage,
  overlayDark = 5,
  isGradient = false,
  className,
}: ActionBoxFullWidthProps) => {
  return (
    <section 
      className={clsx(
        'py-16',
        isGradient && 'bg-grad',
        backgroundImage && `bg-overlay-dark-${overlayDark} bg-cover bg-center`,
        'all-text-white',
        className
      )}
      style={backgroundImage ? {
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`
      } : undefined}
    >
      <div className="container-larexa text-center">
        <h2 className="text-white">{title}</h2>
        {subtitle && <p className="text-white/80 mb-6">{subtitle}</p>}
        <div className="flex justify-center gap-4 flex-wrap">
          {buttonText && (
            <a href={buttonHref || '#'} className="btn btn-white">
              {buttonText}
            </a>
          )}
          {secondaryButtonText && (
            <a href={secondaryButtonHref || '#'} className="btn btn-outline-white">
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default ActionBoxFullWidth
