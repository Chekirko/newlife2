import { defineQuery } from 'next-sanity'

// How many cards per batch (first server render + each "Load More").
export const MEDIA_PER_PAGE = 12

// ============================================
// MEDIA LIBRARY QUERIES — server-side search / filter / pagination.
// The page reads `category`, `speaker`, `q` from searchParams and the list is
// fetched a batch at a time (slice [$start...$end]); "Load More" pulls the next
// batch via the loadMoreMedia server action. `$q` is a tokenized prefix string
// (e.g. "love* grace*") so `match` does partial matching across the text fields.
// Empty filter params default to '' (matched by the select(... , true) branch).
// ============================================

const MEDIA_FILTER = /* groq */ `_type == "mediaItem"
  && select(defined($category) && $category != "" => category == $category, true)
  && select(defined($speaker) && $speaker != "" => speaker == $speaker, true)
  && select($q != "" => (
       title match $q || description match $q || speaker match $q ||
       scripture match $q || count(tags[@ match $q]) > 0
     ), true)`

export const MEDIA_SEARCH_QUERY = defineQuery(`
  *[${MEDIA_FILTER}] | order(date desc)[$start...$end] {
    _id,
    title,
    category,
    youtubeUrl,
    scripture,
    description,
    date,
    image,
    speaker,
    tags
  }
`)

export const MEDIA_COUNT_QUERY = defineQuery(`count(*[${MEDIA_FILTER}])`)

export const MEDIA_SPEAKERS_QUERY = defineQuery(`
  array::unique(*[_type == "mediaItem" && category == "проповідь" && defined(speaker)].speaker)
`)

// Newest sermon — homepage "Latest sermon" section (B2 Stage 3).
// Projects the same fields as MEDIA_SEARCH_QUERY so toMediaCard() can transform it.
export const LATEST_SERMON_QUERY = defineQuery(`
  *[_type == "mediaItem" && category == "проповідь"] | order(date desc)[0] {
    _id,
    title,
    category,
    youtubeUrl,
    scripture,
    description,
    date,
    image,
    speaker,
    tags
  }
`)
