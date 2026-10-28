import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/metadata'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PageHero } from '@/components'
import { sanityFetch } from '@/sanity/lib/fetch'
import { toPhotoItem } from '@/sanity/lib/image'
import { getPageHeroes } from '@/lib/page-heroes'
import { MINISTRY_GALLERIES_QUERY } from './queries'
import { PhotoGallery, type PhotoItem } from './components/PhotoGallery'


export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('/media/photos', {
    title: 'Фото | Церква «Нове Життя»',
    description:
      'Фотогалерея церкви «Нове Життя» у Бориславі — світлини зі служінь, подій та життя спільноти.',
    alternates: { canonical: '/media/photos' },
  })
}

interface RawGalleryImage {
  _key?: string
  asset?: { _ref?: string }
  lqip?: string | null
  dimensions?: { width?: number; height?: number } | null
}

interface RawGalleryGroup {
  _id: string
  ministry: string | null
  gallery: RawGalleryImage[] | null
}

export default async function PhotosPage() {
  const [data, heroes] = await Promise.all([
    sanityFetch<RawGalleryGroup[]>(MINISTRY_GALLERIES_QUERY, {}, ['ministry']),
    getPageHeroes(),
  ])

  // Flatten every ministry gallery into one photo list (with ministry → alt).
  const photos: PhotoItem[] = data.flatMap((group) =>
    (group.gallery ?? []).flatMap((img, i) => {
      const { width, height } = img.dimensions ?? {}
      if (!img.asset?._ref || !width || !height) return []
      return [toPhotoItem(img as SanityImageSource, {
        id: `${group._id}-${img._key ?? i}`,
        lqip: img.lqip ?? undefined,
        alt: group.ministry ? `Фото — ${group.ministry}` : 'Фото служіння',
        width,
        height,
      })]
    }),
  )

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
