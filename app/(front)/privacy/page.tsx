import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'

export const metadata: Metadata = {
  title: 'Політика конфіденційності | Церква «Нове Життя»',
  description: 'Політика конфіденційності вебсайту церкви «Нове Життя». Документ готується.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Політика конфіденційності"
      description="Текст політики конфіденційності зараз готується. Невдовзі тут зʼявиться повна інформація про те, як ми обробляємо та захищаємо ваші дані."
    />
  )
}
