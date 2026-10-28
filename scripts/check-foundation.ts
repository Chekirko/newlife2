import assert from 'node:assert/strict'
import { formatDate, formatEventDate, startOfKyivDay } from '../lib/utils'
import { sanityImageLoader } from '../lib/sanity-image-loader'
import { getYouTubeThumbnail } from '../lib/youtube'
import { listingHref, parseListingPage } from '../lib/listing-params'

assert.equal(formatDate('2026-01-10T22:30:00Z'), '11 січня 2026')
assert.equal(formatEventDate('2026-07-10T15:00:00Z'), '10 липня 2026, 18:00')
assert.equal(formatEventDate('2026-01-10T15:00:00Z'), '10 січня 2026, 17:00')
for (const [instant, midnight] of [
  ['2026-01-10T22:30:00Z', '2026-01-10T22:00:00.000Z'],
  ['2026-07-10T21:30:00Z', '2026-07-10T21:00:00.000Z'],
  ['2026-03-29T12:00:00Z', '2026-03-28T22:00:00.000Z'],
  ['2026-10-25T12:00:00Z', '2026-10-24T21:00:00.000Z'],
]) assert.equal(startOfKyivDay(new Date(instant)), midnight)

const src = 'https://cdn.sanity.io/images/project/production/photo-2400x1600.jpg?w=1200&h=800&q=100'
const preview = new URL(sanityImageLoader({ src, width: 600 }))
assert.equal(preview.searchParams.get('w'), '600')
assert.equal(preview.searchParams.get('h'), '400')
assert.equal(preview.searchParams.get('q'), '75')
assert.equal(preview.searchParams.get('auto'), 'format')
assert.equal(new URL(sanityImageLoader({ src: src.split('?')[0], width: 400 })).searchParams.has('h'), false)
assert.ok(getYouTubeThumbnail('abcdefghijk').endsWith('/hqdefault.jpg'))
console.log('Foundation: Kyiv dates/DST, responsive image sizing and standard YouTube thumbnail PASS')

assert.equal(listingHref('/news'), '/news')
assert.equal(listingHref('/events', 3), '/events/page/3')
assert.equal(listingHref('/news', 2, 'Події & свята'), `/news/category/${encodeURIComponent('Події & свята')}/page/2`)
assert.equal(parseListingPage('2', '/news'), 2)
for (const raw of ['0', '-1', 'abc', '1.5', '999999999999999999999']) {
  assert.throws(() => parseListingPage(raw, '/news'), { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
}
assert.throws(() => parseListingPage('1', '/events'), { digest: 'NEXT_REDIRECT;replace;/events;308;' })
assert.throws(() => parseListingPage('002', '/news'), { digest: 'NEXT_REDIRECT;replace;/news/page/2;308;' })
console.log('Path pagination: canonical URLs, category encoding, redirects and invalid bounds PASS')
