import { listingPageNumber, parseListingPage } from '@/lib/listing-params'
import { sanityFetch } from '@/sanity/lib/fetch'
import { NEWS_CATEGORIES_QUERY } from '../../../../queries'
import { getNewsListing, NewsListing, newsMetadata, resolveNewsCategory } from '../../../../listing'

export const dynamicParams = true
type Props = { params: Promise<{ category: string; n: string }> }

export async function generateStaticParams() {
  const categories = await sanityFetch<string[]>(NEWS_CATEGORIES_QUERY, {}, ['news'])
  const groups = await Promise.all(categories.map(async category => {
    const { totalPages } = await getNewsListing(1, category)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ category, n: String(i + 2) }))
  }))
  return groups.flat()
}

export async function generateMetadata({ params }: Props) {
  const { category, n } = await params
  const page = listingPageNumber(n)
  if (page === 1 || n !== String(page)) return {}
  return newsMetadata({ category: await resolveNewsCategory(category), page })
}

export default async function NewsCategoryPage({ params }: Props) {
  const { category, n } = await params
  const name = await resolveNewsCategory(category)
  return <NewsListing category={name} page={parseListingPage(n, '/news', name)} />
}
