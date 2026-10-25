import { createClient, defineQuery } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

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

// Helper to generate random string for keys
const generateKey = () => Math.random().toString(36).substring(2, 9)

async function patchData() {
  console.log('Fetching ministries to patch...')
  
  // Fetch all ministries
  const ministries = await client.fetch<{
    _id: string
    leaderPhoto?: unknown
    gallery?: ({ _key?: string } & Record<string, unknown>)[] | null
  }[]>(defineQuery(`*[_type == "ministry"]{_id, leaderPhoto, gallery}`))
  
  for (const ministry of ministries) {
    let needsPatch = false
    const patchObj: Record<string, unknown> = {}
    const unsetArr: string[] = []

    // Fix 1: Null leaderPhoto
    if (ministry.leaderPhoto === null) {
      console.log(`- Document ${ministry._id} has null leaderPhoto. Unsetting...`)
      unsetArr.push('leaderPhoto')
      needsPatch = true
    }

    // Fix 2: Missing keys in gallery array
    if (ministry.gallery && Array.isArray(ministry.gallery)) {
      const hasMissingKeys = ministry.gallery.some((item) => !item._key)
      
      if (hasMissingKeys) {
        console.log(`- Document ${ministry._id} has gallery items without _key. Fixing...`)
        const fixedGallery = ministry.gallery.map((item) => {
          if (!item._key) {
            return { ...item, _key: generateKey() }
          }
          return item
        })
        patchObj.gallery = fixedGallery
        needsPatch = true
      }
    }

    // Apply patch if needed
    if (needsPatch) {
      const patchCommand = client.patch(ministry._id)
      
      if (Object.keys(patchObj).length > 0) {
        patchCommand.set(patchObj)
      }
      
      if (unsetArr.length > 0) {
        patchCommand.unset(unsetArr)
      }

      await patchCommand.commit()
      console.log(`✅ Patched ${ministry._id}`)
    }
  }

  console.log('Patching completed!')
}

patchData().catch(console.error)
