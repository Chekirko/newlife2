# Code Standards

- Contact form: page-local Server Action validates FormData with Zod and honeypot before delivery. Mail/Redis modules use `server-only`; all credentials stay in server env, recipient comes from server config/CMS, visitor address is Reply-To only, payload is plain text. Use durable atomic Redis limits with TTL; fail closed if limiter/config is unavailable. Keep form values on error and announce statuses accessibly. Regression `tsx --conditions=react-server scripts/check-contact-form.ts` uses mocked HTTP and no live mail/Redis. See `docs/contact-form.md` for config and test boundaries.

## General

- Package manager: `pnpm@11.5.1`, pinned in `package.json#packageManager`. Vercel enables Corepack through `vercel.json#build.env.ENABLE_EXPERIMENTAL_COREPACK=1` so local and deployment installs use the same version. Do not infer pnpm's major from `lockfileVersion: 9.0`: pnpm 10 rejects the pnpm 11 string-form `patchedDependencies` metadata with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`. Validate dependency/patch changes with a clean `pnpm install --frozen-lockfile` in addition to `pnpm run build`.
- C4: work in a separate `codex/*` branch; user authorized commit + push after completed tasks for Vercel Preview. Run `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, and `pnpm run build`. CI runs one cached Ubuntu/Node 24 job on PRs to `master` and pushes to `master`; see `docs/ci.md`. Do not add test frameworks or expensive CI suites without a concrete regression/risk. Generated types and agent skill examples are outside ESLint; application/Studio/scripts rules stay enabled, warnings fail CI. C1 adds a third regression for contact validation/delivery with mock HTTP; the workflow itself is unchanged.
- Keep modules small and single-purpose
- Fonts are vendored WOFF2 with OFL licenses/source hashes in `public/fonts/`; use `app/fonts.css` and existing family tokens. Do not fetch fonts via `next/font/google` or remote CSS during build/runtime. This avoids Next 16.1.6's intermittent extensionless Google Fonts URL parser failure; see `public/fonts/README.md`.
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
- Для повнорозмірних фото використовувати `originalImageUrl()` + `Image unoptimized`: helper ігнорує crop/hotspot, встановлює `.quality(100)`, не задає `.width()/.height()/.auto()`. Next.js не стискає повторно. Розміри з asset metadata задають layout, а не CDN resize. Це повна роздільність із максимальною якістю CDN, не гарантія побітового оригіналу: навіть базовий URL Sanity може відрізнятися від завантажених байтів, а `dlRaw` вимагає авторизації. Для `news.gallery` проєктувати dimensions/LQIP, перевіряти asset і розміри, зберігати `w-full h-auto`; основне фото входить до тієї самої групи лайтбокса. Ліміт 10 забезпечується Studio validation і захисним обмеженням рендера; порожня галерея не створює секцію. Основне `news.image` валідується через `required().assetRequired()`.
- Пакетне додавання фото в Studio делегувати штатному `onSelectFile` через `GalleryInput`, із upload-capable source із `useFormBuilder().__internal.image`, без власного Sanity-клієнта, токенів чи перезаписування масиву через stale `set`. У Sanity 4.22 image/object-array input отримує `onSelectFile`, а не optional legacy `onUpload`; контракт звіряти з installed `ArrayOfObjectsField`, а не лише широкими TS-типами. Перевіряти добірку й кількість вільних місць до запуску upload. Regression check: `pnpm exec tsx --env-file=.env.local scripts/check-gallery-input.tsx` (props без `onUpload`). Лайтбокс повторно використовувати через `PhotoViewer`/`ImageLightbox`; modal-dialog має містити всі свої controls, підтримувати клавіатуру й відновлювати фокус.
- Static images live in `public/images/`
- The Sanity Client must be configured with `useCdn: false` in `client.ts` to allow background Next.js revalidation fetches to immediately bypass CDN cache and retrieve live, fresh data.

## File Organization

- Для пакетного додавання наявних gallery assets використовувати native array `onInsert`, не `set([...props.value, ...])`. Перед вставкою повторно перевіряти readOnly/залишок/дублікати; кожному image дати унікальний `_key`. Asset picker читає через `useClient` поточної Studio та `defineQuery` з параметрами; запити abort-яться при зміні пошуку/закритті, помилки доступні для retry. Не переносити multi-select на одиночні image-поля.
- Transitive dependency patch зберігати через `pnpm patch`/`patch-commit` разом із `patches/`, `pnpm-workspace.yaml`, lockfile ([офіційний workflow](https://pnpm.io/cli/patch)). Патч heartbeat logging вузький: не фільтрувати глобальний `console.error`, не змінювати auth/CORS чи retry. Regression: `pnpm exec node scripts/check-studio-reconnect.mjs` — віртуальний timeout 45000ms/145 chars, warning, error event, повторне підключення, справжній transport error і cleanup.
- `.gitattributes` фіксує `patches/*.patch -text`: не нормалізувати CRLF усередині generated patch, бо pnpm перевіряє hash точних bytes. Для staged whitespace-перевірки таких patch-файлів враховувати `core.whitespace=cr-at-eol`.

- Для пакетного додавання наявних gallery assets використовувати native array `onInsert`, не `set([...props.value, ...])`. Перед вставкою повторно перевіряти readOnly/залишок/дублікати; кожному image дати унікальний `_key`. Asset picker читає через `useClient` поточної Studio та `defineQuery` з параметрами; запити abort-яться при зміні пошуку/закритті, помилки доступні для retry. Не переносити multi-select на одиночні image-поля.
- Transitive dependency patch зберігати через `pnpm patch`/`patch-commit` разом із `patches/`, `pnpm-workspace.yaml`, lockfile. Патч heartbeat logging вузький: не фільтрувати глобальний `console.error`, не змінювати auth/CORS чи retry. Regression: `pnpm exec node scripts/check-studio-reconnect.mjs` — віртуальний timeout 45000ms/145 chars, warning, error event, повторне підключення, справжній transport error і cleanup.

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

- **JSON-LD SEO-5 (2026-10-26).** Усі scripts — через `jsonLdHtml()`; перевіряти round-trip `</script>`, quotes, Unicode. URL detail брати з route slug, IDs стабільні та спільні між сутностями. Dates через `schemaDate()`; CMS `_updatedAt` не доводить редакційного оновлення, media date не доводить uploadDate, publisher не доводить author. Description має походити з видимого body/fallback, із підтримкою legacy string. Не підставляти адресу/статус/організатора події без відповідних даних; Event без дати/назви/місця пропускати. Для YouTube watch використовувати `url` + `embedUrl`, не `contentUrl`. Media JSON-LD живе в `MediaGallery` та слідує поточному cards state. Regression: `pnpm exec node scripts/check-jsonld-seo.mjs`; відрізняти Schema.org валідність від Google eligibility, stale евристики локального validator не є нормативними вимогами.

Whenever a new public page or a new Sanity content type with a public detail route is added, keep the SEO surface in sync (this is part of the unit's Definition of Done — see `ai-workflow-rules.md`):

- **SEO-4.2 listings (2026-10-26).** Перед metadata/fetch викликати `normalizeListingParams()` з `lib/listing-params.ts`; враховувати `string[]` у searchParams. Невалідний page → 307 зі збереженням скалярного filter, коректний N поза count/порожня порція N≥2 → 404. У GROQ не передавати NaN/небезпечний slice; count перед slice. `LISTING_PER_PAGE` спільний для news/events і sitemap; page-local `cache()` зі скалярними аргументами узгоджує metadata/UI. Для непорожньої пагінації без filter — власний canonical/OG URL; filter/search — noindex і базовий canonical. `listingItems` лише вхід metadata, не вихідне поле. `isListingIndexable()` перевіряє схвалення списку й кожного видимого `_id`+slug; перша порція sitemap проходить той самий критерій і порядок/умови GROQ. Відсутній slug не виключати перед перевіркою готовності списку; порожній список не indexable, зокрема `/media`. Query URL поза початковим sitemap. Регресія `pnpm exec node scripts/check-listing-seo.mjs` перевіряє реальні helper/page/metadata/SSR/sitemap із синтетичними даними без CMS writes; runtime — production HTTP, включно зі звичайним UA та HTML-limited bot. Загальні noindex/Disallow зберігати до SEO-L.

- **SEO-4.1 readiness (2026-10-26).** [Контракт SEO-2.1](../docs/seo/audit.md#політика-готовності-для-seo-4-і-seo-l) реалізований у `lib/seo-readiness.ts`: `SEO_APPROVAL` початково `{ launch: null, pages: [] }`; окреме SEO-L записує origin/date запуску й path/date кожної схваленої сторінки, для CMS також `documentId` (published `_id`, поточний slug у path). `isPageIndexable()` спільний для metadata/sitemap, вимагає `VERCEL_ENV=production` і збігу погодженого origin із `SITE_URL`. Схвалення не виводити з published/slug/body; зміна slug/_id потребує нового запису, суттєві зміни фактів — повторної редакційної перевірки. CMS approval-полів немає. Privacy/Studio/unknown/query URL не проходять; query/пагінація окремо SEO-4.2. Root/header noindex та Disallow переглядати разом лише в SEO-L.
- **Sitemap reflects indexable URLs.** Add new static routes to `STATIC_SEO_ROUTES` in `lib/seo-readiness.ts`; це перелік наявних маршрутів, не схвалення. For a new Sanity document type with public detail pages, add a branch to `SITEMAP_QUERY`, its mapping and known detail family in the shared predicate. Sitemap читає published-перспективу, відбирає за спільним критерієм і прибирає дублікати; початково 0 URL. Сам запис у sitemap не надає дозволу на індексацію. Статичним URL не вигадувати lastmod; CMS використовує тільки валідний `_updatedAt`, без дати генерації як fallback.
- **Placeholders are excluded.** Unfinished pages use `export const metadata = { robots: { index: false } }` and stay outside the launch sitemap. Знімати noindex та додавати до sitemap можна лише після редакційного схвалення й окремого дозволу SEO-L, зі збереженням обмежень незавершених сторінок.
- **Dynamic CMS content is automatic.** Existing types covered by `SITEMAP_QUERY` need no manual query edits per item. Відбір застосовується лише до схвалених published-документів за `_id` + path; неперевірений новий матеріал за замовчуванням не indexable. Схвалений, але видалений/unpublished документ не потрапляє у sitemap; дата схвалення не є lastmod.
- **Pre-launch noindex (SEO-2.2).** Root `app/layout.tsx` задає `robots: { index: false, follow: true }`, `next.config.ts` — `X-Robots-Tag: noindex` на `/:path*`, включно з не-HTML ресурсами/RSC. Page-specific robots замінює батьківський об’єкт цілком: зберігати noindex (privacy/studio вже мають власні). Перевіряти production-build HTML та HTTP, одного typecheck недостатньо. Перед SEO-L разом переглянути root/header/per-page правила за спільною readiness-політикою; нових env-перемикачів немає.
- **Site-wide `robots.ts`** лишається `Disallow: /` до окремого дозволу SEO-L. Noindex є додатковим сигналом, не контролем доступу: за Disallow crawler може його не прочитати, відсутність URL у пошуку не гарантована. F01/platform protection залишається відкритим; не знімати жодних обмежень без явного дозволу користувача.
- **Add JSON-LD** appropriate to the new page type (load the `schema-markup` skill): Article/NewsArticle, Event, Person, BreadcrumbList, etc. Absolute URLs come from `SITE_URL` (`lib/site.ts`).
- **Render JSON-LD safely.** Serialize with `jsonLdHtml()` from `lib/utils.ts` (escapes `<` → `<`) inside `dangerouslySetInnerHTML` — never raw `JSON.stringify`, so CMS content containing `</script>` cannot break out of the `<script>` tag.
- **Canonical + social (SEO-3.1/3.2).** Статичні та 4 dynamic detail-шаблони використовують `generateMetadata()` → `getPageMetadata(path, page)` з `lib/metadata.ts`; передавати чинні title/description та явний `alternates.canonical`. Helper повертає повні OG/Twitter objects (Next.js не робить deep merge), узгоджені title/description/URL, siteName/uk_UA/image. Власний опис → наявний CMS defaultDescription → кодовий fallback; для detail — excerpt або `toPlainText()` із rich text (legacy string перевіряти через typeof), до 160 символів. Team зберігає попередній fallback за ім’ям. Опційний `image: {url,width,height,alt}` — лише вхід helper, не поле вихідного Metadata; фото матеріалу 1200×630 для social → CMS ogImage → hero fallback, title/description/image alt очищаються. Не змінювати заради social повнорозмірні фото UI. Root задає metadataBase/keywords/noindex, але НЕ глобальний canonical. Privacy поки без canonical, із власним noindex. Missing slug лишається 404/noindex; metadata без фото перевіряти окремо від UI, null-ref/JSON-LD — SEO-5.

## Security Headers & CSP

- HTTP security headers live in `next.config.ts` (`headers()`): `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `Permissions-Policy` — **enforced on all routes**.
- The Content-Security-Policy is currently **`Content-Security-Policy-Report-Only`** (non-blocking) with `/studio` excluded (Studio needs `unsafe-eval`/blob/ws). Flip it to the enforcing `Content-Security-Policy` only after a runtime smoke test (homepage scripts, Sanity images, Google Maps embed, Studio) — see `master-plan.md` → C2.
- Adding any external embed/script (e.g. YouTube for /media) requires updating the matching CSP source list (`frame-src`/`img-src`/`connect-src`).

## Accessibility (WCAG 2.2 AA)

- **Heading/links SEO-6.1:** рівень heading визначається структурою, а розмір — CSS; pre-title і повторне ім’я не потребують heading. `HeroSlider` залишає один H1 активного слайда, неактивні групи — `inert` + `aria-hidden`. Autoplay має видиме pause/play, focus stop, hover pause і reduced-motion default; pointer-down стан кнопки зберігається до click, щоб focus stop не перетворював pause click на play. CTA без href не підмінювати `#`; внутрішні fragments перевіряти на реальний id цілі та відступ під fixed header. `scripts/check-heading-seo.mjs` перевіряє справжній компонент через VM state/SSR; browser keyboard/mobile QA лишається окремою перевіркою. Інші heading templates ще не уніфіковані (F11/SEO-6.2+).

- **Color contrast**: text on white must be ≥4.5:1. Use `text-gray-600`/`text-gray-800` for readable body text — `--color-gray-500`/`-600` are tuned to pass AA. Verify new color pairs with `.agents/skills/a11y-audit/scripts/contrast_checker.py "<fg>" "<bg>"`.
- **White text on gradients** goes only on the darker `--gradient-btn-*` (`.btn-grad` / `.bg-grad-readable`), never the bright decorative `--gradient-start/end`. Keep normal copy opaque; do not lower the opacity of enabled buttons on hover. `.gradient-text` uses dark stops on light surfaces. White-button labels must remain dark inside `.all-text-white`.
- **Focus**: rely on the global `:focus-visible` outline; never set `outline:none`/`ring-0` without an equally visible replacement.
- **Green text on light backgrounds**: use `text-primary-text` (`--color-primary-text: #216e4e`), including hover/active states; `--color-primary` remains the bright decorative accent. Do not lower link opacity on hover. Focus rings/borders must stay opaque and visible.
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
