import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/metadata'
import { PageHero } from '@/components'
import { sanityFetch } from '@/sanity/lib/fetch'
import {
  TEAM_HONORARY_QUERY,
  TEAM_ORDAINED_QUERY,
  TEAM_CANDIDATE_QUERY,
  TEAM_RESPONSIBLE_QUERY,
} from './queries'
import { TeamSection, HonorarySection, TeamPhotoBanner } from './components'
import type { SanityTeamMemberCard } from '@/sanity/lib/types'
import { getPageHeroes } from '@/lib/page-heroes'
import { SITE_URL } from '@/lib/site'
import { jsonLdHtml } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('/team', {
    title: 'Команда | Церква «Нове Життя»',
    description: 'Наші служителі — пастори, диякони та відповідальні за різні напрями церковного служіння.',
    alternates: { canonical: '/team' },
  })
}


export default async function TeamPage() {
  // Parallel fetching (senior-frontend skill: Promise.all pattern)
  const [honorary, ordained, candidates, responsible, heroes] = await Promise.all([
    sanityFetch<SanityTeamMemberCard[]>(TEAM_HONORARY_QUERY, {}, ['teamMember']),
    sanityFetch<SanityTeamMemberCard[]>(TEAM_ORDAINED_QUERY, {}, ['teamMember']),
    sanityFetch<SanityTeamMemberCard[]>(TEAM_CANDIDATE_QUERY, {}, ['teamMember']),
    sanityFetch<SanityTeamMemberCard[]>(TEAM_RESPONSIBLE_QUERY, {}, ['teamMember']),
    getPageHeroes(),
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
        backgroundImage={heroes.teamHero}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Команда' },
        ]}
      />

      {/* BreadcrumbList JSON-LD (schema-markup skill) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Команда', item: `${SITE_URL}/team` },
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
