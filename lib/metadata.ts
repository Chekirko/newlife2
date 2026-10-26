import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'

type PageMetadata = Pick<Metadata, 'alternates' | 'robots'> & {
  title?: string
  description?: string
}

function plainText(value?: string | null): string {
  return value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? ''
}

/** Complete social objects: Next.js replaces nested metadata rather than merging it. */
export async function getPageMetadata(path: string, page: PageMetadata = {}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = plainText(page.title) || 'Церква «Нове Життя» | Євангельська церква в Бориславі'
  const description = plainText(page.description) || plainText(settings.defaultDescription) ||
    "Ласкаво просимо до церкви «Нове Життя»! Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом та ділитися любов'ю Христа."
  const image = settings.ogImage ?? '/images/hero-church-1.jpg'

  return {
    ...page,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      siteName: settings.name,
      locale: 'uk_UA',
      type: 'website',
      images: [{
        url: image,
        width: settings.ogImage ? 1200 : 1920,
        height: settings.ogImage ? 630 : 1080,
        alt: `${settings.name}, ${settings.city}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
