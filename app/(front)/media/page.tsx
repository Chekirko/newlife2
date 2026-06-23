import type { Metadata } from 'next'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { formatDate, jsonLdHtml } from '@/lib/utils'
import { getYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube'
import { MEDIA_ALL_QUERY } from './queries'
import type { MEDIA_ALL_QUERYResult } from '@/sanity/lib/sanity.types'
import { getLiveVideoId } from '@/lib/live-stream'
import { MediaGallery } from './components/MediaGallery'
import type { MediaCardItem } from './components/MediaCard'
import { LiveBanner } from './components/LiveBanner'

export const revalidate = 60 // Revalidate page every 60 seconds

export const metadata: Metadata = {
  title: 'Медіа | Церква «Нове Життя»',
  description:
    'Проповіді, трансляції богослужінь, пісні та відео церкви «Нове Життя» у Бориславі.',
  alternates: { canonical: '/media' },
}

export default async function MediaPage() {
  const [itemsRaw, heroes, settings] = await Promise.all([
    client.fetch<MEDIA_ALL_QUERYResult>(MEDIA_ALL_QUERY),
    getPageHeroes(),
    getSiteSettings(),
  ])

  // Live banner: auto-detect whether the configured YouTube channel is live now.
  const liveVideoId = settings.liveStream
    ? await getLiveVideoId(settings.liveStream.channelId)
    : null

  // Transform for the client grid: resolve YouTube id + cover thumbnail.
  const cards: MediaCardItem[] = itemsRaw.map((m) => {
    const youtubeId = getYouTubeId(m.youtubeUrl)
    const thumbnailUrl = m.image
      ? urlFor(m.image).width(800).height(450).url()
      : youtubeId
        ? getYouTubeThumbnail(youtubeId)
        : '/images/placeholder.jpg'
    return {
      _id: m._id,
      title: m.title ?? 'Без назви',
      category: m.category ?? 'різне',
      youtubeId,
      thumbnailUrl,
      date: m.date ? formatDate(m.date) : '',
      speaker: m.speaker ?? null,
      scripture: m.scripture ?? null,
      description: m.description ?? null,
    }
  })

  // ItemList of VideoObject JSON-LD (schema-markup skill) — only playable items.
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: itemsRaw
      .map((m) => ({ m, id: getYouTubeId(m.youtubeUrl) }))
      .filter((x): x is { m: (typeof itemsRaw)[number]; id: string } => Boolean(x.id))
      .map(({ m, id }, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'VideoObject',
          name: m.title ?? 'Відео',
          ...(m.description ? { description: m.description } : {}),
          thumbnailUrl: m.image
            ? urlFor(m.image).width(800).height(450).url()
            : getYouTubeThumbnail(id),
          ...(m.date ? { uploadDate: m.date } : {}),
          embedUrl: getYouTubeEmbedUrl(id),
          contentUrl: `https://www.youtube.com/watch?v=${id}`,
        },
      })),
  }

  return (
    <>
      {itemListJsonLd.itemListElement.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(itemListJsonLd) }}
        />
      )}

      <PageHero
        title="Медіа"
        backgroundImage={heroes.mediaHero}
        breadcrumbs={[{ label: 'Головна', href: '/' }, { label: 'Медіа' }]}
      />

      {liveVideoId && settings.liveStream && (
        <LiveBanner videoId={liveVideoId} label={settings.liveStream.label} />
      )}

      <section className="py-12 lg:py-16">
        <div className="container-larexa">
          <MediaGallery items={cards} />
        </div>
      </section>
    </>
  )
}
