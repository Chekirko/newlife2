import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { TEAM_MEMBER_BY_SLUG_QUERY, TEAM_MEMBER_SLUGS_QUERY } from './queries'
import type { SanityTeamMember } from '@/sanity/lib/types'

// SSG (senior-frontend skill: generateStaticParams pattern)
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(TEAM_MEMBER_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug }))
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const member = await client.fetch<SanityTeamMember | null>(
    TEAM_MEMBER_BY_SLUG_QUERY, { slug }
  )
  if (!member) return { title: 'Служитель не знайдений' }
  return {
    title: `${member.name} | Церква «Нове Життя»`,
    description: member.bio?.slice(0, 160) || `${member.name} — служитель церкви «Нове Життя»`,
  }
}

export default async function TeamMemberPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await client.fetch<SanityTeamMember | null>(
    TEAM_MEMBER_BY_SLUG_QUERY, { slug }
  )
  if (!member) notFound()

  const photoUrl = urlFor(member.photo).width(800).height(1000).url()
  const roles: string[] = []
  if (member.title) roles.push(member.title)
  if (member.responsibility) roles.push(member.responsibility)

  return (
    <>
      {/* Person JSON-LD (schema-markup skill) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: member.name,
            jobTitle: roles.join(', ') || undefined,
            image: photoUrl,
            worksFor: {
              '@type': 'Organization',
              name: 'Церква «Нове Життя»',
              address: { '@type': 'PostalAddress', addressLocality: 'Борислав' },
            },
          }),
        }}
      />

      <PageHero
        title={member.name}
        breadcrumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Команда', href: '/team' },
          { label: member.name },
        ]}
      />

      <section className="py-12 lg:py-20">
        <div className="container-larexa">
          <div className="flex flex-wrap -mx-4">
            {/* Photo */}
            <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
              <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={photoUrl}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="w-full md:w-2/3 px-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 font-heading mb-2">
                {member.name}
              </h1>

              {/* Roles */}
              <div className="flex flex-wrap gap-2 mb-6">
                {member.title && (
                  <span className="bg-grad text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    {member.title}
                  </span>
                )}
                {member.responsibility && (
                  <span className="border border-primary text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
                    {member.responsibility}
                  </span>
                )}
              </div>

              {/* Bio */}
              {member.bio && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg whitespace-pre-line">
                    {member.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
