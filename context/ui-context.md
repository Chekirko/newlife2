# UI Context

## Theme

Light theme. Clean, modern church website aesthetic. White/light gray backgrounds with green accent colors. Frosted-glass effects on hero sections. Professional but warm and inviting feel.

## Colors

All components must use CSS custom property tokens from `globals.css` — no hardcoded hex values.

| Role              | CSS Variable         | Value     |
| ----------------- | -------------------- | --------- |
| Primary           | `--color-primary`    | `#4cbd89` |
| Primary text / focus | `--color-primary-text` | `#216e4e` (6.17:1 on white; 5.46:1 on gray-200) |
| Gradient start    | `--gradient-start`   | `#97c74e` |
| Gradient end      | `--gradient-end`     | `#2ab9a5` |
| Page background   | white                | `#ffffff` |
| Surface / section | `--color-gray-100`   | `#f7f8f9` |
| Border            | `--border-color`     | `rgba(0,0,0,0.1)` |
| Text primary      | `--color-gray-800`   | `#343a40` |
| Text body         | `--color-gray-600`   | `#6b7177` (AA ≥4.5:1 on white) |
| Text muted        | `--color-gray-500`   | `#6f757a` (AA ≥4.5:1 on white) |
| Success           | `--color-success`    | `#28a745` |
| Danger            | `--color-danger`     | `#dc3545` |
| Warning           | `--color-warning`    | `#ffc107` |

### Brand Gradient

```css
background: linear-gradient(150deg, var(--gradient-end) 0%, var(--gradient-start) 50%, var(--gradient-end) 100%);
background-size: 260% 100%;
```

Use `.bg-grad` utility class for decorative backgrounds (bright gradient `--gradient-start/end`).

**Readable gradient** (`--gradient-btn-start: #4e7d2a` → `--gradient-btn-end: #1c7e70`) is shared by `.btn-grad`, `.btn-outline-grad` hover, and `.bg-grad-readable` for text-bearing CTA blocks, badges, active tabs and pagination. White text contrast at the stops is 4.89:1 / 4.92:1. Keep text fully opaque and avoid fading the whole surface on hover. `.gradient-text` uses these darker stops too (≥4.60:1 on gray-100).

Bright `.bg-grad` remains for decoration. Ministry card captions use an **opaque** `.bg-grad-readable` banner so photos cannot reduce white text contrast. Logo placeholder letters use `text-gray-900` on the bright primary circle (6.57:1).

`.all-text-white` colors the wrapper and headings/paragraphs, not every descendant: white buttons retain dark labels (`gray-800` on white = 11.51:1).

## Accessibility (WCAG 2.2 AA)

- Green text and hover states on light surfaces use `text-primary-text` / `--color-primary-text`; retain `text-primary` for bright decorative accents on dark surfaces. Avoid reducing text opacity on hover.
- Global `:focus-visible` outline (2px `--color-primary-text`, 2px offset) is defined in the base layer; its white 2px halo is unlayered so utility shadows cannot hide it. Form fields retain the outline and an opaque dark green focus border; never re-add `outline:none`/`ring-0` without a visible replacement.
- `prefers-reduced-motion: reduce` damps animations/transitions globally.
- Skip-link (`Перейти до вмісту`) targets `<main id="main-content">` in `app/(front)/layout.tsx`.
- Header nav: active item gets `aria-current="page"` (via `usePathname()`); the "Про нас" dropdown is a keyboard-operable disclosure (`aria-haspopup`/`aria-expanded`, opens on click+hover, closes on Escape/blur); mobile toggle has `aria-expanded`. Decorative `<i class="fa…">` icons are `aria-hidden="true"`.
- Section heroes (`PageHero` + news/events detail) render the background via `next/image` (`fill priority`), not CSS `background-image`.

## Typography

| Role        | Font              | Variable         |
| ----------- | ----------------- | ---------------- |
| Headings    | Poppins           | `--font-heading` |
| Body text   | Roboto            | `--font-base`    |
| Accent/Alt  | Playfair Display  | `--font-alt`     |

- Headings: Poppins, weight 500, line-height 1.2
- Body: Roboto, 14px (0.875rem), line-height 1.6
- Pre-titles: Playfair Display, italic, `text-2xl`

## Border Radius

| Context           | Token          | Value  |
| ----------------- | -------------- | ------ |
| Default           | `--radius`     | `3px`  |
| Small             | `--radius-sm`  | `2px`  |
| Medium            | `--radius-md`  | `3px`  |
| Large             | `--radius-lg`  | `4px`  |
| Cards / hero      | `rounded-2xl`  | `1rem` |
| Buttons (round)   | `rounded-full` | `50%`  |

## Component Patterns

### Buttons
- Primary: `.btn .btn-grad` (gradient animated on hover)
- Outline: `.btn .btn-outline-grad` (gradient border, white fill → gradient on hover)
- CTA: `.btn .btn-white` / `.btn .btn-outline-white` on dark backgrounds
- Link: `.btn-link` (underline animation on hover)

### Section Title Pattern
```html
<div class="title text-center">
  <span class="pre-title">Pre-title text</span>
  <h2>Main Title</h2>
  <p>Description paragraph</p>
</div>
```

### Frosted Glass Hero (PageHero component)
Used on: History, Ministry Detail pages
```
- Background image with `bg-black/55` overlay
- Centered card with `backdrop-filter: blur(16px)`
- Gradient background: `rgba(151,199,78,0.15)` → `rgba(42,185,165,0.15)`
- White border: `rgba(255,255,255,0.22)`
- Box shadow: `0 4px 24px rgba(0,0,0,0.3)`
```

## Layout Patterns

- **Select кількох наявних фото новини**: окрема повноширинна кнопка `Select — вибрати фото зі Studio`, поруч із кнопкою upload із пристрою. Обидві — Sanity UI ghost-buttons з hover/focus станами, pointer, мінімальною висотою 44px; при disabled — not-allowed. Діалог із чекбоксами, прев’ю без деформації, скороченими назвами й повним title, пошуком та «Показати ще». Позначення зберігаються між порціями/пошуком. Обрані cards підсвічені, hover має рамку; весь label-card клікабельний. На мобільному — 2 колонки, далі 3/4. Footer показує кількість і «Додати обрані». Вже додані позначено «Вже в галереї», їх не можна дублювати. Ліміт враховує наявні фото; при 10 обидві кнопки disabled. Escape/хрестик/Скасувати закривають діалог, фокус повертається до Select, якщо він доступний. Стандартний item-level Select залишається одиночним для заміни конкретного фото.

- **Select кількох наявних фото новини**: окрема повноширинна кнопка `Select — вибрати фото зі Studio`, поруч із кнопкою upload із пристрою. Обидві — Sanity UI ghost-buttons з hover/focus станами, pointer, мінімальною висотою 44px; при disabled — not-allowed. Діалог із чекбоксами, прев’ю без деформації, скороченими назвами й повним title, пошуком та «Показати ще». Позначення зберігаються між порціями/пошуком. Обрані cards підсвічені, hover має рамку; весь label-card клікабельний. На мобільному — 2 колонки, далі 3/4. Footer показує кількість і «Додати обрані». Вже додані позначено «Вже в галереї», їх не можна дублювати. Ліміт враховує наявні фото; при 10 обидві кнопки disabled. Escape/хрестик/Скасувати закривають діалог, фокус повертається до Select, якщо він доступний. Стандартний item-level Select залишається одиночним для заміни конкретного фото.

- **Доступність пакетного вибору Studio**: picker галереї новин активний за наявності native `onSelectFile` й upload-capable source. Не блокувати control через optional legacy `onUpload`, якого Sanity 4.22 не передає для image arrays. ReadOnly, 10 наявних фото або вимкнені uploads лишають control недоступним.
- **Container**: `.container-larexa` — responsive max-width container (up to 1200px)
- **Sections**: `py-12 md:py-16` default section padding (set in base styles)
- **Grid**: Flexbox-based with `-mx-4` / `px-4` columns pattern
- **Sidebar layout**: `w-full md:w-1/4` sidebar + `w-full md:w-3/4` main content
- **Cards**: `shadow-card` / `shadow-hover` with `transition-all duration-300`
- **Список новин**: `NewsCard` — `grid grid-cols-1 sm:grid-cols-2 gap-6`, картки `h-full`.
- **Фото новини** (`/news/[slug]`, `NewsPhotoGallery`): основне фото й до 10 додаткових утворюють одну групу лайтбокса. Основне фото тепер `w-full h-auto`, повний кадр. Додаткові — після тексту, перед back-link; h2 «Фотогалерея» лише за наявності фото. Мозаїка CSS columns: 1 на mobile, 2 від `sm`, 3 від `lg`; для 1/2 фото максимум 1/2 колонки. Порядок — вниз по колонці відповідно до Studio. `gap-4`, `mb-4`, `break-inside-avoid`, `rounded-xl`; тайли — клавіатурно доступні `PhotoViewer`-кнопки з cursor-zoom-in. Intrinsic dimensions, `w-full h-auto`, LQIP і lazy loading; `originalImageUrl()` дає повну роздільність + `q=100`, `unoptimized` вимикає стиснення Next. Alt із CMS або назва + номер фото. У Studio — labeled native multiple file picker «Завантажити кілька фото», лічильник вільних місць і `role=alert` для непідтримуваної/завеликої добірки, native upload progress на кожному елементі.
- **Список подій**: `EventCard` — мозаїка CSS columns (`columns-1 sm:columns-2 gap-6`), картки `break-inside-avoid mb-6` природної висоти. Порядок читання — вниз по колонці, потім наступна. Афіші повністю видимі: URL без фіксованої висоти, `ignoreImageParams()` зберігає весь оригінал навіть за наявності crop/hotspot у CMS; `Image` має розміри з asset metadata та `w-full h-auto`, без zoom на hover. Бейдж під афішею. На `/events/[slug]` основна афіша так само має природну висоту в `max-w-3xl`. Мініатюри sidebar та головний EventsSlider мають окреме компонування.
- **Картки подій на головній (`EventsSlider`)**: контейнер фото = `aspect-[3/2]`, що збігається з доставленим фото 3:2 (`urlFor 800×533`) → `object-cover` показує все зображення без обрізки (раніше була фіксована висота → сильний кроп).
- **Порядок секцій головної** (`app/(front)/page.tsx`): Hero → **Live-банер «Наживо»** (умовно, одразу під Hero — лише під час ефіру) → Найближчі події → Хто ми (тизер місії + CTA «Дізнатися більше → /about») → Вітання пастора (реальний старший пастор із `teamMember`, без почесних) → **Розклад богослужінь** → Що ви знайдете → Новини → Свідчення → FAQ → **Актуальне слово** → фінальна CTA. **«Актуальне слово»** (`FeaturedSermon`) — проповідь, обрана вручну в Studio (`homepage.featuredSermon`, weak-ref на `mediaItem`, фільтр `category=="проповідь"`); якщо не обрано — фолбек на найновішу (`LATEST_SERMON_QUERY`). Одне reference-поле в singleton → дві одночасно неможливі. Обкладинка відкриває `Lightbox`; null-guard ховає секцію, якщо проповідей нема. Секція стоїть **внизу** (раніше була зверху). Секцію «Про нашу церкву» (`AboutWithStats`) **прибрано** як дубль місії; повна місія/історія/статистика йдуть на /about. Розклад піднято рано — час/місце ключові для гостя. (`AboutWithStats` лишається у `components/` для повторного використання статистики на /about.)
- **Сторінка /media** (`app/(front)/media/`): СЕРВЕРНИЙ пошук/фільтр (масштаб на тисячі відео), але керований **клієнтськи без навігації** — таби/дропдаун проповідника/пошук (debounce 350мс) викликають Server Action `searchMedia({category,speaker,q}) → {cards,total}` у `useTransition`; оновлюється **лише грид** — під час завантаження грид притлумлюється (CSS `opacity`, `motion-reduce:transition-none`), потім результати міняються на місці й яскравішають (БЕЗ ремоунту/AnimatePresence → без мерехтіння й «стале»-кадру), решта сторінки не смикається. URL синхронізується **шалов** (`history.replaceState`) — лінк лишається шеровним; прямий вхід/SEO рендериться серверно з `searchParams`. **«Завантажити ще»** (`loadMoreMedia`) доакумульовує по `MEDIA_PER_PAGE=12`. Лічильник «Показано X з Y» (`aria-live`). Картки — однакові висоти; теги = некліковані чіпи; клік → `Lightbox`. Категорії (8): Всі, Трансляції, Проповіді, Пісні, Свідчення, Вірші, Програми, Різне. Прев'ю карток — YouTube `maxresdefault` @ `quality=90` (`next.config images.qualities=[75,90]`), onError-фолбек на `sddefault` (640px, `object-cover` зрізає 4:3-смуги).
- **Навігація — «Медіа» = випадаюче меню** (`components/ChurchHeader.tsx`): діти **Відео** (`/media`) і **Фото** (`/media/photos`); підхоплює наявні `DropdownMenu`/`MobileDropdown`. Активний пункт = зелений `text-primary`; **батьківський пункт теж підсвічується**, коли активний будь-який його дочірній маршрут (`isParentActive` — «Медіа» на /media[/photos], «Про нас» на /about,/history,/team). Футер (`ChurchFooter` quickLinks) теж лінкує обидва.
- **Сторінка /media/photos** (`app/(front)/media/photos/`): бенто-галерея, що **агрегує ВСІ фото з `ministry.gallery`** (єдине джерело — ті самі фото, що на сторінках служінь; новий `MINISTRY_GALLERIES_QUERY`). Сервер флетенить+шафлить (рандом, решафл per-ISR); клієнт `PhotoGallery` показує 12 і «Завантажити ще» (client slice, бо обсяг обмежений). Сітка — `grid-flow-row-dense` + фікс `auto-rows` + `object-cover` (без дисторшну, як `PhotoGalleryGrid`; кожен 6-й тайл великий `lg:col-span-2 lg:row-span-2`, причому **кожен другий великий притискається праворуч** через `idx%12===6 → lg:col-start-2` — щоб бенто не було одноманітним); LQIP blur-плейсхолдери. Клік → `ImageLightbox` (повний екран, Esc/бекдроп, ←/→ + стрілки, focus-trap, restore). **Індекс живе всередині лайтбокса** (не в сітці) → навігація не ре-рендерить галерею; видиме фото `key={index}`+`priority` (миттєвий blur), сусіди префетчаться off-screen → ◀▶ без лагу. Без видимих підписів — назва служіння лише в `alt`.
- **Сторінка служіння — новини** (`app/(front)/ministries/[slug]/`): розділ «Новини служіння» (`NewsSlider`) тепер показує **лише** новини, прив'язані до цього служіння через поле `news.ministries` (weak-references). Фільтр серверний — `MINISTRY_NEWS_QUERY` (`$slug in ministries[]->slug.current`) у тому ж `Promise.all`; null-guard `newsData.length > 0` ховає секцію, якщо прив'язаних новин нема (раніше тягнулась глобальна `NEWS_QUERY` — усі новини). Головна `NewsSlider` лишається на `NEWS_QUERY` (усі).
- **Сторінка служіння — відповідальні** (`app/(front)/ministries/[slug]/page.tsx`): `ministry.leaders[]` (масив weak-ref→`teamMember`). **1 особа** → горизонтальний card `bg-gray-50 rounded-xl p-6` з підписом «Відповідальний за служіння», круглим фото (`w-16/20`, hover-ring) та ім'ям, лінк на `/team/[slug]`. **2+** → блок `bg-gray-50 rounded-xl p-6` з підписом-`<p>` «Відповідальні за служіння» + сітка міні-карток (`grid sm:grid-cols-2 gap-4`): кругле фото `w-14` + ім'я, кожна лінк на `/team/[slug]`, hover-ring `ring-primary`, ім'я `group-hover:text-primary-text`. Null-guard `leaders ?? []` ховає блок, якщо порожньо. (Нативні `<a>` → keyboard-доступні, глобальний `:focus-visible`.)
- **Команда — відповідальність за служіння** (`teamMember.responsibility` — масив рядків): детальна `/team/[slug]` показує **ВСІ** як pills (`border border-primary text-primary rounded-full`, по одному на рядок) + усі в Person JSON-LD `jobTitle`; загальна `/team` (`TeamSection`) показує у підписі картки **лише перший** (`raw[0]`).
- **Фотогалерея служіння — лайтбокс** (`PhotoGalleryGrid`): компактна мозаїка до 7 тайлів із `PhotoViewer`; переглядач включає всі фото галереї та основне фото служіння. Thumb/full мають повну роздільність + `q=100`, `unoptimized`; layout-кадрування мозаїки збережено, у viewer повний кадр. `MINISTRY_BY_SLUG_QUERY` проєктує dimensions основного фото й галереї, LQIP, `_key`.
- **Спільний лайтбокс** (`PhotoViewer` → `ImageLightbox`): native `dialog.showModal()` на весь viewport, напівпрозорий темний фон, фото з `object-contain` до 92vw/88vh; кнопки 48px, закриття вгорі, стрілки по боках, лічильник унизу. Esc/бекдроп закриває, ←/→ гортає, крайні кнопки disabled; фокус утримує browser modal, після закриття повертається на тригер, scroll блокується. Використовується на news/event/ministry/team detail, у rich text (окрема група inline-фото тексту), history і груповому фото команди. На `/media/photos` існуюча мозаїка також використовує оновлений viewer та full-resolution `q=100` зображення. Hero-фони й картки-посилання залишаються навігаційними елементами.
- **Live-банер «Наживо»** (`components/sections/LiveBanner.tsx`, спільний — головна під Hero + /media): **світла секція** у стилі сайту (`bg-gray-100`, `py-8 lg:py-12`) з пульсуючою червоною крапкою + червоний підпис «Наживо», заголовок `text-gray-800`, вбудований YouTube-плеєр (`max-w-2xl`, `rounded-2xl shadow-card`) поточного ефіру. Рендериться лише коли `getLiveVideoId(channelId)` повертає id (детекція через YouTube Data API `search.list eventType=live`, кеш 15 хв — спільна fetch-URL для обох сторінок, у межах free-quota 10k/добу). Конфіг: `siteSettings.liveStream.channelId` (+ `label`, фолбек «Пряма трансляція») у Studio + env `YOUTUBE_API_KEY`. Поза ефіром / без конфігу — нічого не додає.
- **Заглушка фото служіння** (`components/ui/ImagePlaceholder.tsx`): головне фото служіння опційне (`ministry.image` без `required`). Де фото нема — замість `<Image>` рендериться `ImagePlaceholder` (брендовий `.bg-grad` блок + декоративна біла іконка-фото `aria-hidden`, `absolute inset-0`/`w-full h-full`), у тому ж aspect-боксі (картка `MinistryCard` 4:3 під банером назви; детальна 16:9). `MinistryGrid` передає `image={item.image ? urlFor(...) : null}`. Reuse у картці й на детальній.
- **Картка новин (NewsSlider) — одна назва служіння** замість усіх додаткових категорій (раніше всі `categories` ламали картку при великій кількості). Рядок дати: `time` `shrink-0`, контейнер `min-w-0`, після роздільника один компактний `<span class="truncate max-w-[160px]" title={ministry}>` (повна назва в `title`; обрізка не деформує картку/дату). Назва = `ministries[0]->title` (додано в `NEWS_QUERY` + `MINISTRY_NEWS_QUERY`); показується лише якщо є. Спільний компонент → діє і на головній, і на сторінці служіння.
- **Медіа-бібліотека Studio** (`sanity-plugin-media`, `media()` у `sanity.config.ts`): глобальний asset source — у будь-якому полі фото кнопка «Select» відкриває бібліотеку раніше завантажених (прев'юшки, прокрутка, пошук, сортування за датою/розміром/назвою) + окрема вкладка «Media».
- **Studio-інпути категорій новин** (`sanity/components/CategoryInput.tsx`): `mainCategory` → `CategoryInput` (single `@sanity/ui` Autocomplete, патерн `SpeakerInput`); `categories` → `MultiCategoryInput` (chip-мультивибір — обрані як чіпи `tone="primary"` з кнопкою-«×» `aria-label`, додавання через Autocomplete із синтетичною «➕ створити» опцією). Опції = `schemaType.options.list` ∪ розрізнені наявні значення (`useCategoryOptions`), із додаванням нового. Замінили `TagInput`-`<datalist>` (підказки, не дропдаун) лише в `news`; `TagInput` лишається в `event`/`mediaItem`/`aboutPage`. Dev-only warning `disableTransition` (internal @sanity/ui 3.2.0) — навмисно не чіпаємо.
- **Секції /about** (`app/(front)/about/page.tsx`): PageHero → Хто ми+місія (білий, градієнт-блок місії) → Наша історія (`bg-gray-100`, наратив + лінк /history) → У що ми віримо (білий, grid карток `border-t-4 border-t-primary`) → Наші цінності (**`bg-gray-100`** — stagger 3-колонки; картки `bg-white shadow-card`, акцентна — `bg-grad`; розподіл динамічний `i % 3`) → Чого очікувати (білий, icon-list `text-base`/заголовки `text-xl` + CTA /contact) → Керівництво (`bg-gray-100`, лінк /team) → Статистика (білий, `AboutWithStats` — картки цифр `rounded-2xl px-6 py-8`) → CTA-градієнт. Фони чергуються white/`bg-gray-100`. Увесь контент (вкл. числа статистики) — singleton `aboutPage` через `getAboutPage()`, fallback `lib/about-data.ts`.

## Icons

Inline SVGs where needed. **Font Awesome is self-hosted** via the `@fortawesome/fontawesome-free` npm package (CSS imported once in `app/layout.tsx`, pinned to 6.x) — no external cdnjs request. Use the same `fas`/`far`/`fab` class names; mark decorative icons `aria-hidden="true"`.
