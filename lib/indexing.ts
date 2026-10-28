/** Search launch requires both an explicit switch and a Production deployment. */
export function isIndexingEnabled(): boolean {
  return process.env.SITE_INDEXING === 'on' && process.env.VERCEL_ENV === 'production'
}

export function indexingRobots(noIndex = false) {
  return { index: isIndexingEnabled() && !noIndex, follow: true }
}
