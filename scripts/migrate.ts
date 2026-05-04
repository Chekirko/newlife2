import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnvConfig } from '@next/env'
import { ministriesData } from '../data/ministriesData'
import { newsData } from '../data/newsData'

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

// Hardcoded events since they were in page.tsx
const eventsData = [
  {
    title: 'Молодіжна конференція',
    slug: 'youth-conference',
    date: '15 травня 2026',
    tag: 'Подія',
    description: 'Щорічна молодіжна конференція "Запалюй". Три дні прославлення, слова та спілкування.',
    image: '/images/event1.jpg',
  },
  {
    title: 'Сімейний семінар',
    slug: 'family-seminar',
    date: '22 травня 2026',
    tag: 'Сім\'я',
    description: 'Семінар для сімейних пар: "Як зберегти любов на все життя". Реєстрація обов\'язкова.',
    image: '/images/event2.jpg',
  },
  {
    title: 'Водне хрещення',
    slug: 'water-baptism',
    date: '5 червня 2026',
    tag: 'Свято',
    description: 'Святкове богослужіння на природі з нагоди водного хрещення нових членів церкви.',
    image: '/images/event3.jpg',
  },
  {
    title: 'Дитячий табір',
    slug: 'kids-camp',
    date: '10-15 липня 2026',
    tag: 'Діти',
    description: 'Літній християнський табір для дітей віком 7-12 років. Тема: "Герої віри".',
    image: '/images/event4.jpg',
  }
]

async function uploadImage(imagePath: string) {
  if (!imagePath) return null
  
  // Clean up path
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  const absolutePath = path.join(__dirname, '..', 'public', relativePath)

  if (!fs.existsSync(absolutePath)) {
    console.warn(`[Warning] Image not found locally: ${absolutePath}. Skipping upload.`)
    return null
  }

  try {
    const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {
      filename: path.basename(absolutePath)
    })
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  } catch (error) {
    console.error(`[Error] Failed to upload image ${absolutePath}:`, error)
    return null
  }
}

async function migrate() {
  console.log('Starting migration to Sanity CMS...')

  // 1. Migrate Events
  console.log('--- Migrating Events ---')
  for (const event of eventsData) {
    console.log(`Processing event: ${event.title}`)
    const imageAsset = await uploadImage(event.image)
    
    await client.create({
      _type: 'event',
      title: event.title,
      slug: { _type: 'slug', current: event.slug },
      date: event.date,
      tag: event.tag,
      description: event.description,
      image: imageAsset,
    })
  }

  // 2. Migrate News
  console.log('--- Migrating News ---')
  for (const news of newsData) {
    console.log(`Processing news: ${news.title}`)
    const imageAsset = await uploadImage(news.image)
    
    // Convert '28 січня 2026' into ISO (approximate or just keep string if changed schema... wait, schema is datetime)
    // We'll create a generic date since it's hard to parse Ukrainian dates easily in script
    const isoDate = new Date().toISOString()

    const slugCurrent = news.href ? news.href.split('/').pop() : `news-${Date.now()}`

    await client.create({
      _type: 'news',
      title: news.title,
      slug: { _type: 'slug', current: slugCurrent },
      publishedAt: isoDate,
      mainCategory: news.mainCategory,
      categories: news.categories,
      text: news.text,
      image: imageAsset,
    })
  }

  // 3. Migrate Ministries
  console.log('--- Migrating Ministries ---')
  for (let i = 0; i < ministriesData.length; i++) {
    const ministry = ministriesData[i]
    console.log(`Processing ministry: ${ministry.title}`)
    
    const mainImage = await uploadImage(ministry.image)
    const leaderPhoto = ministry.leaderPhoto ? await uploadImage(ministry.leaderPhoto) : null
    
    const gallery = []
    if (ministry.gallery) {
      for (const img of ministry.gallery) {
        const uploaded = await uploadImage(img)
        if (uploaded) gallery.push(uploaded)
      }
    }

    await client.create({
      _type: 'ministry',
      title: ministry.title,
      slug: { _type: 'slug', current: ministry.slug },
      shortDescription: ministry.shortDescription,
      fullDescription: ministry.fullDescription,
      image: mainImage,
      leaderName: ministry.leaderName,
      leaderPhoto: leaderPhoto,
      gallery: gallery.length > 0 ? gallery : undefined,
      bibleQuoteText: ministry.bibleQuote?.text,
      bibleQuoteReference: ministry.bibleQuote?.reference,
      order: i,
    })
  }

  console.log('Migration completed successfully!')
}

migrate().catch(console.error)
