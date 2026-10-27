'use client'

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from '@/components/ui/SiteImage'

const motionQuery = '(prefers-reduced-motion: reduce)'
const subscribeMotion = (listener: () => void) => {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
const getMotion = () => window.matchMedia(motionQuery).matches
const serverMotion = () => false

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
  autoplay = false,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = false,
  className,
}: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  // The first photo loads alone; then neighbours mount so arrows/autoplay never reveal an empty slide.
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  const visitAround = useCallback((index: number) => setVisited(previous => new Set(previous)
    .add(index).add((index + 1) % slides.length).add((index - 1 + slides.length) % slides.length)), [slides.length])
  const selectSlide = useCallback((index: number) => {
    visitAround(index)
    setCurrentSlide(index)
  }, [visitAround])
  const [rotationRequested, setRotationRequested] = useState<boolean | null>(null)
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, serverMotion)
  const rotationEnabled = autoplay && (rotationRequested ?? !reducedMotion)
  const pointerRotation = useRef<boolean | null>(null)

  const nextSlide = useCallback(() => {
    selectSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, slides.length, selectSlide])

  const prevSlide = useCallback(() => {
    selectSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, slides.length, selectSlide])

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
              'transition-opacity duration-500',
              idx === currentSlide
                ? 'opacity-100 relative'
                : 'opacity-0 absolute inset-0 pointer-events-none'
            )}
          >
            {/* Cover needs at least height × 16/9, even on narrow screens. */}
            {visited.has(idx) && <Image
              src={slide.backgroundImage}
              alt=""
              fill
              preload={idx === 0}
              loading={idx === 0 ? undefined : 'eager'}
              fetchPriority={idx === 0 ? 'high' : undefined}
              onLoad={idx === 0 ? () => visitAround(0) : undefined}
              sizes="(max-width: 991px) max(100vw, 889px), max(100vw, 1334px)"
              className="object-cover object-center"
            />}
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
              onClick={() => selectSlide(idx)}
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

export default HeroSlider
