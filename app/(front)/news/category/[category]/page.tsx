import { sanityFetch } from '@/sanity/lib/fetch'
import { NEWS_CATEGORIES_QUERY } from '../../queries'
import { NewsListing, newsMetadata, resolveNewsCategory } from '../../listing'

export const dynamicParams = true
type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const categories = await sanityFetch<string[]>(NEWS_CATEGORIES_QUERY, {}, ['news'])
  return categories.map(category => ({ category }))
}

export async function generateMetadata({ params }: Props) {
  return newsMetadata({ category: await resolveNewsCategory((await params).category) })
}

export default async function NewsCategoryPage({ params }: Props) {
  return <NewsListing category={await resolveNewsCategory((await params).category)} />
}
