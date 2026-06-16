import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

// Converts legacy plain-string body fields to Portable Text blocks so existing
// content keeps rendering after the schema fields changed to rich text.
//   - news:        text  -> body (new field; text stays as the card excerpt)
//   - event:       body            (string -> blocks, in place)
//   - ministry:    fullDescription (string -> blocks, in place)
//   - teamMember:  bio             (string -> blocks, in place)
// Dry-run by default; pass --write to apply. Needs SANITY_API_WRITE_TOKEN.

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token })

const DRY = !process.argv.includes('--write')
const generateKey = () => Math.random().toString(36).substring(2, 9)

/** Split a plain string into normal Portable Text blocks (one per non-empty line). */
function stringToBlocks(input: string) {
  return input
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((text) => ({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: generateKey(), text, marks: [] }],
    }))
}

async function migrate() {
  console.log(DRY ? '— DRY RUN (use --write to apply) —\n' : '— WRITING CHANGES —\n')
  let changed = 0

  // News: copy `text` -> new `body` (leave `text` as excerpt). Skip if already migrated.
  const newsDocs = await client.fetch<{ _id: string; title?: string; text?: unknown; body?: unknown }[]>(
    `*[_type == "news"]{ _id, title, text, body }`,
  )
  for (const doc of newsDocs) {
    if (Array.isArray(doc.body)) continue
    if (typeof doc.text !== 'string' || !doc.text.trim()) continue
    const blocks = stringToBlocks(doc.text)
    console.log(`news        ${doc._id} (${doc.title ?? ''}): text -> body, ${blocks.length} block(s)`)
    if (!DRY) await client.patch(doc._id).set({ body: blocks }).commit()
    changed++
  }

  // In-place string -> blocks for body/fullDescription/bio.
  const inPlace = [
    { type: 'event', field: 'body' },
    { type: 'ministry', field: 'fullDescription' },
    { type: 'teamMember', field: 'bio' },
  ] as const
  for (const { type, field } of inPlace) {
    const docs = await client.fetch<{ _id: string; label?: string; val?: unknown }[]>(
      `*[_type == $type]{ _id, "label": coalesce(title, name), "val": ${field} }`,
      { type },
    )
    for (const doc of docs) {
      if (typeof doc.val !== 'string' || !doc.val.trim()) continue // already array / empty
      const blocks = stringToBlocks(doc.val)
      console.log(`${type.padEnd(11)} ${doc._id} (${doc.label ?? ''}): ${field} -> ${blocks.length} block(s)`)
      if (!DRY) await client.patch(doc._id).set({ [field]: blocks }).commit()
      changed++
    }
  }

  console.log(`\n${changed} document(s) ${DRY ? 'would be' : ''} migrated.${DRY ? ' Re-run with --write to apply.' : ' ✅'}`)
}

migrate().catch(console.error)
