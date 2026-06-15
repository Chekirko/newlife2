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
- Configure all dynamic, CMS-connected pages with `export const revalidate = 60` to enforce Incremental Static Regeneration (ISR)

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
- The Sanity Client must be configured with `useCdn: false` in `client.ts` to allow background Next.js revalidation fetches to immediately bypass CDN cache and retrieve live, fresh data.

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

## Sanity References

- Усі `reference`-поля в Sanity-схемах ЗАВЖДИ визначаються з `weak: true` — це дозволяє видаляти referenced-документи без блокування
- При рендері referenced-даних (через GROQ `->`) ЗАВЖДИ перевіряти на `null`: `{data.refField && <Component />}` або `{data.refField?.name && (...)}`
- TypeScript типи для reference-полів ЗАВЖДИ моделюються як `| null`
- Якщо referenced-документ видалений — UI gracefully ховає відповідний блок, а не показує помилку або порожні дані
- При створенні нової Sanity-схеми з reference-полем — обов'язково написати відповідний null-guard у компоненті ДО деплою

## Sanity Singletons & Site-wide Settings

- **Singleton pattern**: a document type that must have exactly ONE instance (e.g. `siteSettings`) is enforced in two places — (1) `sanity/structure.ts` pins a single fixed list item via `S.document().schemaType('x').documentId('x')` (the `documentId` equals the type name), and (2) `sanity.config.ts` strips `create`/`delete`/`duplicate`/`unpublish` from `document.actions` for that type (see `SINGLETON_TYPES` set). To add a new singleton, register it in both places.
- **Seed singletons with a fixed `_id`** equal to the type name via `createOrReplace` (idempotent). Pattern: `scripts/seed-site-settings.ts` (dry-run by default, `--write` to commit; needs `SANITY_API_WRITE_TOKEN`).
- **Server-fetch → client props**: a Client Component (`'use client'`) cannot fetch from Sanity. Fetch the data in the nearest Server Component (the layout/page) and pass it down as props. `app/(front)/layout.tsx` fetches `getSiteSettings()` once and passes `settings` to both `ChurchHeader` (client) and `ChurchFooter` (server) — never fetch the same singleton twice in one render.
- **`getSiteSettings()` fallback-merge**: `lib/site-settings.ts` reads the `siteSettings` singleton and merges it OVER the `lib/church.ts` defaults — any field left empty in the CMS falls back to `church.ts`, so the UI/JSON-LD never break. `church.ts` is the typed fallback AND the canonical data SHAPE; keep them in sync when adding settings fields.
- **Extensible "pick + render" lists (social links pattern)**: for a CMS list whose items each need an icon/color/label (e.g. socials), model it as a Sanity **array** of `{ platform, url, label? }` where `platform` is a `string` with `options.list`. Keep the platform→icon/color/label mapping in ONE code registry (`lib/social.ts`: `SOCIAL_PLATFORMS`, `SOCIAL_PLATFORM_OPTIONS`, `resolveSocialLink()`), imported by BOTH the schema (to build the dropdown) and the frontend (to render). A manager adds/reorders any registered platform with zero code; a novel one uses the `other` fallback (generic icon + custom label). `getSiteSettings()` resolves the raw array into render-ready items and derives `sameAs` from their URLs — never hardcode per-platform `<a>` blocks in components.

## SEO & New Pages

Whenever a new public page or a new Sanity content type with a public detail route is added, keep the SEO surface in sync (this is part of the unit's Definition of Done — see `ai-workflow-rules.md`):

- **Sitemap is the source of truth for indexable URLs.** Add new static routes to `STATIC_ROUTES` in `app/sitemap.ts`. For a new Sanity document type with public detail pages, add a branch to `SITEMAP_QUERY` (mirroring the news/ministries/team pattern) and map it into the dynamic entries.
- **Placeholders are excluded.** Unfinished pages use `export const metadata = { robots: { index: false } }` and are NOT listed in the sitemap until real. Remove the `noindex` and add them to the sitemap in the same change that makes them real.
- **Dynamic CMS content is automatic.** Existing types already covered by `SITEMAP_QUERY` (news, ministry, teamMember) need no manual sitemap edits per item.
- **Site-wide `robots.ts`** is `Disallow: /` while pre-launch; per-page `noindex` controls indexing once the site is opened at launch. Do not open site-wide indexing without explicit user go-ahead (see progress-tracker → Launch checklist).
- **Add JSON-LD** appropriate to the new page type (load the `schema-markup` skill): Article/NewsArticle, Event, Person, BreadcrumbList, etc. Absolute URLs come from `SITE_URL` (`lib/site.ts`).

## Naming Conventions

- Components: PascalCase (`EventsSlider.tsx`)
- Utilities: camelCase (`formatDate`)
- GROQ queries: UPPER_SNAKE_CASE (`NEWS_PAGINATED_QUERY`)
- CSS classes: kebab-case with BEM-like prefixes (`btn-grad`, `container-larexa`)
- Sanity types: `Sanity` prefix (`SanityNews`, `SanityMinistry`)
