# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Improvement roadmap agreed (2026-06-15) after deep audit. Executing **Phase 0 — Foundation**.

## Current Goal

- Phase 0, Unit 0.2: stub pages (/about, /media, /privacy) + not-found.tsx + error.tsx; fix footer ministry-slug links. See **Improvement Roadmap** below.

## Improvement Roadmap (agreed 2026-06-15)

Deep audit completed. Agreed working rules for this roadmap:
- Update this tracker after EVERY completed unit (not in advance). Sync other context files when their domain changes (architecture/UI/standards).
- ASK the user for design direction BEFORE building any new page (user provides references / recommendations).
- After EVERY completed unit: show the user what was done (summary + key files/changes). Commit + push to `origin` (Chekirko/newlife2) ONLY after the user approves.
- Load the matching `.agents/skills/*/SKILL.md` per unit (schema-markup, seo-audit, a11y-audit, performance-profiler, security-guidance, senior-frontend/fullstack, karpathy-coder).

Agreed product decisions:
- Homepage static content → **fully migrated to Sanity CMS**.
- Priority new pages: **/about, /media, /give**.
- News body → **Portable Text** (one rich-text field, per-paragraph formatting) — Phase 1.8.

### Phase 0 — Foundation (in progress)
- ✅ 0.1 `SITE_URL` env constant (`lib/site.ts`) + `metadataBase` in root layout; de-hardcoded `https://newlife.church` from team/ministry JSON-LD. `SITE_URL` auto-detects Vercel production URL (`VERCEL_PROJECT_PRODUCTION_URL`) so canonical/OG URLs are correct before a custom domain exists. (done 2026-06-15, build ✓)
- 0.2 Stub pages to kill 404s: `/about`, `/media`, `/privacy` + custom `not-found.tsx` + `error.tsx`; fix or make dynamic the hardcoded footer ministry-slug links.
- 0.3 `app/robots.ts` + `app/sitemap.ts` (dynamic from Sanity: news/ministries/team/events slugs).
- 0.4 `Organization` + `Church`/`LocalBusiness` + `WebSite` JSON-LD on homepage (address, geo, phone, openingHours, sameAs).

### Phase 1 — Content model + homepage→CMS (split per type/section)
- 1.1 `siteSettings` singleton (contacts, schedule, socials, OG defaults) → header/footer/home; feeds 0.4 JSON-LD.
- 1.2 hero slides → CMS · 1.3 service schedule → CMS (structured, feeds openingHours)
- 1.4 testimonials → CMS · 1.5 FAQ → CMS (+FAQPage JSON-LD) · 1.6 "what you'll find" + stats → CMS
- 1.7 `event`: real date/place fields → `/events` + `/events/[slug]` + Event JSON-LD
- 1.8 `news`: Portable Text body + NewsArticle JSON-LD (+ migrate existing `text`)

### Phase 2 — Accessibility + UI/UX
- WCAG AA contrast fix (gray-500/600, white-on-gradient buttons), focus-visible, keyboard-accessible dropdown, skip-link, aria-current; hero/PageHero → `next/image`; Font Awesome self-host/replace.

### Phase 3 — New pages (ASK design first)
- `/about`, `/media` (YouTube archive + live), `/give` (requisites) + homepage sections (latest sermon, Telegram, plan-your-visit).

### Phase 4 — Integrations
- Real contact form (server action + zod + honeypot/rate-limit), security headers, optional Sanity webhook on-demand revalidation, CI.

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

- See **Improvement Roadmap** above. Active: Phase 0, Unit 0.1.
- Sanity content audit: unique gallery images per ministry

## Open Questions

- Дизайн нових сторінок (/about, /media, /give) — узгодити з замовником ПЕРЕД версткою (Phase 3).
- Footer: захардкоджені slug служінь (`/ministries/children` тощо) — прибрати чи зробити динамічними з Sanity (Unit 0.2)?
- Пріоритет Portable Text (1.8): лишити у Фазі 1 чи підняти одразу після Фази 0?

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
- Session (2026-06-15): Deep project audit. Found broken nav links (/about, /media, /privacy, /sitemap → 404), missing sitemap/robots, missing Organization/LocalBusiness/Event/NewsArticle JSON-LD, WCAG AA contrast failures (gray-500/600, white-on-gradient buttons), fake contact form, hardcoded homepage content + duplicated contact/schedule data. Agreed phased Improvement Roadmap; user chose: start Phase 0, migrate homepage fully to CMS, priority pages /about /media /give, Portable Text for news.
