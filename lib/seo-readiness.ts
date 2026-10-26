import { SITE_URL } from '@/lib/site'

export const STATIC_SEO_ROUTES = ['/', '/about', '/history', '/team', '/ministries', '/news', '/events', '/media', '/media/photos', '/contact'] as const

type PageApproval = {
  path: string
  approvedAt: string
  documentId?: string
}

// Only an explicit SEO-L decision may populate this register. Published content
// and successful builds are not editorial or launch approval.
const SEO_APPROVAL: {
  launch: { origin: string; approvedAt: string } | null
  pages: readonly PageApproval[]
} = { launch: null, pages: [] }

/** Shared by metadata and sitemap; unknown, service and query URLs fail closed. */
export function isPageIndexable(path: string, documentId?: string): boolean {
  const { launch, pages } = SEO_APPROVAL
  if (!launch || !launch.approvedAt || launch.origin !== SITE_URL || process.env.VERCEL_ENV !== 'production') return false

  const isStatic = STATIC_SEO_ROUTES.some((route) => route === path)
  if (isStatic ? documentId !== undefined : (
    !/^\/(news|events|ministries|team)\/[\p{L}\p{N}._~-]+$/u.test(path) ||
    !documentId || /^(drafts|versions)\./.test(documentId) || /\/(\.|\.\.)$/.test(path)
  )) return false

  return pages.some((page) => page.path === path && page.documentId === documentId && !!page.approvedAt)
}
