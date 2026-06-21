import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { ABOUT_FALLBACK } from '../lib/about-data'

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
const ABOUT_PAGE_ID = 'aboutPage'

const a = ABOUT_FALLBACK

// Build the flat document (schema field names) from the typed fallback shape.
const doc = {
  _id: ABOUT_PAGE_ID,
  _type: 'aboutPage',

  heroTitle: a.heroTitle,

  whoPreTitle: a.whoWeAre.preTitle,
  whoHeading: a.whoWeAre.heading,
  denomination: a.whoWeAre.denomination,
  missionLabel: a.whoWeAre.missionLabel,
  mission: a.whoWeAre.mission,

  historyPreTitle: a.history.preTitle,
  historyTitle: a.history.title,
  historyParagraphs: a.history.paragraphs,

  beliefsPreTitle: a.beliefs.preTitle,
  beliefsTitle: a.beliefs.title,
  beliefs: a.beliefs.items.map((b, i) => ({
    _key: `belief-${i}`,
    title: b.title,
    text: b.text,
  })),

  valuesPreTitle: a.values.preTitle,
  valuesTitle: a.values.title,
  valuesDescription: a.values.description,
  values: a.values.items.map((v, i) => ({
    _key: `value-${i}`,
    iconKey: v.iconKey,
    title: v.title,
    text: v.text,
    featured: v.featured ?? false,
  })),

  expectPreTitle: a.whatToExpect.preTitle,
  expectTitle: a.whatToExpect.title,
  expectDescription: a.whatToExpect.description,
  whatToExpect: a.whatToExpect.items.map((w, i) => ({
    _key: `expect-${i}`,
    icon: w.icon,
    title: w.title,
    text: w.text,
  })),
  expectCtaText: a.whatToExpect.ctaText,

  leadershipPreTitle: a.leadership.preTitle,
  leadershipTitle: a.leadership.title,
  leadershipIntro: a.leadership.intro,
  leadershipCtaText: a.leadership.ctaText,

  statsPreTitle: a.stats.preTitle,
  statsTitle: a.stats.title,
  statsDescription: a.stats.description,
  stats: a.stats.items.map((s, i) => ({
    _key: `stat-${i}`,
    value: s.value,
    label: s.label,
  })),

  ctaTitle: a.finalCta.title,
  ctaText: a.finalCta.text,
  ctaPrimaryText: a.finalCta.primaryText,
  ctaSecondaryText: a.finalCta.secondaryText,
}

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding aboutPage singleton. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )
  if (isDryRun) {
    console.log('To write the document to Sanity, run with the --write flag.')
    console.log(JSON.stringify(doc, null, 2))
    return
  }

  try {
    // createOrReplace is idempotent — safe to re-run; overwrites the singleton.
    const result = await client.createOrReplace(doc)
    console.log(`✓ aboutPage document written (_id: ${result._id})`)
  } catch (err) {
    console.error('Error writing aboutPage document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
