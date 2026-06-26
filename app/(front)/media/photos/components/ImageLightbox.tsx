'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { PhotoItem } from './PhotoGallery'

// =========================================
// ImageLightbox — accessible full-screen photo viewer. Esc / backdrop / close
// button dismiss it; ← → (and on-screen arrows) move through the gallery; focus
// is trapped and restored to the trigger on close; body scroll is locked.
//
// The current index lives HERE (not in the parent grid), so navigating does not
// re-render the gallery. The visible image is keyed by index (instant blur on
// change) and the two neighbours are preloaded off-screen → arrows feel instant.
// =========================================

interface ImageLightboxProps {
  photos: PhotoItem[]
  initialIndex: number
  onClose: () => void
}

export function ImageLightbox({ photos, initialIndex, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(initialIndex)

  const count = photos.length
  // Mount-only: listeners, scroll-lock, focus. Arrow keys use functional updates
  // so the handler never depends on `index` → it is not re-bound on navigation.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowLeft') return setIndex((i) => (i > 0 ? i - 1 : i))
      if (e.key === 'ArrowRight') return setIndex((i) => (i < count - 1 ? i + 1 : i))
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      trigger?.focus()
    }
  }, [onClose, count])

  const photo = photos[index]
  if (!photo) return null

  const hasPrev = index > 0
  const hasNext = index < count - 1
  const neighbours = [photos[index - 1], photos[index + 1]].filter(Boolean) as PhotoItem[]

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Закрити"
        className="absolute right-4 top-4 z-10 text-2xl text-white/80 transition-colors hover:text-white"
      >
        <i className="fas fa-times" />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((i) => i - 1)
          }}
          aria-label="Попереднє фото"
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
        >
          <i className="fas fa-chevron-left" />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((i) => i + 1)
          }}
          aria-label="Наступне фото"
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
        >
          <i className="fas fa-chevron-right" />
        </button>
      )}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={photo.alt}
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
          priority
          placeholder={photo.lqip ? 'blur' : 'empty'}
          blurDataURL={photo.lqip}
          className="h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-lg object-contain"
        />
      </div>

      {/* Off-screen preload of the neighbouring photos so ◀ ▶ are instant. */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        {neighbours.map((n) => (
          <Image
            key={n.id}
            src={n.fullUrl}
            alt=""
            width={n.width}
            height={n.height}
            sizes="90vw"
            loading="eager"
          />
        ))}
      </div>
    </div>
  )
}
