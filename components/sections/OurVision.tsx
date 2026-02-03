// =========================================
// OUR VISION - Church vision section
// With gradient block and images
// =========================================

export interface OurVisionProps {
  preTitle?: string
  title: string
  subtitle?: string
  visionText: string
  visionHighlight?: string
  image1?: string
  image2?: string
  className?: string
}

export const OurVision = ({
  preTitle,
  title,
  subtitle,
  visionText,
  visionHighlight,
  image1 = '/images/church-worship.jpg',
  image2 = '/images/church-community.jpg',
  className,
}: OurVisionProps) => {
  return (
    <section className={`py-16 lg:py-24 ${className || ''}`}>
      <div className="container-larexa">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          {preTitle && (
            <h6 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
              {preTitle}
            </h6>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Image 1 */}
          <div className="md:col-span-3">
            <div 
              className="h-48 md:h-full w-full rounded-lg overflow-hidden bg-cover bg-center bg-gray-200"
              style={{ 
                backgroundImage: `url(${image1})`,
                minHeight: '220px'
              }}
            />
          </div>

          {/* Image 2 */}
          <div className="md:col-span-3">
            <div 
              className="h-48 md:h-full w-full rounded-lg overflow-hidden bg-cover bg-center bg-gray-200"
              style={{ 
                backgroundImage: `url(${image2})`,
                minHeight: '220px'
              }}
            />
          </div>

          {/* Vision block with gradient */}
          <div className="md:col-span-6">
            <div className="bg-grad h-full w-full rounded-lg p-6 md:p-8 lg:p-12 flex items-center" style={{ minHeight: '220px' }}>
              <div className="text-white">
                {visionHighlight && (
                  <span className="block text-base md:text-lg lg:text-xl font-medium mb-2 md:mb-3 opacity-90">
                    {visionHighlight}
                  </span>
                )}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                  {visionText}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurVision


