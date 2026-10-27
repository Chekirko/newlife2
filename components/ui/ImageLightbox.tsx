'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// =========================================
// Shared full-screen viewer. A native modal dialog keeps controls and focus
// together, above transformed cards and sticky headers. Photos use full-resolution URLs.
//
// The current index lives HERE (not in the parent grid), so navigating does not
// re-render the gallery. The visible image is keyed by index (instant blur on
// change). Neighbours preload after the visible photo finishes loading.
// =========================================

export interface PhotoItem {
  id: string
  thumbUrl: string
  fullUrl: string
  lqip?: string
  alt: string
  width: number
  height: number
}

interface ImageLightboxProps {
  photos: PhotoItem[]
  initialIndex: number
  onClose: () => void
}

export function ImageLightbox({ photos, initialIndex, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(initialIndex)
  const [loadedIndex, setLoadedIndex] = useState<number | null>(null)

  const count = photos.length
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = document.activeElement as HTMLElement | null
    dialog.showModal()
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = prevOverflow
      trigger?.focus()
    }
  }, [])

  const photo = photos[index]
  if (!photo) return null

  const hasPrev = index > 0
  const hasNext = index < count - 1
  const neighbours = [photos[index - 1], photos[index + 1]].filter(Boolean) as PhotoItem[]

  return (
    <dialog
      ref={dialogRef}
      aria-label={photo.alt}
      className="fixed inset-0 m-0 h-dvh w-dvw max-h-none max-w-none items-center justify-center border-0 bg-black/90 p-4 text-white open:flex"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          setIndex((i) => Math.max(0, i - 1))
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          setIndex((i) => Math.min(count - 1, i + 1))
        }
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Закрити"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-2xl text-white"
      >
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((i) => i - 1)
          }}
          aria-label="Попереднє фото"
          disabled={!hasPrev}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white disabled:opacity-40"
        >
          <i className="fas fa-chevron-left" aria-hidden="true" />
        </button>
      )}
      {count > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((i) => i + 1)
          }}
          aria-label="Наступне фото"
          disabled={!hasNext}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white disabled:opacity-40"
        >
          <i className="fas fa-chevron-right" aria-hidden="true" />
        </button>
      )}

      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={index}
          src={photo.fullUrl}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="90vw"
          unoptimized
          priority
          onLoad={() => setLoadedIndex(index)}
          placeholder={photo.lqip ? 'blur' : 'empty'}
          blurDataURL={photo.lqip}
          className="h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-lg object-contain"
        />
      </div>

      <p aria-live="polite" className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
        {index + 1} / {count}
      </p>

      {/* Give the visible original the connection before preloading neighbours. */}
      {loadedIndex === index && <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        {neighbours.map((n) => (
          <Image
            key={n.id}
            src={n.fullUrl}
            alt=""
            width={n.width}
            height={n.height}
            sizes="90vw"
            unoptimized
            loading="eager"
          />
        ))}
      </div>}
    </dialog>
  )
}

export default ImageLightbox
