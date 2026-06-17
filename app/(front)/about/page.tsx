import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'
import { getPageHeroes } from '@/lib/page-heroes'

export const metadata: Metadata = {
  title: 'Про нас | Церква «Нове Життя»',
  description: 'Інформація про церкву «Нове Життя» — наша місія, цінності та спільнота. Сторінка незабаром буде наповнена.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function AboutPage() {
  const heroes = await getPageHeroes()
  return (
    <PlaceholderPage
      title="Про нас"
      backgroundImage={heroes.aboutHero}
      description="Сторінка «Про нас» зараз у розробці. Невдовзі тут зʼявиться повна інформація про нашу церкву, місію, цінності та спільноту."
    />
  )
}
