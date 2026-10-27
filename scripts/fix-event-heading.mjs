import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createClient, defineQuery } from 'next-sanity'

// Sanity request errors may contain credentials; never print the raw error.
process.on('uncaughtException', error => {
  console.error('Sanity operation failed:', error.code ?? error.statusCode ?? 'unknown error')
  process.exit(1)
})

// SEO-6: one known published content correction. Dry-run unless --write is given.
const id = 'aad8ef7c-c264-403f-bbdd-4fae4b2f19ee'
const key = 'a1709dcd9a33'
const query = defineQuery('*[_id in [$id, $draftId]]')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-02',
  useCdn: false,
  perspective: 'raw',
  token: process.env.SANITY_API_WRITE_TOKEN,
})
const docs = await client.fetch(query, { id, draftId: `drafts.${id}` })
assert(!docs.some(doc => doc._id.startsWith('drafts.')), 'Review pending draft before changing published content')
const doc = docs.find(doc => doc._id === id)
assert(doc?._type === 'event' && doc.slug?.current === 'den-batka-2026', 'Unexpected document')
const block = doc.body?.find(item => item._key === key)
assert(block?._type === 'block' && !block.listItem, 'Unexpected block')
assert.equal(block.children.map(span => span.text ?? '').join(''), 'Запрошуємо на День батька!')
assert(['h4', 'h2'].includes(block.style), 'Unexpected heading rank')
if (block.style === 'h2') {
  console.log('PASS: target already uses H2; no write')
} else {
  console.log(`SEO-6: ${id}, body[_key=="${key}"].style: h4 -> h2`)
  if (process.argv.includes('--write')) {
    assert(process.env.SANITY_API_WRITE_TOKEN, 'SANITY_API_WRITE_TOKEN is required for --write')
    const directory = 'node_modules/.cache/seo-6-final'
    mkdirSync(directory, { recursive: true })
    writeFileSync(`${directory}/event-before.json`, JSON.stringify(doc, null, 2))
    const result = await client.patch(id).ifRevisionId(doc._rev)
      .set({ [`body[_key=="${key}"].style`]: 'h2' }).commit()
    const expected = structuredClone(doc)
    expected.body.find(item => item._key === key).style = 'h2'
    for (const field of ['_rev', '_updatedAt']) {
      delete expected[field]
      delete result[field]
    }
    assert.deepEqual(result, expected, 'Fields other than the target style changed')
    writeFileSync(`${directory}/event-after.json`, JSON.stringify(result, null, 2))
    console.log('PASS: revision-guarded write; only target style changed; local backup saved')
  } else {
    console.log('DRY-RUN: no data changed; use --write to apply')
  }
}
