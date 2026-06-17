import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'
import { getPageHeroes } from '@/lib/page-heroes'

export const metadata: Metadata = {
  title: 'Політика конфіденційності | Церква «Нове Життя»',
  description: 'Політика конфіденційності вебсайту церкви «Нове Життя». Документ готується.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function PrivacyPage() {
  const heroes = await getPageHeroes()
  return (
    <PlaceholderPage
      title="Політика конфіденційності"
      backgroundImage={heroes.privacyHero}
      description="Текст політики конфіденційності зараз готується. Невдовзі тут зʼявиться повна інформація про те, як ми обробляємо та захищаємо ваші дані."
    />
  )
}
