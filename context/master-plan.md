# Master Plan — сайт церкви «Нове Життя»

> **Єдиний чинний план проєкту** (консолідовано 2026-10-27 після аудиту роботи Codex на гілці `codex/seo-1-audit`). Замінює попередній master-plan — він в архіві: [archive/2026-10-27/master-plan.md](archive/2026-10-27/master-plan.md). Деталі редизайну — [specs/08-larexa-redesign.md](specs/08-larexa-redesign.md). Канон процес-правил — [ai-workflow-rules.md](ai-workflow-rules.md). Поточний стан — [progress-tracker.md](progress-tracker.md).

**Стек:** Next.js 16 (App Router, RSC) + Sanity 4 + Tailwind v4, Vercel, лише українська, **pre-launch** (індексація закрита).
**Пріоритет користувача:** серверні сторінки (RSC + статична генерація), Lighthouse ~100, дизайн строго за Larexa.

## Зміст
- [A. Аудит роботи Codex](#a-аудит-роботи-codex)
- [B. Рішення](#b-рішення-adr-lite)
- [C. Фази 0–9](#c-фази)
- [D. Дії власника](#d-дії-власника-не-код)
- [E. Рекомендації](#e-рекомендації-функціонал-uiux-техніка)
- [F. Launch checklist](#f-launch-checklist-найостанніший-крок)
- [G. Правила процесу](#g-правила-процесу)
- [H. Що вже зроблено](#h-що-вже-зроблено-не-повторювати)

---

## A. Аудит роботи Codex

Стан на 2026-10-27: 22 коміти на `codex/seo-1-audit`, **не злиті в master** (production цієї роботи не має). Mobile Lighthouse: Performance 61–72, Accessibility 96, Best Practices 100, SEO 69 (через noindex). 3 625 із 5 205 доданих рядків — документація.

### A1. Помилки підходу
1. **Мікроюніти з непропорційним QA.** Одна зміна H4→H2 = окрема сесія з хешами файлів і десятками перевірок посилань. ~10 комітів лише змінювали рівні заголовків (мінімальний SEO-ефект), а кореневі причини низького Lighthouse відкладались.
2. **Лікування симптомів.** D2.1: `font-display: swap` для Font Awesome — Performance 66→66, бо причина (повний FA CSS 74 КБ render-blocking + ~300 КБ шрифтів для ~50 іконок) лишилась. D9: відкладене завантаження оригіналів зменшило трафік на 83%, але LCP не змінився.
3. **Неусвідомлений trade-off.** Повнорозмірні оригінали q=100 прийняті як обмеження без пояснення, що з ними ціль Lighthouse недосяжна. (Рішення переглянуто — див. B1.)
4. **Робота, яку доведеться переробити.** Рівні заголовків виправлялись у компонентах із ШІ-дизайном, що підлягають заміні на Larexa.
5. **Документація як журнал погоджень.** Сотні абзаців «commit погоджено», progress-tracker 242 КБ (і `AGENTS.md` велить читати його на старті кожного завдання), audit.md 242 КБ. Застарілі статуси (A1 «чекає ассет» — лого давно є; C1 «PR draft» — злитий). `ui-context.md` закріпив ШІ-слоп як правило («frosted glass hero», `rounded-2xl`).
6. **Неефективні «тести».** `scripts/check-*.mjs` компілюють TSX у VM з фейковими React-хуками, не входять у `pnpm test`, і мокають саме те, що ламається (hydration #418).

### A2. Помилки реалізації (перевірено в коді)
| Пріоритет | Проблема | Де | Фаза |
|---|---|---|---|
| High | Реєстр схвалень сторінок у коді (path + documentId). Після запуску кожна нова новина/подія — noindex і поза sitemap до правки коду й деплою; `/news` стає noindex, якщо будь-яка стаття сторінки 1 не схвалена; запуск = правки в 4 файлах | `lib/seo-readiness.ts`, `app/robots.ts`, `next.config.ts`, `app/layout.tsx` | 3 |
| High | `Disallow: /` разом із noindex: crawler не бачить noindex, URL можуть індексуватись без контенту | `app/robots.ts` | 3 |
| High | `/news`, `/events`, `/media` (читають `searchParams`) і `news/[slug]`, `events/[slug]` (без `generateStaticParams`) рендеряться на кожен запит; `revalidate = 60` там не діє; `useCdn: false` | listing/detail pages, `sanity/lib/client.ts` | 2 |
| High | Оригінали q=100 `unoptimized` як звичайні зображення (деякі з priority); `team.jpg` 5 МБ як CSS-фон | `sanity/lib/image.ts`, detail pages, `NewsPhotoGallery`, `PortableTextBody`, `DeferredGalleryImage`, `TeamPhotoBanner` | 1 |
| High | `/images/placeholder.jpg` не існує — 11 посилань → биті зображення й console errors; дефолти `OurVision` теж на відсутні файли | `app/(front)/page.tsx`, `lib/homepage.ts`, news/events/team, `OurVision.tsx` | 1 |
| High | Дати форматуються в UTC сервера (Vercel), не Europe/Kyiv: час подій −2–3 год, «сьогодні» зсунуте біля півночі | `lib/utils.ts`, `app/(front)/page.tsx` | 1 |
| High | Ймовірне джерело hydration #418: `useReducedMotion` (`motion`) читає `matchMedia` під час першого клієнтського рендеру | `components/sections/Hero.tsx` | 1 |
| High | Poppins (шрифт заголовків) **не має кирилиці** — українські заголовки рендеряться системним шрифтом; 24 font-файли без хешування (кеш `max-age=0`) | `app/fonts.css`, `app/globals.css` | 1 |
| Med | `'use client'` без потреби: TestimonialsGrid, FAQSplit, ActionBoxFullWidth, AboutWithStats, MinistryCard, MinistryGrid (тягне `@sanity/image-url` у браузер), News/EventsPagination, PhotoGalleryGrid; `HeroGradientImage` клієнтський через спільний файл; `next/dynamic` на серверних секціях головної | `app/(front)/components/*`, `components/*` | 1 |
| Med | `ChurchHeader` повністю клієнтський, `setState` на кожен кадр скролу; немає `<nav aria-label>`; закрите мобільне меню доступне з Tab | `components/ChurchHeader.tsx` | 1, 6 |
| Med | Font Awesome повністю (`all.min.css` 74 КБ render-blocking + brands 119 КБ + solid 158 КБ) для ~50 іконок | `app/layout.tsx`, `app/icon-fonts.css` | 1 |
| Med | Hero-слайдер монтує всі слайди одразу — приховані фото конкурують з LCP | `components/sections/Hero.tsx` | 1, 5 |
| Med | Неоптимізовані CSS-фони (без lazy/AVIF): Ministries, OurVision, contact (1 МБ), history (1,3 МБ) | відповідні компоненти | 1 |
| Med | Google Maps iframe (3rd-party cookies, важкий); Vimeo з демо Larexa без `title` і поза CSP; LiveBanner iframe eager; YouTube `maxresdefault` часто 404 | `MapEmbed`, `history/page.tsx`, `LiveBanner`, `MediaCard`, `FeaturedSermon` | 1 |
| Med | JSON-LD: Event без `address`/eventStatus/organizer/endDate; VideoObject-список без `uploadDate` на /media; NewsArticle без author/dateModified/publisher.logo; Church без logo/image; `og:type` завжди `website` | events/news detail, `MediaGallery`, `lib/metadata.ts` | 3 |
| Med | A11y: пагінація без імен і `aria-current`; FAQ без aria, `max-h-96` обрізає; breadcrumbs `text-white/55` ≈2,6:1; порядок sidebar ≠ DOM; `summary.outline-none`; load-more губить фокус; автоплей каруселей без паузи; `h2` всередині `button`; tablist без panels | див. Фаза 6 | 4–6 |
| Low | Немає `title.template`; мета `keywords`; default favicon create-next-app; `priority` deprecated у Next 16 (→ `preload`); Studio під тим самим root layout з FA/site CSS; невизначені класи `pattern-overlay-2`, `testi-border`; `/media/photos` перемішується при кожному ISR | різне | 1–5 |
| Low | Гігієна: `package-lock.json` поряд із pnpm-lock; ~15 МБ невикористаних зображень; застосовані міграції/one-off скрипти; шаблонні README і SVG create-next-app | корінь, `public/`, `scripts/`, `migrations/` | 0 |

---

## B. Рішення (ADR-lite)

| # | Рішення | Чому | Наслідок |
|---|---|---|---|
| B1 | **Фото: адаптивні прев'ю + оригінал на вимогу** (2026-10-27, користувач). Усі CMS-фото на сторінках — через Sanity Image CDN (`w`, `q≈75`, `auto=format` → AVIF/WebP, srcset/sizes). Оригінал — лише в повноекранному перегляді лайтбокса + кнопка «Завантажити оригінал». | q=100 оригінали несумісні з Lighthouse ~100; візуально різниці немає | Скасовує попередню домовленість D9 «оригінали всюди»; `DeferredGalleryImage` видаляється |
| B2 | **Індексація: один перемикач.** `SITE_INDEXING=on` + `VERCEL_ENV=production` керують robots.txt, meta robots, `X-Robots-Tag`, sitemap. До запуску — crawl дозволено + noindex. Винятки — поле `seo.noIndex` у документі Sanity | Реєстр у коді не масштабується після запуску | `lib/seo-readiness.ts` → `lib/indexing.ts` |
| B3 | **Іконки: inline SVG** через серверний `Icon` + реєстр, що приймає наявні значення CMS (`'fas fa-music'`) | Мінус ~370 КБ і render-blocking CSS; без зміни схеми | Пакет `@fortawesome/fontawesome-free` видаляється |
| B4 | **Шрифти:** Montserrat (заголовки, кирилиця), Roboto (текст), Playfair Display italic (pre-title) через `next/font/local` (2026-10-27, користувач) | Poppins без кирилиці; next/font дає хешування, preload і metric fallback (CLS) | Poppins видаляється; `ui-context.md` оновлюється |
| B5 | **Hero головної — статичний** (2026-10-27, користувач): одне фото + заголовок + розклад + CTA | Карусель погіршує LCP і рідко дочитується | `HeroSlider` замінюється в Фазі 5.1 |
| B6 | **Рендеринг: static-first.** Усі публічні сторінки — статичні з on-demand revalidation через вебхук Sanity (`revalidateTag(type, 'max')`); пагінація шляхами | Серверні сторінки — пріоритет користувача; TTFB/LCP | `revalidate = 60` прибирається; `sanity/lib/live.ts` видаляється |
| B7 | **Дизайн = Larexa**, адаптований server-first (без react-bootstrap/AOS/tiny-slider/GLightbox) | Вимога користувача; клієнтські бібліотеки Larexa шкодять Lighthouse | [spec 08](specs/08-larexa-redesign.md) |
| B8 | **CSP enforce без nonce** | Nonce робить кожну сторінку динамічною і вбиває статику | `'unsafe-inline'` для скриптів лишається; зовнішні джерела — allowlist |

---

## C. Фази

Кожна фаза: **гейт** (показати кроки, користувач обирає) → кроки → `cmd /c "pnpm run build"` → Lighthouse до/після → запис у tracker (≤10 рядків) → **запит commit/push**.

**Цілі Lighthouse (mobile):** Performance ≥95 (100 на контентних сторінках), Accessibility 100, Best Practices 100, SEO 100 після запуску (до запуску SEO <100 лише через `is-crawlable`). Замір — `scripts/measure-seo-performance.mjs`, 3 прогони production build, сторінки: `/`, одна `/news/[slug]`, одна `/ministries/[slug]`, `/media/photos`, `/contact`.

### Фаза 0 — Гігієна репо і документації

Статус 2026-10-27: **завершено** — lint, typecheck, test, build PASS; application source без змін. Результат і наступний гейт — у [tracker](progress-tracker.md). Нижче збережено погоджений checklist фази; назви видалених файлів тут та в архівах — історичні, не runtime-посилання.
Без змін логіки й дизайну.
1. **Архів/стиснення документації** (`git mv`, історія зберігається):
   - старий `progress-tracker.md` → `archive/2026-10-27/progress-tracker.md`; новий tracker ≤8 КБ (поточний стан, наступна фаза, правило: ≤10 рядків на фазу, без абзаців «commit погоджено» — журнал у git);
   - `specs/00`–`07` → `specs/done/` (усі завершені; SEO-L зі spec 05 уже перенесено в §F);
   - `docs/seo/audit.md` + 3 evidence JSON → `docs/archive/seo-codex-2026-10/`;
   - `ui-context.md`: прибрати «Frosted glass hero», `rounded-2xl` для карток/hero, дубльований абзац «Select кількох фото»; дизайн-система = Larexa (spec 08); заголовки → Montserrat (реалізація у Фазі 1);
   - `ai-workflow-rules.md`: «1–2 юніти за сесію» → «фаза з кількох кроків, один замір до/після, гейт і commit на фазу»; `npm run build` → `pnpm`; DoD без хешів/evidence-дампів;
   - `architecture.md`, `code-standards.md`: стиснути журнальні розділи 2026-10-2x до коротких правил; позначити рішення, які змінює цей план (B1, B2, B3);
   - `AGENTS.md`: посилання на стислий tracker, spec 08, новий шлях skills-analysis.
2. **Видалити** (посилань у коді немає — перевірено grep):
   - `package-lock.json`;
   - `public/{file,globe,next,vercel,window}.svg`;
   - `public/images/ministries/m1–m10.jpg` (~11 МБ), `public/images/news1–6.jpg`, `public/images/team-optimized.jpg`, `public/images/event1–4.jpg`;
   - `scripts/`: `migrate.ts`, `migrate-leaders.ts`, `migrate-multi-responsible.ts`, `migrate-portable-text.ts`, `patch-data.ts`, `cleanup-homepage-stats.ts`, `fix-event-heading.mjs`, `fix-href.ps1`, `measure-font-delivery.mjs`, `measure-photo-delivery.mjs` + npm-скрипти `migrate`, `migrate:pt`, `migrate:multi-responsible`;
   - `migrations/convert-leader-to-weak/`.
3. **Перемістити/оновити:** `skills_analysis_for_newlife2.md` → `docs/skills-analysis.md`; `README.md` → короткий опис (pnpm, env, посилання на AGENTS.md, `docs/ci.md`, `docs/contact-form.md`); `.env.example` + назви `SANITY_API_WRITE_TOKEN`, `SANITY_AUTH_TOKEN`, `YOUTUBE_API_KEY`.
4. **Залишити:** `seed-*.ts` (до запуску), `check-*.mjs` (до заміни у Фазі 7), `measure-seo-performance.mjs`, `patches/`, `lib/*-data.ts` (фолбеки CMS), `PlaceholderPage` (до реальної privacy).

**Приймання:** build/lint/test PASS; у чинному коді/конфігурації немає залежностей від видалених файлів; відносні посилання в `context/*.md`, `AGENTS.md`, `README.md` валідні. Без runtime-змін Lighthouse/скриншоти не повторюються; перевіряються незмінність application source і відсутність зламаних ресурсних залежностей.

### Фаза 1 — Фундамент швидкодії
Статус 2026-10-27: **завершено** — реалізовано всі 7 пунктів; quality gates і browser QA PASS. [Lighthouse до/після](../docs/phase1-performance.md), поточний стан — [tracker](progress-tracker.md). Загальні Performance/a11y цілі ще потребують наступних фаз.

Візуально без змін, крім шрифту заголовків.
1. **Іконки (B3):** `components/ui/Icon.tsx` (серверний) + `lib/icons.ts` (SVG path з `@fortawesome/free-{solid,regular,brands}-svg-icons`, лише ~50 використаних); приймає рядки CMS (`'fas fa-music'`) і `aria-hidden` за замовчуванням. Видалити `@fortawesome/fontawesome-free`, `app/icon-fonts.css`, імпорт у `app/layout.tsx`.
2. **Шрифти (B4):** `next/font/local` — Roboto, Montserrat (cyrillic + latin, 500/600/700), Playfair Display italic; CSS-змінні `--font-base/--font-heading/--font-alt`; видалити `@font-face` з `app/fonts.css`, ручні `<link rel="preload">`, файли Poppins.
3. **Server-first:**
   - зняти `'use client'`: TestimonialsGrid, FAQSplit (→ `<details name="faq">`), ActionBoxFullWidth (+ `Link`), AboutWithStats, MinistryCard, MinistryGrid, NewsPagination, EventsPagination, PhotoGalleryGrid;
   - `HeroGradientImage` — окремий серверний файл; FeaturedSermon і MediaCard — клієнтський лише play-острівець, thumbnail-фолбек на сервері;
   - прибрати `next/dynamic` з `app/(front)/page.tsx`;
   - `ChurchHeader` → серверна оболонка + острівці `MobileMenu` (`inert` коли закрите), `NavDropdown`, `NavLink` (`aria-current`); sticky через CSS/IntersectionObserver-sentinel без setState на кожен кадр;
   - видалити `motion`; reduced-motion через CSS або `useSyncExternalStore(..., () => false)` на сервері — закриває #418;
   - `ImageLightbox` у `PhotoViewer` — через `next/dynamic` лише при відкритті; `Lightbox` (відео) переписати на нативний `<dialog>`, як фото.
4. **Зображення (B1):** loader Sanity CDN (`Image` з `next-sanity/image` або власний loader) для всіх CMS-фото з коректними `sizes`; LQIP-плейсхолдери лишаються; оригінал — у лайтбоксі (повний перегляд) + «Завантажити оригінал»; видалити `DeferredGalleryImage` і `originalImageUrl` зі сторінок/карток; статичні фото (team, contact, OurVision, Ministries, history) — `next/image` замість CSS-фонів (`bg-fixed` паралакс команди → звичайне зображення; **після рев’ю користувач повернув паралакс** — desktop `bg-fixed` з оптимізованим `image-set` q90); `images.formats: ['image/avif','image/webp']`; `priority` → `preload` лише для LCP; логотипу preload не давати; дубль `action1.jpg` = `ministries-hero.jpg` — лишити один.
5. **Баги:** `placeholder.jpg` → `ImagePlaceholder` (уже є); дефолти `OurVision`; `Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv' })` у `lib/utils.ts` і в обчисленні «сьогодні» для подій; YouTube thumbnails `hqdefault`/`sddefault`.
6. **Треті сторони:** Google Maps — фасад (статичне прев'ю + кнопка «Показати карту» → iframe; посилання «Відкрити в Google Maps»); **після рев’ю користувач відхилив фасад** — iframe одразу, lazy, посилання лишається; LiveBanner iframe `loading="lazy"`; демо-Vimeo з `/history` прибрати.
7. **Root layouts:** `app/(front)` і `app/studio` з окремими root layout — Studio без site CSS, сайт без Studio-залежностей (дозвіл на `app/studio/` дано затвердженням плану 2026-10-27).

### Фаза 2 — Статичний рендеринг і кешування (B6)
Статус 2026-10-28: **код завершено** — усі публічні маршрути статичні, локальні HTTP/browser gates і quality checks PASS; [Lighthouse до/після](../docs/phase2-performance.md). Підключення зовнішнього webhook Sanity→Vercel та перевірка delivery після публікації — [дія власника](../docs/sanity-revalidation.md).
1. Хелпер вибірки в `sanity/lib/` з `next: { tags: [<_type>] }`; усі `client.fetch` — через нього. Видалити `sanity/lib/live.ts`.
2. `app/api/revalidate/route.ts`: `parseBody` з `next-sanity/webhook`, секрет `SANITY_REVALIDATE_SECRET`, `revalidateTag(body._type, 'max')` (сигнатура Next 16). Вебхук у sanity.io/manage — дія власника за інструкцією (проєкція `{_type}`).
3. Прибрати `export const revalidate = 60`; дата-залежні сторінки (`/`, `/events`, `/events/[slug]`) — `revalidate = 3600` як страховка (подія «минає» без зміни контенту).
4. Пагінація шляхами: `/news/page/[n]`, `/events/page/[n]` (`generateStaticParams`); фільтр категорії — `/news/category/[category]` (noindex); `/media` — статичний початковий список, фільтри на клієнті через наявні Server Actions. Редиректи старих `?page=` не потрібні — сайт не індексувався.
5. `generateStaticParams` для `news/[slug]`, `events/[slug]` (+ `dynamicParams`).
6. `/media/photos`: стабільний порядок (за датою/служінням) замість `Math.random` на кожен ISR.

**Приймання:** у звіті `next build` усі публічні маршрути ○/● (крім API/Server Actions); правка в Studio → сторінка оновлюється за секунди.

### Фаза 3 — SEO-архітектура
Статус 2026-10-28: **код завершено** — єдиний закритий indexing-перемикач, SEO-об’єкт у чотирьох типах, metadata/JSON-LD/sitemap/брендові іконки; локальні on/off HTTP/browser gates PASS. Для чесної Event-розмітки додано необов’язкові endDate/eventStatus/locationAddress/organizer/isAccessibleForFree; чинний контент не змінювався. Rich Results Test розгорнутих URL після деплою й заповнення фактичних адрес — зовнішня перевірка; [звіт](../docs/phase3-seo.md).
1. `lib/indexing.ts` (B2) замість `lib/seo-readiness.ts`; `app/robots.ts` (до запуску: allow + без sitemap-URL; після: allow, `disallow: /studio`, sitemap), meta robots у root layout, `X-Robots-Tag` у `next.config.ts` — умовно від одного значення; sitemap порожній, доки індексація вимкнена.
2. Поле-об'єкт `seo` (title, description, ogImage, noIndex) для `news`, `event`, `ministry`, `teamMember` — окремий крок зі schema-зміною; `pnpm typegen`.
3. Metadata: `title.template: '%s | Церква «Нове Життя»'`, сторінки передають короткі унікальні title/description; «— сторінка N» для пагінації; новини — `og:type: article` + `publishedTime`/`modifiedTime`; прибрати `keywords`; фільтровані списки — noindex без canonical на іншу URL; `permanentRedirect` у `lib/listing-params.ts`.
4. JSON-LD: один `@graph` (WebSite + Church/Organization з `logo`, `image`, address, geo, `sameAs`, telephone) у front layout; сторінки посилаються на `@id`; Event — address, eventStatus, organizer, endDate, image, `isAccessibleForFree`; NewsArticle — author (Organization), publisher.logo, dateModified, image; BreadcrumbList з тих самих даних, що й видимі крихти (одне джерело); прибрати VideoObject-список з `/media`.
5. Sitemap лише з `lastModified` (priority/changefreq Google ігнорує); `app/icon.svg` (знак із логотипа), `apple-icon.png`, `app/manifest.ts` замість default `favicon.ico`.

**Приймання:** Rich Results Test (після деплою) для головної, новини, події — 0 помилок; заголовки відповідей і robots.txt для обох станів перемикача.

### Фаза 4 — Дизайн-система Larexa (B7, [spec 08](specs/08-larexa-redesign.md))
Статус 2026-10-28: **код завершено** на гілці `feat/phase-4-larexa-design-system` — `globals.css` 1782 → ~1020 рядків, 12 серверних компонентів + острівець `SnapArrows`, `ui-context.md` оновлено. Компоненти зібрані на демо-сторінці `/larexa-preview` (noindex, без посилань; видаляється перед запуском — §F); реальні сторінки змінено лише глобальними токенами. Результат — [tracker](progress-tracker.md).
1. `app/globals.css` (захищений файл — дозвіл дано затвердженням плану): токени секцій Larexa (`5rem 0 3.8rem`, md `4rem 0 3rem`), radius 3px, тіні Larexa, `.title h2` вага 600; видалити мертві блоки (скляний `.portfolio-card` ~1720–1787 тощо), `gray-50` → `gray-100`; додати відсутні `.breadcrumb`, `.timeline-*`, `.testimonials-border`, `.pattern-overlay-2`, стиль accordion для `<details>`.
2. Серверні компоненти `components/larexa/` (перелік і контракти — spec 08): `SectionTitle`, `PageTitle`, `PostCard`, `FeatureBox`, `SidebarWidget`, `Pagination`, `Accordion`, `Timeline`, `TeamItem`, `CounterStrip`, `ActionBox`, `SnapRow` + клієнтський острівець `SnapArrows`.
3. Оновити `ui-context.md` під систему Larexa.

### Фаза 5 — Посторінковий редизайн (мапінг — spec 08)
Кожен крок: скриншоти до/після 1280/390/320, Lighthouse a11y 100 на змінених сторінках, жодних нових `'use client'`, крім острівців.
- **5.1** Глобально: `PageTitle` на всіх внутрішніх сторінках (замість `PageHero` і двох inline-копій у news/events detail); `SectionTitle` замість 16 «UPPERCASE eyebrow + h2»; статичний hero головної (B5).
- **5.2** Головна: Events/News → `PostCard` + `SnapRow` без автоплею; «Що ви знайдете» → `FeatureBox`; FeaturedSermon → блок about-classic з Play; Testimonials → `testimonials-border`; FAQ → `Accordion`.
- **5.3** `/about`, `/history` (Timeline; контент історії → Sanity-singleton окремим кроком зі схемою).
- **5.4** `/team`, `/team/[slug]`, `/ministries`, `/ministries/[slug]`.
- **5.5** `/news`, `/events` + detail (blog right-sidebar, blog-single, деталі події як careers-single).
- **5.6** `/media`, `/media/photos`, `/contact` (форма через `useActionState`, працює без JS), 404, error, `/privacy`.

### Фаза 6 — Закриття доступності
Більшість виправляється у Фазах 4–5; тут — перевірка і залишок: пагінація (імена prev/next, `aria-current`), FAQ, header (nav landmark, `inert`, без `aria-haspopup`), breadcrumbs (label, `aria-current`, контраст ≥4,5:1), порядок sidebar (прибрати `order-*`), видимий фокус `summary`, load-more (`aria-disabled` + фокус на першу нову картку), каруселі без автоплею, `h2` у `button` (MediaCard), фільтри медіа — кнопки з `aria-pressed`, зірки рейтингу з текстовим еквівалентом, `not-found` (skip-link, відступ під header). Потім axe по всіх маршрутах + ручний прохід клавіатурою.

### Фаза 7 — Якість, безпека, злиття
1. Тести: Playwright smoke + `@axe-core/playwright` по списку маршрутів; Vitest для `lib/` (дати Europe/Kyiv, listing params, indexing); видалити VM-скрипти `check-*.mjs`; Lighthouse CI з бюджетами в GitHub Actions (production build + публічний dataset).
2. CSP (B8): enforce, `upgrade-insecure-requests`, актуальні `frame-src`/`img-src`, опційний `report-to`.
3. Vercel Web Analytics + Speed Insights (польові CWV, без cookies) — вмикає власник.
4. PR `codex/seo-1-audit` + нова робота → `master` (лише за згодою).

### Фаза 8 — Контент і дії власника
Паралельно з кодом; перелік — §D.

### Фаза 9 — Запуск
Лише за явним «готово» користувача — §F.

---

## D. Дії власника (не код)

**Факти й контент (у Studio):**
- рік заснування 1991 vs таймлайн 1992; статистика «19+ років» → ~33;
- служіння «Нове служіння» — реальна назва/опис;
- опечатка «Сбогодні» в назві новини; оголошення `obid-dlya-rodin-zagiblikh-zakhisnikiv` без опису/тексту;
- 77 відео без дат і описів; демо-документи `mediaItem` прибрати;
- реальні свідчення, FAQ, статистика, унікальні фото галерей служінь; чернетки /about (цінності, «чого очікувати»);
- legacy-події без `startDate`/`type`;
- **текст політики конфіденційності** — обов'язковий до запуску: контактна форма збирає персональні дані;
- узгоджені назва/адреса/телефон/розклад (NAP) — однаково на сайті, в Google Business Profile і соцмережах.

**Акаунти й інфраструктура:**
- ротація Sanity write-токена, засвіченого в QA-журналі (SEO-6);
- Vercel Production env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `UPSTASH_*` + перевірка доставки на реальну скриньку;
- `YOUTUBE_API_KEY` (Vercel) + ID каналу (Studio) для банера «Наживо»;
- `SANITY_REVALIDATE_SECRET` + вебхук Sanity (Фаза 2);
- Vercel Deployment Protection для Preview (F01);
- домен, DNS-доступ для Google Search Console, Google Business Profile;
- увімкнути Vercel Web Analytics/Speed Insights (Фаза 7).

---

## E. Рекомендації: функціонал, UI/UX, техніка

### E1. Функціонал (за цінністю для церкви)
1. **«Я тут уперше / Сплануй візит»** — окрема сторінка + CTA у hero: розклад, адреса й маршрут, паркінг, що з дітьми, як проходить служіння, FAQ, коротка форма «Повідомте, що прийдете». Найбільше знижує бар'єр першого візиту.
2. **Блок «Найближче богослужіння»** (розраховується в Europe/Kyiv) на головній і в top bar.
3. **Детальні сторінки проповідей `/media/[slug]`** з VideoObject, конспектом і місцями Писання. Зараз відео відкриваються лише в модалці — у пошуку немає жодної сторінки проповіді. Далі — серії, сторінки спікерів, подкаст RSS (Spotify/Apple).
4. **Події:** «Додати в календар» (`.ics` route handler + посилання Google Calendar), повторювані події (домашні групи, молодіжні), Event rich results.
5. **`/give`:** реквізити + monobank-банка/QR, примітка прозорості; без обробки платежів на сайті.
6. **Telegram/Viber-спільнота** замість email-розсилки (реалії аудиторії в Україні): CTA у футері та після форм.
7. **Приватна форма молитовних потреб** (лист служителям, без зберігання в CMS) — патерн контактної форми.
8. **Пошук по сайту** — після наповнення контентом (GROQ або Pagefind).

### E2. UI/UX
1. **Header:** фіксована висота 124/164px «з'їдає» перший екран, особливо на мобільному. Як у Larexa: top bar прокручується, sticky лише компактна навігація.
2. **Без автопрокрутки** каруселей; горизонтальні scroll-snap рядки з видимими стрілками.
3. **Єдині порожні стани** (немає фото/подій/новин) через `ImagePlaceholder` і текст із CTA.
4. **404** з посиланнями на розклад, контакти, новини; **сторінка/стан успіху** після відправки форми.
5. **Заява про доступність** (коротка сторінка) після Фази 6.
6. **QR-коди** на афішах подій, що ведуть на сторінку події.

### E3. Досвід редактора (Sanity)
1. Обов'язковий `alt` для фото у валідації схем (a11y + SEO).
2. SEO-поля документа з прев'ю сніпета (Фаза 3).
3. Presentation/Visual Editing лише в draft mode — нуль впливу на публічні сторінки.
4. Інструкція для редактора (1 сторінка): як додати подію/новину/проповідь, розміри фото, alt.

### E4. Техніка
1. Lighthouse CI-бюджети та Playwright + axe у CI (Фаза 7).
2. Vercel Speed Insights — польові Core Web Vitals після запуску.
3. Моніторинг помилок (Sentry) і uptime-пінг — після запуску.
4. Мультимовність (uk + en/ru) — лише за реальної потреби; велика окрема ініціатива.

---

## F. Launch checklist (НАЙОСТАННІШИЙ крок)

Виконувати **лише** після явного «готово» користувача. Передумови: Фази 1–7 завершені, §D (контент, privacy, NAP) виконано, редакційна перевірка сторінок, демо-сторінку `/larexa-preview` (`app/(front)/larexa-preview/`) видалено.
1. Домен у Vercel; `NEXT_PUBLIC_SITE_URL` = власний домен; 308 www → apex; canonical-и на новому домені.
2. `SITE_INDEXING=on` у Production → перевірити robots.txt, відсутність `X-Robots-Tag: noindex`, meta robots, наповнений sitemap.
3. Google Search Console (DNS TXT) → подати sitemap; Rich Results Test головної/новини/події.
4. Google Business Profile → посилання на сайт; NAP збігається.
5. Моніторинг Speed Insights і Search Console перші 2–4 тижні.

---

## G. Правила процесу

Повний канон — [ai-workflow-rules.md](ai-workflow-rules.md) (оновлюється у Фазі 0). Робоча угода (2026-06-19, темп оновлено 2026-10-27):
1. **Karpathy завжди** — припущення вголос → простота → хірургічні зміни → перевіряльні цілі.
2. **Гейт перед фазою** — показати кроки фази й запитати, що робити.
3. **Темп — фази з кількох кроків** (2026-10-27): один Lighthouse-замір до/після на фазу, один запис у tracker (≤10 рядків), без хешів і evidence-дампів.
4. **Commit/push-гейт** після фази — лише за згодою, push як **Chekirko**.
5. **Індексація — останній крок** (§F).
6. **Контекст у синхроні** — оновлювати релевантні `context/*.md` за доменом; нова велика ініціатива — спершу сюди або в `specs/`.

**Критичні правила:** лише `pnpm`; на Windows довгі команди через `cmd /c "pnpm run build"`; Sanity `reference` завжди `weak: true` + null-guard; кирилицю не писати через PowerShell pipe/`Out-File`; після змін схем/GROQ — `pnpm typegen`; GROQ через `defineQuery()`; скіли — за реєстром `AGENTS.md`; захищені файли (`sanity/lib/sanity.types.ts`, `schema.json`, `app/studio/`, `sanity.config.ts`, `app/globals.css`) — лише з явного дозволу (для Фаз 1 і 4 дозвіл дано затвердженням цього плану).

**Definition of Done фази:** працює end-to-end; build + lint + test PASS; без console errors; mobile + desktop перевірені; Lighthouse до/після записано; tracker і доменні context-файли оновлено.

---

## H. Що вже зроблено (не повторювати)

- Фундамент: env/`SITE_URL`, контент-модель у Sanity (singletons `siteSettings`/`homepage`/`pageHeroes`/`aboutPage`, `event` = події + оголошення, Portable Text), головна й /about редагуються в CMS.
- Логотип у header/footer (`public/images/logo-*.svg`); бренд-контраст A2 (`--color-primary-text`, `.bg-grad-readable`).
- `/media` (`mediaItem`, серверний пошук, «Завантажити ще», банер «Наживо»), `/media/photos`, «Актуальне слово» на головній.
- Контактна форма (Resend, Zod, honeypot, Upstash rate-limit) — злита в master (PR #2); CI (lint/typecheck/test/build) і захист master.
- Studio: пакетний вибір фото, галерея новини, патч reconnect (`patches/`).
- SEO-підготовка Codex (SEO-0…7, D2.1, D8.1, D9) — на гілці `codex/seo-1-audit`: noindex-сигнали, metadata/OG, canonical пагінації, null-guard JSON-LD, ієрархія заголовків (один H1, без пропусків), hero через `next/image`. Механізми, які цей план замінює: реєстр схвалень (B2), оригінали q=100 (B1), FA `swap` (B3).
