import Image from '@/components/ui/SiteImage'
import { PhotoViewer, type PhotoItem } from '@/components'

interface NewsPhotoGalleryProps {
  photos: PhotoItem[]
  startIndex: number
}

export function NewsPhotoGallery({ photos, startIndex }: NewsPhotoGalleryProps) {
  const gallery = photos.slice(startIndex, startIndex + 10)

  if (gallery.length === 0) return null

  const columns = gallery.length === 1
    ? 'columns-1'
    : gallery.length === 2
      ? 'columns-1 sm:columns-2'
      : 'columns-1 sm:columns-2 lg:columns-3'

  return (
    <section aria-labelledby="news-gallery-title" className="mt-10">
      <h2 id="news-gallery-title" className="text-2xl font-bold text-gray-800 mb-6">
        Фотогалерея
      </h2>
      <div className={`${columns} gap-4`}>
        {gallery.map((photo, index) => (
          <PhotoViewer key={photo.id} photos={photos} index={startIndex + index} className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={photo.thumbUrl}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes={gallery.length === 1
                ? '(max-width: 800px) 100vw, 768px'
                : gallery.length === 2
                  ? '(max-width: 639px) 100vw, (max-width: 800px) 50vw, 376px'
                  : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 246px'}
              placeholder={photo.lqip ? 'blur' : 'empty'}
              blurDataURL={photo.lqip}
              className="block w-full h-auto"
            />
          </PhotoViewer>
        ))}
      </div>
    </section>
  )
}
