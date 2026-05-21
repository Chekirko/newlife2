import type { Metadata } from 'next'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { TEAM_ORDAINED_QUERY, TEAM_RESPONSIBLE_QUERY } from './queries'
import { TeamSection } from './components'
import type { SanityTeamMemberCard } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Команда | Церква «Нове Життя»',
  description: 'Наші служителі — пастори, диякони та відповідальні за різні напрями церковного служіння.',
}

export default async function TeamPage() {
  // Parallel fetching (senior-frontend skill: Promise.all pattern)
  const [ordained, responsible] = await Promise.all([
    client.fetch<SanityTeamMemberCard[]>(TEAM_ORDAINED_QUERY),
    client.fetch<SanityTeamMemberCard[]>(TEAM_RESPONSIBLE_QUERY),
  ])

  return (
    <>
      <PageHero
        title="Наша команда"
        backgroundImage="/images/ministries-hero.jpg"
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Команда' },
        ]}
      />

      {/* Section 1: Ordained ministers */}
      <TeamSection
        preTitle="Духовне служіння"
        title="Рукопокладені служителі"
        members={ordained}
        subtitleField="title"
      />

      {/* Section 2: Ministry leaders */}
      <TeamSection
        preTitle="Напрями служіння"
        title="Відповідальні за служіння"
        members={responsible}
        subtitleField="responsibility"
      />
    </>
  )
}
