# SEO до завершення реального контенту

**Публікація SEO-6.6 погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push 1 файла застосунку та 6 документів у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; далі SEO-6.7. Merge/Production settings без змін, live deployment окремо не засвідчений.

**SEO-6.6 локально завершено (2026-10-26):** [реалізація й QA](../../docs/seo/audit.md#seo-66-заголовки-футера--2026-10-26). У ChurchFooter три незалежні групи H4 → H2 зі збереженим `footer-title`; зміна трьох рядків одного компонента. 6 SSR fixtures, 16 GET, exact typography/Tab/Shift+Tab/Enter на 1280/390/320px, build/typecheck/lint/регресії — PASS. Наступний юніт — SEO-6.7: ministry detail sidebar H5/CTA H6/leader H4 (single/multiple), потім окремий свіжий heading crawl. F11 частковий; D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено. Commit/push SEO-6.6 — за окремою згодою workflow §3. Нижчі записи про «наступний SEO-6.6» — історичний стан.

**Публікація SEO-6.5 погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push 2 файлів застосунку та 6 документів у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; далі SEO-6.6. Merge/Production settings без змін, live deployment окремо не засвідчений.

Дата: 2026-10-26. Статус: SEO-1–SEO-5 і SEO-6.1/6.2/6.3/6.4/6.5 завершено локальними юнітами; наступна сесія — SEO-6.6 (footer headings, залишок F11). Весь SEO-6/D8 ще не закрито; F01/platform protection залишається відкритим.

**SEO-6.5 локально завершено:** [результат і докази](../../docs/seo/audit.md#seo-65-підписи-відгуків-і-контактний-заголовок-faq--2026-10-26). TestimonialsGrid names H6 → p як підписи, зі збереженими typography-токенами; FAQSplit contact H4 → H3 (`text-h4`). 2 рядки у 2 компонентах, 6 SSR fixtures із порівнянням до HEAD, 6 production GET, точний збіг computed styles/розмірів на 1280/390/320px, keyboard/CTA і build/lint/typecheck/регресії PASS. Старт чистий `6c9ce1a`, SEO-6.4 уже в HEAD. Commit/push SEO-6.5 потребує окремої згоди за workflow §3; noindex/Disallow/порожній approval збережено. Далі SEO-6.6 — footer, потім ministry detail headings окремим юнітом; після них свіжий heading crawl. FAQ disclosure semantics/nav landmark та breadcrumbs contrast — D8. Нижчі згадки «далі SEO-6.5» — історичний стан.

**Публікація SEO-6.4 погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

**SEO-6.4 локально завершено:** [результат і докази](../../docs/seo/audit.md#seo-64-надзаголовки-ourvision-і-pastorgreeting--2026-10-26). OurVision/PastorGreeting pre-titles H6 → абзаци з явним `font-heading`; H2 секцій/H3 місії та решта markup збережені. 2 файли застосунку; 6 SSR fixtures зі звіркою до HEAD, 6 GET, browser 1280/390/320px з точним порівнянням typography, keyboard/Enter та build/lint/typecheck/регресії PASS. Noindex/Disallow/порожній approval збережено; CMS/settings без змін. Старт чистий `8fc6bea`, SEO-6.3 уже опубліковано. Commit/push SEO-6.4 потребує окремої згоди за workflow §3. Нижчі згадки «далі SEO-6.4» — попередній стан.

**Публікація SEO-6.3 погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

**SEO-6.3 локально завершено:** [результат і докази](../../docs/seo/audit.md#seo-63-картки-служителів-і-служінь--2026-10-26). Team/honorary/ministry card headings → H3 під H2, фото всередині цих посилань не дублюють видимі назви. 3 файли застосунку, класи/href збережені; 11 SSR fixtures, 32 GET (26 distinct card targets), browser 1280/390/320px, build/lint/tsc/наявні та SEO-регресії PASS. Noindex/Disallow/порожній approval збережено. Старт чистий `9c1816c` із SEO-6.2; commit/push SEO-6.3 ще не виконано, потрібна окрема згода за workflow §3. Нижчі згадки «далі SEO-6.3» — попередній стан.

**SEO-6.2 локально завершено:** [результат і докази](../../docs/seo/audit.md#seo-62-картки-новин-і-sidebar--2026-10-26). 4 файли застосунку: `/news` cards/sidebar/empty-state — H2, конкретні accessible names «Читати далі», фото-focus й `aria-current` категорій. 16 GET, SSR fixtures, browser 1280/390/320px, build/lint/tsc/3 наявні та 3 SEO-регресії PASS. Commit + push цього юніту прямо погоджені 2026-10-26 відповіддю «так» після QA; результат — у git history та фінальному повідомленні. SEO-6.1 уже в HEAD `66a13a5`; нижчі згадки про його ще непогоджену публікацію — історичний стан. Обмеження індексації збережено.

**Публікація SEO-6.1 погоджена 2026-10-26:** після локального QA користувач відповів «Так» на commit + push у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений. Наступний юніт — SEO-6.2.

**Публікація SEO-5 погоджена 2026-10-26:** після QA користувач відповів «Так» на commit + push у `codex/seo-1-audit`. Попередні згадки про потрібну згоду — стан до цієї відповіді. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment не засвідчений.

## Мета та погоджений задум

Користувач погодив готувати те, що можливо до завершення наповнення сайту, окремими сесіями. Інформація про частину служінь і служителів відсутня, історія потребує виправлень. Це не перешкоджає підготовці технічної основи, але не є дозволом публікувати вигадані факти або відкривати пошукову індексацію.

Цей файл — специфікація SEO-ініціативи й передача контексту між сесіями. Загальний backlog і правила залишаються в [master-plan.md](../master-plan.md) та [ai-workflow-rules.md](../ai-workflow-rules.md). Поточний стан і наступний крок — на початку [progress-tracker.md](../progress-tracker.md).

## Межі роботи

- Зараз: перевірки й точкові виправлення наявних metadata, URL/canonical, sitemap, правил індексації, JSON-LD, семантики та швидкодії.
- Пізніше: остаточні SEO-тексти за реальним контентом, підтвердження історії/біографій/фактів, власний домен, Search Console і відкриття індексації.
- Не чекати всіх можливих майбутніх сторінок: за окремим рішенням користувача запуск може охопити погоджений набір готових сторінок. Незавершені сторінки залишаються поза індексацією. Нинішнє доручення такого запуску не погоджує.
- Не створювати нові сторінки, CMS-типи, універсальну SEO-платформу, платні інтеграції, динамічний OG-генератор або окремі SEO-поля про запас. Спершу використовувати наявні дані й механізми; потребу в новій схемі винести в окремий обґрунтований юніт.
- Не перейменовувати наявні slug автоматично; необхідні зміни адрес потребують окремого переліку redirects.
- Не змінювати дизайн або затверджену якість повнорозмірних фото заради SEO-бала. Службові виправлення семантики не мають змінювати візуальну ієрархію без потреби.
- Не відкривати crawling/індексацію, не знімати чинні обмеження, не міняти production env/DNS/акаунти в межах цієї підготовки. Launch залишається фінальним окремо погодженим кроком.

## Відомий початковий стан

Перевірено локальний код 2026-10-26; це не аудит live deployment або Google index:

- `app/layout.tsx`: metadataBase, базові title/description, OG/Twitter; `lib/site.ts`: спільний SITE_URL.
- На статичних і динамічних сторінках уже є canonical; detail-сторінки мають generateMetadata. Потрібна перевірка результату й успадкування OG, а не створення всього заново.
- `app/sitemap.ts`: статичні адреси та CMS-колекції news/ministry/teamMember/event; наявність slug не засвідчує редакційну готовність матеріалу.
- `app/robots.ts`: Disallow: /; `/privacy` має noindex та виключена з sitemap.
- JSON-LD уже реалізовано для кількох типів; фактичний перелік та відповідність контенту інвентаризувати в SEO-1.
- У siteSettings уже є група SEO / OG; перевірити, чи її дані використовуються фронтендом, перш ніж додавати дублікати.
- `robots.txt` регулює обхід і сам не гарантує виключення URL з пошуку. Google має отримати сторінку, щоб прочитати noindex. Не називати поєднання Disallow і невидимого crawler-у noindex гарантією захисту.

## Порядок сесій

Одна сесія — 1–2 пов'язані юніти. Якщо обсяг завеликий, створити підетап на кшталт SEO-3.1 та залишити точний наступний крок у tracker. Наявність семи пунктів не дозволяє приховано розширювати сесію. Пункти без дефектів закривати підтвердженням перевірки, без зайвого переписування коду.

| Сесія | Обсяг | Результат і критерій завершення | Скіли на початку відповідної сесії |
|---|---|---|---|
| SEO-1 | Інвентаризація наявного SEO та стану сторінок; без змін коду застосунку | Один звіт `docs/seo/audit.md`: карта route families, чинні механізми, конкретні дефекти з доказами та пріоритетом, контентні залежності, уточнений scope SEO-2. Редакційна готовність не вгадується | seo-audit, karpathy-coder, grill-with-docs |
| SEO-2 | Захист pre-launch та узгоджена політика для незавершених сторінок | Перевірені robots/meta/header для наявних середовищ, збережені обмеження; визначено, як відокремлювати майбутні готові сторінки. Жодного allow або зняття noindex. Неможливість гарантувати захист без platform access явно записана | seo-audit; security-guidance / env-secrets-manager лише якщо відповідний scope потрібен |
| SEO-3 | Title/description і соціальні прев'ю: спершу загальні defaults та статичні сторінки, потім окремий юніт динамічних шаблонів | Перевірка реального HTML: title/description відповідають сторінці, детальні сторінки не отримують помилковий OG URL головної, відсутні дані не спричиняють undefined/HTML у metadata. Не вигадувати остаточні описи до появи текстів | seo-audit, karpathy-coder; senior-frontend за змінами React/Next.js |
| SEO-4 | Узгоджені URL/canonical та sitemap; використати політику SEO-2 | Абсолютні URL походять із SITE_URL; canonical відповідає маршруту, відсутній detail дає 404. У sitemap немає відомих noindex/чернеток/відсутніх сторінок і дублів; lastModified не імітує редагування статичної сторінки кожною генерацією. Готові нові CMS-матеріали підхоплюються автоматично | seo-audit, karpathy-coder; senior-fullstack лише при зміні моделі/потоку даних |
| SEO-5 | Технічна перевірка наявних JSON-LD, точкові виправлення шаблонів | JSON коректний та безпечно серіалізований; URL/ID узгоджені, null-посилання не ламають рендер. Дати, автори, біографії та інші твердження відповідають видимим підтвердженим даним; неперевірені факти перелічені як відкладені. Немає обіцянок rich results | schema-markup, karpathy-coder; seo-audit за потреби |
| SEO-6 | Заголовки, внутрішні посилання та вузька mobile/a11y перевірка SEO-шаблонів | Логічні H1–Hn, зрозумілі crawlable links, немає виявлених битих посилань у погодженій вибірці; виправлено 1–2 пов'язані шаблони/компоненти за аудитом. Перевірено клавіатуру і mobile/desktop. Повний D8 не оголошувати завершеним | seo-audit, a11y-audit, senior-frontend, karpathy-coder |
| SEO-7 | Вимірювання швидкодії та один пріоритетний підтверджений дефект | Повторювана production-build baseline на репрезентативних маршрутах, одна обґрунтована оптимізація за потреби та зіставне вимірювання після. Решта performance backlog лишається окремою. Лабораторний результат не називати реальними польовими CWV | performance-profiler, senior-frontend, karpathy-coder |

Спільні скіли grill-with-docs і handoff застосовувати для оновлення контексту та передачі роботи; решту читати ліниво за AGENTS.md. Контентні/доменні блокери не заважають закривати незалежні технічні пункти.

## SEO-1: погоджений обсяг аудиту

1. Прочитати верх progress-tracker та цю специфікацію. Перевірити git status/branch, зберегти чужі локальні зміни; не використовувати давній стан PR як поточний.
2. Показати стислий scope SEO-1. Запит користувача «Починаємо SEO-1» є вибором цього етапу; повторно питати дозвіл на його read-only перевірки не потрібно.
3. Звірити `app/layout.tsx`, `lib/site.ts`, `app/robots.ts`, `app/sitemap.ts`, metadata/JSON-LD сторінок, дані siteSettings. Не читати значення секретів і не записувати тестові дані в live Sanity.
4. Створити одну матрицю route families: `/`, `/about`, `/history`, `/contact`, `/privacy`, `/ministries` + detail, `/team` + detail, `/news` + detail, `/events` + detail, `/media`, `/media/photos`; `/studio` позначити як службовий. Для кожного типу: джерело контенту, metadata/canonical/OG, JSON-LD, robots/noindex, sitemap, що потребує підтвердження власника. Не змішувати «технічно валідне» та «контент готовий».
5. На локальному production build перевірити рендер типових сторінок, відсутній slug, порожні/неповні дані без запису в CMS. Дані реального deployment/headers перевіряти read-only, якщо він доступний; інакше явно позначити неперевіреним.
6. У `docs/seo/audit.md` дати executive summary, конкретні findings (доказ → вплив → виправлення → пріоритет), короткий порядок дій. Наявні справні механізми не записувати як нові задачі. Повний performance/a11y аудит тут не запускати.
7. Після перевірок оновити tracker і статус SEO-1 нижче. Передати точний перший юніт SEO-2, а не починати його в тій самій сесії.

**Виконано 2026-10-26:** [єдиний звіт аудиту](../../docs/seo/audit.md) містить карту всіх route families, findings F01–F11, контентні залежності, HTTP/fixture-докази та порядок дій. 44/44 URL sitemap локально віддали 200 з canonical відповідного шляху; 5 відсутніх URL — 404/noindex. Окремо перевірено 5 публічних Production URL, без ототожнення deployment SHA з локальним HEAD. Build — PASS (21 schema type / 34 queries, TypeScript, 42/42 static-generation tasks). Код застосунку та live CMS не змінені; жодного SEO-виправлення в цій сесії не виконано.

**SEO-2.1 виконано 2026-10-26:** [матриця, докази та контракт готовності](../../docs/seo/audit.md#seo-21-захист-середовищ-і-контракт-готовності--2026-10-26) — у тому самому звіті. 28 анонімних GET на 4 origins: local / Production alias / актуальний Preview / generated Production. Два generated URLs захищені SSO (302 + X-Robots-Tag noindex), Production alias публічний, без noindex на головній/історії. Dashboard settings недоступні без авторизованої сесії; SHA generated URLs встановлено через GitHub Deployments API, прив’язку Production alias до SHA незалежно не засвідчено. Контракт передано SEO-4: жодного поточного launch approval; майбутній спільний критерій metadata/sitemap за схваленими маршрутами/CMS-документами, окремі правила unfinished/privacy/studio/search/filter/page. Нових CMS-полів/коду немає, F01/F02 ще не закриті. Build PASS: 21 schema type / 34 queries, TypeScript, 42/42 static-generation tasks.

**SEO-2.2 виконано 2026-10-26:** root metadata `noindex, follow` та загальний `X-Robots-Tag: noindex`, без env-перемикача. [Результати](../../docs/seo/audit.md#seo-22-загальний-pre-launch-noindex--2026-10-26): 66 production-build GET — 56 HTML (усі 44 URL sitemap, privacy/studio/query/404) і 10 не-HTML відповідей (robots/sitemap/assets/optimized image/RSC). Build, lint, typecheck, три наявні регресії — PASS. Disallow, page-specific noindex, security headers і CSP scope збережено. Noindex не є контролем доступу й не гарантує відсутності URL у пошуку за Disallow; F01 лишається відкритим. Код локальний, deployment/settings/env/DNS/CMS не змінені. OG/sitemap/query/null-ref fixes не входили в юніт.

Після локального QA користувач прямо погодив commit+push SEO-2.2 у `codex/seo-1-audit` 2026-10-26; результат публікації — у git history та фінальному повідомленні. Live deployment нового коду окремо не засвідчений; Production settings/env/DNS/CMS не змінюються.

**SEO-3.1 виконано 2026-10-26:** root defaults і 11 статичних маршрутів споживають `getPageMetadata()`; підключено чинні CMS `defaultDescription`/`ogImage` із fallback, повні OG/Twitter та правильний social URL, відновлено OG image `/about`, додано опис призначення `/ministries`. [Перевірки та межі](../../docs/seo/audit.md#seo-31-загальні-defaults-і-статичні-metadata--2026-10-26): production build/lint/typecheck/3 регресії PASS, 57 HTTP GET та локальні CMS fixtures. Root/header noindex й Disallow збережено. Після QA користувач прямо погодив commit+push SEO-3.1 у `codex/seo-1-audit` 2026-10-26; результат — у git history та фінальному повідомленні. Live deployment окремо не перевірений.

**SEO-3.2 виконано 2026-10-26:** 4 dynamic detail families споживають чинний helper: власні OG/Twitter URL/title/description, фото матеріалу 1200×630 або спільний fallback; rich text через `toPlainText()`, legacy string підтриманий у metadata. Неповне оголошення має загальний description fallback без нових фактів. [Докази й межі](../../docs/seo/audit.md#seo-32-metadata-динамічних-detail-шаблонів--2026-10-26): 54 GET реальних/службових/відсутніх URL + 8 HTTP fixtures, 32 ізольовані metadata cases; build/lint/typecheck/3 регресії PASS. F07/F10 технічно закриті локально, редакційні тексти не погоджені. Root/header noindex, page-specific robots і Disallow збережено. Після QA користувач прямо погодив commit+push SEO-3.2 у `codex/seo-1-audit` 2026-10-26; результат — у git history та фінальному повідомленні. Live deployment окремо не перевірений; CMS/settings не змінені.

**SEO-4.1 виконано локально 2026-10-26:** [реалізація та докази](../../docs/seo/audit.md#seo-41-спільна-готовність-metadatasitemap-та-lastmod--2026-10-26). Спільний `lib/seo-readiness.ts` — launch origin/date + page path/date/CMS `_id`, початково `launch: null, pages: []`; той самий критерій у metadata й sitemap, Production та погоджений `SITE_URL`. Sitemap 0 URL, published-перспектива, автоматичний відбір схвалених наявних документів і дедуплікація; статичні lastmod пропущені, CMS лише з валідного `_updatedAt`. F02/F03 технічно закриті локально. 58 production-build GET та 103 ізольовані fixture-перевірки, build/lint/typecheck/3 регресії — PASS. Root/header/page-specific noindex й Disallow збережено, schema/UI/JSON-LD/CMS/env/settings не змінені. Commit/push не виконано; deployment не перевірений.

**SEO-4.2 виконано локально 2026-10-26:** [реалізація, матриця та регресія](../../docs/seo/audit.md#seo-42-query-пагінація-та-canonical--2026-10-26). F05/F06 технічно закриті: спільна query/page-нормалізація, 307 для невалідних/повторених/небезпечних значень, 404 для коректного N поза count/порожньої порції. Непорожня пагінація має власний canonical/OG URL, filter/search — noindex із базовим canonical. Metadata та sitemap однаково перевіряють схвалення списку й видимої порції; порожні списки не indexable, query URL поза sitemap. 154 production-build GET, ізольована регресія реальних helper/page/metadata/SSR/sitemap, build/lint/typecheck/3 наявні регресії — PASS. Непорожня друга сторінка — синтетична fixture без CMS mutations. Approval порожній, noindex/Disallow збережені; commit/push не виконано, deployment не перевірений.

**Наступний юніт — SEO-5:** наявні JSON-LD і неповні referenced-дані (почати з F04), узгоджені URL/ID, безпечна серіалізація, відповідність видимому контенту; непідтверджені факти залишити SEO-L. Не розширювати schema.org-типи без потреби, не обіцяти rich results. Скіли: schema-markup, karpathy-coder; senior-frontend/security-guidance/seo-audit за фактичними змінами, grill-with-docs/handoff для контексту. Зберегти всі pre-launch обмеження, не починати SEO-6/7 або launch у цій сесії.

Після локального QA користувач прямо погодив commit+push SEO-4.1 у `codex/seo-1-audit` 2026-10-26. Попередня згадка про невиконану публікацію — стан до цієї згоди; результат — у git history та фінальному повідомленні. Новий live deployment окремо не перевірений; наступний юніт — SEO-4.2.

## Передача між сесіями та Definition of Done

Після локального QA користувач прямо погодив commit+push SEO-4.2 у `codex/seo-1-audit` 2026-10-26, відповівши «Так». Попередні згадки про невиконану публікацію описують стан до цієї згоди; результат — у git history та фінальному повідомленні. Новий live deployment окремо не перевірений; наступний юніт — SEO-5.

- Початок кожної SEO-сесії: tracker → цей spec → лише потрібні доменні context-файли й скіли. Історію старих чатів читати не потрібно.
- Перед реалізацією перевіряти актуальний код та документацію бібліотек; попередній аудит не замінює перевірку після змін контенту.
- На завершення: фактичні зміни, перевірки й їхні межі; `cmd /c "pnpm run build"`; `git diff --check`; цільові lint/typecheck/regression/browser перевірки за зміною. Для runtime-правил потрібні перевірки HTML/HTTP, одного build недостатньо.
- Оновити статус тут і короткий блок на початку tracker: завершений ID, конкретні артефакти/коміти, перевірки, блокери та наступний ID/юніт. Якщо створено нову архітектурну/UI-конвенцію — оновити відповідний context-файл.
- Commit/push/merge — за чинними вказівками користувача та правилами проєкту. Цей план сам не доручає merge або production-запуск.
- Новий звіт не створювати на кожну сесію: доповнювати той самий `docs/seo/audit.md` результатами, посиланнями на реалізацію та невирішеними пунктами. Цей spec не дублює звіт.

## Відкладений фінальний етап SEO-L

Тільки після рішення користувача про готовність до запуску: погодити набір реальних сторінок, підтвердити факти/контакти/розклад/медіа й реальне лого; налаштувати власний canonical domain і redirects, перевірити metadata/OG/JSON-LD/sitemap на ньому; налаштувати Search Console та за потреби Google Business Profile. Відкриття crawling/індексації виконувати останнім погодженим кроком із перевіркою незавершених сторінок. Поточні сім сесій не замінюють launch-checklist master-plan і не закривають A3/D1 автоматично.

Перетини з backlog: A4 — технічний SEO; D3 — лише перевірка/виправлення наявних шаблонів, без усіх майбутніх розширень; D2/D9 — лише виміряний scope SEO-7; D8 — лише вузький scope SEO-6. CSP enforce (C2), повний accessibility-аудит та решта інтеграцій залишаються окремими.

## Статуси

| ID | Стан | Передача |
|---|---|---|
| SEO-0 | Завершено 2026-10-26 | Збережено задум і порядок окремих сесій; код застосунку не змінено |
| SEO-1 | Завершено 2026-10-26 | `docs/seo/audit.md`: маршрути, F01–F11, HTTP/fixture-перевірки, редакційні залежності; без змін коду |
| SEO-2 | Локальні юніти завершено; F01 відкритий | SEO-2.1/2.2 виконано; platform protection Production потребує окремої дії, F02 передано SEO-4 |
| SEO-2.1 | Завершено 2026-10-26 | 4 origins × 7 GET, auth/robots/meta/header; контракт готовності; без змін застосунку/settings |
| SEO-2.2 | Завершено 2026-10-26 | Root metadata + header noindex; 66 локальних GET, build/lint/typecheck/test PASS; Disallow збережено |
| SEO-3 | Завершено локально 2026-10-26 | SEO-3.1 defaults/static + SEO-3.2 detail; F07–F10 технічно закриті, контент/launch відкладені |
| SEO-3.1 | Завершено 2026-10-26 | Defaults і 11 static routes, 57 GET; опублікований commit 51cf0f3 |
| SEO-3.2 | Завершено локально 2026-10-26 | 4 detail families, 62 GET і 32 metadata fixtures; commit/push прямо погоджені |
| SEO-4 | Завершено локально 2026-10-26 | SEO-4.1/4.2: F02/F03/F05/F06 технічно закриті; launch окремо |
| SEO-4.1 | Завершено локально 2026-10-26 | Спільна готовність metadata/sitemap, порожній approval, чесний lastmod; 58 GET/103 fixture-перевірки |
| SEO-4.2 | Завершено локально 2026-10-26 | 154 GET + ізольована регресія; query/page, canonical, redirect/404, noindex filter, схвалення видимої порції metadata/sitemap |
| SEO-5 | Завершено локально 2026-10-26 | F04/null-photo, JSON-LD за видимим контентом, 57 GET + tracked regression; Schema.org synthetic 0 errors/0 warnings; Google test вимагає login, eligibility не засвідчена |
| SEO-6 | Частково виконано | H1-частина F11 закрита у SEO-6.1, news card/sidebar — у SEO-6.2, team/ministry listing cards — у SEO-6.3, OurVision/PastorGreeting pre-titles — у SEO-6.4, testimonials names/FAQ contact — у SEO-6.5, footer — у SEO-6.6; ministry detail headings — SEO-6.7, потім свіжий heading crawl |
| SEO-6.1 | Завершено локально 2026-10-26 | Головний hero + team detail, pause/inert/keyboard, target #map; 53 GET, 51 fragments, mobile/desktop і регресії PASS |
| SEO-6.2 | Завершено локально 2026-10-26 | `/news` card/sidebar/empty H2, конкретні detail link names, фото-focus й current category; 16 GET, SSR fixtures, keyboard/mobile/desktop QA PASS |
| SEO-6.3 | Завершено локально 2026-10-26 | Team/honorary/ministry cards H3, назви посилань без повтору від фото; 11 SSR fixtures, 32 GET, keyboard/mobile/desktop QA PASS |
| SEO-6.4 | Завершено локально 2026-10-26 | OurVision/PastorGreeting pre-titles — абзаци зі збереженим шрифтом; 6 SSR fixtures, 6 GET, computed typography і keyboard/mobile/desktop QA PASS |
| SEO-6.5 | Завершено локально 2026-10-26 | TestimonialsGrid names H6 → p, FAQSplit contact H4 → H3 зі збереженою typography; 6 SSR fixtures, 6 GET, 1280/390/320px і keyboard/CTA QA PASS |
| SEO-6.6 | Завершено локально 2026-10-26 | Footer groups H4 → H2, незмінний `footer-title`; 6 SSR fixtures, 16 GET, exact typography/keyboard/mobile/desktop, build/typecheck/lint/регресії PASS. [Докази](../../docs/seo/audit.md#seo-66-заголовки-футера--2026-10-26) |
| SEO-6.7 | Наступна сесія | Ministry detail sidebar H5/CTA H6/leader H4 (single/multiple): повна сторінка, typography, SSR/links/keyboard/mobile; потім окремий свіжий heading crawl |
| SEO-7 | Не розпочато | Вимірювання → один пріоритетний дефект |
| SEO-L | Відкладено | Реальний контент/домен і окреме рішення користувача про запуск |

## Офіційні джерела

SEO-6.1: [результат, докази та точний залишок](../../docs/seo/audit.md#seo-61-заголовки-hero-і-служителя--2026-10-26), [hero регресія](../../scripts/check-heading-seo.mjs). Один H1 головної/11 team details, pause/focus/hover/reduced-motion gates, `inert` прихованих slides, реальний target `/contact#map`. 53 production GET / 51 fragments, browser 320/390/1280px, build/lint/typecheck/наявні та SEO-регресії PASS. Інші heading templates — SEO-6.2+; повний D8/SEO-7/SEO-L не закрито. Порожній approval/noindex/Disallow збережено, CMS/settings без змін. Commit/push цього юніту потребують окремої згоди за workflow §3. SEO-5 уже в HEAD `89fb6ec`; його нижчі згадки «не виконано» — історичний стан. Окремого handoff-документа не створювати: передача тут і у звіті.

SEO-5: [результат і межі](../../docs/seo/audit.md#seo-5-json-ld-і-null-посилання--2026-10-26), [регресія](../../scripts/check-jsonld-seo.mjs). F04 закритий локально, null refs фільтруються до count, фото має guard. JSON-LD без непідтверджених author/dateModified/uploadDate/church venue/Scheduled; media script синхронний із cards state й SSR. Порожній approval та noindex/Disallow збережено, CMS/env/settings без змін. Контентні факти/eligibility — SEO-L. Commit/push не виконано, потрібна згода за workflow §3; наступний SEO-6 описаний у звіті. Окремий handoff не потрібен.

- [Google: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- [Google: noindex та взаємодія з robots.txt](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Джерела звірено в консультації 2026-10-26; деталі API та eligibility повторно перевіряти в сесії відповідної реалізації.
