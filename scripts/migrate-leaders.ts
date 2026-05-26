import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, or NEXT_PUBLIC_SANITY_DATASET")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function runMigration() {
  const isDryRun = process.argv.includes('--write') ? false : true

  console.log(`Starting migration. Mode: ${isDryRun ? 'DRY-RUN (no changes will be written)' : 'LIVE-WRITE'}`)
  if (isDryRun) {
    console.log('To write changes to Sanity, run this script with --write flag.')
  }

  // 1. Fetch team members
  console.log('Fetching team members...')
  const teamMembers = await client.fetch<{ _id: string; name: string }[]>(`
    *[_type == "teamMember"] { _id, name }
  `)
  console.log(`Found ${teamMembers.length} team members:`, teamMembers.map(t => t.name))

  if (teamMembers.length === 0) {
    console.error('No team members found in dataset. Please add team members first before migrating.')
    process.exit(1)
  }

  // 2. Fetch ministries
  console.log('Fetching ministries...')
  const ministries = await client.fetch<{ _id: string; title: string; leaderName?: string }[]>(`
    *[_type == "ministry"] { _id, title, leaderName }
  `)
  console.log(`Found ${ministries.length} ministries.`)

  // 3. Perform round-robin assignment
  for (let i = 0; i < ministries.length; i++) {
    const ministry = ministries[i]
    const assignedTeamMember = teamMembers[i % teamMembers.length]
    console.log(`Ministry "${ministry.title}" (current leader inline: "${ministry.leaderName || 'None'}"):`)
    console.log(` -> Assigning new leader: "${assignedTeamMember.name}" (${assignedTeamMember._id})`)

    if (!isDryRun) {
      try {
        await client
          .patch(ministry._id)
          .set({
            leader: {
              _type: 'reference',
              _ref: assignedTeamMember._id,
            },
          })
          .unset(['leaderName', 'leaderPhoto'])
          .commit()
        console.log('    ✓ Patched successfully')
      } catch (err) {
        console.error(`    %cError patching ministry ${ministry._id}:`, err)
      }
    }
  }

  console.log('Migration step completed.')
}

runMigration().catch(console.error)
