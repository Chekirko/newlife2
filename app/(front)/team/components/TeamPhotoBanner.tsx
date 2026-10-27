import { getImageProps } from 'next/image'
import Image from '@/components/ui/SiteImage'
import { PhotoViewer } from '@/components'
import teamPhoto from '@/public/images/team.jpg'

// A fixed background is sized to the viewport, so the parallax gets a viewport-wide 1x/2x set.
// Quality 90: Next encodes AVIF at quality − 20, and 75 visibly smears a group of faces.
const { props: { srcSet = '' } } = getImageProps({ src: teamPhoto, alt: '', width: 1920, height: 1440, quality: 90 })
const parallaxImage = `image-set(${srcSet.split(', ').map(candidate => {
  const [url, density] = candidate.split(' ')
  return `url("${url}") ${density}`
}).join(', ')})`

export function TeamPhotoBanner() {
  return (
    <section className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full overflow-hidden">
      <PhotoViewer photos={[{ id: 'team', thumbUrl: '/images/team.jpg', fullUrl: '/images/team.jpg', alt: 'Служителі церкви «Нове Життя»', width: teamPhoto.width, height: teamPhoto.height }]} className="absolute inset-0 h-full">
      {/* Desktop Parallax (fixed background image, hidden on mobile) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-fixed"
        style={{ backgroundImage: parallaxImage, backgroundPosition: 'center 35%' }}
      />

      {/* Mobile standard image (not fixed background to avoid iOS Safari bugs) */}
      <div className="block md:hidden absolute inset-0">
        <Image src={teamPhoto} alt="Служителі церкви «Нове Життя»" fill sizes="100vw" quality={90} className="object-cover object-[center_35%]" />
      </div>

      {/* Elegant overlay for premium visual look */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] transition-all duration-300" />
      </PhotoViewer>
    </section>
  )
}
