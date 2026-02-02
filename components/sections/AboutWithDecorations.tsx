'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// ABOUT US - Exact Larexa demo style
// With SVG organic shape, gradient decorations, waves
// =========================================

export interface AboutWithDecorationsProps {
  preTitle?: string
  title: string
  subtitle?: string
  description?: string
  description2?: string
  quote?: {
    author: string
    role: string
  }
  signatureImage?: string | StaticImageData
  buttonText?: string
  buttonHref?: string
  image: string | StaticImageData
  className?: string
}

export const AboutWithDecorations = ({
  preTitle,
  title,
  subtitle,
  description,
  description2,
  quote,
  signatureImage,
  buttonText,
  buttonHref,
  image,
  className,
}: AboutWithDecorationsProps) => {
  // Get image src for SVG xlinkHref
  const imageSrc = typeof image === 'string' ? image : image.src

  return (
    <section className={`relative bg-gray-100 py-16 lg:py-24 overflow-hidden ${className || ''}`}>
      <div className="container-larexa">
        <div className="flex flex-wrap justify-between items-center">
          {/* Left side - Image with SVG decorations */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <figure className="w-full" style={{ height: '500px' }}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 678 595"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="BgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--gradient-start, #97c74e)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--gradient-end, #2ab9a5)' }} />
                  </linearGradient>
                </defs>
                
                {/* Background organic shape with gradient */}
                <path
                  fill="url(#BgGradient)"
                  d="M652.2,493.6c-51.9,58.8-395.9,51.9-395.9,51.9S7.4,581.8,50.6,396.8
                    C82.3,261.5,2.2,56.3,97.3,20c49-18.7,351.7-49,487.8,70.9C713.1,203.4,677.3,465.1,652.2,493.6z"
                />
                
                {/* Image clipped to organic shape */}
                <defs>
                  <clipPath id="imageClip">
                    <path
                      d="M635.5,506.9c-51.9,58.8-395.9,51.9-395.9,51.9S-9.3,595,34,410C65.6,274.7-14.4,69.5,80.6,33.2
                        c49-18.7,351.7-49,487.8,70.9C696.4,216.7,660.6,478.4,635.5,506.9z"
                    />
                  </clipPath>
                </defs>
                <g clipPath="url(#imageClip)">
                  <image
                    width={700}
                    height={700}
                    xlinkHref={imageSrc}
                    x="1"
                    y="-81"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
                
                {/* Bottom left circle decoration */}
                <circle 
                  fill="none" 
                  stroke="url(#BgGradient)" 
                  strokeWidth={8} 
                  cx={60} 
                  cy={539} 
                  r={40} 
                />
                
                {/* Top left diagonal lines */}
                <path
                  fill="url(#BgGradient)"
                  d="M52.6,104.3L25.5,46.5c-2-4.2-0.1-9.4,4.1-11.3l0,0c4.2-2,9.4-0.1,11.3,4.1L68,97c2,4.2,0.1,9.4-4.1,11.3
                    l0,0C59.7,110.4,54.6,108.5,52.6,104.3z"
                />
                <path
                  fill="url(#BgGradient)"
                  d="M48.1,140.6l-12.8-27.2c-2-4.2-0.1-9.4,4.1-11.3l0,0c4.2-2,9.4-0.1,11.3,4.1l12.8,27.2
                    c2,4.2,0.1,9.4-4.1,11.3l0,0C55.2,146.7,50.1,144.8,48.1,140.6z"
                />
                
                {/* Top right circles */}
                <circle fill="url(#BgGradient)" cx="590.9" cy="23.9" r="9.1" />
                <circle fill="url(#BgGradient)" cx="596.8" cy="76.4" r="14.6" />
                <circle fill="url(#BgGradient)" cx="630.8" cy="42.8" r="5.3" />
              </svg>
            </figure>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 md:pl-8 lg:pl-12">
            {/* Pre-title */}
            {preTitle && (
              <h6 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
                {preTitle}
              </h6>
            )}

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {title}
            </h2>

            {/* Subtitle / Lead text */}
            {subtitle && (
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Description */}
            {description && (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {description}
              </p>
            )}

            {/* Description 2 */}
            {description2 && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {description2}
              </p>
            )}

            {/* Quote with author */}
            {quote && (
              <p className="mb-4">
                <span className="text-gray-800 font-bold">— {quote.author},</span>{' '}
                <span className="text-primary">{quote.role}</span>
              </p>
            )}

            {/* Signature image */}
            {signatureImage && (
              <div className="w-2/5 mb-6">
                <Image
                  src={signatureImage}
                  alt="Signature"
                  width={200}
                  height={80}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Button */}
            {buttonText && (
              <Link href={buttonHref || '#'} className="btn btn-grad">
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Top wave decoration */}
      <figure className="absolute top-0 left-0 w-full hidden md:block" style={{ marginTop: '-12px' }}>
        <svg
          viewBox="0 0 1920 43.4"
          preserveAspectRatio="none"
          className="w-full h-[43px]"
        >
          <path
            fill="#f7f8f9"
            d="M0,23.3c0,0,405.1-43.5,697.6,0c316.5,1.5,108.9-2.6,480.4-14.1c0,0,139-12.2,458.7,14.3 c0,0,67.8,19.2,283.3-22.7v35.1H0V23.3z"
          />
        </svg>
      </figure>

      {/* Bottom wave decoration */}
      <figure className="absolute bottom-0 left-0 w-full hidden md:block" style={{ marginBottom: '-12px' }}>
        <svg
          viewBox="0 0 1920 43.4"
          preserveAspectRatio="none"
          className="w-full h-[43px]"
        >
          <path
            fill="#ffffff"
            d="M0,23.3c0,0,405.1-43.5,697.6,0c316.5,1.5,108.9-2.6,480.4-14.1c0,0,139-12.2,458.7,14.3 c0,0,67.8,19.2,283.3-22.7v35.1H0V23.3z"
          />
        </svg>
      </figure>
    </section>
  )
}

export default AboutWithDecorations
