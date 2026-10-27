# SEO-аудит до запуску

> Архів аудиту станом на 2026-10-27; це історичні результати, а не поточні гейти чи дозволи. Чинні [master-plan](../../../context/master-plan.md) і [tracker](../../../context/progress-tracker.md). Відносні посилання адаптовано; видалені одноразові скрипти доступні в Git за фіксованою ревізією.

**Публікація D2.1/D8.1 прямо погоджена 2026-10-27:** користувач відповів «Так» після фінального QA; дозволено commit + push 12 файлів у `codex/seo-1-audit` за workflow §3. Свіжий fetch HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду/відсутність commit+push — попередній стан. Результат — у git history та фінальному повідомленні; загальні D2/D8 відкриті, live deployment не засвідчений.

Перед погодженою публікацією повторний build PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. Review 12 файлів, UTF-8 / 75 локальних targets, 5 source / 6 performance / 3 font asset / a11y-browser-screenshot hashes і staged diff-check PASS. Чинні Node/Browserslist warnings та пояснений Diff Surgeon false positive без змін; попередній QA не розширено.

<a id="d2-d8-2026-10-27"></a>
## D2.1 / D8.1 — 2026-10-27

**Завершено локально два вузькі юніти.** Пряме доручення «Роби Далі — D2/D8»; старт чистий `6b12965`, `codex/seo-1-audit` (D9 уже в HEAD). [Scope і критерії](../../../context/specs/done/07-d2-d8-fonts-dialog.md), [машиночитані вимірювання](d2-d8-2026-10-27.json). Загальні D2/D8 залишаються відкритими; commit/push і deployment не виконано.

### D2.1 — font-display локальних іконок

Три використовувані Font Awesome 6 faces мали `font-display: block`: Lighthouse в усіх baseline runs позначав їх як затримку відображення. Додано [локальні overrides](../../../app/icon-fonts.css), імпортовані після package CSS у root layout: Brands 400, Free 400 і Free 900 використовують `swap`. Файли WOFF2, URL/хеші, glyph mappings, ваги, назви сімейств і довільний CMS-вибір іконок збережені. Не додано preload, віддалені fonts, залежності чи експериментальні Next flags. Під час завантаження `swap` допускає короткий fallback; перевірка точного вигляду нижче стосується вже завантажених іконок.

Межі рішення: окремі CSS-файли досі блокують рендер; повний Font Awesome CSS не обрізали, щоб не зламати CMS-іконки. Глобальний `inlineCss` не застосовано: [документація Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss) позначає його експериментальним, з дублюванням CSS у HTML/RSC і втратою окремого кешу стилів.

Вимірювання — [measure-font-delivery.mjs](https://github.com/Chekirko/newlife2/blob/23ecb66b06f67dd70b5bcef607e14079667e671d/scripts/measure-font-delivery.mjs), built app на localhost:3004; по 3 cold-browser mobile runs до/після, Lighthouse 13.5.0. Chrome/повні профілі, image sources та URL/resourceSize усіх 11 font requests точно збігаються. Усі runWarnings порожні. Next optimizer прогріто до кожної серії; це локальна лабораторна симуляція, не польові CWV. D8-зміни виконано після цієї серії.

| Median | До | Після |
|---|---:|---:|
| Performance | 66 | 66 |
| LCP | 6,885 с | 6,908 с |
| FCP | 3,810 с | 3,833 с |
| TBT | 151,5 мс | 162 мс |
| CLS | 0,001561 | 0,001572 |
| Total transfer | 1 760 207 B | 1 760 258 B |
| Font-display audit (кожен run) | 0 | 1 |

**Прискорення не доведено:** median LCP +0,34%, Performance без змін. Закрито конкретний font-display finding, не ціль ≥90/зелених CWV. Після завантаження 24 іконки × 3 viewport = **72/72 точних збігів** class/glyph/font family/weight/width/height; font assets не дублюються у network.

### D8.1 — label contrast і доступна ширина фотодіалогу

- Ministry single-leader label: `text-gray-500` → чинний `text-gray-600`; на `bg-gray-50` **4,46:1 → 4,72:1**, AA normal-text PASS за проєктним contrast checker. DOM підтвердив `rgb(107,113,119)`; текст/розмір/link/розмітка збережені. Окремий production Lighthouse accessibility run цієї сторінки: **100**, color-contrast PASS, scored failures 0. Це автоматична перевірка однієї сторінки, не повний WCAG PASS.
- Shared `ImageLightbox`: `max-w-[92vw]` → `max-w-[min(92vw,calc(100dvw-2rem))]`. Фото враховує сумарні 2rem padding діалогу; старий 92vw cap залишається верхньою межею. На 320px **clientWidth/scrollWidth 320/323 → 320/320**, фото 294 → 288px. На 390px — 358px, на 1280px — старий cap 92vw. Native modal, control positions, object-contain, висота, URL/full-resolution/q=100, D9 observer і preload gate не змінені.

Browser QA: 5 реальних фото служіння × 320/390/1280px — **15/15 без overflow**, рахунок/межі 1–5, Enter/стрілки/Esc/повернення фокусу перевірені. Synthetic SVG portrait 1200×2400 з точними production dialog/image класами — ще **3/3** без overflow (288×576, 357×715, 396×792). Це geometry fixture, не запис до CMS й не доказ portrait-контенту у цьому служінні. Окремий однокадровий team viewer і shared `/media/photos` (1/83→2/83, Space/Enter, backdrop, Esc, restore) працюють; gallery dialog 320/320 і 390/390. Native Tab/Shift+Tab переходить між controls і browser boundary (`activeElement=body`), потім повертається в діалог; background-page links не отримували focus. Не заявляється примусове утримання focus у DOM на кожному натисканні. Console warnings/errors 0. Mobile screenshot оглянуто; raw browser evidence/screenshot — ignored `node_modules/.cache/d2-d8/`.

Проєктний static scanner запущено на двох TSX і rendered HTML. Він не дав чистого PASS: component-scope main/H1/nav/skip findings та 8 HTML heuristics. Перевірено їхні межі: main/H1/skip приходять із layout/PageHero, 2 empty-alt images декоративні або всередині названого leader link, 5 inline-color попереджень стосуються Next Image `color:transparent`, skip matcher не розпізнає наявний `#main-content`. Результат не підмінено автоматичною заявою про відповідність WCAG.

### Перевірки та залишок

- Обидва unit builds PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; старі Node/Browserslist warnings. Lint і повний `tsc --noEmit`, 3 штатні та 4 SEO/photo регресії PASS. Початкові sandbox Sanity-config EPERM/loopback timeout усунені дозволеними запусками; один пізніший read-only Sanity timeout у server log не змінив успішних HTTP результатів.
- 7 HTTP GET: 6×200/1×404, один H1 у 5 HTML, noindex metadata/header, Disallow і порожній sitemap збережені. Build config/дані/schema/GROQ/env/settings/package/lockfile/approval не змінені. Тимчасову public portrait fixture видалено.
- **Далі D2:** render-blocking CSS, mobile LCP, ≥90 і польові CWV. **Далі D8:** FAQ disclosure, nav landmark, breadcrumb contrast, sidebar visual/DOM order, history summary focus, media load-more focus та відстеження #418. Загальні D2/D8/F01/SEO-L відкриті; full-resolution strategy D9 чинна. Commit/push — лише за окремою згодою за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

Фінальний review 4 application файлів і measurement script завершено; UTF-8 12 файлів/75 локальних file+anchor targets/diff-check PASS. 5 source hashes, 6 performance report hashes та a11y/browser/screenshot hashes перевірені. Diff Surgeon дав один intentional false positive `semicolon-style` для CSS import, який повторює чинний стиль layout; автоматичного CLEAN verdict немає. QA-сервер зупинено, viewport скинуто, вкладку закрито, public fixture відсутня.

Нижче — історія попередніх юнітів.

**Публікація D9 прямо погоджена 2026-10-27:** користувач відповів «Так» після підсумкового QA; дозволено commit + push погоджених 15 файлів у `codex/seo-1-audit` за workflow §3. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду або відсутність commit/push — попередній стан. Результат — у git history та фінальному повідомленні; live deployment окремо не засвідчений.

Перед погодженою публікацією повторний build PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. Перша спроба мала тимчасовий ConnectTimeout Sanity API на `/ministries/media`; повтор без зміни коду успішний. Review 15 файлів, UTF-8 / 72 локальні targets, 6 source / 6 raw report hashes і staged diff-check PASS; application/script Diff Surgeon CLEAN. Попередній QA і scope не розширено.

**Актуальний D9:** погоджений юніт доставки оригіналів завершено локально 2026-10-27: **34,42 → 5,87 МБ стартового трафіку (−82,94%)**, full-resolution/q=100 збережені. [Результат і межі](#d9-2026-10-27). SEO-7 вже у HEAD `436f852`; нижчі вступні записи — історія. Commit/push D9 не виконано.

<a id="d9-2026-10-27"></a>

## D9 — доставка оригіналів, 2026-10-27

Користувач доручив D9 та прямо обрав **«Оригінали всюди, завантаження при наближенні»**. [Spec](../../../context/specs/done/06-d9-photo-delivery.md), [6 raw-run summaries, profiles, hashes і QA](d9-photo-delivery-2026-10-27.json). Старт чистий `436f852`, `codex/seo-1-audit`.

Причина стартового трафіку: browser native lazy loading завантажував далекі gallery tiles; у зіставній серії на `/ministries/nove-sluzhinnya` кожен run отримував main photo та всі 4 оригінали галереї. `DeferredGalleryImage` у мозаїках служіння та `/media/photos` тепер монтує original Image при наближенні tile до viewport на 400px. До того LQIP, SSR fallback — noscript, без IntersectionObserver — звичайне завантаження. Кнопки й viewer доступні до завантаження тайла. Main photo не відкладене. Спільний lightbox починає preload сусідів після `onLoad` поточного фото; після переходу чекає новий індекс.

URL і повна роздільність asset, q=100, `unoptimized`, відсутність resize/auto-format/Next optimizer, кадрування та layout збережені. [Next Image: unoptimized](https://nextjs.org/docs/app/api-reference/components/image#unoptimized) і [параметри Sanity](https://www.sanity.io/docs/content-lake/image-urls) звірено; у цьому юніті нових CDN transforms немає. Це не гарантія побітового upload-оригіналу — попередня межа публічного CDN чинна.

### Метод і результат

Built Next.js 16.1.6, Lighthouse 13.5.0 / Chrome 155: по 3 холодні navigation runs на тому самому ministry route, п'ять точних original URLs, settings/browser/version звірені програмно. Mobile 412×823, DPR 1,75, simulated throttling, CPU×4. Вимірювальна утиліта — `scripts/measure-photo-delivery.mjs`; raw reports/traces/HTML — ignored `node_modules/.cache/d9/{before,after}/`. MB нижче десяткові.

| Метрика, медіана | До | Після |
|---|---:|---:|
| Загальний стартовий трафік | 34 418 416 bytes | 5 870 150 bytes (−82,94%) |
| Запити original photos, кожен run | 5 | 1 |
| LCP | 5,332 с | 5,283 с |
| Performance | 72 | 71 |
| CLS | 0,000209 | 0,000209 |

**Висновок — зменшено початковий трафік, прискорення не доведено.** Before run 3 має CPU calibration warning. Score/LCP тут діагностичні; це не польові CWV, не закриття D2 і не повторення старого SEO-7 baseline. Видимий main original лишається приблизно 5,04 МБ. Після перегляду всіх фото користувач отримає ті самі оригінали. Shuffled `/media/photos` перевірено функціонально, без заяви зіставної Lighthouse-серії.

### Перевірка й залишок

- Build PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; чинні Node/Browserslist warnings. Початковий sandbox Sanity-config EPERM усунено дозволеним повтором.
- Повний lint/tsc, 3 штатні + 3 SEO-регресії PASS. Нова `check-photo-delivery.mjs` перевіряє відсутність original img до intersection, LQIP/empty, noscript, observer cleanup/unsupported fallback; 0/1/many viewer, порядок preload й межі navigation. Це VM/SSR, доповнені реальним browser QA.
- Browser ministry: 33/33 exact geometry comparisons main headings/photo buttons на 1280/390/320px; сторінки без horizontal overflow. На початку 4 gallery buttons і 0 gallery img; після scroll усі 4 завантажені з натуральними 2400×1792 / 5184×3456. Main у viewer — 2816×1536. Enter/Space, ←/→, межі 1/5–5/5, Esc/бекдроп, focus trap/restore, screenshots перевірені; console warnings/errors 0.
- Browser `/media/photos`: 12→24 із 83. На 390×600 останні два додані tile на top 1103,5px ще без img, ближні мають original img; noscript image DOM nodes 0 після hydration та client append. Відкладений tile відкриває правильний 24/83 viewer із q=100 та натуральними dimensions. На 1280/390/320px сторінка без overflow.
- 7 HTTP GET (6×200/1×404), один H1 на 4 успішних HTML, SSR noscript 4 ministry/12 media; header/meta noindex, Disallow та порожній sitemap збережені. 6 source hashes і 6 raw report hashes звірені.
- **D8:** dialog на 320px має clientWidth 320 / scrollWidth 323; `max-w-[92vw]` і `p-4` у цьому юніті незмінні. Це окремий geometry finding поряд із label contrast/FAQ/nav/breadcrumbs/sidebar/history/media-focus. Повний a11y PASS не заявляється.

Фінальний review 6 application/script файлів і Diff Surgeon CLEAN; UTF-8 усіх 15 файлів / 72 унікальні локальні file+anchor targets / diff-check PASS. QA-сервер зупинено (3004 без listener), viewport скинуто, основну QA-вкладку закрито.

Погоджений юніт доставки D9 завершений локально. Вага видимих оригіналів, повного перегляду та інших full-resolution шаблонів залишається обмеженням обраної стратегії. Далі D2 CSS/fonts/mobile LCP і D8; адаптивні прев’ю автоматично не впроваджувати. CMS/GROQ/schema/env/settings/package/lockfile/індексація не змінені; F01/SEO-L відкриті. Commit/push D9 потребують окремої згоди за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19); live deployment не засвідчений.

---

**Публікація SEO-7 прямо погоджена 2026-10-27:** відповідь користувача «Так» після підсумкового QA дозволяє commit + push погоджених 10 файлів у `codex/seo-1-audit` за workflow §3. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат публікації — у git history та фінальному повідомленні; live deployment окремо не засвідчений.

Перед погодженою публікацією повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; старі Node/Browserslist warnings. Review 10 файлів, UTF-8 / 69 локальних file+anchor targets, 31 report hash + 2 source hashes і diff-check PASS; application/regression Diff Surgeon CLEAN. Попередній performance/browser/HTTP QA не розширено, код застосунку не змінено.

Первинний аудит: 2026-10-26. Оновлено 2026-10-27. **SEO-7 завершено локально:** [production measurements, F12 і QA](#seo-7--2026-10-27), [30 зіставних вимірювань та діагностика служіння](performance-2026-10-27.json). Mobile LCP головної 9,47 → 6,87 с; hero bytes −33,3%. Це лабораторні метрики, повні D2/D9/D8 не закриті. [SEO-6/F11 завершено раніше](#seo-6-final--2026-10-26). Специфікація: [05-prelaunch-seo.md](../../../context/specs/done/05-prelaunch-seo.md). F01/редакційні залежності/SEO-L відкриті; нижчі секції зберігають історичні докази й попередні статуси.

## Висновки

- Основа працює: 44/44 початкові адреси sitemap у SEO-1 відповідали HTTP 200 із canonical правильного шляху; доступність і canonical повторно підтверджені у SEO-4.1, 5 відсутніх адрес — 404/noindex. Нинішній sitemap навмисно порожній: запуск і жодна сторінка не схвалені.
- Pre-launch crawling заблоковано. За останньою live-перевіркою SEO-2.1 Production alias публічний без meta/header noindex. SEO-2.2 додав обидва сигнали в коді; актуальний live deployment окремо не перевірений. Сам `Disallow: /` і noindex, який crawler може не прочитати, не гарантують відсутності адрес у пошуку; F01 залишається відкритим.
- SEO-3.1 виправив соціальні metadata 11 статичних маршрутів, OG image `/about` і CMS defaults; SEO-3.2 — чотири detail families, фото матеріалу та description fallback оголошення. F07–F10 технічно закриті локально: 62 GET і 32 metadata fixtures SEO-3.2 — PASS. Остаточні тексти/редакційна готовність та live social preview не засвідчені.
- F04 технічно закритий у SEO-5; F11 — у SEO-6 final після contact/media/photos і CMS heading correction. Повторний crawl 50 HTML/34 details/202 blocks: один H1, жодного heading skip або битої HTML/fragment цілі. Вузький browser/keyboard/mobile QA пройшов; повний D8 залишається окремим. Початкові 500 на page новин/подій виправлені у SEO-4.2.
- SEO-4.1/4.2 технічно закрили F02/F03/F05/F06 локально; SEO-5 — null-guards і JSON-LD за видимими даними. Редакційна готовність не встановлена: оголошення без тексту, суперечність історії та непогоджені факти лишаються SEO-L. Noindex/Disallow та порожній approval збережено; F01 відкритий.

## Межі й метод перевірки

- Код: локальний HEAD `7e9739b`, гілка `codex/c1-contact-form`. На старті вже були локальні зміни `context/master-plan.md`, `context/progress-tracker.md` і нова spec `05-prelaunch-seo.md`; вони збережені. Старий стан PR не використано як доказ поточного deployment.
- `cmd /c "pnpm run build"`: PASS, Next.js 16.1.6, TypeScript, 21 schema type / 34 GROQ queries, 42/42 задач статичної генерації. Перша спроба зупинилась на sandbox EPERM конфігурації Sanity CLI; повтор із дозволеним доступом успішний. Попередні warnings Node/Browserslist лишаються.
- Перевірено HTML повних HTTP GET через `next start` на `127.0.0.1:3004`: 44 адреси sitemap + 13 додаткових URL, `/robots.txt`, `/sitemap.xml`. Це перевірка серверного HTML/HTTP, без оцінки візуального layout і browser hydration.
- Проєктний `seo_checker.py --file … --json` запущено для production HTML головної, `/about`, `/team/mikhailo-dren`. Він незалежно підтвердив кількість H1 0/1/2, пропуски heading levels і viewport meta. Автоматичні вимоги довжин title/description та прапорці `alt=""` переглянуто вручну: декоративний hero закономірно має порожній alt; ці евристики не перетворено на окремі дефекти. Загальний SEO health score не обчислювався через неперевірені категорії.
- Локальний `SITE_URL` у результаті збірки — `https://newlife.church`. Це резерв із `lib/site.ts`, **не підтвердження власності або готовності цього домену**. Шляхи canonical збігаються з маршрутами; доступність цільового домену локальний аудит не засвідчує.
- Публічний Production alias `https://newlife2.vercel.app`: read-only GET `/`, `/privacy`, `/studio`, `/robots.txt`, `/sitemap.xml` станом на 08:26 UTC. Контент/назва відповідають сайту, є Vercel response headers. SHA цього deployment окремо не встановлено; локальні висновки не переносимо автоматично на Production.
- Sanity: лише published perspective штатного read-only client; інвентаризаційний GROQ через `defineQuery()`, без читання значень секретів або mutations. Наявність полів перевірена окремо від редакційної готовності.
- Неповні дані перевірено тимчасовою підміною `client.fetch` у локальному процесі та рендером наявних серверних сторінок через `renderToStaticMarkup`. Fetch відновлюється після перевірки, записів у CMS немає. Це ізольована перевірка шаблону, не HTTP-результат реального CMS-документа.
- Не перевірено: актуальний Preview URL та його platform protection, Vercel settings, Search Console/index coverage, органічний трафік, власний домен/DNS, повний WCAG/мобільний аудит, Lighthouse/польові CWV, зовнішні посилання, Google Rich Results eligibility. SEO-1 не закриває D8 або performance backlog.

## Карта маршрутів

Позначення: **R** — кореневі OG/Twitter title/description/image та OG URL головної з [layout](../../../app/layout.tsx); **C** — canonical поточної адреси, абсолютний через metadataBase/SITE_URL; **B** — чинний загальний `Disallow: /`, без page meta noindex. B не означає гарантоване виключення URL з пошуку. У колонці sitemap «так» означає фактичне включення, а не погодження індексації.

| Route family | Джерело видимого контенту | Title / description / canonical / social | JSON-LD у HTML | Robots / sitemap | Підтвердження власника до запуску |
|---|---|---|---|---|---|
| `/` | homepage + siteSettings; news/event/media/teamMember; текстові й фото fallback у коді | Title/description root; C `/`; R | Church + WebSite (`@graph`), FAQPage з тих самих FAQ, що в UI | B / так | Назва/NAP, geo, розклад, соцмережі, FAQ, свідчення, пастор, фото |
| `/about` | aboutPage через `getAboutPage()`, siteSettings, fallback `about-data.ts` | Власні title/description/C; власні OG title/description/url/type, **без og:image**; Twitter R | AboutPage, BreadcrumbList | B / так | Історія, належність до УЦХВЄ, віровчення, статистика, назви/фото |
| `/history` | Таймлайн у page.tsx; CMS лише фон hero | Власні title/description/C; R | Немає | B / так | Дати й події таймлайну; 1992 у коді проти 1991 у контексті; медіа |
| `/contact` | siteSettings + church fallback; форма/карта | Власні title/description/C; R | Немає | B / так | Контакти, точка карти, розклад; обробка звернень і реальна privacy policy |
| `/privacy` | Явна текстова заглушка, pageHeroes | Власні title/description; canonical немає; R | Немає | `noindex, follow` + B / ні | Реальний текст політики; лишається незавершеною |
| `/ministries` | ministry + pageHeroes | Власний title/C; **description root**; R | Немає | B / так | Які служіння/описи й фото готові |
| `/ministries/[slug]` | ministry, weak leaders→teamMember, пов’язані news, gallery | Власні title/description/C; R; фото опційне | BreadcrumbList | B / так, усі published зі slug | Опис діяльності, відповідальні, фото; заповнені поля не доводять готовність |
| `/team` | teamMember за категоріями; групове фото/тексти в коді | Власні title/description/C; R | BreadcrumbList | B / так | Персональний склад, категорії/посади, групове фото |
| `/team/[slug]` | teamMember, bio, фото, ролі | Власні title/C; description з bio або шаблон імені; R | Person, jobTitle із видимих ролей; worksFor у коді | B / так, published зі slug | Імена/біографії/посади/фото; звірити worksFor з siteSettings |
| `/news` | news, category, sidebar; пагінація по 6 | Власні title/description; C завжди `/news`; R | Немає | B / так, базовий URL | Достовірність матеріалів, авторство/дати; політика category/page |
| `/news/[slug]` | news, основне фото, gallery, siteSettings | Власні title/C; description = text до 160 символів; R | NewsArticle, BreadcrumbList | B / так, published зі slug | Заголовок/анонс/текст, дати, фото, author/publisher |
| `/events` | event (події + оголошення), startDate, пагінація по 6 | Власні title/description; C завжди `/events`; R | Немає | B / так, базовий URL | Дати/тип/актуальність, політика page |
| `/events/[slug]` | event, siteSettings | Власні title/C; description з description/body або **відсутній**; R | Event лише для `type=подія`; оголошення без Event | B / так, published зі slug + startDate | Реальні час/статус/місце; шаблон адреси бере church NAP навіть за іншої location |
| `/media` | mediaItem; search/category/speaker; siteSettings liveStream | Власні title/description/C `/media` на всіх фільтрах; R | ItemList → VideoObject першої порції; у базовій вибірці 12 відео | B / так, базовий URL | Відео, назви, дати завантаження, описи; політика search/filter |
| `/media/photos` | Агрегат ministry.gallery; випадковий порядок за ISR | Власні title/description/C; R | Немає | B / так | Фото/підписи; зараз це саме галереї служінь, не автоматичний агрегат усіх news/event |
| `/studio/[[...tool]]` | Embedded Sanity Studio; metadata з next-sanity/studio | У поточному HTML root title/description/social; canonical немає | Немає | `noindex` + B / ні | Службовий маршрут; SEO-контентом не вважати. CMS auth не дорівнює захисту публічного сайту |

Відсутність JSON-LD на окремій сторінці не записана як дефект сама по собі. Нові типи або нові CMS SEO-поля не потрібні для закриття цього аудиту.

## Технічні findings

P1 — високий вплив до запуску або ризик недоступності сторінки; P2 — підтверджене поліпшення шаблону; P3 — підготовка до розширення/контентна перевірка. Це черговість робіт, а не виміряний вплив на позиції.

| ID / проблема | Доказ | Вплив | Рекомендація | Пріоритет / етап |
|---|---|---|---|---|
| F01. Pre-launch захист не гарантує відсутності URL у пошуку | Production `/` → 200 без авторизаційного redirect/challenge, meta robots і `X-Robots-Tag` відсутні; robots → `Disallow: /`. У локальному коді немає загального noindex | Високий: поточний сайт доступний публічно, політика захисту не завершена; **наявність URL у Google цим не доведена** | Зберегти Disallow. Перевірити platform protection для Production/Preview; підготувати захист доступом і додаткові noindex-сигнали. Відсутність гарантії явно задокументувати, не вирішувати через відкриття crawling | P1 / SEO-2 |
| F02. Sitemap не відрізняє редакційно готові сторінки | [sitemap](../../../app/sitemap.ts), рядки 12–18: для detail достатньо slug (+startDate для event). У 44 URL включено `/history`, `/ministries/nove-sluzhinnya` та оголошення без тексту; їхня готовність не погоджена | Високий перед запуском: до майбутнього sitemap готових сторінок потрапить непідтверджений контент | Спочатку політика SEO-2, потім однаковий критерій відбору metadata/sitemap. Не прирівнювати published/defined(body) до схвалення власника; не додавати нові flags у CMS без обґрунтування | P1 перед SEO-L / SEO-2 → SEO-4 |
| F03. `lastModified` статичних URL означає час генерації | [sitemap](../../../app/sitemap.ts), рядки 26–30: `new Date()` для всіх 10 статичних записів. У XML всі 10 мають `2026-10-26T08:21:38.406Z`, незалежно від зміни контенту | Середній: сигнал останнього суттєвого оновлення неточний | Використати підтверджене джерело зміни або опустити lastmod. `_updatedAt` detail-записів уже використовується — цей механізм зберегти | P2 / SEO-4 |
| F04. Weak-reference може зламати ministry detail | Схема ministry має `weak: true`; запит `leaders[]->`; [сторінка](../../../app/(front)/ministries/[slug]/page.tsx), рядки 63, 215–258: `?? []` не прибирає null усередині масиву. Локальна підстановка `leaders:[null]` → `Cannot read properties of null (reading 'slug')` | Високий за видалення/відсутності referenced-документа: рендер переривається. Поточні 15 URL віддали 200, тому це **відтворений edge case**, не заявлений live outage | Відфільтрувати null перед перевіркою довжини й рендером; перевірити 0/1/2+ валідних та нерозв’язаних refs. Не робити references strong | P1 за ризиком / вузький під’юніт SEO-5 |
| F05. Некоректний page дає HTTP 500 | `/news?page=abc` і `/events?page=abc` → 500; server logs: `subscript ranges must have integer endpoints`. [News](../../../app/(front)/news/page.tsx):48 та [events](../../../app/(front)/events/page.tsx):42 пропускають NaN із `parseInt` через Math.max у GROQ slice | Середній: зовнішній URL може викликати server error | Перевіряти скінченне допустиме ціле число до slice; визначити fallback/redirect/404 та поведінку page поза діапазоном. Використати наявну структуру, без нового маршруту | P2 / SEO-4 |
| F06. Canonical пагінації завжди веде на базовий список | `?page=2` в обох списках → 200 з canonical `/news` або `/events`. У поточних даних лише 5 новин/3 події, отже page=2 порожня; реальна непорожня друга сторінка **не перевірена** | Потенційний середній за зростання архіву: різні порції матимуть canonical першої. Уже зараз немає окремої обробки out-of-range | Для існуючих сторінок пагінації планувати власний canonical; empty/out-of-range і category/search узгодити окремо. Не оголошувати всі фільтри автоматично indexable | P3 зараз / SEO-2 policy → SEO-4 |

[Google пояснює обмеження noindex за заблокованого crawling](https://developers.google.com/search/docs/crawling-indexing/block-indexing). [Вимоги sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) рекомендують canonical URL і достовірний lastmod; priority/changefreq Google ігнорує. [Рекомендації пагінації](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) розрізняють власні canonical сторінок і політику фільтрів. Джерела звірено 2026-10-26.

## Metadata, social і семантика

Нижче — початкові findings SEO-1; статус виправлень F07–F10 та нові докази — у розділах SEO-3.1 і SEO-3.2.

| ID / проблема | Доказ | Вплив | Рекомендація | Пріоритет / етап |
|---|---|---|---|---|
| F07. OG/Twitter не відповідають конкретній сторінці | 42/44 URL sitemap мають `og:url=https://newlife.church`; наприклад `/news/vidkrittya-novogo-navchalnogo-roku-v-centri-indigo` має правильний canonical, але OG головної. Власні title/description не перевизначають nested openGraph/Twitter у root | Середній: social preview показує загальні дані й адресу іншої сторінки | Узгодити OG URL/title/description із маршрутом; використовувати наявні фото та перевірений спільний fallback. Перевірити фактичний HTML статичних і dynamic templates | P2 / SEO-3 |
| F08. `/about` втрачає `og:image` | `/about` має власний openGraph object без images. HTML: OG URL `/about`, og:image відсутній; Twitter image залишається root | Середній: неповне соціальне прев’ю | Явно зберегти спільне зображення при перевизначенні OG. Повторно перевірити image/siteName/locale разом, не покладатися на deep merge | P2 / SEO-3, мале виправлення |
| F09. CMS SEO/OG-поля не впливають на metadata | [siteSettings schema](../../../sanity/schemaTypes/siteSettings.ts):221–234 визначає ogImage/defaultDescription. [query](../../../sanity/lib/queries.ts):30–44 не вибирає ogImage; [helper](../../../lib/site-settings.ts):127 повертає defaultDescription, але `rg` не знаходить його споживача в app. Root metadata статичні. Published settings зараз **без обох значень** | Середній для редактора: майбутнє заповнення не дасть очікуваного результату; зараз втрати конкретного заповненого значення не виявлено | Підключити наявні поля до defaults з fallback або уточнити контракт. Не створювати дублікати полів; порожній CMS не має прибирати metadata | P2 / SEO-3 |
| F10. Неповні description | `/ministries` повторює description головної. `/events/obid-dlya-rodin-zagiblikh-zakhisnikiv` → 200, але description немає: немає ні CMS description, ні body. 43/44 URL sitemap мають description | Середній: загальний або відсутній анонс не описує сторінку | Для списку — опис лише підтвердженого призначення; для detail — безпечний fallback/правило відкладення за SEO-2. Остаточний зміст оголошення надає власник | P2 / SEO-3 + SEO-L |
| F11. H1 і рівні heading неузгоджені | Виправлено contact/media/photos та єдиний CMS H4; fresh crawl 50 HTML, усі 34 details/202 blocks — один H1, без heading skips. Умовні empty branches перевірені SSR | Поліпшено семантику/навігацію; зміна позицій у пошуку не вимірювалася | [SEO-6 final: код, CMS, crawl і browser QA](#seo-6-final--2026-10-26) | P2 / технічно закрито локально; повний D8 окремо |
| F12. Неефективна доставка homepage hero-фото | Production mobile LCP median 9,466 с, 657 044 bytes для трьох CSS-фонів без initial high-priority preload | Повільний видимий hero та конкуренція з прихованими фонами | [SEO-7: Next Image, initial preload/high hint, cover-aware sizes](#seo-7--2026-10-27); після LCP 6,873 с, 438 359 hero bytes | P2 / локально закрито; повний D2/D9 окремо |

Поведінка `/about` відповідає [документації Next.js про shallow metadata merge](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging); джерелом істини для встановленої 16.1.6 тут слугує перевірений HTML. Довжина title/description сама по собі не використана як жорсткий критерій дефекту.

## Контент і JSON-LD: залежності перед запуском

| Дані | Спостереження / доказ | Що лишається підтвердити | Власник дії / пріоритет |
|---|---|---|---|
| Служіння та служителі | Published: 15 ministry, 11 teamMember. У всіх є shortDescription/body або bio відповідно; фото є у всіх поточних документів. Два служіння без масиву leaders працюють. `/ministries/nove-sluzhinnya` має назву «Нове служіння» | Повноту, реальність і погоджений набір сторінок. Назва «Нове служіння» — кандидат на редакційну перевірку, не автоматичний вердикт видалити | Власник / P1 до SEO-L |
| Історія | [history page](../../../app/(front)/history/page.tsx):17 починає таймлайн із 1992. [master-plan](../../../context/master-plan.md) уже фіксує суперечність із 1991. `/about` має власний history-блок CMS/fallback | Єдину підтверджену хронологію, усі події/тексти/історичні медіа. Не міняти рік на підставі припущення | Власник / P1 до SEO-L |
| Новини | 5 published, кожна з excerpt/body/image. Назва `/news/sbogodni-vidbulosya-tradiciine-svyato-podyaki` містить «Сбогодні» | Правопис заголовка, авторство організації, дати, відповідність фото; slug самовільно не перейменовувати | Власник / P2 до SEO-L |
| Події й оголошення | 3 published: 2 події та 1 оголошення. Оголошення `obid-dlya-rodin-zagiblikh-zakhisnikiv` без description/body; `den-batka-2026` без description, але має body і metadata з нього | Реальні дати/часовий пояс/місце/стан; доречність `EventScheduled` для минулих/змінених подій. Шаблон Event завжди додає church-адресу до location — відповідність кожному місцю ще не підтверджено | Власник + SEO-5 / P1 для публікації неповної сторінки, решта P2 |
| Відео | 77 mediaItem з URL і date, 77 без description; у базовому `/media` 12 вкладених VideoObject. `date` у схемі є датою події/публікації, але в JSON-LD стає uploadDate | Справжню дату завантаження, зміст описів та відповідність відео. Коректний JSON не означає готовність до Google video results; eligibility перевірити в SEO-5 за актуальними вимогами | Власник + SEO-5 / P2; не вигадувати описи |
| Церква, FAQ, Person, author/publisher | Church/WebSite беруть дані із siteSettings + fallback; FAQPage — з тих самих FAQ, що UI; Person roles з видимих badge, але worksFor hardcoded; NewsArticle author/publisher = організація | Назву, NAP, geo, розклад, факти FAQ, author/publisher та ролі. Уніфікувати дублікати лише після звірки даних | Власник + SEO-5 / P2 |
| Privacy, домен, пошук | `/privacy` — заглушка з noindex; Production origin зараз vercel.app; місцевий fallback newlife.church | Текст політики, майбутній canonical hostname/redirects, набір launch-сторінок, Search Console. Доступів/показників Search Console в цьому аудиті немає | Власник / окремий SEO-L |

У всіх 44 знайдених JSON-LD script-блоках локальної HTML-вибірки JSON.parse успішний. Серед типів є Church, WebSite, FAQPage, AboutPage, BreadcrumbList, NewsArticle, Event, Person та ItemList із вкладеними VideoObject. Усі переглянуті точки вставлення використовують `jsonLdHtml`; підстановка `</script>` перевірила екранування `<` і відновлення вихідного JSON. Це синтаксична/серіалізаційна перевірка, **не Schema.org/Google eligibility validation і не підтвердження фактів**. [Google вимагає відповідності structured data видимому реальному контенту](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Результати перевірок і відтворення

| Перевірка | Результат | Межа висновку |
|---|---|---|
| Sitemap | 200 XML; 44 унікальні URL = 10 статичних + 5 news + 15 ministries + 11 team + 3 events; privacy/studio відсутні | Відбір редакційної готовності відсутній; це не погоджений launch sitemap |
| 44 GET зі sitemap | 44×200, 44 різні title, 44 canonical із відповідним pathname, 43 description, 0 виявлених `undefined`/`[object Object]`/HTML у metadata | Origin локального HTML — fallback newlife.church; не тест власного домену |
| Внутрішні посилання | У зібраному HTML знайдено 45 унікальних локальних pathname; усі відповідають перевіреним 200 URL (44 sitemap + privacy) | Query variants, fragments, client-only transitions і зовнішні адреси цим не перевірені повністю |
| Missing slug | `/seo-1-missing`, `/news/seo-1-missing`, `/events/seo-1-missing`, `/ministries/seo-1-missing`, `/team/seo-1-missing` → 404 + meta noindex | Не soft-404 у перевіреній вибірці |
| Порожня вибірка | `/news?category=seo-1-empty` → 200 «Немає новин»; `/media?q=seo-1-empty` → 200 «Нічого не знайдено», без порожнього ItemList | Політика майбутньої індексації search/filter ще не визначена |
| Page parameters | `?page=2` → 200 на порожній порції; `?page=abc` → 500 для news і events | F05/F06; непорожня друга сторінка за поточних даних не існує |
| Відсутній singleton, локальні підстановки | siteSettings → наявний name fallback; aboutPage → наявні history paragraphs fallback | Працездатність fallback не засвідчує фактичну правильність його текстів |
| Неповні detail, локальний рендер | Ministry без image/body/leaders/gallery; news без excerpt/body/image; оголошення без description/body/image; team без bio/roles, з обов’язковим за схемою фото — рендер проходить | Ministry description повертається null, news/event description пропущений, team має fallback. Це не гарантія повноцінного SEO-контенту |
| Нерозв’язаний ref, локальний рендер | Ministry `leaders:[null]` → TypeError читання slug | Підтверджений F04; live CMS не змінювався |
| Production HTTP | `/`, `/privacy`, `/studio`, robots, sitemap → 200. Головна canonical/OG = `https://newlife2.vercel.app`; privacy `noindex, follow`, studio `noindex`; `X-Robots-Tag` не виявлено | Лише ці 5 URL і момент перевірки; не перевірено Preview/platform settings/index coverage |

Базове відтворення на актуальному published-контенті:

```text
cmd /c "pnpm run build"
cmd /c "pnpm run start --hostname 127.0.0.1 --port 3004"
curl.exe -sS -i http://127.0.0.1:3004/robots.txt
curl.exe -sS -i http://127.0.0.1:3004/sitemap.xml
curl.exe -sS -i "http://127.0.0.1:3004/news?page=abc"
curl.exe -sS -i "http://127.0.0.1:3004/events?page=abc"
curl.exe -sS -i http://127.0.0.1:3004/ministries/seo-1-missing
curl.exe -sS -i https://newlife2.vercel.app/
```

Тимчасові HTTP/fixture-скрипти й JSON-вимірювання лежать у `.next/seo-1/` (ignored, зникають при очищенні build). Довготривалі докази/параметри/результати збережені тут; наступна сесія не залежить від цих тимчасових файлів. Для F04 локально повернути ministry із валідними `_id/title/slug`, опційними image/body/gallery = null і `leaders:[null]` замість результату `MINISTRY_BY_SLUG_QUERY`; перевірка `?? []` лишає null на індексі 0. Не записувати fixture в dataset.

Код застосунку, schemas, package dependencies, env, DNS, live CMS, robots та правила індексації в SEO-1 не змінювалися. Після перевірок локальний сервер зупинено. Lint/регресії застосунку для документаційного diff не розширювалися; обов’язковий build, перевірка локальних посилань документації, `git diff --check` і цільові read-only перевірки виконані.

## Уточнений обсяг SEO-2

**Перший юніт — SEO-2.1: перевірити й зафіксувати pre-launch захист у наявних середовищах.** Починати з F01/F02, звіривши свіжі результати, а не з metadata/OG-виправлень.

1. Встановити актуальні Production/Preview URL і скласти матрицю HTTP status/auth, robots.txt, meta robots та X-Robots-Tag. Локальний і Production baseline вище вже є; Preview і platform protection лишаються неперевіреними.
2. Перевірити доступний platform protection read-only. Якщо немає доступу/можливості гарантувати захист, записати це прямо. Рекомендований напрям — обмеження доступу до pre-launch deployment; noindex розглядати як додатковий сигнал, який crawler за Disallow може не прочитати. Не знімати Disallow/noindex і не міняти Production settings без окремого доручення.
3. Зафіксувати політику: зараз жодна сторінка не отримує дозвіл на запуск; майбутню готовність погоджує власник за конкретними маршрутами. Окремо визначити unfinished detail, privacy/studio та search/filter/page; факт published або наявність slug/body не є approval. Спочатку перевірити, чи достатньо наявних механізмів, без нової CMS-схеми про запас.
4. Критерій завершення: перевірена матриця або конкретні обмеження доступу; узгоджений контракт відбору для майбутнього SEO-4; чинні обмеження збережені. Якщо локальне посилення захисту потребуватиме коду, виділити SEO-2.2 у межах дозволених 1–2 юнітів. Не поєднувати SEO-2 з OG/null-ref fixes.

Скіли: seo-audit; grill-with-docs/handoff для контексту; security-guidance/env-secrets-manager лише за потрібного scope; karpathy-coder за змінами коду. Початок: [tracker](../../../context/archive/2026-10-27/progress-tracker.md) → [spec](../../../context/specs/done/05-prelaunch-seo.md) → цей звіт. Рішень про нову архітектуру/UI на SEO-1 не прийнято.

## SEO-2.1: захист середовищ і контракт готовності — 2026-10-26

**Результат:** актуальний Preview і згенерований Production URL вимагають Vercel SSO; основний Production alias публічний. F01 залишається відкритим. Контракт F02 визначено для SEO-4, але відбір у коді ще не реалізовано. Жодну сторінку не погоджено до індексації.

### Ідентифікація deployment і межі доступу

- Локальна гілка `codex/seo-1-audit`, HEAD `0ed0dc715f9955fd8e614150726b9a0569c7d11d`; дерево на старті чисте. Публічний GitHub Deployments API на момент перевірки повернув найновіші записи: Preview [7327594288](https://api.github.com/repos/Chekirko/newlife2/deployments/7327594288) для цього HEAD; Production [7319354679](https://api.github.com/repos/Chekirko/newlife2/deployments/7319354679) для `827dc3cbed9ee4f3c98a66e7f8bfac83e4bed844`. Обидва мають status success; точні URL взято з їхніх `/statuses`, а не вгадано за назвою гілки.
- GitHub connector підтвердив Vercel success поточного HEAD і [dashboard deployment](https://vercel.com/chekirkos-projects/newlife2/337W8EFqpfVvin4D3QCYYT7WfMeU). Deployments endpoint прочитано публічним HTTPS GET, бо connector його не підтримує. Production alias `https://newlife2.vercel.app` перевірено окремо: без авторизованого dashboard немає незалежного підтвердження, до якого SHA він зараз прив’язаний.
- Dashboard у доступному in-app браузері показав `404 / Log In to Vercel`. Це обмеження доступу до налаштувань, **не доказ відсутності deployment**. WebMCP не надав доступного інструмента перевірки settings. Точний protection scope, винятки, share/bypass links, усі старі deployments/aliases і тариф акаунта не перевірені. Cookies, токени, env values та bypass не використовувалися.

### Анонімна HTTP-матриця

GET без cookies/Authorization, redirects не слідували; перевірка remote о 08:50:48–08:50:50 UTC, local о 08:52:56 UTC. Однакова вибірка: `/`, `/history`, `/privacy`, `/studio`, `/seo-2-1-missing`, `/robots.txt`, `/sitemap.xml`.

| Середовище / точний origin | HTTP / доступ | robots.txt | Meta robots у HTML | X-Robots-Tag | Висновок |
|---|---|---|---|---|---|
| Local production build `http://127.0.0.1:3004` | 200 для наявних; missing 404. Сервер прив’язаний лише до loopback | 200, `User-Agent: *`, `Disallow: /`; sitemap origin = fallback `https://newlife.church` | `/` і `/history`: немає; privacy `noindex, follow`; studio і missing `noindex` | Відсутній на всіх 7 | Мережева доступність обмежена localhost; загального noindex у застосунку немає. Домен fallback не підтверджено |
| Production alias `https://newlife2.vercel.app` | 200 для наявних; missing 404; auth redirect/challenge немає | 200, `Disallow: /`; sitemap origin = alias | `/` і `/history`: немає; privacy `noindex, follow`; studio і missing `noindex` | Відсутній на всіх 7 | Публічний pre-launch сайт; захист від індексації не гарантований |
| Preview `https://newlife2-a0tkjkml6-chekirkos-projects.vercel.app` | Усі 7 → 302 на `https://vercel.com/sso-api` | 302: тіло robots застосунку недоступне анонімно | HTML застосунку не отримано; не позначати як «немає noindex» | `noindex` на всіх 7 redirect-відповідях | У перевіреній вибірці platform auth працює; не доказ усіх aliases/винятків |
| Generated Production `https://newlife2-jubzinhjm-chekirkos-projects.vercel.app` | Усі 7 → 302 на Vercel SSO | 302: недоступне анонімно | Недоступне за auth | `noindex` на всіх 7 | Захист цієї адреси не поширюється автоматично на публічний Production alias |

Local і Production alias віддають sitemap із 44 URL; зміст відбору не змінювали. `/studio` віддає публічну оболонку з noindex; Sanity login не є захистом решти сайту. URL SSO з query-параметрами не зберігалися у звіті. Тимчасовий probe і компактні результати — ignored `.next/seo-2.1/`; довготривалий доказ — ця матриця.

Спостережувана різниця між alias і generated URL **сумісна зі Standard Protection**, але налаштування не засвідчене. За [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection), Standard Protection виключає production domains; All Deployments із Vercel Authentication охоплює також їх. Тому для закриття доступу до всього pre-launch сайту рекомендовано окремим дорученням перевірити й застосувати захист, що охоплює **Production alias, Preview та generated URLs**, а потім повторити анонімні GET. Налаштування акаунта в SEO-2.1 не змінювалися.

[Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) потребує доступного crawling: за `Disallow: /` додатковий meta/header може лишитися непрочитаним. Ні чинний Disallow, ні майбутнє його поєднання з noindex не засвідчують відсутності вже відомих URL у Google. Search Console/index coverage не перевіряли. Чинний Disallow збережено; відкривати crawling для читання noindex цим етапом не дозволено. Офіційні джерела повторно звірено 2026-10-26.

### Політика готовності для SEO-4 і SEO-L

**Поточний стан:** запуск не погоджений, набір схвалених до індексації маршрутів порожній. Published, slug, фото, body/bio, успішний build та наявність URL у sitemap окремо чи разом не є редакційним схваленням. Політика нижче — контракт майбутньої реалізації; вона ще не змінює metadata/sitemap/доступність.

1. **Схвалення стосується конкретної сторінки.** Власник перевіряє реальні факти, текст, медіа/права на них, дати/контакти та пов’язані дані; результат записується з canonical pathname і датою, для CMS — також `_id` та поточним slug. Непідтверджені fallback-тексти не вважаються перевіреними. Зміна slug потребує нового запису маршруту й окремого рішення щодо redirect; суттєві зміни фактів — повторної редакційної перевірки.
2. **Єдиний критерій для metadata та sitemap.** Майбутній дозвіл = окреме погодження SEO-L + Production на погодженому canonical host + схвалена сторінка + реальний published-документ/маршрут із валідною 200-відповіддю. Службові/пошукові варіанти виключаються правилами нижче. Неузгоджена, відсутня або невідома сторінка за замовчуванням не indexable. Sitemap включає лише canonical 200 URL, що проходять той самий критерій; видалення URL із sitemap не замінює noindex/контроль доступу.
3. **Наявних механізмів достатньо для початкового явного переліку.** У схемах немає per-document approval/noindex-поля; siteSettings SEO — загальні title/description, не готовність. У SEO-4 використати мінімальний спільний перелік схвалених маршрутів/CMS `_id` із чинним slug для metadata і sitemap, початково порожній; не дублювати правила у двох місцях. Published-запити й ISR уже є: схвалені нові CMS-документи мають підхоплюватися автоматично без ручної правки `SITEMAP_QUERY` на кожен документ. Додавання до переліку схвалення — окрема редакційна дія, а не ручне написання sitemap. Нові матеріали без схвалення автоматично не відкривати. Якщо власнику знадобиться самостійне схвалення зі Studio без кодових змін, обґрунтувати окремий юніт моделі/workflow; нову CMS-схему зараз не створювати.

| Клас URL | До запуску | Контракт після окремого погодження SEO-L |
|---|---|---|
| Статичні й базові списки (`/`, about/history/contact, ministries/team/news/events/media/photos) | Загальний Disallow; жодного launch approval | Кожен canonical маршрут окремо проходить схвалення. Схвалення списку не схвалює всі details; відомі незавершені матеріали не просувати через crawlable links схваленого списку |
| Незавершені ministry/team/news/event details | Поточну доступність не змінювати; готовність не вгадувати | Поза sitemap, noindex; залишати доступними crawler лише в межах окремо погодженої launch-політики, інакше обмежити доступ. Не додавати Disallow для цих URL поверх noindex як «гарантію». Деталь можна схвалити без очікування всіх інших |
| `/privacy` | Зберегти `noindex, follow`, поза sitemap | Поки заглушка — без змін; реальний текст і окреме схвалення потрібні перед переглядом SEO-режиму |
| `/studio` та вкладені tools | Службова оболонка noindex, поза sitemap | Залишається службовою/noindex незалежно від готовності контенту. CMS authentication і platform protection перевіряються окремо |
| Search/filter (`media?q/category/speaker`, `news?category`, їх комбінації) | Жодного дозволу на індексацію | Початково noindex і поза sitemap, без окремих SEO landing pages; canonical нормалізується до базового списку. Canonical не замінює noindex і не обходить launch gate |
| Пагінація без search/filter (`news/events?page=N`) | Наявні дефекти F05/F06 ще не виправлено | `page=1`/відсутній → базовий URL; валідний N≥2 з непорожньою порцією → власний canonical із page. Дозвіл лише для схваленого списку й схваленої видимої порції; в іншому разі noindex. Query-сторінки не включати до початкового sitemap. З filter діє попередній рядок |
| Невалідний page / порожня порція | F05: можливий 500 | SEO-4: неціле, повторене, нечислове, ≤0 або небезпечне число → redirect на нормалізований базовий URL зі збереженням валідного filter; коректне N поза діапазоном → 404/noindex. Порожній базовий список → 200/noindex до появи схваленого вмісту. Підтвердити поведінку HTTP-тестами, не передавати NaN у GROQ |
| Відсутній документ/slug | Поточний 404/noindex зберегти | 404/noindex, поза sitemap; не перетворювати на 200 заглушку |

Це мінімальна початкова політика, без дозволу на майбутні filter landing pages чи автоматичне схвалення всього типу документів. До SEO-L потрібно перевірити її на конкретному launch-наборі, включно з видимими картками/внутрішніми посиланнями.

### Перевірки й передача

- `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks. Перший sandbox-запуск: EPERM конфігурації Sanity CLI; дозволений повтор успішний, старі Node/Browserslist warnings лишилися. Локальний sandbox-сервер був недоступний HTTP-клієнту; повторний запуск із потрібним доступом дав наведені 7 результатів.
- 28 анонімних GET (4 origins × 7 шляхів), без форм, CMS mutations, env/DNS/settings змін. Код застосунку/залежності/robots залишилися незмінними. Сервісні redirects перевірені до першої відповіді, авторизований контент Preview не перевірявся.
- UTF-8 усіх 5 змінених документів, 25 локальних посилань і автоматична звірка 28 результатів із матрицею — PASS; `git diff --check` — PASS. Локальний сервер зупинено, порт 3004 без listener. Runtime-тести застосунку не розширювалися для документаційного diff.
- **Наступний юніт — SEO-2.2:** додатковий загальний pre-launch noindex у наявних metadata/header-механізмах, без нового env-перемикача, без зняття Disallow і без змін Production settings; перевірити production-build HTML/HTTP для static/dynamic/privacy/studio/404 і headers для не-HTML відповідей. Це посилення сигналів, не виправлення публічного доступу F01. Read-only перевірка platform settings і рішення власника про захист Production лишаються відкритими; не блокують локальний кодовий юніт.
- SEO-3 → SEO-7 та окремий SEO-L залишаються за spec. F02 закривається лише після реалізації спільного відбору й перевірок SEO-4; F01 — після фактичного захисту потрібних публічних адрес, а не лише додавання noindex.

## SEO-2.2: загальний pre-launch noindex — 2026-10-26

**Результат:** локальний production build віддає загальний meta robots та `X-Robots-Tag: noindex`. Перевірено 66 анонімних GET: 56 HTML і 10 інших відповідей. F01 не закрито: noindex не обмежує доступ, platform protection Production alias досі потребує окремої дії. Після локального QA користувач прямо погодив commit+push у `codex/seo-1-audit`; live deployment нового коду окремо не засвідчений. Нижчі записи «ще не опубліковано» описують стан на момент QA.

### Реалізація й успадкування

- [Root metadata](../../../app/layout.tsx): `robots: { index: false, follow: true }`, без env-перемикача. Чинна privacy metadata дає той самий `noindex, follow`; Studio зберігає власний `noindex` із `next-sanity/studio`. У Next.js вкладений об’єкт robots замінює батьківський цілком, тому нові page-specific robots мають зберігати pre-launch noindex.
- [HTTP headers](../../../next.config.ts): у чинне правило `/:path*` додано `X-Robots-Tag: noindex`, включно з ресурсами й RSC. Security headers та CSP Report-Only з винятком Studio збережено; окремої middleware немає.
- `app/robots.ts` не змінено: `User-Agent: *`, `Disallow: /`, без Allow. Sitemap лишився з 44 URL; відбір за готовністю — майбутній SEO-4. OG, query-валідація, null-ref, CMS-схеми/контент, env/DNS/settings не змінені.

### Production-build HTTP/HTML

Origin `http://127.0.0.1:3004`, Next.js 16.1.6; старт із чистого `codex/seo-1-audit`, HEAD `19a9313` плюс поточний diff. GET без redirect-follow; кожна відповідь перевірена на `X-Robots-Tag: noindex`, nosniff і збережений scope CSP. У кожному HTML перевірено фактичні meta robots, а не лише exports у коді.

| Вибірка | Кількість / HTTP | Meta robots | HTTP X-Robots-Tag |
|---|---|---|---|
| Усі URL sitemap: static, ISR ministry/team, dynamic news/events/media та details | 44 × 200 | `noindex, follow` | `noindex` |
| `/privacy` | 1 × 200 | `noindex, follow` | `noindex` |
| `/studio`, `/studio/structure` | 2 × 200 | `noindex` із next-sanity | `noindex` |
| `/news?page=1`, `/events?page=1`, `/media?q=seo-2-2-empty`, `/media?category=invalid` | 4 × 200 | `noindex, follow` | `noindex` |
| Missing `/seo-2-2-missing` і такий самий slug у news/events/ministries/team | 5 × 404 | Native `noindex` + успадкований `noindex, follow`, без суперечливого index | `noindex` |
| `/robots.txt`, `/sitemap.xml` | 2 × 200 | Не HTML | `noindex` |
| favicon, public JPG/SVG/WOFF2, optimized `/_next/image`, по одному фактичному `/_next/static` CSS/JS з HTML | 7 × 200 | Не HTML | `noindex` |
| `/media` з request header `RSC: 1` | 1 × 200, `text/x-component` | Не HTML | `noindex` |

Чинні noindex privacy/studio та справжній 404 збережені. Усі 44 sitemap URL залишилися доступними; їхній noindex зараз навмисний, це не погоджений launch sitemap. Headers стороннього Sanity/YouTube CDN цей застосунок не контролює й у вибірку не включено. Browser hydration/Studio login не перевірялися: UI й auth-код не змінені.

### Перевірки й межі

- `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks. Перший запуск: sandbox EPERM Sanity config; дозволений повтор успішний. Попередні Node/Browserslist warnings лишилися.
- `pnpm run lint`, `pnpm run typecheck`, `pnpm test` — PASS; три наявні регресії, contact HTTP лише mock, без live email/Redis. Typecheck також потребував доступу Sanity CLI до власної конфігурації.
- HTTP probe — PASS, 66 GET; sandbox loopback був недоступний (EACCES/ETIMEDOUT), сервер і клієнт повторно запущені з потрібним доступом. Тимчасовий probe/JSON — ignored `.next/seo-2.2/`; довготривалий доказ — ця таблиця.
- Завершальні перевірки: UTF-8 шести документів, 30 локальних посилань, звірка 66 HTTP-результатів і `git diff --check` — PASS. Сервер зупинено, порт 3004 без listener. `robots.ts`, sitemap, package/lockfile не змінені; commit/push ще не виконано.
- [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging) та [headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) звірено з фактичною поведінкою встановленої версії. [Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): заблокований crawling може завадити читанню meta/header. Джерела звірено 2026-10-26. Disallow не відкривали; відсутність URL у Google не перевірена й не гарантована.
- До SEO-L разом переглянути root robots, загальний HTTP header і page-specific обмеження за спільною політикою SEO-4. Просте зняття Disallow не відкриє індексацію, поки діє загальний header. F01/settings залишаються зовнішньою дією за окремим дорученням; F02 — реалізація SEO-4.
- **Наступна сесія — SEO-3.1:** наявні загальні metadata defaults та статичні сторінки (F07–F10 за scope), включно з підключенням CMS SEO defaults і OG `/about`; динамічні шаблони — окремий SEO-3.2. Зберегти root/header noindex й Disallow. Скіли: seo-audit, karpathy-coder, senior-frontend; grill-with-docs/handoff для контексту. Нових SEO-полів/OG-генератора не додавати.

## SEO-3.1: загальні defaults і статичні metadata — 2026-10-26

### Реалізація та статус findings

- Старт: чисте дерево `codex/seo-1-audit`, HEAD `f4b58a8`; пряме доручення користувача «Роби Наступний крок — SEO-3.1». [Спільний helper](../../../lib/metadata.ts) формує повні OpenGraph/Twitter з title/description відповідної сторінки, URL через `SITE_URL`, siteName, `uk_UA`, type website та image. Root тепер `generateMetadata`, збережено metadataBase/keywords і `noindex, follow`; глобального canonical немає.
- [Чинний запит](../../../sanity/lib/queries.ts) вибирає наявне `siteSettings.ogImage`; [getSiteSettings](../../../lib/site-settings.ts) повертає URL 1200×630 лише за наявного asset ref, інакше null. Опис: власний непорожній → CMS defaultDescription → попередній кодовий; image: CMS → попередній `/images/hero-church-1.jpg` 1920×1080. Title/description очищаються від HTML-тегів та зайвих пробілів. Схеми, live CMS та залежності не змінені; TypeGen згенеровано штатно.
- 11 статичних маршрутів використовують helper: `/`, `/about`, `/history`, `/contact`, `/ministries`, `/team`, `/news`, `/events`, `/media`, `/media/photos`, `/privacy`. Чинні title/description збережено, лише `/ministries` отримав опис призначення списку. OG/Twitter `/about` тепер відповідають власним title/description і мають спільне зображення. Візуальний UI та JSON-LD не змінені.

| Finding | Локальний стан після SEO-3.1 | Залишок |
|---|---|---|
| F07 | Статичні маршрути: власні OG URL/title/description та Twitter — PASS | Dynamic detail-шаблони — SEO-3.2; загальний finding відкритий |
| F08 | `/about`: OG image/siteName/locale разом із власним URL — PASS, закрито локально | Live deployment/social crawler не перевірені |
| F09 | Чинні CMS defaultDescription/ogImage підключені з fallback — PASS, закрито локально | Published SEO-поля порожні; заповнений сценарій перевірений локально, без CMS mutations |
| F10 | `/ministries`: власний опис призначення — PASS | Неповний event/announcement — SEO-3.2; загальний finding відкритий |

### Production-build HTML/HTTP та fixtures

57 анонімних GET на `127.0.0.1:3004` через `next start`, без оцінки дизайну або platform changes:

| Вибірка | Кількість | Результат |
|---|---:|---|
| Усі URL sitemap (10 static + 34 detail) | 44 | Усі 200, meta/header noindex; sitemap лишився з 44 унікальними URL |
| Privacy та Studio | 2 | 200, власні noindex збережені; privacy canonical як раніше відсутній |
| Missing base/news/event/ministry/team | 5 | Усі 404, meta/header noindex |
| `/media?q=test`, `/news?category=test`, `/events?page=1` | 3 | 200, static metadata базового маршруту, meta/header noindex; політика query не змінена |
| robots, sitemap, fallback JPEG | 3 | 200, header noindex; `Disallow: /`, без Allow; fallback image доступний |

Усього 54 HTML + 3 не-HTML. Для 11 статичних базових маршрутів автоматично перевірено одиничні непорожні title/description/OG/Twitter, 11 різних title, рівність social title/description із metadata сторінки, URL правильного шляху, image/siteName/uk_UA/website/summary_large_image. Чинні canonical 10 статичних URL sitemap збережені; privacy без canonical. Descriptions без undefined/HTML; header noindex присутній на всіх 57 відповідях. Динамічні OG не оголошуються виправленими.

Локальна підстановка `client.fetch` без мережі/mutations: відсутній settings singleton; null/порожній/whitespace/HTML-порожній опис; відсутній asset ref; заповнений CMS defaultDescription та image; власний опис поверх defaults; очищення HTML/whitespace; збереження явного canonical/robots; повні OG/Twitter — PASS. Тимчасові fixtures/probe/JSON — ignored `.next/seo-3.1/`; наступна сесія використовує звіт, не тимчасові файли.

`cmd /c "pnpm run build"`, `pnpm run lint`, `pnpm run typecheck`, `pnpm test` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks, три наявні регресії. Початковий sandbox build зупинився на Sanity config EPERM; дозволений повтор пройшов. Sandbox loopback дав WinError 10013; сервер і HTTP probe повторені з потрібним доступом. Перший probe помилково рахував порожній pathname головної як окремий від `/`; виправлено лише перевірочний скрипт, повний повтор 57 GET — PASS. Старі Node/Browserslist warnings залишилися. Mock contact test не надсилає email/Redis.

[Next.js generateMetadata та merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging) звірено 2026-10-26: вкладені metadata замінюються; поведінку перевірено на встановленому Next.js 16.1.6. ISR 60s збережено. Root/header noindex, Disallow, privacy/studio, security headers і CSP збережені; noindex не є контролем доступу. Немає змін env/DNS/platform settings/live CMS чи перевірки Google index. Після QA користувач прямо погодив commit+push SEO-3.1 у `codex/seo-1-audit` 2026-10-26. Свіжий fetch підтвердив HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат публікації — у git history та фінальному повідомленні; новий live deployment окремо не перевірений.

### Передача SEO-3.2

Завершальні перевірки: 6 UTF-8 документів, 23 унікальні локальні посилання, звірка 57 HTTP-рядків і `git diff --check` — PASS. Локальний сервер зупинено, порт 3004 без listener. Diff: 15 файлів застосунку (включно з новим helper) і 6 документів; robots/sitemap/next.config/package/lockfile без змін.

Наступний юніт — F07/F10 для `/news/[slug]`, `/events/[slug]`, `/ministries/[slug]`, `/team/[slug]`: узгодити OG/Twitter із конкретними даними, власним image або чинним fallback, без вигаданого опису неповного оголошення. Використати helper за потреби, rich text через `toPlainText`, перевірити missing slug/порожні поля та production HTML. Canonical/readiness/sitemap/query — SEO-4, JSON-LD/null-ref — SEO-5; зберегти всі pre-launch обмеження. Скіли — seo-audit, karpathy-coder, senior-frontend, grill-with-docs/handoff для контексту.

## SEO-3.2: metadata динамічних detail-шаблонів — 2026-10-26

### Реалізація та статус findings

- Старт: чисте дерево `codex/seo-1-audit`, HEAD `51cf0f3` (SEO-3.1); пряме доручення «Роби Наступний крок — SEO-3.2». Змінено лише [helper](../../../lib/metadata.ts) і generateMetadata у [news](../../../app/(front)/news/[slug]/page.tsx), [events](../../../app/(front)/events/[slug]/page.tsx), [ministries](../../../app/(front)/ministries/[slug]/page.tsx), [team](../../../app/(front)/team/[slug]/page.tsx), плюс 6 документів контексту/звіту.
- Кожен detail отримує повні OG/Twitter: власні URL/title/description, `siteName`, `uk_UA`, `website`, `summary_large_image`. Опційний image-object передається helper лише як вхід: фото матеріалу 1200×630 через чинний `urlFor().fit('crop')` → CMS ogImage → попереднє hero-фото. Основні фото UI, їхня роздільність/якість і лайтбокси не змінені.
- Description: непорожній excerpt → наявний rich body/fullDescription через `toPlainText()`; bio служителя також через `toPlainText()`, без bio збережено попередній опис за ім’ям. Legacy string підтриманий саме в metadata. Довжина detail-витягу до 160 символів, title/description/image alt очищаються helper. Якщо тексту немає, чинні CMS/code defaults; відсутні title/name не дають `undefined`.
- **F07 закрито локально:** усі 44 sitemap URL мають social URL/title/description відповідної сторінки (34 detail перевірено після змін). **F10 технічно закрито локально:** `/ministries` виправлено у SEO-3.1; `/events/obid-dlya-rodin-zagiblikh-zakhisnikiv` тепер має однаковий непорожній description у HTML/OG/Twitter — попередній загальний опис церкви. CMS body/description оголошення лишаються порожніми; це fallback, не підтверджений текст події чи launch approval. F08/F09 залишаються закритими локально за SEO-3.1.

### Production-build HTML/HTTP та fixtures

На `127.0.0.1:3004` — 54 GET до звичайного `next start`; на `127.0.0.1:3005` — 8 GET до того самого production build з локальною підстановкою лише синтетичних slug-запитів Sanity:

| Вибірка | Кількість | Результат |
|---|---:|---|
| `/news/[slug]` | 5 | 200, власні metadata/social/canonical, фото 1200×630 |
| `/events/[slug]` | 3 | 200, власні metadata/social/canonical, фото 1200×630; неповне оголошення з fallback description |
| `/ministries/[slug]` | 15 | 200, власні metadata/social/canonical, фото 1200×630 |
| `/team/[slug]` | 11 | 200, власні metadata/social/canonical, фото 1200×630 |
| Статичні URL sitemap | 10 | 200, попередні title/description/social/canonical справні |
| `/privacy`, `/studio` | 2 | 200, власні noindex збережені |
| `/seo32-not-found`, `/{news,events,ministries,team}/seo32-not-found` | 5 | 404, meta/header noindex |
| robots, sitemap, fallback JPEG | 3 | 200, header noindex; `Disallow: /`, без Allow; 44 унікальні sitemap URL |
| `/{news,events,ministries,team}/seo32-{empty,rich}-{family}` (синтетичні) | 8 | 200, noindex; порожні summaries/body та Portable Text fallback; фото news/event/ministry відсутні → hero fallback; team photo наявне |

Усього **62 GET = 59 HTML + 3 не-HTML**, усі з header noindex, весь HTML з meta noindex. Для 44 sitemap HTML перевірено одиничні непорожні description/canonical/OG/Twitter, рівність title/description між сторінкою та social, social URL = canonical правильного шляху, спільне image, locale/siteName/card. Для 34 detail додатково перевірено social crop URL і розміри 1200×630. Синтетичні slug не існують у CMS: preload лише повертає fixture-відповіді в локальному процесі; інших запитів/даних не змінює, mutations немає.

**32 ізольовані metadata cases** (по 8 на сімейство) — PASS: власний excerpt/photo, rich text після whitespace excerpt, legacy string, порожній body/description, відсутнє фото → CMS image, порожні CMS defaults → code fallback, відсутні title/name, відсутній документ. Виконано фактичні generateMetadata/helper через TypeScript transpile/VM із підставленим client/settings та справжнім `toPlainText`/image builder; мережі немає. Фото team=null перевірене **лише для metadata**, UI team без фото/нерозв’язані references, JSON-LD і legacy-body UI цим не засвідчені — SEO-5. Окремої нової тестової залежності чи framework немає.

### Перевірки, межі та передача

- `cmd /c "pnpm run build"`, `pnpm run lint`, `pnpm run typecheck`, `pnpm test` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks; три наявні регресії, contact test лише mock HTTP без live email/Redis. Початковий build — sandbox EPERM Sanity config; дозволений повтор успішний. Для loopback сервери/HTTP-клієнти повторено з потрібним доступом після недоступного sandbox-з’єднання. Попередні Node/Browserslist warnings лишилися.
- Тимчасові fixtures/preload/probe/JSON — лише ignored `.next/seo-3.2/`; довготривалий доказ — ця таблиця й опис. Наступна сесія не залежить від цих файлів. Обидва локальні сервери зупинені, порти 3004/3005 без listener. 16 згенерованих synthetic route cache entries видалено після перевірки шляхів; fetch-cache не містить `seo32-`. UTF-8 шести документів, 19 унікальних локальних file links і Markdown anchors, звірка 62 HTTP-рядків та `git diff --check` — PASS.
- [Next.js generateMetadata/merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging) і [Portable Text toPlainText](https://github.com/portabletext/react-portabletext#rendering-plain-text) звірено 2026-10-26; поведінку перевірено на встановлених Next.js 16.1.6 / @portabletext/react 6.2.0. Browser hydration/layout та реальні social scrapers/CDN-фото не перевірялися: UI не змінений.
- Root/header noindex, page-specific robots, Disallow, canonical, ISR 60s, UI/JSON-LD, schema/query/sitemap, package/lockfile збережені. Production env/DNS/settings/live CMS та Google index не змінені/не перевірені. F01/platform protection лишається відкритим; noindex не є контролем доступу. Після QA користувач прямо погодив commit+push SEO-3.2 у `codex/seo-1-audit` 2026-10-26. Свіжий fetch підтвердив HEAD/origin 0/0, Git Credential Manager — `Chekirko`; результат публікації — у git history та фінальному повідомленні. Новий live deployment окремо не перевірений.
- **Наступний юніт — SEO-4.1:** F02/F03, спільний критерій metadata/sitemap за контрактом SEO-2.1, початковий approval-перелік порожній, чесний lastmod; збережені всі pre-launch обмеження. Скіли: seo-audit, karpathy-coder, senior-frontend, senior-fullstack за спільним потоком даних, grill-with-docs/handoff. F05/F06 query/пагінація — SEO-4.2, JSON-LD/null-ref — SEO-5. Редакційні факти та запуск — SEO-L.

## SEO-4.1: спільна готовність metadata/sitemap та lastmod — 2026-10-26

### Реалізація та статус findings

- Старт: чисте дерево `codex/seo-1-audit`, HEAD `895b5b4`; пряме доручення «Роби Наступний крок — SEO-4.1». 7 файлів застосунку, без нових залежностей, CMS-схем/полів, UI чи JSON-LD.
- [Спільний критерій](../../../lib/seo-readiness.ts): один `SEO_APPROVAL` із `launch: null, pages: []`. Майбутній запис запуску — погоджений origin і дата; сторінки — canonical path, дата, для CMS також `documentId` із published `_id`. Критерій вимагає Production (`VERCEL_ENV`) і збігу origin із `SITE_URL`; невідомі/службові/query шляхи, draft/version IDs, небезпечні сегменти не проходять. Перелік відомих статичних маршрутів не є схваленням. Новий slug/_id потребує відповідного схвалення; суттєві зміни фактів — повторної редакційної перевірки власником.
- [Metadata](../../../lib/metadata.ts) споживає той самий критерій; 4 detail generateMetadata передають `_id` уже завантаженого документа. Без схвалення явний `noindex, follow`; `documentId` не потрапляє у вихідний Metadata. Чинні canonical/OG/Twitter/fallback і native 404 збережені. Root noindex та загальний HTTP noindex залишені без змін. Позитивну гілку перевірено лише ізольованими fixtures; реального схвалення не додано.
- [Sitemap](../../../app/sitemap.ts): чинний `defineQuery`, 4 CMS-колекції, тепер із `_id`; fetch явно `perspective: 'published'`. Статичні й CMS URL проходять один критерій, дублікати прибираються, ISR 60s збережено. Наявний схвалений документ автоматично підхоплюється без правки запиту на кожен матеріал; unpublished/видалений не включається. Окремий event-фільтр `defined(startDate)` прибрано з переліку кандидатів для узгодження з чинним detail-запитом: наявність дати не є схваленням, без approval навіть повний документ не включається. Це не виправлення legacy event UI/JSON-LD або редакційної готовності.
- **F02 технічно закрито локально для базових canonical маршрутів:** поточний sitemap містить **0 URL**, а не 44 непогоджені адреси. Це очікуваний результат порожнього launch approval, не збій і не засіб обмеження доступу. Позитивний майбутній відбір підтверджений fixtures; фінальна редакційна/host/launch перевірка лишається SEO-L.
- **F03 закрито локально:** статичні URL не отримують lastmod без надійної дати зміни контенту. CMS URL використовують лише валідний `_updatedAt`; за відсутньої/невалідної дати lastmod пропущений. Немає `new Date()` як часу генерації, дата схвалення теж не використовується як дата редагування.

### Production-build HTTP

58 анонімних GET на `http://127.0.0.1:3004`, без cookies/auth, redirects не слідували. Candidate details знайдені з посилань реальних списків, а не з порожнього sitemap. Canonical origin білда — резервний `https://newlife.church`, не підтвердження власного домену.

| Вибірка | Кількість | Результат |
|---|---|---|
| `/`, about/history/contact, ministries/team/news/events/media/photos | 10 | 200, власні canonical/social URL, meta/header noindex |
| News / events / ministries / team details | 5 / 3 / 15 / 11 | 34 × 200, правильні canonical/social URL, meta/header noindex |
| Privacy / Studio / Studio structure | 3 | 200, чинний noindex; поза sitemap |
| Missing global і по одному slug на кожне сімейство | 5 | 404, meta/header noindex |
| `news?category=test`, `events?page=1`, `media?q=test` | 3 | 200, canonical базового списку як раніше, meta/header noindex; F05/F06 цим не закриті |
| robots / sitemap / fallback JPEG | 3 | 200, header noindex; Disallow `/`; sitemap XML без loc/lastmod |

Всього 55 HTML + 3 не-HTML. Усі 58 відповіді з header noindex, весь HTML з meta noindex. UI/hydration та соціальні scrapers не перевірялися: UI не змінений.

### Ізольовані fixtures та перевірки

**103 перевірки — PASS**, виконано фактичний TypeScript через transpile/VM із підставленими CMS/settings/env, без мережі та CMS mutations. Тимчасовий QA експортує посилання на реєстр лише у VM; вихідний реєстр залишається порожнім. Перевірено:

- Порожній реєстр; сторінка схвалена без запуску; Production проти Preview/development/невідомого середовища; неправильний origin; відсутня дата запуску/схвалення.
- Позитивне схвалення конкретного static/detail; точний `_id`+path; зміна slug або документа; draft/version ID; privacy/studio/unknown/query/malformed path, без небезпечних URL-сегментів. Схвалення списку не схвалює detail.
- Відбір sitemap, дедуплікація, відсутній/видалений/unpublished документ, автоматичне виявлення нового схваленого документа; однакове рішення metadata/sitemap. Чесні CMS-дати, відсутній/невалідний `_updatedAt`, статичні дати пропущені, повторна генерація не змінює timestamps.
- Реальні generateMetadata усіх 4 detail-шаблонів: правильний CMS `_id`, підміна ID → noindex, missing document → чинне успадкування root/native 404. Позитивні fixtures не є дозволом на live launch.

`cmd /c "pnpm run build"`, lint, typecheck й 3 наявні регресії — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks. Початкові Sanity config EPERM і sandbox loopback EACCES/ETIMEDOUT усунено дозволеними повторами; старі Node/Browserslist warnings залишилися. Contact regression використовує mock HTTP, не надсилає email/Redis. QA/probe/JSON лише ignored `.next/seo-4.1/`; довготривалий доказ — цей звіт, наступна сесія від тимчасових файлів не залежить.

[Next.js sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) визначає lastModified як необов’язковий; [Google lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) вимагає правдивої дати суттєвої зміни. [Next.js metadata merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging) і [Sanity published perspective](https://www.sanity.io/docs/content-lake/perspectives) звірено 2026-10-26 із поведінкою встановленої версії Next.js 16.1.6.

### Межі та наступний юніт

Root/header noindex, privacy/studio robots і Disallow збережено. Env/DNS/platform settings/live CMS, schema, UI/JSON-LD, package/lockfile не змінені; deployment і Google index не перевірені. F01/platform protection відкритий. Перед SEO-L разом перевірити root/header/page-specific правила, canonical host/redirects, схвалені списки та їхні видимі матеріали; самого заповнення реєстру недостатньо для запуску. Metadata реальних filter/page запитів зараз отримує базовий path: їхній окремий відбір/нормалізацію ще не реалізовано.

**Наступний SEO-4.2 — F05/F06:** валідація page, нормалізація query та canonical, коректні redirect/404, noindex search/filter і готовність видимої порції пагінації за контрактом SEO-2.1. Зберегти всі pre-launch обмеження; JSON-LD/null-ref — SEO-5. Скіли: seo-audit, karpathy-coder, senior-frontend, security-guidance для user input; grill-with-docs/handoff для контексту. Commit/push SEO-4.1 ще не виконано — гейт `context/ai-workflow-rules.md` §3.

Завершальна перевірка: фінальний build і повторні 58 GET — PASS; 7 UTF-8 документів, 26 локальних file/anchor targets та `git diff --check` — PASS. Production-сервер зупинено, порт 3004 без listener. Build очищає тимчасові fixtures у `.next`; їхня наявність не є умовою продовження, результати збережено вище. Diff: 7 файлів застосунку й 7 документів; `app/layout.tsx`, robots/next.config, schema/TypeGen output, package/lockfile без змін.

Після локального QA користувач прямо погодив commit+push SEO-4.1 у `codex/seo-1-audit` 2026-10-26. Згадки про непогоджений commit вище описують попередній локальний стан. Свіжий fetch: HEAD/origin 0/0, Git Credential Manager — `Chekirko`; результат публікації — у git history та фінальному повідомленні. Merge, Production settings, env/DNS/CMS не змінюються; новий live deployment окремо не перевірений.

## SEO-4.2: query, пагінація та canonical — 2026-10-26

### Результат F05/F06

Старт — чисте дерево `codex/seo-1-audit`, HEAD `ee4f15e`; пряме доручення «Роби Наступний крок — SEO-4.2». 7 файлів застосунку + нова регресія, без залежностей, нових маршрутів або CMS-полів.

- [Нормалізація](../../../lib/listing-params.ts) працює перед fetch у page та generateMetadata news/events/media. Нечисловий/нецілий/повторений/≤0/небезпечний page → 307 на базовий список із валідними скалярними filters. Page=1 видаляється; `002` → `2`; whitespace/empty scalar filter нормалізується, повторений filter відкидається з 307. Redirect збирається через URLSearchParams на фіксованому локальному path. Media має «Завантажити ще», тому її `page` видаляється зі збереженням filter. Невідомі tracking-параметри не йдуть у canonical або GROQ, самі по собі не запускають redirect.
- News/events спочатку читають count: коректний N поза діапазоном → 404/noindex без довільного slice; порожня порція N≥2 також → 404. Порожній базовий список → 200/noindex. `LISTING_PER_PAGE=6` спільний; page-local React cache зі скалярними аргументами узгоджує порцію metadata/UI. NaN та небезпечні endpoints не надходять у GROQ.
- Непорожня пагінація без filter має власний canonical і OG URL `/news?page=N` / `/events?page=N`; filter/search завжди noindex з базовим canonical. Наявні crawlable pagination links і дизайн збережені.
- [Готовність](../../../lib/seo-readiness.ts) `isListingIndexable()` перевіряє launch і схвалення базового списку та кожного `_id`+slug видимої непорожньої порції news/events. [Metadata](../../../lib/metadata.ts) приймає `listingItems` лише на вході. [Sitemap](../../../app/sitemap.ts) застосовує той самий критерій для першої порції, включає для перевірки документи без slug, повторює порядок і умову наявного startDate для events. Порожній `/media` також не indexable й не в sitemap. У початковому sitemap немає query URL; `isPageIndexable()` їх далі відкидає.

**F05/F06 технічно закриті локально.** Approval лишається `{ launch: null, pages: [] }`, sitemap — 0 URL. Схвалення нової видимої порції не виводиться зі схвалення першої; зміна порядку/складу матеріалів автоматично перераховує готовність під час наступного рендера/ISR.

### Production HTTP та ізольована регресія

Фінальний `next start` на `127.0.0.1:3004`, Next.js 16.1.6: **154 анонімні GET — 67×200, 68×307, 19×404, жодного 500**. Усі 154 мають header noindex; усі 83 HTML-відповіді 200/404 — meta noindex. Серед 200 є 3 не-HTML ресурси.

| Вибірка | GET | Результат |
|---|---:|---|
| News/events/media: базові URL, invalid/повторені/небезпечні page/filter, leading zeros, out-of-range, tracking, search/filter; кожен зі звичайним UA та `facebookexternalhit/1.1` | 100 | 307 із правильним Location, 404 для коректних out-of-range, 200 із базовим canonical для filter/search/tracking; жодного NaN/GROQ error |
| Усі поточні details: 5 news / 3 event / 15 ministry / 11 team | 34 | 200, власний canonical, noindex |
| Інші базові/службові URL, включно з privacy і вкладеним Studio tool | 10 | 200, чинні canonical/noindex збережені |
| Наявна категорія news та `media?category=проповідь` | 2 | 200, базовий canonical, noindex |
| Відсутні details чотирьох families і невідомий маршрут | 5 | 404/noindex |
| robots.txt / sitemap.xml / fallback JPEG | 3 | 200/header noindex; Disallow: /, sitemap 0 URL |

[Регресія](../../../scripts/check-listing-seo.mjs): `cmd /c "pnpm exec node scripts/check-listing-seo.mjs"` — PASS. Реальні TypeScript helper/metadata/page/sitemap завантажуються через transpile/VM з target ES2022; mocked navigation/CMS, нуль мережевих запитів і CMS writes. Синтетичні 7 news/events перевіряють другу непорожню порцію, її власні canonical/OG URL, SSR сьомої картки без першої та реальні pagination links на базову сторінку. Окремо: порожня база/порція, count до slice, максимальне безпечне число, filters/повторення/Unicode encoding, поточний порожній register, схвалення списку/кожного видимого документа, missing slug, sitemap↔metadata узгодженість, event без startDate та порожній media. Позитивне approval існує лише в пам’яті fixture.

У поточній CMS досі немає другої непорожньої сторінки news/events: її canonical/SSR перевірено синтетично, а HTTP `page=2` закономірно дає 404. Browser hydration/інтерактивні Server Actions та live deployment не перевірялись; UI-компоненти/стилі/Actions не змінювались. Повний JSON-LD/null-ref аудит — SEO-5.

`cmd /c "pnpm run build"`, lint, typecheck та 3 наявні регресії — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks. Перший sandbox build зупинився на Sanity config EPERM; повтор із потрібним доступом і фінальний build успішні. Старі Node/localStorage/Browserslist warnings лишаються. Тимчасовий HTTP-runner/лог/JSON — ignored `.next/seo-4.2/`; довготривалий доказ — ця матриця та tracked regression.

[Google про canonical пагінації й filters](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [Next.js generateMetadata/searchParams/cache](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) і [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) звірено 2026-10-26; фактичні status і HTML засвідчені на встановленій Next.js 16.1.6.

Root/header noindex, privacy/studio robots і Disallow збережено. CMS/schema/production env/DNS/platform settings, JSON-LD та дизайн не змінені; generated types лише оновлені штатним TypeGen і ignored. F01/platform protection відкритий, launch не погоджено. Commit/push SEO-4.2 не виконано — гейт [ai-workflow-rules.md §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Наступний **SEO-5** — F04, наявні JSON-LD/null-ref та відповідність видимим фактам; schema-markup, karpathy-coder, решта скілів за фактичним scope.

Завершальні перевірки: 6 UTF-8 документів, 55 локальних file/anchor targets і `git diff --check` — PASS. Сервер зупинено, порт 3004 без listener. Фінальний diff: 7 файлів застосунку + 1 regression + 6 документів; root layout/robots/next.config/schema sources/package/lockfile без змін.

### Погоджена публікація SEO-4.2

Перед комітом повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks; старі Node/Browserslist warnings. SEO-регресія повторно PASS, UTF-8 6 документів — PASS. Lint/typecheck/3 наявні регресії та 154 GET уже пройшли на цьому коді; staged diff перевіряється перед комітом.

Після локального QA користувач прямо погодив commit+push SEO-4.2 у `codex/seo-1-audit` 2026-10-26, відповівши «Так». Попередні згадки про непогоджену публікацію — стан до цієї відповіді. Свіжий fetch підтвердив HEAD/origin 0/0, Git Credential Manager — `Chekirko`; публікація охоплює 7 файлів застосунку, 1 regression і 6 документів. Точний SHA, remote SHA й чистота дерева перевіряються після push і наводяться у фінальному повідомленні. Merge, Production settings/env/DNS/CMS не змінюються; новий live deployment не засвідчений. Наступний юніт — SEO-5.

## SEO-5: JSON-LD і null-посилання — 2026-10-26

### Реалізація та межі

Старт — чистий `codex/seo-1-audit`, HEAD `124687d`; пряме доручення «Робимо Наступний крок — SEO-5». Два пов’язані юніти: F04/неповні detail-дані та чинні JSON-LD шаблони. 9 файлів застосунку + [tracked regression](../../../scripts/check-jsonld-seo.mjs), без нових залежностей, CMS-схем, полів або mutations.

- **F04 закритий локально:** [ministry detail](../../../app/(front)/ministries/[slug]/page.tsx) відкидає null та refs без name/slug до підрахунку 0/1/2+ відповідальних. Фото кожної особи має guard; тип масиву моделює null-елементи. Team detail без фото має чинний декоративний placeholder і не викликає image builder; валідні фото/UI зберігаються.
- **NewsArticle:** URL/ID і breadcrumb використовують route slug; description — видимий body або той самий fallback, підтримано legacy string. Дата публікації — лише валідний ISO; некоректна дата не показується й не потрапляє в JSON. Прибрано припущення author=publisher та dateModified=`_updatedAt`: visible byline/редакційної дати немає. Publisher лишається сайтом церкви зі спільним `#church`.
- **Event:** лише `подія` з назвою, валідною датою та видимим location. Оголошення/неповна подія не створюють Event; недійсна дата не дає NaN у detail UI. Location бере саме текст матеріалу, без автоматичного church NAP. Scheduled/organizer прибрані без підтверджених полів; description збігається з видимим body/fallback, URL/ID стабільні. «Головний зал» не перетворюється на вигадану повну адресу.
- **Person / Church:** `memberOf` замість непідтвердженого employment-твердження worksFor; назва церкви із `getSiteSettings()`, єдиний `#church`, власні URL/ID. Homepage та сама сутність має сумісні типи `Church` + `Organization`: Church належить до Place, юридичні/контактні поля підтримує Organization. AboutPage/WebSite refs узгоджені. FAQ JSON-LD вже використовує ті самі FAQ, що UI; переписування не потрібне. Розклад/гео/соцмережі походять із чинного settings helper; за поточної CMS `openingHours` порожній, непорожню гілку HTTP-вибірка не засвідчує.
- **VideoObject:** JSON-LD у [MediaGallery](../../../app/(front)/media/components/MediaGallery.tsx) SSR-рендериться з тих самих cards і слідує state після search/filter/load-more; порожня вибірка прибирає script. Лише playable items, послідовні position, однакові name/thumbnail/description. YouTube watch — `url`, player — `embedUrl`; `contentUrl` прибрано, бо це не прямий файл. `uploadDate` прибрано: наявна date описує матеріал/служіння і не доводить дату завантаження. Нових полів про запас немає.
- **Серіалізація:** всі insertions зберігають `jsonLdHtml()`; round-trip hostile `</script>`, quotes, ampersand та Unicode PASS. [schemaDate](../../../lib/utils.ts) зберігає справжню ISO дату/дату-час із timezone, відкидає missing/non-ISO/неможливий день; не підставляє «зараз».

### Перевірки

Фінальні **57 production-build GET** через `next start`, 127.0.0.1:3004: **51×200 / 6×404**. Усі 57 мають `X-Robots-Tag: noindex`, усі 54 HTML-відповіді — meta noindex. 46 базових HTML: 12 статичних/службових і 34 detail (15 ministry / 11 team / 5 news / 3 events). Додатково 5 missing URL → 404, `/events?page=2` → 404, news category/media q → 200, robots/sitemap/чинний fallback JPEG → 200. Robots зберігає Disallow, sitemap — 0 URL.

JSON.parse всіх знайдених blocks успішний; абсолютні URL/ID перевірені. У реальній вибірці 11 Person, 5 NewsArticle, 1 Event, 12 вкладених VideoObject, 22 BreadcrumbList, Church/Organization + WebSite, FAQPage (5 Q&A), AboutPage. NewsArticle без author/dateModified, VideoObject без contentUrl/uploadDate, Event без Scheduled/church-address. Усі 34 реальні detail лишаються 200. Повний query-регресійний HTTP scope SEO-4.2 не повторювався: збережена його tracked regression.

`pnpm exec node scripts/check-jsonld-seo.mjs` — **PASS**: 22 detail renders, 4 missing docs, 2 media SSR, 4 gallery states (initial/filter/append/empty), ISO dates і безпечне escaping. Виконуються справжні сторінки/MediaGallery/helpers через transpile/VM і React SSR із synthetic CMS та mocked state/actions, без мережі. Перевірено null/empty/mixed 0/1/2+ leaders, missing slug/name/photo, team photo null, rich/legacy/fallback body, оголошення й неповні події, invalid/missing dates, hostile text. Це перевірка реальних handlers і результату state, **не browser hydration/React scheduler або live Server Actions**.

Build, lint, typecheck, 3 наявні регресії та `scripts/check-listing-seo.mjs` — **PASS**: 21 schema type / 34 GROQ queries, 42/42 static-generation tasks. Sanity config EPERM та sandbox loopback EACCES/ETIMEDOUT усунені дозволеним build/QA-server/GET поза sandbox; application/network protections не послаблювались. Старі Node/localStorage/Browserslist warnings лишаються. HTTP-runner, HTML/JSON і synthetic outputs — ignored `.next/seo-5/`; довготривалі докази тут, наступна сесія не залежить від цих файлів.

**Зовнішня валідація:** Schema.org Validator, code mode, synthetic outputs справжніх шаблонів Person/Event/NewsArticle/BreadcrumbList/ItemList→VideoObject: **5 root elements, 0 errors / 0 warnings**. Живий CMS-контент до валідатора не передавався. Google Rich Results Test прийняв code, але повернув «Увійдіть в обліковий запис і повторіть спробу»; перевірка **не завершена**, eligibility не засвідчена. Локальний skill `schema_validator.py` запущено з `python -X utf8` (без цього Windows cp1251 error): JSON розпізнаний, breadcrumb 100; synthetic incomplete article отримує 40/100 через stale required image/author/date. Це евристика, не нормативний verdict: актуальна Google Article doc не має required properties. Вигадане авторство заради бала не додається.

### Офіційні джерела та відкладені факти

Звірено 2026-10-26: [Google Article — applicable recommended properties](https://developers.google.com/search/docs/appearance/structured-data/article), [VideoObject — contentUrl означає bytes, uploadDate дату завантаження](https://developers.google.com/search/docs/appearance/structured-data/video), [Event — назва/час/реальне місце](https://developers.google.com/search/docs/appearance/structured-data/event), [Schema.org Church — Place hierarchy](https://schema.org/Church). Валідність Schema.org не обіцяє rich results; missing video uploadDate та повна event address залишаються контентними обмеженнями.

До SEO-L власник підтверджує NAP/legalName/geo/соцмережі та їхні fallback, справжній розклад і його endTime, FAQ/свідчення/біографії/ролі, дати матеріалів та авторство. Event потребує точної адреси/статусу/організатора за кожною подією; video — справжньої uploadDate, назв/описів і готовності watch experience. У цій сесії відсутні факти пропущені або записані як залежності, а не вигадані. Історія й readiness approval лишаються непогодженими.

Pre-launch root/header/page noindex, Disallow та порожній approval збережені. Schema/GROQ sources, package/lockfile, CMS/env/DNS/platform settings не змінені; TypeGen лише штатний ignored output. Live deployment/Search Console/Google index та mobile/desktop layout не перевірені: in-app browser localhost timeout, HTTP через локальний процес успішний. F01 лишається відкритим. Commit/push SEO-5 не виконано — [проєктний гейт §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

## SEO-7 — 2026-10-27

**Результат:** один підтверджений F12 — неефективна доставка фонових фото головної — оптимізовано локально. Mobile LCP головної зменшився на 27,4%, desktop на 26,9%; hero transfer bytes −33,3%, усього mobile −11,0%. Повний performance backlog не закрито: mobile оцінка 66 і LCP 6,87 с залишаються нижче цілі D2. Поліпшення Google ranking/польових CWV не вимірювалося.

### Метод і відтворення

Старт — чистий `2c55238`, `codex/seo-1-audit`. Production `pnpm run build` → `pnpm run start --port 3004`. [Runner](../../../scripts/measure-seo-performance.mjs): pinned Lighthouse **13.5.0**, Chrome **155.0.0.0**, Windows, Node 26.2.0; окремий headless Chrome без користувацького профілю для кожного запуску, storage reset увімкнений. По 3 послідовні samples до/після для чотирьох mobile маршрутів та головної desktop — **30 фінальних зіставних запусків**. Первинний baseline виконаний до зміни Hero; фінальна серія — `after-final`. Проміжні діагностичні запуски не підмішувалися до цих серій. Версії, UA і settings усіх пар звірені програмно; SHA-256 raw reports та фінального Hero/runner збережені в [метриках](performance-2026-10-27.json).

- Mobile: 412×823, DPR 1,75; simulated RTT 150ms, 1638,4Kbps, CPU ×4.
- Desktop: 1350×940, DPR 1; simulated RTT 40ms, 10240Kbps, CPU ×1.
- Перед case runner прогріває HTML та image optimizer за HTML `src`; це не гарантує прогріву всіх srcset/format variants. Профіль браузера холодний; сервер/OS/CDN не скидаються. ISR 60s і живий read-only Sanity/CDN лишаються зовнішніми змінними. На Windows не ізольовані всі фонові процеси; три samples показують розкид, не довірчий інтервал. Локальні server latency й cache не моделюють Vercel cold starts.
- Для свіжої серії потрібен новий label: наявний label відновлює попередні samples. Для baseline використовувати production checkout `2c55238` і цей самий runner з фінальної версії; CWD runner — каталог відповідної збірки. Зупиняти попередній сервер перед новим build; не запускати build/інші Lighthouse серії одночасно з вимірюванням.

```text
cmd /c "pnpm run build"
cmd /c "pnpm run start --port 3004"
cmd /c "pnpm exec node scripts/measure-seo-performance.mjs before-repeat"
# Після переходу на фінальну версію, нового build і restart:
cmd /c "pnpm exec node scripts/measure-seo-performance.mjs after-repeat"
```

Усі значення нижче — незалежні медіани трьох samples, **до → після**, з однаковими профілями. FCP/Speed Index/всі samples доступні в JSON; TBT не є INP.

| Маршрут / profile | Performance | LCP, с | TBT, ms | CLS | Transfer, МБ (decimal) |
|---|---|---|---|---|---|
| `/` mobile | 61 → 66 | 9,466 → 6,873 | 247 → 140 | 0,00157 → 0,00157 | 1,978 → 1,760 |
| `/news` mobile | 68 → 70 | 5,597 → 5,903 | 248 → 131 | 0 → 0 | 1,044 → 1,044 |
| `/media` mobile | 70 → 71 | 6,031 → 5,916 | 150 → 114 | 0 → 0 | 1,028 → 1,028 |
| `/media/photos` mobile | 74 → 73 | 5,154 → 5,152 | 125 → 157 | 0 → 0 | 18,380 → 26,894 |
| `/` desktop | 92 → 96 | 1,793 → 1,311 | 28 → 14 | 0,00062 → 0,00062 | 2,077 → 1,859 |

Головна mobile: LCP samples до 7,911/9,512/9,466 с, після 6,890/5,823/6,873 с. FCP майже не змінився: 3,839 → 3,798 с. На контрольних маршрутах немає змін відповідних UI-шаблонів; їхні коливання не приписуються оптимізації головної. `/media/photos` shuffle змінює першу добірку при ISR: transfer ranges до 14,64–29,80 МБ / після 14,51–26,90 МБ; різницю медіан не називати доведеною регресією або покращенням. У `/media` зафіксовано чинні YouTube maxres 404 з fallback; вони не виправлялися в SEO-7.

### F12: доставка hero-фото

| Проблема | Доказ | Вплив | Виправлення | Пріоритет / статус |
|---|---|---|---|---|
| Homepage hero використовував CSS backgrounds без responsive optimizer/preload/high hint | Усі 3 фото 1920×1080 запитувались із Sanity одразу, разом 657 044 bytes; LCP — перший фон, `priorityHinted=false`. Baseline mobile LCP median 9,466 с | Повільний великий видимий блок; зайві bytes і конкуренція з прихованими фото | `HeroSlider`: декоративний Next Image fill, один initial preload + high priority, cover-aware sizes; два інші фото отримали Low priority в final trace | P2 / локально закрито в межах доставки hero; решта D2 окремо |

Ті самі три джерела в before/after звірені через network requests. Після — **438 359 bytes**, WebP; 3/3 HTTP 200. У всіх трьох фінальних mobile reports `priorityHinted`, `requestDiscoverable`, `eagerlyLoaded` = true. Інші фото можуть завантажуватися в межах viewport lazy threshold; це не реалізація відкладеного монтажу слайдів.

Кадрування лишилось `cover/center`, scrim/тексти/висоти/opacity transition/керування збережені. Для 16:9 фото та поточних 500/750px висот `sizes` враховує мінімум 889/1334 CSS px плюс viewport: проста ширина `100vw` давала розмитий кроп на вузькому екрані. Увесь високий пріоритет закріплений за індексом 0, не переноситься при перемиканні. Якість full-resolution фото новин/служінь/галерей і `q=100` не змінювалися. [Next Image API](https://nextjs.org/docs/app/api-reference/components/image) звірено зі встановленою 16.1.6 та реальним SSR; причина використання медіан і обмежень — [варіативність Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

### Служіння зі скриншота користувача

Користувач додав screenshot Vercel `/ministries/nove-sluzhinnya`: Performance 67 / Accessibility 96 / Best Practices 73 / SEO 69. Відомі лише ці числа й маршрут; deployment SHA, settings і повного звіту немає. Це не baseline для локальної зміни головної.

Окремий локальний full-category Lighthouse run: **61 / 96 / 100 / 69**, transfer **34 412 116 bytes**. Він має CPU calibration warning (benchmarkIndex 708,5), тому simulated LCP 29,6 с / performance 61 не трактуються як повторювана медіана чи live-регресія. Це діагностика поза 30-run comparison, зі збереженим warning у JSON.

- **Performance / D9:** п'ять найбільших запитів — оригінали `q=100`, приблизно 12,98 / 7,61 / 5,93 / 5,04 / 2,02 МБ. DOM і код підтвердили main photo та gallery без Next optimizer. Обсяг стосується запитів, захоплених цим Lighthouse run; він не означає, що кожен користувач одразу завантажує всі lazy фото. Оптимізація головної цей шаблон не змінює. Погоджену якість не знижено.
- **Accessibility / D8:** єдиний failed scored audit — `color-contrast`: «Відповідальний за служіння», `text-gray-500` на `bg-gray-50`, **4,46:1 < 4,5:1**. Foreground `#6f757a`, background `#f9fafb`; DOM + незалежний contrast checker підтвердили. Це доданий конкретний залишок D8, не виправлений у SEO-7. 96 не є повним WCAG PASS.
- **SEO:** єдиний failed audit — `is-crawlable`: meta noindex, `X-Robots-Tag: noindex`, robots Disallow. Це чинний pre-launch захист; піднімати бал відкриттям crawling не дозволено. Інші технічні checks цього run пройшли, редакційна готовність не засвідчена.
- **Best Practices:** усі scored audits пройшли (100), failed requests/console errors у цьому run немає. Причина 73 на Vercel локально не встановлена; потрібен його повний звіт, щоб її діагностувати. Нового live-виправлення не заявляємо.

### Перевірка та межі

Production build PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; старі Node/Browserslist warnings. Initial sandbox Sanity-config EPERM усунено дозволеним повтором; це не помилка застосунку. Heading regression використовує справжній Next Image: string/StaticImageData, 0/1/many, один preload, high hint на першому img/link, один активний H1, inert, CTA guards, manual transitions, pause/focus/hover/reduced-motion timer gates. Browser доповнює VM scheduler checks.

57/57 exact typography/geometry comparisons 19 hero текстів/посилань/кнопок на 1280/390/320px після font load; hero 750/500px, без horizontal overflow. Скріншоти до/після оглянуто, невдалий вузький `100vw` варіант замінено на cover-aware sizes до фінальної серії. На 320px Enter/Space next/prev/dots/pause/play, один активний H1, два inert slides, видимий focus, 3 завантажені декоративні фото перевірені; console errors 0. Після останньої high-hint зміни повторно підтверджено layout/DOM/preload на всіх трьох ширинах; окреме ministry DOM inspection також без console errors. Це вузьке QA, не повний D8.

13 GET: 7 HTML ×200 + 1 HTML ×404, robots/sitemap ×200, 3 hero WebP ×200. У всіх 8 HTML один H1 і meta/header noindex; robots Disallow, sitemap без URL, approval порожній. Заголовки/footer/metadata/JSON-LD/контентні дані не переписувалися. Static a11y scanner Hero зберігає 4 component-level warnings про dynamic H1/layout landmarks — вони не є новими порушеннями; реальна сторінка має H1/main/skip-link, nav landmark лишається попереднім D8. Фінальні lint, tsc, три штатні та три SEO-регресії — PASS. UTF-8 10 файлів / 69 унікальних локальних file+anchor targets / 31 raw report hash + 2 source hashes — PASS; diff-check та Diff Surgeon application/regression diff — CLEAN. Утиліту вимірювань переглянуто вручну: фіксовані localhost routes, валідований label, послідовні runs, без CMS mutations/секретів/змін package dependencies.

Raw reports/HTML/traces/devtools logs/HTTP QA — ignored `node_modules/.cache/seo-7/`; компактний tracked JSON містить samples/settings/report hashes/asset evidence і окремий ministry diagnostic. Один файл застосунку, дві CLI/регресійні утиліти та документація; CMS/schema/GROQ/env/settings/package/lockfile не змінено. QA-сервер зупинено, порт 3004 без listener; viewport скинуто, тимчасові вкладки закрито. Індексація закрита; live deployment/польові CWV/Google index не засвідчені. Commit/push потребують окремої згоди за workflow §3.

### Наступні дії

1. **D9:** окремий юніт доставки важких оригіналів служіння/галерей. Спершу зафіксувати повторюваний viewport/набір фото й узгодити стратегію, що збереже затверджену full-resolution/q=100 якість; не знижувати її заради бала.
2. **D2:** профілювати render-blocking CSS/Font Awesome/шрифти; FCP головної близько 3,8 с, mobile LCP усе ще повільний. Поле CWV/INP потребує реальних даних після окремо погодженого deployment.
3. **D8:** label contrast 4,46:1 та попередні FAQ/nav/breadcrumbs/sidebar/focus/#418 follow-ups. Оцінка 96 не закриває ручні перевірки.
4. **F01 / SEO-L:** platform protection, редакційні факти, домен і Search Console; відкриття індексації лише за окремим фінальним рішенням. Токен, засвічений у попередній сесії, має ротувати власник.

## SEO-6 final — 2026-10-26

**Публікація прямо погоджена 2026-10-27:** користувач відповів «Так» після підсумкового QA; погоджено commit + push 5 файлів застосунку, 1 CMS-скрипта та 6 документів у `codex/seo-1-audit`. Свіжий fetch HEAD/origin 0/0, Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду описують попередній стан. Результат — у git history та фінальному повідомленні; live deployment окремо не засвідчений.

Перед публікацією повторний build — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; старі Node/Browserslist warnings. Review 12 файлів, UTF-8 / 66 унікальних локальних file+anchor targets і staged diff-check PASS; застосунок і попередній QA не розширені.

**Результат:** F11/SEO-6 технічно закрито в локальному production build після виправлення всього підтвердженого залишку. Пряме доручення користувача «Завершити SEO-6 — все роби в цій сесії» розширило попередній ліміт сесії. Старт із чистого `a2963eb`, гілка `codex/seo-1-audit`; попередні SEO-6.1–6.10 збережені в git. Скіли seo-audit, a11y-audit, senior-frontend, karpathy-coder, grill-with-docs; env-secrets-manager для безпечної діагностики CLI.

### Виправлення

| Проблема / вплив | Доказ | Виправлення / пріоритет |
|---|---|---|
| Contact H5 пропускав рівні; допоміжні секції також H5 | Повна сторінка має PageHero H1 та основний H2 | ContactInfoCard → H3; незалежні «Молитовна підтримка»/«Загальні питання» → H2 із `text-h5`. Форма й дані без змін. P2, виправлено |
| Media cards/empty та photo empty починалися H3 після H1 | Production DOM та 0/1/13 SSR fixtures | H2 зі збереженими класами/поведінкою. P2, виправлено |
| Published event body починався H4 після H1 | `den-batka-2026`, block `_key=a1709dcd9a33`, «Запрошуємо на День батька!» | Лише `style` H4 → H2 через [скрипт](https://github.com/Chekirko/newlife2/blob/23ecb66b06f67dd70b5bcef607e14079667e671d/scripts/fix-event-heading.mjs), dry-run → revision-guarded write → read-only idempotency PASS. P2, виправлено |

П’ять файлів застосунку, сім замінених рядків; окремий відтворюваний CMS-скрипт. Для CMS H2 використано чинний PortableTextBody H2: більший розмір/відступ відповідає новому рангу; спільний renderer не змінювався. Скрипт перевіряє id/slug/key/text, відсутність draft, початковий rank і ревізію; перед write зберігає локальний backup, після write звіряє всі поля, крім `_rev`/`_updatedAt`. Повторний запуск не записує даних. Інші CMS-дані, schema, queries, package/lockfile/env/platform settings не змінювалися.

Рівні звірено з [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/): ранг відповідає структурі; CSS окремо визначає вигляд.

### Перевірки

- `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks; старі Node/Browserslist warnings. Перший sandbox-запуск мав службовий Sanity-config EPERM, дозволений повтор поза sandbox пройшов. Lint, Next typegen + повний tsc, 3 штатні та 3 SEO-регресії PASS.
- **9 before/after SSR fixtures:** contact із 0/1/2 services та undefined/null/image hero; media/photos 0/1/13, optional speaker/tags/description та довга назва. Після нормалізації лише heading tags і очікуваного `text-h5` решта HTML точно збігається з HEAD. ContactForm рендериться реальним компонентом із mocked action; production keyboard/native validation перевірені окремо.
- **Fresh crawl: 50 HTML = 45 pathname + 5 query URL**, усі 34 published details (5 news / 3 events / 15 ministries / 11 team), 202 текстові CMS blocks (196 normal / 5 blockquote / 1 H2). 57 первинних GET + 3 додаткові controls = **60 GET: 54×200 / 6×404**. Усі 52 успішні HTML мають один H1; жодного порожнього heading, skip, битої внутрішньої HTML-цілі або fragment. 51/51 fragment targets валідні. Усі 50 HTML також пройшли a11y scanner без heading findings; інші regex-евристики не трактуються як повний WCAG аудит.
- Header/meta noindex, `Disallow: /`, sitemap без URL та порожній approval збережено. Filtered news/media — 200 з H2 empty-state; events page 2 і п’ять missing controls — 404. CMS H2 підтверджено API, HTTP та browser DOM.
- **Browser 1280/390/320px:** 75/75 exact computed typography/size comparisons після font load для всіх main headings contact/media/media empty та photo empty fixture. Photos і CMS event на всіх трьох ширинах також без overflow, один H1. Desktop/mobile screenshots оглянуто; console errors — 0, попередній #418 у цьому QA не відтворився.
- Contact Tab/Shift+Tab, видимий focus, empty submit зупинено native validation на `contact-name`; листи не надсилалися. Video Enter/Space → lightbox, Escape → початкова картка з видимим focus. Media append 12 → 24 та реальний empty search підтверджені. Photo Enter/ArrowRight (1 → 2)/Escape/focus restore/Tab/Shift+Tab PASS.

**Межі:** повний D8 не закрито. До попередніх FAQ disclosure/nav landmark/breadcrumbs contrast/sidebar order/#418/history summary focus додано фактично спостережену наявну втрату фокусу до body після disabled media load-more button. Ці взаємодії не змінювалися в цьому юніті. Server log має upstream YouTube `maxresdefault.jpg` 404; у компоненті вже є `sddefault` fallback, його код не змінено. Це не биті внутрішні HTML-цілі; повний аудит зовнішніх assets не проводився. Технічний PASS не засвідчує редакційну готовність, live deployment або Google index. QA-артефакти та CMS backup — ignored `node_modules/.cache/seo-6-final/`.

Фінальний review п’яти файлів застосунку — 7 замінених рядків; Diff Surgeon застосунку CLEAN, 0 noise. UTF-8 12 змінених/нових файлів, 6 документів / 66 унікальних file+anchor targets і `git diff --check` PASS. Changed-file secret scan позначив лише env-reference до SANITY_API_WRITE_TOKEN як generic assignment (перевірений false positive); фактичних env secret values у tracked результаті немає. Сирий початковий network error вивів credential у технічний журнал; діагностику CLI санітизовано, власнику повідомлено про потрібну ротацію. Env/permissions не змінювалися. Обидва QA-сервери зупинено, viewport скинуто й робочу вкладку закрито.

### Наступні дії

1. SEO-7: production performance baseline і лише виміряні виправлення.
2. Повний D8 та F01 лишаються відкритими; SEO-L — редакційна готовність/домен/Search Console/окреме рішення про індексацію.
3. Commit/push цього завершеного результату — лише за окремою згодою workflow §3; у цій сесії ще не виконано.

## SEO-6.10: заголовки хронології та CTA історії — 2026-10-26

**Commit + push прямо погоджені 2026-10-26:** користувач відповів «так» після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit` за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижча згадка про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-6.11. Live deployment окремо не засвідчений.

**Локально завершено.** Старт із чистого `3dcdd83` (`codex/seo-1-audit`), SEO-6.9 уже в HEAD. У [history page](../../../app/(front)/history/page.tsx) замінено лише два рядки тегів. Скіли seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs для синхронізації контексту. Архітектура, залежності, CMS і контент без змін.

| Проблема / пріоритет | Доказ і вплив | Виправлення |
|---|---|---|
| Timeline H4 без проміжного H3 / P2 | Після H1 PageHero та H2 «Наш шлях» чотири назви етапів починалися H4; пропущений рівень у навігації заголовками | TimelineCard title — H3. Чинні `text-xl md:text-2xl font-bold mb-3 text-gray-800 clear-none` збережено |
| Незалежний CTA H4 / P2 | «Додайте свою історію до нашого шляху!» — окрема секція після хронології, а не підсекція останньої картки | CTA — H2, чинні `text-2xl font-bold mb-6` збережено |

Ранги відповідають вкладеності за [W3C WAI Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/): H3 для підсекцій H2, повернення до H2 для нової секції. Фактичний main: **H1 → H2 → H3 ×4 → H2**; сталі H2 футера збережені. Це виправлення семантики, не доказ зміни позицій у пошуку.

**SSR:** 14 before/after cases виконують реальний page/TimelineCard через TypeScript transpile/VM і React SSR з ізольованими dependency mocks. Три full-page cases — hero undefined/null/present; 11 карток — 4 фактичні типи, missing/empty list/accordions, missing image/videoId, text із довгою назвою. Після нормалізації лише heading tags решта HTML точно збігається з HEAD. Optional branches, CTA href та один H1/два H2/чотири H3 у повній сторінці — PASS. QA-експорти додані лише до VM-source, не до застосунку; CMS writes відсутні.

**Production HTTP:** 6 GET = history, обидва distinct main internal targets (`/`, `/contact`), відсутня `/history/seo-6-missing`, robots і sitemap: 5×200/1×404. Один H1, повна ієрархія main, meta/header noindex, `Disallow: /` і sitemap без URL — PASS. Сторонній Vimeo не є внутрішньою ціллю й його playback не перевірявся.

**Browser:** 1280×900, 390×844 і 320×900; фактичний innerWidth підтверджено, overflow відсутній. Для before/after віддавався той самий production HTML із перевіреними baseline тегами, без scripts; CSS/шрифти/layout повної сторінки збережені. Після `document.fonts.ready` typography (family/size/weight/line-height/letter-spacing/color/margins) та width/height усіх 7 main headings точно збігаються: 21/21 comparisons. Keyboard перевірений окремо на повній hydrated production-сторінці: Enter/Space розкривають native details; Tab/Shift+Tab проходять summary → summary → CTA; CTA має видимий outline й Enter веде на contact. Фото Enter → dialog, Escape → trigger із видимим focus. Desktop/mobile screenshots оглянуто; console errors у перевірених flows — 0, hydration #418 не відтворився.

**Відкритий D8:** наявний `outline-none` у timeline summary приховує focus (computed outline style `none`; на screenshot індикатора немає), хоча Enter/Space працюють і expanded answers доступні в AX tree. Клас уже є в HEAD, SSR підтверджує незмінність. Виправлення focus — окремий D8 scope; не заявляти повний keyboard/a11y PASS. Зміст історії (1992 проти непідтвердженої хронології, placeholder Vimeo) лишається редакційною залежністю SEO-L.

**Інструменти:** a11y scanner на baseline/current HTML прибрав `heading-skipped`; решта 6 regex warnings незмінні (4 inline color без background, декоративний hero alt, skip-link евристика, яка не розпізнає чинний `#main-content`). Це не 6 доведених нових дефектів і не повний WCAG audit. SEO checker підтвердив один H1/послідовні ranks; його 77/100 та евристичні довжини metadata не є оцінкою Google. Diff Surgeon застосунку — CLEAN, noise 0/4 change lines.

**Збірка і регресії:** `cmd /c "pnpm run build"` PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. Lint, повний typecheck, 3 штатні та listing/jsonld/heading регресії PASS. Старі Node localStorage/module.register і Browserslist warnings збережені. Початкові Sanity config EPERM і loopback EACCES усунені дозволеними запусками поза sandbox; browser після початкової connection-refused error відкрито за `127.0.0.1`. Тимчасові fixtures/результати — ignored `node_modules/.cache/seo-6.10/`.

Фінальний diff — 1 файл застосунку + 6 документів; UTF-8 / 64 унікальні локальні file+anchor targets і `git diff --check` PASS. QA-сервери зупинено, viewport скинуто, робочу browser-вкладку закрито.

**Далі:** SEO-6.11 — contact headings; потім media/photos, погоджений CMS event H4 fix і повторний fresh crawl. F11/SEO-6, повний D8, SEO-7, F01 і SEO-L відкриті. CMS/env/DNS/platform settings/package/lockfile й approval не змінені; live deployment/Google index не засвідчені. Commit/push SEO-6.10 не виконано — потрібна окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

## SEO-6.9: заголовки списку подій — 2026-10-26

**Commit + push прямо погоджені 2026-10-26:** користувач відповів «так» після локального QA. Погоджено 2 файли застосунку та 6 документів у `codex/seo-1-audit` за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижча згадка про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-6.10. Live deployment окремо не засвідчений.

**Результат:** у `/events` «Інші події» H5 → H2, «Запрошуєте на подію?» H6 → H2 та «Подій не знайдено» H3 → H2. Це незалежні блоки під єдиним PageHero H1; ранг сталий за будь-якої кількості записів. Проблема P2 — пропуски heading levels для навігації; зміна не є обіцянкою конкретних позицій у пошуку.

Старт із чистого `6a48b17`, гілка `codex/seo-1-audit`; SEO-6.8 уже в HEAD. Застосовано seo-audit, a11y-audit, senior-frontend, karpathy-coder і grill-with-docs для синхронізації контексту. Змінено лише 5 рядків у [events page](../../../app/(front)/events/page.tsx) і [SidebarRecentEvents](../../../app/(front)/events/components/SidebarRecentEvents.tsx). Всі класи, контент, href, картинки, optional branches та запити збережено. Нових залежностей або client boundaries немає.

| Перевірка | Доказ і результат |
|---|---|
| SSR до/після | 5 fixtures: 0/0, 1/1, 7/3, 0/3, 3/0 main/recent records; реальні page, EventCard, SidebarRecentEvents і EventsPagination. Після нормалізації тільки heading tags увесь HTML точно збігається з HEAD. Один H1, H2 цільових блоків, відсутні H3–H6, sidebar зникає при 0, empty-state лише при 0 main, pagination при 7; page 2 і notFound PASS |
| Production HTTP | 9 GET = 8×200/1×404: `/events`, усі 5 distinct внутрішніх цілей із main (`/`, `/contact`, 3 published event details), `/events?page=2` → 404, robots/sitemap → 200. На списку один H1, усі інші headings H2; SEO checker `heading_hierarchy.pass=true` |
| Typography | Empty/many before/after fixtures з production CSS, після `document.fonts.ready`: 12/12 точних збігів font family/size/weight/line-height/letter-spacing/color, margins/padding/border і width/height на 1280/390/320px. Overflow немає |
| Повна сторінка/browser | Фактичний innerWidth 1280/390/320 підтверджено. Tab від останнього sidebar link до CTA, Shift+Tab назад, видимий focus у viewport, Enter → published event та `/contact` PASS. Desktop/mobile screenshots і empty fixture оглянуто; console errors у перевірених flows — 0 |
| Scanner | Порівняно з HTML SEO-6.8 прибрано `heading-skipped` (1 → 0). Решта rule counts незмінні: 9×`color-inline-no-bg`, 1×`img-alt-empty-informative`, 1×`landmark-no-skip-link`. Це regex-попередження, а не виміряні нові дефекти; hero декоративний, skip-link є в DOM/AX. Ширший D8 лишається відкритим; повний a11y PASS не заявляється |
| Статичні перевірки | `cmd /c "pnpm run build"` PASS: 21 schema type/34 GROQ queries, TypeScript, 42/42 generation tasks. Lint, повний typecheck (Sanity/Next typegen + tsc), 3 штатні та 3 SEO-регресії PASS. Diff Surgeon застосунку CLEAN, 0 noise lines |
| Індексація | Meta/header noindex на успішних HTML, `Disallow: /`, sitemap без `<loc>`; approval/env/CMS/settings без змін. Live deployment/Google index не засвідчені |

Тимчасові fixtures/crawl/scanner результати — ignored `node_modules/.cache/seo-6.9/`. Початкові Sanity config EPERM та localhost EACCES/timeout виправлені дозволеним запуском поза sandbox; старі Node/Browserslist warnings зберігаються. UI/code standards, spec, master-plan і tracker синхронізовано; архітектура не змінена. Фінальний diff — 2 файли застосунку + 6 документів; UTF-8 / 63 унікальні локальні file+anchor targets і diff-check PASS. QA-сервери зупинено, viewport скинуто, тимчасові вкладки закрито.

**Залишок і порядок:** SEO-6.10 — history timeline/CTA; потім окремо contact → media/photos → погоджене редагування CMS event H4 → повторний fresh crawl F11. Наявний mobile sidebar візуально перед main, але після карток у DOM/Tab; оцінка порядку читання, FAQ disclosure/nav landmark/breadcrumbs contrast та невідтворений #418 — D8. F11/SEO-6, SEO-7, F01 і SEO-L відкриті. Commit/push SEO-6.9 ще не виконано: окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Передача тут і у spec, без нового handoff-файла.

## SEO-6.8: свіжий heading crawl F11 — 2026-10-26

**Аудит завершено; F11 і SEO-6 залишаються частково відкритими.** Чистий старт `945e744`, гілка `codex/seo-1-audit`, SEO-6.7 уже в HEAD. У цьому юніті змінено лише звіт, spec, master-plan і tracker. Код застосунку та CMS не змінювалися.

### Метод і охоплення

- Свіжий `cmd /c "pnpm run build"`, локальний production-сервер `http://localhost:3108`. Обхід починався з 11 базових сторінок (включно з `/privacy`), усіх published slug чотирьох detail families та prerender manifest; далі — внутрішні HTML `a[href]`. Порожній pre-launch sitemap не використовувався як повний перелік маршрутів.
- **50 HTML GET 200 = 45 pathname + 5 query URL:** 11 базових сторінок, 5 news, 3 events, 15 ministries, 11 team; query — чотири категорії новин і категорія проповідей. DOM розібрано JSDOM; H1–H6 та `role=heading` перевірено поза `inert`/`hidden`/`aria-hidden=true`, окремо main/aside/footer. Список heading ranks — сигнал для ручного перегляду, а не автоматичний висновок про WCAG.
- Додатково `/news?category=seo-6-8-empty` і `/media?q=seo-6-8-empty` → 200, `/events?page=2` → 404, robots/sitemap → 200, відсутня довільна сторінка та по одному відсутньому detail кожної family → 404. **Разом 60 GET: 54×200 / 6×404.** Усі 52 успішні HTML мають один H1; для первинних 50 автоматично перевірено також непорожні heading names, meta/header noindex. Усі 51 fragment-посилання первинного crawl мають відповідні `id`; битих внутрішніх HTML-цілей у цій вибірці немає.
- CMS: read-only `client.fetch(defineQuery(...))`, `perspective: 'published'`, `useCdn: false`; без токена й mutations. Отримані `_id`, `_rev`, `_updatedAt`, `_type`, `slug.current` та `body/text/description/fullDescription/bio`. Для news/event враховано чинний fallback `body ?? text/description`; ministry/team — їхні власні rich-text fields. Пошук використань `richTextBlocks` підтвердив саме ці чотири типи. Чернетки/versions і неіснуючі майбутні revisions поза охопленням.
- Тимчасові runner, HTML і JSON: ignored `node_modules/.cache/seo-6.8/{crawl.mjs,crawl.json,cms.json,summary.json,scanners.json,extras.json,page-*.html}`. Довготривалі висновки та відтворення збережені тут; каталог кешу не є tracked артефактом.

### Матриця публічних шаблонів

Позначення `×N` — кількість однотипних heading у поточному HTML, не вкладеність. Footer усіх 50 сторінок: три незалежні H2, поза main; повернення з H3/H4 до H2 не є пропуском рівня.

| Маршрут / family | Фактична структура main та sidebar | Висновок |
|---|---|---|
| `/` | Один активний H1; H2 секцій, H3 вкладених карток/місії/FAQ contact/featured sermon | Відомі heading fixes збережені; неактивні slides inert |
| `/about` | H1, H2 секцій, H3 цінностей/переконань/карток | Нових пропусків у поточному HTML немає |
| `/history` | H1 → H2 → чотири timeline H4; незалежний CTA теж H4 | Залишок F11 |
| `/team` | H1 → H2 груп → H3 карток | Пропусків немає |
| `/ministries` | H1 → H2 → 15 H3 карток | Пропусків немає |
| `/news` та 4 категорії | H1 → H2 карток; sidebar/CTA H2 | Пропусків немає; HTTP empty-state також H2 |
| `/events` | H1 → H2×3 карток; sidebar H5, CTA H6 | Залишок F11 |
| `/media` та категорія проповідей | H1 → H3×12 карток, без H2 батьківської секції | Залишок F11; empty search теж H3 після H1 |
| `/media/photos` | H1, поточна непорожня фотосітка без heading | У цьому HTML пропусків немає; умовний empty-state H3 — source-only залишок |
| `/contact` | H1 → H2 → H5×4 контактів → H3 форми → H5×2 додаткової інформації | Залишок F11 |
| `/privacy` | H1 → H2 placeholder | Пропусків немає; це не схвалення privacy-тексту |
| `/news/[slug]`, 5/5 | H1; body без headings; наявна фотогалерея має H2 | Пропусків у поточному контенті немає |
| `/events/[slug]`, 3/3 | Два details — H1; `/events/den-batka-2026` — H1 → CMS H4 | Один контентний залишок F11 |
| `/ministries/[slug]`, 15/15 | H1; sidebar/CTA H2; опис H2; наявні single leader/gallery H3, news section H2/H3 | Пропусків у поточному контенті немає; multiple branch перевірена раніше у SEO-6.7, actual multiple CMS тут не заявляється |
| `/team/[slug]`, 11/11 | H1; біографії без headings | Пропусків у поточному контенті немає |
| 404 / error boundary | [NotFoundView](../../../components/NotFoundView.tsx) та [error boundary](../../../app/(front)/error.tsx) мають H1; footer H2 | 404 HTTP status перевірений у шести controls; ranks службових шаблонів — source review, runtime error навмисно не інжектували. Studio поза публічним scope |

### Actual CMS rich text

| Тип | Опублікованих details | Масиви / відсутній body | Текстових блоків | Styles |
|---|---:|---:|---:|---|
| news | 5 | 5 / 0 | 14 | 13 normal, 1 blockquote |
| event | 3 | 2 / 1 | 7 | 6 normal, 1 h4 |
| ministry | 15 | 15 / 0 | 62 | 62 normal |
| teamMember | 11 | 11 / 0 | 119 | 115 normal, 4 blockquote |
| **Разом** | **34** | **33 / 1** | **202** | **196 normal, 5 blockquote, 1 h4** |

Legacy string у цій вибірці відсутній. Оголошення `/events/obid-dlya-rodin-zagiblikh-zakhisnikiv` не має body/description; це вже відома контентна залежність SEO-L, не новий heading defect. Єдиний CMS heading — перший блок `body` події `/events/den-batka-2026`: H4 «Запрошуємо на День батька!», `_id=aad8ef7c-c264-403f-bbdd-4fae4b2f19ee`, `_rev=cAAm1ea55llPFOka1VBpIQ`, block `_key=a1709dcd9a33`; він точно відрендерився як H4 у HTML після H1. Редакційне рішення — H2 для початку розділу або звичайний вступний абзац, залежно від наміру автора. Загальний PortableText renderer не має мовчки перенумеровувати headings усіх документів.

### Підтверджений залишок F11

Вплив усіх рядків нижче — семантика й навігація за заголовками, **P2**; зміни позицій у пошуку або автоматичні WCAG-порушення за самим regex не доведені.

| Проблема | Доказ | Точкове виправлення наступним юнітом |
|---|---|---|
| Events sidebar/CTA мають H5/H6; empty-state H3 | [SidebarRecentEvents](../../../app/(front)/events/components/SidebarRecentEvents.tsx), [events page](../../../app/(front)/events/page.tsx); actual H2→H5, потім H6. Empty branch підтверджена кодом, actual порожній CMS список не створювали | **SEO-6.9:** sidebar і незалежний CTA → сталі H2; порожній стан → H2. Зберегти typography; перевірити повну сторінку, 0/1/many fixtures, links/keyboard/mobile |
| Timeline і окремий CTA історії — H4 | [history page](../../../app/(front)/history/page.tsx); actual H2→H4, чотири timeline cards та CTA | Timeline H3 під H2, незалежний CTA H2 зі збереженням розмірів. Історичні факти не переписувати в технічному юніті |
| Contact blocks — H5 | [ContactInfoCard](../../../app/(front)/contact/components/ContactInfoCard.tsx), [contact page](../../../app/(front)/contact/page.tsx); actual H2→H5 та H3→H5 | Картки під H2 → H3; окремі нижні секції оцінити як H2. Зберегти typography, форму/доставку не змінювати |
| Media cards та empty-state — H3 без батьківського H2 | [MediaCard](../../../app/(front)/media/components/MediaCard.tsx), [MediaGallery](../../../app/(front)/media/components/MediaGallery.tsx); actual H1→H3 у full/filter/empty HTTP, підтверджено браузером | Узгодити H2 для карток/empty на сторінці або обґрунтувати окремий H2 секції; не додавати вигаданий заголовок для задоволення scanner. Перевірити lightbox/filter/load-more |
| Photo empty-state — H3 після hero H1 | [PhotoGallery](../../../app/(front)/media/photos/components/PhotoGallery.tsx); source-only branch, actual CMS галерея непорожня | Перевірити порожню fixture та змінити незалежний heading на H2 у пов'язаному media юніті |
| CMS event body починається H4 | Published block і HTTP/DOM `/events/den-batka-2026`, наведені вище | Окреме погоджене редагування конкретного CMS block, потім read-back/ISR/HTTP. У SEO-6.8 дані не записувалися |

### Перевірки та межі

- Build — PASS: 21 schema types / 34 GROQ queries, TypeScript, 42/42 generation tasks. Перша sandbox-спроба впала на службовому Sanity config `EPERM`; повтор із дозволеним доступом завершився успішно. Старі Node localStorage/register і Browserslist warnings не виправлялися в цьому аудиті.
- `pnpm run lint`, повний `pnpm run typecheck`, `pnpm run test` (gallery/Studio reconnect/contact mocks), `check-listing-seo.mjs`, `check-jsonld-seo.mjs`, `check-heading-seo.mjs` — PASS. Наявні регресії захищають попередні виправлення, але не стверджують відсутність решти F11.
- `a11y_scanner.py` запущено на всіх 50 збережених HTML: heading warnings збіглися з DOM crawl (6 URL, 7 переходів; `/contact` має два). Додатковий empty media додає ще один H1→H3. `seo_checker.py` на history також підтвердив один H1 і H2→H4. Scanner exit 1 через ширші евристики — не повний a11y PASS: наявний український skip-link `#main-content` не розпізнається правилом, decorative hero `alt=""` помилково підозрюється як informative, inline color/довжини metadata — лише сигнали для окремого перегляду. Контент не доповнювався заради score.
- Browser: history/contact/events/event detail/media на **1280/390/320px** — 15 перевірок DOM із тими самими ranks та без горизонтального overflow. На 320px реальний media search → «Нічого не знайдено» H3; Tab/Shift+Tab між search і категоріями та видимий focus підтверджені. Це вузький контроль, не повний keyboard або screen-reader audit всього сайту.
- Під час першого browser-проходу зафіксовано **один [React hydration #418](https://react.dev/errors/418)**; журнал не дозволив надійно прив'язати його до конкретного маршруту. Повторна навігація на всі п'ять цільових сторінок не дала нових errors. Причину/виправлення не заявляємо; відтворення першого завантаження лишається runtime follow-up у D8. У server log були upstream YouTube `maxresdefault.jpg` 404; чинний MediaCard має image fallback, його повну працездатність тут не засвідчуємо. Ці зовнішні image requests не входять у 60 HTML/robots/sitemap GET. Новий live deployment/Google index не перевірявся.
- Noindex/`Disallow: /`/порожній approval і sitemap без URL збережені. CMS/env/DNS/platform settings/package/lockfile та UI conventions без змін. Viewport скинуто, тимчасову вкладку закрито; QA-сервер зупинено. UTF-8, локальні посилання й `git diff --check` перевірені після оновлення документів.

Підхід до рангів звірено з [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/): вкладеність має відображати організацію контенту, а сталі sidebar/footer не підлаштовуються під останній heading основного тексту. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) використано як межу SEO-тверджень: коректна структура не є гарантією рейтингу чи індексації.

### Пріоритетний порядок дій

1. **SEO-6.9:** лише events sidebar/CTA/empty-state; seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs для контексту. Повний SSR/fixtures/typography/links/keyboard/1280–390–320px QA, build.
2. Наступними окремими вузькими юнітами: history → contact → media/photos; CMS H4 — окреме погоджене редагування конкретного документа. Не відкривати SEO-7/SEO-L через завершення самого crawl.
3. Після усунення залишку — новий fresh crawl усіх шаблонів і актуальних published bodies, тоді повторно оцінити закриття F11/SEO-6. Повний D8 (FAQ disclosure/nav landmark/breadcrumbs contrast/порядок sidebar і відтворення #418), F01 та SEO-L лишаються відкритими.

**Commit + push SEO-6.8 прямо погоджені 2026-10-26:** користувач відповів «так» після локального QA; погоджено 4 документи у `codex/seo-1-audit` за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат публікації — у git history та фінальному повідомленні; live deployment окремо не засвідчений. Передача тут і у spec, без нового handoff-файла.

## SEO-6.7: заголовки детальної сторінки служіння — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.7 після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижча згадка про ще потрібну згоду — попередній стан. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби SEO-6.7». Старт із чистого `4272e9b`, гілка `codex/seo-1-audit`; SEO-6.6 уже в HEAD. Обсяг — один [шаблон детальної сторінки служіння](../../../app/(front)/ministries/[slug]/page.tsx), 8 змінених рядків застосунку. CMS, схеми, GROQ, залежності, URL та optional-data branches не змінені.

### Проблема й виправлення

F11/P2: sidebar H5 і CTA H6 після PageHero H1 пропускали рівні; single leader H4 під H2 також пропускав H3. У multiple-гілці назва групи була p, а імена — H4. Sidebar «Інші служіння» й CTA «Хочете долучитися?» стали H2; single name — H3; multiple group — H3, вкладені імена залишилися H4. Це відповідає структурі сторінки за [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/); конкретного впливу на пошукові позиції QA не встановлює.

Назва multiple-групи зберігає Roboto завдяки `font-base`. Responsive `text-lg lg:text-xl` уже задають font-size і line-height: пробний `leading-base` змінював висоту й прибраний до фінальної збірки. Решта класів/розмірів збережена. Фото в leader links мають порожній alt, щоб accessible name містила видиме ім’я один раз — [W3C WAI: Functional Images, example 2](https://www.w3.org/WAI/tutorials/images/functional/#example-2-logo-image-within-link-text). Самостійне фото служіння та detail/lightbox не змінені.

### Перевірки

- **SSR:** 10 сценаріїв + відсутній документ. Відсутні/null/порожні leaders, null та incomplete refs, single із фото/без фото, multiple зі змішаними refs/фото, довге ім’я й optional description/quote/gallery. Перевірено H1/H2/H3/H4, кількість і href leader links, відсутність `/undefined`, приховування невалідних leaders, notFound. Після нормалізації лише погоджених тегів/`font-base`/alt решта HTML точно збігається з HEAD.
- **Typography:** baseline/current SSR із production CSS після `document.fonts.ready`: single/multiple/long/missing × 1280/390/320px, 12/12 точних збігів font family/size/weight/line-height/color/margins/padding і width/height. Окремо multiple keyboard на всіх трьох ширинах: Tab sidebar → CTA → leader 1 → leader 2, Shift+Tab назад, видимий outline; overflow немає. AX tree підтверджує H3 групи/H4 імен і відсутність дублювання імен від фото.
- **Статичні перевірки:** lint, три штатні регресії (gallery/SSE/contact), три SEO-регресії (listing/JSON-LD/hero headings), усі стадії typecheck (Sanity typegen + Next typegen + tsc) — PASS. Фінальний `cmd /c "pnpm run build"` після корекції line-height — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks.
- **HTTP:** 26 GET — 25×200 та очікувана 404. Усі 15 ministry details мають один H1, H2 sidebar/CTA та noindex; усі distinct sidebar href, 7 leader targets і `/contact` відповідають 200. `/robots.txt` зберігає Disallow, sitemap не має `<loc>`. Це перевірка ministry family, без site-wide heading crawl.
- **Production browser:** 1280/390/320px — без overflow; Tab останнього sidebar link → CTA, Shift+Tab назад; Tab leader → перший gallery button, Shift+Tab назад із видимим outline. Enter із sidebar → «Індиго», CTA → `/contact`, leader → `/team/mikhailo-dren`; цільові H1 перевірені. Desktop/mobile screenshots оглянуто, console errors у перевірених flows — 0. 12 typography-комбінацій повторно пройшли з фінальним CSS; multiple branch перевірена у read-only fixture, не записана до CMS.
- **Scanners:** SEO checker production HTML підтвердив один H1 та hierarchy без skips; його score/довжини metadata/word count не є оцінкою Google, а empty alt hero/leader — свідомі декоративні зображення. Source a11y scanner не бачить H1 із PageHero та main/skip-link із layout; full-HTML skip-link warning — regex false positive (`#main-content` існує). Empty-alt та inline-color евристики переглянуті, не засвідчують дефекту/контрасту. Наявний primary header/nav landmark лишається D8 (breadcrumbs nav є). Повну WCAG-відповідність не заявляємо.

QA runners/SSR fixtures/crawl результати — лише ignored `node_modules/.cache/seo-6.7/`; нового tracked test framework немає. Початковий sandbox EPERM у Sanity config усунено дозволеним повтором. Старі Node localStorage/module.register та Browserslist warnings зберігаються. Фінальний diff — один файл застосунку та 6 документів; UTF-8/локальні посилання, `git diff --check` та Diff Surgeon застосунку — PASS. QA-сервери зупинено, viewport скинуто, вкладку закрито.

### Межі та наступний юніт

**SEO-6.7 завершено локально. Далі SEO-6.8 — окремий свіжий heading crawl F11:** звірити всі публічні шаблони й actual CMS rich text, після цього оцінити закриття F11/SEO-6. Вузький ministry QA не замінює цей crawl. Повний D8 (FAQ disclosure semantics, nav landmark, breadcrumbs contrast, візуальний/DOM порядок sidebar), SEO-7, F01 та SEO-L відкриті. Noindex/Disallow/порожній approval збережені; live deployment/Google index не засвідчені. Commit/push SEO-6.7 ще не виконано: окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Скіли наступного юніту: seo-audit, a11y-audit, karpathy-coder; senior-frontend за потреби, grill-with-docs для контексту. Передача тут і у spec, без окремого handoff-файла. Нижчі юніти — історичний стан.

## SEO-6.6: заголовки футера — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.6 після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижча згадка про ще потрібну згоду — попередній стан. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Перед погодженим комітом повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 queries, TypeScript, 42/42 generation tasks. UTF-8 6 документів / 121 локальна file+anchor ціль і staged diff-check — PASS. Код після QA не змінено; попередні перевірки не розширювалися.

Пряме доручення — «роби SEO-6.6». Старт із чистого `32276d0`, гілка `codex/seo-1-audit`; SEO-6.5 уже в HEAD. Обсяг — один спільний шаблон [ChurchFooter.tsx](../../../components/ChurchFooter.tsx), три рядки застосунку. Контент, класи, href, GROQ, схеми та залежності збережені.

| Проблема | Доказ / вплив | Виправлення |
|---|---|---|
| Три самостійні групи футера мають H4 без батьківського H2/H3 | FrontLayout розміщує footer після `</main>`; SSR/AX головної показує «Швидкі посилання», «Служіння», «Контакти» як H4. Групи не є підрозділами останньої секції main | H4 → H2 для трьох груп, спільний `footer-title` збережено. P2, частина F11 |

Ранг H2 сталий для всіх сторінок: [W3C Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) описує однаковий рівень структурних секцій, зокрема footer, та сталі ранги fixed sections незалежно від main. Додаткового прихованого заголовка чи нового landmark не створено.

Перевірки:

- 6 SSR fixtures реального компонента (full/empty/missing slug/mixed/без social і services/кілька services) — PASS. HTML точно збігається з HEAD після лише трьох H4 → H2; поведінка порожнього списку й slug guards збережена. Відомий випадок масиву лише з null slug лишає порожню колонку як раніше, не породжує битого посилання.
- Lint, три штатні та три SEO-регресії — PASS. Diff Surgeon застосунку — CLEAN, 0 noise lines.
- Автоматичний a11y scanner до/після: попередження про H1/main/skip-link є наслідком аналізу ізольованого footer; H1/main/skip-link належать повній сторінці. Відсутній nav landmark — уже відкритий D8. Вузький юніт не засвідчує повну WCAG відповідність.
- Production build — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. Початкова sandbox-спроба вперлася в EPERM службового Sanity config; build із потрібним доступом успішний. Окремий `pnpm run typecheck` зупинився на config rename EPERM; усі його стадії завершено: Sanity typegen у build, потім послідовні `pnpm exec next typegen` і `pnpm exec tsc --noEmit` — PASS. Старі Node/Browserslist warnings без змін.
- 16 production GET — PASS: 13 HTML 200 з footer, robots/sitemap 200, відсутній team detail 404 без footer (штатна глобальна 404). У всіх відповідях header noindex, у всіх 14 HTML meta noindex; `Disallow: /`, sitemap 0 URL. Усі 13 distinct внутрішніх href футера перевірені — 200, усі 18 href однакові на перевірених front-сторінках. Зовнішні social URLs, tel/mailto звірено як адреси; зовнішні акаунти/handlers не відкривалися.
- Browser 1280/390/320px — PASS: exact before/after computed font family/size/weight/line-height/color/margin та ширина/висота трьох heading; horizontal overflow відсутній. На всіх трьох розмірах Tab від logo через решту 17 посилань відповідає DOM, кожне має видимий focus; Shift+Tab повертає фокус назад. Enter → `/about`, `/privacy`, `/ministries/children` відкриває відповідні H1 та footer H2. Desktop/mobile screenshot оглянуто, console errors у перевірених flows — 0.
- У server log був upstream YouTube maxres 404 поза footer; наявний thumbnail fallback не змінено. Це не помилка посилання футера; browser console у перевірених flows без errors.
- 6 UTF-8 документів / 121 локальна file+anchor ціль і фінальний diff-check — PASS. Фінальний diff: 1 файл застосунку + 6 документів. QA-сервер зупинено, viewport скинуто, робочу browser-вкладку закрито.

Тимчасові QA-артефакти — ignored `.next/seo-6.6/`. Noindex/Disallow/порожній approval збережено; live CMS/env/DNS/platform settings без змін. Commit/push цього юніту потребує окремої згоди за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

**Далі SEO-6.7:** ministry detail sidebar H5, CTA H6 та leader H4 (single/multiple). Спершу звірити повну сторінку й порожні/null дані, зберегти typography, перевірити SSR/links/keyboard/mobile. Після цього — окремий свіжий heading crawl усього залишку F11. Повний D8 (FAQ disclosure semantics/nav landmark/breadcrumbs contrast), SEO-7, F01 і SEO-L відкриті. Скіли наступної сесії: seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs/handoff для контексту. Передача тут і в spec, без дублюючого handoff-файла.

## SEO-6.5: підписи відгуків і контактний заголовок FAQ — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.5 після локального QA. Погоджено 2 файли застосунку та 6 документів у `codex/seo-1-audit`; нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби далі SEO-6.5». Старт із чистого `6c9ce1a` у `codex/seo-1-audit`, SEO-6.4 уже в HEAD. Рівно два рядки застосунку: [TestimonialsGrid](../../../app/(front)/components/TestimonialsGrid.tsx) та [FAQSplit](../../../app/(front)/components/FAQSplit.tsx). Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs і принципи handoff; передача через наявні документи. Нових dependencies, маршрутів, стану, схем, запитів або tracked тестів немає.

### Дефект і виправлення SEO-6.5

- **Проблема/вплив:** підписи авторів відгуків H6 і контактний H4 під секційним H2 створювали пропуски в навігації заголовками. Рівні мають передавати структуру контенту за [W3C WAI](https://www.w3.org/WAI/tutorials/page-structure/headings/); конкретного впливу на позиції пошуку цей QA не доводить.
- **Доказ:** baseline SSR із HEAD та browser AX: Testimonials H2 → H6/H6, FAQ H2 → H4. Після: імена доступні як звичайні текстові підписи, Testimonials H2 → FAQ H2 → contact H3. Повна production-головна має один H1; у перевіреному main лишилися H1/H2/H3, footer H4 — окремий залишок.
- **Виправлення/P2:** names H6 → p з `font-heading text-h6 leading-heading text-gray-800`, чинні `m-0 font-bold` збережені. Contact H4 → H3 з `text-h4`. Контент, фото/alt, усі href, класи контейнерів, FAQ state та поведінка збережені.

### Перевірки SEO-6.5

- `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. `pnpm run lint`, повний `pnpm run typecheck`, `pnpm test` (gallery/SSE/contact), три SEO-regressions (listing/JSON-LD/hero headings) — PASS. Старі Node localStorage/module.register та Browserslist warnings; sandbox Sanity config EPERM і loopback EACCES/timeout усунені дозволеними повторами.
- **6 SSR fixtures:** повний/minimal/empty testimonials; повний FAQ/без contact props/empty items без contactTitle. Порівняння baseline/current після нормалізації лише двох цільових елементів дає точний збіг решти markup; нових H6/H4 у цих шаблонах немає. Жодного запису в CMS.
- **6 production GET:** `/`, `/contact`, `/about`, `/robots.txt`, `/sitemap.xml` — 200; `/seo-6-5-not-found` — 404. Header noindex на всіх, meta noindex на HTML, `Disallow: /` і 0 URL у sitemap збережені. Головна: один H1, testimonials H2 без H6, FAQ H2/contact H3, crawlable CTA `/contact`; main і skip target присутні.
- **Browser typography:** SSR baseline/current зі спільним CSS цього production build на 1280×900, 390×844, 320×812. Точний збіг font family/size/weight/line-height/letter-spacing/color/margin/padding та width/height; перевірено також довге ім’я з перенесеннями. Names 14px/16.8px, contact 21px/25.2px; горизонтального overflow немає у fixtures й реальній головній.
- **Production keyboard:** на всіх трьох ширинах Enter відкриває другий FAQ пункт із закриттям першого, Space закриває, Tab/Shift+Tab переходять між сусідніми кнопками, focus-visible має зелений outline. Tab з останнього пункту → «Зв'язатися», Enter → `/contact`; console errors у перевірених flows відсутні. AX підтверджує H3 контакту й імена поза headings.
- SEO/a11y scanners запущені. Повна сторінка підтвердила залишковий skip footer H2 → H4. Component-level H1/main/skip warnings не застосовні до section-компонентів; skip-link warning повної сторінки — regex false positive (реальний `#main-content` перевірений). `landmark-no-nav` підтверджений у наявному header; inline-color warnings не є вимірюванням contrast. Окремо зафіксовано D8: FAQ не має `aria-expanded`, згорнуті відповіді лишаються в AX tree/частково видимими через наявні padding/max-height стилі. Виправлення accordion і header виходять за вузький heading-юніт; повний WCAG conformance не заявляємо.

Тимчасові scripts/results/HTML/screenshots — ignored `.next/seo-6.5/` (зокрема `fixtures.json`, `http.json`, `browser.json`, `faq-desktop.jpg`). Noindex/Disallow/порожній approval, root/layout/robots/sitemap/config, schema/GROQ sources, package/lockfile, CMS/env/DNS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.5 не виконано — потрібна окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

Фінально: 2 файли застосунку + 6 документів, UTF-8 / 109 локальних file+anchor targets, diff-check та Diff Surgeon CLEAN. QA-сервери зупинено, viewport скинуто, тимчасову вкладку закрито. У server log зафіксований upstream YouTube maxres 404 поза testimonials/FAQ (наявний thumbnail fallback); browser console errors у перевірених flows не було.

### Наступний юніт після SEO-6.5

1. **SEO-6.6 — footer headings H4:** один template, звірити семантичний ранг у повних сторінках, зберегти typography та перевірити SSR/links/keyboard/mobile/desktop. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту.
2. **Далі ministry detail headings окремим юнітом:** sidebar H5/CTA H6/leader H4 (single/multiple); після всіх F11 fixes — свіжий heading crawl. Повний D8 (breadcrumbs contrast, nav landmark, FAQ disclosure), SEO-7, F01 і SEO-L лишаються відкритими. Нижчі сесії описують попередній стан.

## SEO-6.4: надзаголовки OurVision і PastorGreeting — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.4 після локального QA. Нижчі згадки про ще потрібну згоду — історичний стан. Публікація охоплює 2 файли застосунку та 6 документів у `codex/seo-1-audit`; результат — у git history та фінальному повідомленні. Merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби наступний крок — SEO-6.4». Старт із чистого `8fc6bea` у `codex/seo-1-audit`; SEO-6.3 уже в HEAD. Рівно два пов’язані компоненти: [OurVision](../../../app/(front)/components/OurVision.tsx) та [PastorGreeting](../../../app/(front)/components/PastorGreeting.tsx), обидва використовуються на головній. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs і принципи handoff для передачі через наявні документи. Нових маршрутів, стану, схем, запитів, залежностей або tracked тестів немає.

### Дефект і виправлення SEO-6.4

- **Проблема/вплив:** короткі надзаголовки «Хто ми» та «Вітання пастора» мали H6 перед H2. Вони створювали зайві рівні в навігації заголовками; [W3C WAI](https://www.w3.org/WAI/tutorials/page-structure/headings/) рекомендує структурувати контент за рангами та уникати пропусків під час поглиблення ієрархії.
- **Доказ:** baseline production browser AX і SSR показали H1 → H6 → H2 → H3 → H6 → H2 у цьому фрагменті головної. Фінальний фрагмент — H1 → H2 → H3 → H2; надзаголовки лишилися доступним текстом у p.
- **Виправлення/пріоритет:** частина F11/P2 — H6 → p, до чинних класів додано `font-heading`, який зберігає успадкований Poppins. H2 секцій, H3 місії, контент, фото, CTA `/about`, розміри й layout збережено. PastorGreeting на головній не має кнопки; API опційної кнопки цього компонента не змінювався.

### Перевірки SEO-6.4

- `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. `pnpm run lint`, повний `pnpm run typecheck`, `pnpm test` (3 штатні регресії) і listing/jsonld/heading SEO scripts — PASS. Залишаються старі Node localStorage/module.register та Browserslist warnings. Sandbox Sanity config EPERM і недоступний loopback усунено дозволеними запусками поза sandbox.
- **6 SSR fixtures:** повний props-набір, без pre-title та мінімальний варіант для кожного компонента. Порівняння з HEAD після нормалізації CRLF — точний збіг HTML, крім H6 → p і нового font class. Перевірено збереження H2/H3, текстів, посилань, фото та умовного рендеру. Next Link/Image у fixtures замінені простими SSR stand-ins; справжній Link перевірено окремо у production/browser.
- **6 production GET:** `/`, `/about`, `/robots.txt`, `/sitemap.xml`, `/images/vision1.jpg`, `/images/vision2.jpg` — 200, усі з header noindex; обидві HTML-відповіді з meta noindex. На головній один H1, main і p надзаголовків, CTA `/about`; Disallow та sitemap без loc збережено. Це вузька перевірка маршруту й ресурсів цих секцій, не повний повторний crawl сайту.
- **Browser 1280×900 / 390×844 / 320×812:** computed font family/size/weight/line-height/letter-spacing/color, margin-bottom, width/height обох надзаголовків до/після точно збігаються (Poppins, 600, 12.2496px / 17.4994px, margin 12px). Візуальний огляд обох секцій пройшов, горизонтального overflow немає. Tab з останньої hero-dot → CTA OurVision, Shift+Tab повертає назад; наступний Tab переходить до schedule CTA через PastorGreeting без зайвих tab stops. Focus видимий; Enter відкриває `/about` з H1 «Про нас», повернення працює. Console без errors у перевірених flows. Screen reader speech та повний D8 не перевірялися.
- **Scanners:** component-level відсутні H1/main/skip/nav — очікувані page-only евристики. Повний HTML має main, H1 та skip-link `#main-content` (scanner шукає вужчий патерн і помилково каже missing). SEO/a11y scanner лишає 3 реальні forward skips у Testimonials H6, FAQ contact H4 та footer H4. 11 inline-color евристик без computed background не є вимірюванням контрасту; header без nav landmark залишається ширшому D8. Diff surgeon для двох файлів застосунку — CLEAN.

Тимчасові runner/results і HTML — ignored `.next/seo-6.4/`. Root layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile/env/DNS/CMS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.4 не виконано — потрібна окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

Завершення: 2 файли застосунку + 6 документів; UTF-8 / 100 локальних file+anchor targets та `git diff --check` PASS. QA-сервер зупинено, viewport скинуто, робочу browser-вкладку закрито.

### Наступний юніт після SEO-6.4

1. **SEO-6.5 — TestimonialsGrid names і FAQSplit contact block:** два пов’язані section templates; перевірити актуальну структуру повної сторінки, визначити потрібну семантику H6/H4, зберегти typography та перевірити SSR і keyboard/mobile/desktop. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs для контексту; передача тут і в spec, без окремого handoff-файлу.
2. **Далі окремими юнітами:** footer H4, ministry detail sidebar H5/CTA H6/leader H4 (single/multiple). Після решти F11 — свіжий heading crawl. Повний D8/breadcrumbs contrast, SEO-7, F01 і SEO-L не закриті.

## SEO-6.3: картки служителів і служінь — 2026-10-26

**Commit + push прямо погоджені 2026-10-26:** після локального QA користувач відповів «так». Публікація охоплює 3 файли застосунку та 6 документів у `codex/seo-1-audit`; нижчі згадки про ще потрібну згоду описують попередній стан. Результат — у git history та фінальному повідомленні. Merge/Production settings без змін; live deployment окремо не засвідчений.

Перед погодженими commit + push повторний build PASS: 21 schema type / 34 queries, TypeScript, 42/42 tasks; старі Node/Browserslist warnings. Свіжий fetch — HEAD/origin 0/0, Git Credential Manager — `Chekirko`. UTF-8 6 документів / 92 локальні file+anchor targets і diff-check PASS. Зміни застосунку та попередній QA не розширено; точний результат публікації перевіряється після push.

- У списках `/team` і `/ministries` виправлені підтверджені H2 → H5/H6 skips: усі імена/назви карток тепер H3. Єдиний PageHero H1 і секційні H2 збережено.
- У цілісному посиланні фото має `alt=""`: доступна назва походить від видимого імені/назви та підпису, без повторного озвучення від фото. Фото detail/lightbox не змінювались. CSS-класи, href, розміри й hover збережено.
- 32 production GET, 11 SSR fixtures, browser 1280/390/320px і build/lint/tsc/наявні та SEO-регресії — PASS. F11 закрито лише для цих списків; повний SEO-6/D8 відкритий.

Пряме доручення — «Роби Наступний крок — SEO-6.3». Старт із чистого `9c1816c` у `codex/seo-1-audit`, SEO-6.2 уже в HEAD. Два пов’язані шаблони — team cards (звичайний/почесний варіант) і ministry listing cards. Рівно 3 файли застосунку: [TeamMemberCard](../../../app/(front)/team/components/TeamMemberCard.tsx), [HonorarySection](../../../app/(front)/team/components/HonorarySection.tsx), [MinistryCard](../../../components/ui/MinistryCard.tsx). Нових маршрутів, стану, схем, GROQ-запитів чи залежностей немає. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту; окремого handoff-файлу немає.

### Перевірки SEO-6.3

| Перевірка | Результат і межі |
|---|---|
| Production build | `cmd /c "pnpm run build"` PASS: 21 schema type / 34 queries, TypeScript, 42/42 generation tasks. Початковий Sanity config EPERM усунуто дозволеним повтором; старі Node/Browserslist warnings |
| Статичні перевірки | `pnpm run lint`, `pnpm run typecheck` (Sanity/Next typegen + tsc), `pnpm exec tsc --noEmit`, `pnpm test` (3 регресії), listing/jsonld/heading SEO scripts PASS; Diff Surgeon CLEAN (3 файли, 14 changed lines). UTF-8 6 документів / 92 локальні file+anchor targets і `git diff --check` PASS |
| SSR fixtures | 11 renders реальних TeamSection/HonorarySection/MinistryGridSection через transpile/VM і mocked Link/Image/urlFor: H2/H3, чинні href, порожні списки, фото/fallback, довга назва, перша responsibility, фото з порожнім alt. Це SSR, без browser/CMS mutations |
| HTTP crawl | 32 GET: 30×200 / 2×404. Обидва списки по 15 карток; 26 distinct targets = 11 team + 15 ministry details, усі 200 з власним canonical і 1 H1. Обидва missing slugs — 404. Усі відповіді header noindex, 30 HTML — meta noindex; robots Disallow, sitemap 0 URL. Вибірка — усі href цих карток, не весь сайт |
| Browser | 1280×900 / 390×844 / 320×812: обидва списки без горизонтального overflow, назви служінь у межах карток, видимий глобальний focus. Tab/Shift+Tab для звичайної, почесної та ministry cards; Enter → відповідні details; breadcrumb Команда → список. Console errors відсутні в перевірених flows. Синтетичні порожні/без фото стани перевірені лише SSR |
| Сканери | SEO checker підтвердив один H1 та hierarchy OK на обох HTML. Його «missing alt» для явного `alt=""` — false positive для фото з дубльованою текстовою назвою в тому самому link; евристики довжини metadata/word count не є scope цього юніту. A11y scanner очікує H1/main/nav/skip-link у кожному компоненті; реальні PageHero/layout дають їх на сторінці. Footer H4 не оголошено виправленим |

Тимчасові runner/results — ignored `.next/seo-6.3/fixtures.mjs`, `crawl.mjs`, `crawl.json`; permanent тестовий framework чи новий tracked regression для заміни тегів не додано. Початкові loopback EACCES/timeout усунені дозволеним запуском локального сервера й crawl поза sandbox. Viewport override скинуто, робочу QA-вкладку закрито. Дві ранні error-вкладки не вдалося закрити через URL policy на browser-generated data URL; вони тимчасові. Семантика узгоджена з [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) та [Functional Images](https://www.w3.org/WAI/tutorials/images/functional/).

QA-сервер зупинено, порт 3004 без listener. Фінальний diff — 3 файли застосунку + 6 документів. Root layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile/env/DNS/CMS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.3 не виконано — потрібна окрема згода за [workflow §3](../../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

### Наступний юніт після SEO-6.3

1. **SEO-6.4 — OurVision/PastorGreeting pre-titles:** звірити актуальні H1–H6 у контексті сторінки, точково виправити підтверджені skips, зберегти typography; SSR і keyboard/mobile/desktop QA. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту.
2. **Решта F11 — окремими юнітами:** Testimonials names, FAQ contact block, footer; ministry detail sidebar H5, CTA H6 та leader H4 (single/multiple branches). Вони не належать до виправлених listing cards. Після всіх юнітів — свіжий heading crawl, без автоматичного закриття повного D8.
3. **Зберегти межі:** F01/platform protection, breadcrumbs contrast/D8, performance SEO-7, редакційні біографії/історія та launch SEO-L лишаються відкритими. Жодного запуску індексації або live CMS edits у цьому юніті.

## SEO-6.2: картки новин і sidebar — 2026-10-26

### Результат і межі

- `/news` main має один H1 і послідовні H2: п’ять назв новин та «Категорії», «Останні новини», «Маєте новину?». Порожній стан також H2. Розміри/шрифти/кольори залишені чинними класами; layout, CMS-контент, metadata та JSON-LD не змінювалися.
- Кожне «Читати далі» має доступну назву з повним title через `sr-only`; видимі слова збережено. Фото й назва картки та sidebar title залишаються нативними crawlable links на той самий detail URL. Фото-посилання має явну площу `absolute inset-0` і focus outline із відступом −4px, щоб його не обрізав overflow wrapper. Декоративні іконки змінених блоків — `aria-hidden`.
- Активна категорія/«Усі новини» має `aria-current="page"`. URL encoding та фільтрація з SEO-4.2 збережені. Noindex/Disallow/порожній approval не змінено; F11 закритий лише в цьому scope, повний D8 не закрито.

Пряме доручення — «Роби Наступний крок — SEO-6.2», потім «продовжуй». Старт із чистого `66a13a5` у `codex/seo-1-audit` (SEO-6.1 уже в HEAD). Два пов’язані шаблони — news card та news sidebar, включно з їхнім контейнером/empty-state у listing. Рівно 4 файли застосунку: [NewsCard](../../../app/(front)/news/components/NewsCard.tsx), [SidebarCategories](../../../app/(front)/news/components/SidebarCategories.tsx), [SidebarRecentPosts](../../../app/(front)/news/components/SidebarRecentPosts.tsx), [news page](../../../app/(front)/news/page.tsx). Нових CMS-схем/GROQ-запитів, клієнтського стану, dependencies або маршрутів немає. Скіли: seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs/handoff для контексту без окремого handoff-документа.

### Докази

| Перевірка | Результат |
|---|---|
| Production-build HTTP, 16 GET | 14×200 / 2×404; усі 16 — header noindex, усі 14 HTML — meta noindex. `/news`, усі 5 detail targets із карток/sidebar, 4 category targets, `/contact`, порожня категорія, відсутній detail і page=2, robots/sitemap |
| Заголовки й назви links | `/news` main: H1 + 8 H2, 5 конкретних read-more names; кожна категорія — H1/H2, тільки відповідний current link. Empty category — H2 «Новин не знайдено». Усі 5 detail targets та контактний CTA → 200 |
| Збережені обмеження | `robots.txt` містить `Disallow: /`, sitemap не містить `<loc>`. Відсутній detail і реальна відсутня page=2 → 404/noindex |
| Ізольовані fixtures | Справжні card/sidebar/page через TypeScript transpile/VM + React SSR: довгий title з `&`/кутовими дужками без HTML injection, повний read-more name, 3 однакові href у картці, encoded category URL/current state, порожні sidebar масиви, порожній/filtered listing H1→H2. Без мережі й CMS writes |
| Browser desktop/mobile | 1280×900, 390×844, 320×812: scrollWidth не більша clientWidth; картки 422px у двох колонках desktop, близько 343/273px в одній колонці mobile. Заголовки карток зберегли CSS `text-lg`. Category/sidebar/CTA та mobile-картки візуально переглянуті |
| Keyboard і переходи | Tab/Shift+Tab між фото, назвою й read-more; actual focus-visible та −4px inset фото засвідчено. Enter read-more на desktop і фото на 320px відкрили detail; back link повернув listing. На 390px Enter «Молодь» → один відповідний матеріал та current category; Enter «Скинути» → усі 5 карток/current «Усі новини». Browser console без errors у цих flows |

QA runners/HTML/JSON зберігались лише в ignored `.next/seo-6.2/`; довготривалі докази — ця таблиця. Новий tracked test для цієї невеликої семантичної зміни не додавався. Наявні `pnpm run test` (gallery/Studio/contact) і listing/jsonld/heading SEO runners — PASS. `cmd /c "pnpm run lint"`, `cmd /c "pnpm exec tsc --noEmit"` та обов’язковий `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 generation tasks. Старі Node localStorage/module.register і Browserslist warnings. Початкові sandbox Sanity config EPERM/loopback timeout усунені дозволеними повторами; mobile viewport набув чинності після reload, фактичні 390/320px перевірені через DOM, а не лише успішний виклик API.

`a11y_scanner.py` на 4 news components дав 14 component-level повідомлень про відсутні H1/main/nav/skip-link: layout/PageHero забезпечують page landmarks/H1, перевірено у зібраному HTML/browser; ці regex-попередження не підстава додавати H1/main у картки. `seo_checker.py` на реальному HTML підтвердив один H1; залишковий H2→H4 — footer поза scope. Його length heuristics для title/description та порожній alt декоративного hero не є новими дефектами й не спричиняють переписування контенту. `diff_surgeon.py --diff HEAD --json` на 4 файлах застосунку — CLEAN, 0 noise lines.

### Залишок і наступний юніт

**SEO-6.3 — team/ministry card headings:** перевірити актуальні templates та контекст секцій, точково усунути підтверджені пропуски рівнів, зберегти розміри/дизайн, перевірити crawlable links і keyboard/mobile/desktop. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder; документація — grill-with-docs/handoff. Не починати SEO-7/SEO-L у тому самому юніті.

Після карток лишаються pre-titles OurVision/PastorGreeting, імена TestimonialsGrid, FAQ contact block та footer. Окремо D8: breadcrumbs contrast і ширший порядок читання/Tab; чинний mobile layout `/news` візуально ставить sidebar перед картками, DOM/Tab лишає основні матеріали перед complementary sidebar. У цьому юніті layout не переставлявся; загального WCAG conformance не заявляємо. F01, контентні факти, домен/Search Console/SEO-L відкриті; live deployment та Google index не засвідчені.

Root layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile/env/DNS/CMS/platform settings збережені. **Commit + push SEO-6.2 прямо погоджені 2026-10-26:** користувач відповів «так» після локального QA. Результат публікації — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Семантичний підхід звірено з [W3C WAI: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/): рівні відображають структуру, CSS визначає зовнішній вигляд. Завершальні UTF-8 перевірки 6 документів / 83 локальних file+anchor targets та `git diff --check` — PASS. QA-сервер зупинено; viewport override скинуто й дві робочі QA-вкладки закрито. Фінальний diff — 4 файли застосунку + 6 документів.

Перед погодженим commit + push повторний build — PASS (21 schema type / 34 queries, TypeScript, 42/42 tasks); свіжий fetch — HEAD/origin 0/0, Git Credential Manager — `Chekirko`. UTF-8/file anchors і staged diff-check перевірені; попередній QA та код застосунку не розширюються.

## SEO-6.1: заголовки hero і служителя — 2026-10-26

**Публікація погоджена 2026-10-26:** після локального QA користувач відповів «Так» на commit + push SEO-6.1 у `codex/seo-1-audit`. Нижчі згадки про ще потрібну згоду описують попередній стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

### Результат і обсяг

- Виправлена H1-частина F11: один видимий H1 на головній у кожному стані слайдера, один H1 у всіх 11 team details. Рівні інших секцій/card/sidebar/footer ще потребують окремих юнітів; весь SEO-6 та D8 не закрито.
- У двох погоджених шаблонах збережено текст, фото та типографіку. Керування hero стало доступним клавіатурою: приховані CTA не отримують фокус, є pause/play і підписані кнопки. Окремий однорядковий target fix карти усунув знайдений битий fragment.
- Фінальний production build, lint, typecheck, 3 наявні регресії й 3 SEO-регресії — PASS. HTTP: 50 HTML 200, robots/sitemap 200, missing team 404; усі з header noindex, увесь HTML із meta noindex. 51 перевірка fragment-цілей — PASS.

Пряме доручення — «Роби Наступний крок — SEO-6». Старт із чистого `89fb6ec` (`codex/seo-1-audit`), який містить опублікований SEO-5. Обсяг розбитий за лімітом spec: SEO-6.1 — головний hero та team detail; SEO-6.2+ — залишкові шаблони. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту. Нових маршрутів, схем, dependencies або live CMS mutations немає.

### Дефекти, докази та реалізація

| Проблема | Вплив / доказ | Виправлення / пріоритет |
|---|---|---|
| Головна без H1; pre-title помилково h3 | Серверний HTML baseline: 0 H1. Декоративний надпис потрапляв у heading navigation перед основним заголовком | [Hero.tsx](../../../components/sections/Hero.tsx): лише активний title — H1, неактивні titles — абзаци; pre-title — абзац із тими самими шрифтом/розміром/line-height. Після SSR і browser transitions — 1 H1. P2, виправлено |
| Team detail дублює H1 | PageHero та body повторювали ім’я як два H1 | [Шаблон](../../../app/(front)/team/[slug]/page.tsx): повторне ім’я — абзац, візуальні класи збережено; rich-text headings не зсуваються штучно під зайвий H2. 11/11 HTTP details — один H1, photo/null fixtures теж. P2, виправлено |
| Невидимі слайди доступні через Tab; ротація без паузи; dots без назв | `opacity-0`/pointer-events не вилучали посилання з клавіатурного порядку. Прокручування могло прибрати CTA з-під фокусу | `inert` + `aria-hidden`, видимий pause/play перед контентом, focus stop до явного play, hover pause, reduced-motion default. Українські назви, aria-current для dots; 44×48px цілі dots, 48px arrows. Ручне перемикання зберігає фокус. Pointer-down ref усуває перевірений конфлікт focus stop → click toggle. P1 для keyboard use, виправлено |
| Стрілки на mobile проходили через центр тексту | На 320px контент займає більшу ширину; controls мають окрему нижню смугу | Лише mobile arrows перенесено вниз; темна підкладка controls, видимий global focus. Три слайди перевірено на 320px, CTA не перетинають нижні controls. P2, виправлено |
| `/contact#map` не має fragment-цілі | Local crawl: href на головній є, `id=map` у `/contact` відсутній | [Наявний wrapper карти](../../../app/(front)/contact/page.tsx): `id="map"` та responsive scroll-margin під fixed header. Browser navigation → саме wrapper із iframe; desktop top=180px, mobile margin=140px. Нових embed/полів немає. P2, виправлено |

HeroGradientImage у тому самому файлі також замінює pre-title h6 на абзац; решта цього компонента не переписана. CTA слайдера без href не породжує фальшивого `href="#"`. CMS CTA-дані й slug не змінювалися.

Механіка ротації звірена з [W3C Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) і [W3C Carousel Animations](https://www.w3.org/WAI/tutorials/carousels/animations/): керування ротацією, stop при фокусі, hover pause та приховування неактивного вмісту. Це застосування патерну, не твердження про повну WCAG відповідність.

### Перевірки й межі

**Production HTTP:** read-only crawl HTML-посилань, старт із 11 базових маршрутів та prerendered ministry/team details; 45 унікальних pathname + 5 query URL = 50 HTML GET 200. Обхід охопив усі 34 details, crawlable anchors header/footer/карток/Portable Text і query links, знайдені в цій вибірці. Усі цілі віддали 200; 51 fragment-посилання (включно зі skip-links і map) мають id у цільовому HTML. Додатково robots/sitemap 200 і `/team/seo-6-missing` 404 — **53 GET, 52×200/1×404**. Header noindex на всіх, meta noindex на 51 HTML; Disallow збережено, sitemap 0 URL. Тимчасові runner/results — ignored `.next/seo-6/`; довготривалі висновки тут. Це не обхід усіх можливих query-комбінацій, CMS revisions або зовнішніх адрес.

**Browser:** in-app browser, локальний production server на loopback; після sandbox timeout сервер перезапущено дозволеним способом. Desktop 1280×900, mobile 390×844 і 320×812. На головній перевірено один H1 після Enter/dot/arrow, pause click, keyboard play, focus stop, Tab/Shift+Tab без прихованих CTA, видимий focus; три mobile slides — без горизонтального переповнення/перетину CTA та controls. Після паузи слайд залишається тим самим між перевірками. Team detail: desktop дві колонки, mobile одна; один H1, Enter відкриває фото, після відкриття фокус на «Закрити», Escape закриває й повертає фокус до тригера. Tab після єдиної кнопки дає activeElement BODY, наступний Tab повертається на «Закрити»; фонові page links у цій послідовності фокусу не отримали. Повний modal focus audit лишається D8. В inspected home/team flows console errors не виявлено. Map href доводить target/scroll offset, не доступність стороннього Google iframe. Reduced-motion preference і synthetic empty/missing-href cases перевірені VM, не браузерною емуляцією; screen reader/zoom/всі devices не перевірялися.

**Регресії:** [check-heading-seo.mjs](../../../scripts/check-heading-seo.mjs) виконує справжній HeroSlider через transpile/VM зі state/effects mocks та React SSR: єдиний H1, inert slides, CTA без href, ручні переходи й wrap, focus/hover/reduced-motion timer gates, cleanup, pointer-focus pause race, один/нуль slides. Це не заміна browser React scheduler; pointer/keyboard flows окремо пройшли в браузері. [check-jsonld-seo.mjs](../../../scripts/check-jsonld-seo.mjs) тепер також перевіряє один team H1 із photo/null. Listing regression та 3 наявні `pnpm run test` перевірки — PASS.

**Інструменти навичок:** `seo_checker.py --url … --json` для `/` і team detail незалежно підтвердив 1 H1; залишкові heading skips не приховані. Його score/довжини metadata не є рейтингом Google, empty alt декоративного hero не є помилкою. `a11y_scanner.py` запущено на обох змінених UI-файлах: статичний regex не бачить dynamic Heading і layout main/nav/skip-link, тому його 4/3 повідомлення переглянуто як component-level false positives, а не названо чистим WCAG scan. `diff_surgeon.py --diff HEAD --json` — CLEAN на перевіреному diff.

Фінальний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 queries, TypeScript, 42/42 static-generation tasks. Lint/typecheck/3 наявні регресії/listing/jsonld/heading — PASS; старі Node localStorage/module.register і Browserslist warnings. Initial sandbox Sanity config EPERM та loopback timeout усунені дозволеними повторами. Root/header/page noindex, Disallow та порожній approval збережені; schemas/GROQ/package/lockfile/env/DNS/CMS/platform settings не змінені. Live deployment/Google index не засвідчені; F01 залишається відкритим. Commit/push SEO-6.1 не виконано — потрібна окрема згода за workflow §3.

### Наступні дії

1. **SEO-6.2:** наступний вузький юніт F11 — `/news` card/sidebar: актуальна ієрархія під PageHero, зрозумілі назви detail links (зокрема повторні «Читати далі»), keyboard/mobile/desktop QA. Спершу перевірити поточний код; не змінювати дизайн або CMS-контент заради тега.
2. **Залишок SEO-6:** team/ministry card headings, pre-titles OurVision/PastorGreeting, імена TestimonialsGrid, FAQ contact block і footer. Виконувати по 1–2 пов’язаних шаблони, додавати підетапи за потреби. Зелений H1 не закриває всі H1–H6. Видимий контраст breadcrumbs PageHero потребує окремої D8 перевірки.
3. **Окремо:** SEO-7 — виміряна швидкодія; повний D8; F01/platform access; реальний контент, домен, Search Console й запуск SEO-L. Placeholder біографії служителя з чужим ім’ям лишається редакційною залежністю, технічний H1 її не виправляє.

**Наступний SEO-6:** F11 — спочатку звірити актуальні H1/H2–H6 та crawlable links, потім 1–2 пов’язані підтверджені шаблони і вузький keyboard/mobile QA. Не оголошувати весь D8 завершеним і не починати performance SEO-7. Скіли seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs/handoff для контексту.

Завершальні перевірки: 7 UTF-8 документів, 64 локальні file/anchor targets і `git diff --check` — PASS. QA-сервер зупинено, порт 3004 без listener. Diff: 9 файлів застосунку + 1 regression + 7 документів; layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile без змін.

### Погоджена публікація SEO-5

Перед комітом повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks; старі Node/Browserslist warnings. UTF-8 7 документів і staged diff-check PASS; попередні lint/typecheck/3 регресії, обидві SEO-регресії й 57 GET уже пройшли на цьому коді.

Після локального QA користувач відповів «Так» на commit + push SEO-5 у `codex/seo-1-audit` 2026-10-26. Публікація охоплює 9 файлів застосунку, 1 regression та 7 документів; попередні згадки про відсутність згоди — стан до цієї відповіді. Свіжий fetch підтвердив HEAD/origin 0/0, Git Credential Manager — `Chekirko`. Точний SHA, remote SHA й чистота дерева перевіряються після push і наводяться у фінальному повідомленні. Merge/Production settings/env/DNS/CMS без змін; новий live deployment окремо не засвідчений. Наступний юніт — SEO-6.

## Порядок дій

1. **SEO-2 — локальні юніти завершено:** SEO-2.1 — матриця/політика, SEO-2.2 — noindex metadata/header та 66 локальних GET. F01: Production alias публічний за останнім live-аудитом, settings не перевірені; F02 реалізовано у SEO-4.1. Усі обмеження збережено.
2. **SEO-3 завершено локально:** defaults/static та чотири detail families перевірені; F07–F10 технічно закриті. Commit+push SEO-3.2 прямо погоджено користувачем; результат — у git history та фінальному повідомленні. Контентна готовність/live social preview не засвідчені.
3. **SEO-4 завершено локально:** SEO-4.1/4.2 технічно закрили F02/F03/F05/F06. Фінальні 154 GET і регресія helper/metadata/SSR/sitemap — PASS; approval порожній, noindex/Disallow збережено. Commit/push SEO-4.2 не виконано.
4. **SEO-5 завершено локально:** F04/null-photo та JSON-LD виправлені; 57 GET, tracked regression і Schema.org synthetic validation PASS. Google Rich Results Test заблокований вимогою login; факти/eligibility лишаються SEO-L.
5. **SEO-6 завершено локально, F11 технічно закрито:** усі відомі headings виправлені; fresh crawl, SSR і browser/keyboard PASS. Повний D8 окремо.
6. **SEO-7 завершено локально, F12 закрито у вузькому scope:** 30 production Lighthouse runs, hero delivery, mobile LCP −27,4% / desktop −26,9%, hero bytes −33,3%; повний D2/D9 та польові CWV не закриті. Далі D9 важких оригіналів служіння/галерей, D2 CSS/fonts і D8 label contrast/попередній залишок — окремими юнітами. [Метод і докази](#seo-7--2026-10-27).
7. **Редакційні залежності / SEO-L:** власник підтверджує факти й перелік готових сторінок; домен/Search Console/відкриття індексації — окреме фінальне рішення. До нього не прирівнювати технічний PASS до готовності контенту.
