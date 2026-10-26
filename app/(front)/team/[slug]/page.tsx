import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/react'
import { ImagePlaceholder, PageHero, PhotoViewer, PortableTextBody } from '@/components'
import { client } from '@/sanity/lib/client'
import { getPageHeroes } from '@/lib/page-heroes'
import { getPageMetadata } from '@/lib/metadata'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site'
import { originalImageUrl, urlFor } from '@/sanity/lib/image'
import { TEAM_MEMBER_BY_SLUG_QUERY, TEAM_MEMBER_SLUGS_QUERY } from './queries'
import type { SanityTeamMember } from '@/sanity/lib/types'
import { jsonLdHtml } from '@/lib/utils'

export const revalidate = 60 // Revalidate page every 60 seconds

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
  const plainBio = typeof member.bio === 'string' ? member.bio : member.bio ? toPlainText(member.bio) : ''
  return getPageMetadata(`/team/${slug}`, {
    documentId: member._id,
    title: `${member.name || 'Служитель'} | Церква «Нове Життя»`,
    description: plainBio.trim().slice(0, 160) || `${member.name || 'Служитель'} — служитель церкви «Нове Життя»`,
    alternates: { canonical: `/team/${slug}` },
    image: member.photo ? {
      url: urlFor(member.photo).width(1200).height(630).fit('crop').url(),
      width: 1200,
      height: 630,
      alt: member.name,
    } : undefined,
  })
}

export default async function TeamMemberPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [member, heroes, settings] = await Promise.all([
    client.fetch<SanityTeamMember | null>(TEAM_MEMBER_BY_SLUG_QUERY, { slug }),
    getPageHeroes(),
    getSiteSettings(),
  ])
  if (!member) notFound()

  const photoUrl = member.photo ? urlFor(member.photo).width(800).height(1000).url() : undefined
  const roles: string[] = []
  if (member.title) roles.push(member.title)
  if (member.candidateTitle) roles.push(member.candidateTitle)
  if (member.responsibility?.length) roles.push(...member.responsibility)

  return (
    <>
      {/* Person JSON-LD (schema-markup skill) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${SITE_URL}/team/${slug}#person`,
            url: `${SITE_URL}/team/${slug}`,
            name: member.name,
            jobTitle: roles.join(', ') || undefined,
            image: photoUrl,
            memberOf: {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#church`,
              name: settings.name,
            },
          }),
        }}
      />

      <PageHero
        title={member.name}
        backgroundImage={heroes.teamHero}
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
                {member.photo ? <PhotoViewer photos={[{
                  id: member._id,
                  thumbUrl: originalImageUrl(member.photo),
                  fullUrl: originalImageUrl(member.photo),
                  alt: member.name,
                  width: member.photoDimensions?.width ?? 800,
                  height: member.photoDimensions?.height ?? 1000,
                }]} className="absolute inset-0 h-full">
                <Image
                  src={originalImageUrl(member.photo)}
                  unoptimized
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
                </PhotoViewer> : <ImagePlaceholder className="absolute inset-0" />}
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
                  <span className="bg-grad-readable text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    {member.title}
                  </span>
                )}
                {member.candidateTitle && (
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                    {member.candidateTitle}
                  </span>
                )}
                {member.responsibility?.map((r) => (
                  <span key={r} className="border border-primary text-primary-text text-sm font-semibold px-4 py-1.5 rounded-full">
                    {r}
                  </span>
                ))}
              </div>

              {/* Bio */}
              {member.bio && (
                <div className="max-w-none">
                  <PortableTextBody value={member.bio} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
