import { listingPageNumber, parseListingPage } from '@/lib/listing-params'
import { getEventsListing, EventsListing, eventsMetadata } from '../../listing'

export const revalidate = 3600
export const dynamicParams = true
type Props = { params: Promise<{ n: string }> }

export async function generateStaticParams() {
  const { totalPages } = await getEventsListing(1)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ n: String(i + 2) }))
}

export async function generateMetadata({ params }: Props) {
  const { n } = await params
  const page = listingPageNumber(n)
  if (page === 1 || n !== String(page)) return {}
  return eventsMetadata({ page })
}

export default async function EventsPage({ params }: Props) {
  return <EventsListing page={parseListingPage((await params).n, '/events')} />
}
