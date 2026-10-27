'use client'

import Image, { type ImageProps } from 'next/image'
import { sanityImageLoader } from '@/lib/sanity-image-loader'

export type { StaticImageData, ImageProps } from 'next/image'

/** Sanity serves responsive previews directly; local images use Next's optimizer. */
export default function SiteImage({ alt, ...props }: ImageProps) {
  const isSanity = typeof props.src === 'string' && props.src.startsWith('https://cdn.sanity.io/images/')
  return <Image {...props} alt={alt} loader={isSanity && !props.unoptimized ? sanityImageLoader : undefined} />
}
