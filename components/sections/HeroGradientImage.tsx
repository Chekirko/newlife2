import { clsx } from 'clsx'
import Image, { type StaticImageData } from '@/components/ui/SiteImage'
import { Icon } from '@/components/ui/Icon'

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
                sizes="(max-width: 991px) 100vw, 600px"
                className="rounded shadow"
              />
              {videoUrl && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <a href={videoUrl} className="btn btn-grad btn-round btn-lg zoom-on-hover">
                    <Icon className="fa fa-play" />
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
