# Фаза 2 — статичний рендеринг і кешування

Дата: 2026-10-28. Обсяг — [master-plan, Фаза 2](../context/master-plan.md#фаза-2--статичний-рендеринг-і-кешування-b6).

Публічні CMS-fetch переведено на published/force-cache з тегами типів і referenced-даних; додано підписаний webhook, path pagination/категорії, SSG новин і подій, статичний initial media batch та стабільний порядок фото. Налаштування Sanity/Vercel — [інструкція власнику](sanity-revalidation.md).

## Lighthouse mobile: медіани трьох прогонів

| Сторінка | Performance до → після | LCP, с до → після | Трафік, MB до → після |
| --- | --- | --- | --- |
| Головна | 75 → 81 | 4.64 → 4.68 | 0.88 → 0.88 |
| Новина | 84 → 88 | 4.06 → 3.84 | 0.91 → 0.91 |
| Служіння | 87 → 88 | 3.70 → 3.57 | 0.64 → 0.64 |
| Фото | 86 → 87 | 3.85 → 3.77 | 0.58 → 0.62 |
| Контакти | 89 → 86 | 3.52 → 3.52 | 0.94 → 0.94 |

| Сторінка | Accessibility після | Best Practices після | SEO після |
| --- | --- | --- | --- |
| Головна | 92 | 100 | 69 |
| Новина | 96 | 100 | 69 |
| Служіння | 100 | 100 | 69 |
| Фото | 100 | 100 | 69 |
| Контакти | 97 | 100 | 69 |

Загальна ціль Performance ≥95 ще не закрита. Локальні warmed-прогони обмежено показують виграш TTFB від статичного кешу; зміни балів не можна повністю приписати SSG. Шрифти, карта та інші доопрацювання після Фази 1 уже входять в обидві серії. Фото після зміни порядку показують інший початковий набір, тому їхні байти й LCP не є порівнянням однакових зображень. SEO лишається обмеженим pre-launch noindex.

В обох серіях Lighthouse попереджає, що CPU тестового хоста повільніший за очікуваний. На контактах медіанний LCP лишився 3.52 с, а TBT зріс із 127 до 223 мс; діапазон Performance після — 78–91. Причину цієї варіативності замір не встановлює, тому падіння медіани збережено у звіті без висновку про конкретну причину.

## Метод і перевірки

- Той самий `scripts/measure-seo-performance.mjs`, Lighthouse 13.5.0, Chrome з однаковим user agent, production localhost:3004, mobile simulated throttling/storage reset; по 3 прогони на 5 однакових маршрутах. Raw JSON/HTML/trace — ignored `node_modules/.cache/seo-7/{phase2-before,phase2-after}`. Лабораторні дані залежать від локального хоста/мережі й не є польовими CWV.
- Production build: 42 → 55 generation tasks; усі публічні маршрути ○/●, динамічний лише `/api/revalidate`. News/event detail, категорії та pagination мають static params і fallback для нових параметрів. Перший build зупинився через connect timeout Sanity; повторні завершились успішно. Незмінені Node/Browserslist warnings збережені.
- HTTP: published сторінки/кириличні категорії 200, noindex збережено; коректні одиночні Location для нормалізації pagination paths, 404 для невідомих/позамежних значень. У dataset зараз 5 новин і 3 події: валідної другої сторінки ще немає; CMS fixtures не створювалися.
- Webhook: локальний випадковий секрет, реальний HMAC; відсутній/невірний підпис відхиляється, malformed JSON/невідомі типи — 400, коректний запит — 200. Для списку й детальної новини підтверджено `HIT → STALE → HIT` без зміни CMS. Це не перевірка зовнішньої доставки Sanity → Vercel: потрібні налаштування власника й delivery log після звичайної публікації.
- Chrome: основні маршрути й деталі, category navigation/reset, media deep links/search/speaker/load-more/back-forward/запізнілі відповіді, стабільний photo order і viewer; 320/390/1280px без overflow та console/hydration errors. Screenshots/results — ignored `node_modules/.cache/phase2-browser/`.
- Lint, повний TypeGen/typecheck, 4 штатні regression scripts із додатковими перевірками path params, build 55/55, UTF-8/local Markdown targets/diff-check — PASS. Production налаштування, CMS-контент і реальна контактна форма не змінювались.
- Неактивні legacy VM SEO-скрипти описують старі query-based маршрути; вони не використовувались як гейт нових URL. Їх заміна — Фаза 7 за планом.
