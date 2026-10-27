import { PhotoViewer, type PhotoItem } from '@/components'
import Image from '@/components/ui/SiteImage'

/**
 * PhotoGalleryGrid — Creative mosaic photo grid for HORIZONTAL images.
 * No empty spaces, all rectangular blocks are horizontal. Clicking a tile opens
 * the shared full-screen ImageLightbox (Esc / ← → / arrows browse the gallery) —
 * same viewer as the /media/photos page.
 *
 * Layout Desktop (3 cols):
 * Row 1: [   Img 1 (span 2)  ] [   Img 2 (span 1)  ]
 * Row 2: [   Img 3 (span 1)  ] [   Img 4 (span 2)  ]
 * Row 3: [ Img 5 ] [ Img 6 ] [ Img 7 ]
 */

export interface PhotoGalleryGridProps {
  photos: PhotoItem[]
  viewerPhotos?: PhotoItem[]
  title?: string
  className?: string
}

// Column spans per tile index (mosaic of up to 7 horizontal images).
const SPANS = [
  'col-span-1 sm:col-span-2 lg:col-span-2',
  'col-span-1 sm:col-span-1 lg:col-span-1',
  'col-span-1 sm:col-span-1 lg:col-span-1',
  'col-span-1 sm:col-span-2 lg:col-span-2',
  'col-span-1 sm:col-span-1 lg:col-span-1',
  'col-span-1 sm:col-span-1 lg:col-span-1',
  'col-span-1 sm:col-span-2 lg:col-span-1',
]

export function PhotoGalleryGrid({ photos, viewerPhotos = photos, title, className = '' }: PhotoGalleryGridProps) {

  if (!photos || photos.length === 0) return null

  // Keep the compact mosaic; the viewer includes every photo, plus the main one.
  const gallery = photos.slice(0, 7)

  return (
    <div className={className}>
      {title && (
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-3">
          {title}
        </h3>
      )}

      {/* Grid mapping perfectly to horizontal aspect ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 auto-rows-[200px] sm:auto-rows-[220px] lg:auto-rows-[260px]">
        {gallery.map((photo, idx) => (
          <PhotoViewer
            key={photo.id}
            photos={viewerPhotos}
            index={viewerPhotos.findIndex((item) => item.id === photo.id)}
            className={`relative rounded-2xl overflow-hidden group shadow-sm bg-gray-100 ${SPANS[idx] ?? ''}`}
          >
            <Image
              src={photo.thumbUrl} alt={photo.alt} fill
              placeholder={photo.lqip ? 'blur' : 'empty'} blurDataURL={photo.lqip}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={idx === 0 || idx === 3 ? "(max-width: 575px) 100vw, (max-width: 991px) 75vw, 600px" : "(max-width: 575px) 100vw, (max-width: 991px) 40vw, 300px"}
            />
            {/* Subtle darkening on hover */}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-out z-10 pointer-events-none" />
          </PhotoViewer>
        ))}
      </div>

    </div>
  )
}
