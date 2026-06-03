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
- **Ministry Leader Refactoring**: Replaced inline `leaderName`/`leaderPhoto` fields in the `ministry` schema with a `reference` to `teamMember`. Updated page queries to dereference `leader->`, made the leader block a clickable link to `/team/[slug]` with Larexa-style hover transitions, hid the leader section if unassigned, added BreadcrumbList JSON-LD for SEO, and migrated existing ministries via a script.
- **Team Page Restructuring**: Extended `teamMember` schema with `candidate` and `honorary` categories plus `candidateTitle` field. Restructured `/team` page into 5 sections: HonorarySection (circular photos, ring hover), Ordained (standard cards, excluding honorary members via GROQ query `!("honorary" in category)` to avoid duplication), TeamPhotoBanner (full-width parallax banner on desktop, standard mobile fallback), Candidates (conditional), Responsible. Added dynamic zebra-striping backgrounds (`bg-gray-50`/`bg-white`) across content sections based on a dynamic renderer index, maintaining visual consistency regardless of which sections are empty. Added BreadcrumbList JSON-LD. Updated `/team/[slug]` with candidateTitle badge.

- **Weak References**: Переведено ministry.leader на weak: true, створено міграцію існуючих даних, зафіксовано правило weak: true для всіх майбутніх reference-полів у code-standards, architecture, AGENTS.md

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
- **Ministry Leader Reference**: Relinked the leader fields in `ministry` schema as a dynamic reference to the `teamMember` model to guarantee a single source of truth for church leaders.
- **Weak References Policy**: Усі `reference`-поля в Sanity-схемах ЗАВЖДИ `weak: true` — дозволяє видаляти referenced-документи, фронтенд обов'язково перевіряє null перед рендером. Зафіксовано в code-standards.md, architecture.md (інваріант #10), AGENTS.md (CRITICAL rule).
- **Team Member Categories**: `teamMember.category` is an array of `ordained | responsible | candidate | honorary`. One person can belong to multiple categories simultaneously. `candidateTitle` is a separate field from `title` (Сан).
- **Incremental Static Regeneration (ISR)**: Configured all CMS-driven pages (`/`, `/team`, `/team/[slug]`, `/ministries`, `/ministries/[slug]`, `/news`, `/news/[slug]`) to use Next.js ISR with a `revalidate = 60` interval. Set `useCdn: false` in the Sanity client to bypass Edge CDN caches during background revalidations, ensuring users see published CMS changes within 60 seconds without needing full Vercel rebuilds.

## Session Notes

- Latest session (2026-05-17): Implemented TypeGen, query architecture, lazy-loading, Six-File Context System
- Vercel build was failing due to `overloadClientMethods: true` — fixed by setting to `false`
- Session (2026-05-26): Extended teamMember categories, restructured /team page with 5 sections, added HonorarySection + TeamPhotoBanner components
- `prebuild` script runs `sanity schema extract && sanity typegen generate` before each build
- Session (2026-06-03): Converted ministry.leader to weak reference, created migration script, added preventive weak-reference rules to code-standards, architecture, AGENTS.md
