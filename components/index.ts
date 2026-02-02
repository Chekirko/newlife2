// UI Components
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './ui/Button'
export { Accordion, type AccordionProps, type AccordionVariant, type AccordionItemData } from './ui/Accordion'
export { FeatureBox, FeatureBoxIcon, type FeatureBoxProps, type FeatureBoxStyle } from './ui/FeatureBox'
export { TeamCard, type TeamCardProps, type TeamCardVariant, type SocialLink } from './ui/TeamCard'
export { PricingCard, PricingCardWithHeader, type PricingCardProps } from './ui/PricingCard'
export { Testimonial, type TestimonialProps, type TestimonialVariant } from './ui/Testimonial'
export { SocialIcons, type SocialIconsProps, type SocialIconsVariant, type SocialPlatform } from './ui/SocialIcons'
export { ProcessStep, ProcessSteps, type ProcessStepProps, type ProcessStepVariant } from './ui/ProcessStep'
export { BlogPost, BlogPostItem, type BlogPostProps, type BlogPostVariant } from './ui/BlogPost'
export { PortfolioCard, PortfolioGrid, PortfolioFilter, type PortfolioCardProps, type PortfolioGridProps } from './ui/PortfolioCard'

// Layout Components
export { Container, Row, Col, type ContainerProps, type RowProps, type ColProps } from './layout/Container'
export { Header, type HeaderProps, type HeaderVariant, type NavItem } from './layout/Header'
export { Footer, type FooterProps, type FooterColumn, type FooterLink } from './layout/Footer'

// Section Components - Hero (10 variants)
export {
  HeroSlider,
  HeroSplit,
  HeroWave,
  HeroTypist,
  HeroParallaxVideo,
  HeroGradientImage,
  HeroSearchForm,
  HeroMarketplace,
  HeroPortfolio,
  HeroBanner,
  type HeroSliderProps,
  type HeroSlide,
  type HeroSplitProps,
  type HeroWaveProps,
  type HeroTypistProps,
  type HeroParallaxVideoProps,
  type HeroGradientImageProps,
  type HeroSearchFormProps,
  type HeroMarketplaceProps,
  type HeroPortfolioProps,
  type HeroBannerProps,
} from './sections/Hero'

// Section Components - ActionBox (8 variants)
export {
  ActionBoxSplitList,
  ActionBoxQuote,
  ActionBoxGradientCTA,
  ActionBoxInline,
  ActionBoxContact,
  ActionBoxFullWidth,
  ActionBoxFeature,
  ActionBoxStats,
  CTABox,
  ActionBox,
  type ActionBoxSplitListProps,
  type ActionBoxQuoteProps,
  type ActionBoxGradientCTAProps,
  type ActionBoxInlineProps,
  type ActionBoxContactProps,
  type ActionBoxFullWidthProps,
  type ActionBoxFeatureProps,
  type ActionBoxStatsProps,
  type CTABoxProps,
} from './sections/ActionBox'

// Section Components - Clients (6 variants)
export {
  ClientsGrid,
  ClientsCarousel,
  ClientsFeature,
  ClientsOverlapping,
  ClientsWithBg,
  ClientsRow,
  Clients,
  Partners,
  type ClientsGridProps,
  type ClientsCarouselProps,
  type ClientsFeatureProps,
  type ClientsOverlappingProps,
  type ClientsWithBgProps,
  type ClientsRowProps,
  type ClientLogo,
  type ClientFeature,
} from './sections/Clients'

// Section Components - Services (7 variants)
export {
  ServicesGrid,
  ServicesMasonry,
  ServicesSimpleGrid,
  ServicesCards,
  ServicesBordered,
  ServicesIconLeft,
  ServicesCircularIcon,
  Services,
  type ServicesGridProps,
  type ServicesMasonryProps,
  type ServicesSimpleGridProps,
  type ServicesCardsProps,
  type ServicesBorderedProps,
  type ServicesIconLeftProps,
  type ServicesCircularIconProps,
  type ServiceItem,
} from './sections/Services'

// Section Components - Team (5 variants)
export {
  TeamGrid,
  TeamCarousel,
  TeamSplit,
  TeamAbout,
  TeamOverlay,
  Team,
  type TeamGridProps,
  type TeamCarouselProps,
  type TeamSplitProps,
  type TeamAboutProps,
  type TeamOverlayProps,
  type TeamMember,
  type TeamAboutItem,
} from './sections/Team'

// Section Components - About (4 variants)
export {
  AboutFeatures,
  AboutSplitGallery,
  AboutWithStats,
  AboutUs,
  About,
  type AboutFeaturesProps,
  type AboutSplitGalleryProps,
  type AboutWithStatsProps,
  type AboutUsProps,
  type AboutFeature,
  type AboutStat,
} from './sections/About'

// Section Components - Blog (4 variants)
export {
  BlogCarousel,
  BlogGrid,
  BlogList,
  BlogFeatured,
  Blog,
  BlogSection,
  type BlogCarouselProps,
  type BlogGridProps,
  type BlogListProps,
  type BlogFeaturedProps,
  type BlogPostData,
} from './sections/Blog'

// Section Components - Contact (3 variants)
export {
  ContactSplitGallery,
  ContactForm,
  ContactCTA,
  Contact,
  type ContactSplitGalleryProps,
  type ContactFormProps,
  type ContactCTAProps,
  type ContactInfo,
} from './sections/Contact'

// Section Components - FAQ (3 variants)
export {
  FAQGrid,
  FAQAccordion,
  FAQSplit,
  FAQ,
  Faqs,
  type FAQGridProps,
  type FAQAccordionProps,
  type FAQSplitProps,
  type FAQItem,
} from './sections/FAQ'

// Section Components - Newsletter (3 variants)
export {
  NewsletterCentered,
  NewsletterSplit,
  NewsletterInline,
  Newsletter,
  type NewsletterCenteredProps,
  type NewsletterSplitProps,
  type NewsletterInlineProps,
} from './sections/Newsletter'

// Section Components - Pricing (3 variants)
export {
  PricingSection,
  PricingTabs,
  PricingToggle,
  Pricing,
  type PricingSectionProps,
  type PricingTabsProps,
  type PricingToggleProps,
  type PricingPlan,
} from './sections/Pricing'

// Section Components - Testimonials (4 variants)
export {
  TestimonialsSection,
  TestimonialsGrid,
  TestimonialsBigQuote,
  TestimonialsCarousel,
  Testimonials,
  type TestimonialsSectionProps,
  type TestimonialsGridProps,
  type TestimonialsBigQuoteProps,
  type TestimonialsCarouselProps,
  type TestimonialData,
} from './sections/Testimonials'

// Section Components - Process (4 variants)
export {
  ProcessFloating,
  ProcessNumbered,
  ProcessTimeline,
  ProcessHorizontal,
  Process,
  Steps,
  type ProcessFloatingProps,
  type ProcessNumberedProps,
  type ProcessTimelineProps,
  type ProcessHorizontalProps,
  type ProcessStepData,
} from './sections/Process'

// Section Components - Portfolio (4 variants)
export {
  PortfolioSection,
  PortfolioMasonry,
  PortfolioFullWidth,
  CompanyPortfolio,
  Portfolio,
  type PortfolioSectionProps,
  type PortfolioMasonryProps,
  type PortfolioFullWidthProps,
  type CompanyPortfolioProps,
  type PortfolioItem,
} from './sections/Portfolio'

// Section Components - Other
export { Section, SectionTitle, type SectionProps, type SectionTitleProps } from './sections/Section'
export { Counter, Results, type CounterProps, type CounterItem, type ResultsProps } from './sections/Counter'
