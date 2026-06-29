import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

type LeaderRef = { _ref: string; _type: string; _weak?: boolean; _key?: string }

/**
 * Reshapes two fields for the "multiple responsibles" feature:
 *   1. ministry.leader (single reference)  -> ministry.leaders (array of weak refs)
 *   2. teamMember.responsibility (string)  -> teamMember.responsibility (string[])
 * Idempotent: documents already migrated are skipped.
 */
async function runMigration() {
  const isDryRun = !process.argv.includes('--write')

  console.log(`Starting migration. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`)
  if (isDryRun) console.log('To write changes to Sanity, run this script with --write flag.\n')

  // 1. Ministries: leader (single ref) -> leaders (array)
  const ministries = await client.fetch<{ _id: string; title: string; leader?: LeaderRef }[]>(`
    *[_type == "ministry" && defined(leader)] { _id, title, leader }
  `)
  console.log(`Ministries with a legacy "leader" field: ${ministries.length}`)

  for (const m of ministries) {
    if (!m.leader?._ref) {
      console.log(`  - "${m.title}": leader present but no _ref — skipping`)
      continue
    }
    console.log(`  - "${m.title}": leader ${m.leader._ref} -> leaders[1]`)
    if (!isDryRun) {
      await client
        .patch(m._id)
        .set({
          leaders: [
            { _type: 'reference', _ref: m.leader._ref, _weak: true, _key: m.leader._ref },
          ],
        })
        .unset(['leader'])
        .commit()
      console.log('      ✓ patched')
    }
  }

  // 2. Team members: responsibility (string) -> responsibility (string[])
  const members = await client.fetch<{ _id: string; name: string; responsibility?: unknown }[]>(`
    *[_type == "teamMember" && defined(responsibility)] { _id, name, responsibility }
  `)
  // Keep only docs still holding a plain string (already-array values are skipped).
  const stringMembers = members.filter((mem) => typeof mem.responsibility === 'string' && mem.responsibility.trim() !== '')
  console.log(`\nTeam members with a legacy string "responsibility": ${stringMembers.length}`)

  for (const mem of stringMembers) {
    const value = mem.responsibility as string
    console.log(`  - "${mem.name}": "${value}" -> ["${value}"]`)
    if (!isDryRun) {
      await client.patch(mem._id).set({ responsibility: [value] }).commit()
      console.log('      ✓ patched')
    }
  }

  console.log('\nMigration completed.')
}

runMigration().catch(console.error)
