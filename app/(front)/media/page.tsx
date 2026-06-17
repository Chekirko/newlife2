import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components'
import { getPageHeroes } from '@/lib/page-heroes'

export const metadata: Metadata = {
  title: 'Медіа | Церква «Нове Життя»',
  description: 'Проповіді, відео та записи богослужінь церкви «Нове Життя». Розділ незабаром буде наповнений.',
  // Placeholder content — keep out of the search index until it is real.
  robots: { index: false, follow: true },
}

export const revalidate = 60 // Revalidate page every 60 seconds

export default async function MediaPage() {
  const heroes = await getPageHeroes()
  return (
    <PlaceholderPage
      title="Медіа"
      backgroundImage={heroes.mediaHero}
      description="Розділ «Медіа» зараз у розробці. Невдовзі тут зʼявляться проповіді, відео та записи наших богослужінь і подій."
    />
  )
}
