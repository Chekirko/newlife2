# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Фази 0–2 ✅ DONE. Повне впорядковане меню продовження зафіксовано в **`context/improvement-roadmap.md`** (Tier A–E), Working Agreement узгоджено (2026-06-19, див. `ai-workflow-rules.md`).
- **A4 (pre-launch аудит) виконано** + реалізовано фікси **S2** (екранування JSON-LD), **SEO quick wins** (canonical на 11 маршрутах + OG/Twitter), **C2** (security headers enforce + CSP Report-Only). `next build` ✓ 34 стор. CSP лишається Report-Only до runtime-смоук-тесту → потім enforce. Деталі — `improvement-roadmap.md` → Прогрес.

## Current Goal

- **Phase 1 + Phase 2 COMPLETE** (build ✓ 34 стор.). Phase 1: контент-модель, головна→CMS, rich text, per-page hero, NewsArticle JSON-LD. Phase 2: a11y (keyboard/focus/skip-link/aria), WCAG AA контраст (сірі+кнопки), hero→`next/image`, self-host Font Awesome. **Next: Phase 3** (нові сторінки /about, /media, /give — спершу узгодити дизайн із замовником) АБО залишок контрасту (бренд-рішення щодо `--color-primary`). See **Improvement Roadmap** below.

## Improvement Roadmap (agreed 2026-06-15)

Deep audit completed. Agreed working rules for this roadmap:
- Update this tracker after EVERY completed unit (not in advance). Sync other context files when their domain changes (architecture/UI/standards).
- ASK the user for design direction BEFORE building any new page (user provides references / recommendations).
- After EVERY completed unit: show the user what was done (summary + key files/changes). Commit + push to `origin` (Chekirko/newlife2) ONLY after the user approves.
- Load the matching `.agents/skills/*/SKILL.md` per unit (schema-markup, seo-audit, a11y-audit, performance-profiler, security-guidance, senior-frontend/fullstack, karpathy-coder).
- **Extended 2026-06-19 (Working Agreement — `ai-workflow-rules.md`):** karpathy-coder is now always-on (load before every coding unit); present the phase's item-list and ASK which to do BEFORE starting each phase; ASK about commit+push after each completed stage; opening search indexing is the VERY LAST step of the whole project. Full menu lives in `context/improvement-roadmap.md`.

Agreed product decisions:
- Homepage static content → **fully migrated to Sanity CMS**.
- Priority new pages: **/about, /media, /give**.
- News body → **Portable Text** (one rich-text field, per-paragraph formatting) — Phase 1.8.

### ⚠️ Launch checklist (do BEFORE going live — site is pre-launch)
- **RE-ENABLE INDEXING** — the site is currently closed to search engines (`app/robots.ts` = `Disallow: /`) and placeholder pages are `noindex`. At launch (only when the USER explicitly says the site is finished and ready) flip `robots.ts` to allow crawling and drop `noindex` from pages that became real. NEVER open indexing without the user's explicit go-ahead.
- Set `NEXT_PUBLIC_SITE_URL` to the real custom domain in Vercel (currently auto-derives from the Vercel URL).

### Phase 0 — Foundation (in progress)
- ✅ 0.1 `SITE_URL` env constant (`lib/site.ts`) + `metadataBase` in root layout; de-hardcoded `https://newlife.church` from team/ministry JSON-LD. `SITE_URL` auto-detects Vercel production URL (`VERCEL_PROJECT_PRODUCTION_URL`) so canonical/OG URLs are correct before a custom domain exists. (done 2026-06-15, build ✓)
- ✅ 0.2 Placeholder pages `/about`, `/media`, `/privacy` (shared `PlaceholderPage`, `robots:{index:false}`); branded 404 (`NotFoundView` + `app/not-found.tsx` with chrome + `app/(front)/not-found.tsx`) and `app/(front)/error.tsx`; footer ministry links made dynamic from Sanity (no more hardcoded slug 404s); removed dead `/sitemap` footer link; added `/about` (Про церкву) to the header «Про нас» dropdown. (done 2026-06-15, build ✓)
- ✅ 0.3 `app/robots.ts` (`Disallow: /` pre-launch) + `app/sitemap.ts` (dynamic from Sanity: news/ministries/team slugs; ISR revalidate=60; excludes noindex placeholders). (done 2026-06-15, build ✓)
- ✅ 0.4 `lib/church.ts` (real church data: name, address, phone, email, services, socials, geo) + `Church` + `WebSite` JSON-LD on homepage (address, geo, phone, email, sameAs). openingHours omitted for now (need service end-times to avoid fabricating). (done 2026-06-15, build ✓)
- ✅ 0.5 Wired `lib/church.ts` real data into contact page + header (top bar) + footer (replaced placeholder phone/email/address/schedule/socials). FIXED contact-page Google Map → coords-based embed (`maps.google.com?q=lat,lng&output=embed`) centered on exact pin. Removed dead Telegram footer icon (no link). External social links got `target=_blank rel=noopener aria-label`. (done 2026-06-15, build ✓)

### Phase 1 — Content model + homepage→CMS (split per type/section)
- ✅ 1.1 `siteSettings` singleton (contacts, schedule, socials, OG defaults). Schema + singleton (structure.ts fixed item + sanity.config.ts document.actions strip create/delete/duplicate) + `geopoint`. Seed script `scripts/seed-site-settings.ts` (`pnpm seed:site --write`, _id=`siteSettings`). `getSiteSettings()` (`lib/site-settings.ts`) merges CMS over `church.ts` fallback. Wired into layout→header/footer (server-fetch→client props), homepage Church/WebSite JSON-LD, contact page. `church.ts` kept as typed fallback+shape (dead `CHURCH_SAME_AS` removed). (done 2026-06-15, build ✓, runtime verified)
  - ✅ 1.1b Соцмережі зроблено розширюваними: `social` тепер **масив** `{platform,url,label}` (а не фіксований об'єкт facebook/instagram/youtube). Менеджер додає/сортує/прибирає соцмережі у /studio через дропдаун платформ + «Інша» (без розробника). Реєстр платформ (іконка/колір/назва) — `lib/social.ts` (`SOCIAL_PLATFORMS`/`resolveSocialLink`), імпортується і схемою (дропдаун), і фронтом (рендер). Header/footer рендерять масив динамічно (інлайн brand-колір), `sameAs` — з URL масиву. Re-seed виконано. (done 2026-06-15, build ✓, runtime verified)
- ✅ 1.2 hero slides → CMS. Новий singleton `homepage` (schema + structure.ts fixed item + sanity.config.ts SINGLETON_TYPES). Масив `heroSlides` (image+hotspot, pre/title/subtitle, 2 кнопки, align). Seed `scripts/seed-homepage.ts` (`pnpm seed:homepage --write` — аплоадить 3 hero-зображення з /public, _id=`homepage`). `getHomepage()` (`lib/homepage.ts`) резолвить hero-зображення через `urlFor(1920×1080)`, fallback на чисті дефолти `lib/hero-slides-data.ts`. page.tsx фетчить у `Promise.all`, передає у `HeroSlider`; статичний const видалено. (done 2026-06-15, build ✓, prerender verified — hero = 3 Sanity CDN URLs з hotspot-кропом)
- ✅ 1.3 service schedule structured + feeds openingHours. Додано поле `endTime` у `siteSettings.services` (час завершення, необов'язкове). `getSiteSettings()` віддає похідний масив `openingHours` (тільки служіння з днем+початком+кінцем; UA-день → schema-англ. через `UA_DAY_TO_SCHEMA`). Homepage Church JSON-LD отримав `openingHoursSpecification` (4 записи, 24h). ВИПРАВЛЕНО баг: CTA «Розклад богослужінь» більше не захардкоджений хибними даними — будується з `settings.services`. (done 2026-06-15, build ✓, prerender verified — JSON-LD + CTA = реальний розклад)
- ✅ 1.4 testimonials → CMS. Додано групу `testimonials` до singleton `homepage` (масив: quote/name/position/rating + опц. `avatar` image). `getHomepage()` повертає `testimonials` (map → `TestimonialData`, avatar через `urlFor` якщо є), fallback `lib/testimonials-data.ts`. Seed `seed-testimonials.ts` — **patch** (не createOrReplace), щоб не зачепити hero-слайди. page.tsx передає `homepage.testimonials`, статичний const видалено. Заголовок секції лишився захардкоджений (UI-chrome, поза scope 1.4). (done 2026-06-15, build ✓, prerender verified)
- ✅ 1.5 FAQ → CMS (+FAQPage JSON-LD). Додано групу `faq` до singleton `homepage` (масив question/answer). `getHomepage()` повертає `faq`, fallback `lib/faq-data.ts`. page.tsx передає `homepage.faq` у `FAQSplit` + другий `<script>` FAQPage JSON-LD (mainEntity з тих самих даних). Seed `seed-faq.ts` — patch. Заголовок секції лишився захардкоджений (UI-chrome). (done 2026-06-16, build ✓, prerender verified — 5 Q&A в акордеоні + 5 у JSON-LD)
- ✅ 1.6 "what you'll find" + stats → CMS. Дві останні статичні секції головної перенесено в singleton `homepage` (групи `whatYouFind` + `stats`). Іконка карток — курований дропдаун (label→FA-клас, без реєстр-файлу). Зображення карток заливаються в Sanity (seed `seed-homepage-sections.ts`, PATCH — зберігає hero/testimonials/faq). `getHomepage()` віддає `whatYouFind`+`stats`, fallback `lib/what-you-find-data.ts`/`lib/stats-data.ts`. Заголовки/проза секцій лишились захардкоджені. **Головна повністю в CMS.** (done 2026-06-16, build ✓ 34 стор., prerender — картки = Sanity CDN, 0 `/images/action`)
- ✅ 1.7 `event`: events + announcements (одна модель, поле `type`). Додано `startDate` (datetime), `activeUntil` (опц. дедлайн), `location`, `body`; прибрано вільний `date`. Гомпейдж-секція фільтрує актуальні (`coalesce(activeUntil,startDate) >= now`, EventsSlider сам ховається коли порожньо). Нові `/events` (список+сайдбар+пагінація, дзеркало `news/`) та `/events/[slug]` (деталі + Event JSON-LD тільки для типу «подія»). Хедер-нав «Події», sitemap +`/events`+слаги. `formatEventDate()` (дата+час). (done 2026-06-16, build ✓ 34 стор.)
- ✅ 1.8 Rich text (Portable Text) body для **news/event/ministry/team** — build ✓ (34 стор.), live-міграція виконана (26 docs). Спільний `richTextBlocks` (тулбар: H2–H4/цитата = розмір, жирний/курсив/підкреслення, списки, посилання, вбудовані зображення) + спільний рендер `PortableTextBody` (fallback на `<p>` для legacy-рядка). Excerpt-поля лишились простим текстом. Міграція `scripts/migrate-portable-text.ts` (`pnpm migrate:pt`, dry-run за замовч., `--write`). **NewsArticle + BreadcrumbList JSON-LD** додано на `/news/[slug]` (headline/image/datePublished/dateModified=`_updatedAt`/description/articleSection/author+publisher=Organization з `getSiteSettings()`/mainEntityOfPage). publisher.logo поки відсутнє (немає лого-ассета — див. TODO Лого).

### Phase 2 — Accessibility + UI/UX ✅ DONE (build ✓ 34 стор.)
- ✅ 2.1 Keyboard & semantics: global `:focus-visible` + `prefers-reduced-motion` (globals.css); skip-link → `<main id="main-content">` (front layout); ChurchHeader — keyboard-operable "Про нас" dropdown (`aria-haspopup`/`aria-expanded`, Escape/blur close), `aria-current` via `usePathname()`, mobile toggle `aria-expanded` + UA label, decorative `<i>` → `aria-hidden`.
- ✅ 2.2 Contrast (WCAG AA): darkened `--color-gray-600` #8f9397→**#6b7177** (4.94:1) і `--color-gray-500` #b4b9bd→**#6f757a** (4.67:1); окремий темніший градієнт кнопок `--gradient-btn-start #4e7d2a`/`--gradient-btn-end #1c7e70` (білий текст ≥4.5:1) для `.btn-grad`/`.btn-outline-grad`; `.footer-bottom`→gray-400 (світлий на темному). Декоративний bright-градієнт лишився яскравим (рішення замовника). Перевірено `contrast_checker.py`.
- ✅ 2.3 Heroes → `next/image`: `PageHero` + news/events detail героі через `<Image fill priority>` замість CSS `background-image` (LCP).
- ✅ 2.4 Font Awesome self-host: `@fortawesome/fontawesome-free` (pin 6.x), CSS-імпорт у `app/layout.tsx`, прибрано cdnjs `<link>` (без зовнішнього render-blocking запиту).
- ⚠️ **Залишок контрасту (потребує бренд-рішення)**: `--color-primary #4cbd89` як текст посилань на білому (~1.9:1) і колір focus-ring (<3:1); білий текст на bright-градієнтних CTA-боксах (сайдбари новин/подій/служінь) і `.gradient-text` — усе fail AA. Не чіпав (поза узгодженим scope 2.2 = сірі+кнопки; зміна primary = зміна бренду). Винести на рішення замовника окремо.

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

- **Site Settings Singleton (Phase 1.1)**: Створено Sanity-singleton `siteSettings` (NAP, розклад, соцмережі, гео `geopoint`, OG-дефолти) — редагується у /studio без розробника. Singleton enforced через `structure.ts` (один фіксований пункт) + `sanity.config.ts` (document.actions прибирає create/delete/duplicate/unpublish). Seed-скрипт `seed-site-settings.ts` заповнив документ із `church.ts`. `getSiteSettings()` зливає CMS поверх `church.ts`-fallback. Споживачі переведені на Sanity: layout фетчить і передає `settings` у header (client)/footer, homepage JSON-LD, contact. `church.ts` лишився типізованим fallback + джерелом форми даних. Соцмережі — розширюваний масив (платформи з реєстру `lib/social.ts` + варіант «Інша»), менеджер додає нові без розробника.

- **Homepage Singleton — Hero (Phase 1.2)**: Створено Sanity-singleton `homepage` (той самий патерн enforce: structure.ts + sanity.config.ts SINGLETON_TYPES). Поле `heroSlides` — масив слайдів (зображення+hotspot, pre/title/subtitle, дві кнопки, align), редагується/сортується у /studio. Seed `seed-homepage.ts` аплоадить 3 hero-зображення з `/public` (reuse `uploadImage` з `migrate.ts`). `getHomepage()` (`lib/homepage.ts`) резолвить зображення через `urlFor()`, fallback на чисті дефолти `lib/hero-slides-data.ts` (без Sanity-залежностей — щоб seed-скрипт міг імпортувати). page.tsx фетчить у `Promise.all`, статичний const `heroSlides` видалено. + UI-фікси Hero: inactive-слайди `pointer-events-none` (кнопки клікабельні), прибрано проп `overlayDark`, додано градієнтний scrim + text-shadow + видима друга кнопка (`btn-outline-white`) для легібельності тексту на фото.

- **"What you'll find" + Stats → CMS (Phase 1.6)**: Останні дві статичні секції головної (`whatYouFindItems` — картки «Більше, ніж просто церква»; `churchStats` — лічильники) перенесено в singleton `homepage` (нові групи `whatYouFind` + `stats`). Іконка карток модельована як **курований дропдаун** у схемі (Ukrainian label → FA-клас; фронт рендерить клас напряму, без реєстр-файлу — на відміну від `lib/social.ts`). Зображення карток (`action1-6.jpg`) заливаються в Sanity одноразовим seed `seed-homepage-sections.ts` (PATCH `whatYouFind`+`stats`, не createOrReplace → зберігає hero/testimonials/faq). `getHomepage()` віддає ще й `whatYouFind`+`stats`, fallback `lib/what-you-find-data.ts`/`lib/stats-data.ts` (чисті модулі). Статичні const + import `MinistryItem` із page.tsx видалено. Заголовки/проза/кнопка секцій лишились захардкодженими (UI-chrome). **Підсумок: весь статичний контент головної тепер керується через CMS.**

- **Events + Announcements (roadmap 1.7)**: Розширено модель `event` — одна модель для подій ТА оголошень через поле `type` (подія/оголошення). Додано `startDate` (datetime — сортування/показ/Event JSON-LD), `activeUntil` (опц. дедлайн «Актуально до»), `location`, `body` (повний текст); прибрано вільнотекстовий `date`. **Актуальність** на головній = `coalesce(activeUntil, startDate) >= now` (GROQ-параметр `$now`); `EventsSlider` сам повертає `null` коли порожньо → секція зникає, якщо немає актуальних. Нові сторінки `/events` (список карток + сайдбар «Інші події» вкл. минулі + пагінація — дзеркало `news/`) і `/events/[slug]` (деталі + **Event JSON-LD** лише для типу «подія», location/organizer з `getSiteSettings()`). Хедер-навігація отримала «Події»; sitemap +`/events`+слаги подій. Хелпер `formatEventDate()` (дата+час). Дзеркальні page-local компоненти `EventCard`/`SidebarRecentEvents`/`EventsPagination`. Legacy-події без `startDate` graceful-сховані до заповнення у /studio.

- **FAQ → CMS + FAQPage JSON-LD (Phase 1.5)**: До singleton `homepage` додано групу/поле `faq` (масив question/answer). `getHomepage()` тепер віддає ще й `faq` (CMS → `FAQItem`), fallback на `lib/faq-data.ts` (5 наявних Q&A). page.tsx передає `homepage.faq` у `FAQSplit` і будує **FAQPage JSON-LD** з тих самих даних — другий `<script application/ld+json>` поруч із Church/WebSite (єдине джерело). Seed `seed-faq.ts` — **patch** поля `faq` (не createOrReplace, щоб зберегти hero+testimonials). Статичний const `faqItems` + import `FAQItem` видалено. Заголовок/контактний сайдбар секції лишилися захардкодженими (UI-chrome). Примітка: Google з 2023 показує FAQ rich results лише для gov/health, але розмітка корисна для AI-пошуку/structured data.

- **Testimonials → CMS (Phase 1.4)**: До singleton `homepage` додано групу/поле `testimonials` (масив: текст відгуку, ім'я, підпис, рейтинг 1–5, опційне фото `avatar`). `getHomepage()` тепер віддає і `heroSlides`, і `testimonials` (CMS → `TestimonialData`, avatar резолвиться через `urlFor` лише за наявності), fallback на чисті дефолти `lib/testimonials-data.ts` (як `hero-slides-data.ts`). Seed `seed-testimonials.ts` робить **patch** поля `testimonials` (не `createOrReplace`) — щоб НЕ перезаписати hero-зображення, які користувач поміняв у /studio. page.tsx передає `homepage.testimonials`, статичний const видалено. Заголовок секції («Що кажуть наші члени») лишився захардкодженим — UI-chrome поза scope.

- **Service Schedule structured + openingHours (Phase 1.3)**: До `siteSettings.services` додано необов'язкове поле `endTime` (час завершення). `getSiteSettings()` тепер віддає похідний масив `openingHours` (`{dayOfWeek, opens, closes}`) — лише служіння, де є день+початок+кінець; UA-день мапиться на schema.org-англ. через локальну `UA_DAY_TO_SCHEMA` (без окремого реєстру — навмисний scope-cut за Karpathy). Homepage Church JSON-LD отримав `openingHoursSpecification` (Church → Place підтримує). ВИПРАВЛЕНО давній баг: CTA «Розклад богослужінь» на головній був захардкоджений НЕправильним розкладом (Неділя 10:00/Середа 18:00) — тепер `subtitle` будується з `settings.services`. church.ts (fallback/shape) + seed оновлено, re-seed виконано.

## In Progress

- None currently.

## Next Up

- See **Improvement Roadmap** above. Active: **Phase 1.8 — news Portable Text + NewsArticle JSON-LD**.
- ⚠️ Legacy events: наявні демо-події не мають `startDate`/`type` → відфільтровані всюди (graceful). Менеджер має заповнити дату/тип у /studio (pre-launch) або створити нові.
- Sanity content audit: unique gallery images per ministry
- ⚠️ Build/typegen note: `sanity schema extract` requires Sanity CLI auth. Locally set `SANITY_AUTH_TOKEN` (e.g. from `SANITY_API_WRITE_TOKEN`) before `pnpm build`/`pnpm typegen`, else `CorsOriginError`. Vercel has its own auth.

## Open Questions

- Дизайн нових сторінок (/about, /media, /give) — узгодити з замовником ПЕРЕД версткою (Phase 3).
- Footer: захардкоджені slug служінь (`/ministries/children` тощо) — прибрати чи зробити динамічними з Sanity (Unit 0.2)?
- Пріоритет Portable Text (1.8): лишити у Фазі 1 чи підняти одразу після Фази 0?
- **TODO Лого**: є векторний EPS (`нове життя вектор.eps`), але конвертації в середовищі немає (gs/inkscape/imagemagick відсутні). Потрібен SVG або прозорий PNG від замовника (або встановити Inkscape) → вставити в хедер/футер замість тимчасового кружечка «НЖ». Додати logo в Organization JSON-LD після появи.
- **Координати**: ✅ уточнено точним піном — 49.291239, 23.428751 (Unit 0.5 використає для мапи).
- **openingHours**: ✅ ВИРІШЕНО (Phase 1.3) — `openingHoursSpecification` у homepage Church JSON-LD. Час завершення = стандартна тривалість (Неділя 11:00–13:00; реш­та 19:00–20:30), редагується у /studio через поле `endTime`.
- **Per-page hero images → CMS** (follow-up з Phase 1.2): ✅ ЗРОБЛЕНО для ВСІХ сторінок, крім головної. Singleton `pageHeroes` тримає 9 редагованих hero-фонів (news, events, ministries, team, history, contact, about, media, privacy); `getPageHeroes()` (map-based) із fallback на статичні файли. Розділи зі списком+деталями ділять одне фото; деталі news/events більше НЕ беруть hero з власного фото матеріалу. Головна лишається на власному hero-слайдері (`homepage` singleton). Нова сторінка (напр. /give) → додати поле в `pageHeroes` + ключ у `getPageHeroes` + проп.
- **Email-адреси**: ✅ вирішено — реальний `zerkvahrista@gmail.com` тепер у singleton `siteSettings` (з fallback у `church.ts`), редагується у /studio.

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
- Session (2026-06-20): Багфікси (роадмап призупинено). (1) **Головна — фільтр подій**: тип `подія` тепер зникає після свого дня (`startDate >= $today`), `activeUntil` подовжує показ лише для `оголошення` — виправлено «зависання» минулої події («Дитячий табір»). (`app/(front)/queries.ts` `EVENTS_QUERY` + `page.tsx` param `today`). (2) **Reusable `TagInput`** (`sanity/components/TagInput.tsx`) — `<datalist>`-підказки зі `schemaType.options.list` + вільний текст, що ЗБЕРІГАЄТЬСЯ; застосовано на `event.tag`, `news.mainCategory`, `news.categories`; видалено зламаний `CategoryInput` (Autocomplete не комітив вільний текст). `next build` ✓ 34 стор., Fix 1 звірено на живих даних.
- Session (2026-06-20): UI-багфікси (skills: senior-frontend + performance-profiler). (1) **Картки подій на головній** — контейнер фото `aspect-[3/2]` замість фіксованої висоти (`EventsSlider`) → фото видно повністю без обрізки; запит фото піднято до 800×533. (2) **Списки /news, /events** — картки у 2-колонкову сітку (`sm:grid-cols-2 gap-6`, картки `h-full`, прибрано `mb-8`) + `sizes` оновлено під нову ширину. `next build` ✓ 34 стор., tsc/eslint ✓ (2 передіснуючі lint поза scope не чіпав).
