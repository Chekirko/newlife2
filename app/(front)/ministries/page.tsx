import { PageHero } from '@/components'
import { MinistryGridSection } from './components/MinistryGrid'
import { sanityFetch } from '@/sanity/lib/fetch'
import { getPageHeroes } from '@/lib/page-heroes'
import { MINISTRIES_QUERY } from './queries'
import type { SanityMinistryCard } from '@/sanity/lib/types'
import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('/ministries', {
    title: 'Служіння',
    description: 'Напрями служіння церкви «Нове Життя» у Бориславі та інформація про кожне служіння.',
    alternates: { canonical: '/ministries' },
  })
}


export default async function MinistriesPage() {
  const [ministries, heroes] = await Promise.all([
    sanityFetch<SanityMinistryCard[]>(MINISTRIES_QUERY, {}, ['ministry']),
    getPageHeroes(),
  ])

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Наші служіння"
        backgroundImage={heroes.ministriesHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Служіння' },
        ]}
      />

      {/* Ministry Grid */}
      <MinistryGridSection
        preTitle="Напрями діяльності"
        title="Чим ми займаємося"
        description="У нашій церкві є різноманітні служіння для кожного віку та інтересу. Оберіть те, що вам до душі."
        items={ministries}
        columns={3}
        className="py-16 lg:py-24"
      />
    </>
  )
}
