# Master Plan — сайт церкви «Нове Життя»

> **Єдиний консолідований план проєкту.** Поєднує (1) усі правила/governance, (2) увесь незавершений backlog (Tier A–E + залишки специфікацій + дрібні TODO), (3) launch checklist. Замінює попередній `improvement-roadmap.md` і розрізнені scratch-плани. Повний канон процес-правил — `ai-workflow-rules.md`; жива хроніка стану — `progress-tracker.md`.

## Стан на момент консолідації (2026-06-21)

Next.js 16 (App Router) + Sanity v3 + Tailwind v4, Vercel, лише укр., **pre-launch** (`app/robots.ts` = `Disallow: /`, плейсхолдери `noindex`).

**Зроблено (Фази 0–2 ✅):** Foundation (env/`SITE_URL`, robots/sitemap, church-дані, JSON-LD Church/WebSite); повна контент-модель + головна повністю в CMS (singletons `siteSettings`/`homepage`/`pageHeroes`, модель `event` = події+оголошення, Portable Text для news/event/ministry/team, JSON-LD NewsArticle/Event/Person/FAQPage/BreadcrumbList); a11y + WCAG AA (focus-visible, skip-link, keyboard nav, контраст сірих+кнопок, `next/image` героі, self-host Font Awesome); реорг головної + сторінка **/about** (контент готовий, CMS-singleton — follow-up B1); A4-аудит (S2 екранування JSON-LD, canonical на 11 маршрутах, security headers enforce + CSP Report-Only).

**Не розпочато:** Tier A-залишок, Tier B (нові сторінки), Tier C (інтеграції/харденінг), Tier D (best-practice), Tier E (розширення).

---

# Частина 1 — Правила та Governance

> Стислий виклад. Повний канон — `ai-workflow-rules.md` (Working Agreement, Scoping, Handling Missing Requirements, Protected Files, Encoding Safety, DoD). Реєстр скілів — `AGENTS.md`.

## Working Agreement (узгоджено 2026-06-19)
1. **Karpathy завжди.** Перед будь-яким кодовим юнітом застосовувати 4 принципи (припущення вголос → простота → хірургічні зміни → перевіряльні цілі). Always-on.
2. **Гейт перед кожною фазою.** Показати користувачу перелік пунктів фази і ЗАПИТАТИ, що саме робити. Не починати без явного вибору.
3. **Коміт/пуш-гейт після кожного етапу.** Після завершеного юніту ЗАПИТАТИ про commit + push; виконувати лише за згодою (push як **Chekirko**).
4. **Індексація — найостанніший крок.** Відкриття пошукової індексації — фінальна дія всього проєкту, лише за явним «готово» (див. Частину 3).
5. **Контекст у синхроні.** Дописувати зміни в усі релевантні `context/*.md` за доменом (architecture/ui-context/code-standards/project-overview), не лише `progress-tracker.md`.
6. **Спершу — план у контекст.** Будь-яка нова велика ініціатива спершу фіксується тут (`master-plan.md`) / spec у `context/specs/`, і тільки тоді починається робота.

## Scoping
- Один feature-юніт за раз; малі перевіряльні інкременти замість великих спекулятивних змін.
- Не поєднувати в одному кроці: UI + Sanity-схему; кілька непов'язаних сторінок; створення нового + рефакторинг наявного.
- Якщо зміну не можна швидко перевірити end-to-end — scope завеликий, розбити.

## Critical rules (override default behaviour)
- **pnpm only** — ніколи npm/yarn.
- **Windows:** довгі команди в `cmd /c "pnpm run build"` (інакше агент зависає на «Running…»).
- **Weak references:** усі `reference`-поля в Sanity-схемах ЗАВЖДИ `weak: true` + null-guard у компоненті; типи `| null`.
- **Encoding:** ніколи не писати кирилицю через PowerShell pipe/`Out-File`/`>` — лише editor-інструменти.
- **TypeGen:** після зміни Sanity-схем чи GROQ — `pnpm typegen` (потрібен `SANITY_AUTH_TOKEN`/`SANITY_API_WRITE_TOKEN`; `next build` сам пропускає schema-extract і пропустить проблеми Studio).
- **Lazy skill loading:** перед задачею завантажити відповідний `.agents/skills/*/SKILL.md` за реєстром в `AGENTS.md`.
- **Context7** (`.agents/rules/usecontext.md`): перед написанням коду з бібліотеками тягнути актуальну документацію.
- **Protected files** (не чіпати без явного дозволу): `sanity/lib/sanity.types.ts`, `schema.json`, `app/studio/`, `sanity.config.ts`, `app/globals.css`.

## Definition of Done (перед наступним юнітом)
1. Юніт працює end-to-end у своєму scope; жоден інваріант `architecture.md` не порушено.
2. `progress-tracker.md` оновлено; релевантні context-файли синхронізовано.
3. `pnpm run build` ✓; без TS-помилок у змінених файлах; без console-помилок; адаптив mobile+desktop.
4. Завантажено й застосовано відповідні скіли (schema-markup для JSON-LD, a11y для UI, performance для зображень/бандла тощо).
5. **SEO-синхронізація:** нова публічна сторінка / новий Sanity-тип з публічним detail-маршрутом → оновлено `app/sitemap.ts` (STATIC_ROUTES або гілка `SITEMAP_QUERY`) і знято `noindex`, коли сторінка реальна. Нова indexable-сторінка НЕ «done», поки не в sitemap (або свідомо виключена з нотаткою).

---

# Частина 2 — Незавершений backlog

**Теги:** `[BLOCKER]` блокує запуск · `[PLAN]` у плані · `[ENH]` покращення в scope · `[SCOPE+]` поза первісним scope (поштучно). **Зусилля:** S ≈ пів дня · M ≈ 1–2 дні · L ≈ 3+ днів. «Скіл» = який `SKILL.md` завантажити.

## Tier A — Блокери запуску

| # | Юніт | Тег | Скіл | Зус. | Суть | Стан |
|---|------|-----|------|------|------|------|
| A1 | **Логотип** | BLOCKER · PLAN | schema-markup | S | Є EPS, нема SVG/PNG. Ассет від замовника → хедер/футер (замість кружечка «НЖ») + `Organization.logo`/`publisher.logo` у JSON-LD. | ⛔ чекає на ассет |
| A2 | **Бренд-контраст** | BLOCKER · PLAN | a11y-audit | M | Залишок Фази 2: `--color-primary` як текст лінків (~1.9:1), focus-ring (<3:1), білий текст на яскравому градієнті CTA-боксів, `.gradient-text` — fail AA. Рішення: затемнити токен лінків/фокусу або ввести окремий доступний варіант. Перевірити `a11y-audit/scripts/contrast_checker.py`. | ⛔ потребує бренд-рішення |
| A3 | **Реальний контент** | PLAN | content-creator | M | Legacy-події без `startDate`/`type` (приховані); унікальні фото галерей служінь; реальні свідчення/FAQ/stats; тексти /about (фінал), /media, /give. Контент у /studio, не код. | ⛔ контент від замовника |
| A4 | **Pre-launch SEO/perf/security-прохід** | PLAN | seo-audit · performance-profiler · security-guidance | M | Аудит ✅ зроблено (S2, canonical×11, security headers). **Залишок:** CSP **Report-Only → enforce** після runtime-смоук (скрипти/Sanity-зображення/Google Maps/Studio); виставити `NEXT_PUBLIC_SITE_URL` на власний домен у Vercel. Відкриття індексації тут НЕ робиться. | 🔄 частково (CSP enforce лишився) |

## Tier B — Нові сторінки (УЗГОДИТИ дизайн першим)

| # | Юніт | Тег | Скіл | Зус. | Суть / нові артефакти | Стан |
|---|------|-----|------|------|------|------|
| B1 | **/about — CMS-редагування** | ✅ DONE | senior-frontend · schema-markup | M | Singleton `aboutPage` (structure.ts + SINGLETON_TYPES + seed `seed:about`) тримає УВЕСЬ контент /about — і заголовки секцій, і текст (hero, хто ми+місія, історія[], віровчення[], цінності[], «чого очікувати»[], керівництво, заголовки stats, фінальний CTA). `getAboutPage()` (`lib/about.ts`) зливає поверх `ABOUT_FALLBACK` поле-за-полем. Числа stats — з `homepage.stats`. (done 2026-06-21) | ✅ DONE |
| B2 | **/media — проповіді + трансляції** | PLAN | senior-fullstack · schema-markup | L | **Нова Sanity-схема `sermon`** (серія, спікер→`teamMember` weak-ref, дата, Писання, YouTube/audio, нотатки Portable Text). Сторінка-архів + фільтри (дзеркало `news/`), live-embed, секція «остання проповідь» на головній, VideoObject JSON-LD. Зареєструвати тип у `schemaTypes/index.ts` + structure + sitemap-гілка + `pageHeroes.mediaHero`. **Реалізовано як `mediaItem`** (медіатека з табами, не окремий `sermon`; `speaker`=ручний рядок; модаль-лайтбокс замість detail; live-банер авто через YouTube Data API). | ✅ DONE — Етапи 1–2 (схема+UI+авто-live, 2026-06-23); **Етап 3** (2026-06-24): масштабування на тисячі відео — серверний пошук (GROQ `match`)/фільтр/`count`, кнопка «Завантажити ще» через Server Action (slice-пагінація 12/порція), поле `tags`, секція «остання проповідь» на головній. `/media` тепер dynamic (`ƒ`). Лишилось (дії замовника): `YOUTUBE_API_KEY`+ID каналу для live; прибрати демо-`mediaItem`. |
| B3 | **/give — пожертви/реквізити** | PLAN · містить SCOPE+ | security-guidance | M | Банківські реквізити + примітка прозорості. `[SCOPE+]` monobank-банка (лінк/QR). Без обробки платежів на сайті. Зняти `noindex` + sitemap + `pageHeroes` ключ. | ⬜ не розпочато |
| B4 | **Секції головної з Фази 3** | PLAN | senior-frontend | M | ~~«Остання проповідь» (з B2)~~ ✅ (2026-06-24), «Сплануй візит», Telegram/соц-стрічка. CMS-групи в singleton `homepage` (патерн hero/faq/stats). | 🔄 «Остання проповідь» done; решта не розпочато |

## Tier C — Інтеграції та харденінг

| # | Юніт | Тег | Скіл | Зус. | Суть | Стан |
|---|------|-----|------|------|------|------|
| C1 | **Справжня контактна форма** | PLAN | security-guidance · senior-fullstack | M | `contact/page.tsx` зараз лише client-валідація. Server Action + zod + honeypot + rate-limit + email (Resend/SMTP). Без зберігання ПД понад потрібне. | ⬜ |
| C2 | **CSP enforce** | PLAN | security-guidance | S–M | Перемкнути `Content-Security-Policy-Report-Only` → enforce у `next.config.ts` після runtime-смоук. Будь-який новий embed/скрипт → оновити відповідний source-list (`frame-src`/`img-src`/`connect-src`). | 🔄 Report-Only активний |
| C3 | **Sanity webhook → on-demand revalidation** | PLAN | senior-fullstack | M | `revalidateTag`/`revalidatePath` замість лише ISR-60. Route handler + GROQ-projection webhook. | ⬜ |
| C4 | **CI-пайплайн** | PLAN | ci-cd-pipeline-builder | M | GitHub Actions: install → typegen → lint → build (gate на PR). Опційно Lighthouse CI + a11y CI. Шаблони у `ci-cd-pipeline-builder/references/`. | ⬜ |
| C5 | **Гігієна env/секретів** | ENH | env-secrets-manager | S | Аудит токенів, `.env.example`, ротація, перевірка на витоки (`env_auditor.py`). | ⬜ |

## Tier D — Best-practice (в межах scope)

| # | Покращення | Тег | Скіл | Зус. | Суть |
|---|-----------|-----|------|------|------|
| D1 | **Аналітика + Search Console + Google Business Profile** | ENH | seo-audit | S | Privacy-friendly аналітика (Vercel/Plausible/Umami); верифікація GSC; GBP критичний для локального пошуку. |
| D2 | **Performance → Lighthouse ≥90 / зелені CWV** | ENH | performance-profiler | M | Шрифти (`display:swap`), розміри зображень, `next/dynamic`, bundle-analyze (`senior-frontend/scripts/bundle_analyzer.py`). Ціль вище поточного ≥80. |
| D3 | **Поглиблення SEO/AEO** | ENH | seo-audit · schema-markup | M | Повний LocalBusiness/Church NAP+geo+openingHours; динамічні OG (`next/og`); FAQ/HowTo «сплануй візит»; готовність до AI-відповідей. |
| D4 | **Календар подій + «додати в календар»** | ENH | senior-frontend | M | Вид-календар для `/events`, генерація `.ics`, повторювані події. На базі моделі `event`. |
| D5 | **Пошук по сайту** | ENH | senior-frontend | M | GROQ-пошук по news/events/ministries або Pagefind. |
| D6 | **Моніторинг помилок + uptime** | ENH | security-guidance | S | Sentry (frontend+server actions) + uptime-пінг. |
| D7 | **Автотести (зараз 0)** | ENH | ci-cd-pipeline-builder | M–L | ⚠️ **Найбільший інженерний ризик.** Vitest для `lib/`-утиліт + Playwright smoke на критичні маршрути; під'єднати в CI (C4). |
| D8 | **Повний a11y-прохід** | ENH | a11y-audit | M | `a11y_scanner.py` по всіх сторінках; форми, ARIA, фокус-пастки; закрити залишки після A2. |
| D9 | **Медіа-оптимізація** | ENH | performance-profiler | S | LQIP blur-placeholders із Sanity-метаданих, AVIF/WebP, ревізія `sizes`. |

## Tier E — Розширення поза первісним scope (вирішувати поштучно)

| # | Можливість | Тег | Скіл | Зус. | Чому варто |
|---|-----------|-----|------|------|-----------|
| E1 | **Онлайн-пожертви через monobank-банку** | SCOPE+ | senior-fullstack | M | Стандарт де-факто в Україні; лінк/QR/віджет без обробки платежів. Поєднати з B3. |
| E2 | **Форма молитовних потреб** | SCOPE+ | security-guidance | M | Server action → приватний email служителям або закритий Sanity-тип. |
| E3 | **Форма волонтерства/служіння** | SCOPE+ | security-guidance | M | Запис охочих служити; зв'язати зі служіннями. |
| E4 | **Реєстрація/RSVP на події** | SCOPE+ | senior-fullstack | M | Для подій з обмеженими місцями; розширює модель `event`. |
| E5 | **Email-розсилка** | SCOPE+ | content-creator | M | Double-opt-in (Brevo/Mailchimp/Sender). |
| E6 | **Мультимовність (uk + ru/en)** | SCOPE+ | senior-fullstack | L | next-intl + Sanity i18n + hreflang. Окрема велика ініціатива. |
| E7 | **PWA / офлайн-оболонка** | SCOPE+ | senior-frontend | M | Інсталюваність, офлайн-кеш. |
| E8 | **Подкаст проповідей (RSS)** | SCOPE+ | content-creator | S–M | RSS із моделі `sermon` (B2) → Spotify/Apple. |
| E9 | **«Сплануй візит» інтерактив** | SCOPE+ | landing-page-generator | M | Що очікувати, паркінг, діти, час; знижує бар'єр першого візиту. |
| E10 | **Девоційні/блог/план читання** | SCOPE+ | content-creator | M | Регулярний контент → утримання + SEO. |
| E11 | **Швидкий контакт (Telegram/WhatsApp-кнопка)** | SCOPE+ | senior-frontend | S | Плаваюча кнопка месенджера. |

## Залишок специфікацій (`context/specs/00-build-plan.md`)
- **Gallery Audit** — унікальні фото для кожного служіння (Sanity content update; перетин з A3). Решта Upcoming Units із 00-build-plan (Contact, Hero Unification, Team, Media, About) — виконані, крім Media (= B2).

## Дрібні TODO / Open Questions
- **Статистика застаріла:** «19+ років» на /about — церква заснована **1991** (не 2005) → ~33 р. Оновити в /studio (`homepage.stats`).
- **/history таймлайн** починається з **1992**, реальне заснування — **1991** → звірити з замовником і узгодити.
- **/about чернетки:** цінності + «чого очікувати» — драфти, замовник поредагує (перетин з B1, коли буде singleton).
- **Legacy-події:** наявні демо-події без `startDate`/`type` → відфільтровані всюди (graceful). Менеджер заповнює дату/тип у /studio (pre-launch) або створює нові.
- **publisher.logo** у NewsArticle JSON-LD відсутнє (немає лого-ассета) → додати після **A1**.
- **Footer slug служінь** уже динамічні з Sanity (вирішено в 0.2); координати, email, openingHours, per-page heroes — вирішені (див. `progress-tracker.md` → архів).
- **Build/typegen:** `sanity schema extract` потребує Sanity CLI auth — локально виставити `SANITY_AUTH_TOKEN` (з `SANITY_API_WRITE_TOKEN`) перед `pnpm build`/`pnpm typegen`, інакше `CorsOriginError`. Vercel має власну auth.

---

# Частина 3 — ⚠️ Launch checklist (НАЙОСТАННІШИЙ крок проєкту)

Виконувати ТІЛЬКИ коли користувач явно скаже, що сайт готовий. **Ніколи раніше.**
1. **Відкрити індексацію:** `app/robots.ts` → allow crawling (зняти `Disallow: /`).
2. **Зняти `noindex`** з усіх сторінок, що стали реальними (`robots: { index: false }`).
3. **`NEXT_PUBLIC_SITE_URL`** → реальний власний домен у Vercel (зараз авто-derive з Vercel URL).
4. Після появи домену — фінальний прогін D1 (GSC/GBP верифікація).

---

## Рекомендований дефолтний порядок
`A1–A4 (готовність) → B1–B4 (нові сторінки) → C1–C5 (харденінг) → D1–D9 (best-practice) → E* (за бажанням) → НАЙОСТАННІШЕ: відкриття індексації`.
Перед кожною фазою — перелік пунктів + запит, що робити; після кожного етапу — запит про commit+push. Альтернатива «менший обсяг до відкриття»: A1–A4 + C2 + D1, але відкриття індексації лишається фінальним кроком.

**Найбільший ризик** інженерно — відсутність автотестів (D7); закрити паралельно з CI (C4).

## Прогрес по плану
- 2026-06-25 (R3) — медіа-полірування: чіткіші прев'ю (maxres@q90 + sd-фолбек, `images.qualities`); таби без релоуду (клієнт Server Action `searchMedia` + анімація, шалов URL); підсвічування батьківського нав-пункту; `SpeakerInput` → `@sanity/ui Autocomplete` (дропдаун + вільний ввід). `build` ✓ 35 стор.
- 2026-06-24 (R2) — медіа-фікси: навігація «Медіа»→Відео/Фото; нова сторінка **/media/photos** (бенто-агрегація фото з галерей служінь, лайтбокс, «Завантажити ще»); динамічний `SpeakerInput`; дата без часу; вищеякісні YouTube-прев'ю (maxres+фолбек); +3 категорії. `build` ✓ 35 стор. Деталі — `progress-tracker.md`.
- 2026-06-24 — **B2 Етап 3 + масштабування /media** (серверний пошук/фільтр, «Завантажити ще», `tags`, «остання проповідь» на головній). commit `8a6d3ae`.
- 2026-06-21 — план консолідовано з `improvement-roadmap.md` + специфікацій + open-questions; scratch-плани видалено. Очікую вибір користувача, з якого пункту стартувати (гейт перед фазою).
- 2026-06-19 — **A4-аудит** виконано (SEO/perf/security): S2 (екранування JSON-LD), SEO quick wins (canonical×11 + OG/Twitter), C2 (security headers enforce + CSP Report-Only). `next build` ✓ 34 стор. **TODO C2:** після смоук-тесту перемкнути CSP Report-Only → enforce.
