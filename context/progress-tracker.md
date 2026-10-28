# Progress Tracker

## Поточний стан — 2026-10-28

Єдиний чинний план — [master-plan.md](master-plan.md); дизайн — [spec 08](specs/08-larexa-redesign.md); процес — [ai-workflow-rules.md](ai-workflow-rules.md). Гілки `codex/seo-1-audit` (Фази 0–3) і `feat/phase-4-larexa-design-system` (Фаза 4, від неї); робота ще не злита в `master`. Сайт до запуску, індексація закрита.

Рішення користувача: адаптивні Sanity-прев’ю + оригінал у viewer/завантаженні; Montserrat; статичний hero; Larexa; static-first; робота фазами. B1/B3/B4 реалізовано у Фазі 1, B6 — у Фазі 2, B2 — у Фазі 3. Редизайн ще попереду.

## Фаза 0 — завершено

- Архівовано старі tracker/specs/SEO-аудит; оновлено контекст, AGENTS/README/env example. Прибрано 38 невикористаних файлів (~16,6 МБ) і 3 migration-команди; application source та CMS не змінювались.
- Lint, повний typecheck, 3 регресії, build 42/42, UTF-8/Markdown links/diff-check — PASS. Історія й початкові виміри — в архівах та Git.

## Фаза 1 — завершено

- Inline SVG замість icon fonts; локальні Montserrat/Roboto/Playfair italic (latin+cyrillic); статичні секції/header — серверні, interactivity — острівці; hydration-safe hero.
- Адаптивні SiteImage/CDN прев’ю, відкладені native фото/відео-viewers, оригінали лише на вимогу; дати Europe/Kyiv/DST; окремі public/Studio root layouts.
- Після рев’ю: карта iframe одразу; пастор SVG image; desktop-паралакс команди через image-set q90; hero монтує сусідів після першого фото. Ці домовленості збережені в architecture/UI context.
- Build 42/42, lint/typecheck/4 регресії/install — PASS; Chrome QA 14 маршрутів, 320/390/1280px, без console/hydration errors. [Lighthouse](../docs/phase1-performance.md): Performance 61→77 / 66→74 / 59→74 / 45→79 / 60→85; після рев’ю не повторювався.

## Фаза 2 — код завершено

- Published/force-cache Sanity fetch, теги referenced-даних, підписаний webhook; SSG новин/подій, path pagination/news categories; статичний media batch + URL-фільтри через Actions; стабільний порядок фото.
- Build 55/55, усі public routes ○/●; lint/typecheck/4 регресії, HTTP/Chrome QA, кирилиця, redirects/404 і signed webhook HIT→STALE→HIT — PASS.
- [Lighthouse mobile](../docs/phase2-performance.md): головна 81, новина 88, служіння 88, фото 87, контакти 86. Загальна ціль ≥95 ще попереду.
- Зовнішній webhook Sanity→Vercel налаштовує власник за [інструкцією](../docs/sanity-revalidation.md). CMS/production env не змінювались.

## Фаза 3 — код завершено

- Один `SITE_INDEXING=on` + Production керує robots/meta/HTTP/sitemap; реєстр схвалень видалено. До запуску crawl дозволено, noindex збережено, sitemap порожній; Preview закритий.
- SEO-об’єкт у news/event/ministry/teamMember, короткі title/template, article OG dates, 308 pagination redirects; shared root graph і Breadcrumbs, повний NewsArticle, без VideoObject-списку, брендова іконка/manifest.
- Для Event додано необов’язкові фактичні поля; без повної адреси Event не емітується. CMS-контент не змінювався — адреси заповнює редактор.
- Build 57/57, lint/повний TypeGen/typecheck/5 регресій, on/off HTTP/Chrome по 16 маршрутах, 320/390/1280px — PASS; on sitemap 44 URL, off 0. Schema.org Validator новини: 0 помилок/застережень.
- Lighthouse mobile: 78 / 84 / 88 / 86 / 90 (головна/новина/служіння/фото/контакти); межі — [звіт Фази 3](../docs/phase3-seo.md). Rich Results Test розгорнутих URL після деплою ще потрібен (Google попросив авторизацію). Індексація закрита; production env і жива форма не змінювались.

## Фаза 4 — код завершено

- Гілка `feat/phase-4-larexa-design-system` (від `codex/seo-1-audit`). `globals.css` 1782 → 1020 рядків: мертві блоки прибрано, Larexa-токени секцій/`.title`, нові breadcrumb/timeline/accordion/post/pagination/widget, `pattern-overlay-2` (AVIF 24 КБ), виправлено `bg-overlay-dark-N`.
- `components/larexa/`: 12 серверних компонентів + острівець `SnapArrows`; уточнення контрактів — у spec 08, правила — у ui-context. `Breadcrumbs` з CSS-крапками, `pagedHref`, `gray-50 → gray-100`.
- Демо-сторінка `/larexa-preview` (noindex; видалити перед запуском — §F): 1280/390/320, axe — 0 порушень у компонентах. Lint/tsc/5 регресій/build 57/57 — PASS.
- [Lighthouse](../docs/phase4-design-system.md): 71 / 85 / 86 / 86 / 89 на повільнішому хості; регресії коду не видно, +23 КБ візерунка на головній.

## Далі

Фаза 5: посторінковий редизайн (5.1 PageTitle/SectionTitle/статичний hero → 5.6). Компактний nav (E2.1) — вирішити на гейті. Наступна фаза потребує окремого доручення.

Контент, privacy, ротація раніше засвіченого Sanity-токена й сервіси — [дії власника](master-plan.md#d-дії-власника-не-код). Запуск — лише за окремим явним «готово» згідно з [launch checklist](master-plan.md#f-launch-checklist-найостанніший-крок).

Історія до нового плану: [старий tracker](archive/2026-10-27/progress-tracker.md), [старий план](archive/2026-10-27/master-plan.md), [SEO-аудит](../docs/archive/seo-codex-2026-10/audit.md), [специфікації 00–07](specs/done).

Правило ведення: ≤10 рядків результатів на фазу, весь файл ≤8 КБ. Журнал комітів — у Git; без повторних погоджень, хеш-дампів і покрокових QA-журналів.
