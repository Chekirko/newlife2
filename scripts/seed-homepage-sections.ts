import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnvConfig } from '@next/env'
import { WHAT_YOU_FIND_FALLBACK } from '../lib/what-you-find-data'
import { STATS_FALLBACK } from '../lib/stats-data'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

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

const stats = STATS_FALLBACK.map((s, i) => ({
  _key: `stat-${i}`,
  value: s.value,
  label: s.label,
}))

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding homepage.whatYouFind + stats. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )

  if (isDryRun) {
    console.log('To upload images and patch the document, run with the --write flag.')
    const whatYouFindPreview = WHAT_YOU_FIND_FALLBACK.map((w, i) => ({
      _key: `wyf-${i}`,
      image: `<upload ${w.image}>`,
      icon: w.icon,
      title: w.title,
      description: w.description,
    }))
    console.log(JSON.stringify({ _id: HOMEPAGE_ID, whatYouFind: whatYouFindPreview, stats }, null, 2))
    return
  }

  try {
    const whatYouFind = []
    for (let i = 0; i < WHAT_YOU_FIND_FALLBACK.length; i++) {
      const w = WHAT_YOU_FIND_FALLBACK[i]
      const image = await uploadImage(w.image)
      whatYouFind.push({
        _key: `wyf-${i}`,
        ...(image ? { image } : {}),
        icon: w.icon,
        title: w.title,
        description: w.description,
      })
    }

    // Patch (not createOrReplace) → preserves hero / testimonials / faq.
    await client.patch(HOMEPAGE_ID).set({ whatYouFind, stats }).commit()
    console.log(
      `✓ homepage patched (${whatYouFind.length} "what you'll find" cards, ${stats.length} stats)`,
    )
  } catch (err) {
    console.error('Error patching homepage document:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
