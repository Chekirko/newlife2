import { Breadcrumbs, type Breadcrumb } from '@/components/ui/Breadcrumbs'
import Image, { type StaticImageData } from '@/components/ui/SiteImage'

interface PageTitleProps {
  title: string
  subtitle?: string
  /** Decorative background photo. */
  image: string | StaticImageData
  /** Also feeds the BreadcrumbList JSON-LD. */
  breadcrumbs: Breadcrumb[]
}

/** Inner-page banner (Larexa blog hero): photo under a 70% dark overlay, H1 and breadcrumbs. */
export function PageTitle({ title, subtitle, image, breadcrumbs }: PageTitleProps) {
  return (
    <section className="bg-overlay-dark-7 py-24 text-center all-text-white">
      {/* Same crop budget as the PageHero banner it replaces. */}
      <Image src={image} alt="" fill preload
        sizes="(max-width: 991px) max(100vw, 623px), max(100vw, 800px)" className="-z-10 object-cover" />
      <div className="container-larexa">
        <h1 className="font-semibold">{title}</h1>
        {subtitle && <p className="font-heading font-medium">{subtitle}</p>}
        <div className="mt-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
    </section>
  )
}
