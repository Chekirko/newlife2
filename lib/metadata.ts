import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { isPageIndexable } from '@/lib/seo-readiness'

type PageMetadata = Pick<Metadata, 'alternates' | 'robots'> & {
  title?: string
  description?: string
  documentId?: string
  image?: { url: string; width: number; height: number; alt: string }
}

function plainText(value?: string | null): string {
  return value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? ''
}

/** Complete social objects: Next.js replaces nested metadata rather than merging it. */
export async function getPageMetadata(path: string, page: PageMetadata = {}): Promise<Metadata> {
  const { image: pageImage, documentId, ...metadata } = page
  const settings = await getSiteSettings()
  const title = plainText(page.title) || 'Церква «Нове Життя» | Євангельська церква в Бориславі'
  const description = plainText(page.description) || plainText(settings.defaultDescription) ||
    "Ласкаво просимо до церкви «Нове Життя»! Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом та ділитися любов'ю Христа."
  const image = pageImage ? { ...pageImage, alt: plainText(pageImage.alt) } : {
    url: settings.ogImage ?? '/images/hero-church-1.jpg',
    width: settings.ogImage ? 1200 : 1920,
    height: settings.ogImage ? 630 : 1080,
    alt: `${settings.name}, ${settings.city}`,
  }

  return {
    ...metadata,
    robots: isPageIndexable(path, documentId)
      ? page.robots ?? { index: true, follow: true }
      : { index: false, follow: true },
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      siteName: settings.name,
      locale: 'uk_UA',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  }
}
