'use client'

import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'

// =========================================
// TESTIMONIAL DATA INTERFACE
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
// TestimonialsGrid - Grid Cards layout
// Extracted from Larexa Testimonials (variant 2)
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

export default TestimonialsGrid
