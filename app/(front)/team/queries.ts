import { defineQuery } from 'next-sanity'

// ============================================
// TEAM LIST PAGE QUERIES
// ============================================

/** Field projection shared across all team queries */
const TEAM_MEMBER_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  category,
  title,
  responsibility,
  candidateTitle,
  photo,
  order
`

/** Усі почесні служителі */
export const TEAM_HONORARY_QUERY = defineQuery(`
  *[_type == "teamMember" && "honorary" in category] | order(order asc) {
    ${TEAM_MEMBER_FIELDS}
  }
`)

/** Усі рукопокладені служителі */
export const TEAM_ORDAINED_QUERY = defineQuery(`
  *[_type == "teamMember" && "ordained" in category && !("honorary" in category)] | order(order asc) {
    ${TEAM_MEMBER_FIELDS}
  }
`)

/** Усі кандидати */
export const TEAM_CANDIDATE_QUERY = defineQuery(`
  *[_type == "teamMember" && "candidate" in category] | order(order asc) {
    ${TEAM_MEMBER_FIELDS}
  }
`)

/** Усі відповідальні за служіння */
export const TEAM_RESPONSIBLE_QUERY = defineQuery(`
  *[_type == "teamMember" && "responsible" in category] | order(order asc) {
    ${TEAM_MEMBER_FIELDS}
  }
`)
