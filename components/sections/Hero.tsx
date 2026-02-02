'use client'

import { ReactNode, useState, useEffect, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// HERO VARIANT 1: Basic Slider
// (home demo style)
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
// HERO VARIANT 2: Split Layout (gradient + image)
// (landing-trendy demo style)
// =========================================
export interface HeroSplitProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  backgroundImage: string | StaticImageData
  leftContent?: ReactNode
  videoUrl?: string
  className?: string
}

export const HeroSplit = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  backgroundImage,
  leftContent,
  videoUrl,
  className,
}: HeroSplitProps) => {
  return (
    <section className={clsx('p-0 h-[600px] lg:h-[800px]', className)}>
      <div className="w-full h-full">
        <div className="flex h-full">
          {/* Left gradient panel */}
          <div className="w-1/4 bg-grad h-full hidden md:flex flex-col justify-end">
            <div className="all-text-white pb-20 pl-8 -rotate-90 origin-bottom-left">
              {videoUrl && (
                <a
                  href={videoUrl}
                  className="btn btn-white btn-round zoom-on-hover inline-block align-middle mr-4"
                >
                  <i className="fa fa-play" />
                </a>
              )}
              {leftContent}
            </div>
          </div>
          
          {/* Right image panel */}
          <div 
            className="flex-1 h-full bg-overlay-dark-2 bg-cover bg-center flex items-center"
            style={{
              backgroundImage: typeof backgroundImage === 'string' 
                ? `url(${backgroundImage})` 
                : `url(${backgroundImage.src})`
            }}
          >
            <div className="container-larexa">
              <div className="md:ml-8 all-text-white">
                <h1 className="text-6xl md:text-7xl font-alt italic">{title.split(' ')[0]}</h1>
                <h1 className="text-4xl font-bold text-white">{title.split(' ').slice(1).join(' ')}</h1>
                {subtitle && <p className="text-white/80">{subtitle}</p>}
                {buttonText && (
                  <a href={buttonHref || '#'} className="btn btn-outline-white btn-lg mt-4">
                    {buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 3: Wave Animation Canvas
// (corporate-startUp demo style)
// =========================================
export interface HeroWaveProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  rightImage?: string | StaticImageData
  className?: string
}

export const HeroWave = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  rightImage,
  className,
}: HeroWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth
        canvas.height = canvas.parentElement.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let step = 0
    const lines = 4
    let animationFrameId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      step++
      for (let i = 0; i < lines; i++) {
        ctx.fillStyle = 'rgba(255,255,255,.8)'
        const angle = ((step + (i * 180) / lines) * Math.PI) / 180
        const deltaHeight = Math.sin(angle) * 90
        const deltaHeightRight = Math.cos(angle) * 50

        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2 + deltaHeight)
        ctx.bezierCurveTo(
          canvas.width / 2,
          canvas.height / 2 + deltaHeight - 50,
          canvas.width / 2,
          canvas.height / 2 + deltaHeightRight - 50,
          canvas.width,
          canvas.height / 2 + deltaHeightRight
        )
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <section className={clsx(
      'p-0 relative h-[500px] md:h-[600px] xl:h-[900px] bg-grad pattern-overlay-1 overflow-hidden',
      className
    )}>
      <div className="container-larexa flex h-full">
        <div className="flex items-center w-full">
          <div className="md:w-1/2 relative all-text-white">
            <h2 className="text-4xl md:text-5xl font-normal">{title}</h2>
            {subtitle && <p className="text-lg mb-4 hidden sm:block">{subtitle}</p>}
            {buttonText && (
              <a href={buttonHref || '#'} className="btn btn-dark mb-20">
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-12"
      />
    </section>
  )
}

// =========================================
// HERO VARIANT 4: Parallax with Typist
// (creative-agency demo style)
// =========================================
export interface HeroTypistProps {
  preTitle?: string
  staticText: string
  rotatingWords: string[]
  backgroundImage: string | StaticImageData
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  className?: string
}

export const HeroTypist = ({
  preTitle,
  staticText,
  rotatingWords,
  backgroundImage,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className,
}: HeroTypistProps) => {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = rotatingWords[wordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1))
        if (text === word) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setText(word.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % rotatingWords.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, rotatingWords, typingSpeed, deletingSpeed, pauseTime])

  return (
    <section 
      className={clsx(
        'p-0 h-[500px] lg:h-[700px] bg-overlay-dark-2 bg-fixed bg-cover bg-center',
        className
      )}
      style={{
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`
      }}
    >
      <div className="absolute bottom-0 w-full all-text-white">
        <div className="container-larexa pb-12">
          {preTitle && (
            <p className="text-xl font-alt italic mb-0">{preTitle}</p>
          )}
          <h5 className="text-5xl lg:text-7xl font-bold mt-4 p-0">
            <span>{staticText} </span>
            <span className="text-primary">{text}<span className="animate-pulse">|</span></span>
          </h5>
        </div>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 5: Simple Parallax with Video Button
// (classic-corporate demo style)
// =========================================
export interface HeroParallaxVideoProps {
  preTitle?: string
  title: string
  videoUrl?: string
  videoDuration?: string
  backgroundImage: string | StaticImageData
  className?: string
}

export const HeroParallaxVideo = ({
  preTitle,
  title,
  videoUrl,
  videoDuration,
  backgroundImage,
  className,
}: HeroParallaxVideoProps) => {
  return (
    <section
      className={clsx(
        'p-0 h-[500px] lg:h-[700px] bg-fixed bg-cover',
        className
      )}
      style={{
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`,
        backgroundPosition: '65% 0%'
      }}
    >
      <div className="container-larexa h-full">
        <div className="flex items-center h-full">
          <div className="md:w-2/3 mb-20">
            {preTitle && <h4>{preTitle}</h4>}
            <h1 className="text-4xl lg:text-5xl font-bold">{title}</h1>
            {videoUrl && (
              <span className="mt-4 inline-flex items-center gap-3">
                <a 
                  href={videoUrl}
                  className="btn btn-grad btn-round zoom-on-hover"
                >
                  <i className="fa fa-play text-white" />
                </a>
                {videoDuration && <span>{videoDuration}</span>}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 6: Gradient with Pattern + Image
// (agency-startUp demo style)
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
// HERO VARIANT 7: Gradient with Search Form
// (home-elegant demo style)
// =========================================
export interface HeroSearchFormProps {
  staticText: string
  rotatingWords?: string[]
  subtitle?: string
  searchPlaceholder?: string
  searchButtonText?: string
  onSearch?: (query: string) => void
  bottomText?: string
  className?: string
}

export const HeroSearchForm = ({
  staticText,
  rotatingWords = [],
  subtitle,
  searchPlaceholder = 'What are you looking for?',
  searchButtonText = 'Get started for free',
  onSearch,
  bottomText,
  className,
}: HeroSearchFormProps) => {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (rotatingWords.length === 0) return
    
    const word = rotatingWords[wordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1))
        if (text === word) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setText(word.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % rotatingWords.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, rotatingWords])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <section className={clsx('h-[500px] lg:h-[700px] p-0 bg-grad pattern-overlay-4', className)}>
      <div className="container-larexa h-full">
        <div className="flex h-full">
          <div className="w-full md:w-2/3 mx-auto flex items-center all-text-white">
            <div className="text-center w-full">
              <h5 className="text-4xl font-bold text-primary">
                <span>{staticText}</span>
                {rotatingWords.length > 0 && (
                  <span className="text-white"> {text}<span className="animate-pulse">|</span></span>
                )}
              </h5>
              {subtitle && <p className="mb-4 text-lg">{subtitle}</p>}
              
              <form onSubmit={handleSubmit} className="bg-white my-4 md:mx-10 p-2 rounded shadow">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="flex-1 px-4 py-2 border-0 focus:outline-none text-gray-800"
                  />
                  <button type="submit" className="btn btn-grad m-0">
                    <span className="hidden md:inline">{searchButtonText}</span>
                    <i className="far fa-paper-plane md:hidden" />
                  </button>
                </div>
              </form>
              
              {bottomText && <small>{bottomText}</small>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 8: Marketplace Slider with Search
// (marketplace demo style)
// =========================================
export interface HeroMarketplaceSlide {
  id: string
  backgroundImage: string | StaticImageData
  title: string
  subtitle?: string
  searchPlaceholder?: string
  afterSearchText?: ReactNode
}

export interface HeroMarketplaceProps {
  slides: HeroMarketplaceSlide[]
  autoplay?: boolean
  autoplaySpeed?: number
  className?: string
}

export const HeroMarketplace = ({
  slides,
  autoplay = true,
  autoplaySpeed = 6000,
  className,
}: HeroMarketplaceProps) => {
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
    <section className={clsx('p-0', className)}>
      <div className="relative">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={clsx(
              'h-[700px] lg:h-[900px] bg-overlay-dark-3 bg-cover bg-center transition-opacity duration-500',
              idx === currentSlide ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
            )}
            style={{
              backgroundImage: typeof slide.backgroundImage === 'string' 
                ? `url(${slide.backgroundImage})` 
                : `url(${slide.backgroundImage.src})`
            }}
          >
            <div className="container-larexa h-full flex items-center">
              <div className="w-full md:w-2/3 lg:w-1/2 text-left">
                <h2 className="text-white font-bold text-5xl lg:text-7xl mb-4">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-white/80 font-alt italic text-xl hidden lg:block">
                    {slide.subtitle}
                  </p>
                )}
                <form className="bg-white my-4 p-2 rounded shadow w-full">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder={slide.searchPlaceholder || 'Search...'}
                      className="flex-1 px-4 py-2 border-0 focus:outline-none text-gray-800"
                    />
                    <button type="submit" className="btn btn-grad m-0">
                      <span className="hidden md:inline">Search</span>
                      <i className="fa fa-search md:hidden" />
                    </button>
                  </div>
                </form>
                {slide.afterSearchText}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <i className="fas fa-chevron-left text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <i className="fas fa-chevron-right text-white" />
        </button>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 9: Portfolio with SVG Shapes
// (portfolio-modern demo style)
// =========================================
export interface HeroPortfolioProps {
  greeting?: string
  name: string
  rotatingRoles?: string[]
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image: string | StaticImageData
  className?: string
}

export const HeroPortfolio = ({
  greeting = 'Welcome to my world',
  name,
  rotatingRoles = [],
  subtitle,
  buttonText,
  buttonHref,
  image,
  className,
}: HeroPortfolioProps) => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (rotatingRoles.length === 0) return
    
    const role = rotatingRoles[roleIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(role.substring(0, text.length + 1))
        if (text === role) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setText(role.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setRoleIndex((prev) => (prev + 1) % rotatingRoles.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, roleIndex, rotatingRoles])

  return (
    <section className={clsx('p-0 relative', className)}>
      <div className="w-full">
        <div className="flex flex-wrap items-center">
          {/* Left side with SVG masked image */}
          <div className="w-full md:w-5/12 hidden md:block">
            <div className="relative">
              {/* SVG gradient shape with clipped image */}
              <svg viewBox="0 0 881.8 917.9" className="w-full h-auto">
                <defs>
                  <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#97c74e" />
                    <stop offset="100%" stopColor="#2ab9a5" />
                  </linearGradient>
                  <clipPath id="imageClip">
                    <rect x="175" y="18" width="650" height="850" />
                  </clipPath>
                </defs>
                <path
                  fill="url(#heroGradient)"
                  d="M0,39.6c0,0,171-121.5,264,64.5s508.5,178.5,508.5,178.5s240-6-6,228S816,755.1,657,830.1s-309,106.5-445.5,76.5C75,876.6,0,717.6,0,717.6V39.6z"
                />
                <path 
                  fill="#343a40" 
                  d="M0,291.1c0,0,133.5-100.5,169.5,91.5s103.5,204,81,283.5S0,832.6,0,832.6V291.1z" 
                />
                <g clipPath="url(#imageClip)">
                  <image
                    xlinkHref={typeof image === 'string' ? image : image.src}
                    x="175"
                    y="18"
                    width="650"
                    height="850"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              </svg>
            </div>
          </div>
          
          {/* Right side content */}
          <div className="w-full md:w-7/12 lg:w-5/12 lg:ml-auto mt-10 md:mt-0">
            <h6 className="text-gray-600">— {greeting}</h6>
            <h5 className="text-4xl lg:text-5xl font-normal">
              <span>Howdy, I am {name}</span>
              {rotatingRoles.length > 0 && (
                <>
                  <br />
                  <span>A, </span>
                  <span className="text-primary">{text}<span className="animate-pulse">|</span></span>
                </>
              )}
            </h5>
            {subtitle && <p className="text-gray-500 text-lg mb-4">{subtitle}</p>}
            {buttonText && (
              <a href={buttonHref || '#'} className="btn btn-grad">
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// HERO VARIANT 10: Inner Page Banner
// (for blog, about, contact pages)
// =========================================
export interface HeroBannerProps {
  backgroundImage?: string | StaticImageData
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href: string }[]
  height?: string
  overlayDark?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const HeroBanner = ({
  backgroundImage,
  title,
  subtitle,
  breadcrumbs,
  height = 'h-[300px]',
  overlayDark = 5,
  align = 'center',
  className,
}: HeroBannerProps) => {
  return (
    <section
      className={clsx(
        height,
        `bg-overlay-dark-${overlayDark}`,
        'bg-cover bg-center flex items-center p-0',
        className
      )}
      style={backgroundImage ? {
        backgroundImage: typeof backgroundImage === 'string' 
          ? `url(${backgroundImage})` 
          : `url(${backgroundImage.src})`
      } : { backgroundColor: '#343a40' }}
    >
      <div className={clsx(
        'container-larexa',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right'
      )}>
        <h1 className="text-white font-bold text-3xl lg:text-4xl mb-2">{title}</h1>
        {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
        
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mt-4">
            <ol className={clsx(
              'flex gap-2 text-white/70',
              align === 'center' && 'justify-center'
            )}>
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center">
                  {idx > 0 && <span className="mx-2">/</span>}
                  <a href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  )
}

// =========================================
// Default export (alias for HeroSlider)
// =========================================
export default HeroSlider
