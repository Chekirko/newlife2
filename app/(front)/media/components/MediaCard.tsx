import Image from 'next/image'

// =========================================
// MediaCard — one media item in the /media grid. The whole card is a button
// that opens the lightbox player. Cover image falls back to the YouTube
// thumbnail (resolved server-side). Speaker / scripture show for sermons.
// =========================================

export interface MediaCardItem {
  _id: string
  title: string
  category: string
  youtubeId: string | null
  thumbnailUrl: string
  date: string
  speaker: string | null
  scripture: string | null
  description: string | null
}

interface MediaCardProps {
  item: MediaCardItem
  onPlay: (item: MediaCardItem) => void
}

export function MediaCard({ item, onPlay }: MediaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onPlay(item)}
      className="group block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
    >
      {/* Cover with play overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform group-hover:scale-110">
            <i className="fas fa-play ml-0.5 text-xl" />
          </span>
        </div>
        <span className="bg-grad absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize text-white">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-2 flex h-5 items-center gap-x-3 overflow-hidden text-xs text-gray-500">
          <span className="flex flex-shrink-0 items-center gap-1.5">
            <i className="far fa-calendar-alt" />
            {item.date}
          </span>
          {item.speaker && (
            <span className="flex items-center gap-1.5 truncate">
              <i className="far fa-user flex-shrink-0" />
              <span className="truncate">{item.speaker}</span>
            </span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 h-14 text-lg font-bold leading-snug text-gray-800 transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="line-clamp-2 h-11 text-sm text-gray-600">{item.description}</p>
      </div>
    </button>
  )
}
