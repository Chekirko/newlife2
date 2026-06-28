'use client'

import { useState } from 'react'
import Image from 'next/image'
import { clsx } from 'clsx'
import { ImageLightbox, type PhotoItem } from '@/components'

// =========================================
// PhotoGallery — bento mosaic of all ministry photos. Fixed-height cells +
// object-cover (mirrors the ministry PhotoGalleryGrid) so photos crop but never
// distort; grid-flow-dense packs the occasional larger tile without gaps. Shows
// a batch at a time with "Завантажити ще" (client-side slice — the photo set is
// bounded by ministry galleries). Clicking a photo opens the full-screen
// ImageLightbox (Esc / ← → / arrows to browse the whole gallery).
// =========================================

export type { PhotoItem } from '@/components'

const PER_PAGE = 12

interface PhotoGalleryProps {
  photos: PhotoItem[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [visible, setVisible] = useState(PER_PAGE)
  const [active, setActive] = useState<number | null>(null)

  const shown = photos.slice(0, visible)
  const hasMore = visible < photos.length

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center">
        <i className="far fa-images mb-4 block text-5xl text-gray-300" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Поки немає фото</h3>
        <p className="text-gray-500">Незабаром тут зʼявляться світлини зі служінь.</p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-gray-500" aria-live="polite">
        Показано {shown.length} з {photos.length}
      </p>

      <div className="grid grid-flow-row-dense grid-cols-2 gap-3 auto-rows-[160px] sm:auto-rows-[200px] lg:grid-cols-3 lg:auto-rows-[240px] lg:gap-4">
        {shown.map((photo, idx) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActive(idx)}
            aria-label={`Відкрити: ${photo.alt}`}
            className={clsx(
              'group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm',
              idx % 6 === 0 && 'lg:col-span-2 lg:row-span-2', // every 6th tile is large…
              idx % 12 === 6 && 'lg:col-start-2', // …and every other large tile hugs the right
            )}
          >
            <Image
              src={photo.thumbUrl}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              placeholder={photo.lqip ? 'blur' : 'empty'}
              blurDataURL={photo.lqip}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PER_PAGE)}
            className="bg-grad inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <i className="fas fa-arrow-down" /> Завантажити ще
          </button>
        </div>
      )}

      {active !== null && (
        <ImageLightbox photos={photos} initialIndex={active} onClose={() => setActive(null)} />
      )}
    </>
  )
}
