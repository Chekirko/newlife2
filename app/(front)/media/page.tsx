import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'

export const metadata: Metadata = {
  title: 'Медіа | Церква «Нове Життя»',
  description: 'Проповіді, відео та записи богослужінь церкви «Нове Життя». Розділ незабаром буде наповнений.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export default function MediaPage() {
  return (
    <PlaceholderPage
      title="Медіа"
      description="Розділ «Медіа» зараз у розробці. Невдовзі тут зʼявляться проповіді, відео та записи наших богослужінь і подій."
    />
  )
}
