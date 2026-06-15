import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'

export const metadata: Metadata = {
  title: 'Про нас | Церква «Нове Життя»',
  description: 'Інформація про церкву «Нове Життя» — наша місія, цінності та спільнота. Сторінка незабаром буде наповнена.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="Про нас"
      description="Сторінка «Про нас» зараз у розробці. Невдовзі тут зʼявиться повна інформація про нашу церкву, місію, цінності та спільноту."
    />
  )
}
