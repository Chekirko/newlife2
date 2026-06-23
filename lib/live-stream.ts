// =========================================
// getLiveVideoId — check whether a YouTube channel is live right now via the
// YouTube Data API (search.list with eventType=live). Returns the live video id
// or null. Server-only (uses YOUTUBE_API_KEY, never exposed to the client).
//
// Quota note: search.list costs 100 units; the free tier is 10k/day. The fetch
// is cached for 15 min (revalidate: 900) and deduped by Next across requests, so
// it runs ~96×/day (~9.6k units) at most regardless of traffic.
// =========================================

interface YouTubeSearchResponse {
  items?: { id?: { videoId?: string } }[]
}

export async function getLiveVideoId(channelId: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey || !channelId) return null

  const url =
    `https://www.googleapis.com/youtube/v3/search?part=id` +
    `&channelId=${encodeURIComponent(channelId)}` +
    `&eventType=live&type=video&maxResults=1&key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) return null
    const data: YouTubeSearchResponse = await res.json()
    return data.items?.[0]?.id?.videoId ?? null
  } catch {
    return null
  }
}
