# Improvement Roadmap — сайт церкви «Нове Життя»

> Жива дорожня карта продовження проєкту (перенесена з плану 2026-06-19). Повне впорядковане меню: і незавершене із запланованого, і best-practice покращення (включно з тими, що поза первісним scope — позначені `[SCOPE+]`). Канонічні процес-правила — у `ai-workflow-rules.md` → **Working Agreement**.

## Стан на момент фіксації

Next.js 16 (App Router) + Sanity v3 + Tailwind v4, Vercel, лише укр., **pre-launch** (`app/robots.ts` = `Disallow: /`, плейсхолдери `noindex`).

**Зроблено (Фази 0–2 ✅):** Foundation (env/SITE_URL, robots/sitemap, church-дані, JSON-LD Church/WebSite); повна контент-модель + головна повністю в CMS (singletons `siteSettings`/`homepage`/`pageHeroes`, модель `event` = події+оголошення, Portable Text для news/event/ministry/team, JSON-LD NewsArticle/Event/Person/FAQPage/BreadcrumbList); a11y + WCAG AA (focus-visible, skip-link, keyboard nav, контраст сірих+кнопок, `next/image` героі, self-host Font Awesome).

**Не розпочато:** Фаза 3 (нові сторінки), Фаза 4 (інтеграції/харденінг) + залишки.

## Як читати

Теги: **[BLOCKER]** блокує запуск · **[PLAN]** уже в дорожній карті · **[ENH]** покращення в межах scope · **[SCOPE+]** поза первісним scope (вирішувати поштучно). Колонка «Скіл» = який `SKILL.md` завантажити перед роботою (за реєстром в `AGENTS.md`). Зусилля: S ≈ пів дня · M ≈ 1–2 дні · L ≈ 3+ днів.

---

## Tier A — Блокери запуску (закрити перед «вийти в світ»)

| # | Юніт | Тег | Скіл | Зус. | Суть |
|---|------|-----|------|------|------|
| A1 | **Логотип** | BLOCKER · PLAN | schema-markup | S | Є EPS, нема SVG/PNG. Потрібен ассет від замовника → у хедер/футер (замість кружечка «НЖ») + `Organization.logo` / `publisher.logo` у JSON-LD. |
| A2 | **Рішення по бренд-контрасту** | BLOCKER · PLAN | a11y-audit | M | Залишок Фази 2: `--color-primary` як текст посилань (~1.9:1), focus-ring (<3:1), білий текст на яскравому градієнті CTA-боксів, `.gradient-text` — усе fail AA. Рішення: затемнити токен лінків/фокусу або ввести окремий доступний варіант. Перевірити `a11y-audit/scripts/contrast_checker.py`. |
| A3 | **Наповнення реальним контентом** | PLAN | content-creator | M | Legacy-події без `startDate`/`type` (зараз приховані); унікальні фото галерей служінь; реальні свідчення/FAQ/stats; тексти для /about, /media, /give. Контент у /studio, не код. |
| A4 | **Pre-launch SEO/perf/security-прохід** | PLAN | seo-audit · performance-profiler · security-guidance | M | Прогнати аудити; виставити `NEXT_PUBLIC_SITE_URL` на власний домен у Vercel. **Саме відкриття індексації тут НЕ робиться** — це найостанніший крок усього проєкту (Working Agreement п.4). |

## Tier B — Фаза 3: нові сторінки (УЗГОДИТИ дизайн першим)

| # | Юніт | Тег | Скіл | Зус. | Суть / нові артефакти |
|---|------|-----|------|------|------|
| B1 | **/about — Про церкву** | PLAN | senior-frontend · schema-markup | M | Місія, віровизнання, лінк на історію, керівництво (reuse `teamMember`), блок «сплануй візит». Прибрати `noindex` + у sitemap. JSON-LD AboutPage/Organization. Контент у Sanity (поле в `homepage`/новий singleton чи `pageHeroes`-патерн). |
| B2 | **/media — проповіді + трансляції** | PLAN | senior-fullstack · schema-markup | L | **Нова Sanity-схема `sermon`** (серія, спікер→`teamMember`, дата, посилання на Писання, YouTube/audio, нотатки Portable Text). Сторінка-архів + фільтри (дзеркало `news/`), live-embed, секція «остання проповідь» на головній, VideoObject JSON-LD. Зареєструвати тип у `schemaTypes/index.ts` + structure + sitemap-branch. |
| B3 | **/give — пожертви/реквізити** | PLAN · містить SCOPE+ | security-guidance | M | Банківські реквізити + примітка прозорості. **[SCOPE+]** monobank-банка (лінк/QR), посилання на платіжні застосунки. Без обробки платежів на сайті. Прибрати `noindex` + sitemap. |
| B4 | **Секції головної з Фази 3** | PLAN | senior-frontend | M | «Остання проповідь» (з B2), «Сплануй візит», Telegram/соц-стрічка. Додати як CMS-групи в singleton `homepage` (той самий патерн, що hero/faq/stats). |

## Tier C — Фаза 4: інтеграції та харденінг

| # | Юніт | Тег | Скіл | Зус. | Суть |
|---|------|-----|------|------|------|
| C1 | **Справжня контактна форма** | PLAN | security-guidance · senior-fullstack | M | `app/(front)/contact/page.tsx` зараз лише client-валідація. Server Action + zod + honeypot + rate-limit + надсилання email (Resend/SMTP). Без зберігання ПД понад потрібне. |
| C2 | **Security headers / CSP** | PLAN | security-guidance | S–M | `next.config` headers: CSP (дозволити Sanity CDN, YouTube, Google Maps), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |
| C3 | **Sanity webhook → on-demand revalidation** | PLAN | senior-fullstack | M | `revalidateTag`/`revalidatePath` замість лише ISR-60 — свіжість миттєва, менше зайвих fetch. Route handler + GROQ-projection webhook. |
| C4 | **CI-пайплайн** | PLAN | ci-cd-pipeline-builder | M | GitHub Actions: `pnpm install` → typegen → lint → build (gate на PR). Опційно Lighthouse CI + a11y CI (axe/pa11y). Шаблони — у `ci-cd-pipeline-builder/references/`. |
| C5 | **Гігієна env/секретів** | ENH | env-secrets-manager | S | Аудит токенів (`SANITY_API_WRITE_TOKEN` тощо), `.env.example`, ротація, перевірка на витоки (`env_auditor.py`). |

## Tier D — Best-practice покращення (в межах scope)

| # | Покращення | Тег | Скіл | Зус. | Суть |
|---|-----------|-----|------|------|------|
| D1 | **Аналітика + Search Console + Google Business Profile** | ENH | seo-audit | S | Privacy-friendly аналітика (Vercel Analytics / Plausible / Umami). Верифікація в GSC. GBP критичний для локального пошуку церкви. |
| D2 | **Performance → Lighthouse ≥90 / зелені CWV** | ENH | performance-profiler | M | Аудит шрифтів (`display:swap`), розмірів зображень, `next/dynamic`, bundle-analyze (`senior-frontend/scripts/bundle_analyzer.py`). Ціль вище за поточний поріг ≥80. |
| D3 | **Поглиблення SEO/AEO** | ENH | seo-audit · schema-markup | M | LocalBusiness/Church повний NAP+geo+openingHours (майже є); динамічні OG-зображення (`next/og`) під кожну сторінку; FAQ/HowTo для «сплануй візит»; готовність до AI-відповідей (ChatGPT/Perplexity). |
| D4 | **Календар подій + «додати в календар»** | ENH | senior-frontend | M | Вид-календар для `/events`, генерація `.ics`, повторювані події. Спирається на наявну модель `event`. |
| D5 | **Пошук по сайту** | ENH | senior-frontend | M | GROQ-пошук по news/events/ministries або Pagefind (статичний індекс). |
| D6 | **Моніторинг помилок + uptime** | ENH | security-guidance | S | Sentry (frontend+server actions) + uptime-пінг. |
| D7 | **Автотести (зараз 0)** | ENH | ci-cd-pipeline-builder | M–L | Найбільший інженерний ризик: жодного тесту. Vitest для `lib/` утиліт + Playwright smoke на критичні маршрути; під'єднати в CI (C4). |
| D8 | **Повний a11y-прохід** | ENH | a11y-audit | M | Прогнати `a11y_scanner.py` по всіх сторінках; форми, ARIA, фокус-пастки; закрити залишки після A2. |
| D9 | **Медіа-оптимізація** | ENH | performance-profiler | S | LQIP blur-placeholders із Sanity-метаданих, AVIF/WebP, `sizes` ревізія. |

## Tier E — Розширення поза первісним scope (користувач увімкнув; вирішувати поштучно)

| # | Можливість | Тег | Скіл | Зус. | Чому варто |
|---|-----------|-----|------|------|-----------|
| E1 | **Онлайн-пожертви через monobank-банку** | SCOPE+ | senior-fullstack | M | В Україні — стандарт де-факто; лінк/QR/віджет банки без обробки платежів на сайті. Природно поєднати з B3. |
| E2 | **Форма молитовних потреб** | SCOPE+ | security-guidance | M | Часта церковна фіча; server action → приватний email служителям або Sanity (закритий тип). |
| E3 | **Форма волонтерства/служіння** | SCOPE+ | security-guidance | M | Запис охочих служити; зв'язати зі служіннями. |
| E4 | **Реєстрація/RSVP на події** | SCOPE+ | senior-fullstack | M | Для подій з обмеженою кількістю місць; розширює модель `event`. |
| E5 | **Email-розсилка** | SCOPE+ | content-creator | M | Double-opt-in (Brevo/Mailchimp/Sender) для новин і анонсів. |
| E6 | **Мультимовність (uk + ru/en для діаспори)** | SCOPE+ | senior-fullstack | L | Найбільший лифт: next-intl + Sanity field/document i18n + hreflang. Окрема велика ініціатива. |
| E7 | **PWA / офлайн-оболонка** | SCOPE+ | senior-frontend | M | Інсталюваність, офлайн-кеш базових сторінок. |
| E8 | **Подкаст проповідей (RSS)** | SCOPE+ | content-creator | S–M | RSS-фід із моделі `sermon` (B2) → Spotify/Apple Podcasts. |
| E9 | **«Сплануй візит» інтерактив + CTA для гостя** | SCOPE+ | landing-page-generator | M | Що очікувати, паркінг, діти, час; знижує бар'єр для першого візиту. |
| E10 | **Девоційні/блог/план читання** | SCOPE+ | content-creator | M | Регулярний контент → утримання + SEO. |
| E11 | **Швидкий контакт (Telegram/WhatsApp-кнопка)** | SCOPE+ | senior-frontend | S | Плаваюча кнопка месенджера. |

---

## Наскрізні принципи (governance)

- **Дисципліна проєкту незмінна:** spec на кожен юніт у `context/specs/`, оновлення `progress-tracker.md` після кожного, завантаження відповідного `SKILL.md` перед роботою, `pnpm build` ✓, ASK дизайн перед новою сторінкою, синхронізація sitemap при додаванні публічної сторінки/типу (`ai-workflow-rules.md` → DoD).
- **Karpathy-дисципліна:** кожен юніт — мінімальний код під вимогу, без спекулятивних абстракцій; нові reference-поля — `weak: true` + null-guard (інваріант #10); кольори — лише токени `globals.css`.
- **Найбільший ризик** інженерно — відсутність автотестів (D7): варто закрити паралельно з CI (C4).

## Рекомендований дефолтний порядок (можна перевпорядкувати; кожна фаза — через гейт)

`A1–A4 (готовність) → B1–B4 (нові сторінки) → C1–C5 (харденінг) → D1–D9 (best-practice) → E* (розширення за бажанням) → НАЙОСТАННІШЕ: відкриття індексації (Working Agreement п.4)`.

Перед кожною фазою — перелік її пунктів і запит, що саме робити; після кожного етапу — запит про commit + push. Альтернатива «менший обсяг до відкриття»: звузити до A1–A4 + C2 + D1, але відкриття індексації все одно лишається фінальним кроком за явним «готово».

## Прогрес по дорожній карті

- 2026-06-19 — карту зафіксовано в контексті; Working Agreement узгоджено (див. `ai-workflow-rules.md`). Очікую вибір користувача, з якої фази/пунктів стартувати (гейт перед Фазою A).
