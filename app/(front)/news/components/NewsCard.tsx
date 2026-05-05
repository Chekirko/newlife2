import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
  title: string
  slug: string
  date: string
  mainCategory: string
  text: string
  imageUrl: string
}

export function NewsCard({ title, slug, date, mainCategory, text, imageUrl }: NewsCardProps) {
  return (
    <article className="mb-8 rounded-xl overflow-hidden bg-white shadow-card transition-shadow duration-300 hover:shadow-hover-lg">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        <Link href={`/news/${slug}`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        {mainCategory && (
          <span className="absolute top-4 left-4 bg-grad text-white text-xs font-semibold px-3 py-1.5 rounded">
            {mainCategory}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <i className="far fa-calendar-alt" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-lg font-semibold mb-3 leading-snug">
          <Link
            href={`/news/${slug}`}
            className="text-gray-800 hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </h4>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {text}
        </p>

        {/* Read more */}
        <Link
          href={`/news/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
        >
          Читати далі
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
