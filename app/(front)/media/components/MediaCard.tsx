import { Icon } from '@/components/ui/Icon'
import Image from '@/components/ui/SiteImage'
import { VideoPlayButton } from '@/components/ui/VideoPlayButton'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

export interface MediaCardItem {
  _id: string
  title: string
  category: string
  youtubeId: string | null
  thumbnailUrl: string | null
  date: string
  speaker: string | null
  scripture: string | null
  description: string | null
  tags: string[] | null
}

interface MediaCardProps {
  item: MediaCardItem
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <article
      className="group block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
    >
      {/* Cover with play overlay */}
      <VideoPlayButton youtubeId={item.youtubeId} title={item.title} className="relative block aspect-video w-full overflow-hidden bg-gray-100">
        {item.thumbnailUrl ? <Image
          src={item.thumbnailUrl!}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        /> : <ImagePlaceholder className="absolute inset-0" />}
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary-text shadow-md transition-transform group-hover:scale-110">
            <Icon className="fas fa-play ml-0.5 text-xl" />
          </span>
        </div>
        <span className="bg-grad-readable absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize text-white">
          {item.category}
        </span>
      </VideoPlayButton>

      {/* Body */}
      <div className="p-5">
        <div className="mb-2 flex h-5 items-center gap-x-3 overflow-hidden text-xs text-gray-500">
          <span className="flex flex-shrink-0 items-center gap-1.5">
            <Icon className="far fa-calendar-alt" />
            {item.date}
          </span>
          {item.speaker && (
            <span className="flex items-center gap-1.5 truncate">
              <Icon className="far fa-user flex-shrink-0" />
              <span className="truncate">{item.speaker}</span>
            </span>
          )}
        </div>
        <h2 className="mb-2 line-clamp-2 h-14 text-lg font-bold leading-snug text-gray-800 transition-colors group-hover:text-primary-text">
          {item.title}
        </h2>
        <p className="line-clamp-2 h-11 text-sm text-gray-600">{item.description}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function renderMediaCards(cards: MediaCardItem[]) {
  return cards.map(item => <MediaCard key={item._id} item={item} />)
}
