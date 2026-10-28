import Link from 'next/link'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Image from '@/components/ui/SiteImage'

interface TeamItemProps {
  href: string
  photo: string | null
  name: string
  position?: string
  sizes?: string
}

/** Larexa team card as one link: the name labels it, so the photo is decorative. */
export function TeamItem({ href, photo, name, position, sizes = '(max-width: 575px) 100vw, (max-width: 991px) 50vw, 25vw' }: TeamItemProps) {
  return (
    <Link href={href} className="team-item block text-center">
      <div className="team-avatar aspect-[3/4] rounded bg-gray-100">
        {photo
          ? <Image src={photo} alt="" fill sizes={sizes} className="object-cover" />
          : <ImagePlaceholder className="absolute inset-0" />}
      </div>
      <div className="team-desc">
        <h3 className="team-name text-h5">{name}</h3>
        {position && <span className="team-position">{position}</span>}
      </div>
    </Link>
  )
}
