import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

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

// Demo media items to preview the /media page UI. YouTube ids are public
// placeholder videos — replace or delete in /studio after reviewing.
// Fixed _id (media-demo-*) → re-running overwrites, easy to remove later.
// NOTE: ids must NOT contain a dot — Sanity's perspective system treats a
// dotted prefix as a non-published bucket and hides such docs from public reads.
const SPEAKER_A = 'Михайло Дренюк'
const SPEAKER_B = 'Юрій Мартекляс'

const DEMO_ITEMS = [
  {
    id: 'media-demo-1',
    title: 'Недільне богослужіння — пряма трансляція',
    category: 'трансляція',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    date: '2026-06-21T08:00:00.000Z',
    description: 'Запис недільного богослужіння нашої церкви.',
  },
  {
    id: 'media-demo-2',
    title: 'Сила прощення',
    category: 'проповідь',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    date: '2026-06-14T08:00:00.000Z',
    scripture: 'Матвія 6:14',
    speaker: SPEAKER_A,
    description: 'Проповідь про прощення як шлях до внутрішньої свободи.',
  },
  {
    id: 'media-demo-3',
    title: 'Велич Твоя — поклоніння',
    category: 'пісня',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    date: '2026-06-07T08:00:00.000Z',
    description: 'Спільне поклоніння нашої музичної команди.',
  },
  {
    id: 'media-demo-4',
    title: 'Свідчення: нове життя',
    category: 'різне',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    date: '2026-05-31T08:00:00.000Z',
    description: 'Історія людини, яка знайшла надію у вірі.',
  },
  {
    id: 'media-demo-5',
    title: 'Надія, що не підводить',
    category: 'проповідь',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    date: '2026-05-24T08:00:00.000Z',
    scripture: 'Римлян 5:5',
    speaker: SPEAKER_B,
    description: 'Про джерело справжньої надії в житті віруючого.',
  },
  {
    id: 'media-demo-6',
    title: 'Жити вірою щодня',
    category: 'проповідь',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    date: '2026-05-17T08:00:00.000Z',
    scripture: 'Євреїв 11:1',
    speaker: SPEAKER_A,
    description: 'Як довіряти Богу в буденних рішеннях.',
  },
  {
    id: 'media-demo-7',
    title: 'Свято подяки — прославлення',
    category: 'пісня',
    youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    date: '2026-05-10T08:00:00.000Z',
    description: 'Пісні подяки на спільному служінні.',
  },
  {
    id: 'media-demo-8',
    title: 'Молитовне служіння — трансляція',
    category: 'трансляція',
    youtubeUrl: 'https://www.youtube.com/watch?v=e-ORhEE9VVg',
    date: '2026-05-03T08:00:00.000Z',
    description: 'Запис вечірнього молитовного служіння.',
  },
  {
    id: 'media-demo-9',
    title: 'Любов, що змінює',
    category: 'проповідь',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    date: '2026-04-26T08:00:00.000Z',
    scripture: '1 Івана 4:7',
    speaker: SPEAKER_B,
    description: 'Про практичну любов у спільноті.',
  },
  {
    id: 'media-demo-10',
    title: 'Дитяче служіння: свято',
    category: 'різне',
    youtubeUrl: 'https://www.youtube.com/watch?v=CevxZvSJLk8',
    date: '2026-04-19T08:00:00.000Z',
    description: 'Яскраві моменти дитячого свята.',
  },
  {
    id: 'media-demo-11',
    title: 'Ти вірний — поклоніння',
    category: 'пісня',
    youtubeUrl: 'https://www.youtube.com/watch?v=hY7m5jjJ9mM',
    date: '2026-04-12T08:00:00.000Z',
    description: 'Поклоніння у виконанні молодіжного гурту.',
  },
  {
    id: 'media-demo-12',
    title: 'Покликані служити',
    category: 'проповідь',
    youtubeUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    date: '2026-04-05T08:00:00.000Z',
    scripture: 'Ефесян 2:10',
    speaker: SPEAKER_A,
    description: 'Про дари та служіння в Тілі Христовому.',
  },
]

const docs = DEMO_ITEMS.map((d) => ({
  _id: d.id,
  _type: 'mediaItem',
  title: d.title,
  category: d.category,
  youtubeUrl: d.youtubeUrl,
  date: d.date,
  ...(d.scripture ? { scripture: d.scripture } : {}),
  ...(d.speaker ? { speaker: d.speaker } : {}),
  description: d.description,
}))

async function runSeed() {
  const isDryRun = !process.argv.includes('--write')

  console.log(
    `Seeding ${docs.length} mediaItem docs. Mode: ${isDryRun ? 'DRY-RUN (no changes written)' : 'LIVE-WRITE'}`,
  )

  if (isDryRun) {
    console.log('To create the demo media items, run with the --write flag.')
    console.log(JSON.stringify(docs, null, 2))
    return
  }

  try {
    const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
    await tx.commit()
    console.log(`✓ ${docs.length} mediaItem docs created`)
  } catch (err) {
    console.error('Error creating media docs:', err)
    process.exit(1)
  }
}

runSeed().catch(console.error)
