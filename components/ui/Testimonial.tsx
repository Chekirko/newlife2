import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'

// =====================
// Testimonial Variants
// =====================
export type TestimonialVariant = 'default' | 'full' | 'border' | 'big'

// =====================
// Props Interface
// =====================
export interface TestimonialProps {
  quote: string
  authorName: string
  authorPosition?: string
  authorImage?: string | StaticImageData
  variant?: TestimonialVariant
  className?: string
}

// =====================
// Testimonial Component
// =====================
export const Testimonial = ({
  quote,
  authorName,
  authorPosition,
  authorImage,
  variant = 'default',
  className,
}: TestimonialProps) => {
  const isBorder = variant === 'border'
  const isFull = variant === 'full' || variant === 'big'
  const isBig = variant === 'big'

  return (
    <div className={clsx(
      'testimonials',
      isBorder && 'testimonials-border',
      className
    )}>
      <div className="testimonials-wrap">
        {/* Full/Big variant with avatar on top */}
        {isFull && (
          <div className="testi-full">
            {authorImage && (
              <div className="testi-avatar">
                <Image 
                  src={authorImage} 
                  alt={authorName}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
            )}
            <div className={clsx('testi-text', isBig && 'testi-big')}>
              <p className={isBig ? 'text-[22px] leading-10' : ''}>
                "{quote}"
              </p>
            </div>
            <div className="mt-4">
              <h6 className="mb-0">{authorName}</h6>
              {authorPosition && (
                <span className="text-primary text-sm">{authorPosition}</span>
              )}
            </div>
          </div>
        )}

        {/* Border variant */}
        {isBorder && (
          <>
            <div className="testi-text">
              <p>"{quote}"</p>
            </div>
            <div className="testi-avatar text-center">
              {authorImage && (
                <Image 
                  src={authorImage} 
                  alt={authorName}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
              )}
              <h6 className="mt-3 mb-0">{authorName}</h6>
              {authorPosition && (
                <span className="text-primary text-sm">{authorPosition}</span>
              )}
            </div>
          </>
        )}

        {/* Default variant */}
        {variant === 'default' && (
          <div className="flex gap-4">
            {authorImage && (
              <div className="testi-avatar flex-shrink-0">
                <Image 
                  src={authorImage} 
                  alt={authorName}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
            )}
            <div>
              <p className="mb-3">"{quote}"</p>
              <h6 className="mb-0">{authorName}</h6>
              {authorPosition && (
                <span className="text-primary text-sm">{authorPosition}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Testimonial
