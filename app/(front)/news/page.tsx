import { NewsListing, newsMetadata } from './listing'

export async function generateMetadata() {
  return newsMetadata()
}
export default function NewsPage() {
  return <NewsListing />
}
