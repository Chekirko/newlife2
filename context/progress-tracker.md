# Progress Tracker

## Поточний стан — 2026-10-27

Єдиний чинний план — [master-plan.md](master-plan.md); дизайн — [spec 08](specs/08-larexa-redesign.md); процес — [ai-workflow-rules.md](ai-workflow-rules.md). Гілка `codex/seo-1-audit`, початковий HEAD цієї фази `23ecb66`; робота ще не злита в `master`. Сайт до запуску, індексація закрита.

Рішення користувача: адаптивні Sanity-прев’ю + оригінал у лайтбоксі/завантаженні; Montserrat для заголовків; статичний hero; Larexa; static-first; робота фазами. Це затверджений напрям, а не вже реалізований стан.

## Фаза 0 — завершено локально

- Код і build-звіт підтвердили ключові проблеми плану: FA/q=100, дати без Europe/Kyiv, dynamic listings/detail news/events, 23 client directives і три відсутні image-paths. Hydration #418 лишається гіпотезою до browser QA Фази 1.
- Архівовано tracker, specs 00–07, SEO audit/3 JSON; перенесено skills-analysis; оновлено всі 6 контекстних файлів, AGENTS/README/env example. Поточна реалізація чітко відділена від рішень B1–B8.
- Прибрано 38 файлів (16 561 520 байтів) і 3 migration-команди; seed/check/основний measurement runner та patches збережено. Залежностей від видаленого у чинному коді/конфігурації немає.
- Lint, повний typecheck, 3 штатні регресії та production build PASS: 21 schema type / 34 GROQ / 42 із 42 generation tasks. Початкові sandbox EPERM усунено дозволеним повтором; лишилися наявні Node/Browserslist warnings.
- Локальні Markdown targets/anchors, UTF-8 і diff-check PASS; JSON evidence перенесені без зміни bytes. Application source, CMS, фактичний env, pnpm lock/patches та індексація без змін; новий Lighthouse не запускався для документаційної фази.
- Фаза 1 не розпочата; за останнім дорученням користувача після commit/push Фази 0 роботу в цій сесії завершити. Продовження — в наступній сесії.

## Далі

Фаза 1: SVG-іконки, локальні шрифти, серверні компоненти/клієнтські острівці, адаптивні фото, дати Europe/Kyiv, відкладені сторонні вбудовування, окремі root layouts сайту й Studio. Рекомендація — вся фаза; повний перелік і критерії у master-plan §C.

Контент, privacy, ротація раніше засвіченого Sanity-токена й конфігурація сервісів — [дії власника](master-plan.md#d-дії-власника-не-код). Запуск — лише за окремим явним «готово» згідно з [launch checklist](master-plan.md#f-launch-checklist-найостанніший-крок).

Історія до нового плану: [старий tracker](archive/2026-10-27/progress-tracker.md), [старий план](archive/2026-10-27/master-plan.md), [SEO-аудит](../docs/archive/seo-codex-2026-10/audit.md), [специфікації 00–07](specs/done).

Правило ведення: ≤10 рядків результатів на фазу, весь файл ≤8 КБ. Журнал комітів — у Git; без повторних погоджень, хеш-дампів і покрокових QA-журналів.
