# Spec 08 — Редизайн під Larexa (server-first)

Статус: **заплановано** (Фази 4–5 [master-plan](../master-plan.md#фаза-4--дизайн-система-larexa-b7-spec-08)). Створено 2026-10-27 за результатами порівняльного аудиту.

## Джерело дизайну

- Шаблон: `C:\Users\victo\Documents\CodeData\Larexa-Nextjs_v1.0\Larexa-Nextjs\TS\src` (далі **L**; копія `JS\src` ідентична, лише JS).
- Larexa — **мультипризначенний корпоративний** Bootstrap 5 шаблон, не церковний: немає карток подій із датою, списку проповідей, донат-прогресу. Події/проповіді/медіа адаптуються з blog, portfolio, video і timeline.
- Стилі: `L\assets\scss\style.scss` → `_variables.scss` (токени), `core\_general.scss` (title, section, timeline, error-page), `core\{_header,_footer,_blog,_portfolio,_utilities}.scss`, `custom\{_breadcrumb,_buttons,_tab,_type,_nav}.scss`, `components\{_accordion,_feature-box,_testimonials,_team,_overlay,_divider,_blockquote}.scss`.

## Дизайн-токени Larexa (обов'язкові)

| Токен | Значення |
|---|---|
| Primary | `#4cbd89`; текст/фокус — `--color-primary-text #216e4e` (наш AA-варіант) |
| Градієнт | `#97c74e → #2ab9a5`, 150deg (`.bg-grad`; для тексту — `.bg-grad-readable`) |
| Текст | body gray-600 (наш AA `#6b7177`), заголовки gray-800 `#343a40`, світлий фон `#f7f8f9` (`gray-100`) |
| Шрифти | текст Roboto 14px / 1.6; заголовки **Montserrat** (замість Poppins — без кирилиці) вага 500, line-height 1.2; акцент Playfair Display italic |
| h1–h6 | 35 / 28 / 24.5 / 21 / 17.5 / 14 px |
| Radius | **3px** скрізь (кнопки, поля, картки); великих радіусів немає |
| Тіні | default `0 0 3.125rem rgba(0,0,0,.1)`; hover `0 0 40px rgba(83,88,93,.1)`; large hover `0 0 80px rgba(83,88,93,.2)` |
| Кнопки | border 2px, padding `.5rem 1rem`, вага 500: `btn-grad`, `btn-outline-grad`, `btn-white`, `btn-outline-white`, `btn-dark`, `btn-link`, `btn-round` |
| Секції | `padding: 5rem 0 3.8rem`; від md і нижче `4rem 0 3rem`; хелпери `.section-pt`/`.section-pb` |
| Контейнер | `.container-larexa`, max 1140/1200px |
| Заголовок секції | `.title` (pb 30px) → `.pre-title` (Playfair italic 24px) + `h2` (36px, вага 600) + абзац; `.title-light` на темному. **Без** UPPERCASE-надписів і дільників |
| Утиліти | `bg-overlay-dark-N`, `pattern-overlay-1..4`, `all-text-white`, `text-grad`, `divider`, `list-group-number`, `grayscale` |

`app/globals.css` уже містить коректний порт більшості токенів, але компоненти їх майже не використовують (`feature-box`, `team-item`, `post-*`, `portfolio-card`, `list-group` — 0 використань; `.title` — 2; `.pre-title` — 3).

## Заборонені ШІ-патерни (видаляти при редизайні)

- Скляні картки: `backdrop-filter: blur(…)`, напівпрозорі rgba-градієнти з білою рамкою (`PageHero`, inline-копії в `news/[slug]`, `events/[slug]`, блок `.portfolio-card` у `globals.css` ~1720–1787).
- «UPPERCASE eyebrow + гігантський h2»: `text-primary-text font-semibold tracking-wide uppercase text-sm` + `text-3xl lg:text-4xl font-bold` (16 місць).
- Великі радіуси й «плаваючі» тіні: `rounded-xl/2xl/3xl`, `shadow-md hover:shadow-xl`, `ring-1 ring-gray-100`, `hover:-translate-y-1`.
- Іконка в кружечку (`w-12 h-12 rounded-full bg-primary/10` або `bg-grad`), «pill»-кнопки/таби/бейджі `rounded-full`.
- Кольори поза палітрою: `amber-*`, `yellow-400`, Tailwind `gray-50`.
- Автопрокрутка каруселей, `animate-ping`, декоративні анімації без `prefers-reduced-motion`.

## Спільні серверні компоненти (`components/larexa/`)

| Компонент | Контракт | Джерело в L |
|---|---|---|
| `SectionTitle` | `preTitle?`, `title`, `text?`, `light?`, `as?: 'h2'│'h3'` | `.title` у `core\_general.scss` |
| `PageTitle` | `title`, `subtitle?`, `image` (`next/image fill`, decorative), `breadcrumbs[]`; `nav aria-label="Хлібні крихти"`, `aria-current="page"`, роздільники-крапки `aria-hidden`, контраст ≥4,5:1; видає дані й для BreadcrumbList JSON-LD | `app\(page)\blog\default\right-sidebar\components\Hero.tsx`, `custom\_breadcrumb.scss` |
| `PostCard` | `href`, `image`, `tag?`, `date`, `title`, `excerpt?`, `meta?`; варіант `video` з кнопкою Play | `app\demos\classic-corporate\components\News.tsx`, `app\(page)\blog\blog-grid\…` |
| `FeatureBox` | `icon` (рядок CMS → `Icon`), `title`, `text`, `style: 2│5` | `app\demos\home\components\Services.tsx`, `components\_feature-box.scss` |
| `SidebarWidget` | `title`, `children` (`widget-title`) | `app\(page)\blog\default\right-sidebar\components\Blog.tsx` |
| `Pagination` | `basePath`, `page`, `total`; лише `Link`; prev/next з `aria-label`, `aria-current`; квадратні `.page-link`, активна `bg-grad` | там само |
| `Accordion` | `items[{q, a}]`, `name` (ексклюзивні `<details name>`), іконка-градієнт; без JS | `app\(page)\pages\faq\components\Careers.tsx`, `components\_accordion.scss` |
| `Timeline` | `items[{date, title, text, media?}]`; центральна лінія + точка; на mobile — один стовпчик | `app\(page)\pages\timeline\components\Timeline.tsx` |
| `TeamItem` | `href`, `photo`, `name`, `position`; overlay при hover/focus | `app\(page)\pages\team\components\Team.tsx`, `components\_team.scss` |
| `CounterStrip` | `items[{value, label}]`; статичні числа на `bg-grad` | `app\(page)\pages\about-classic\components\Counter.tsx` |
| `ActionBox` | `title`, `text?`, `cta`; смуга `bg-grad pattern-overlay` з radius 3px | `app\demos\home\components\ActionBox*.tsx` |
| `SnapRow` + `SnapArrows` | серверна доріжка `overflow-x-auto snap-x`; клієнтський острівець лише для стрілок (`scrollBy`), без автоплею | заміна tiny-slider |

## Заміни клієнтських бібліотек Larexa

| Larexa | У нас |
|---|---|
| react-bootstrap `Container/Row/Col` | Tailwind `grid`/`flex`, серверний рендер |
| `Accordion`, `Tabs` | `<details>/<summary>`; фільтри медіа — кнопки `aria-pressed` (єдиний інтерактивний острівець) |
| tiny-slider | `SnapRow` (CSS scroll-snap) + `SnapArrows` |
| GLightbox | наші `<dialog>`-лайтбокси (`PhotoViewer`/`ImageLightbox`, відео-`Lightbox` → `<dialog>`) |
| AOS, animate.css | прибрати; за потреби CSS keyframes у `prefers-reduced-motion: no-preference` |
| Jarallax | звичайне `next/image` (без `bg-fixed`) |
| react-countup | статичні числа |
| react-sticky-el | CSS `position: sticky` |
| themify `ti-*` іконки | `Icon` (Font Awesome SVG) |
| react-hook-form + yup | наш Server Action + Zod, форма через `useActionState` |

## Мапінг маршрутів

| Наш маршрут / секція | Вердикт аудиту | Larexa-джерело (під `L\app\`) | Адаптація |
|---|---|---|---|
| `PageHero` + inline hero `news/[slug]`, `events/[slug]` | ШІ-слоп | `(page)\blog\default\right-sidebar\components\Hero.tsx` | `PageTitle`; дві inline-копії видалити |
| Заголовки секцій (16 місць) | ШІ-слоп | `.title`/`.pre-title` | `SectionTitle` |
| `/` hero | частково (слайдер) | `demos\home\components\Hero.tsx` (типографіка) | **статичний**: одне фото + заголовок + розклад + CTA; Playfair pre-title |
| `/` EventsSlider, NewsSlider | ШІ-слоп | `demos\classic-corporate\components\News.tsx` | `PostCard` у `SnapRow`, без автоплею |
| `/` «Що ви знайдете» (`Ministries.tsx`) | ШІ-слоп | `demos\home\components\Services.tsx` | `FeatureBox` style 2, `grid md:grid-cols-3` |
| `/` FeaturedSermon | ШІ-слоп | `(page)\pages\about-classic\components\AboutUs.tsx` | текст + фото з `btn-grad` Play, `<dialog>` відео |
| `/` TestimonialsGrid | частково | `(page)\pages\about-classic\components\Testimonials.tsx` | клас `testimonials-border`; статична сітка; рейтинг з текстом |
| `/` FAQSplit | частково | `(page)\pages\faq\components\Careers.tsx` | `Accordion` + `SidebarWidget bg-light` «Маєте питання?» |
| `/` OurVision, PastorGreeting | частково | `about-classic\AboutUs.tsx`, `demos\corporate-startUp\components\AboutUs.tsx` | `SectionTitle`; стрілкові SaaS-лінки → `btn-link` |
| `/` HeroGradientImage (розклад), ActionBoxFullWidth | відповідає | — | лише визначити `pattern-overlay-2` |
| `/` LiveBanner | частково | — | radius 3px, без `animate-ping` |
| `/about` | ШІ-слоп | `(page)\pages\about-classic\*`, `(page)\pages\about-advance\components\WhyUs.tsx`, `demos\home\components\ActionBox3.tsx` | місія — split-панель WhyUs; віровчення — `FeatureBox`; «чого очікувати» — `list-group-number`; статистика — `CounterStrip`; фінал — `ActionBox` |
| `/history` | частково | `(page)\pages\timeline\components\Timeline.tsx` | `Timeline`; демо-Vimeo прибрати; контент → Sanity-singleton (окремий крок зі схемою) |
| `/team` | частково | `(page)\pages\team\components\Team.tsx` | `TeamItem`; групове фото — звичайне `next/image` |
| `/team/[slug]` | частково | `(page)\portfolio\single\components\Portfolio.tsx` | фото + таблиця деталей; `.tags` замість amber-pills |
| `/ministries` | відповідає | — | лише токени (radius, тіні) |
| `/ministries/[slug]` | частково | `(page)\blog\blog-single\single-classic\components\Blog.tsx` + `(page)\portfolio\single\…` | `SidebarWidget` замість `rounded-xl` боксів; лідери — `TeamItem` (малий); галерея — portfolio-сітка |
| `/news`, `/events` | частково | `(page)\blog\default\right-sidebar\components\Blog.tsx` | `post-item`, `post-meta-category bg-grad`, «Читати далі»; `SidebarWidget`; `Pagination` |
| `/news/[slug]` | ШІ-слоп (hero) | `(page)\blog\blog-single\single-classic\components\Blog.tsx` | `blockquote grad-line` у PortableText, divider, теги |
| `/events/[slug]` | ШІ-слоп (hero) | `(page)\pages\careers-single\…` | sidebar деталей: дата, час (Europe/Kyiv), місце, «Додати в календар» (E1.4) |
| `/media` | ШІ-слоп | `(page)\portfolio\column-3\components\Portfolio.tsx` | filter nav → кнопки `aria-pressed` у стилі `tab-grad`; картки — `PostCard` video |
| `/media/photos` | частково | `(page)\portfolio\column-4\…`, `demos\home\components\Results.tsx` | portfolio-сітка, radius 3px, hover-оверлей з іконкою full-screen |
| `/contact` | частково | `(page)\pages\contact\components\Contact.tsx`, `MoreInfo.tsx` | 3/3/6 сітка зберігається; поля radius 3px `border-gray-300`; `btn-dark w-full`; іконки без градієнтних плиток; карта — фасад |
| 404 / `error.tsx` | відповідає / частково | `(page)\pages\error-404\components\Error404.tsx` | `error.tsx` без іконки в кружечку |
| `/privacy` | заглушка | — | після реального тексту — проста текстова сторінка з `PageTitle` |
| Header / footer | відповідає | `components\Blog\TopNavbar.tsx`, `components\Blog\Footer.tsx` | top bar прокручується, sticky компактна навігація (E2.1) |

## Критерії приймання (кожна сторінка)

1. Лише токени й компоненти цієї специфікації; жодного патерну з «Заборонених».
2. Серверні компоненти; клієнтські лише острівці (меню, лайтбокс, стрілки `SnapRow`, фільтри медіа, форма).
3. Скриншоти до/після 1280/390/320 px без горизонтального overflow.
4. Lighthouse Accessibility 100 на сторінці; один H1; ієрархія заголовків без пропусків.
5. `ui-context.md` описує актуальну систему (оновлюється у Фазі 4).
