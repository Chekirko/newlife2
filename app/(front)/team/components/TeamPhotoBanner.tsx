import Image from 'next/image'
import { PhotoViewer } from '@/components'
import teamPhoto from '@/public/images/team.jpg'

export function TeamPhotoBanner() {
  return (
    <section className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full overflow-hidden">
      <PhotoViewer photos={[{ id: 'team', thumbUrl: '/images/team.jpg', fullUrl: '/images/team.jpg', alt: 'Служителі церкви «Нове Життя»', width: teamPhoto.width, height: teamPhoto.height }]} className="absolute inset-0 h-full">
      {/* Desktop Parallax (fixed background image, hidden on mobile) */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-fixed"
        style={{
          backgroundImage: 'url(/images/team.jpg)',
          backgroundPosition: 'center 35%',
        }}
      />

      {/* Mobile standard image (not fixed background to avoid iOS Safari bugs) */}
      <div className="block md:hidden absolute inset-0">
        <Image
          src="/images/team.jpg"
          unoptimized
          alt="Служителі церкви «Нове Життя»"
          fill
          sizes="100vw"
          className="object-cover object-[center_35%]"
          priority={false}
        />
      </div>

      {/* Elegant overlay for premium visual look */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] transition-all duration-300" />
      </PhotoViewer>
    </section>
  )
}

