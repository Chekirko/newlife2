# Architecture Context

Канон змін — [master-plan](master-plan.md), рішення B1–B8. Фундамент Фази 1 реалізовано; static-first і новий indexing-механізм ще попереду.

## Stack

Next.js 16 App Router, React 19, TypeScript strict; Sanity 4 + `next-sanity`/TypeGen; Tailwind v4; Vercel. Менеджер пакетів — pnpm із `package.json#packageManager`. Локальні variable WOFF2: Roboto, Montserrat і Playfair Display italic через `next/font/local`; кожен обрізаний до Google-діапазонів latin + cyrillic (40–52 КБ, перелік — `public/fonts/sources.json#unicodes`).

## System Boundaries

| Шлях | Відповідальність |
| --- | --- |
| `app/(front)/` | Публічні сторінки, page-local `components/`, `queries.ts`, `actions.ts` |
| `components/`, `components/sections/`, `components/ui/` | Компоненти, спільні для кількох сторінок; `PortableTextBody`, hero, фото-переглядач |
| `sanity/schemaTypes/`, `sanity/components/` | Контент-модель і Studio inputs |
| `sanity/lib/` | CMS client, спільні GROQ, image helpers, типи |
| `lib/` | Перетворення даних, налаштування/фолбеки CMS, metadata, утиліти |
| `public/` | Логотипи, локальні фото/шрифти та ліцензії |
| `app/studio/` | Вбудоване Studio, окрема Sanity-авторизація |

Спільного `app/layout.tsx` немає: `(front)/layout.tsx` — public root із metadata/шрифтами/site CSS, `studio/layout.tsx` — окремий мінімальний root без них. Public root отримує settings, додає skip-link/main і серверні header/footer. Header має CSS sticky, top bar у потоці; `MobileMenu`, `NavDropdown`, `NavLink` — клієнтські острівці. Unknown public URLs через `[...notFound]` викликають segment 404 у тому самому root; `error.tsx` — клієнтська межа помилок.

## Storage Model

- Content Lake — джерело редакційного контенту; `lib/*-data.ts` і `lib/church.ts` — типізовані фолбеки, не друга CMS.
- Singletons: `siteSettings`, `homepage`, `pageHeroes`, `aboutPage`; фіксований `_id` і заборона create/delete/duplicate/unpublish узгоджені між `sanity/structure.ts` та `sanity.config.ts`.
- `getSiteSettings()` об’єднує CMS із `church.ts`: NAP, розклад, гео, соцмережі, SEO defaults. Реєстр платформ — `lib/social.ts`. `getHomepage()`, `getAboutPage()`, `getPageHeroes()` мають відповідні типізовані фолбеки.
- `news`, `event`, `ministry`, `teamMember`, `mediaItem` — колекції. `event.type` розділяє події й оголошення; на головній події видимі весь київський день, оголошення — до `activeUntil` або `startDate`. `lib/utils.ts` форматує дати/час і початок дня в Europe/Kyiv, включно з DST.
- `ministry.leaders[]` → weak references на `teamMember`; `news.ministries[]` → weak references на ministry; `homepage.featuredSermon` → weak reference на mediaItem. Відсутні referenced-дані фільтруються до рендеру. Одна відповідальна особа й кілька мають окремі layout-гілки.
- Довгі тексти — Portable Text, спільний `richTextBlocks` у `sanity/schemaTypes/objects/richText.ts`; excerpt-поля прості. `PortableTextBody` рендерить блоки та підтримує legacy string.
- `news.image` — required asset; `news.gallery` — до 10 фото. GROQ проєктує dimensions/LQIP; відсутні assets пропускаються. `/media/photos` агрегує `ministry.gallery`, а не галереї новин.

## Caching and Revalidation Model

**Зараз:** Sanity client має `useCdn: false`; більшість сторінок — `revalidate = 60`, singleton fetch має `next.revalidate: 60`. Ministry/team detail мають `generateStaticParams()`. `/news`, `/events`, `/media` читають `searchParams` і рендеряться динамічно; news/event detail не мають `generateStaticParams()`. Оголошення `revalidate = 60` саме по собі не робить такі маршрути статичними.

Пошук/фільтри великих медіаколекцій виконуються GROQ на сервері. Початкові дані й готові RSC-картки приходять зі сторінки; `searchMedia`/`loadMoreMedia` повертають `{cards, views}` (пошук також `total`). `cards` живлять лічильник/JSON-LD, `views` — серверну розмітку. Спільний transformer — `lib/media.ts`; `MediaGallery` оновлює грид і shallow URL. Фото наразі перемішуються при ISR.

**Фаза 2 / B6:** static-first, пагінація шляхами та on-demand revalidation через Sanity webhook. Це ще не реалізовано; часові блоки мають залишатися актуальними без ручного редагування CMS — врахувати в цій фазі.

## Images and UI boundaries

`SiteImage` — тонка клієнтська обгортка Next Image: Sanity URLs отримують власний loader (`w`, пропорційний `h` для crop, q=75, auto=format), локальні файли — Next optimizer AVIF/WebP. `toPhotoItem()` створює адаптивний `thumbUrl` і `fullUrl` оригіналу; сторінки/галереї/rich text рендерять лише прев’ю. Немає asset → `ImagePlaceholder`; gallery без dimensions пропускається. CSS-фото замінено Image; фото пастора лишається нативним SVG `<image>` у кліпі з CDN URL (без `foreignObject`, який ненадійний у WebKit).

`PhotoViewer` і photo gallery імпортують `ImageLightbox` через `next/dynamic` при відкритті. Фото й відео використовують native modal dialog: Esc/бекдроп, scroll lock/focus restore; фото також ←→/межі й завантаження оригіналу. Сусіди viewer вантажаться після поточного оригіналу. `VideoPlayButton` — клієнтський острівець у серверних FeaturedSermon/MediaCard; YouTube cover — стандартний hqdefault. Карта — Google iframe одразу (`loading="lazy"`) + посилання «Відкрити в Google Maps»; фасад відхилено користувачем 2026-10-27. Live iframe lazy, демо-Vimeo прибрано.

`Icon` + `lib/icons.ts` рендерять inline SVG із наявних CMS FA-назв; CMS-реєстр захищений server-only, client controls мають окремий малий ControlIcon зі спільним SvgIcon; icon fonts/CSS і пряму залежність motion видалено. Статичні секції, FAQ/details і pagination — серверні; `HeroGradientImage` відокремлено. HeroSlider ще клієнтський: hydration-safe reduced-motion через useSyncExternalStore, спершу монтується лише перше фото, після його завантаження — сусіди активного слайда (eager). **Фази 4–5 / B5, B7:** Larexa й статичний hero головної — [spec 08](specs/08-larexa-redesign.md).

## Contact and Studio

Контактна форма: page-local Server Action → Zod/honeypot → server-only delivery → атомарний Upstash EVAL → Resend. Одержувач — server env/CMS, visitor email лише Reply-To, лист plain text. Звернення не пишуться у CMS/browser/logs; Redis зберігає HMAC buckets із TTL. Відсутній конфіг/лімітер — відмова, успіх лише після прийняття провайдером. Деталі й межі QA — [contact-form](../docs/contact-form.md).

Studio `GalleryInput` делегує multiple upload нативному `onSelectFile`; `GalleryAssetPicker` читає assets через Studio `useClient` і параметризований `defineQuery`, вставляє одну добірку native `onInsert`. Захист від дублів/readOnly/перевищення 10; без власних токенів чи переписування всього масиву. Media plugin — single-image source/бібліотека.

`event-source-polyfill` має pnpm patch лише для recoverable heartbeat logging: warning замість dev overlay; error events/retry/реальні помилки збережені. `patches/`, workspace config і lockfile — єдиний комплект.

## Auth and Access Model

Публічний сайт без акаунтів; Studio — Sanity login. Поточний pre-launch: root/page noindex, `X-Robots-Tag: noindex`, `robots.ts` із `Disallow: /`, порожній sitemap. `lib/seo-readiness.ts` містить порожній реєстр схвалень для metadata/sitemap. Це пошукові сигнали, а не обмеження доступу; заборона crawl заважає прочитати noindex.

**Фаза 3 / B2:** заміна реєстру одним перемикачем `SITE_INDEXING=on` + Production і документним `seo.noIndex`; узгодження robots/meta/header/sitemap. Запуск лишається окремою дією за явним «готово» — [§F](master-plan.md#f-launch-checklist-найостанніший-крок). CSP поки Report-Only, Studio виключене; enforce без nonce — Фаза 7 / B8.

## Invariants

1. GROQ через `defineQuery()`; query/schema зміни → `pnpm run typegen`; типи не редагувати вручну.
2. Усі schema references — `weak: true`; referenced-дані nullable, рендер із null-guard.
3. Fetch контенту на сервері, props у клієнт; Studio `useClient` — окрема авторизована межа.
4. Спільні компоненти не імпортують page-local компоненти; виносити спільне лише за реального reuse.
5. NAP/розклад/соцмережі UI та JSON-LD — через `getSiteSettings()`; абсолютні URL — `lib/site.ts` → `SITE_URL`.
6. JSON-LD — `jsonLdHtml()`, факти й дати лише з наявних даних; metadata і видимий контент узгоджені.
7. Лише pnpm; build перед завершенням фази; Windows довгі команди через `cmd /c`.
8. Поточна реалізація не скасовує нових рішень master-plan. Історичні результати — [архів tracker](archive/2026-10-27/progress-tracker.md) та [SEO audit](../docs/archive/seo-codex-2026-10/audit.md).
