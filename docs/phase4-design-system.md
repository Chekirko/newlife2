# Фаза 4 — Дизайн-система Larexa

Дата: 2026-10-28. Гілка `feat/phase-4-larexa-design-system`. Обсяг — [master-plan, Фаза 4](../context/master-plan.md#фаза-4--дизайн-система-larexa-b7-spec-08), правила — [ui-context](../context/ui-context.md).

## Реалізація

- `app/globals.css` 1782 → 1020 рядків. Видалено блоки без споживачів і поза spec 08: bootstrap-кнопки, pricing, process, navbar, preloader/back-top/triangle, кольорові social-варіанти, team-grid/bordered, testi-full/big, feature-box стилі 1/3/4, `.post` style 1–3, portfolio style-2/items-*, скляний `.portfolio-card`, неробочий `.icon-grad`, keyframes без використання.
- Токени Larexa: базовий `section` і `.section-pt/pb` 4rem/3rem → 5rem/3.8rem від 768px; `.title` 36px/600 (30px <576), pre-title 24/20px; `.title-light` без opacity. Нові `.breadcrumb` (CSS-крапки), `.timeline-*`, `.accordion-icon-gradient` для `<details>`, `.post-item`, `.pagination`, `.widget`, `pattern-overlay-2` (AVIF 24 КБ замість PNG 103 КБ). `bg-overlay-dark-3…9` виправлено — раніше працював лише `-2`.
- `components/larexa/`: `SectionTitle`, `PageTitle`, `PostCard`, `FeatureBox`, `SidebarWidget`, `Pagination`, `Accordion`, `Timeline`, `TeamItem`, `CounterStrip`, `ActionBox`, `SnapRow` — серверні; `SnapArrows` — єдиний острівець. Уточнення контрактів записано в spec 08.
- Спільне: `Breadcrumbs` — Larexa-розмітка без `<li aria-hidden>`-роздільників; `pagedHref` у `lib/listing-params`; іконки `fa-plus/fa-minus`; `gray-50 → gray-100` у 13 файлах.

## Що змінилось на сторінках

Компоненти зібрані лише на демо-сторінці `/larexa-preview` (noindex, без посилань у навігації; видаляється перед запуском — [launch checklist](../context/master-plan.md#f-launch-checklist-найостанніший-крок)). На реальні сторінки вони переходять у Фазі 5. Видимі зміни — лише від глобальних токенів: крихти `PageHero` з крапками замість «/»; смуга розкладу на головній отримала хвилі `pattern-overlay-2` (клас раніше не був визначений); секції без власних `py-*` (банери `PageHero`/фото команди, по одній на `/events` і `/contact`) отримали Larexa-відступи; ледь помітні фони `gray-50` → `gray-100`.

## Перевірки

- Lint, `tsc`, 5 regression suites, build 57/57 (усі public routes ○/●) — PASS.
- Демо-сторінка з усіма компонентами: 1280/390/320px без overflow; одна H1 і H2→H3; `SnapArrows` — прокрутка, вимкнення на краях; акордеон ексклюзивний; focus-оверлей `TeamItem`; пагінація в один рядок на 320px. axe 4.11 (WCAG 2.2 AA + best-practice): у компонентах 0 порушень; знайдені `region` (top bar шапки — Фаза 6) і `aside` у розмітці самої прев'ю.
- 9 публічних маршрутів у dev: без overflow і console errors.

## Lighthouse mobile

| Сторінка | Performance Ф3 → Ф4 | LCP, с | TBT, мс | Трафік, MB |
| --- | --- | --- | --- | --- |
| Головна | 78 → 71 | 4.54 → 4.47 | 282 → 523 | 0.869 → 0.892 |
| Новина | 84 → 85 | 3.76 → 3.83 | 255 → 190 | 0.898 → 0.896 |
| Служіння | 88 → 86 | 3.70 → 3.61 | 154 → 225 | 0.628 → 0.626 |
| Фото | 86 → 86 | 3.67 → 3.68 | 224 → 239 | 0.607 → 0.605 |
| Контакти | 90 → 89 | 3.45 → 3.50 | 116 → 129 | 0.929 → 0.928 |

Accessibility/Best Practices/SEO без змін (92–100 / 100 / 69 pre-launch). Серія Фази 4 знята на повільнішому хості: `benchmarkIndex` головної 957–1522 проти 1286–2107 у Фазі 3. TBT головної корелює з CPU в обох серіях (Ф3 при 1286 — 644 мс, Ф4 при 957 — 672 мс), `paintCompositeRender` стабільний, тож регресії коду не видно. Реальна ціна — +23 КБ AVIF-візерунка на головній. Перша серія `phase4-after` (індекс 807–1012) відкинута. Метод і raw — як у Фазі 3: `scripts/measure-seo-performance.mjs`, `node_modules/.cache/seo-7/phase4-after-rerun`.
