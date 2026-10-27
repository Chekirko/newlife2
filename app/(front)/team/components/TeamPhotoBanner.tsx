import Image from '@/components/ui/SiteImage'
import { PhotoViewer } from '@/components'
import teamPhoto from '@/public/images/team.jpg'

export function TeamPhotoBanner() {
  return (
    <section className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full overflow-hidden">
      <PhotoViewer photos={[{ id: 'team', thumbUrl: '/images/team.jpg', fullUrl: '/images/team.jpg', alt: 'Служителі церкви «Нове Життя»', width: teamPhoto.width, height: teamPhoto.height }]} className="absolute inset-0 h-full">
      <Image src={teamPhoto} alt="Служителі церкви «Нове Життя»" fill sizes="100vw" className="object-cover object-[center_35%]" />

      {/* Elegant overlay for premium visual look */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] transition-all duration-300" />
      </PhotoViewer>
    </section>
  )
}

