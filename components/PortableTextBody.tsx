import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { originalImageUrl } from '@/sanity/lib/image'
import { PhotoViewer } from './ui/PhotoViewer'
import type { PhotoItem } from './ui/ImageLightbox'

// Inline-image block shape (dimensions are deref'd in the page GROQ query).
type InlineImage = {
  _key?: string
  asset?: { _ref: string }
  alt?: string
  dimensions?: { width: number; height: number } | null
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading font-bold text-gray-800 text-2xl lg:text-3xl mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading font-bold text-gray-800 text-xl lg:text-2xl mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading font-semibold text-gray-800 text-lg lg:text-xl mt-6 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 py-4 px-6 rounded-xl bg-gray-50 border-l-4 border-primary italic text-gray-700 text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-600 text-base lg:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-600 text-base lg:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href ?? '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-primary-text underline underline-offset-2 hover:text-primary-text transition-colors"
        >
          {children}
        </a>
      )
    },
  },
}

/**
 * Renders a Portable Text body with the site's typography. Used by the
 * news / event / ministry / team detail pages. Falls back to a plain
 * paragraph if it receives a legacy plain string (pre-migration / ISR window),
 * so a not-yet-migrated document never throws.
 */
export function PortableTextBody({
  value,
}: {
  value: PortableTextBlock[] | string | null | undefined
}) {
  if (!value) return null

  if (typeof value === 'string') {
    return (
      <p className="text-gray-600 leading-relaxed text-base lg:text-lg whitespace-pre-line">
        {value}
      </p>
    )
  }

  const photos: PhotoItem[] = (value.filter((block) => block._type === 'image') as unknown as InlineImage[])
    .flatMap((image) => {
      if (!image.asset?._ref) return []
      const original = originalImageUrl(image as SanityImageSource)
      return [{
        id: image._key ?? image.asset._ref,
        thumbUrl: original,
        fullUrl: original,
        alt: image.alt?.trim() || 'Фотографія',
        width: image.dimensions?.width ?? 1200,
        height: image.dimensions?.height ?? 800,
      }]
    })

  return <PortableText value={value} components={{
    ...components,
    types: {
      image: ({ value: image }: { value: InlineImage }) => {
        const index = photos.findIndex((photo) => photo.id === (image._key ?? image.asset?._ref))
        const photo = photos[index]
        if (!photo) return null
        return (
          <PhotoViewer photos={photos} index={index} className="my-6 overflow-hidden rounded-xl">
            <Image src={photo.fullUrl} alt={photo.alt} width={photo.width} height={photo.height} unoptimized className="w-full h-auto" />
          </PhotoViewer>
        )
      },
    },
  }} />
}
