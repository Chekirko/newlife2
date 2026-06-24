'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lightbox } from '../media/components/Lightbox'
import type { MediaCardItem } from '../media/components/MediaCard'

// =========================================
// LatestSermon — homepage section showing the newest sermon (B2 Stage 3).
// Reuses the media Lightbox player; clicking the cover opens the video inline.
// Rendered only when a sermon exists (homepage null-guards before mounting).
// =========================================

interface LatestSermonProps {
  sermon: MediaCardItem
}

export function LatestSermon({ sermon }: LatestSermonProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-16 lg:py-20">
      <div className="container-larexa">
        <div className="mb-10 text-center">
          <span className="text-primary mb-2 block text-sm font-semibold uppercase tracking-wide">
            Слово Боже
          </span>
          <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">Остання проповідь</h2>
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-8 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-gray-100 lg:grid-cols-2">
          {/* Cover — opens the player */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!sermon.youtubeId}
            aria-label={`Дивитися проповідь: ${sermon.title}`}
            className="group relative aspect-video w-full overflow-hidden bg-gray-100 disabled:cursor-default"
          >
            <Image
              src={sermon.thumbnailUrl}
              alt={sermon.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {sermon.youtubeId && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/30">
                <span className="text-primary flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110">
                  <i className="fas fa-play ml-1 text-2xl" />
                </span>
              </span>
            )}
          </button>

          {/* Details */}
          <div className="p-8 lg:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              {sermon.date && (
                <span className="flex items-center gap-1.5">
                  <i className="far fa-calendar-alt" />
                  {sermon.date}
                </span>
              )}
              {sermon.speaker && (
                <span className="flex items-center gap-1.5">
                  <i className="far fa-user" />
                  {sermon.speaker}
                </span>
              )}
              {sermon.scripture && (
                <span className="flex items-center gap-1.5">
                  <i className="far fa-bookmark" />
                  {sermon.scripture}
                </span>
              )}
            </div>

            <h3 className="mb-3 text-2xl font-bold leading-snug text-gray-800">{sermon.title}</h3>

            {sermon.description && (
              <p className="mb-6 line-clamp-3 text-gray-600">{sermon.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {sermon.youtubeId && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="bg-grad inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  <i className="fas fa-play" /> Дивитися проповідь
                </button>
              )}
              <Link
                href="/media?category=проповідь"
                className="text-primary inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                Усі проповіді <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {open && sermon.youtubeId && (
        <Lightbox youtubeId={sermon.youtubeId} title={sermon.title} onClose={() => setOpen(false)} />
      )}
    </section>
  )
}
