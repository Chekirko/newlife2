# Architecture Context

Канон змін — [master-plan](master-plan.md), рішення B1–B8. Нижче описано поточну реалізацію та окремо заплановані заміни; Фаза 0 не змінює runtime.

## Stack

Next.js 16 App Router, React 19, TypeScript strict; Sanity 4 + `next-sanity`/TypeGen; Tailwind v4; Vercel. Менеджер пакетів — pnpm із `package.json#packageManager`. Шрифти локальні WOFF2; поточні Poppins/Roboto/Playfair Display замінюються за B4 у Фазі 1.

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

Root layout задає metadata/шрифти/стилі. `(front)/layout.tsx` отримує `getSiteSettings()` і передає settings у header/footer, додає skip-link та main. Footer — async Server Component, читає посилання на служіння. Глобальний 404 додає хром сам; segment 404 успадковує front-layout; `error.tsx` — клієнтська межа помилок.

## Storage Model

- Content Lake — джерело редакційного контенту; `lib/*-data.ts` і `lib/church.ts` — типізовані фолбеки, не друга CMS.
- Singletons: `siteSettings`, `homepage`, `pageHeroes`, `aboutPage`; фіксований `_id` і заборона create/delete/duplicate/unpublish узгоджені між `sanity/structure.ts` та `sanity.config.ts`.
- `getSiteSettings()` об’єднує CMS із `church.ts`: NAP, розклад, гео, соцмережі, SEO defaults. Реєстр платформ — `lib/social.ts`. `getHomepage()`, `getAboutPage()`, `getPageHeroes()` мають відповідні типізовані фолбеки.
- `news`, `event`, `ministry`, `teamMember`, `mediaItem` — колекції. `event.type` розділяє події й оголошення; на головній події видимі весь день, оголошення — до `activeUntil` або `startDate`. Часові межі ще потребують Europe/Kyiv (Фаза 1).
- `ministry.leaders[]` → weak references на `teamMember`; `news.ministries[]` → weak references на ministry; `homepage.featuredSermon` → weak reference на mediaItem. Відсутні referenced-дані фільтруються до рендеру. Одна відповідальна особа й кілька мають окремі layout-гілки.
- Довгі тексти — Portable Text, спільний `richTextBlocks` у `sanity/schemaTypes/objects/richText.ts`; excerpt-поля прості. `PortableTextBody` рендерить блоки та підтримує legacy string.
- `news.image` — required asset; `news.gallery` — до 10 фото. GROQ проєктує dimensions/LQIP; відсутні assets пропускаються. `/media/photos` агрегує `ministry.gallery`, а не галереї новин.

## Caching and Revalidation Model

**Зараз:** Sanity client має `useCdn: false`; більшість сторінок — `revalidate = 60`, singleton fetch має `next.revalidate: 60`. Ministry/team detail мають `generateStaticParams()`. `/news`, `/events`, `/media` читають `searchParams` і рендеряться динамічно; news/event detail не мають `generateStaticParams()`. Оголошення `revalidate = 60` саме по собі не робить такі маршрути статичними.

Пошук/фільтри великих медіаколекцій виконуються GROQ на сервері. Початкові props приходять зі сторінки; `searchMedia`/`loadMoreMedia` — Server Actions, спільний transformer у `lib/media.ts`. Клієнт оновлює грид і shallow URL без завантаження всієї колекції. Фото наразі перемішуються при ISR.

**Фаза 2 / B6:** static-first, пагінація шляхами та on-demand revalidation через Sanity webhook. Це ще не реалізовано; часові блоки мають залишатися актуальними без ручного редагування CMS — врахувати в цій фазі.

## Images and UI boundaries

**Зараз:** detail/gallery/rich-text фото використовують `originalImageUrl()` (`q=100`, повні dimensions, ігнорування crop/hotspot) + `Image unoptimized`. `PhotoViewer` відкриває native modal `ImageLightbox`, який зберігає індекс, підтримує Esc/стрілки/бекдроп, scroll lock і focus restore. `DeferredGalleryImage` у ministry/media мозаїках монтує фото біля viewport, із LQIP та noscript; сусіди viewer завантажуються після поточного фото. Hero вже використовує Next Image, але слайдер лишається клієнтським.

**Фаза 1 / B1, B3, B4:** адаптивні Sanity CDN прев’ю; оригінал лише на вимогу; видалення deferred-original механізму; SVG-іконки замість повного FA CSS; Montserrat/Roboto/Playfair через `next/font/local`; мінімальні клієнтські острівці. **Фази 4–5 / B5, B7:** Larexa й статичний hero головної — [spec 08](specs/08-larexa-redesign.md).

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
