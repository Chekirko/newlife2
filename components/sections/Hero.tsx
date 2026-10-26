'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { useReducedMotion } from 'motion/react'

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
  autoplay?: boolean
  autoplaySpeed?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export const HeroSlider = ({
  slides,
  height = 'h-[400px] lg:h-[700px]',
  autoplay = true,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = false,
  className,
}: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [rotationRequested, setRotationRequested] = useState<boolean | null>(null)
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useReducedMotion()
  const rotationEnabled = autoplay && (rotationRequested ?? !reducedMotion)
  const pointerRotation = useRef<boolean | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!rotationEnabled || hovered || slides.length < 2) return
    const timer = setInterval(nextSlide, autoplaySpeed)
    return () => clearInterval(timer)
  }, [rotationEnabled, hovered, slides.length, autoplaySpeed, nextSlide])

  return (
    <section
      className={clsx('relative overflow-hidden p-0', className)}
      aria-label="Вітання церкви"
      aria-roledescription="карусель"
      onFocusCapture={() => setRotationRequested(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {autoplay && slides.length > 1 && (
        <button
          type="button"
          onPointerDown={() => { pointerRotation.current = rotationEnabled }}
          onPointerCancel={() => { pointerRotation.current = null }}
          onClick={() => {
            setRotationRequested(!(pointerRotation.current ?? rotationEnabled))
            pointerRotation.current = null
          }}
          className="absolute right-4 top-4 min-h-11 px-4 bg-black/70 text-white rounded-full text-sm z-10"
        >
          {rotationEnabled ? 'Зупинити слайди' : 'Відтворити слайди'}
        </button>
      )}
      <div className="relative" aria-live={rotationEnabled ? 'off' : 'polite'} aria-atomic="true">
        {slides.map((slide, idx) => {
          const Heading = idx === currentSlide ? 'h1' : 'p'
          return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="слайд"
            aria-label={`${idx + 1} з ${slides.length}`}
            aria-hidden={idx !== currentSlide}
            inert={idx !== currentSlide}
            className={clsx(
              height,
              'bg-cover bg-center transition-opacity duration-500',
              idx === currentSlide
                ? 'opacity-100 relative'
                : 'opacity-0 absolute inset-0 pointer-events-none'
            )}
            style={{
              backgroundImage: typeof slide.backgroundImage === 'string'
                ? `url(${slide.backgroundImage})`
                : `url(${slide.backgroundImage.src})`
            }}
          >
            {/* Gradient scrim — keeps the photo visible while guaranteeing text contrast */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30 pointer-events-none"
              aria-hidden="true"
            />
            <div className="container-larexa h-full flex items-center relative z-[2]">
              <div className={clsx(
                'w-full lg:w-2/3 xl:w-1/2',
                slide.align === 'center' && 'mx-auto text-center',
                slide.align === 'right' && 'ml-auto text-right'
              )}>
                {slide.preTitle && (
                  <p className="text-white font-alt italic font-medium leading-[1.2] text-xl lg:text-2xl mb-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                    {slide.preTitle}
                  </p>
                )}
                <Heading className="text-white font-heading leading-[1.2] font-bold text-3xl lg:text-5xl xl:text-6xl mb-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
                  {slide.title}
                </Heading>
                {slide.subtitle && (
                  <p className="text-white text-lg lg:text-xl mb-6 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                    {slide.subtitle}
                  </p>
                )}
                <div className={clsx(
                  'flex flex-wrap items-center gap-4',
                  slide.align === 'center' && 'justify-center',
                  slide.align === 'right' && 'justify-end'
                )}>
                  {slide.buttonText && slide.buttonHref && (
                    <a href={slide.buttonHref} className="btn btn-grad">
                      {slide.buttonText}
                    </a>
                  )}
                  {slide.secondaryButtonText && slide.secondaryButtonHref && (
                    <a href={slide.secondaryButtonHref} className="btn btn-outline-white">
                      {slide.secondaryButtonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Попередній слайд"
          >
            <svg aria-hidden="true" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Наступний слайд"
          >
            <svg aria-hidden="true" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Перейти до слайда ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : undefined}
              onClick={() => setCurrentSlide(idx)}
              className="w-11 h-12 flex items-center justify-center"
            >
              <span aria-hidden="true" className={clsx('w-3 h-3 rounded-full transition-colors', idx === currentSlide ? 'bg-white' : 'bg-white/50')} />
            </button>
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
    <section className={clsx('p-0 py-10 bg-grad-readable pattern-overlay-2 relative', className)}>
      <div className="container-larexa">
        <div className="flex flex-wrap py-0 md:py-10 items-center">
          {/* Content */}
          <div className="w-full lg:w-1/2 all-text-white my-10 md:mt-0 relative">
            <div className="text-left py-0 md:py-10 my-10">
              {preTitle && <p className="font-heading font-medium text-[length:var(--text-h6)] leading-[1.2] mb-2">{preTitle}</p>}
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
