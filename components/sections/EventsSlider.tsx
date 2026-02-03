'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx'

// =========================================
// EVENTS SLIDER - Church events announcements
// Features: 2 visible cards, auto-scroll, arrows
// If 1 event - full width, if 0 - hidden
// =========================================

export interface EventItem {
  id: string
  title: string
  image: string
  date: string
  description: string
  href: string
  tag?: string
}

export interface EventsSliderProps {
  preTitle?: string
  title?: string
  description?: string
  events: EventItem[]
  autoplaySpeed?: number
  className?: string
}

export const EventsSlider = ({
  preTitle,
  title,
  description,
  events,
  autoplaySpeed = 5000,
  className,
}: EventsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Track screen size for responsive slider
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Calculate visible cards based on screen and event count
  const hasEvents = events && events.length > 0
  const isSingleEvent = events?.length === 1
  // On mobile: 1 card visible, on desktop: 2 cards visible
  const visibleCards = isMobile ? 1 : 2
  const maxIndex = Math.max(0, (events?.length || 0) - visibleCards)
  const slidePercent = isMobile ? 100 : 50

  // Reset index when switching between mobile/desktop
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [isMobile, maxIndex, currentIndex])

  // Auto-scroll effect - always called (hooks rule)
  useEffect(() => {
    if (!hasEvents || isSingleEvent || events.length <= visibleCards) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [hasEvents, isSingleEvent, maxIndex, autoplaySpeed, events?.length, visibleCards])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  // If no events, render nothing (after all hooks)
  if (!hasEvents) {
    return null
  }

  // Single event - full width card
  if (isSingleEvent) {
    const event = events[0]
    return (
      <section className={clsx('py-16 lg:py-24', className)}>
        <div className="container-larexa">
          {/* Header */}
          {(preTitle || title || description) && (
            <div className="max-w-3xl mx-auto text-center mb-12">
              {preTitle && (
                <span className="text-primary font-semibold tracking-wide uppercase text-sm block mb-3">
                  {preTitle}
                </span>
              )}
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-600 text-lg mb-0">{description}</p>
              )}
            </div>
          )}

          {/* Single Full-Width Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-auto md:min-h-[400px]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {event.tag && (
                  <span className="absolute top-4 left-4 bg-grad text-white px-4 py-2 rounded-full text-sm font-medium">
                    {event.tag}
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-primary font-medium mb-2">{event.date}</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">{event.description}</p>
                <Link
                  href={event.href}
                  className="inline-flex items-center justify-center px-6 py-3 bg-grad text-white font-medium rounded-lg hover:opacity-90 transition-opacity w-fit"
                >
                  Детальніше
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Multiple events - slider
  return (
    <section className={clsx('py-16 lg:py-24', className)}>
      <div className="container-larexa">
        {/* Header */}
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {preTitle && (
              <span className="text-primary font-semibold tracking-wide uppercase text-sm block mb-3">
                {preTitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 text-lg mb-0">{description}</p>
            )}
          </div>
        )}

        {/* Slider Container */}
        <div className="relative">
          {/* Arrow Left */}
          {events.length > visibleCards && (
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Попередній"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * slidePercent}%)` }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  className="w-full md:w-1/2 flex-shrink-0 px-3 lg:px-4"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-xl transition-shadow">
                    {/* Image */}
                    <div className="relative h-48 lg:h-56">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      {event.tag && (
                        <span className="absolute top-4 left-4 bg-grad text-white px-3 py-1 rounded-full text-sm font-medium">
                          {event.tag}
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-5 lg:p-6">
                      <span className="text-primary text-sm font-medium mb-2 block">
                        {event.date}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <Link
                        href={event.href}
                        className="inline-flex items-center text-primary font-medium text-sm hover:underline"
                      >
                        Детальніше
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Right */}
          {events.length > visibleCards && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Наступний"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dots indicator */}
        {events.length > visibleCards && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  'w-3 h-3 rounded-full transition-colors',
                  idx === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Перейти до слайду ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSlider
