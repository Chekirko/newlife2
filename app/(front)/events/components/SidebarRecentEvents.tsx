import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface RecentEvent {
  _id: string
  title: string
  slug: string
  startDate: string
  imageUrl: string
}

interface SidebarRecentEventsProps {
  events: RecentEvent[]
}

export function SidebarRecentEvents({ events }: SidebarRecentEventsProps) {
  if (events.length === 0) return null

  return (
    <div className="mb-8">
      <h5 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-primary">
        Інші події
      </h5>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event._id} className="flex gap-3 group">
            {/* Thumbnail */}
            <div className="relative w-[70px] h-[70px] flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                sizes="70px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/events/${event.slug}`}
                className="text-sm font-medium text-gray-800 hover:text-primary transition-colors leading-snug line-clamp-2 block"
              >
                {event.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(event.startDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
