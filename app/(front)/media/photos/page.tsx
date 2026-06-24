import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { MINISTRY_GALLERIES_QUERY } from './queries'
import { PhotoGallery, type PhotoItem } from './components/PhotoGallery'

export const revalidate = 60 // Revalidate page every 60 seconds

export const metadata: Metadata = {
  title: 'Фото | Церква «Нове Життя»',
  description:
    'Фотогалерея церкви «Нове Життя» у Бориславі — світлини зі служінь, подій та життя спільноти.',
  alternates: { canonical: '/media/photos' },
}

interface RawGalleryImage {
  _key?: string
  lqip?: string | null
  dimensions?: { width?: number; height?: number } | null
}

interface RawGalleryGroup {
  ministry: string | null
  gallery: RawGalleryImage[] | null
}

export default async function PhotosPage() {
  const [data, heroes] = await Promise.all([
    client.fetch<RawGalleryGroup[]>(MINISTRY_GALLERIES_QUERY),
    getPageHeroes(),
  ])

  // Flatten every ministry gallery into one photo list (with ministry → alt).
  const photos: PhotoItem[] = data.flatMap((group) =>
    (group.gallery ?? []).map((img, i) => ({
      id: img._key ?? `${group.ministry}-${i}`,
      thumbUrl: urlFor(img as SanityImageSource).width(800).height(600).url(),
      fullUrl: urlFor(img as SanityImageSource).width(1600).url(),
      lqip: img.lqip ?? undefined,
      alt: group.ministry ? `Фото — ${group.ministry}` : 'Фото служіння',
      width: img.dimensions?.width ?? 1600,
      height: img.dimensions?.height ?? 1067,
    })),
  )

  // Shuffle (Fisher–Yates) so the mosaic mixes ministries; re-shuffled per ISR cycle.
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[photos[i], photos[j]] = [photos[j], photos[i]]
  }

  return (
    <>
      <PageHero
        title="Фото"
        backgroundImage={heroes.mediaHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Медіа', href: '/media' },
          { label: 'Фото' },
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-larexa">
          <PhotoGallery photos={photos} />
        </div>
      </section>
    </>
  )
}
