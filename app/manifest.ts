import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Церква «Нове Життя» — Борислав',
    short_name: 'Нове Життя',
    lang: 'uk',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#216e4e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
  }
}
