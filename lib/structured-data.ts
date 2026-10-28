import { SITE_URL } from '@/lib/site'
import type { SiteSettings } from '@/lib/site-settings'
import type { SanityEvent } from '@/sanity/lib/types'
import { schemaDate } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'

export const CHURCH_ID = `${SITE_URL}/#church`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const CHURCH_LOGO = `${SITE_URL}/images/logo-dark.svg`

export function siteGraph(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': ['Church', 'Organization'],
      '@id': CHURCH_ID,
      name: settings.name,
      legalName: settings.legalName,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: CHURCH_LOGO, width: 1203, height: 461 },
      image: settings.ogImage ?? `${SITE_URL}/images/hero-church-1.jpg`,
      email: settings.email,
      telephone: settings.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address.street,
        addressLocality: settings.address.city,
        addressRegion: settings.address.region,
        postalCode: settings.address.postalCode,
        addressCountry: settings.address.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: settings.geo.lat, longitude: settings.geo.lng },
      sameAs: settings.sameAs,
      ...(settings.openingHours.length > 0 ? {
        openingHoursSpecification: settings.openingHours.map((hours) => ({
          '@type': 'OpeningHoursSpecification', ...hours,
        })),
      } : {}),
    }, {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: settings.name,
      inLanguage: 'uk',
      publisher: { '@id': CHURCH_ID },
    }],
  }
}

/** Incomplete venues and announcements must not produce an invalid Event. */
export function eventStructuredData(event: SanityEvent, path: string, description?: string) {
  const startDate = schemaDate(event.startDate)
  const address = event.locationAddress
  if (event.type !== 'подія' || !event.title?.trim() || !startDate ||
      !event.location?.trim() || !address?.street?.trim() || !address.city?.trim() || !address.country?.trim()) return null
  const endDate = schemaDate(event.endDate)
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${SITE_URL}${path}#event`,
    url: `${SITE_URL}${path}`,
    name: event.title,
    startDate,
    ...(endDate && Date.parse(endDate) >= Date.parse(startDate) ? { endDate } : {}),
    eventStatus: `https://schema.org/${event.eventStatus || 'EventScheduled'}`,
    location: { '@type': 'Place', name: event.location, address: {
      '@type': 'PostalAddress', streetAddress: address.street, addressLocality: address.city,
      addressCountry: address.country, addressRegion: address.region || undefined,
      postalCode: address.postalCode || undefined,
    } },
    ...(event.organizer?.trim() ? {
      organizer: { '@type': 'Organization', name: event.organizer },
    } : {}),
    ...(typeof event.isAccessibleForFree === 'boolean' ? { isAccessibleForFree: event.isAccessibleForFree } : {}),
    ...(description ? { description } : {}),
    ...(event.image ? { image: urlFor(event.image).width(1200).height(675).url() } : {}),
  }
}
