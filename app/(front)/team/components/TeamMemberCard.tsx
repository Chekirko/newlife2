import Image from 'next/image'
import Link from 'next/link'

interface TeamMemberCardProps {
  slug: string
  name: string
  subtitle: string
  photoUrl: string
}

export function TeamMemberCard({ slug, name, subtitle, photoUrl }: TeamMemberCardProps) {
  return (
    <Link href={`/team/${slug}`} className="group block text-center">
      {/* Photo container with hover gradient overlay */}
      <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-100" style={{ aspectRatio: '3/4' }}>
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay on hover — Larexa team-overlay style */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--gradient-start)]/80 via-[var(--gradient-end)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      {/* Name + subtitle */}
      <h5 className="text-lg font-bold text-gray-800 font-heading mb-1">{name}</h5>
      {subtitle && (
        <span className="gradient-text text-sm font-semibold block">{subtitle}</span>
      )}
    </Link>
  )
}
