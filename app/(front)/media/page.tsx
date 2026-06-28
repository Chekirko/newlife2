import type { Metadata } from 'next'
import { LiveBanner, PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { getSiteSettings } from '@/lib/site-settings'
import { jsonLdHtml } from '@/lib/utils'
import { getYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube'
import { toMediaCard, toMatchQuery, type RawMediaItem } from '@/lib/media'
import {
  MEDIA_SEARCH_QUERY,
  MEDIA_COUNT_QUERY,
  MEDIA_SPEAKERS_QUERY,
  MEDIA_PER_PAGE,
} from './queries'
import { getLiveVideoId } from '@/lib/live-stream'
import { MediaGallery } from './components/MediaGallery'

export const revalidate = 60 // Revalidate page every 60 seconds

export const metadata: Metadata = {
  title: 'Медіа | Церква «Нове Життя»',
  description:
    'Проповіді, трансляції богослужінь, пісні та відео церкви «Нове Життя» у Бориславі.',
  alternates: { canonical: '/media' },
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; speaker?: string; q?: string }>
}) {
  const { category = '', speaker = '', q = '' } = await searchParams
  const params = {
    category,
    speaker,
    q: toMatchQuery(q),
    start: 0,
    end: MEDIA_PER_PAGE,
  }

  const [itemsRaw, total, speakers, heroes, settings] = await Promise.all([
    client.fetch<RawMediaItem[]>(MEDIA_SEARCH_QUERY, params),
    client.fetch<number>(MEDIA_COUNT_QUERY, { category, speaker, q: params.q }),
    client.fetch<string[]>(MEDIA_SPEAKERS_QUERY),
    getPageHeroes(),
    getSiteSettings(),
  ])

  // Live banner: auto-detect whether the configured YouTube channel is live now.
  const liveVideoId = settings.liveStream
    ? await getLiveVideoId(settings.liveStream.channelId)
    : null

  const cards = itemsRaw.map(toMediaCard)

  // ItemList of VideoObject JSON-LD (schema-markup skill) — only the first batch
  // of playable items; the full archive can run to thousands.
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: itemsRaw
      .map((m) => ({ m, id: getYouTubeId(m.youtubeUrl) }))
      .filter((x): x is { m: RawMediaItem; id: string } => Boolean(x.id))
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
        <LiveBanner videoId={liveVideoId} label={settings.liveStream.label || 'Пряма трансляція'} />
      )}

      <section className="py-12 lg:py-16">
        <div className="container-larexa">
          <MediaGallery
            initialCards={cards}
            total={total}
            speakers={speakers}
            category={category}
            speaker={speaker}
            q={q}
          />
        </div>
      </section>
    </>
  )
}
