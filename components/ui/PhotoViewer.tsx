'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { PhotoItem } from './ImageLightbox'

const ImageLightbox = dynamic(() => import('./ImageLightbox'), { ssr: false })

interface PhotoViewerProps {
  photos: PhotoItem[]
  index?: number
  children: ReactNode
  className?: string
}

export function PhotoViewer({ photos, index = 0, children, className = '' }: PhotoViewerProps) {
  const [open, setOpen] = useState(false)
  if (!photos[index]) return <>{children}</>

  return (
    <>
      <button
        type="button"
        aria-label={`Відкрити: ${photos[index].alt}`}
        aria-haspopup="dialog"
        className={`block w-full cursor-zoom-in ${className}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open && <ImageLightbox photos={photos} initialIndex={index} onClose={() => setOpen(false)} />}
    </>
  )
}
