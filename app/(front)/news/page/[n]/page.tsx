import { listingPageNumber, parseListingPage } from '@/lib/listing-params'
import { getNewsListing, NewsListing, newsMetadata } from '../../listing'

export const dynamicParams = true
type Props = { params: Promise<{ n: string }> }

export async function generateStaticParams() {
  const { totalPages } = await getNewsListing(1, '')
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ n: String(i + 2) }))
}

export async function generateMetadata({ params }: Props) {
  const { n } = await params
  const page = listingPageNumber(n)
  if (page === 1 || n !== String(page)) return {}
  return newsMetadata({ page })
}

export default async function NewsPage({ params }: Props) {
  return <NewsListing page={parseListingPage((await params).n, '/news')} />
}
