import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { CHURCH } from '../lib/church'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, or NEXT_PUBLIC_SANITY_DATASET',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// Fixed id → this is what makes the document a singleton.
const SITE_SETTINGS_ID = 'siteSettings'

// Build the document from the current lib/church.ts data (single source of shape).
const doc = {
  _id: SITE_SETTINGS_ID,
  _type: 'siteSettings',
  name: CHURCH.name,
  legalName: CHURCH.legalName,
  city: CHURCH.city,
  email: CHURCH.email,
  phone: CHURCH.phone,
  phoneDisplay: CHURCH.phoneDisplay,
  address: {
    street: CHURCH.address.street,
    city: CHURCH.address.city,
    district: CHURCH.address.district,
    region: CHURCH.address.region,
    postalCode: CHURCH.address.postalCode,
    country: CHURCH.address.country,
    full: CHURCH.address.full,
  },
  geo: {
    _type: 'geopoint',
    lat: CHURCH.geo.lat,
    lng: CHURCH.geo.lng,
  },
  social: CHURCH.social.map((s, i) => ({
    _key: `social-${i}`,
    platform: s.platform,
    url: s.url,
  })),
  services: CHURCH.services.map((s, i) => ({
    _key: `service-${i}`,
    label: s.label,
    day: s.day,
    time: s.time,
    endTime: s.endTime,
  })),
}

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding siteSettings singleton. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )
  if (isDryRun) {
    console.log('To write the document to Sanity, run with the --write flag.')
    console.log(JSON.stringify(doc, null, 2))
    return
  }

  try {
    // createOrReplace is idempotent — safe to re-run; overwrites the singleton.
    const result = await client.createOrReplace(doc)
    console.log(`✓ siteSettings document written (_id: ${result._id})`)
  } catch (err) {
    console.error('Error writing siteSettings document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
