# UI Context

Дизайн-система — **Larexa**, [spec 08](specs/08-larexa-redesign.md). Фаза 4 реалізувала токени й серверні компоненти `components/larexa/`; сторінки переходять на них посторінково у Фазі 5 [master-plan](master-plan.md). Нові секції будувати лише з цих компонентів і токенів.

## Colors

Лише CSS tokens із `app/globals.css`.

| Роль | Token / значення |
| --- | --- |
| Primary decoration | `--color-primary` #4cbd89 |
| Primary text / focus | `--color-primary-text` #216e4e |
| Decorative gradient | `--gradient-start` #97c74e → `--gradient-end` #2ab9a5 |
| Readable gradient | `--gradient-btn-start` #4e7d2a → `--gradient-btn-end` #1c7e70 |
| Body / headings | gray-600 #6b7177 / gray-800 #343a40 |
| Section background | white / gray-100 #f7f8f9 |

`.bg-grad` — декор; `.bg-grad-readable`, `.btn-grad` — білий текст із AA-контрастом (також активна сторінка пагінації, відкритий пункт accordion, тег картки). Нормальний текст не послаблювати opacity (тому `.title-light` — чистий білий, без Larexa 90%). `.all-text-white` не має перекривати темний label білої кнопки. На світлому green text/hover/focus — `text-primary-text`. Tailwind `gray-50` не використовувати — світлий фон лише `gray-100`. Градієнтні іконки — SVG `<linearGradient>` у `FeatureBox` (text-clip `.icon-grad` для SVG не працює й видалений).

## Typography

| Роль | Затверджений шрифт | CSS variable |
| --- | --- | --- |
| Headings | **Montserrat**, кирилиця + latin, 500/600/700 | `--font-heading` |
| Body | Roboto, 14px / 1.6 | `--font-base` |
| Pre-title | Playfair Display italic, 24px | `--font-alt` |

Шрифти підключені через `next/font/local` у public root, із хешуванням і metric fallback; body/heading preload, accent на вимогу. Poppins і `app/fonts.css` видалено. Локальні assets та OFL зберігати, remote font CSS не додавати. Базові H1–H6: 35/28/24.5/21/17.5/14px, line-height 1.2; `.title h2` — 36px/600. Heading rank визначається структурою, а не бажаним розміром.

## Shape and Layout

- Radius Larexa — **3px** для карток, полів, hero й звичайних кнопок. Без великих радіусів, скляних панелей, декоративних кіл та плаваючих hover-карток.
- Контейнер `.container-larexa` 1140/1200px. Базовий `section` (і `.section-pt/.section-pb`): 4rem/3rem, від 768px — 5rem/3.8rem (Bootstrap 5 `down(md)`). Власні `py-*` секції перекривають базу.
- Section heading — `SectionTitle` (`.title`): `.pre-title` Playfair 24px (20px <576) + H2/H3 36px/600 (30px <576) + опис; без uppercase eyebrow і гігантського заголовка.
- Кнопки — `.btn-grad`, `.btn-outline-grad`, `.btn-white`, `.btn-outline-white`, `.btn-dark`, `.btn-link`, `.btn-round`; 2px border, `.5rem 1rem`, вага 500. Bootstrap-кольори (`btn-primary` тощо) видалені.
- Утиліти: `bg-overlay-dark-2…9` (кожен клас самодостатній), `pattern-overlay-2` (AVIF-хвилі `public/images/patterns/`, лише на градієнтних смугах), `all-text-white`, `gradient-text`, `divider`.
- Серверна розмітка; client islands лише для меню, фільтрів, play/lightbox і scroll arrows. Каруселі без автоплею; accordion через details/summary.

### Компоненти `components/larexa/`

Контракти й джерела — spec 08; тут — правила використання.

- **Рівень заголовка** структурний: `SectionTitle`/`PostCard`/`SidebarWidget` мають `as` (H2 на сторінці без секційного H2, H3 усередині секції). `FeatureBox`, `Timeline`, `TeamItem` — H3.
- **Фото в картках** декоративні (`alt=""`): картку називає заголовок-посилання; у `PostCard` посилання обкладинки поза Tab-порядком, «Читати далі» має sr-only назву. `PostCard`/`TeamItem` приймають `sizes` під свою сітку; без фото — `ImagePlaceholder`.
- `PageTitle` — H1 + фото `preload` під `bg-overlay-dark-7` + спільні `Breadcrumbs` (крапки-роздільники через CSS без тексту, JSON-LD з того ж масиву).
- `PostCard` — дата ISO → `formatDate` (Europe/Kyiv); `meta` для часу/спікера; `video` — обкладинка стає `VideoPlayButton`, `href` необов'язковий.
- `Pagination` — `basePath` сторінки 1 + `pagedHref` з `lib/listing-params`; prev/next лише коли існують, 40px <640, 44px вище.
- `Accordion` — `<details name>` (ексклюзивно, без JS), перший відкритий; клас `.accordion-icon-gradient`. Старі `.accordion-*` лишаються для FAQSplit до Фази 5.2.
- `SnapRow` — серверний `<ul>` 1/2/3 картки; `SnapArrows` — єдиний острівець: `scrollBy` на ширину доріжки (reduced-motion → без плавності), вимикається на краях, ховається без overflow (місце зберігається).
- `CounterStrip` — статичні числа у списку, не заголовки. `ActionBox` — власна `section` з контейнером.

## Logo and Header

Оригінальні SVG `public/images/logo-dark.svg` / `logo-white.svg`: зберігати мальований знак, хрест і напис «церква м. Борислав». Header — темний на білому, 56px; footer — білий, 224px з max-width. Обидва home links мають accessible name.

**Поточний стан:** серверний header, top bar 44px у звичайному потоці, CSS sticky nav (80px mobile / 120px desktop), без ручного відступу main. NavLink/Dropdown/MobileMenu — острівці, закриті меню hidden/inert, nav має label, активне посилання aria-current. Компактний nav (E2.1) не входив у Фазу 4 — вирішується на гейті Фази 5. Top bar поза landmark (axe `region`) — Фаза 6. Media dropdown — Відео `/media` і Фото `/media/photos`; «Про нас» групує about/history/team.

## Page Patterns and Content

- Головна зараз: Hero → умовний Live → події → місія/OurVision → пастор → розклад → «Що ви знайдете» → новини → свідчення → FAQ → «Актуальне слово» → CTA. Hero стане статичним у Фазі 5.1. Проповідь — CMS featured reference, fallback на найновішу; немає даних — секцію сховати.
- Спільний серверний `Breadcrumbs` формує видиму навігацію і JSON-LD з одного масиву; nav має label, поточний пункт aria-current, текст і посилання білі без opacity-зниження. Додаткові факти події (адреса, завершення, організатор, статус, умови участі) показуються лише коли заповнені.
- PageHero та inline news/event heroes замінюються `PageTitle` у Фазі 5.1; до того PageHero вже має Larexa-крапки в крихтах. Sidebar усередині `main` — `div`, не `aside` (axe `landmark-complementary-is-top-level`).
- News/events мають статичну path pagination (`/news/page/2`, `/events/page/2`); категорії — `/news/category/<назва>` з noindex та вкладеною пагінацією. Цільовий дизайн — PostCard + SidebarWidget + server Pagination. Видимий label «Читати далі» доповнювати sr-only назвою. Порядок DOM має відповідати mobile читанню.
- Team/ministry cards — heading H3 під H2 секції; фото в цілісному named link має alt="". Detail фото має власний опис; немає фото — ImagePlaceholder. Ministry detail: 1 leader — singular, 2+ — grid; невирішені refs не рендерити. Responsibility масив: на загальній картці перший, на detail всі.
- `/about` бере місію, історію, віровчення, цінності, очікування, статистику й CTA з singleton. Перехід на Larexa описано в spec 08; статистика лишається статичним текстом, не animated counters.
- Media: статичний initial batch, URL-фільтри відновлюються після hydration/popstate; search/speaker/category через Server Actions, без повного reload; pending dim, результати міняються без keyed remount. Load-more по 12, aria-live count. Кнопки фільтрів у цільовому UI — aria-pressed.
- `/media/photos` — агрегат ministry galleries, бенто, 12 + load-more; title служіння лише в alt. Порядок стабільний: порядок служінь, title/ID для однакових значень, потім CMS-масив фото.

## Photos and Viewers

**B1 реалізовано:** адаптивні Sanity CDN прев’ю + оригінал на вимогу у lightbox/завантаженні. Пропорції з asset metadata, LQIP і коректні sizes; без неіснуючих placeholder URL. Статичні фото й колишні CSS-фони — Next Image; групове фото команди — desktop-паралакс `bg-fixed` з `getImageProps` → `image-set` q90, mobile — Image q90.

Спільний `PhotoViewer` → відкладений native `ImageLightbox`: повний кадр object-contain, Esc/бекдроп/←→/межі групи, 48px controls, лічильник і «Завантажити оригінал», scroll lock/focus restore. Індекс усередині viewer; ширина фото враховує dialog padding на 320px. Використовується на detail, rich-text, history/team photo і media/ministry galleries. Відео відкривається через VideoPlayButton у відкладеному native dialog. Google Maps — iframe одразу (lazy, ч/б → колір при наведенні) і посилання «Відкрити в Google Maps»; фасад відхилено користувачем. Live iframe lazy.

## Contact and Studio

Контактна форма має видимі labels, required/maxLength/autocomplete, зв’язані field errors, фокус першого проблемного поля, pending і збереження введення при помилці. Persistent success `role=status`, error `role=alert`; жодного удаваного успіху або автоматичного приховування статусу. Фаза 5.6 — useActionState і робота без JS.

Studio: `GalleryInput` має multiple upload і «Select — вибрати фото зі Studio»; asset picker із пошуком/порціями/мультивибором, ліміт gallery 10. Single-image source лишається одиночним. Новини, події, служіння й служителі мають згорнутий SEO-об’єкт із необов’язковими overrides і noIndex; назва церкви додається до title автоматично. Media plugin — спільна бібліотека. CategoryInput/MultiCategoryInput і SpeakerInput — Autocomplete із наявними значеннями та вільним вводом; TagInput для решти tag-полів.

## Accessibility and Acceptance

Глобальний видимий focus; skip-link до main; один H1 і логічні H2–H4; контраст ≥4.5:1; decorative icons aria-hidden; native controls із назвами. Прихований вміст не потрапляє в Tab, modal повертає фокус. Reduced-motion через CSS; без непотрібних анімацій.

Для змін UI: 1280/390/320px, відсутність horizontal overflow, keyboard open/close/Tab/focus restore, axe та Lighthouse відповідно до фази. Повний a11y closure — Фаза 6; старі вузькі QA не є загальним WCAG PASS. Історія — [архів](../docs/archive/seo-codex-2026-10/audit.md).
