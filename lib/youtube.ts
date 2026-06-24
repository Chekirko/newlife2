// =========================================
// YouTube helpers — extract the video id from any common YouTube URL shape and
// build the thumbnail / privacy-friendly embed URLs from it. Pure functions,
// reused by the media cards, lightbox player and VideoObject JSON-LD.
// =========================================

/**
 * Pull the 11-char video id from a YouTube URL.
 * Handles: watch?v=ID, youtu.be/ID, /embed/ID, /live/ID, /shorts/ID.
 * Returns null when nothing matches (caller must null-guard).
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const patterns = [
    /[?&]v=([\w-]{11})/, // watch?v=ID
    /youtu\.be\/([\w-]{11})/, // youtu.be/ID
    /\/embed\/([\w-]{11})/, // /embed/ID
    /\/live\/([\w-]{11})/, // /live/ID
    /\/shorts\/([\w-]{11})/, // /shorts/ID
  ]
  for (const re of patterns) {
    const match = url.match(re)
    if (match) return match[1]
  }
  return null
}

/** YouTube-hosted thumbnail for a video id.
 *  - `max` → maxresdefault (1280×720, true 16:9) — sharpest, but may 404.
 *  - `sd`  → sddefault (640×480) — always exists; a 4:3 frame whose letterbox
 *            bars get cropped away by `object-cover` in a 16:9 box, so it stays
 *            sharp. Use as the maxres fallback (much crisper than mqdefault).
 *  - `mq`  → mqdefault (320×180, true 16:9) — always exists, low-res. */
export function getYouTubeThumbnail(id: string, quality: 'mq' | 'sd' | 'max' = 'mq'): string {
  const file =
    quality === 'max' ? 'maxresdefault' : quality === 'sd' ? 'sddefault' : 'mqdefault'
  return `https://img.youtube.com/vi/${id}/${file}.jpg`
}

/** Privacy-friendly embed URL (youtube-nocookie). Pass autoplay for the lightbox. */
export function getYouTubeEmbedUrl(id: string, autoplay = false): string {
  const params = new URLSearchParams({ rel: '0' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
