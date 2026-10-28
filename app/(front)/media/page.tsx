import type { Metadata } from 'next'
import { cache } from 'react'
import { getPageMetadata } from '@/lib/metadata'
import { LiveBanner, PageHero } from '@/components'
import { sanityFetch } from '@/sanity/lib/fetch'
import { getPageHeroes } from '@/lib/page-heroes'
import { getSiteSettings } from '@/lib/site-settings'
import { toMediaCard, type RawMediaItem } from '@/lib/media'
import {
  MEDIA_SEARCH_QUERY,
  MEDIA_COUNT_QUERY,
  MEDIA_SPEAKERS_QUERY,
  MEDIA_PER_PAGE,
} from './queries'
import { getLiveVideoId } from '@/lib/live-stream'
import { renderMediaCards } from './components/MediaCard'
import { MediaGallery } from './components/MediaGallery'



export async function generateMetadata(): Promise<Metadata> {
  const { itemsRaw } = await getMediaListing()
  return getPageMetadata('/media', {
    title: 'Медіа',
    description:
      'Проповіді, трансляції богослужінь, пісні та відео церкви «Нове Життя» у Бориславі.',
    alternates: { canonical: null },
    ...(itemsRaw.length === 0 ? { noIndex: true } : {}),
  })
}

const getMediaListing = cache(async () => {
  const params = {
    category: '',
    speaker: '',
    q: '',
    start: 0,
    end: MEDIA_PER_PAGE,
  }

  const [itemsRaw, total] = await Promise.all([
    sanityFetch<RawMediaItem[]>(MEDIA_SEARCH_QUERY, params, ['mediaItem']),
    sanityFetch<number>(MEDIA_COUNT_QUERY, { category: '', speaker: '', q: '' }, ['mediaItem']),
  ])
  return { itemsRaw, total }
})

export default async function MediaPage() {
  const [{ itemsRaw, total }, speakers, heroes, settings] = await Promise.all([
    getMediaListing(),
    sanityFetch<string[]>(MEDIA_SPEAKERS_QUERY, {}, ['mediaItem']),
    getPageHeroes(),
    getSiteSettings(),
  ])

  // Live banner: auto-detect whether the configured YouTube channel is live now.
  const liveVideoId = settings.liveStream
    ? await getLiveVideoId(settings.liveStream.channelId)
    : null

  const cards = itemsRaw.map(toMediaCard)

  return (
    <>
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
            initialViews={renderMediaCards(cards)}
            total={total}
            speakers={speakers}
          />
        </div>
      </section>
    </>
  )
}
