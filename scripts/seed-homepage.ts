import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnvConfig } from '@next/env'
import { HERO_SLIDES_FALLBACK } from '../lib/hero-slides-data'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

// Helper for __dirname in ESM/TS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
const HOMEPAGE_ID = 'homepage'

// Upload a local image from /public and return an image reference (or null).
async function uploadImage(imagePath: string) {
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  const absolutePath = path.join(__dirname, '..', 'public', relativePath)

  if (!fs.existsSync(absolutePath)) {
    console.warn(`[Warning] Image not found locally: ${absolutePath}. Skipping.`)
    return null
  }

  const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {
    filename: path.basename(absolutePath),
  })
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
}

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding homepage singleton. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )

  if (isDryRun) {
    console.log('To upload images and write the document, run with the --write flag.')
    // Show the text/structure that will be written (images uploaded only on --write).
    const preview = HERO_SLIDES_FALLBACK.map((s, i) => ({
      _key: `hero-${i}`,
      image: `<upload ${s.backgroundImage}>`,
      preTitle: s.preTitle,
      title: s.title,
      subtitle: s.subtitle,
      buttonText: s.buttonText,
      buttonHref: s.buttonHref,
      secondaryButtonText: s.secondaryButtonText,
      secondaryButtonHref: s.secondaryButtonHref,
      align: s.align,
    }))
    console.log(JSON.stringify({ _id: HOMEPAGE_ID, _type: 'homepage', heroSlides: preview }, null, 2))
    return
  }

  try {
    const heroSlides = []
    for (let i = 0; i < HERO_SLIDES_FALLBACK.length; i++) {
      const s = HERO_SLIDES_FALLBACK[i]
      const image =
        typeof s.backgroundImage === 'string' ? await uploadImage(s.backgroundImage) : null
      heroSlides.push({
        _key: `hero-${i}`,
        ...(image ? { image } : {}),
        preTitle: s.preTitle,
        title: s.title,
        subtitle: s.subtitle,
        buttonText: s.buttonText,
        buttonHref: s.buttonHref,
        secondaryButtonText: s.secondaryButtonText,
        secondaryButtonHref: s.secondaryButtonHref,
        align: s.align,
      })
    }

    const doc = { _id: HOMEPAGE_ID, _type: 'homepage', heroSlides }
    const result = await client.createOrReplace(doc)
    console.log(`✓ homepage document written (_id: ${result._id}, ${heroSlides.length} slides)`)
  } catch (err) {
    console.error('Error writing homepage document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
