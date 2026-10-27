'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import type { PhotoItem } from './ImageLightbox'

interface DeferredGalleryImageProps {
  photo: PhotoItem
  sizes: string
}

/** Keep original bytes, but start their request only near the gallery tile. */
export function DeferredGalleryImage({ photo, sizes }: DeferredGalleryImageProps) {
  const [visible, setVisible] = useState(false)
  const observe = useCallback((node: HTMLSpanElement | null) => {
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '400px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const image = (
    <Image
      src={photo.thumbUrl}
      unoptimized
      alt={photo.alt}
      fill
      sizes={sizes}
      placeholder={photo.lqip ? 'blur' : 'empty'}
      blurDataURL={photo.lqip}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  )

  return (
    <span ref={observe} className="absolute inset-0 block">
      {visible ? image : photo.lqip && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${photo.lqip}")` }}
        />
      )}
      <noscript>{image}</noscript>
    </span>
  )
}
