import { StaticImageData } from 'next/image'

export interface MinistryTeamMember {
  name: string
  photo: string | StaticImageData
}

export interface Ministry {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  image: string | StaticImageData
  leaderName: string
  leaderPhoto: string | StaticImageData
  team?: MinistryTeamMember[]
  photos?: (string | StaticImageData)[]
  gallery?: (string | StaticImageData)[]
  bibleQuote?: {
    text: string
    reference: string
  }
}
