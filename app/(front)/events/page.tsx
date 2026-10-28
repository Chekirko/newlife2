import { EventsListing, eventsMetadata } from './listing'

export const revalidate = 3600

export async function generateMetadata() {
  return eventsMetadata()
}
export default function EventsPage() {
  return <EventsListing />
}
