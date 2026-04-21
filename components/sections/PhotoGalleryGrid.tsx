import Image from 'next/image'
import { StaticImageData } from 'next/image'

/**
 * PhotoGalleryGrid — Creative mosaic photo grid for HORIZONTAL images.
 * No empty spaces, all rectangular blocks are horizontal.
 *
 * Layout Desktop (3 cols):
 * Row 1: [   Img 1 (span 2)  ] [   Img 2 (span 1)  ]
 * Row 2: [   Img 3 (span 1)  ] [   Img 4 (span 2)  ]
 * Row 3: [ Img 5 ] [ Img 6 ] [ Img 7 ]
 *
 * Layout Mobile (2 cols):
 * Row 1: [     Img 1 (span 2)      ]
 * Row 2: [ Img 2 (1) ] [ Img 3 (1) ]
 * Row 3: [     Img 4 (span 2)      ]
 * Row 4: [ Img 5 (1) ] [ Img 6 (1) ]
 * Row 5: [     Img 7 (span 2)      ]
 */

export interface PhotoGalleryGridProps {
  images: (string | StaticImageData)[]
  title?: string
  className?: string
}

export function PhotoGalleryGrid({ images, title, className = '' }: PhotoGalleryGridProps) {
  if (!images || images.length === 0) return null

  // Ensure exactly up to 7 images are rendered
  const gallery = images.slice(0, 7)

  return (
    <div className={className}>
      {title && (
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">
          {title}
        </h3>
      )}

      {/* Grid mapping perfectly to horizontal aspect ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 auto-rows-[200px] sm:auto-rows-[220px] lg:auto-rows-[260px]">
        {gallery.map((img, idx) => {
          let spanClasses = ''
          
          if (idx === 0) {
            spanClasses = 'col-span-1 sm:col-span-2 lg:col-span-2'
          } else if (idx === 1) {
            spanClasses = 'col-span-1 sm:col-span-1 lg:col-span-1'
          } else if (idx === 2) {
            spanClasses = 'col-span-1 sm:col-span-1 lg:col-span-1'
          } else if (idx === 3) {
            spanClasses = 'col-span-1 sm:col-span-2 lg:col-span-2'
          } else if (idx === 4) {
            spanClasses = 'col-span-1 sm:col-span-1 lg:col-span-1'
          } else if (idx === 5) {
            spanClasses = 'col-span-1 sm:col-span-1 lg:col-span-1'
          } else if (idx === 6) {
            spanClasses = 'col-span-1 sm:col-span-2 lg:col-span-1'
          }

          return (
            <div key={idx} className={`relative rounded-2xl overflow-hidden group shadow-sm bg-gray-100 ${spanClasses}`}>
              <Image
                src={img}
                alt={`Фото ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle darkening on hover using best practices */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-out z-10 pointer-events-none" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
