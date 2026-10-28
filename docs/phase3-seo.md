# Фаза 3 — SEO-архітектура

Дата: 2026-10-28. Обсяг — [master-plan, Фаза 3](../context/master-plan.md#фаза-3--seo-архітектура).

## Реалізація

- `lib/indexing.ts` замінює реєстр схвалень. Індексація дозволена лише за одночасних `SITE_INDEXING=on` і `VERCEL_ENV=production`; нова публікація не потребує правки коду. Фактичний локальний env не змінено, перемикач у `.env.example` — `off`.
- До запуску robots дозволяє crawl, HTML/HTTP містять noindex, sitemap порожній і не оголошений у robots. Це дає crawler змогу прочитати noindex, як вимагає [Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Після запуску Studio лишається забороненим у robots; Studio/API та URL-фільтри медіатеки мають HTTP noindex.
- Спільний необов’язковий `seo` у news/event/ministry/teamMember: title, description, ogImage, noIndex. Значення документа мають пріоритет над контентом; далі siteSettings/фолбек. `seo.noIndex` забороняє індексацію документа й виключає його з sitemap, не закриваючи весь список.
- Короткі page title + root template, номери сторінок пагінації, OG article і реальні дати новин; без keywords. `/media` не має canonical, бо статична HTML-відповідь спільна з query-фільтрами; фільтри мають HTTP noindex. Категорії новин — noindex із власним canonical. Нормалізація pagination paths — 308.
- Один WebSite + Church/Organization @graph у public root з logo/image/NAP/geo/social links; NewsArticle має author/publisher.logo/dateModified/image і спільні @id. `Breadcrumbs` формує видимі крихти та BreadcrumbList із одного масиву; останній item може не мати URL за [правилами Google](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb). VideoObject-список медіатеки прибрано.
- Event має реальну PostalAddress, статус, а за наявності даних — завершення, організатора, зображення й умови участі. Підтримувальні поля додано до schema та видимого detail; оголошення й події без повної адреси не емітують Event. Контент CMS і fixtures у ній не створювалися.
- Sitemap містить URL та lastModified із фактичних CMS timestamps, без priority/changefreq. SVG-іконка й Apple PNG походять від оригінального мальованого хреста логотипа; додано manifest, стандартний favicon видалено.

## Для редактора й запуску

SEO-поля можна залишити порожніми. SEO-заголовок вводиться без суфікса з назвою церкви. `noIndex` — виняток для конкретної сторінки, а не керування загальним запуском.

Для Event-розмітки заповнити фактичну повну адресу (вулиця/будинок, місто, код країни; область/індекс за наявності). Час завершення, організатора й умови участі вказувати лише коли відомі. Чинні події не мають нової адреси, тому потребують редакторського доповнення. Адреса церкви автоматично не підставляється.

Відкриття індексації — окремий [launch checklist](../context/master-plan.md#f-launch-checklist-найостанніший-крок), із новим deployment після зміни env. Preview лишається noindex навіть зі значенням `on`. Зовнішній webhook Sanity → Vercel — попередня [дія власника](sanity-revalidation.md).

## Перевірки

- Production builds для обох станів: 57/57 generation tasks, усі public routes ○/●; 22 schema types / 36 GROQ. Lint, повний TypeGen/typecheck, п’ять штатних regression suites — PASS. Новий `check-seo.ts` включено в `pnpm test`: Production/Preview matrix, overrides/фолбеки, дати, неповні Event і безпечна JSON-LD серіалізація.
- HTTP/Chrome: по 16 маршрутів у кожному стані, метадані/robots/HTTP/sitemap, 308, спільні graph IDs і крихти, query-фільтри. On sitemap — 44 URL, off — 0. На off додатково 320/390/1280px, пошук медіатеки, білі breadcrumb links, без overflow/console/hydration errors.
- Локальний skill validator перевірив JSON-LD головної й новини: обов’язкові поля присутні; NewsArticle і BreadcrumbList — 100/100 за його евристикою. Незастосовні рекомендації на кшталт SearchAction без реального пошуку не додавались.
- Schema.org Validator, code mode: фактичні блоки новини разом із site graph — **0 помилок / 0 застережень**. Google Rich Results Test попросив авторизацію, тому його PASS не заявляється. Перевірка розгорнутих головної/новини/події після деплою та заповнення адрес лишається зовнішнім прийманням.
- CMS/production env/жива контактна форма не змінювались. Наявні Node/Browserslist warnings збережені. Неактивні legacy SEO VM-скрипти залишаються до заміни у Фазі 7; вони не використовувались як гейт Фази 3.

## Lighthouse mobile

| Сторінка | Performance до → після | LCP, с до → після | Трафік, MB до → після |
| --- | --- | --- | --- |
| Головна | 81 → 78 | 4.48 → 4.54 | 0.88 → 0.87 |
| Новина | 84 → 84 | 4.14 → 3.76 | 0.91 → 0.90 |
| Служіння | 84 → 88 | 3.78 → 3.70 | 0.64 → 0.63 |
| Фото | 75 → 86 | 3.98 → 3.67 | 0.62 → 0.61 |
| Контакти | 86 → 90 | 3.67 → 3.45 | 0.94 → 0.93 |

| Сторінка | Accessibility після | Best Practices після | SEO після |
| --- | --- | --- | --- |
| Головна | 92 | 100 | 69 |
| Новина | 96 | 100 | 69 |
| Служіння | 100 | 100 | 69 |
| Фото | 100 | 100 | 69 |
| Контакти | 97 | 100 | 69 |

Цілі Performance ≥95 / Accessibility 100 ще не досягнуті на всіх сторінках. SEO 69 обмежений pre-launch noindex. Performance головної має діапазон 67–80 після; медіана TBT 183 → 282 мс. У серії «до» Lighthouse попереджав про повільний CPU хоста; у фінальній серії такого попередження не було. Різницю балів не можна повністю приписати SEO-змінам. Медіанний трафік у серії «після» менший приблизно на 11 КБ на сторінку; окремі внески SEO/JSON-LD/JS/RSC не ізольовані.

Метод: `scripts/measure-seo-performance.mjs`, Lighthouse 13.5.0, однакові Chrome/mobile simulated throttling/storage reset, production localhost:3004, warmed images. Raw JSON/HTML/trace — ignored `node_modules/.cache/seo-7/phase3-before` і `phase3-after-verified`. Незавершені серії після візуального доопрацювання крихт не включаються. Лабораторні дані залежать від хоста/мережі й не є польовими CWV; фаза змінює SEO-архітектуру, загальна ціль Performance ≥95 залишається для наступних фаз.
