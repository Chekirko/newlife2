// =========================================
// CHURCH — single source of truth for the church's real-world data
// (name, address, contacts, service times, socials, geo).
//
// Interim home for this data. In Phase 1.1 it moves to a Sanity
// `siteSettings` singleton so the church can edit it without a developer;
// JSON-LD and UI will then read from there instead. Keep the shape stable.
// =========================================

export const CHURCH = {
  /** Display name */
  name: 'Церква «Нове життя»',
  /** Official registered name (EDRPOU 20785925) */
  legalName:
    'Релігійна громада помісної церкви християн віри євангельської м. Борислав «Нове життя»',
  city: 'Борислав',

  email: 'zerkvahrista@gmail.com',
  /** E.164 phone for tel: links and schema */
  phone: '+380633697532',
  /** Human-friendly phone for display */
  phoneDisplay: '+38 (063) 369-75-32',

  address: {
    street: 'вул. Героїв ОУН-УПА, 11',
    city: 'м. Борислав',
    district: 'Дрогобицький район',
    region: 'Львівська область',
    postalCode: '82300',
    /** ISO 3166-1 alpha-2 */
    country: 'UA',
    /** Full single-line address (also used to geocode the map embed) */
    full: 'вул. Героїв ОУН-УПА, 11, м. Борислав, Львівська область, 82300',
  },

  /** Exact pin from Google Maps (church POI). */
  geo: { lat: 49.291239, lng: 23.428751 },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61588218983350',
    instagram: 'https://www.instagram.com/newlife_borislav/',
    youtube: 'https://www.youtube.com/channel/UCZGAN3BWwW3wm7bOUV_dFjw',
  },

  /** Service times (start only — used for display and openingHours later). */
  services: [
    { label: 'Недільне богослужіння', day: 'Неділя', time: '11:00' },
    { label: 'Вечір молитви', day: 'Вівторок', time: '19:00' },
    { label: 'Вечір молитви', day: "П'ятниця", time: '19:00' },
    { label: 'Молодіжне служіння', day: 'Субота', time: '19:00' },
  ],
} as const

/** All social profile URLs as a flat list (for JSON-LD `sameAs`). */
export const CHURCH_SAME_AS: string[] = [
  CHURCH.social.facebook,
  CHURCH.social.instagram,
  CHURCH.social.youtube,
]
