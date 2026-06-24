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
- Client-triggered incremental loads ("Завантажити ще") use a **Server Action** (`'use server'`), co-located as `app/(front)/[page]/actions.ts`, that returns already-transformed data for the client to append — no API route, no client-side Sanity client
- Велику колекцію (тисячі+) фільтруй/шукай/пагінуй на СЕРВЕРІ через GROQ (`match` + slice `[$start...$end]`), а не на клієнті in-memory. **Початковий рендер** читає `searchParams` (прямий лінк/SEO → сторінка dynamic `ƒ`); **інтерактивна зміна фільтра** — клієнтський виклик Server Action (НЕ навігація), що оновлює лише результати, + плавна анімація; URL синхронізуй шалов через `history.replaceState`, не `router.push` (див. `architecture.md` → інваріант 12)
- Трансформ raw→view-model, спільний для сторінки та Server Action, виноситься в `lib/` (одне джерело правди)

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

## Rich Text (Portable Text)

- Long-form **body** fields (news `body`, event `body`, ministry `fullDescription`, teamMember `bio`) are **Portable Text** (`type: 'array', of: richTextBlocks`). The toolbar is defined ONCE in `sanity/schemaTypes/objects/richText.ts` (`richTextBlocks`): heading styles H2–H4 + Quote (these set the on-page text size — no custom px decorators), `strong`/`em`/`underline` decorators, bullet & numbered lists, a `link` annotation, and inline images (with `alt`). Add a new rich field by importing `richTextBlocks` and spreading it into `of`.
- **Excerpt/card fields stay plain** `text` (news), `description` (event), `shortDescription` (ministry) — used by cards, sliders, and SEO meta. Never render Portable Text in a card; never put the card summary inside the rich field.
- Render bodies with the shared **`PortableTextBody`** Server Component (`components/PortableTextBody.tsx`, exported from `@/components`) — it maps every node to the site's typography (no `prose` plugin is installed, so the `prose` classes are inert; use this component, not raw `<PortableText>`). It also falls back to a plain `<p>` if handed a legacy string, so a not-yet-migrated document never throws.
- **Detail-page GROQ** must deref inline-image dimensions: `body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } }` (same for `fullDescription`/`bio`). `next/image` uses those dimensions.
- For SEO `description` derived from a rich field, use `toPlainText()` from `@portabletext/react` (e.g. team bio); plain excerpt fields need no conversion.
- Converting a `text` field to Portable Text changes its stored type — run `scripts/migrate-portable-text.ts` (`pnpm migrate:pt`, dry-run by default, `--write` to apply) to convert existing string values to blocks.

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
- **Render JSON-LD safely.** Serialize with `jsonLdHtml()` from `lib/utils.ts` (escapes `<` → `<`) inside `dangerouslySetInnerHTML` — never raw `JSON.stringify`, so CMS content containing `</script>` cannot break out of the `<script>` tag.
- **Canonical + social.** Every indexable page sets `alternates: { canonical: '/path' }` (resolved against `metadataBase`; dynamic pages build it from the slug). Root `app/layout.tsx` holds the default OpenGraph (`url`/`siteName`/`locale: uk_UA`/image) + Twitter `summary_large_image`. Do NOT set a global canonical — it would mis-canonicalize every page to one URL.

## Security Headers & CSP

- HTTP security headers live in `next.config.ts` (`headers()`): `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `Permissions-Policy` — **enforced on all routes**.
- The Content-Security-Policy is currently **`Content-Security-Policy-Report-Only`** (non-blocking) with `/studio` excluded (Studio needs `unsafe-eval`/blob/ws). Flip it to the enforcing `Content-Security-Policy` only after a runtime smoke test (homepage scripts, Sanity images, Google Maps embed, Studio) — see `master-plan.md` → C2.
- Adding any external embed/script (e.g. YouTube for /media) requires updating the matching CSP source list (`frame-src`/`img-src`/`connect-src`).

## Accessibility (WCAG 2.2 AA)

- **Color contrast**: text on white must be ≥4.5:1. Use `text-gray-600`/`text-gray-800` for readable body text — `--color-gray-500`/`-600` are tuned to pass AA. Verify new color pairs with `.agents/skills/a11y-audit/scripts/contrast_checker.py "<fg>" "<bg>"`.
- **White button text** goes only on the darker `--gradient-btn-*` (via `.btn-grad`), never the bright decorative `--gradient-start/end`.
- **Focus**: rely on the global `:focus-visible` outline; never set `outline:none`/`ring-0` without an equally visible replacement.
- **Interactive elements**: use native `<button>`/`<a>`; menus/disclosures need `aria-haspopup`/`aria-expanded`, keyboard open/close (Escape), and must not be hover-only. Active nav links get `aria-current="page"`.
- **Decorative icons** (`<i class="fa…">`, inline SVG) get `aria-hidden="true"`; icon-only controls get an `aria-label`.
- **Images**: section/hero backgrounds use `next/image` (`fill priority`, empty `alt=""` when decorative), not CSS `background-image`.
- **Font Awesome** is self-hosted (`@fortawesome/fontawesome-free`, imported in `app/layout.tsx`) — do not re-add the cdnjs `<link>`.

## Naming Conventions

- Components: PascalCase (`EventsSlider.tsx`)
- Utilities: camelCase (`formatDate`)
- GROQ queries: UPPER_SNAKE_CASE (`NEWS_PAGINATED_QUERY`)
- CSS classes: kebab-case with BEM-like prefixes (`btn-grad`, `container-larexa`)
- Sanity types: `Sanity` prefix (`SanityNews`, `SanityMinistry`)
