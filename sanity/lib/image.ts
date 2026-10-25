import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/** Full resolution and maximum CDN quality; pair with Image unoptimized. */
export const originalImageUrl = (source: SanityImageSource) =>
  builder.image(source).ignoreImageParams().quality(100).url()
