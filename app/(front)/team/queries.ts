import { defineQuery } from 'next-sanity'

/** Усі рукопокладені служителі (для першої секції) */
export const TEAM_ORDAINED_QUERY = defineQuery(`
  *[_type == "teamMember" && "ordained" in category] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    title,
    responsibility,
    photo,
    order
  }
`)

/** Усі відповідальні за служіння (для другої секції) */
export const TEAM_RESPONSIBLE_QUERY = defineQuery(`
  *[_type == "teamMember" && "responsible" in category] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    title,
    responsibility,
    photo,
    order
  }
`)
