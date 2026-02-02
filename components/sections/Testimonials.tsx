'use client'

import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'

// =========================================
// TESTIMONIAL INTERFACE
// =========================================
export interface TestimonialData {
  id: string
  quote: string
  name: string
  position?: string
  avatar?: string | StaticImageData
  rating?: number
}

// =========================================
// TESTIMONIALS VARIANT 1: Parallax Slider
// (creative-agency demo style)
// =========================================
export interface TestimonialsSectionProps {
  testimonials: TestimonialData[]
  backgroundImage?: string | StaticImageData
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  isGradientCard?: boolean
  className?: string
}

export const TestimonialsSection = ({
  testimonials,
  backgroundImage,
  overlayDark = 2,
  isGradientCard = true,
  className,
}: TestimonialsSectionProps) => {
  return (
    <section 
      className={clsx(
        `bg-overlay-dark-${overlayDark}`,
        'bg-fixed bg-cover bg-center',
        className
      )}
      style={backgroundImage ? {
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`
      } : undefined}
    >
      <div className="container-larexa">
        <div className="md:w-1/2">
          <div className={clsx(
            'testimonials all-text-white p-6 md:p-10 rounded',
            isGradientCard && 'bg-grad'
          )}>
            <span className="text-5xl">
              <i className="fas fa-quote-left mb-4" />
            </span>
            
            {/* Simple display of first testimonial - in real use with slider */}
            {testimonials[0] && (
              <div className="testimonials-wrap">
                <div className="testi-text text-left p-0">
                  <p className="text-white">{testimonials[0].quote}</p>
                  <div className="flex items-center mt-4">
                    {testimonials[0].avatar && (
                      <div className="testi-avatar mr-4">
                        <Image 
                          src={testimonials[0].avatar} 
                          alt={testimonials[0].name}
                          width={60}
                          height={60}
                          className="w-16 rounded-full"
                        />
                      </div>
                    )}
                    <div>
                      <h6 className="m-0">{testimonials[0].name}</h6>
                      {testimonials[0].position && (
                        <h6 className="small opacity-70">{testimonials[0].position}</h6>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// TESTIMONIALS VARIANT 2: Grid Cards
// =========================================
export interface TestimonialsGridProps {
  preTitle?: string
  title?: string
  description?: string
  testimonials: TestimonialData[]
  columns?: 2 | 3 | 4
  className?: string
}

export const TestimonialsGrid = ({
  preTitle,
  title,
  description,
  testimonials,
  columns = 3,
  className,
}: TestimonialsGridProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/2 lg:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={className}>
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

        <div className="flex flex-wrap -mx-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="testimonials testi-border h-full p-6 border rounded">
                {testimonial.rating && (
                  <div className="flex gap-1 mb-3 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i 
                        key={i} 
                        className={clsx(
                          'fas fa-star',
                          i >= testimonial.rating! && 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                )}
                <p className="testi-text">{testimonial.quote}</p>
                <div className="flex items-center mt-4">
                  {testimonial.avatar && (
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <h6 className="m-0 font-bold">{testimonial.name}</h6>
                    {testimonial.position && (
                      <small className="text-gray-500">{testimonial.position}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// TESTIMONIALS VARIANT 3: Big Quote Center
// =========================================
export interface TestimonialsBigQuoteProps {
  testimonial: TestimonialData
  isGradient?: boolean
  isDark?: boolean
  className?: string
}

export const TestimonialsBigQuote = ({
  testimonial,
  isGradient = false,
  isDark = false,
  className,
}: TestimonialsBigQuoteProps) => {
  return (
    <section className={clsx(
      'py-16',
      isGradient && 'bg-grad all-text-white',
      isDark && !isGradient && 'bg-gray-800 text-white',
      className
    )}>
      <div className="container-larexa">
        <div className="max-w-4xl mx-auto text-center">
          <i className={clsx(
            'fas fa-quote-left text-6xl mb-6',
            isGradient || isDark ? 'text-white/30' : 'text-primary/30'
          )} />
          <blockquote className="text-2xl lg:text-3xl italic mb-6">
            "{testimonial.quote}"
          </blockquote>
          <div className="flex justify-center items-center gap-4">
            {testimonial.avatar && (
              <Image 
                src={testimonial.avatar} 
                alt={testimonial.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div className="text-left">
              <h5 className="m-0">{testimonial.name}</h5>
              {testimonial.position && (
                <span className={isGradient || isDark ? 'text-white/70' : 'text-gray-500'}>
                  {testimonial.position}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// TESTIMONIALS VARIANT 4: Carousel Row
// =========================================
export interface TestimonialsCarouselProps {
  preTitle?: string
  title?: string
  testimonials: TestimonialData[]
  autoScroll?: boolean
  className?: string
}

export const TestimonialsCarousel = ({
  preTitle,
  title,
  testimonials,
  className,
}: TestimonialsCarouselProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        {(preTitle || title) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="testimonials testi-full bg-gray-100 rounded p-6">
              <p className="testi-text italic">{testimonial.quote}</p>
              <div className="flex items-center mt-4 pt-4 border-t">
                {testimonial.avatar && (
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                )}
                <div>
                  <h6 className="m-0 font-bold">{testimonial.name}</h6>
                  {testimonial.position && (
                    <small className="text-gray-500">{testimonial.position}</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { TestimonialsSection as Testimonials }
export default TestimonialsSection
