import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import type { SiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { indexingRobots } from '@/lib/indexing'
import { schemaDate } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import type { SanitySeo } from '@/sanity/lib/types'

export const SITE_TITLE = 'Церква «Нове Життя»'
export const HOME_TITLE = `${SITE_TITLE} | Євангельська церква в Бориславі`

type PageMetadata = Pick<Metadata, 'alternates'> & {
  title?: string
  description?: string
  seo?: SanitySeo | null
  noIndex?: boolean
  article?: { publishedTime?: string | null; modifiedTime?: string | null }
  image?: { url: string; width: number; height: number; alt: string }
}

function plainText(value?: string | null): string {
  return value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? ''
}

/** Complete social objects: Next.js replaces nested metadata rather than merging it. */
export async function getPageMetadata(path: string, page: PageMetadata = {}): Promise<Metadata> {
  return pageMetadata(path, page, await getSiteSettings())
}

export function pageMetadata(path: string, page: PageMetadata, settings: SiteSettings): Metadata {
  const title = plainText(page.seo?.title) || plainText(page.title) || HOME_TITLE
  const socialTitle = path === '/' ? title : `${title} | ${SITE_TITLE}`
  const description = plainText(page.seo?.description) || plainText(page.description) || plainText(settings.defaultDescription) ||
    "Ласкаво просимо до церкви «Нове Життя»! Ми — спільнота віруючих людей, які прагнуть жити за Божим Словом та ділитися любов'ю Христа."
  const seoImage = page.seo?.ogImage
  const image = seoImage?.asset?._ref ? {
    url: urlFor(seoImage).width(1200).height(630).fit('crop').url(),
    width: 1200, height: 630, alt: title,
  } : page.image ? { ...page.image, alt: plainText(page.image.alt) } : {
    url: settings.ogImage ?? '/images/hero-church-1.jpg',
    width: settings.ogImage ? 1200 : 1920,
    height: settings.ogImage ? 630 : 1080,
    alt: `${settings.name}, ${settings.city}`,
  }
  image.url = new URL(image.url, SITE_URL).href
  const publishedTime = schemaDate(page.article?.publishedTime)
  const modifiedTime = schemaDate(page.article?.modifiedTime)

  return {
    alternates: page.alternates,
    robots: indexingRobots(page.noIndex || page.seo?.noIndex === true),
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      siteName: settings.name,
      locale: 'uk_UA',
      ...(page.article ? {
        type: 'article',
        publishedTime,
        modifiedTime: modifiedTime && (!publishedTime || Date.parse(modifiedTime) >= Date.parse(publishedTime)) ? modifiedTime : undefined,
      } : { type: 'website' }),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image.url],
    },
  }
}
