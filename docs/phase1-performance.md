# Фаза 1 — фундамент швидкодії

Дата: 2026-10-27. Обсяг — [master-plan, Фаза 1](../context/master-plan.md#фаза-1--фундамент-швидкодії).

Реалізовано SVG-реєстр замість icon fonts, локальні Montserrat/Roboto/Playfair italic через next/font, серверні секції/header/media cards з клієнтськими острівцями, адаптивні CDN-прев’ю, оригінали у відкладених native dialogs, Europe/Kyiv/DST, карту-фасад і окремі root layouts сайту та Studio. Редизайн і static-first — наступні фази.

## Lighthouse mobile: медіани трьох прогонів

| Сторінка | Performance до → після | LCP, с до → після | Трафік, MB до → після |
| --- | --- | --- | --- |
| Головна | 61 → 77 | 6.80 → 5.07 | 1.76 → 0.90 |
| Новина | 66 → 74 | 5.02 → 5.13 | 6.34 → 1.08 |
| Служіння | 59 → 74 | 7.36 → 4.31 | 1.24 → 0.81 |
| Фото | 45 → 79 | 5.32 → 4.54 | 19.26 → 0.75 |
| Контакти | 60 → 85 | 10.48 → 4.31 | 2.23 → 0.65 |

| Сторінка | Accessibility після | Best Practices після | SEO після |
| --- | --- | --- | --- |
| Головна | 92 | 100 | 69 |
| Новина | 96 | 100 | 69 |
| Служіння | 100 | 100 | 69 |
| Фото | 100 | 100 | 69 |
| Контакти | 97 | 100 | 69 |

Загальну ціль Performance ≥95 ще не досягнуто на всіх сторінках; наступні фази зберігають свою актуальність. SEO обмежений чинним pre-launch noindex; індексація не відкривалась. Повне закриття доступності — Фаза 6.

## Метод і межі

- Незмінений еталон Фази 0 (`1dc482b`) зібрано в ізольованому worktree з його lockfile й оригінальними public assets. Технічно некоректну початкову серію, під час якої змінювались старі font assets, відкинуто повністю.
- Один і той самий `scripts/measure-seo-performance.mjs`, Lighthouse 13.5.0, Chrome 155, production localhost:3004, mobile simulated throttling, storage reset; по 3 прогони/сторінку. Source builds різні, профіль і маршрути перевірено як однакові. Raw JSON/HTML/trace — ignored cache `node_modules/.cache/seo-7/{phase1-before-clean,phase1-after-final}`. Проміжний замір до ізоляції CMS-іконок у server-only не входить у фінальну серію.
- `/media/photos` ще перемішує дані при ISR, тому байти відображають різні початкові набори фото. Стабільний порядок — Фаза 2. Лабораторні серії залежать від локального хоста/мережі й не вимірюють польовий INP.
- Browser QA: 14 маршрутів, окремо SSR деталей команди/події; 320/390/1280px, overflow, closed-menu inert, keyboard/Escape/focus restore, reduced-motion hydration, FAQ, фото-стрілки/межі, download URL, медіапошук/load-more/video, карта й Studio isolation. Несправних ресурсів/console/hydration errors немає; штатна 404 навмисного missing URL виключена з error assertion.
- Map/video: перевірено активацію та iframe URL з перехопленим provider content. Реальну контактну форму не надсилали, CMS не змінювали. Screenshots/QA output — ignored cache, не контент репо.
- Build (42/42), lint, повний TypeGen/typecheck, 4 штатні регресії, frozen offline install, UTF-8/Markdown/font manifest/diff checks — PASS. Старі VM audit scripts не використовувались замість browser QA; їх заміна — Фаза 7.
