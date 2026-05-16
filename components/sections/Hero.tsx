'use client'

import { ReactNode, useState, useEffect, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// HERO VARIANT 1: Basic Slider
// (home demo style) — used on Homepage, Ministries
// =========================================
export interface HeroSlide {
  id: string
  backgroundImage: string | StaticImageData
  preTitle?: string
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  align?: 'left' | 'center' | 'right'
}

export interface HeroSliderProps {
  slides: HeroSlide[]
  height?: string
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  autoplay?: boolean
  autoplaySpeed?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export const HeroSlider = ({
  slides,
  height = 'h-[400px] lg:h-[700px]',
  overlayDark = 2,
  autoplay = true,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = false,
  className,
}: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!autoplay) return
    timerRef.current = setInterval(nextSlide, autoplaySpeed)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoplay, autoplaySpeed, nextSlide])

  return (
    <section className={clsx('relative overflow-hidden p-0', className)}>
      <div className="relative">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={clsx(
              height,
              `bg-overlay-dark-${overlayDark}`,
              'bg-cover bg-center transition-opacity duration-500',
              idx === currentSlide ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
            )}
            style={{
              backgroundImage: typeof slide.backgroundImage === 'string' 
                ? `url(${slide.backgroundImage})` 
                : `url(${slide.backgroundImage.src})`
            }}
          >
            <div className="container-larexa h-full flex items-center">
              <div className={clsx(
                'w-full lg:w-2/3 xl:w-1/2',
                slide.align === 'center' && 'mx-auto text-center',
                slide.align === 'right' && 'ml-auto text-right'
              )}>
                {slide.preTitle && (
                  <h3 className="text-white font-alt italic text-xl lg:text-2xl mb-2">
                    {slide.preTitle}
                  </h3>
                )}
                <h2 className="text-white font-bold text-3xl lg:text-5xl xl:text-6xl mb-4">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-white text-lg lg:text-xl mb-6">{slide.subtitle}</p>
                )}
                <div>
                  {slide.buttonText && (
                    <a href={slide.buttonHref || '#'} className="btn btn-grad">
                      {slide.buttonText}
                    </a>
                  )}
                  {slide.secondaryButtonText && (
                    <a href={slide.secondaryButtonHref || '#'} className="btn btn-link text-white ml-4">
                      {slide.secondaryButtonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={clsx(
                'w-3 h-3 rounded-full transition-colors',
                idx === currentSlide ? 'bg-white' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// =========================================
// HERO VARIANT 6: Gradient with Pattern + Image
// (agency-startUp demo style) — used on Homepage
// =========================================
export interface HeroGradientImageProps {
  preTitle?: string
  title: string
  subtitle?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  image?: string | StaticImageData
  videoUrl?: string
  showWaveDivider?: boolean
  className?: string
}

export const HeroGradientImage = ({
  preTitle,
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  image,
  videoUrl,
  showWaveDivider = true,
  className,
}: HeroGradientImageProps) => {
  return (
    <section className={clsx('p-0 py-10 bg-grad pattern-overlay-2 relative', className)}>
      <div className="container-larexa">
        <div className="flex flex-wrap py-0 md:py-10 items-center">
          {/* Content */}
          <div className="w-full lg:w-1/2 all-text-white my-10 md:mt-0 relative">
            <div className="text-left py-0 md:py-10 my-10">
              {preTitle && <h6>{preTitle}</h6>}
              <h2 className="text-4xl font-normal">{title}</h2>
              {subtitle && <p className="mb-4 text-lg">{subtitle}</p>}
              {primaryButtonText && (
                <a href={primaryButtonHref || '#'} className="btn btn-white mr-4">
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a href={secondaryButtonHref || '#'} className="btn btn-outline-white">
                  {secondaryButtonText}
                </a>
              )}
            </div>
          </div>
          
          {/* Image with video button */}
          {image && (
            <div className="w-full lg:w-1/2 hidden lg:block relative">
              <Image 
                src={image} 
                alt=""
                width={600}
                height={400}
                className="rounded shadow"
              />
              {videoUrl && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <a href={videoUrl} className="btn btn-grad btn-round btn-lg zoom-on-hover">
                    <i className="fa fa-play" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Wave divider */}
      {showWaveDivider && (
        <div className="absolute bottom-0 left-0 w-full hidden md:block -mb-1">
          <svg width="100%" height="150" viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M0,150 L0,40 Q250,150 500,40 L580,150 Z" fill="white" />
          </svg>
        </div>
      )}
    </section>
  )
}

// =========================================
// Default export (alias for HeroSlider)
// =========================================
export default HeroSlider
