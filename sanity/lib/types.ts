import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

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

/** Ministry — full detail page */
export interface SanityMinistry extends SanityMinistryCard {
  fullDescription: string
  leader: {
    _id: string
    name: string
    slug: string
    photo: SanityImageSource
  } | null
  gallery: SanityImageSource[] | null
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
  title: string
  slug: string
  publishedAt: string
  mainCategory: string
  categories: string[] | null
  text: string
  image: SanityImageSource
}

/** Event item */
export interface SanityEvent {
  _id: string
  title: string
  slug: string
  date: string
  tag: string | null
  description: string
  image: SanityImageSource
}

/** Team member — list view (cards) */
export interface SanityTeamMemberCard {
  _id: string
  name: string
  slug: string
  category: ('ordained' | 'responsible')[]
  title: string | null
  responsibility: string | null
  photo: SanityImageSource
  order: number
}

/** Team member — full detail page */
export interface SanityTeamMember extends SanityTeamMemberCard {
  bio: string | null
}
