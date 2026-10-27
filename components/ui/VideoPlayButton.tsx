'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'

const VideoLightbox = dynamic(() => import('./VideoLightbox'), { ssr: false })

export function VideoPlayButton({ youtubeId, title, children, className }: {
  youtubeId: string | null; title: string; children: ReactNode; className?: string
}) {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" onClick={() => setOpen(true)} disabled={!youtubeId}
      aria-label={`Дивитися: ${title}`} aria-haspopup="dialog" className={className}>{children}</button>
    {open && youtubeId && <VideoLightbox youtubeId={youtubeId} title={title} onClose={() => setOpen(false)} />}
  </>
}
