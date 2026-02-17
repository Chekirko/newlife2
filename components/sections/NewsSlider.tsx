'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx'

// =========================================
// NEWS SLIDER - Latest church news carousel
// Features: 3 cards on desktop, 2 on tablet, 1 on mobile
// Auto-scroll, arrows, dots
// =========================================

export interface NewsItem {
  id: string
  title: string
  date: string
  mainCategory: string
  categories?: string[]
  text: string
  image: string
  photos?: string[]
  href: string
}

export interface NewsSliderProps {
  preTitle?: string
  title?: string
  description?: string
  news: NewsItem[]
  autoplaySpeed?: number
  className?: string
}

export const NewsSlider = ({
  preTitle,
  title,
  description,
  news,
  autoplaySpeed = 5000,
  className,
}: NewsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  // Track screen size for responsive slider
  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
        setVisibleCards(3)
      }
    }

    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const hasNews = news && news.length > 0
  const maxIndex = Math.max(0, news.length - visibleCards)
  const slidePercent = 100 / visibleCards

  // Reset index when layout changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [visibleCards, maxIndex, currentIndex])

  // Auto-scroll
  useEffect(() => {
    if (!hasNews || news.length <= visibleCards) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [hasNews, maxIndex, autoplaySpeed, news.length, visibleCards])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  if (!hasNews) return null

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

        {/* Slider */}
        <div className="relative">
          {/* Arrow Left */}
          {news.length > visibleCards && (
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Попередня новина"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Cards */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * slidePercent}%)` }}
            >
              {news.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 px-2 lg:px-3"
                  style={{ width: `${slidePercent}%` }}
                >
                  <Link href={item.href} className="block group">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
                      {/* Image */}
                      <div className="relative h-48 lg:h-52 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Main category badge */}
                        <span className="absolute top-3 left-3 bg-grad text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {item.mainCategory}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 lg:p-6">
                        {/* Date & extra categories */}
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                          <time className="flex items-center gap-1">
                            <i className="far fa-calendar-alt text-primary text-xs" />
                            {item.date}
                          </time>
                          {item.categories && item.categories.length > 0 && (
                            <>
                              <span className="text-gray-300">|</span>
                              {item.categories.map((cat, i) => (
                                <span key={i} className="text-primary text-xs font-medium">
                                  {cat}
                                </span>
                              ))}
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Excerpt - truncated */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-0">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Right */}
          {news.length > visibleCards && (
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Наступна новина"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dots */}
        {news.length > visibleCards && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  'w-3 h-3 rounded-full transition-colors',
                  idx === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Слайд ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSlider
