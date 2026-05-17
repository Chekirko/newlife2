import { PageHero } from '@/components'
import { MinistryGridSection } from './components/MinistryGrid'
import { client } from '@/sanity/lib/client'
import { MINISTRIES_QUERY } from './queries'
import type { SanityMinistryCard } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Служіння | Церква «Нове Життя»',
  description: 'Наші служіння — дитяче, молодіжне, жіноче, чоловіче, музичне, благодійність та інші напрями церковної діяльності.',
}

export default async function MinistriesPage() {
  const ministries = await client.fetch<SanityMinistryCard[]>(MINISTRIES_QUERY)

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Наші служіння"
        backgroundImage="/images/ministries-hero.jpg"
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
