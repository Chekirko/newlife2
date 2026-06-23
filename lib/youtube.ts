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

/** YouTube-hosted thumbnail for a video id. `mqdefault` is a true 16:9 frame
 *  (no letterbox bars), so cards stay visually uniform; always available. */
export function getYouTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

/** Privacy-friendly embed URL (youtube-nocookie). Pass autoplay for the lightbox. */
export function getYouTubeEmbedUrl(id: string, autoplay = false): string {
  const params = new URLSearchParams({ rel: '0' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
