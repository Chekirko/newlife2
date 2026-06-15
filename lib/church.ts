// =========================================
// CHURCH — typed FALLBACK defaults for the church's real-world data
// (name, address, contacts, service times, socials, geo).
//
// As of Phase 1.1 the editable source of truth is the Sanity `siteSettings`
// singleton. The UI and JSON-LD read it through `getSiteSettings()`
// (`lib/site-settings.ts`), which falls back to these values for any field
// left empty in the CMS. This file also defines the data SHAPE — keep it stable.
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

  /** Social links — array so new platforms can be added in /studio (see lib/social.ts). */
  social: [
    { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61588218983350' },
    { platform: 'instagram', url: 'https://www.instagram.com/newlife_borislav/' },
    { platform: 'youtube', url: 'https://www.youtube.com/channel/UCZGAN3BWwW3wm7bOUV_dFjw' },
  ],

  /** Service times — start + end (end feeds openingHours JSON-LD; editable in CMS). */
  services: [
    { label: 'Недільне богослужіння', day: 'Неділя', time: '11:00', endTime: '13:00' },
    { label: 'Вечір молитви', day: 'Вівторок', time: '19:00', endTime: '20:30' },
    { label: 'Вечір молитви', day: "П'ятниця", time: '19:00', endTime: '20:30' },
    { label: 'Молодіжне служіння', day: 'Субота', time: '19:00', endTime: '20:30' },
  ],
} as const
