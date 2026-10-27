import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'
import type { PhotoItem } from '@/components/ui/ImageLightbox'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source).auto('format').quality(75)
}

/** Only the viewer consumes the original; page images consume thumbUrl. */
export function toPhotoItem(source: SanityImageSource, details: Omit<PhotoItem, 'thumbUrl' | 'fullUrl'>): PhotoItem {
  return {
    ...details,
    thumbUrl: urlFor(source).width(1600).url(),
    fullUrl: builder.image(source).ignoreImageParams().url(),
  }
}
