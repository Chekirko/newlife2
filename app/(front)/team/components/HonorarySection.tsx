import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { SanityTeamMemberCard } from '@/sanity/lib/types'

interface HonorarySectionProps {
  members: SanityTeamMemberCard[]
  bgClass?: string
}

export function HonorarySection({ members, bgClass = 'bg-gray-50' }: HonorarySectionProps) {
  if (members.length === 0) return null

  return (
    <section className={`py-12 lg:py-20 ${bgClass}`}>
      <div className="container-larexa">
        {/* Section heading */}
        <div className="text-center mb-12">
          <span className="gradient-text text-sm font-semibold uppercase tracking-wider">
            Шана та повага
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 font-heading mt-2">
            Почесні служителі церкви
          </h2>
        </div>

        {/* Grid — centered, harmonious sizing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {members.map((member) => {
            const photoUrl = member.photo
              ? urlFor(member.photo).width(352).height(352).url()
              : '/images/placeholder.jpg'

            return (
              <Link
                key={member._id}
                href={`/team/${member.slug}`}
                className="group block text-center"
              >
                {/* Rounded photo with hover ring effect */}
                <div className="relative w-36 h-36 lg:w-44 lg:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary group-hover:ring-4 transition-all duration-300">
                  <Image
                    src={photoUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 1024px) 144px, 176px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Name */}
                <h5 className="text-lg font-bold text-gray-800 font-heading mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h5>

                {/* Title (Сан) */}
                {member.title && (
                  <span className="gradient-text text-sm font-semibold block">
                    {member.title}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
