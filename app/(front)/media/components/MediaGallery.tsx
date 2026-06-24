'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { motion, useReducedMotion } from 'motion/react'
import { MediaCard, type MediaCardItem } from './MediaCard'
import { Lightbox } from './Lightbox'
import { loadMoreMedia } from '../actions'

// =========================================
// MediaGallery — server-driven media library. Category tabs, the sermon-only
// speaker dropdown and the text search all live in the URL (?category/&speaker/&q),
// so filtering and search run SERVER-side (GROQ) and scale to thousands of items.
// The first batch is rendered on the server; "Завантажити ще" appends the next
// batch via the loadMoreMedia server action without a navigation. Clicking a card
// opens the YouTube player in the Lightbox.
// =========================================

const TABS = [
  { value: '', label: 'Всі' },
  { value: 'трансляція', label: 'Трансляції' },
  { value: 'проповідь', label: 'Проповіді' },
  { value: 'пісня', label: 'Пісні' },
  { value: 'різне', label: 'Різне' },
] as const

interface MediaGalleryProps {
  initialCards: MediaCardItem[]
  total: number
  speakers: string[]
  category: string
  speaker: string
  q: string
}

export function MediaGallery({
  initialCards,
  total,
  speakers,
  category,
  speaker,
  q,
}: MediaGalleryProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  // Accumulated list. Re-syncs to the server's first batch whenever the filter
  // changes (a new initialCards array arrives from the re-rendered page).
  const [cards, setCards] = useState(initialCards)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<MediaCardItem | null>(null)
  const [search, setSearch] = useState(q)

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  // Debounced search → URL. Server re-renders the first batch for the new query.
  useEffect(() => {
    if (search === q) return
    const t = setTimeout(() => {
      router.replace(buildUrl({ category, speaker, q: search }))
    }, 350)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const onCategory = (value: string) => {
    // Speaker filter only applies to sermons — drop it when leaving that tab.
    router.push(
      buildUrl({ category: value, speaker: value === 'проповідь' ? speaker : '', q: search }),
    )
  }

  const onSpeaker = (value: string) => {
    router.push(buildUrl({ category, speaker: value, q: search }))
  }

  const loadMore = async () => {
    setLoading(true)
    try {
      const more = await loadMoreMedia({ category, speaker, q, start: cards.length })
      setCards((prev) => [...prev, ...more])
    } finally {
      setLoading(false)
    }
  }

  const hasMore = cards.length < total

  return (
    <>
      {/* Search */}
      <div className="mx-auto mb-6 max-w-xl">
        <label htmlFor="media-search" className="sr-only">
          Пошук по медіатеці
        </label>
        <div className="relative">
          <i className="fas fa-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="media-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук за назвою, проповідником, темою…"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Category tabs — segmented pill control */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Фільтр медіа за категорією"
          className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm"
        >
          {TABS.map((tab) => {
            const isActive = category === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategory(tab.value)}
                className={clsx(
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-grad text-white' : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Speaker filter — sermons only */}
      {category === 'проповідь' && speakers.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <label htmlFor="speaker-filter" className="text-sm text-gray-500">
            Проповідник:
          </label>
          <select
            id="speaker-filter"
            value={speaker}
            onChange={(e) => onSpeaker(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none"
          >
            <option value="">Усі</option>
            {speakers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results count — announced to screen readers */}
      <p className="mt-6 text-center text-sm text-gray-500" aria-live="polite">
        {total > 0 ? `Показано ${cards.length} з ${total}` : ''}
      </p>

      {/* Grid */}
      <div className="mt-4">
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((item) => (
              <motion.div
                key={item._id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <MediaCard item={item} onPlay={setActive} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <i className="far fa-play-circle mb-4 block text-5xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">Нічого не знайдено</h3>
            <p className="text-gray-500">Спробуйте інший запит або категорію.</p>
          </div>
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="bg-grad inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Завантаження…
              </>
            ) : (
              <>
                <i className="fas fa-arrow-down" /> Завантажити ще
              </>
            )}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {active?.youtubeId && (
        <Lightbox youtubeId={active.youtubeId} title={active.title} onClose={() => setActive(null)} />
      )}
    </>
  )
}

/** Build a /media URL from the current filter state, omitting empty params. */
function buildUrl({
  category,
  speaker,
  q,
}: {
  category: string
  speaker: string
  q: string
}): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (speaker) params.set('speaker', speaker)
  if (q) params.set('q', q)
  const qs = params.toString()
  return qs ? `/media?${qs}` : '/media'
}
