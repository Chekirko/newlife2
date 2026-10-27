import type { ImageLoaderProps } from 'next/image'

export function sanityImageLoader({ src, width, quality = 75 }: ImageLoaderProps): string {
  const url = new URL(src)
  const sourceWidth = Number(url.searchParams.get('w'))
  const sourceHeight = Number(url.searchParams.get('h'))
  if (sourceWidth && sourceHeight) {
    url.searchParams.set('h', String(Math.round(width * sourceHeight / sourceWidth)))
  }
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality))
  url.searchParams.set('auto', 'format')
  url.searchParams.delete('fm')
  return url.toString()
}
