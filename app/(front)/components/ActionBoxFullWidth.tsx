import { clsx } from 'clsx'
import Image, { type StaticImageData } from '@/components/ui/SiteImage'
import Link from 'next/link'

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
        'relative isolate py-16',
        isGradient && 'bg-grad-readable',
        'all-text-white',
        className
      )}
    >
      {backgroundImage && <>
        <Image src={backgroundImage} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black" style={{ opacity: overlayDark / 10 }} />
      </>}
      <div className="container-larexa text-center">
        <h2 className="text-white">{title}</h2>
        {subtitle && <p className="text-white/80 mb-6">{subtitle}</p>}
        <div className="flex justify-center gap-4 flex-wrap">
          {buttonText && (
            <Link href={buttonHref || '#'} className="btn btn-white">
              {buttonText}
            </Link>
          )}
          {secondaryButtonText && (
            <Link href={secondaryButtonHref || '#'} className="btn btn-outline-white">
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default ActionBoxFullWidth
