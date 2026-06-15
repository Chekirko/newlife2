// =========================================
// getSiteSettings — single entry point for the church's site-wide data.
//
// Fetches the `siteSettings` Sanity singleton and merges it OVER the
// `lib/church.ts` defaults: any field left empty in the CMS falls back to
// church.ts, so the UI and JSON-LD never break if the document is missing or
// a field is cleared. `church.ts` remains the source of the data SHAPE.
//
// Server-only (uses the Sanity client). Consumers: app/(front)/layout.tsx
// (header + footer), homepage JSON-LD, contact page.
// =========================================

import { client } from '@/sanity/lib/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { SITE_SETTINGS_QUERYResult } from '@/sanity/lib/sanity.types'
import { CHURCH } from '@/lib/church'
import { resolveSocialLink, type SocialLink } from '@/lib/social'

export interface SiteSettings {
  name: string
  legalName: string
  city: string
  email: string
  phone: string
  phoneDisplay: string
  address: {
    street: string
    city: string
    district: string
    region: string
    postalCode: string
    country: string
    full: string
  }
  geo: { lat: number; lng: number }
  social: SocialLink[]
  services: { label: string; day: string; time: string }[]
  defaultDescription: string | null
  /** Flat list of social URLs for JSON-LD `sameAs` (empty ones dropped). */
  sameAs: string[]
}

/** Use the CMS value when present and non-empty, otherwise the church.ts default. */
function pick(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await client.fetch<SITE_SETTINGS_QUERYResult>(
    SITE_SETTINGS_QUERY,
    {},
    { next: { revalidate: 60 } },
  )

  // Social links: use the CMS array when it has entries, else the church.ts fallback.
  // Each item is enriched (icon/label/color) via the shared registry in lib/social.ts.
  const social: SocialLink[] = (
    data?.social && data.social.length > 0 ? data.social : CHURCH.social
  )
    .map(resolveSocialLink)
    .filter((s) => s.url)

  const services =
    data?.services && data.services.length > 0
      ? data.services.map((s) => ({
          label: s.label ?? '',
          day: s.day ?? '',
          time: s.time ?? '',
        }))
      : CHURCH.services.map((s) => ({ ...s }))

  return {
    name: pick(data?.name, CHURCH.name),
    legalName: pick(data?.legalName, CHURCH.legalName),
    city: pick(data?.city, CHURCH.city),
    email: pick(data?.email, CHURCH.email),
    phone: pick(data?.phone, CHURCH.phone),
    phoneDisplay: pick(data?.phoneDisplay, CHURCH.phoneDisplay),
    address: {
      street: pick(data?.address?.street, CHURCH.address.street),
      city: pick(data?.address?.city, CHURCH.address.city),
      district: pick(data?.address?.district, CHURCH.address.district),
      region: pick(data?.address?.region, CHURCH.address.region),
      postalCode: pick(data?.address?.postalCode, CHURCH.address.postalCode),
      country: pick(data?.address?.country, CHURCH.address.country),
      full: pick(data?.address?.full, CHURCH.address.full),
    },
    geo:
      typeof data?.geo?.lat === 'number' && typeof data?.geo?.lng === 'number'
        ? { lat: data.geo.lat, lng: data.geo.lng }
        : { ...CHURCH.geo },
    social,
    services,
    defaultDescription: data?.defaultDescription ?? null,
    sameAs: social.map((s) => s.url).filter(Boolean),
  }
}
