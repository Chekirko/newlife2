import { PageHero } from '@/components'
import { MinistryGridSection } from './components/MinistryGrid'
import { client } from '@/sanity/lib/client'
import { getPageHeroes } from '@/lib/page-heroes'
import { MINISTRIES_QUERY } from './queries'
import type { SanityMinistryCard } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Служіння | Церква «Нове Життя»',
}

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function MinistriesPage() {
  const [ministries, heroes] = await Promise.all([
    client.fetch<SanityMinistryCard[]>(MINISTRIES_QUERY),
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
