import assert from 'node:assert/strict'
import { isIndexingEnabled, indexingRobots } from '../lib/indexing'
import { pageMetadata } from '../lib/metadata'
import { siteGraph, eventStructuredData, CHURCH_ID } from '../lib/structured-data'
import { CHURCH } from '../lib/church'
import { SITE_URL } from '../lib/site'
import { jsonLdHtml } from '../lib/utils'
import type { SiteSettings } from '../lib/site-settings'
import type { SanityEvent } from '../sanity/lib/types'

const settings: SiteSettings = {
  ...CHURCH, social: [], services: [], openingHours: [], liveStream: null,
  defaultDescription: 'Опис сайту', ogImage: null, sameAs: [],
}
const previous = { switch: process.env.SITE_INDEXING, environment: process.env.VERCEL_ENV }
try {
  for (const [value, environment, enabled] of [
    ['on','production',true], ['off','production',false], ['on','preview',false],
    ['on','development',false], ['true','production',false], ['', 'production',false], ['on','',false],
  ] as const) {
    process.env.SITE_INDEXING = value
    process.env.VERCEL_ENV = environment
    assert.equal(isIndexingEnabled(), enabled)
    assert.equal(indexingRobots().index, enabled)
    assert.equal(indexingRobots(true).index, false)
    const metadata = pageMetadata('/news/new-publication', { title: 'Нова публікація' }, settings)
    assert.deepEqual(metadata.robots, { index: enabled, follow: true })
  }
  process.env.SITE_INDEXING = 'on'
  process.env.VERCEL_ENV = 'production'
  const metadata = pageMetadata('/news/new-publication', {
    title: 'Назва документа', description: 'Опис документа',
    seo: { title: '  SEO <b>назва</b>  ', description: ' SEO\nопис ', noIndex: true },
    article: { publishedTime: '2026-10-28T10:00:00Z', modifiedTime: '2026-10-28T11:00:00Z' },
  }, settings)
  assert.equal(metadata.title, 'SEO назва')
  assert.equal(metadata.description, 'SEO опис')
  assert.deepEqual(metadata.robots, { index: false, follow: true })
  assert.equal(metadata.openGraph?.type, 'article')
  assert.ok(metadata.openGraph && 'modifiedTime' in metadata.openGraph && metadata.openGraph.modifiedTime)
  assert.equal(pageMetadata('/about', { description: '  ', seo: { title: ' ' } }, settings).description, settings.defaultDescription)
  const image = { url: '/images/hero-church-1.jpg', width: 1920, height: 1080, alt: 'Фото' }
  const fallback = pageMetadata('/news/new-publication', { image, seo: { ogImage: { _type: 'image' } } }, settings)
  assert.deepEqual(fallback.openGraph?.images, [{ ...image, url: new URL(image.url, SITE_URL).href }])
  const invalidDate = pageMetadata('/news/new-publication', {
    article: { publishedTime: '2026-10-28T10:00:00Z', modifiedTime: '2026-10-27T10:00:00Z' },
  }, settings)
  assert.ok(invalidDate.openGraph && 'modifiedTime' in invalidDate.openGraph && !invalidDate.openGraph.modifiedTime)
} finally {
  if (previous.switch === undefined) delete process.env.SITE_INDEXING
  else process.env.SITE_INDEXING = previous.switch
  if (previous.environment === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = previous.environment
}

const event: SanityEvent = {
  _id: 'local-fixture', type: 'подія', title: 'Зустріч', slug: 'zustrich',
  startDate: '2026-11-01T09:00:00Z', activeUntil: null, location: 'Зал', tag: null,
  description: null, body: null, image: null,
}
assert.equal(eventStructuredData(event, '/events/zustrich'), null)
event.locationAddress = { street: 'вул. Прикладна, 1', city: 'Борислав', country: 'UA' }
event.endDate = '2026-11-01T11:00:00Z'
event.organizer = 'Організатор'
event.isAccessibleForFree = false
const schema = eventStructuredData(event, '/events/zustrich')!
assert.equal(schema.location.address.streetAddress, event.locationAddress.street)
assert.equal(schema.endDate, event.endDate)
assert.equal(schema.isAccessibleForFree, false)
assert.equal(schema.organizer?.name, event.organizer)
assert.equal(schema.eventStatus, 'https://schema.org/EventScheduled')
assert.equal(eventStructuredData({ ...event, endDate: '2026-10-01T11:00:00Z' }, '/events/zustrich')?.endDate, undefined)
assert.equal(eventStructuredData({ ...event, type: 'оголошення' }, '/events/zustrich'), null)
assert.equal(eventStructuredData({ ...event, startDate: 'invalid' }, '/events/zustrich'), null)
const graph = siteGraph(settings)['@graph']
assert.equal(graph.filter(node => node['@id'] === CHURCH_ID).length, 1)
assert.ok(!jsonLdHtml({ text: '</script><script>alert(1)</script>' }).includes('<'))
console.log('SEO: launch/Preview matrix, document overrides, metadata fallbacks, dates and honest Event data PASS')
