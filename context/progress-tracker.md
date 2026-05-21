# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Architecture stabilization complete. Ready for new features.

## Current Goal

- Implement next planned page/feature (see specs/)

## Completed

- **Homepage**: Hero slider, events, pastor greeting, vision, ministries, schedule, news, about, testimonials, FAQ, CTA
- **Ministries list page**: Grid with Sanity data
- **Ministry detail page**: Full content, gallery, sidebar, news slider, PageHero
- **News list page**: Pagination, category filter, sidebar
- **News detail page**: Full article, sidebar
- **History page**: Timeline with photos, video, accordions, PageHero
- **Sanity CMS**: Schemas for ministry, news, event
- **Architecture cleanup**: Removed unused components, modular page-level structure
- **DRY refactoring**: Shared `formatDate()` in `lib/utils.ts`, shared `PageHero` component
- **Sanity TypeGen**: Auto-generated types from GROQ queries (`npm run typegen`)
- **Query architecture**: Page-local `queries.ts` files, shared queries in `sanity/lib/queries.ts`
- **Lazy-loading**: `next/dynamic` for below-fold homepage components (TestimonialsGrid, FAQSplit, ActionBoxFullWidth)
- **Barrel files**: `index.ts` for all component directories
- **Encoding fixes**: Resolved Cyrillic corruption from PowerShell BOM issues
- **News image quality**: Increased from 800×450 to 1200×675
- **Six-File Context System**: Adapted and deployed
- **Contact page**: 3-column layout (Info, Map, Form), PageHero, client-side validation
- **Hero Unification**: Replaced `HeroSlider` with `PageHero` on `/news` and `/ministries`.
- **Team Page**: Implemented `/team` and `/team/[slug]` with Sanity integration, Larexa design (hover gradients), Schema markup (Person JSON-LD), and optimized images/components.

## In Progress

- None currently.

## Next Up

- Online трансляції / медіа сторінка
- Sanity content audit: unique gallery images per ministry

## Open Questions

- Які саме сторінки планує замовник наступними?

## Architecture Decisions

- **Page-level queries**: GROQ queries co-located with pages that use them, shared queries centralized
- **TypeGen over manual types**: Auto-generated types preferred, manual types as fallback
- **Lazy-loading strategy**: Client components below the fold use `next/dynamic`
- **PageHero shared component**: Frosted-glass hero pattern extracted to avoid duplication
- **Encoding safety**: Never use PowerShell for Cyrillic file output — use editor tools only
- **No overloadClientMethods**: Disabled in TypeGen config due to `@sanity/client` not being direct dependency

## Session Notes

- Latest session (2026-05-17): Implemented TypeGen, query architecture, lazy-loading, Six-File Context System
- Vercel build was failing due to `overloadClientMethods: true` — fixed by setting to `false`
- `prebuild` script runs `sanity schema extract && sanity typegen generate` before each build
