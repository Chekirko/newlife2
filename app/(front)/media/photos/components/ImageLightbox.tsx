'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { PhotoItem } from './PhotoGallery'

// =========================================
// ImageLightbox — accessible full-screen photo viewer. Esc / backdrop / close
// button dismiss it; ← → (and on-screen arrows) move through the gallery; focus
// is trapped and restored to the trigger on close; body scroll is locked.
// Models the video Lightbox a11y pattern (app/(front)/media/components/Lightbox).
// =========================================

interface ImageLightboxProps {
  photos: PhotoItem[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function ImageLightbox({ photos, index, onClose, onNavigate }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowLeft' && index > 0) return onNavigate(index - 1)
      if (e.key === 'ArrowRight' && index < photos.length - 1) return onNavigate(index + 1)
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
  }, [index, photos.length, onClose, onNavigate])

  if (!photo) return null

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
            onNavigate(index - 1)
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
            onNavigate(index + 1)
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
          src={photo.fullUrl}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="90vw"
          placeholder={photo.lqip ? 'blur' : 'empty'}
          blurDataURL={photo.lqip}
          className="h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-lg object-contain"
        />
      </div>
    </div>
  )
}
