# UI Context

Дизайн-система — **Larexa**, [spec 08](specs/08-larexa-redesign.md). Це затверджена ціль; міграція компонентів — Фази 4–5 [master-plan](master-plan.md). Фаза 0 змінює документацію, не вигляд застосунку.

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

`.bg-grad` — декор; `.bg-grad-readable`, `.btn-grad` — білий текст із AA-контрастом. Нормальний текст не послаблювати opacity. `.all-text-white` не має перекривати темний label білої кнопки. На світлому green text/hover/focus — `text-primary-text`.

## Typography

| Роль | Затверджений шрифт | CSS variable |
| --- | --- | --- |
| Headings | **Montserrat**, кирилиця + latin, 500/600/700 | `--font-heading` |
| Body | Roboto, 14px / 1.6 | `--font-base` |
| Pre-title | Playfair Display italic, 24px | `--font-alt` |

У Фазі 1 шрифти переходять на `next/font/local`; поточний код ще має Poppins і `app/fonts.css`. Локальні assets та OFL зберігати, remote font CSS не додавати. Базові H1–H6: 35/28/24.5/21/17.5/14px, line-height 1.2; `.title h2` — 36px/600. Heading rank визначається структурою, а не бажаним розміром.

## Shape and Layout

- Radius Larexa — **3px** для карток, полів, hero й звичайних кнопок. Без великих радіусів, скляних панелей, декоративних кіл та плаваючих hover-карток.
- Контейнер `.container-larexa` 1140/1200px; секції 5rem 0 3.8rem, від md 4rem 0 3rem.
- Section heading — `.title` → `.pre-title` + H2 + опис; без uppercase eyebrow і гігантського заголовка.
- Кнопки — `.btn-grad`, `.btn-outline-grad`, `.btn-white`, `.btn-outline-white`, `.btn-dark`, `.btn-link`; 2px border, `.5rem 1rem`, вага 500.
- Компоненти цільової системи: `SectionTitle`, `PageTitle`, `PostCard`, `FeatureBox`, `SidebarWidget`, `Pagination`, `Accordion`, `Timeline`, `TeamItem`, `CounterStrip`, `ActionBox`, `SnapRow` — контракти та джерела в spec 08.
- Серверна розмітка; client islands лише для меню, фільтрів, play/lightbox і scroll arrows. Каруселі без автоплею; accordion через details/summary.

## Logo and Header

Оригінальні SVG `public/images/logo-dark.svg` / `logo-white.svg`: зберігати мальований знак, хрест і напис «церква м. Борислав». Header — темний на білому, 56px; footer — білий, 224px з max-width. Обидва home links мають accessible name.

**Поточний стан:** fixed header і відступ main 124/164px, клієнтський header із dropdown/mobile меню. **Ціль Фаз 1/4:** server shell, компактна sticky nav, top bar прокручується, закрите меню inert. Media dropdown — Відео `/media` і Фото `/media/photos`; «Про нас» групує about/history/team.

## Page Patterns and Content

- Головна зараз: Hero → умовний Live → події → місія/OurVision → пастор → розклад → «Що ви знайдете» → новини → свідчення → FAQ → «Актуальне слово» → CTA. Hero стане статичним у Фазі 5.1. Проповідь — CMS featured reference, fallback на найновішу; немає даних — секцію сховати.
- PageHero та inline news/event heroes замінюються `PageTitle` у Фазах 4–5. Background через Next Image, breadcrumbs із label/current/контрастом, без скляної картки.
- News/events — PostCard + SidebarWidget + server Pagination. Видимий label «Читати далі» доповнювати sr-only назвою. Порядок DOM має відповідати mobile читанню.
- Team/ministry cards — heading H3 під H2 секції; фото в цілісному named link має alt="". Detail фото має власний опис; немає фото — ImagePlaceholder. Ministry detail: 1 leader — singular, 2+ — grid; невирішені refs не рендерити. Responsibility масив: на загальній картці перший, на detail всі.
- `/about` бере місію, історію, віровчення, цінності, очікування, статистику й CTA з singleton. Перехід на Larexa описано в spec 08; статистика лишається статичним текстом, не animated counters.
- Media: search/speaker/category через Server Actions, без повного reload; pending dim, результати міняються без keyed remount. Load-more по 12, aria-live count. Кнопки фільтрів у цільовому UI — aria-pressed.
- `/media/photos` — агрегат ministry galleries, бенто, 12 + load-more; title служіння лише в alt. Поточний shuffle per-ISR підлягає впорядкуванню за планом.

## Photos and Viewers

**B1:** адаптивні Sanity CDN прев’ю + оригінал на вимогу у lightbox/завантаженні. Стару вимогу «q=100 всюди» скасовано; її код змінюється у Фазі 1. Пропорції з asset metadata, LQIP і коректні sizes; без неіснуючих placeholder URL.

Спільний `PhotoViewer` → native `ImageLightbox`: повний кадр object-contain, Esc/бекдроп/←→/межі групи, 48px controls, лічильник, scroll lock/focus restore. Індекс усередині viewer; ширина фото враховує dialog padding на 320px. Використовується на detail, rich-text, history/team photo і media/ministry galleries. Для відео native dialog заплановано у Фазі 1.

## Contact and Studio

Контактна форма має видимі labels, required/maxLength/autocomplete, зв’язані field errors, фокус першого проблемного поля, pending і збереження введення при помилці. Persistent success `role=status`, error `role=alert`; жодного удаваного успіху або автоматичного приховування статусу. Фаза 5.6 — useActionState і робота без JS.

Studio: `GalleryInput` має multiple upload і «Select — вибрати фото зі Studio»; asset picker із пошуком/порціями/мультивибором, ліміт gallery 10. Single-image source лишається одиночним. Media plugin — спільна бібліотека. CategoryInput/MultiCategoryInput і SpeakerInput — Autocomplete із наявними значеннями та вільним вводом; TagInput для решти tag-полів.

## Accessibility and Acceptance

Глобальний видимий focus; skip-link до main; один H1 і логічні H2–H4; контраст ≥4.5:1; decorative icons aria-hidden; native controls із назвами. Прихований вміст не потрапляє в Tab, modal повертає фокус. Reduced-motion через CSS; без непотрібних анімацій.

Для змін UI: 1280/390/320px, відсутність horizontal overflow, keyboard open/close/Tab/focus restore, axe та Lighthouse відповідно до фази. Повний a11y closure — Фаза 6; старі вузькі QA не є загальним WCAG PASS. Історія — [архів](../docs/archive/seo-codex-2026-10/audit.md).
