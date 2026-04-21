import { HeroSlider, type HeroSlide } from '@/components'
import { MinistryGridSection } from '@/components/sections/MinistryGrid'
import { ministriesData } from '@/data/ministriesData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Служіння | Церква «Нове Життя»',
  description: 'Наші служіння — дитяче, молодіжне, жіноче, чоловіче, музичне, благодійність та інші напрями церковної діяльності.',
}

const heroSlide: HeroSlide[] = [
  {
    id: '1',
    backgroundImage: '/images/ministries-hero.jpg',
    title: 'Наші служіння',
    align: 'center',
  },
]

export default function MinistriesPage() {
  return (
    <>
      {/* Hero — identical to homepage HeroSlider but single slide */}
      <HeroSlider
        slides={heroSlide}
        height="h-[500px] lg:h-[750px]"
        overlayDark={4}
        autoplay={false}
        showArrows={false}
        showDots={false}
      />

      {/* Ministry Grid */}
      <MinistryGridSection
        preTitle="Напрями діяльності"
        title="Чим ми займаємося"
        description="У нашій церкві є різноманітні служіння для кожного віку та інтересу. Оберіть те, що вам до душі."
        items={ministriesData}
        columns={3}
        className="py-16 lg:py-24"
      />
    </>
  )
}
