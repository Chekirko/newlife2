import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { FAQ_FALLBACK } from '../lib/faq-data'

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

const HOMEPAGE_ID = 'homepage'

// Patch (not createOrReplace) → only the faq field is touched, so the hero
// slides and testimonials edited in /studio are preserved.
const faq = FAQ_FALLBACK.map((f, i) => ({
  _key: `faq-${i}`,
  question: f.question,
  answer: f.answer,
}))

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding homepage.faq. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )

  if (isDryRun) {
    console.log('To patch the homepage document, run with the --write flag.')
    console.log(JSON.stringify({ _id: HOMEPAGE_ID, faq }, null, 2))
    return
  }

  try {
    await client.patch(HOMEPAGE_ID).set({ faq }).commit()
    console.log(`✓ homepage.faq patched (${faq.length} items)`)
  } catch (err) {
    console.error('Error patching homepage document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
