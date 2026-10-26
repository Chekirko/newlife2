# Architecture Context

## Metadata defaults SEO-3.1 (2026-10-26)

`lib/metadata.ts:getPageMetadata(path, page)` читає чинний `getSiteSettings()` (ISR 60s) і повертає повні OG/Twitter objects для root та 11 статичних маршрутів. Пріоритет description: власний непорожній опис → `siteSettings.defaultDescription` → попередній кодовий fallback; title зберігає чинні тексти, HTML/зайві пробіли в title/description прибираються. `SITE_SETTINGS_QUERY` тепер вибирає наявне `ogImage`; `SiteSettings.ogImage` — URL Sanity 1200×630 або null за відсутнього asset ref, fallback — чинне hero-фото. Нових схем/полів/інтеграцій немає. Helper задає social URL через `SITE_URL`, але canonical лише явно переданий сторінкою; глобального canonical немає. Root `generateMetadata` зберігає metadataBase/keywords/noindex. Динамічні detail-шаблони ще очікують SEO-3.2; UI/JSON-LD/robots/sitemap не змінені.

## Контактна форма C1 (2026-10-25)

`/contact/components/ContactForm` → page-local `actions.ts` (Server Action) → Zod-validation/honeypot → адреса одержувача з серверного env або `getSiteSettings()` → `delivery.ts` (server-only) → Upstash REST EVAL (атомарні ліміти між instances) → Resend HTTP API. Ключі тільки в server env, plain-text лист, visitor email лише Reply-To. Звернення не зберігаються у CMS/browser/application logs; Redis має тільки HMAC keys/counts із TTL. Конфігурація відсутня/сервіс не відповідає → помилка, без удаваного успіху. Докладно: `docs/contact-form.md`; реальний email/Redis QA потребує конфігурації. Нових Sanity-схем або API routes немає.

## Studio: пакетний вибір наявних фото (2026-10-25)

`news.gallery` має `GalleryInput` із двома кнопками: native multiple upload через `onSelectFile` і `Select — вибрати фото зі Studio`. Другий шлях відкриває `GalleryAssetPicker`: `useClient` поточного Studio workspace + параметризований `defineQuery` до `sanity.imageAsset`, пошук за originalFilename, стабільне сортування й порції по 40. Це окремий picker для масиву; `sanity-plugin-media` 4.3.6 у single-image source одразу повертає один asset і не реалізує потрібний multi-select. Вибрані assets додаються одним native `onInsert` (унікальні `_key`, image `_type`, weak asset refs, `skipInitialValue`, `open:false`); масив цілком не перезаписується. Основне image-поле лишається одиночним. Власних токенів, API routes чи CMS-клієнта для upload немає.

`event-source-polyfill@1.0.31` має відтворюваний pnpm patch у `patches/`: лише його recoverable heartbeat message `No activity within … Reconnecting.` логовано як warning, щоб Next dev overlay не перекривав Studio. Події error/reconnect, retry/backoff та справжні мережеві/HTTP помилки збережено. Патч не усуває мережеві розриви й не вимикає live sync.

### Studio: пакетний вибір наявних фото (2026-10-25)

`news.gallery` має `GalleryInput` із двома кнопками: native multiple upload через `onSelectFile` і `Select — вибрати фото зі Studio`. Другий шлях відкриває `GalleryAssetPicker`: `useClient` поточного Studio workspace + параметризований `defineQuery` до `sanity.imageAsset`, пошук за originalFilename, стабільне сортування й порції по 40. Це окремий picker для масиву; `sanity-plugin-media` 4.3.6 у single-image source одразу повертає один asset і не реалізує потрібний multi-select. Вибрані assets додаються одним native `onInsert` (унікальні `_key`, image `_type`, weak asset refs, `skipInitialValue`, `open:false`); масив цілком не перезаписується. Основне image-поле лишається одиночним. Власних токенів, API routes чи CMS-клієнта для upload немає.

`event-source-polyfill@1.0.31` має відтворюваний pnpm patch у `patches/`: лише його recoverable heartbeat message `No activity within … Reconnecting.` логовано як warning, щоб Next dev overlay не перекривав Studio. Події error/reconnect, retry/backoff та справжні мережеві/HTTP помилки збережено. Патч не усуває мережеві розриви й не вимикає live sync.

## Stack

| Layer       | Technology                      | Role                                      |
| ----------- | ------------------------------- | ----------------------------------------- |
| Framework   | Next.js 16 (App Router) + TS    | SSG/SSR, routing, React Server Components |
| CMS         | Sanity v4                       | Контент, медіа, вбудоване Studio (+ `sanity-plugin-media` — бібліотека ассетів) |
| CMS Client  | next-sanity + @sanity/image-url | GROQ-запити, генерація URL зображень      |
| Styling     | Tailwind CSS v4 + globals.css   | Utility-first + кастомна дизайн-система   |
| Types       | Sanity TypeGen                  | Автогенерація TS-типів з GROQ-запитів     |
| Deploy      | Vercel                          | CI/CD, edge functions, preview            |
| Fonts       | Local WOFF2: Poppins, Roboto, Playfair Display (`public/fonts/`, `app/fonts.css`) | Типографіка без Google Fonts network під час build/runtime |

## System Boundaries

- `app/(front)/` — Публічні сторінки (homepage, news, ministries, history)
- `app/(front)/components/` — Компоненти ТІЛЬКИ для homepage
- `app/(front)/news/components/` — Компоненти ТІЛЬКИ для сторінок новин
- `app/(front)/events/` — Сторінки подій/оголошень (`/events`, `/events/[slug]`) + `components/` (EventCard, SidebarRecentEvents, EventsPagination) — структура дзеркалить `news/`
- `app/(front)/ministries/components/` — Компоненти ТІЛЬКИ для списку служінь
- `app/(front)/ministries/[slug]/components/` — Компоненти для деталей служіння
- `app/(front)/team/components/` — Компоненти для сторінки команди (TeamSection, HonorarySection, TeamPhotoBanner, TeamMemberCard)
- `app/(front)/**/queries.ts` — GROQ-запити, локальні для кожної сторінки
- `app/studio/` — Sanity Studio (не модифікувати вручну)
- `components/` — Спільні компоненти (Header, Footer, HeroSlider, NewsSlider, PageHero, PlaceholderPage, NotFoundView, **PortableTextBody** — рендер Portable Text-тіла для детальних сторінок news/event/ministry/team, мапить блоки на типографіку сайту, fallback на `<p>` для legacy-рядка)
- `ChurchFooter` — async Server Component: підтягує топ-5 служінь із Sanity для колонки футера (динамічні посилання, без хардкоду slug)
- `app/not-found.tsx` — глобальний 404 для незіставлених URL (додає Header/Footer вручну, бо root layout без хрому); `app/(front)/not-found.tsx` — 404 для `notFound()` усередині сайту (хром із (front)-layout); `app/(front)/error.tsx` — error-межа сегмента (Client Component)
- `components/sections/` — Спільні секційні компоненти
- `components/ui/` — Базові UI-компоненти (MinistryCard)
- `sanity/lib/` — Sanity client, image helper, спільні запити, згенеровані типи
- `sanity/lib/queries.ts` — ТІЛЬКИ спільні GROQ-запити (використовуються 2+ сторінками)
- `sanity/schemaTypes/objects/richText.ts` — `richTextBlocks`: ЄДИНЕ означення Portable Text-тулбару (заголовки H2–H4+цитата = розмір тексту, жирний/курсив/підкреслення, списки, посилання, вбудовані зображення з alt), спільне для body-полів news/event/ministry/teamMember. Excerpt-поля (`text`/`description`/`shortDescription`) лишаються простим текстом для карток/SEO.
- `pageHeroes` — **singleton**: редаговані hero-фони ВСІХ сторінок, крім головної (`newsHero`, `eventsHero`, `ministriesHero`, `teamHero`, `historyHero`, `contactHero`, `aboutHero`, `mediaHero`, `privacyHero`). Для розділів зі списком+деталями (news/events/ministries/team) — одне фото спільне для списку та всіх деталей. Читається через `getPageHeroes()` (`lib/page-heroes.ts`) — map-based, повертає `Record<PageHeroKey, string>` із fallback на статичні файли `/public/images` для кожного ключа. Кожна сторінка (Server Component) фетчить `getPageHeroes()` і передає потрібний ключ у `PageHero`/детальний hero. Enforce як інші singleton-и (structure.ts + sanity.config.ts SINGLETON_TYPES). Додати hero для нової сторінки = поле в схемі + ключ+fallback у `getPageHeroes` + проп у сторінці.
- `sanity/schemaTypes/` — Sanity-схеми документів (siteSettings, homepage, pageHeroes, aboutPage, ministry, news, event, teamMember). `siteSettings` — **singleton** (один документ): редагується контент-менеджером у /studio, тримає NAP, розклад, соцмережі (масив `{platform,url,label}` — додаються/сортуються без розробника, платформи з реєстру `lib/social.ts`), OG-дефолти. `homepage` — **singleton**: редагований контент головної (групи: `heroSlides`, `testimonials` (свідчення — цитата/ім'я/підпис/рейтинг/опц. фото), `faq` (запитання/відповідь — живить акордеон + FAQPage JSON-LD), `whatYouFind` (картки «Що ви знайдете» — іконка з дропдауну + заголовок/опис/зображення)). Увесь статичний контент головної тепер у CMS. (Статистика церкви живе в `aboutPage`, не тут — рендериться лише на /about.) `event` — події **та** оголошення (одна модель, поле `type`): `startDate` (datetime, для сортування/показу/Event JSON-LD), `activeUntil` (опц. дедлайн), `location`, `description` (анонс), `body` (повний текст). «Актуальність» для головної залежить від типу: `подія` показується поки `startDate >= $today` (видима ввесь свій день, далі зникає — `activeUntil` для подій ІГНОРУЄТЬСЯ); `оголошення` — поки `coalesce(activeUntil, startDate) >= $now`. `page.tsx` передає обидва параметри (`now`, `today`). Детальна сторінка `подія` віддає Event JSON-LD. `aboutPage` — **singleton**: увесь редагований контент сторінки /about (заголовки секцій + контент): hero-заголовок, «хто ми»+місія, історія-абзаци, віровчення[], цінності[] (iconKey-дропдаун + `featured`), «чого очікувати»[] (іконка через `TagInput` — обери зі списку АБО впиши будь-який FA-клас), керівництво, статистика (заголовки + числа `stats[]` value/label), фінальний CTA. Поля пласкі (whoPreTitle, denomination, historyParagraphs, beliefs[], values[], stats[]…), згруповані по секціях. Числа статистики тепер ТУТ (перенесено з `homepage`, бо рендеряться лише на /about). Кнопкові маршрути лишаються в коді; редагується лише текст. Читається через `getAboutPage()`
- `lib/` — Загальні утиліти: `utils.ts` (`formatDate`, `formatEventDate`, `jsonLdHtml` — екранує `<` для безпечного вставлення JSON-LD у `<script>`), `site.ts` (`SITE_URL`), `church.ts` (типізований FALLBACK + форма даних церкви), `site-settings.ts` (`getSiteSettings()` — читає Sanity-singleton `siteSettings` і зливає поверх дефолтів `church.ts`; ЄДИНА точка доступу до даних церкви для UI та JSON-LD; також віддає похідний `openingHours[]` — служіння з днем+`time`+`endTime`, UA-день мапиться на schema.org-англ. — який живить `openingHoursSpecification` у homepage Church JSON-LD), `social.ts` (реєстр соцмереж: платформа → іконка/колір/назва; ЄДИНЕ джерело для дропдауна у схемі та рендеру в header/footer), `homepage.ts` (`getHomepage()` — читає Sanity-singleton `homepage`, повертає `heroSlides` + `testimonials` + `faq` + `whatYouFind`; резолвить зображення через `urlFor()`, fallback на відповідні `*-data.ts`), `hero-slides-data.ts` + `testimonials-data.ts` + `faq-data.ts` + `what-you-find-data.ts` + `about-data.ts` (чисті типізовані дефолти — без Sanity-залежностей, спільні для helper-ів та seed-скриптів; `about-data.ts` — типізований fallback + канонічна ФОРМА всього контенту /about (`ABOUT_FALLBACK: AboutContent`): історія, віровчення, цінності, «чого очікувати», статистика (числа), заголовки секцій, CTA), `about.ts` (`getAboutPage()` — читає Sanity-singleton `aboutPage` і зливає поверх `ABOUT_FALLBACK` ПОЛЕ-ЗА-ПОЛЕМ: порожній CMS-рядок/масив → дефолт; патерн як `getSiteSettings()`)
- `public/images/` — Статичні зображення (hero-фони, іконки)
- `next.config.ts` — `images.remotePatterns` (cdn.sanity.io) + `headers()`: security-заголовки в enforce (nosniff, Referrer-Policy, X-Frame-Options, HSTS, Permissions-Policy) на всіх маршрутах та CSP у **Report-Only** (`/studio` виключено; перемкнути в enforce після runtime-смоук — див. `context/master-plan.md` → C2)
- `sanity/components/` — кастомні Studio-інпути: **`TagInput`** (обери зі списку `schemaType.options.list` АБО впиши своє — вільний текст ЗБЕРІГАЄТЬСЯ через `set/unset`; reusable для tag/category-полів: `event.tag`, `news.mainCategory`, `news.categories`; замінив зламаний `CategoryInput`), `QuoteBlock`

## Storage Model

- **Фото новин**: `news.image` — обов’язкове image-поле з перевіркою asset; `news.gallery` — необов’язковий масив до 10 image-елементів із необов’язковим `alt`. Asset кожного доданого елемента обов’язковий. Detail-запит через `defineQuery` відбирає до 10 наявних assets та проєктує dimensions/LQIP; сторінка будує єдину групу основного й додаткових фото. `NewsPhotoGallery` — Server Component із клієнтськими `PhotoViewer`-тригерами, пропускаються відсутні assets/розміри. `GalleryInput` у Studio додає multiple file picker і делегує кожен файл у штатний `onSelectFile({file, schemaType, assetSource})`; source з `Uploader` береться з `useFormBuilder().__internal.image.assetSources`, з урахуванням `directUploads`, як у native Sanity upload target. Sanity контролює прогрес, помилки, initial items і patches. **Sanity 4.22 не передає `onUpload` для image/object arrays** — не використовувати його як умову доступності чи upload callback. Добірка понад вільні місця або з непідтримуваним файлом відхиляється цілком до початку upload. Старі новини без gallery сумісні, міграція не потрібна. Галерея `/media/photos` лишається агрегатом `ministry.gallery`.
- **Повнорозмірні фото**: `sanity/lib/image.ts` → `originalImageUrl()` повертає повну роздільність asset, ігнорує crop/hotspot, встановлює `q=100`; без resize/auto-format. Фото на детальних news/event/ministry/team, у фотогалереях і Portable Text використовують цей URL + `Image unoptimized`, без другого стиснення Next. Публічний CDN усе одно кодує JPEG; це не побітовий оригінал (`dlRaw` вимагає авторизації, не виносити токени на фронтенд). `PhotoViewer` — спільний клієнтський button-wrapper; відкриває `ImageLightbox` із групою `PhotoItem[]` і потрібним індексом. Переглядач використовує native modal `dialog` у top layer (працює всередині transformed-карток), Esc/бекдроп/закриття, ←/→ й екранні кнопки, лічильник, блокування scroll і повернення фокусу. Індекс живе всередині переглядача. Фонові hero, navigation-картки й відео мають окреме компонування. Повнорозмірні файли значно важчі; lazy loading збережено.
- **Sanity Content Lake**: Весь динамічний контент (новини, служіння, події, текстові описи)
- **Sanity CDN**: Медіа-файли (фотографії, зображення галерей)
- **`public/`**: Статичні ресурси (hero-фони, логотип, іконки, фото пастора)

## Caching and Revalidation Model

- **Incremental Static Regeneration (ISR)**: Усі динамічні сторінки, що завантажують контент із Sanity, використовують Next.js ISR для автоматичного оновлення кешу у фоновому режимі.
- **Інтервал ревалідації**: Сторінки експортують `revalidate = 60` (кешування не більше ніж на 60 секунд) для балансу продуктивності та актуальності.
- **Пряме опитування API (Bypass CDN)**: Клієнт Sanity налаштований з `useCdn: false`, щоб під час фонової регенерації Next.js отримував найсвіжіші опубліковані зміни безпосередньо з Live API, оминаючи затримки кешу CDN.
- **Виняток — динамічні сторінки з фільтрами**: `/media` читає `searchParams` (`category`/`speaker`/`q`) для серверного пошуку/фільтрування, тому рендериться **on-demand** (`ƒ` dynamic), а не як статичний ISR. Прийнятний компроміс заради масштабу (тисячі відео): кожен запит виконує GROQ свіжо. Сторінки-списки без серверних фільтрів (`/news`, `/events`) лишаються на slice-пагінації через `searchParams`, але кешуються per-URL.

## Auth and Access Model

- Публічний сайт — авторизація користувачів відсутня
- Pre-launch SEO-2.2: root metadata `noindex, follow` та `X-Robots-Tag: noindex` у чинному `next.config.ts#headers` на всіх шляхах/ресурсах; `robots.ts` зберігає `Disallow: /`. Це пошукові сигнали, не контроль доступу й не гарантія виключення URL за заблокованого crawling. Privacy/Studio зберігають свої robots. Production platform protection (F01) лишається окремою зовнішньою дією; перед SEO-L узгоджено переглянути root/header/page-specific правила. Докази — `docs/seo/audit.md`, SEO-2.2.
- Sanity Studio (`/studio`) — доступ через Sanity Dashboard (окремий логін)
- Контент-менеджер оновлює дані через Studio без участі розробника

## Invariants

1. Весь динамічний контент живе ТІЛЬКИ в Sanity — жодних hardcoded даних для CMS-типів
2. GROQ-запити визначаються через `defineQuery()` з `next-sanity` — для TypeGen сумісності
3. Спільні компоненти (`components/`) НІКОЛИ не імпортують з page-level директорій (`app/(front)/components/`)
4. Page-level компоненти НЕ виносяться в `components/` без підтвердження переиспользування на 2+ сторінках
5. Кириличний текст записується ТІЛЬКИ через інструменти редагування — НІКОЛИ через PowerShell pipe/Out-File
6. `npm run build` ПОВИНЕН проходити перед кожним push/deploy
7. Sanity TypeGen (`npm run typegen`) запускається при зміні GROQ-запитів або Sanity-схем
8. CSS-кольори використовують ТІЛЬКИ токени з `globals.css` (`--color-primary`, `--gradient-start/end`) — жодних raw hex
9. Відповідальні за служіння зв'язуються як **масив weak references** до `teamMember` (`ministry.leaders[]` — кілька осіб на служіння) — дозволяє видаляти служителів без блокування, фронтенд gracefully ховає блок при порожньому масиві (1 особа → singular card; 2+ → сітка міні-карток)
10. Усі `reference`-поля в Sanity-схемах ЗАВЖДИ використовують `weak: true` — фронтенд-компоненти ОБОВ'ЯЗКОВО перевіряють `null` перед рендером referenced-даних
11. Дані церкви (NAP, розклад, соцмережі, гео) для UI та JSON-LD ЗАВЖДИ читаються через `getSiteSettings()` (`lib/site-settings.ts`) — Sanity-singleton `siteSettings` із fallback на `lib/church.ts`. Client Components не фетчать самі: layout/сторінка (Server Component) фетчить і передає `settings` пропсами (напр. `ChurchHeader`). Singleton-інваріант: рівно один документ `siteSettings` (enforced у `structure.ts` + `sanity.config.ts` document.actions)
12. **Серверний пошук/фільтр великих колекцій**: для типів, що ростуть до тисяч (наразі `mediaItem`), пошук/фільтр/пагінація — на СЕРВЕРІ через GROQ (`match` + токенізований префікс `toMatchQuery`; порожній параметр = `''` → гілка `select(...,true)` без фільтра). **Початковий рендер** — Server Component із `searchParams` (прямий лінк/SEO). **Інтерактивна зміна фільтра** (таб/спікер/пошук) — НЕ навігація, а Server Action (`searchMedia → {cards,total}`) у `useTransition`, що оновлює лише грид (cross-fade); URL синхронізується шалов (`history.replaceState`). Підвантаження («Завантажити ще») — Server Action (`loadMoreMedia`), клієнт акумулює. Спільний трансформер raw→card живе в `lib/` (одне джерело правди для сторінки й екшенів). НЕ фетчити всю колекцію на клієнт для in-memory фільтрування; НЕ робити повну навігацію заради зміни фільтра.
13. Абсолютні URL (metadataBase, sitemap, JSON-LD `item`/`url`) ЗАВЖДИ походять із `lib/site.ts` → `SITE_URL` — ЖОДНОГО захардкодженого домену в коді. Порядок визначення: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` (авто-домен Vercel, само-оновлюється на власний домен після під'єднання) → дефолт `https://newlife.church` (лише для локального/не-Vercel білда). `SITE_URL` читається ТІЛЬКИ в Server Components
