# Progress Tracker

## Поточний стан — 2026-10-27

Єдиний чинний план — [master-plan.md](master-plan.md); дизайн — [spec 08](specs/08-larexa-redesign.md); процес — [ai-workflow-rules.md](ai-workflow-rules.md). Гілка `codex/seo-1-audit`; робота ще не злита в `master`. Сайт до запуску, індексація закрита.

Рішення користувача: адаптивні Sanity-прев’ю + оригінал у лайтбоксі/завантаженні; Montserrat для заголовків; статичний hero; Larexa; static-first; робота фазами. B1/B3/B4 реалізовано у Фазі 1; static-first і редизайн ще попереду.

## Фаза 0 — завершено

- Код і build-звіт підтвердили ключові проблеми плану: FA/q=100, дати без Europe/Kyiv, dynamic listings/detail news/events, 23 client directives і три відсутні image-paths. Hydration #418 лишається гіпотезою до browser QA Фази 1.
- Архівовано tracker, specs 00–07, SEO audit/3 JSON; перенесено skills-analysis; оновлено всі 6 контекстних файлів, AGENTS/README/env example. Поточна реалізація чітко відділена від рішень B1–B8.
- Прибрано 38 файлів (16 561 520 байтів) і 3 migration-команди; seed/check/основний measurement runner та patches збережено. Залежностей від видаленого у чинному коді/конфігурації немає.
- Lint, повний typecheck, 3 штатні регресії та production build PASS: 21 schema type / 34 GROQ / 42 із 42 generation tasks. Початкові sandbox EPERM усунено дозволеним повтором; лишилися наявні Node/Browserslist warnings.
- Локальні Markdown targets/anchors, UTF-8 і diff-check PASS; JSON evidence перенесені без зміни bytes. Application source, CMS, фактичний env, pnpm lock/patches та індексація без змін; новий Lighthouse не запускався для документаційної фази.

## Фаза 1 — завершено

- Серверний Icon/CMS-реєстр і малий клієнтський ControlIcon замінили icon fonts; локальні Montserrat/Roboto/Playfair italic через next/font/local, Latin/Cyrillic/OFL, без Poppins і ручного font CSS/preload.
- Статичні секції/FAQ/details/pagination/ministry grid і header — серверні; MobileMenu/NavDropdown/NavLink — острівці, CSS sticky й hidden/inert. Hero reduced-motion hydration-safe, невідвідані фото прихованих слайдів не монтуються; статичний hero лишається для Фази 5.
- SiteImage/CDN loader, адаптивні прев’ю/sizes/LQIP, оригінал лише у відкладеному native viewer/завантаженні; прибрано DeferredGalleryImage, биті placeholder paths, CSS-фото й дубль action1.
- Дати/межа дня Europe/Kyiv з DST; серверні media cards + play-острівець, native video dialog, hqdefault, карта-фасад, lazy Live, без демо-Vimeo; окремі public/Studio root layouts.
- Build 42/42, lint, повний TypeGen/typecheck, 4 регресії, frozen offline install — PASS. Browser QA: 14 маршрутів, SSR деталей team/event, 320/390/1280px, меню/FAQ/діалоги/фокус/фільтри/карта/Studio, без console/hydration errors; CMS і жива форма не змінювались.
- Lighthouse mobile, 3 прогони/медіани: Performance головна 61→77, новина 66→74, служіння 59→74, фото 45→79, контакти 60→85. Метод, LCP/байти й обмеження — [звіт](../docs/phase1-performance.md); загальна ціль ≥95 ще попереду. Архітектуру/UI/стандарти/scope оновлено; індексація закрита.

## Далі

Фаза 2: static-first, tagged fetch/webhook, path pagination/static params, стабільний порядок фото. Повний перелік і критерії — master-plan §C; Фаза 2 ще не розпочата.

Контент, privacy, ротація раніше засвіченого Sanity-токена й конфігурація сервісів — [дії власника](master-plan.md#d-дії-власника-не-код). Запуск — лише за окремим явним «готово» згідно з [launch checklist](master-plan.md#f-launch-checklist-найостанніший-крок).

Історія до нового плану: [старий tracker](archive/2026-10-27/progress-tracker.md), [старий план](archive/2026-10-27/master-plan.md), [SEO-аудит](../docs/archive/seo-codex-2026-10/audit.md), [специфікації 00–07](specs/done).

Правило ведення: ≤10 рядків результатів на фазу, весь файл ≤8 КБ. Журнал комітів — у Git; без повторних погоджень, хеш-дампів і покрокових QA-журналів.
