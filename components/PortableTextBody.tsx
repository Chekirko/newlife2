import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlFor } from '@/sanity/lib/image'

// Inline-image block shape (dimensions are deref'd in the page GROQ query).
type InlineImage = {
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
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }: { value: InlineImage }) => {
      if (!value?.asset) return null
      const width = value.dimensions?.width ?? 1200
      const height = value.dimensions?.height ?? 800
      return (
        <Image
          src={urlFor(value as SanityImageSource).width(1200).fit('max').auto('format').url()}
          alt={value.alt ?? ''}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 800px"
          className="rounded-xl my-6 w-full h-auto"
        />
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

  return <PortableText value={value} components={components} />
}
