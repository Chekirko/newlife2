# AI Workflow Rules

## Approach

Spec-driven робота за [master-plan](master-plan.md); дизайн — [spec 08](specs/08-larexa-redesign.md), стан — [progress-tracker](progress-tracker.md). Завершені specs у `specs/done/` та архіви є історією, не паралельним планом.

## Working Agreement (project-wide, agreed 2026-06-19)

Темп оновлено користувачем 2026-10-27; канон процесу — цей файл.

1. **Karpathy завжди:** завантажити skill, назвати припущення, просте рішення, зміни в межах завдання, перевіряльні цілі.
2. **Гейт перед фазою:** показати її кроки й отримати вибір користувача. Пряме доручення почати впровадження за чинним планом дозволяє почати його явно визначену наступну фазу; не перепитувати той самий дозвіл. Перехід до наступної фази — новий гейт.
3. **Commit/push-гейт після фази:** лише за згодою користувача, push як `Chekirko`. Без окремих журналів погоджень у tracker; результат публікації видно в Git.
4. **Індексація — остання дія:** лише після явного «готово» та [launch checklist §F](master-plan.md#f-launch-checklist-найостанніший-крок). Заміна indexing-механізму у Фазі 3 не є дозволом запуску.
5. **Контекст у синхроні:** після завершення фази оновити tracker і доменні файли за фактичними змінами. Відрізняти поточний код від затвердженої майбутньої архітектури.
6. **Велика ініціатива спочатку в master-plan/spec:** не вигадувати product behavior і не розширювати scope приховано.
7. **Темп — фази з кількох кроків:** одна зіставна серія Lighthouse до/після runtime-змін, один підсумковий гейт і commit на фазу; ≤10 рядків результату в tracker. Без хеш-дампів і покрокових evidence-журналів.

## Scoping Rules

Усі кроки обраної фази виконувати послідовно в її межах. Розділяти лише незалежні або неоднозначні зміни; не перетворювати кожну дрібну правку на окрему сесію. Нові залежності додавати тільки там, де їх потребує поточна фаза.

Питання, на які відповідає код/контекст, вирішувати перевіркою. Якщо вимога справді відсутня й має кілька суттєвих варіантів — зафіксувати відкритий пункт і уточнити, продовжуючи незалежну роботу. CMS schema не вгадувати: читати `sanity/schemaTypes/`.

## Protected Files

- `sanity/lib/sanity.types.ts`, `schema.json` — generated, не редагувати вручну; після schema/GROQ запустити `pnpm run typegen`.
- `app/studio/`, `sanity.config.ts` — лише з явним дозволом на відповідну зміну.
- `app/globals.css` — зміни дизайну лише за затвердженим scope. Master-plan вже дозволяє потрібні зміни захищених файлів для Фаз 1 і 4, без повторного погодження.

## Keeping Docs in Sync

| Зміна | Файл |
| --- | --- |
| Архітектура, межі, дані/схеми | `architecture.md` |
| Конвенції коду | `code-standards.md` |
| Scope/сторінки | `project-overview.md` |
| Дизайн/UI | `ui-context.md` |
| Завершення фази, наступний крок | `progress-tracker.md` |

Специфікації й архіви переносити зі збереженням історії Git та локальних посилань. Активний tracker ≤8 КБ; старі результати не дублювати в кожному context-файлі.

## Definition of Done фази

1. Усі обрані кроки працюють end-to-end, інваріанти збережені.
2. `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, **`pnpm run build`** проходять. Windows довгі команди через `cmd /c`.
3. Для runtime/UI змін — production browser smoke, без console errors; keyboard/mobile/desktop за релевантним ризиком. VM/SSR checks не замінюють browser hydration QA.
4. Для runtime performance — одна серія до/після, 3 прогони/медіани за master-plan. Для Фази 0 без runtime-змін достатньо source/resource/link перевірок та quality gates; новий Lighthouse бал не приписувати прибиранню.
5. Context оновлено, без секретів/QA fixtures у CMS; diff у межах фази, відомі обмеження записані стисло.
6. Показати конкретний результат і запитати про commit/push. Перехід до іншої фази погоджується за пунктом 2 угоди.

## Focused Verification Rules

- Sanity references завжди weak + null-guard; GROQ через defineQuery. Inputs перевіряти з фактичними props installed Sanity: `onSelectFile`, не вигаданий `onUpload`; existing assets вставляти native `onInsert`.
- Gallery: empty/1/2/10 фото, mixed ratios, max 10, readOnly/дублікати; viewer keyboard/межі/Esc/бекдроп/focus restore та вузький viewport. CMS writes/міграції — окремий явно дозволений scope.
- Contact: fail closed без конфігурації, mocks не доводять inbox delivery. Реальне тестове надсилання — окреме доручення.
- SEO: нова сторінка узгоджує metadata/canonical/sitemap/JSON-LD; pre-launch обмеження лишаються до запуску. B2 реалізовано у Фазі 3: єдиний indexing-перемикач і документний seo.noIndex, без code approval registry.
- Dependency patch: `patches/` + workspace metadata + lockfile, frozen install; heartbeat regression зберігає error events/retry. Після patch перезапустити dev server.

## Encoding Safety

UTF-8; кириличний текст не записувати через PowerShell pipes, Out-File або redirects. Після перенесень/редагування перевірити коректність тексту. Секрети лишаються в ignored env/провайдерів, не в документах чи tool output.
