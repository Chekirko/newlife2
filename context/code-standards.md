# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes — do not layer workarounds
- Do not mix unrelated concerns in one component
- Follow DRY — shared logic belongs in `lib/utils.ts`
- Every component file exports via named export (not default, except pages)

## TypeScript

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or `unknown` with narrowing
- Types for Sanity documents live in `sanity/lib/types.ts` (manual) and `sanity/lib/sanity.types.ts` (TypeGen auto)
- Use TypeGen-generated types where available; fall back to manual types for edge cases
- All GROQ query results must be typed (either via TypeGen or manual generics on `client.fetch<T>()`)

## Next.js (App Router)

- Default to Server Components — add `'use client'` only when browser interactivity requires it
- Use `async` Server Components for data fetching (no `useEffect` for initial data)
- Lazy-load below-fold client components with `next/dynamic`
- Each page owns its own `queries.ts` for page-specific GROQ queries
- Shared queries (used on 2+ pages) stay in `sanity/lib/queries.ts`
- Use `generateStaticParams()` for dynamic SSG routes
- Use `generateMetadata()` for dynamic SEO

## Styling

- Use Tailwind CSS v4 utility classes as the primary styling method
- Use CSS custom property tokens from `globals.css` — no hardcoded hex values
- Brand gradient: `--gradient-start: #97c74e` → `--gradient-end: #2ab9a5`
- Primary color: `--color-primary: #4cbd89`
- Frosted-glass pattern for hero sections — use `PageHero` shared component
- Follow the border radius scale defined in `globals.css` (`--radius`, `--radius-sm/md/lg`)
- Button styles use `.btn-*` component classes from `globals.css`

## Data and Storage

- All CMS content comes from Sanity — never hardcode news, events, or ministries
- Static data (hero slides, testimonials, FAQ items) lives as constants in page files
- Images from Sanity use `urlFor()` from `@/sanity/lib/image`
- Static images live in `public/images/`

## File Organization

- `app/(front)/` — Pages and page-scoped components
- `app/(front)/[page]/components/` — Components used ONLY by that page
- `app/(front)/[page]/queries.ts` — GROQ queries scoped to that page
- `components/` — Shared components (barrel via `index.ts`)
- `components/sections/` — Shared section components (Hero, NewsSlider, PageHero)
- `components/ui/` — Shared base UI components (MinistryCard)
- `sanity/lib/` — Sanity utilities, shared queries, types
- `sanity/schemaTypes/` — Sanity document schemas
- `lib/` — General utilities
- `context/` — AI context files (this system)

## Naming Conventions

- Components: PascalCase (`EventsSlider.tsx`)
- Utilities: camelCase (`formatDate`)
- GROQ queries: UPPER_SNAKE_CASE (`NEWS_PAGINATED_QUERY`)
- CSS classes: kebab-case with BEM-like prefixes (`btn-grad`, `container-larexa`)
- Sanity types: `Sanity` prefix (`SanityNews`, `SanityMinistry`)
