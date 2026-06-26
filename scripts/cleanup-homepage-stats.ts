import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

// One-off cleanup: the `stats` field was moved off `homepage` (now lives on the
// `aboutPage` singleton), but the data lingered on the document, so Studio shows
// "Unknown field found". This unsets `stats` on the published + draft homepage docs.
// Dry-run by default; pass --write to apply.

loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token })

const IDS = ['homepage', 'drafts.homepage']

async function run() {
  const isDryRun = !process.argv.includes('--write')
  console.log(`Cleanup homepage.stats. Mode: ${isDryRun ? 'DRY-RUN' : 'LIVE-WRITE'}`)

  for (const id of IDS) {
    const doc = await client.getDocument(id).catch(() => null)
    if (!doc) {
      console.log(`- ${id}: not found, skip`)
      continue
    }
    if (!('stats' in doc)) {
      console.log(`- ${id}: no \`stats\` field, skip`)
      continue
    }
    if (isDryRun) {
      console.log(`- ${id}: would unset \`stats\``)
      continue
    }
    await client.patch(id).unset(['stats']).commit()
    console.log(`✓ ${id}: \`stats\` unset`)
  }

  if (isDryRun) console.log('Run with --write to apply.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
