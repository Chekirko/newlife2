import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Image from '@/components/ui/SiteImage'
import { VideoPlayButton } from '@/components/ui/VideoPlayButton'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  /** Detail page; video cards without one open the player only. */
  href?: string
  image: string | null
  tag?: string
  /** ISO date, shown in Europe/Kyiv. */
  date: string
  title: string
  excerpt?: string
  /** Extra meta after the date, e.g. event time or speaker. */
  meta?: string
  video?: { youtubeId: string | null }
  as?: 'h2' | 'h3'
  sizes?: string
}

/** Larexa blog `post-item`: cover with a category tag, date/meta, title, excerpt and «Читати далі». */
export function PostCard({
  href, image, tag, date, title, excerpt, meta, video, as: Heading = 'h3',
  sizes = '(max-width: 575px) 100vw, (max-width: 767px) 50vw, 360px',
}: PostCardProps) {
  // The title link names the card, so the cover is decorative.
  const cover = image
    ? <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
    : <ImagePlaceholder className="absolute inset-0" />
  return (
    <article className="post-item">
      <div className="post-image aspect-video">
        {video ? (
          <VideoPlayButton youtubeId={video.youtubeId} title={title} className="absolute inset-0 block w-full">
            {cover}
            <span className="btn-round btn-grad absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <Icon className="fas fa-play" />
            </span>
          </VideoPlayButton>
        ) : href ? (
          <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">{cover}</Link>
        ) : cover}
        {tag && <span className="post-meta-category bg-grad-readable">{tag}</span>}
      </div>
      <div className="post-item-desc">
        <time dateTime={date} className="post-meta">{formatDate(date)}</time>
        {meta && <span className="post-meta">{meta}</span>}
        <Heading className="post-title">{href ? <Link href={href}>{title}</Link> : title}</Heading>
        {excerpt && <p>{excerpt}</p>}
        {href && (
          <Link href={href} className="item-link">
            Читати далі<span className="sr-only">: {title}</span>
            <Icon className="fas fa-arrow-right" />
          </Link>
        )}
      </div>
    </article>
  )
}
