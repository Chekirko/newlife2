'use client'

import { useEffect, useState } from 'react'
import { ControlIcon } from '@/components/ui/ControlIcon'

/** Prev/next for a SnapRow track; disabled at each end, hidden (space kept) when nothing overflows. */
export function SnapArrows({ trackId, label }: { trackId: string; label: string }) {
  const [edges, setEdges] = useState({ start: true, end: true })

  useEffect(() => {
    const track = document.getElementById(trackId)
    if (!track) return
    const update = () => setEdges({
      start: track.scrollLeft <= 1,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    })
    update()
    track.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [trackId])

  function scroll(direction: 1 | -1) {
    const track = document.getElementById(trackId)
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    track?.scrollBy({ left: direction * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const button = 'flex size-11 items-center justify-center rounded bg-gray-800 text-white disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className={`mt-4 flex justify-center gap-2 ${edges.start && edges.end ? 'invisible' : ''}`}>
      <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-controls={trackId}
        aria-label={`Назад: ${label}`} className={button}>
        <ControlIcon name="fa-chevron-left" />
      </button>
      <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-controls={trackId}
        aria-label={`Вперед: ${label}`} className={button}>
        <ControlIcon name="fa-chevron-right" />
      </button>
    </div>
  )
}
