import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { Icon } from '@/components/ui/Icon'
import Image from '@/components/ui/SiteImage'
import Link from 'next/link'

interface EventCardProps {
  title: string
  slug: string
  date: string
  type: string
  tag: string | null
  description: string | null
  imageUrl: string | null
  imageDimensions?: { width: number; height: number } | null
}

export function EventCard({ title, slug, date, type, tag, description, imageUrl, imageDimensions }: EventCardProps) {
  const badge = tag || (type === 'оголошення' ? 'Оголошення' : 'Подія')

  return (
    <article className="mb-6 break-inside-avoid rounded-xl overflow-hidden bg-white shadow-card transition-shadow duration-300 hover:shadow-hover-lg">
      {/* Image */}
      <div className="bg-gray-100">
        <Link href={`/events/${slug}`} className="block">
          {imageUrl ? <Image
            src={imageUrl}
            alt={title}
            width={imageDimensions?.width || 1200}
            height={imageDimensions?.height || 675}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 37vw"
            className="w-full h-auto"
          /> : <ImagePlaceholder className="h-full min-h-48 w-full" />}
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="inline-block mb-3 bg-grad-readable text-white text-xs font-semibold px-3 py-1.5 rounded">
          {badge}
        </span>
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Icon className="far fa-calendar-alt" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-3 leading-snug">
          <Link
            href={`/events/${slug}`}
            className="text-gray-800 hover:text-primary-text transition-colors"
          >
            {title}
          </Link>
        </h2>

        {/* Excerpt */}
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Read more */}
        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-text hover:text-primary-text transition-colors group"
        >
          Детальніше
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
