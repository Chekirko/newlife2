'use client'

import { useEffect, useRef } from 'react'
import { getYouTubeEmbedUrl } from '@/lib/youtube'
import { ControlIcon as Icon } from './ControlIcon'

export default function VideoLightbox({ youtubeId, title, onClose }: {
  youtubeId: string; title: string; onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      trigger?.focus()
    }
  }, [])
  return <dialog ref={dialogRef} aria-label={title}
    className="fixed inset-0 m-0 h-dvh w-dvw max-h-none max-w-none items-center justify-center border-0 bg-black/80 p-4 text-white open:flex"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button ref={closeRef} type="button" onClick={onClose} aria-label="Закрити"
      className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-2xl text-white"><Icon name="fas fa-times" /></button>
    <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black">
      <iframe src={getYouTubeEmbedUrl(youtubeId, true)} title={title} className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  </dialog>
}
