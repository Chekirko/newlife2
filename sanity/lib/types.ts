import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextBlock } from '@portabletext/types'

// ============================================
// Sanity Document Types
// Used across pages and components
// ============================================

/** Ministry — list view (cards) */
export interface SanityMinistryCard {
  _id: string
  title: string
  slug: string
  shortDescription: string
  image: SanityImageSource
  order: number
}

/** Gallery image with the asset metadata the lightbox needs (lqip + dimensions) */
export interface SanityGalleryImage {
  _key?: string
  asset?: { _ref?: string; _type?: string }
  lqip?: string | null
  dimensions?: { width?: number; height?: number } | null
}

/** Ministry — full detail page */
export interface SanityMinistry extends SanityMinistryCard {
  fullDescription: PortableTextBlock[] | null
  leader: {
    _id: string
    name: string
    slug: string
    photo: SanityImageSource
  } | null
  gallery: SanityGalleryImage[] | null
  bibleQuoteText: string | null
  bibleQuoteReference: string | null
}

/** Ministry — sidebar link */
export interface SanityMinistryLink {
  _id: string
  title: string
  slug: string
}

/** News item */
export interface SanityNews {
  _id: string
  _updatedAt?: string
  title: string
  slug: string
  publishedAt: string
  mainCategory: string
  categories: string[] | null
  ministry?: string | null
  text: string
  body: PortableTextBlock[] | null
  image: SanityImageSource
}

/** Event / announcement item */
export interface SanityEvent {
  _id: string
  type: 'подія' | 'оголошення'
  title: string
  slug: string
  startDate: string
  activeUntil: string | null
  location: string | null
  tag: string | null
  description: string | null
  body: PortableTextBlock[] | null
  image: SanityImageSource | null
}

/** Team member — list view (cards) */
export interface SanityTeamMemberCard {
  _id: string
  name: string
  slug: string
  category: ('ordained' | 'responsible' | 'candidate' | 'honorary')[]
  title: string | null
  responsibility: string | null
  candidateTitle: string | null
  photo: SanityImageSource
  order: number
}

/** Team member — full detail page */
export interface SanityTeamMember extends SanityTeamMemberCard {
  bio: PortableTextBlock[] | null
}
