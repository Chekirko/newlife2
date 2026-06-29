import { TeamMemberCard } from './TeamMemberCard'
import { urlFor } from '@/sanity/lib/image'
import type { SanityTeamMemberCard } from '@/sanity/lib/types'

interface TeamSectionProps {
  preTitle: string
  title: string
  members: SanityTeamMemberCard[]
  subtitleField: 'title' | 'responsibility' | 'candidateTitle'
  bgClass?: string
}

export function TeamSection({ preTitle, title, members, subtitleField, bgClass = '' }: TeamSectionProps) {
  const isEmpty = members.length === 0
  return (
    <section className={`py-12 lg:py-20 ${bgClass}`}>
      <div className="container-larexa">
        {/* Section heading */}
        <div className="text-center mb-12">
          <span className="gradient-text text-sm font-semibold uppercase tracking-wider">
            {preTitle}
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 font-heading mt-2">
            {title}
          </h2>
        </div>

        {isEmpty ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500 italic">Поки що немає доданих служителів у цій категорії.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member) => {
              const raw = member[subtitleField]
              const subtitle = Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')
              return (
              <TeamMemberCard
                key={member._id}
                slug={member.slug}
                name={member.name}
                subtitle={subtitle}
                photoUrl={
                  member.photo
                    ? urlFor(member.photo).width(600).height(800).url()
                    : '/images/placeholder.jpg'
                }
              />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
