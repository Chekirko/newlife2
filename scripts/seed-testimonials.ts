import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { TESTIMONIALS_FALLBACK } from '../lib/testimonials-data'

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

// Patch (not createOrReplace) → only the testimonials field is touched, so the
// hero slides edited in /studio are preserved. No images to upload (avatars optional).
const testimonials = TESTIMONIALS_FALLBACK.map((t, i) => ({
  _key: `testimonial-${i}`,
  quote: t.quote,
  name: t.name,
  position: t.position,
  rating: t.rating,
}))

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding homepage.testimonials. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )

  if (isDryRun) {
    console.log('To patch the homepage document, run with the --write flag.')
    console.log(JSON.stringify({ _id: HOMEPAGE_ID, testimonials }, null, 2))
    return
  }

  try {
    await client.patch(HOMEPAGE_ID).set({ testimonials }).commit()
    console.log(`✓ homepage.testimonials patched (${testimonials.length} items)`)
  } catch (err) {
    console.error('Error patching homepage document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
