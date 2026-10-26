import assert from 'node:assert/strict'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const origin = 'https://seo-fixture.example'
function load(file, mocks = {}) {
  const { outputText } = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, fileName: file,
  })
  const exports = {}
  vm.runInNewContext(outputText, { exports, URLSearchParams, window: { history: { replaceState: () => {} } }, require: (name) => {
    if (name in mocks) return mocks[name]
    if (['react/jsx-runtime', '@portabletext/react'].includes(name)) return require(name)
    throw new Error(`Unexpected import: ${name}`)
  } }, { filename: file })
  return exports
}
const utils = load('lib/utils.ts')
for (const value of [null, undefined, '', 'yesterday', '10/26/2026', '2026-02-30', '2026-10-26T09:00:00']) {
  assert.equal(utils.schemaDate(value), undefined)
}
for (const value of ['2024-02-29', '2026-10-26', '2026-10-26T09:00:00Z', '2026-10-26T09:00:00+02:00']) {
  assert.equal(utils.schemaDate(value), value)
}
const hostile = '</script><script>alert("fixture")</script>&\u2028\u2029'
const serialized = utils.jsonLdHtml({ name: hostile })
assert(!serialized.includes('<'))
assert.equal(JSON.parse(serialized).name, hostile)

const image = { asset: { _ref: 'image-fixture-1200x800-jpg' } }
const imageMocks = {
  urlFor: (value) => {
    assert(value, 'Image builder must never receive null')
    const builder = { width: () => builder, height: () => builder, fit: () => builder, url: () => `${origin}/photo.jpg` }
    return builder
  },
  originalImageUrl: (value) => { assert(value); return `${origin}/original.jpg` },
}
const { createElement } = require('react')
const components = {
  PageHero: ({ title }) => createElement('h1', null, title),
  PhotoViewer: ({ children }) => createElement('div', null, children),
  ImagePlaceholder: () => createElement('div', { 'data-placeholder': true, 'aria-hidden': true }),
  NewsSlider: () => null,
  PortableTextBody: ({ value }) => createElement('p', null, typeof value === 'string' ? value : value ? require('@portabletext/react').toPlainText(value) : ''),
}
let document
const common = {
  '@/components': components,
  'next/image': { default: ({ src, alt }) => createElement('img', { src, alt }) },
  'next/link': { default: ({ href, children }) => createElement('a', { href }, children) },
  'next/navigation': { notFound: () => { throw new Error('notFound') } },
  '@/sanity/lib/image': imageMocks, '@/lib/utils': utils, '@/lib/site': { SITE_URL: origin },
  '@/lib/page-heroes': { getPageHeroes: async () => ({}) },
  '@/lib/site-settings': { getSiteSettings: async () => ({ name: 'Fixture Church' }) },
  '@/lib/metadata': {}, 'next-sanity': { defineQuery: (query) => query },
  '@/sanity/lib/client': { client: { fetch: async (query) => query === 'detail' || query?.includes('_type == "news"') ? document : [] } },
}
const pages = {
  ministry: load('app/(front)/ministries/[slug]/page.tsx', { ...common,
    './queries': { MINISTRY_BY_SLUG_QUERY: 'detail' }, './components/PhotoGalleryGrid': { PhotoGalleryGrid: () => null },
  }).default,
  team: load('app/(front)/team/[slug]/page.tsx', { ...common, './queries': { TEAM_MEMBER_BY_SLUG_QUERY: 'detail' } }).default,
  events: load('app/(front)/events/[slug]/page.tsx', { ...common, '../queries': { EVENT_BY_SLUG_QUERY: 'detail' } }).default,
  news: load('app/(front)/news/[slug]/page.tsx', { ...common, './components/NewsPhotoGallery': { NewsPhotoGallery: () => null } }).default,
}
const blocks = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]))
let cases = 0
const samples = new Map()
async function render(family, data) {
  document = data
  const html = renderToStaticMarkup(await pages[family]({ params: Promise.resolve({ slug: 'route-slug' }) }))
  cases++
  assert(!html.includes('/undefined'))
  for (const block of blocks(html)) if (!samples.has(block['@type'])) samples.set(block['@type'], block)
  return { html, json: blocks(html) }
}
const base = { _id: 'fixture', slug: 'cms-slug', title: 'Fixture', name: 'Fixture Person', image: null, photo: null, gallery: null }
for (const leaders of [null, [], [null], [null, { _id: 'no-slug', name: 'Hidden', slug: null }]]) {
  const { html } = await render('ministry', { ...base, leaders })
  assert(!html.includes('Відповідальн'))
}
for (const leaders of [
  [{ _id: 'one', name: 'One', slug: 'one', photo: null }],
  [null, { _id: 'one', name: 'One', slug: 'one', photo: image }],
  [null, { _id: 'one', name: 'One', slug: 'one', photo: null }, { _id: 'two', name: 'Two', slug: 'two', photo: image }],
]) {
  const { html, json } = await render('ministry', { ...base, leaders })
  assert(html.includes('href="/team/one"'))
  assert.equal(json[0].itemListElement.at(-1).item, `${origin}/ministries/route-slug`)
  if (leaders.length === 3) assert(html.includes('Відповідальні за служіння'))
}
for (const photo of [null, image]) {
  const { html, json: [person] } = await render('team', { ...base, photo, responsibility: ['Visible role'] })
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'Team detail must keep only the PageHero H1')
  assert.equal(person['@id'], `${origin}/team/route-slug#person`)
  assert.equal(person.memberOf.name, 'Fixture Church')
  assert.equal(person.memberOf['@id'], `${origin}/#church`)
  assert.equal(person.jobTitle, 'Fixture, Visible role')
  assert.equal('image' in person, Boolean(photo))
  assert.equal('worksFor' in person, false)
  assert.equal(html.includes('data-placeholder'), !photo)
}
const event = { ...base, type: 'подія', startDate: '2026-10-26T09:00:00Z', location: 'Other venue', description: 'Hidden excerpt', body: 'Visible legacy body' }
const { html: eventHtml, json: [eventJson] } = await render('events', event)
assert.equal(eventJson.location.name, 'Other venue')
assert.equal('address' in eventJson.location, false)
assert.equal('eventStatus' in eventJson, false)
assert.equal('organizer' in eventJson, false)
assert.equal(eventJson.description, 'Visible legacy body')
assert.equal(eventJson.url, `${origin}/events/route-slug`)
assert(eventHtml.includes('Visible legacy body'))
for (const patch of [{ type: 'оголошення' }, { startDate: null }, { startDate: '2026-02-30' }, { location: null }, { title: ' ' }]) {
  const { html, json } = await render('events', { ...event, ...patch })
  assert.equal(json.length, 0)
  assert(!html.includes('NaN'))
}
for (const body of ['Legacy body', [{ _type: 'block', children: [{ _type: 'span', text: 'Rich body', marks: [] }], markDefs: [] }], null]) {
  const { html, json: [article, breadcrumb] } = await render('news', { ...base, body, text: 'Visible fallback', publishedAt: '2026-10-26', _updatedAt: '2026-10-27' })
  assert.equal(article.description, typeof body === 'string' ? body : body ? 'Rich body' : 'Visible fallback')
  assert.equal(article.url, `${origin}/news/route-slug`)
  assert.equal(breadcrumb.itemListElement.at(-1).item, article.url)
  assert.equal('author' in article, false)
  assert.equal('dateModified' in article, false)
  assert.equal(article.datePublished, '2026-10-26')
  assert(html.includes(article.description))
}
for (const publishedAt of [null, 'invalid', '2026-02-30']) {
  const { html, json: [article] } = await render('news', { ...base, publishedAt })
  assert.equal('datePublished' in article, false)
  assert(!html.includes('NaN'))
}
const { html: hostileHtml, json: [hostileArticle] } = await render('news', { ...base, title: hostile, body: hostile })
assert.equal(hostileArticle.headline, hostile)
assert.equal(blocks(hostileHtml).length, 2)
for (const family of Object.keys(pages)) {
  document = null
  await assert.rejects(pages[family]({ params: Promise.resolve({ slug: 'missing' }) }), { message: 'notFound' })
}

const youtube = load('lib/youtube.ts')
const mediaHelpers = load('lib/media.ts', { '@/sanity/lib/image': imageMocks, '@/lib/utils': utils, '@/lib/youtube': youtube })
let hookIndex = 0
let state = []
const transitions = []
let actionCards = []
const gallery = load('app/(front)/media/components/MediaGallery.tsx', {
  react: {
    useState: (initial) => {
      const index = hookIndex++
      if (!(index in state)) state[index] = initial
      return [state[index], (next) => { state[index] = typeof next === 'function' ? next(state[index]) : next }]
    },
    useEffect: () => {}, useTransition: () => [false, (action) => { transitions.push(action()) }],
  },
  clsx: require('clsx'), '@/lib/utils': utils, '@/lib/youtube': youtube,
  './MediaCard': { MediaCard: ({ item }) => createElement('h3', null, item.title) }, './Lightbox': { Lightbox: () => null },
  '../actions': { searchMedia: async () => ({ cards: actionCards, total: actionCards.length + 1 }), loadMoreMedia: async () => actionCards },
}).MediaGallery
let items = [
  { _id: 'video', title: null, youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', image: null, date: '2026-10-26' },
  { _id: 'invalid', title: 'Unplayable', youtubeUrl: 'invalid', image: null },
]
const media = load('app/(front)/media/page.tsx', {
  ...common, react: { cache: (fn) => fn }, '@/lib/youtube': youtube, '@/lib/media': mediaHelpers,
  '@/lib/listing-params': { normalizeListingParams: () => ({ filters: { category: '', speaker: '', q: '' } }) },
  '@/sanity/lib/client': { client: { fetch: async (query) => query === 'items' ? items : query === 'count' ? items.length : [] } },
  './queries': { MEDIA_SEARCH_QUERY: 'items', MEDIA_COUNT_QUERY: 'count', MEDIA_PER_PAGE: 12 },
  '@/lib/live-stream': {}, './components/MediaGallery': { MediaGallery: gallery },
}).default
const mediaHtml = renderToStaticMarkup(await media({ searchParams: Promise.resolve({}) }))
const [list] = blocks(mediaHtml)
samples.set('ItemList', list)
assert.equal(list.itemListElement.length, 1)
const video = list.itemListElement[0].item
assert.equal(video.name, 'Без назви')
assert(mediaHtml.includes(video.name))
assert.equal('uploadDate' in video, false, 'Sermon date is not an upload date')
assert.equal('contentUrl' in video, false, 'YouTube watch page is not a video file')
assert.equal(video.thumbnailUrl, mediaHelpers.toMediaCard(items[0]).thumbnailUrl)
items = []
hookIndex = 0
state = []
assert.equal(blocks(renderToStaticMarkup(await media({ searchParams: Promise.resolve({}) }))).length, 0)

// Exercise the actual filter/load-more handlers and re-render their committed state.
const firstCard = mediaHelpers.toMediaCard({ _id: 'a', title: 'First', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ', image: null })
const nextCard = { ...firstCard, _id: 'b', title: 'Filtered', youtubeId: '72I3t0oqmSY' }
const galleryProps = { initialCards: [firstCard], total: 2, speakers: [], category: '', speaker: '', q: '' }
const renderGallery = () => { hookIndex = 0; return gallery(galleryProps) }
function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined
  if (predicate(node)) return node
  for (const child of [node.props?.children].flat(Infinity)) {
    const found = find(child, predicate)
    if (found) return found
  }
}
state = []
let tree = renderGallery()
assert.equal(blocks(renderToStaticMarkup(tree))[0].itemListElement[0].item.name, 'First')
actionCards = [nextCard]
find(tree, (node) => node.props?.role === 'tab' && node.props.children === 'Проповіді').props.onClick()
await Promise.all(transitions.splice(0))
tree = renderGallery()
assert.equal(blocks(renderToStaticMarkup(tree))[0].itemListElement[0].item.name, 'Filtered')
actionCards = [{ ...nextCard, _id: 'c', title: 'Appended', youtubeId: 'yymhMwMP8rY' }]
find(tree, (node) => node.type === 'button' && !node.props.role).props.onClick()
await Promise.all(transitions.splice(0))
tree = renderGallery()
assert.equal(blocks(renderToStaticMarkup(tree))[0].itemListElement.length, 2)
actionCards = []
find(tree, (node) => node.props?.role === 'tab' && node.props.children === 'Всі').props.onClick()
await Promise.all(transitions.splice(0))
assert.equal(blocks(renderToStaticMarkup(renderGallery())).length, 0)

mkdirSync(new URL('../.next/seo-5/', import.meta.url), { recursive: true })
writeFileSync(new URL('../.next/seo-5/fixture-article.html', import.meta.url), hostileHtml)
writeFileSync(new URL('../.next/seo-5/validator-fixture.html', import.meta.url), utils.jsonLdHtml([...samples.values()]))
console.log(`JSON-LD SEO regressions PASS: ${cases} detail renders, 4 missing docs, 2 media SSR + 4 gallery states, date/escaping checks; no network/CMS writes.`)
