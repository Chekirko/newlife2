'use client'

import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'motion/react'
import { MediaCard, type MediaCardItem } from './MediaCard'
import { Lightbox } from './Lightbox'

// =========================================
// MediaGallery — segmented pill tabs (category) + speaker filter (sermons only)
// + paginated grid + lightbox. The list is pre-loaded and filtered in memory.
// Filtering animates like Isotope via Framer Motion: removed cards fade + scale
// out while the remaining ones smoothly reflow (layout) into the first rows.
// Clicking a card opens the YouTube player in the Lightbox.
// =========================================

const TABS = [
  { value: 'all', label: 'Всі' },
  { value: 'трансляція', label: 'Трансляції' },
  { value: 'проповідь', label: 'Проповіді' },
  { value: 'пісня', label: 'Пісні' },
  { value: 'різне', label: 'Різне' },
] as const

const PER_PAGE = 9

interface MediaGalleryProps {
  items: MediaCardItem[]
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const [category, setCategory] = useState<string>('all')
  const [speaker, setSpeaker] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [active, setActive] = useState<MediaCardItem | null>(null)

  // Speakers come only from sermons — the speaker filter is sermon-only.
  const speakers = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((i) => i.category === 'проповідь')
            .map((i) => i.speaker)
            .filter((s): s is string => Boolean(s)),
        ),
      ).sort(),
    [items],
  )

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (category === 'all' || i.category === category) &&
          (speaker === 'all' || i.speaker === speaker),
      ),
    [items, category, speaker],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const onCategory = (value: string) => {
    setCategory(value)
    setPage(1)
    // Speaker filter only applies to sermons — reset it when leaving that tab.
    if (value !== 'проповідь') setSpeaker('all')
  }
  const onSpeaker = (value: string) => {
    setSpeaker(value)
    setPage(1)
  }

  return (
    <>
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
            <option value="all">Усі</option>
            {speakers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grid — Isotope-style filter animation (exit fade/scale + layout reflow) */}
      <div className="mt-8">
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {pageItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <MediaCard item={item} onPlay={setActive} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <i className="far fa-play-circle mb-4 block text-5xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">Поки немає матеріалів</h3>
            <p className="text-gray-500">Незабаром тут зʼявляться нові записи.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Попередня сторінка"
          >
            <i className="fas fa-chevron-left text-xs" />
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PageButton key={n} active={n === currentPage} onClick={() => setPage(n)}>
              {n}
            </PageButton>
          ))}
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Наступна сторінка"
          >
            <i className="fas fa-chevron-right text-xs" />
          </PageButton>
        </div>
      )}

      {/* Lightbox */}
      {active?.youtubeId && (
        <Lightbox youtubeId={active.youtubeId} title={active.title} onClose={() => setActive(null)} />
      )}
    </>
  )
}

function PageButton({
  active,
  disabled,
  onClick,
  children,
  ...rest
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors',
        active
          ? 'bg-grad text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
