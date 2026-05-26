import type { Metadata } from 'next'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import {
  TEAM_HONORARY_QUERY,
  TEAM_ORDAINED_QUERY,
  TEAM_CANDIDATE_QUERY,
  TEAM_RESPONSIBLE_QUERY,
} from './queries'
import { TeamSection, HonorarySection, TeamPhotoBanner } from './components'
import type { SanityTeamMemberCard } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Команда | Церква «Нове Життя»',
  description: 'Наші служителі — пастори, диякони та відповідальні за різні напрями церковного служіння.',
}

export default async function TeamPage() {
  // Parallel fetching (senior-frontend skill: Promise.all pattern)
  const [honorary, ordained, candidates, responsible] = await Promise.all([
    client.fetch<SanityTeamMemberCard[]>(TEAM_HONORARY_QUERY),
    client.fetch<SanityTeamMemberCard[]>(TEAM_ORDAINED_QUERY),
    client.fetch<SanityTeamMemberCard[]>(TEAM_CANDIDATE_QUERY),
    client.fetch<SanityTeamMemberCard[]>(TEAM_RESPONSIBLE_QUERY),
  ])

  // Track rendered content sections for alternating background colors (bg-gray-50 / bg-white)
  let sectionIndex = 0
  const getBgClass = () => {
    const bg = sectionIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
    sectionIndex++
    return bg
  }

  return (
    <>
      <PageHero
        title="Наша команда"
        backgroundImage="/images/team.jpg"
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Команда' },
        ]}
      />

      {/* BreadcrumbList JSON-LD (schema-markup skill) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://newlife.church' },
              { '@type': 'ListItem', position: 2, name: 'Команда', item: 'https://newlife.church/team' },
            ],
          }),
        }}
      />

      {/* 1. Почесні служителі — спеціальний стиль */}
      {honorary.length > 0 && <HonorarySection members={honorary} bgClass={getBgClass()} />}

      {/* 2. Рукопокладені служителі */}
      <TeamSection
        preTitle="Духовне служіння"
        title="Рукопокладені служителі"
        members={ordained}
        subtitleField="title"
        bgClass={getBgClass()}
      />

      {/* 3. Групове фото (пропливаюче віконце) */}
      <TeamPhotoBanner />

      {/* 4. Кандидати */}
      {candidates.length > 0 && (
        <TeamSection
          preTitle="На шляху служіння"
          title="Кандидати"
          members={candidates}
          subtitleField="candidateTitle"
          bgClass={getBgClass()}
        />
      )}

      {/* 5. Відповідальні за служіння */}
      <TeamSection
        preTitle="Напрями служіння"
        title="Відповідальні за служіння"
        members={responsible}
        subtitleField="responsibility"
        bgClass={getBgClass()}
      />
    </>
  )
}
