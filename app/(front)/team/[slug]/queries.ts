import { defineQuery } from 'next-sanity'

/** Один служитель по slug — повна інформація */
export const TEAM_MEMBER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "teamMember" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    category,
    title,
    responsibility,
    candidateTitle,
    bio,
    photo,
    order
  }
`)

/** Усі slug'и — для generateStaticParams */
export const TEAM_MEMBER_SLUGS_QUERY = defineQuery(`
  *[_type == "teamMember"] { "slug": slug.current }
`)
