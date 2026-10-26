import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const origin = 'https://seo-fixture.example'
const navigation = {
  redirect: (path) => { throw new Error(`redirect:${path}`) },
  notFound: () => { throw new Error('notFound') },
}

// Execute the actual helpers/pages with synthetic CMS data; no network or CMS writes.
function load(file, mocks = {}, transform = (source) => source) {
  const source = transform(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports, URLSearchParams, process: { env: { VERCEL_ENV: 'production' } },
    require: (name) => {
      if (name in mocks) return mocks[name]
      if (name === 'react/jsx-runtime') return require(name)
      throw new Error(`Unexpected import: ${name}`)
    },
  }, { filename: file })
  return exports
}

const params = load('lib/listing-params.ts', { 'next/navigation': navigation })
for (const route of ['/news', '/events']) {
  assert.equal(params.normalizeListingParams(route, {}).canonical, route)
  for (const page of ['abc', '', '0', '-1', '1.5', '2abc', 'Infinity', '1e2', ' 2 ', '9007199254740991', ['2', '3'], '1']) {
    assert.throws(() => params.normalizeListingParams(route, { page }), { message: `redirect:${route}` })
  }
  assert.throws(() => params.normalizeListingParams(route, { page: '002' }), { message: `redirect:${route}?page=2` })
  assert.equal(params.normalizeListingParams(route, { page: '2', utm_source: 'test' }).canonical, `${route}?page=2`)
}
assert.throws(() => params.normalizeListingParams('/news', { page: 'abc', category: 'Події & свята' }), {
  message: `redirect:/news?${new URLSearchParams({ category: 'Події & свята' })}`,
})
assert.throws(() => params.normalizeListingParams('/news', { category: ['a', 'b'] }), { message: 'redirect:/news' })
assert.equal(params.normalizeListingParams('/news', { page: '2', category: 'test' }).canonical, '/news')
for (const key of ['category', 'speaker', 'q']) {
  assert.equal(params.normalizeListingParams('/media', { [key]: 'test' }).filtered, true)
  assert.throws(() => params.normalizeListingParams('/media', { [key]: ['a', 'b'] }), { message: 'redirect:/media' })
  assert.throws(() => params.normalizeListingParams('/media', { [key]: '' }), { message: 'redirect:/media' })
}
assert.throws(() => params.normalizeListingParams('/media', { q: ' test ' }), { message: 'redirect:/media?q=test' })
assert.throws(() => params.normalizeListingParams('/media', { page: '2', q: 'test' }), { message: 'redirect:/media?q=test' })

const approval = { launch: { origin, approvedAt: '2026-10-26' }, pages: [] }
const readiness = load('lib/seo-readiness.ts', { '@/lib/site': { SITE_URL: origin } }, (source) =>
  source.replace('= { launch: null, pages: [] }', `= ${JSON.stringify(approval)}`) + '\nexport { SEO_APPROVAL }',
)
const defaults = load('lib/seo-readiness.ts', { '@/lib/site': { SITE_URL: origin } })
assert.equal(defaults.isListingIndexable('/news?page=2', [{ _id: 'n7', slug: 'n7' }]), false)
const metadata = load('lib/metadata.ts', {
  '@/lib/site': { SITE_URL: origin }, '@/lib/seo-readiness': readiness,
  '@/lib/site-settings': { getSiteSettings: async () => ({ name: 'Fixture', city: 'Fixture' }) },
})
const sitemapData = { news: [], events: [], ministries: [], team: [], hasMedia: false }
const sitemap = load('app/sitemap.ts', {
  'next-sanity': { defineQuery: (query) => query },
  '@/lib/site': { SITE_URL: origin }, '@/lib/seo-readiness': readiness,
  '@/lib/listing-params': params,
  '@/sanity/lib/client': { client: { fetch: async (_query, _params, options) => {
    assert.equal(options.perspective, 'published')
    return sitemapData
  } } },
}).default

for (const route of ['/news', '/events']) {
  const family = route.slice(1)
  const news = family === 'news'
  const items = Array.from({ length: 7 }, (_, i) => ({
    _id: `${family}${i + 1}`, slug: `item-${i + 1}`, title: 'Fixture',
    publishedAt: '2026-10-26', startDate: '2026-10-26', image: null,
  }))
  readiness.SEO_APPROVAL.pages = [
    { path: route, approvedAt: '2026-10-26' },
    ...items.map((item) => ({ path: `${route}/${item.slug}`, documentId: item._id, approvedAt: '2026-10-26' })),
  ]
  let total = 7
  let emptySlice = false
  const slices = []
  const mocks = {
    '@/lib/listing-params': params, '@/lib/metadata': metadata,
    'next/navigation': navigation, react: { cache: (fn) => fn },
    '@/components': { PageHero: () => null }, 'next/link': { default: 'a' }, '@/sanity/lib/image': {},
    '@/lib/page-heroes': { getPageHeroes: async () => ({}) },
    '@/lib/utils': { formatDate: () => '', formatEventDate: () => '' },
    '@/sanity/lib/client': { client: { fetch: async (query, args) => {
      if (query === 'count') return total
      if (query === 'items') {
        assert(Number.isSafeInteger(args.start) && Number.isSafeInteger(args.end))
        slices.push(args)
        return emptySlice ? [] : items.slice(args.start, args.end)
      }
      return []
    } } },
    './queries': Object.fromEntries([
      [`${news ? 'NEWS' : 'EVENTS'}_COUNT_QUERY`, 'count'],
      [`${news ? 'NEWS' : 'EVENTS'}_PAGINATED_QUERY`, 'items'],
    ]),
  }
  for (const name of news ? ['NewsCard', 'NewsPagination', 'SidebarRecentPosts', 'SidebarCategories'] : ['EventCard', 'EventsPagination', 'SidebarRecentEvents']) {
    mocks[`./components/${name}`] = name.endsWith('Pagination')
      ? load(`app/(front)/${family}/components/${name}.tsx`, { 'next/link': { default: 'a' } })
      : { [name]: name.endsWith('Card') ? ({ slug }) => `fixture-card:${slug}` : () => null }
  }
  const page = load(`app/(front)/${family}/page.tsx`, mocks)
  const props = (query) => ({ searchParams: Promise.resolve(query) })
  const second = await page.generateMetadata(props({ page: '2' }))
  assert.equal(second.alternates.canonical, `${route}?page=2`)
  assert.equal(second.openGraph.url, `${origin}${route}?page=2`)
  assert.equal(second.robots.index, true)
  assert.equal(slices.at(-1).start, 6)
  assert.equal('listingItems' in second, false)
  const rendered = renderToStaticMarkup(await page.default(props({ page: '2' })))
  assert.match(rendered, /fixture-card:item-7/)
  assert.doesNotMatch(rendered, /fixture-card:item-1/)
  assert(rendered.includes(`href="${route}"`), 'Pagination must link back to normalized page one')
  assert.equal(readiness.isPageIndexable(`${route}?page=2`), false, 'Query must remain excluded from sitemap')
  readiness.SEO_APPROVAL.pages.pop()
  assert.equal((await page.generateMetadata(props({ page: '2' }))).robots.index, false)
  assert.equal((await page.generateMetadata(props({}))).robots.index, true, 'Approval concerns the visible portion')
  sitemapData[family] = items
  assert((await sitemap()).some((entry) => entry.url === origin + route), `${route}: ${JSON.stringify(await sitemap())}`)
  const approvedFirst = readiness.SEO_APPROVAL.pages.splice(1, 1)[0]
  assert.equal((await page.generateMetadata(props({}))).robots.index, false)
  assert(!(await sitemap()).some((entry) => entry.url === origin + route), 'Sitemap and metadata share visible-portion approval')
  readiness.SEO_APPROVAL.pages.push(approvedFirst)
  const originalSlug = items[0].slug
  items[0].slug = null
  assert.equal((await page.generateMetadata(props({}))).robots.index, false)
  assert(!(await sitemap()).some((entry) => entry.url === origin + route), 'Missing slugs must not be hidden before listing approval')
  items[0].slug = originalSlug
  const approvedList = readiness.SEO_APPROVAL.pages.shift()
  assert.equal((await page.generateMetadata(props({}))).robots.index, false)
  assert(!(await sitemap()).some((entry) => entry.url === origin + route), 'Approved documents need an approved list')
  readiness.SEO_APPROVAL.pages.unshift(approvedList)
  if (!news) {
    sitemapData.events = [{ _id: 'no-date', slug: 'no-date', startDate: null }, ...items]
    assert((await sitemap()).some((entry) => entry.url === origin + route), 'Sitemap mirrors the listing startDate condition')
  }
  if (news) {
    const filtered = await page.generateMetadata(props({ page: '2', category: 'test' }))
    assert.equal(filtered.alternates.canonical, route)
    assert.equal(filtered.robots.index, false)
  }
  for (const invalid of ['abc', ['2', '3']]) {
    for (const render of [page.generateMetadata, page.default]) {
      await assert.rejects(render(props({ page: invalid })), { message: `redirect:${route}` })
    }
  }
  for (const render of [page.generateMetadata, page.default]) {
    const previousSlices = slices.length
    await assert.rejects(render(props({ page: '3' })), { message: 'notFound' })
    assert.equal(slices.length, previousSlices, 'Out-of-range must not query an arbitrary slice')
    await assert.rejects(render(props({ page: '1501199875790165' })), { message: 'notFound' })
  }
  emptySlice = true
  await assert.rejects(page.generateMetadata(props({ page: '2' })), { message: 'notFound' })
  total = 0
  sitemapData[family] = []
  assert.equal((await page.generateMetadata(props({}))).robots.index, false)
  assert(!(await sitemap()).some((entry) => entry.url === origin + route))
  assert(await page.default(props({})), 'Empty base list remains renderable')
  for (const path of [`${route}?page=1`, `${route}?page=02`, `${route}?page=2&category=x`, `${route}?page=Infinity`]) {
    assert.equal(readiness.isListingIndexable(path, items), false)
  }
  assert.equal(readiness.isListingIndexable(route, [{ _id: 'drafts.test', slug: 'test' }]), false)
  assert.equal(readiness.isListingIndexable(route, [{ _id: 'test', slug: null }]), false)
}

readiness.SEO_APPROVAL.pages = [{ path: '/media', approvedAt: '2026-10-26' }]
let mediaItems = [{ _id: 'm1' }]
const media = load('app/(front)/media/page.tsx', {
  '@/lib/listing-params': params, '@/lib/metadata': metadata,
  react: { cache: (fn) => fn }, '@/components': {}, '@/sanity/lib/image': {},
  '@/lib/page-heroes': {}, '@/lib/site-settings': {}, '@/lib/utils': {},
  '@/lib/youtube': {}, '@/lib/media': { toMatchQuery: (q) => q },
  '@/lib/live-stream': {}, './components/MediaGallery': {},
  './queries': { MEDIA_SEARCH_QUERY: 'items', MEDIA_COUNT_QUERY: 'count', MEDIA_PER_PAGE: 12 },
  '@/sanity/lib/client': { client: { fetch: async (query) => query === 'items' ? mediaItems : mediaItems.length } },
})
const mediaMeta = (query) => media.generateMetadata({ searchParams: Promise.resolve(query) })
assert.equal((await mediaMeta({})).robots.index, true)
sitemapData.hasMedia = true
assert((await sitemap()).some((entry) => entry.url === origin + '/media'))
for (const key of ['category', 'speaker', 'q']) {
  const result = await mediaMeta({ [key]: 'test' })
  assert.equal(result.robots.index, false)
  assert.equal(result.alternates.canonical, '/media')
}
mediaItems = []
sitemapData.hasMedia = false
assert.equal((await mediaMeta({})).robots.index, false)
assert(!(await sitemap()).some((entry) => entry.url === origin + '/media'))
console.log('Listing SEO regressions PASS: normalization, real metadata/pages, approval, empty/out-of-range; no network/CMS writes.')
