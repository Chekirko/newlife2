import localFont from 'next/font/local'

export const bodyFont = localFont({
  src: '../public/fonts/roboto-normal-400-700.woff2',
  weight: '400 700', display: 'swap', variable: '--font-base',
})
export const headingFont = localFont({
  src: '../public/fonts/montserrat-normal-500-700.woff2',
  weight: '500 700', display: 'swap', variable: '--font-heading',
})
export const accentFont = localFont({
  src: '../public/fonts/playfair-display-italic-400-700.woff2',
  weight: '400 700', style: 'italic', display: 'swap', variable: '--font-alt',
  adjustFontFallback: 'Times New Roman', preload: false,
})
