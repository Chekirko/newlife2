// =============================================
// Shared Components Barrel File
// Only components used across multiple pages
// =============================================

// UI Components (shared)
export { MinistryCard, MinistryCardGrid, type MinistryCardProps, type MinistryCardGridProps } from './ui/MinistryCard'
export { ImagePlaceholder } from './ui/ImagePlaceholder'
export { ImageLightbox, type PhotoItem } from './ui/ImageLightbox'

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

// Section Components - LiveBanner (shared: homepage + /media live banner)
export { LiveBanner } from './sections/LiveBanner'

// Section Components - PageHero (shared: history, ministry detail)
export { PageHero, type PageHeroProps, type Breadcrumb } from './sections/PageHero'

// Rich-text (Portable Text) body renderer (shared: news/event/ministry/team detail)
export { PortableTextBody } from './PortableTextBody'

// Placeholder page (shared: /about, /media, /privacy stubs)
export { PlaceholderPage, type PlaceholderPageProps } from './PlaceholderPage'

// 404 body (shared: app/not-found + app/(front)/not-found)
export { NotFoundView } from './NotFoundView'
