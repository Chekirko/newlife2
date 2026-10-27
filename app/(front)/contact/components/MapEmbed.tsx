'use client'

import { useState } from 'react'
import Image from '@/components/ui/SiteImage'
import { ControlIcon as Icon } from '@/components/ui/ControlIcon'

interface MapEmbedProps {
  src: string
  className?: string
}

export function MapEmbed({ src, className = '' }: MapEmbedProps) {
  const [open, setOpen] = useState(false)
  const mapsUrl = new URL(src)
  mapsUrl.searchParams.delete('output')
  return (
    <div className={`relative flex w-full h-full min-h-[300px] flex-col rounded-xl overflow-hidden bg-gray-100 ${className}`}>
      <div className="relative min-h-[250px] flex-1">
      {open ? <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Розташування церкви «Нове Життя» в Google Maps"
      /> : <>
        <Image src="/images/hero-church-1.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 300px" className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-4 text-center text-white">
          <Icon name="fas fa-location-dot" className="text-4xl" />
          <button type="button" onClick={() => setOpen(true)} className="btn btn-white">Показати карту</button>
        </div>
      </>}
      </div>
      <a href={mapsUrl.toString()} target="_blank" rel="noopener noreferrer" className="block bg-white px-3 py-4 text-center font-medium text-primary-text underline">Відкрити в Google Maps</a>
    </div>
  )
}

export default MapEmbed
