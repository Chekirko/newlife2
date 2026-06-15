// =============================================
// Shared Components Barrel File
// Only components used across multiple pages
// =============================================

// UI Components (shared)
export { MinistryCard, MinistryCardGrid, type MinistryCardProps, type MinistryCardGridProps } from './ui/MinistryCard'

// Section Components - Hero (only used variants)
export {
  HeroSlider,
  HeroGradientImage,
  type HeroSliderProps,
  type HeroSlide,
  type HeroGradientImageProps,
} from './sections/Hero'

// Section Components - NewsSlider (shared: homepage + ministry detail)
export { NewsSlider } from './sections/NewsSlider'

// Section Components - PageHero (shared: history, ministry detail)
export { PageHero, type PageHeroProps, type Breadcrumb } from './sections/PageHero'

// Placeholder page (shared: /about, /media, /privacy stubs)
export { PlaceholderPage, type PlaceholderPageProps } from './PlaceholderPage'

// 404 body (shared: app/not-found + app/(front)/not-found)
export { NotFoundView } from './NotFoundView'
