# Master Plan — сайт церкви «Нове Життя»

> Архів попереднього плану. Чинний [master-plan](../../master-plan.md) замінив ці рішення 2026-10-27; цей файл зберігає історію.

**Публікація D2.1/D8.1 прямо погоджена 2026-10-27:** відповідь «Так» після QA дозволяє commit + push цих 12 файлів у `codex/seo-1-audit` за workflow §3; свіжий fetch HEAD/origin 0/0, Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду/відсутність commit+push — попередній стан. Результат — у git history та фінальному повідомленні; загальні D2/D8 відкриті, deployment не засвідчений.

**Актуально 2026-10-27 — D2.1/D8.1 завершені локально.** [Scope](../../specs/done/07-d2-d8-fonts-dialog.md), [звіт і межі](../../../docs/archive/seo-codex-2026-10/audit.md#d2-d8-2026-10-27). Font Awesome `swap`: audit 0→1 у всіх 3 runs, 72 exact icon comparisons; Performance 66→66/LCP 6,885→6,908 с, прискорення не доведено. Single-leader label 4,46→4,72:1; dialog 320/323→320/320 завдяки cap з урахуванням padding. 15 real-photo + 3 synthetic portrait geometry checks, single viewer/shared gallery, keyboard/focus restore, HTTP/build/lint/tsc/7 регресій PASS. Автоматичний ministry a11y 100 не є повним WCAG PASS. **Далі D2 render-blocking CSS/mobile LCP та решта D8.** D9 уже у HEAD `6b12965`; CMS/індексація без змін, commit/push цього юніту не виконані. Нижчі записи — історія.

**Публікація D9 прямо погоджена 2026-10-27:** відповідь «Так» після QA дозволяє commit + push погоджених 15 файлів у `codex/seo-1-audit` за workflow §3. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі D2/D8, live deployment окремо не засвідчений.

**Актуально 2026-10-27 — погоджений юніт доставки D9 завершено локально.** Користувач обрав оригінали всюди із завантаженням при наближенні. Мозаїки ministry/media — 400px observer + LQIP/noscript, сусіди lightbox після поточного фото; full-resolution/q=100 збережені. Три production mobile runs до/після: 34,42 → 5,87 МБ (−82,94%), оригінали 5→1; бал 72→71, прискорення не доведено. 33 exact geometry comparisons, browser/keyboard/HTTP/build/lint/tsc/регресії PASS. [Spec](../../specs/done/06-d9-photo-delivery.md), [звіт](../../../docs/archive/seo-codex-2026-10/audit.md#d9-2026-10-27). Видимі оригінали й перегляд усіх фото лишаються важкими; далі D2/D8. Для D8 знайдено modal overflow 3px на 320px за незмінних геометричних класів. Commit/push D9 потребують окремої згоди; нижчі вступи — історія.

**Публікація SEO-7 прямо погоджена 2026-10-27:** відповідь «Так» після QA дозволяє commit + push погоджених 10 файлів у `codex/seo-1-audit` за workflow §3. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі D9/D2/D8, live deployment окремо не засвідчений.

**Актуально 2026-10-27 — SEO-7 завершено локально.** [Production baseline, F12 і QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-7--2026-10-27), [метрики](../../../docs/archive/seo-codex-2026-10/performance-2026-10-27.json). 30 зіставних Lighthouse runs: mobile LCP головної 9,47 → 6,87 с (−27,4%), desktop 1,79 → 1,31 с (−26,9%); hero bytes −33,3%. Один HeroSlider переведений на Next Image з initial high-priority preload та cover-aware sizes; UI/повнорозмірні галереї збережено. Build/SSR/HTTP/browser перевірені; це не польові CWV і не закриття всього D2/D9. Додатково служіння зі скриншота користувача: 34,41 МБ у локальному Lighthouse; D8 label contrast 4,46:1; SEO 69 через чинний noindex/Disallow, BP 100. Далі окремо D9 (важкі оригінали без зниження погодженої якості), D2 (CSS/fonts/LCP), D8. F01 і SEO-L відкриті; commit/push SEO-7 потребують окремої згоди. Нижче — історія SEO-6.

**Публікація SEO-6 final прямо погоджена 2026-10-27:** відповідь користувача «Так» після підсумкового QA дозволяє commit + push 5 файлів застосунку, 1 CMS-скрипта та 6 документів у `codex/seo-1-audit`. Свіжий fetch HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-7, live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6 завершено локально, F11 технічно закрито.** На пряме доручення завершено весь залишок у цій сесії: contact/media/photos headings та один CMS event H4 → H2. Fresh crawl 50 HTML/34 published details/202 blocks, 60 GET/51 fragments: один H1, без heading skips і битих HTML/fragment цілей. 9 SSR fixtures, 75 точних зіставлень typography/розмірів на 1280/390/320px, browser/keyboard, build/lint/typecheck/6 регресій PASS. [Докази](../../../docs/archive/seo-codex-2026-10/audit.md#seo-6-final--2026-10-26). Далі SEO-7; повний D8, F01 і SEO-L відкриті. Noindex/Disallow/порожній approval збережені; commit/push не виконано, live deployment не засвідчений. Нижчі вступні блоки — історичний стан.

**Публікація SEO-6.10 прямо погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push 1 файла застосунку та 6 документів у `codex/seo-1-audit`. Свіжий fetch HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижча згадка про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-6.11. Live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6.10 локально завершено.** [History headings і QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-610-заголовки-хронології-та-cta-історії--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Timeline H4 → H3, CTA H4 → H2: два рядки одного файла застосунку, усі класи збережені. 14 SSR fixtures, 6 production GET (5×200/1×404), 21 exact typography comparisons на 1280/390/320px, keyboard/CTA/photo, build/lint/typecheck/6 регресій PASS. Наявний невидимий focus timeline summary переданий D8; повний a11y не закрито. **Далі SEO-6.11 — contact headings**, потім media/photos, погоджений CMS event H4 fix і fresh crawl. F11/SEO-6, D8, SEO-7, F01 і SEO-L відкриті. Commit/push цього юніту не виконано — окрема згода за [workflow §3](../../ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). CMS/settings/noindex/Disallow/порожній approval збережено; live deployment не засвідчений. Нижчі блоки — історичний стан.

**Публікація SEO-6.9 прямо погоджена 2026-10-26:** відповідь користувача «так» після локального QA дозволяє commit + push 2 файлів застосунку та 6 документів у `codex/seo-1-audit`. Свіжий fetch HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Нижчі згадки про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-6.10. Live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6.9 локально завершено.** [Events headings і QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-69-заголовки-списку-подій--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Sidebar/CTA/empty-state → H2 зі збереженням усіх класів: 5 замінених рядків у 2 файлах застосунку. 5 before/after SSR fixtures + page 2/notFound, 9 GET, 12 exact typography comparisons, keyboard/Enter/1280–390–320px, build/lint/typecheck/6 регресій PASS. Noindex/Disallow/порожній approval збережено; CMS/settings без змін. **Далі SEO-6.10 — history timeline/CTA**, потім contact/media/photos, погоджений CMS fix і повторний crawl. F11/SEO-6, D8, SEO-7, F01/SEO-L відкриті. Commit/push SEO-6.9 потребує окремої згоди за workflow §3. Нижчі записи — історичний стан; live deployment не засвідчений.

**Публікація SEO-6.8 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push 4 документів після локального QA. Гілка `codex/seo-1-audit`; свіжий fetch HEAD/origin 0/0, Git Credential Manager — `Chekirko`. Нижча згадка про ще потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; далі SEO-6.9. Live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6.8 локально завершено.** [Свіжий heading crawl і залишок F11](../../../docs/archive/seo-codex-2026-10/audit.md#seo-68-свіжий-heading-crawl-f11--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). 50 HTML-сторінок, 34 published details/202 rich-text блоки; 60 GET (54×200/6×404), 51 валідна fragment-ціль. Один H1 на 52 успішних HTML. **F11/SEO-6 частково відкриті:** history/contact/events/media та CMS event H4, source-only empty events/photos. **Далі SEO-6.9 — events sidebar/CTA/empty-state**; потім окремо history/contact/media й погоджений CMS fix, повторний crawl після виправлень. Build/lint/typecheck/6 регресій PASS, browser ranks/overflow 1280/390/320px перевірені. Один початковий hydration #418 не повторився на п'яти цільових сторінках; follow-up D8. Лише 4 документи, код/CMS/settings без змін, noindex/Disallow/порожній approval збережено. D8/SEO-7/F01/SEO-L відкриті, live deployment не засвідчений. Commit/push SEO-6.8 потребує окремої згоди за workflow §3. Нижчі блоки — історичний стан.

**Публікація SEO-6.7 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижча згадка про ще потрібну згоду — попередній стан. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат — у git history та фінальному повідомленні; далі SEO-6.8. Merge/Production settings без змін, live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6.7 локально завершено.** [Результат і QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-67-заголовки-детальної-сторінки-служіння--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Ministry detail sidebar/CTA → H2; single leader → H3; multiple group → H3 зі збереженим Roboto, імена H4; фото в leader links не дублюють accessible name. Один файл застосунку / 8 змінених рядків. Фінальні build/typecheck/lint/регресії, 10 SSR fixtures + notFound, 26 GET (15 ministry details і sidebar/leader targets), exact typography на 1280/390/320px та keyboard/browser QA — PASS. **Далі SEO-6.8 — окремий свіжий heading crawl F11**, потім оцінити завершення F11/SEO-6. Повний D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено; CMS/settings без змін, live deployment не засвідчений. Старт чистий `4272e9b`; commit/push SEO-6.7 потребує окремої згоди за workflow §3. Нижчі записи — історія попередніх юнітів.

**Публікація SEO-6.6 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; далі SEO-6.7. Merge/Production settings без змін, live deployment окремо не засвідчений.

**SEO-6.6 локально завершено 2026-10-26:** [реалізація й QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-66-заголовки-футера--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Три групи ChurchFooter H4 → H2, зі збереженим `footer-title`; три рядки одного компонента. 6 SSR fixtures/16 GET, точна typography на 1280/390/320px, Tab/Shift+Tab/Enter, build/typecheck/lint/регресії — PASS. Далі SEO-6.7 — ministry detail sidebar/CTA/leader headings (single/multiple), потім окремий свіжий heading crawl. F11 частковий; D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено. Commit/push SEO-6.6 потребує окремої згоди за workflow §3; нижчі блоки — історія попередніх юнітів.

**Публікація SEO-6.5 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push після локального QA. Погоджено 2 файли застосунку та 6 документів у `codex/seo-1-audit`; нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; далі SEO-6.6. Merge/Production settings без змін, live deployment окремо не засвідчений.

**Актуально 2026-10-26 — SEO-6.5 локально завершено.** [Результат і QA](../../../docs/archive/seo-codex-2026-10/audit.md#seo-65-підписи-відгуків-і-контактний-заголовок-faq--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). TestimonialsGrid names H6 → p зі збереженою typography; FAQSplit contact H4 → H3 (`text-h4`). 2 рядки у 2 компонентах, 6 SSR fixtures/6 GET, computed styles на 1280/390/320px, keyboard/CTA та build/lint/typecheck/регресії PASS. **Далі SEO-6.6 — footer headings**, потім ministry detail headings окремим юнітом і свіжий heading crawl. F11 частковий; D8 (зокрема FAQ disclosure semantics/nav landmark), SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено. Старт чистий `6c9ce1a`; commit/push SEO-6.5 потребує окремої згоди за workflow §3. Нижчі блоки — історичний стан; live deployment не засвідчений.

**Публікація SEO-6.4 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push після локального QA. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений. Далі SEO-6.5.

**Актуально 2026-10-26 — SEO-6.4 локально завершено.** [Результат, QA та передача](../../../docs/archive/seo-codex-2026-10/audit.md#seo-64-надзаголовки-ourvision-і-pastorgreeting--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). OurVision/PastorGreeting pre-titles H6 → абзаци з явним `font-heading`; typography до/після точно збігається на 1280/390/320px. 2 файли застосунку, 6 SSR fixtures, 6 GET, keyboard/mobile/desktop QA, build/lint/typecheck/штатні та SEO-регресії PASS. **Далі SEO-6.5 — TestimonialsGrid names та FAQSplit contact block**; footer і ministry detail headings окремими юнітами. F11 частковий, D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено. Старт чистий `8fc6bea` з опублікованим SEO-6.3; commit/push SEO-6.4 потребує окремої згоди за workflow §3. Нижчі блоки — історичний стан; live deployment не засвідчений.

**Публікація SEO-6.3 прямо погоджена 2026-10-26:** користувач відповів «так» на commit + push після локального QA. Нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений. Далі SEO-6.4.

**Актуально 2026-10-26 — SEO-6.3 локально завершено.** [Результат, QA та передача](../../../docs/archive/seo-codex-2026-10/audit.md#seo-63-картки-служителів-і-служінь--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Team/honorary/ministry cards мають H3 під секційними H2, фото не дублюють назви посилань; дизайн збережено. 3 файли застосунку, 11 SSR fixtures, 32 GET, browser 1280/390/320px, build/lint/tsc/наявні та SEO-регресії PASS. **Далі SEO-6.4 — OurVision/PastorGreeting pre-titles**; потім Testimonials/FAQ/footer і ministry detail headings окремими юнітами. F11 частковий; D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено, CMS/settings без змін. Старт `9c1816c`, commit/push SEO-6.3 потребує окремої згоди за workflow §3. Нижчі записи — попередній стан.

**Актуально 2026-10-26 — SEO-6.2 локально завершено.** [Результат, QA та передача](../../../docs/archive/seo-codex-2026-10/audit.md#seo-62-картки-новин-і-sidebar--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). `/news` card/sidebar/empty-state H2, конкретні назви detail links, фото-focus та active-category semantics; 16 GET, SSR fixtures, browser 1280/390/320px, build/lint/tsc/наявні та SEO-регресії PASS. **Наступний SEO-6.3 — team/ministry card headings** у межах 1–2 шаблонів. Решта section/footer F11, повний D8/SEO-7/F01/SEO-L відкриті. Noindex/Disallow/порожній approval збережено. Старт `66a13a5` містить SEO-6.1; commit + push SEO-6.2 прямо погоджені відповіддю «так» після QA. Результат — у git history та фінальному повідомленні. Нижчі блоки — попередній стан, live deployment не засвідчений.

## Активна SEO-ініціатива до завершення контенту — 2026-10-26

**Публікація SEO-6.1 погоджена:** користувач відповів «Так» на commit + push у `codex/seo-1-audit` після локального QA 2026-10-26. Нижчі згадки про потрібну згоду — попередній стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений. Наступний юніт — SEO-6.2.

**Поточний стан — SEO-6.1 локально завершено (2026-10-26).** [Звіт і передача](../../../docs/archive/seo-codex-2026-10/audit.md#seo-61-заголовки-hero-і-служителя--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). Один H1 головної/11 team details, доступне керування hero та target #map; 53 GET/51 fragments, browser 320/390/1280px, build/lint/typecheck/регресії PASS. **Наступний SEO-6.2 — `/news` card/sidebar**, далі решта F11 окремими юнітами. Весь SEO-6/D8/SEO-7 не закрито; noindex/Disallow/порожній approval збережено. CMS/env/settings без змін. Commit/push SEO-6.1 не виконано, потрібна згода за workflow §3; live deployment не засвідчений.

**Публікація SEO-5:** на старті SEO-6.1 чистий HEAD `89fb6ec` у `codex/seo-1-audit`; нижчі згадки про ще непогоджену публікацію SEO-5 — історичний стан. Merge/Production settings без змін.

**Попередній стан SEO-5 (2026-10-26): локально завершено.** [Звіт і передача](../../../docs/archive/seo-codex-2026-10/audit.md#seo-5-json-ld-і-null-посилання--2026-10-26), [spec](../../specs/done/05-prelaunch-seo.md). F04/null-photo, безпечний JSON-LD із видимих даних, узгоджені URL/ID та media script синхронний із cards state. 57 GET + tracked regression detail/gallery PASS; Schema.org synthetic 0 errors/0 warnings, Google test потребує login. Build/lint/typecheck/3 наявні регресії + обидві SEO-регресії PASS. **Наступний SEO-6 — F11: заголовки/посилання, 1–2 шаблони й вузький mobile/keyboard QA**; повний D8 і SEO-7 не закриті. Noindex/Disallow/порожній approval збережено, CMS/env/settings без змін. F01/факти/eligibility/launch SEO-L відкриті, live deployment не засвідчений. Commit/push SEO-5 ще не погоджені; нижчі записи SEO-4 описують історичний стан.

**Публікація SEO-4.2 погоджена:** після QA користувач відповів «Так» на commit+push у `codex/seo-1-audit` 2026-10-26. Нижчі згадки про непогоджену публікацію — стан до цієї відповіді. Свіжий fetch підтвердив HEAD/origin 0/0, Git Credential Manager — `Chekirko`; точний результат — у git history та фінальному повідомленні. Merge/Production settings не змінюються, новий live deployment не перевірений. Наступний юніт — SEO-5.

**Публікація SEO-4.1:** після локального QA користувач прямо погодив commit+push у `codex/seo-1-audit` 2026-10-26; на старті SEO-4.2 чистий HEAD `ee4f15e`. SEO-4.2 завершено локально, його commit/push прямо погоджені користувачем. Merge/Production settings не змінюються; live deployment не перевірений. Наступний юніт — SEO-5.

Користувач погодив технічну SEO-підготовку окремими сесіями до заповнення всіх служінь/служителів і виправлення історії. Специфікація, межі, критерії завершення та передача роботи: [05-prelaunch-seo.md](../../specs/done/05-prelaunch-seo.md). Це деталізація частин A4/D2/D3/D8/D9, без автоматичного закриття цих пунктів або A3/D1.

Порядок: **SEO-1 аудит → SEO-2 pre-launch захист → SEO-3 metadata/OG → SEO-4 URL/canonical/sitemap → SEO-5 JSON-LD → SEO-6 заголовки/посилання → SEO-7 виміряна швидкодія**. **SEO-0–SEO-6 завершено локально; далі SEO-7.** F02–F11 технічно закриті у перевіреному обсязі. Весь залишок SEO-6 виконано в одній сесії за прямим дорученням користувача; загальний ліміт сесій не змінюється. Approval порожній, sitemap 0 URL; root/header noindex та Disallow збережено. Noindex не є контролем доступу: F01/platform settings лишається відкритим. Реальний контент, домен, Search Console й індексація — SEO-L за окремим рішенням; чинні launch/governance правила збережено.

**Studio feedback — пакетний Select і timeout (2026-10-25):** до галереї новини додано вибір кількох наявних assets через окремий діалог (checkboxes, пошук, порції 40, native `onInsert`, максимум 10, без повторів). Upload/Select стали виразними Sanity UI кнопками з hover/focus/pointer. Для recoverable 45s heartbeat reconnect — вузький pnpm patch рівня logging, без зміни retry/auth/CORS. Перевірки та межі live CMS QA зафіксовані у progress-tracker; публікацію не погоджено.

> **Єдиний консолідований план проєкту.** Поєднує (1) усі правила/governance, (2) увесь незавершений backlog (Tier A–E + залишки специфікацій + дрібні TODO), (3) launch checklist. Замінює попередній `improvement-roadmap.md` і розрізнені scratch-плани. Повний канон процес-правил — `ai-workflow-rules.md`; жива хроніка стану — `progress-tracker.md`.

## Стан на момент консолідації (2026-06-21)

**Завершений юніт (2026-10-25):** за прямим запитом користувача — обов’язкове основне фото новини + до 10 необов’язкових додаткових, окрема галерея після тексту `/news/[slug]` із повними кадрами різних пропорцій. Схема й серверний UI реалізовані; build, ESLint, Sanity validators та responsive browser QA ✓. Подробиці — у `progress-tracker.md`; commit/push ще не виконано.

**Уточнення користувача — завершено (2026-10-25):** пакетний native multiple picker у Studio (`GalleryInput`, штатний upload, максимум 10); full-resolution `q=100` + `unoptimized` для контентних фото; спільний повноекранний лайтбокс зі стрілками (`PhotoViewer`/native-dialog `ImageLightbox`) для news/event/ministry/team, rich text, history і групового фото команди. Browser QA, TypeScript, targeted ESLint і фінальний `pnpm run build` (41 сторінка) ✓. Публічний Sanity CDN не гарантує побітового оригіналу (`dlRaw` потребує auth); повну роздільність і максимальну якість перевірено вимірюванням. Подробиці/межі QA — у `progress-tracker.md`; commit/push не виконано.

**Виправлення після реального Studio feedback (2026-10-25):** `GalleryInput` помилково залежав від відсутнього `onUpload` і блокував picker. Переведено на фактичний `onSelectFile`/asset-source API Sanity 4.22; regression check без legacy callback PASS, build 41 сторінка ✓. Попередній mock `onUpload` не був підтвердженням роботи в Studio. Live authenticated upload ще не виконувався (IAB має окремий login); описано в progress-tracker. Публікація лишається непогодженою.

Next.js 16 (App Router) + Sanity v3 + Tailwind v4, Vercel, лише укр., **pre-launch** (`app/robots.ts` = `Disallow: /`, плейсхолдери `noindex`).

**Зроблено (Фази 0–2 ✅):** Foundation (env/`SITE_URL`, robots/sitemap, church-дані, JSON-LD Church/WebSite); повна контент-модель + головна повністю в CMS (singletons `siteSettings`/`homepage`/`pageHeroes`, модель `event` = події+оголошення, Portable Text для news/event/ministry/team, JSON-LD NewsArticle/Event/Person/FAQPage/BreadcrumbList); a11y + WCAG AA (focus-visible, skip-link, keyboard nav, контраст сірих+кнопок, `next/image` героі, self-host Font Awesome); реорг головної + сторінка **/about** (контент готовий, CMS-singleton — follow-up B1); A4-аудит (S2 екранування JSON-LD, canonical на 11 маршрутах, security headers enforce + CSP Report-Only).

**Не розпочато:** Tier A-залишок, Tier B (нові сторінки), Tier C (інтеграції/харденінг), Tier D (best-practice), Tier E (розширення).

---

# Частина 1 — Правила та Governance

> Стислий виклад. Повний канон — `ai-workflow-rules.md` (Working Agreement, Scoping, Handling Missing Requirements, Protected Files, Encoding Safety, DoD). Реєстр скілів — `AGENTS.md`.

## Working Agreement (узгоджено 2026-06-19)
1. **Karpathy завжди.** Перед будь-яким кодовим юнітом застосовувати 4 принципи (припущення вголос → простота → хірургічні зміни → перевіряльні цілі). Always-on.
2. **Гейт перед кожною фазою.** Показати користувачу перелік пунктів фази і ЗАПИТАТИ, що саме робити. Не починати без явного вибору.
3. **Коміт/пуш-гейт після кожного етапу.** Після завершеного юніту ЗАПИТАТИ про commit + push; виконувати лише за згодою (push як **Chekirko**).
4. **Індексація — найостанніший крок.** Відкриття пошукової індексації — фінальна дія всього проєкту, лише за явним «готово» (див. Частину 3).
5. **Контекст у синхроні.** Дописувати зміни в усі релевантні `context/*.md` за доменом (architecture/ui-context/code-standards/project-overview), не лише `progress-tracker.md`.
6. **Спершу — план у контекст.** Будь-яка нова велика ініціатива спершу фіксується тут (`master-plan.md`) / spec у `context/specs/`, і тільки тоді починається робота.

## Scoping
- **1–2 юніти за сесію** (узгоджено 2026-10-24), послідовно, із перевіркою та записами в документацію після кожного. Великі пункти backlog розбивати на під'юніти; правила скілів і commit/push лишаються чинними.
- Один feature-юніт за раз; малі перевіряльні інкременти замість великих спекулятивних змін.
- Не поєднувати в одному кроці: UI + Sanity-схему; кілька непов'язаних сторінок; створення нового + рефакторинг наявного.
- Якщо зміну не можна швидко перевірити end-to-end — scope завеликий, розбити.

## Critical rules (override default behaviour)
- **pnpm only** — ніколи npm/yarn.
- **Windows:** довгі команди в `cmd /c "pnpm run build"` (інакше агент зависає на «Running…»).
- **Weak references:** усі `reference`-поля в Sanity-схемах ЗАВЖДИ `weak: true` + null-guard у компоненті; типи `| null`.
- **Encoding:** ніколи не писати кирилицю через PowerShell pipe/`Out-File`/`>` — лише editor-інструменти.
- **TypeGen:** після зміни Sanity-схем чи GROQ — `pnpm typegen` (потрібен `SANITY_AUTH_TOKEN`/`SANITY_API_WRITE_TOKEN`; `next build` сам пропускає schema-extract і пропустить проблеми Studio).
- **Lazy skill loading:** перед задачею завантажити відповідний `.agents/skills/*/SKILL.md` за реєстром в `AGENTS.md`.
- **Context7** (`.agents/rules/usecontext.md`): перед написанням коду з бібліотеками тягнути актуальну документацію.
- **Protected files** (не чіпати без явного дозволу): `sanity/lib/sanity.types.ts`, `schema.json`, `app/studio/`, `sanity.config.ts`, `app/globals.css`.

## Definition of Done (перед наступним юнітом)
1. Юніт працює end-to-end у своєму scope; жоден інваріант `architecture.md` не порушено.
2. `progress-tracker.md` оновлено; релевантні context-файли синхронізовано.
3. `pnpm run build` ✓; без TS-помилок у змінених файлах; без console-помилок; адаптив mobile+desktop.
4. Завантажено й застосовано відповідні скіли (schema-markup для JSON-LD, a11y для UI, performance для зображень/бандла тощо).
5. **SEO-синхронізація:** нова публічна сторінка / новий Sanity-тип із detail-маршрутом → оновлено `STATIC_SEO_ROUTES` у `lib/seo-readiness.ts` або гілку/мапінг `SITEMAP_QUERY` і спільний критерій detail family. Реєстрація маршруту не є схваленням: noindex зберігається, URL поза sitemap до редакційного схвалення й окремого рішення SEO-L за спільним критерієм metadata/sitemap. Нова indexable-сторінка НЕ «done», поки не в sitemap (або свідомо виключена з нотаткою).

---

# Частина 2 — Незавершений backlog

**Теги:** `[BLOCKER]` блокує запуск · `[PLAN]` у плані · `[ENH]` покращення в scope · `[SCOPE+]` поза первісним scope (поштучно). **Зусилля:** S ≈ пів дня · M ≈ 1–2 дні · L ≈ 3+ днів. «Скіл» = який `SKILL.md` завантажити.

## Tier A — Блокери запуску

| # | Юніт | Тег | Скіл | Зус. | Суть | Стан |
|---|------|-----|------|------|------|------|
| A1 | **Логотип** | BLOCKER · PLAN | schema-markup | S | Є EPS, нема SVG/PNG. Ассет від замовника → хедер/футер (замість кружечка «НЖ») + `Organization.logo`/`publisher.logo` у JSON-LD. | ⛔ чекає на ассет |
| A2 | **Бренд-контраст** | ✅ DONE | a11y-audit · senior-frontend · karpathy-coder | M | **A2.1:** `--color-primary-text #216e4e` для тексту/посилань/фокусу (6.17:1 на білому), видимий контур полів. **A2.2:** `.bg-grad-readable` для CTA/бейджів/карток (білий текст ≥4.89:1 на кінцях градієнта), темніший `.gradient-text`, читабельні білі кнопки, двоколірний фокус. Декоративний градієнт збережено. | ✅ 2026-10-24; обидві збірки ✓, browser QA; повний a11y-аудит лишається D8 |
| A3 | **Реальний контент** | PLAN | content-creator | M | Legacy-події без `startDate`/`type` (приховані); унікальні фото галерей служінь; реальні свідчення/FAQ/stats; тексти /about (фінал), /media, /give. Контент у /studio, не код. | ⛔ контент від замовника |
| A4 | **Pre-launch SEO/perf/security-прохід** | PLAN | seo-audit · performance-profiler · security-guidance | M | Аудит ✅ зроблено (S2, canonical×11, security headers). **Залишок:** CSP **Report-Only → enforce** після runtime-смоук (скрипти/Sanity-зображення/Google Maps/Studio); виставити `NEXT_PUBLIC_SITE_URL` на власний домен у Vercel. Відкриття індексації тут НЕ робиться. | 🔄 частково (CSP enforce лишився) |

## Tier B — Нові сторінки (УЗГОДИТИ дизайн першим)

| # | Юніт | Тег | Скіл | Зус. | Суть / нові артефакти | Стан |
|---|------|-----|------|------|------|------|
| B1 | **/about — CMS-редагування** | ✅ DONE | senior-frontend · schema-markup | M | Singleton `aboutPage` (structure.ts + SINGLETON_TYPES + seed `seed:about`) тримає УВЕСЬ контент /about — і заголовки секцій, і текст (hero, хто ми+місія, історія[], віровчення[], цінності[], «чого очікувати»[], керівництво, заголовки stats, фінальний CTA). `getAboutPage()` (`lib/about.ts`) зливає поверх `ABOUT_FALLBACK` поле-за-полем. Числа stats — з `homepage.stats`. (done 2026-06-21) | ✅ DONE |
| B2 | **/media — проповіді + трансляції** | PLAN | senior-fullstack · schema-markup | L | **Нова Sanity-схема `sermon`** (серія, спікер→`teamMember` weak-ref, дата, Писання, YouTube/audio, нотатки Portable Text). Сторінка-архів + фільтри (дзеркало `news/`), live-embed, секція «остання проповідь» на головній, VideoObject JSON-LD. Зареєструвати тип у `schemaTypes/index.ts` + structure + sitemap-гілка + `pageHeroes.mediaHero`. **Реалізовано як `mediaItem`** (медіатека з табами, не окремий `sermon`; `speaker`=ручний рядок; модаль-лайтбокс замість detail; live-банер авто через YouTube Data API). | ✅ DONE — Етапи 1–2 (схема+UI+авто-live, 2026-06-23); **Етап 3** (2026-06-24): масштабування на тисячі відео — серверний пошук (GROQ `match`)/фільтр/`count`, кнопка «Завантажити ще» через Server Action (slice-пагінація 12/порція), поле `tags`, секція «остання проповідь» на головній. `/media` тепер dynamic (`ƒ`). Лишилось (дії замовника): `YOUTUBE_API_KEY`+ID каналу для live; прибрати демо-`mediaItem`. |
| B3 | **/give — пожертви/реквізити** | PLAN · містить SCOPE+ | security-guidance | M | Банківські реквізити + примітка прозорості. `[SCOPE+]` monobank-банка (лінк/QR). Без обробки платежів на сайті. Зняти `noindex` + sitemap + `pageHeroes` ключ. | ⬜ не розпочато |
| B4 | **Секції головної з Фази 3** | PLAN | senior-frontend | M | ~~«Актуальне слово» (з B2; ручний вибір `homepage.featuredSermon`, внизу сторінки)~~ ✅ (2026-06-25), «Сплануй візит», Telegram/соц-стрічка. CMS-групи в singleton `homepage` (патерн hero/faq/featured). | 🔄 «Актуальне слово» done; решта не розпочато |

## Tier C — Інтеграції та харденінг

| # | Юніт | Тег | Скіл | Зус. | Суть | Стан |
|---|------|-----|------|------|------|------|
| C1 | **Справжня контактна форма** | PLAN | security-guidance · senior-fullstack | M | Погоджено 2026-10-25 після merge PR #1; користувач обрав Resend. Server Action + Zod + honeypot + атомарний Upstash rate-limit + plain-text email. Одержувач із CMS/env, visitor email лише Reply-To; без записів звернень у CMS/logs. `docs/contact-form.md`, spec `04-contact-delivery.md`. | 🔄 Код і перевірки готові; 2026-10-25 користувач підтвердив роботу Preview та погодив commit/push. PR #2 ще draft, не merged; Production-активація окремо |
| C2 | **CSP enforce** | PLAN | security-guidance | S–M | Перемкнути `Content-Security-Policy-Report-Only` → enforce у `next.config.ts` після runtime-смоук. Будь-який новий embed/скрипт → оновити відповідний source-list (`frame-src`/`img-src`/`connect-src`). | 🔄 Report-Only активний |
| C3 | **Sanity webhook → on-demand revalidation** | PLAN | senior-fullstack | M | `revalidateTag`/`revalidatePath` замість лише ISR-60. Route handler + GROQ-projection webhook. | ⬜ |
| C4 | **CI-пайплайн** | PLAN | ci-cd-pipeline-builder | M | GitHub Actions: frozen install → lint → Sanity/Next typegen + TypeScript → регресії (2 Studio + контактна C1) → build. Один cached job, PR/master, cancellation. Захист master увімкнено: PR + required Quality checks + актуальна гілка, також для admin; 0 обов'язкових reviewers. `docs/ci.md`. | ✅ PR #1 злитий 2026-10-25; production success |
| C5 | **Гігієна env/секретів** | ENH | env-secrets-manager | S | Аудит токенів, `.env.example`, ротація, перевірка на витоки (`env_auditor.py`). | ⬜ |

## Tier D — Best-practice (в межах scope)

| # | Покращення | Тег | Скіл | Зус. | Суть |
|---|-----------|-----|------|------|------|
| D1 | **Аналітика + Search Console + Google Business Profile** | ENH | seo-audit | S | Privacy-friendly аналітика (Vercel/Plausible/Umami); верифікація GSC; GBP критичний для локального пошуку. |
| D2 | **Performance → Lighthouse ≥90 / зелені CWV** | ENH | performance-profiler | M | SEO-7 закрив F12 доставки hero. D2.1: локальні FA6 faces `swap`, font-display audit PASS у 3 runs; median 66→66/LCP 6,885→6,908 с — прискорення не доведено. Далі render-blocking CSS/mobile LCP, ≥90 і польові CWV. [Докази](../../../docs/archive/seo-codex-2026-10/audit.md#d2-d8-2026-10-27). |
| D3 | **Поглиблення SEO/AEO** | ENH | seo-audit · schema-markup | M | Повний LocalBusiness/Church NAP+geo+openingHours; динамічні OG (`next/og`); FAQ/HowTo «сплануй візит»; готовність до AI-відповідей. |
| D4 | **Календар подій + «додати в календар»** | ENH | senior-frontend | M | Вид-календар для `/events`, генерація `.ics`, повторювані події. На базі моделі `event`. |
| D5 | **Пошук по сайту** | ENH | senior-frontend | M | GROQ-пошук по news/events/ministries або Pagefind. |
| D6 | **Моніторинг помилок + uptime** | ENH | security-guidance | S | Sentry (frontend+server actions) + uptime-пінг. |
| D7 | **Цільові автотести** | ENH | ci-cd-pipeline-builder | M–L | Уже є 2 регресії Studio (gallery callback/controls і SSE reconnect), підключені в C4. Далі — тести конкретних багів/критичної логіки; Vitest/Playwright додавати лише за обґрунтованої потреби. |
| D8 | **Повний a11y-прохід** | ENH | a11y-audit | M | D8.1 закрив single-leader label contrast (4,72:1) і photo dialog overflow (320/320): 18 geometry checks, automated ministry a11y 100. Повний WCAG PASS не заявляється. Далі FAQ disclosure/nav landmark/breadcrumb contrast/sidebar visual/DOM order, history `summary.outline-none`, media load-more disabled→body focus і #418 follow-up; загальний прохід усіх сторінок/форм/ARIA лишається. [QA](../../../docs/archive/seo-codex-2026-10/audit.md#d2-d8-2026-10-27). |
| D9 | **Медіа-оптимізація** | ENH | performance-profiler | S | Погоджений юніт доставки завершено локально: оригінали всюди, 400px observer у ministry/media мозаїках, сусіди lightbox після поточного фото; 34,42→5,87 МБ стартового трафіку (−82,94%), 5→1 original requests. Видимий оригінал, повний перегляд усіх фото й інші full-resolution шаблони лишаються важкими; адаптивні прев’ю користувач не обрав. D2/D8 окремо, score/CWV цілком не закриті. [Докази](../../../docs/archive/seo-codex-2026-10/audit.md#d9-2026-10-27). |

## Tier E — Розширення поза первісним scope (вирішувати поштучно)

| # | Можливість | Тег | Скіл | Зус. | Чому варто |
|---|-----------|-----|------|------|-----------|
| E1 | **Онлайн-пожертви через monobank-банку** | SCOPE+ | senior-fullstack | M | Стандарт де-факто в Україні; лінк/QR/віджет без обробки платежів. Поєднати з B3. |
| E2 | **Форма молитовних потреб** | SCOPE+ | security-guidance | M | Server action → приватний email служителям або закритий Sanity-тип. |
| E3 | **Форма волонтерства/служіння** | SCOPE+ | security-guidance | M | Запис охочих служити; зв'язати зі служіннями. |
| E4 | **Реєстрація/RSVP на події** | SCOPE+ | senior-fullstack | M | Для подій з обмеженими місцями; розширює модель `event`. |
| E5 | **Email-розсилка** | SCOPE+ | content-creator | M | Double-opt-in (Brevo/Mailchimp/Sender). |
| E6 | **Мультимовність (uk + ru/en)** | SCOPE+ | senior-fullstack | L | next-intl + Sanity i18n + hreflang. Окрема велика ініціатива. |
| E7 | **PWA / офлайн-оболонка** | SCOPE+ | senior-frontend | M | Інсталюваність, офлайн-кеш. |
| E8 | **Подкаст проповідей (RSS)** | SCOPE+ | content-creator | S–M | RSS із моделі `sermon` (B2) → Spotify/Apple. |
| E9 | **«Сплануй візит» інтерактив** | SCOPE+ | landing-page-generator | M | Що очікувати, паркінг, діти, час; знижує бар'єр першого візиту. |
| E10 | **Девоційні/блог/план читання** | SCOPE+ | content-creator | M | Регулярний контент → утримання + SEO. |
| E11 | **Швидкий контакт (Telegram/WhatsApp-кнопка)** | SCOPE+ | senior-frontend | S | Плаваюча кнопка месенджера. |

## Залишок специфікацій (`context/specs/00-build-plan.md`)
- **Gallery Audit** — унікальні фото для кожного служіння (Sanity content update; перетин з A3). Решта Upcoming Units із 00-build-plan (Contact, Hero Unification, Team, Media, About) — виконані, крім Media (= B2).

## Дрібні TODO / Open Questions
- **Статистика застаріла:** «19+ років» на /about — церква заснована **1991** (не 2005) → ~33 р. Оновити в /studio (`homepage.stats`).
- **/history таймлайн** починається з **1992**, реальне заснування — **1991** → звірити з замовником і узгодити.
- **/about чернетки:** цінності + «чого очікувати» — драфти, замовник поредагує (перетин з B1, коли буде singleton).
- **Legacy-події:** наявні демо-події без `startDate`/`type` → відфільтровані всюди (graceful). Менеджер заповнює дату/тип у /studio (pre-launch) або створює нові.
- **publisher.logo** у NewsArticle JSON-LD відсутнє (немає лого-ассета) → додати після **A1**.
- **Footer slug служінь** уже динамічні з Sanity (вирішено в 0.2); координати, email, openingHours, per-page heroes — вирішені (див. `progress-tracker.md` → архів).
- **Build/typegen:** `sanity schema extract` потребує Sanity CLI auth — локально виставити `SANITY_AUTH_TOKEN` (з `SANITY_API_WRITE_TOKEN`) перед `pnpm build`/`pnpm typegen`, інакше `CorsOriginError`. Vercel має власну auth.

---

# Частина 3 — ⚠️ Launch checklist (НАЙОСТАННІШИЙ крок проєкту)

Виконувати ТІЛЬКИ коли користувач явно скаже, що сайт готовий. **Ніколи раніше.**
1. **Відкрити індексацію:** `app/robots.ts` → allow crawling (зняти `Disallow: /`).
2. **Переглянути `noindex` лише для погоджених готових сторінок:** root `app/layout.tsx`, загальний `X-Robots-Tag` у `next.config.ts` і page-specific robots за спільною політикою SEO-4. Наявність тексту сама не є launch approval; незавершені та службові сторінки зберігають обмеження. Саме зняття Disallow не скасовує загальний header.
3. **`NEXT_PUBLIC_SITE_URL`** → реальний власний домен у Vercel (зараз авто-derive з Vercel URL).
4. Після появи домену — фінальний прогін D1 (GSC/GBP верифікація).

---

## Рекомендований дефолтний порядок
`A1–A4 (готовність) → B1–B4 (нові сторінки) → C1–C5 (харденінг) → D1–D9 (best-practice) → E* (за бажанням) → НАЙОСТАННІШЕ: відкриття індексації`.
Перед кожною фазою — перелік пунктів + запит, що робити; після кожного етапу — запит про commit+push. Альтернатива «менший обсяг до відкриття»: A1–A4 + C2 + D1, але відкриття індексації лишається фінальним кроком.

**Подальший ризик** інженерно — обмежене покриття бізнес-логіки (D7); дві наявні регресії Studio вже підключено в CI (C4).

## Прогрес по плану
- 2026-10-24 — **A2.1 + A2.2 завершено** за вибором користувача. Контраст перевірено проєктним `contrast_checker.py`; обидва `pnpm run build` ✓ (TypeGen/TS/41 стор.). Browser QA охопив головну/about/news/ministries/team/media/contact на десктопній або мобільній ширині; фокус форми/медіапошуку/FAQ, кольори CTA та кнопок, відсутність горизонтального overflow. Повний WCAG-аудит не заявляється (D8). Докладні результати та обмеження — `progress-tracker.md`. Commit/push — лише після згоди користувача.
- 2026-06-26 (R8) — live-банер «Наживо» додано **на головну** (найперша секція) поряд із /media; `LiveBanner` винесено у спільний `components/sections/`. Діагноз «не підтягувалось»: бракувало конфігу — `siteSettings.liveStream.channelId` (Studio) + env `YOUTUBE_API_KEY` (Vercel); код детекції (YouTube Data API, кеш 15 хв) був коректний. `tsc`+`build` ✓. **Дії замовника:** створити безкоштовний YouTube Data API ключ (Google Cloud) → Vercel env; ID каналу+підпис у Studio.
- 2026-06-26 (R7) — фото служіння стало опційним (+ брендова заглушка `ImagePlaceholder` на картці й детальній); картка новин (NewsSlider) показує одну компактну назву служіння (`ministries[0]->title`, `truncate`) замість усіх категорій; медіа-бібліотека Studio (`sanity-plugin-media`, `media()` → вкладка «Media» + asset source у кожному полі фото); фотогалерея служіння тепер відкриває фото у спільному `ImageLightbox` (винесено в `components/ui/`, reuse із /media/photos). `typegen`+`tsc`+`build` ✓ 36 стор.
- 2026-06-26 (R6) — новини: категорії стали справжніми пошуковими дропдаунами (`CategoryInput` single + `MultiCategoryInput` chips, `@sanity/ui Autocomplete`, замість `TagInput`-datalist) із додаванням нового; нове поле `news.ministries` (weak-ref мультивибір) → сторінка служіння показує **лише** свої новини (`MINISTRY_NEWS_QUERY`); dev-only `disableTransition`-warning лишено (internal @sanity/ui). `typegen`+`tsc` ✓; curl: /ministries/* 200, /studio 200.
- 2026-06-25 (R5) — бенто-варіація (великий тайл чергує ліво/право); миттєва навігація лайтбокса фото (індекс усередині + префетч сусідів); «Остання проповідь»→**«Актуальне слово»**, перенесено вниз + **ручний вибір у Studio** (`homepage.featuredSermon`, single weak-ref → дві одночасно неможливі); прибрано мертве поле `stats` з документа `homepage` (скрипт `cleanup-homepage-stats`). `build` ✓ 35 стор.
- 2026-06-25 (R4) — хотфікс мерехтіння табів /media (прибрано key-remount/`AnimatePresence`; чистий CSS-dim). commit `685fb0a`.
- 2026-06-25 (R3) — медіа-полірування: чіткіші прев'ю (maxres@q90 + sd-фолбек, `images.qualities`); таби без релоуду (клієнт Server Action `searchMedia` + анімація, шалов URL); підсвічування батьківського нав-пункту; `SpeakerInput` → `@sanity/ui Autocomplete` (дропдаун + вільний ввід). `build` ✓ 35 стор.
- 2026-06-24 (R2) — медіа-фікси: навігація «Медіа»→Відео/Фото; нова сторінка **/media/photos** (бенто-агрегація фото з галерей служінь, лайтбокс, «Завантажити ще»); динамічний `SpeakerInput`; дата без часу; вищеякісні YouTube-прев'ю (maxres+фолбек); +3 категорії. `build` ✓ 35 стор. Деталі — `progress-tracker.md`.
- 2026-06-24 — **B2 Етап 3 + масштабування /media** (серверний пошук/фільтр, «Завантажити ще», `tags`, «остання проповідь» на головній). commit `8a6d3ae`.
- 2026-06-21 — план консолідовано з `improvement-roadmap.md` + специфікацій + open-questions; scratch-плани видалено. Очікую вибір користувача, з якого пункту стартувати (гейт перед фазою).
- 2026-06-19 — **A4-аудит** виконано (SEO/perf/security): S2 (екранування JSON-LD), SEO quick wins (canonical×11 + OG/Twitter), C2 (security headers enforce + CSP Report-Only). `next build` ✓ 34 стор. **TODO C2:** після смоук-тесту перемкнути CSP Report-Only → enforce.
