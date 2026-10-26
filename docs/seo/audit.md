# SEO-аудит до запуску

Дата: 2026-10-26. **SEO-6.7 завершено локально:** [ministry detail headings і докази](#seo-67-заголовки-детальної-сторінки-служіння--2026-10-26). Специфікація: [05-prelaunch-seo.md](../../context/specs/05-prelaunch-seo.md). Далі SEO-6.8 — окремий свіжий heading crawl усіх публічних шаблонів/actual CMS rich text. SEO-1–SEO-5 і SEO-6.1–6.6 завершено раніше; початкові докази й карта SEO-1 збережені як baseline. F11 виправлено частково, весь SEO-6/D8 не закрито.

## Висновки

- Основа працює: 44/44 початкові адреси sitemap у SEO-1 відповідали HTTP 200 із canonical правильного шляху; доступність і canonical повторно підтверджені у SEO-4.1, 5 відсутніх адрес — 404/noindex. Нинішній sitemap навмисно порожній: запуск і жодна сторінка не схвалені.
- Pre-launch crawling заблоковано. За останньою live-перевіркою SEO-2.1 Production alias публічний без meta/header noindex. SEO-2.2 додав обидва сигнали в коді; актуальний live deployment окремо не перевірений. Сам `Disallow: /` і noindex, який crawler може не прочитати, не гарантують відсутності адрес у пошуку; F01 залишається відкритим.
- SEO-3.1 виправив соціальні metadata 11 статичних маршрутів, OG image `/about` і CMS defaults; SEO-3.2 — чотири detail families, фото матеріалу та description fallback оголошення. F07–F10 технічно закриті локально: 62 GET і 32 metadata fixtures SEO-3.2 — PASS. Остаточні тексти/редакційна готовність та live social preview не засвідчені.
- F04 технічно закритий у SEO-5. SEO-6.1 виправив H1 головної й дубль H1 служителів, ізоляцію прихованих hero CTA, керування ротацією та битий `/contact#map`. SEO-6.2 узгодив news card/sidebar; SEO-6.3 — team/honorary/ministry listing cards H3 і назви посилань без дублювання від фото. SEO-6.4 прибрав H6 надзаголовків OurVision/PastorGreeting; SEO-6.5 — H6 підписів відгуків і H4 FAQ contact. SEO-6.6 змінив footer H4 на H2; SEO-6.7 — ministry detail sidebar/CTA H2, single leader H3 та multiple group H3 + names H4. Typography, keyboard/mobile/desktop і регресії пройшли. Далі окремий свіжий heading crawl SEO-6.8. Початкові 500 на page новин/подій виправлені у SEO-4.2.
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

Позначення: **R** — кореневі OG/Twitter title/description/image та OG URL головної з [layout](../../app/layout.tsx); **C** — canonical поточної адреси, абсолютний через metadataBase/SITE_URL; **B** — чинний загальний `Disallow: /`, без page meta noindex. B не означає гарантоване виключення URL з пошуку. У колонці sitemap «так» означає фактичне включення, а не погодження індексації.

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
| F02. Sitemap не відрізняє редакційно готові сторінки | [sitemap](../../app/sitemap.ts), рядки 12–18: для detail достатньо slug (+startDate для event). У 44 URL включено `/history`, `/ministries/nove-sluzhinnya` та оголошення без тексту; їхня готовність не погоджена | Високий перед запуском: до майбутнього sitemap готових сторінок потрапить непідтверджений контент | Спочатку політика SEO-2, потім однаковий критерій відбору metadata/sitemap. Не прирівнювати published/defined(body) до схвалення власника; не додавати нові flags у CMS без обґрунтування | P1 перед SEO-L / SEO-2 → SEO-4 |
| F03. `lastModified` статичних URL означає час генерації | [sitemap](../../app/sitemap.ts), рядки 26–30: `new Date()` для всіх 10 статичних записів. У XML всі 10 мають `2026-10-26T08:21:38.406Z`, незалежно від зміни контенту | Середній: сигнал останнього суттєвого оновлення неточний | Використати підтверджене джерело зміни або опустити lastmod. `_updatedAt` detail-записів уже використовується — цей механізм зберегти | P2 / SEO-4 |
| F04. Weak-reference може зламати ministry detail | Схема ministry має `weak: true`; запит `leaders[]->`; [сторінка](../../app/(front)/ministries/[slug]/page.tsx), рядки 63, 215–258: `?? []` не прибирає null усередині масиву. Локальна підстановка `leaders:[null]` → `Cannot read properties of null (reading 'slug')` | Високий за видалення/відсутності referenced-документа: рендер переривається. Поточні 15 URL віддали 200, тому це **відтворений edge case**, не заявлений live outage | Відфільтрувати null перед перевіркою довжини й рендером; перевірити 0/1/2+ валідних та нерозв’язаних refs. Не робити references strong | P1 за ризиком / вузький під’юніт SEO-5 |
| F05. Некоректний page дає HTTP 500 | `/news?page=abc` і `/events?page=abc` → 500; server logs: `subscript ranges must have integer endpoints`. [News](../../app/(front)/news/page.tsx):48 та [events](../../app/(front)/events/page.tsx):42 пропускають NaN із `parseInt` через Math.max у GROQ slice | Середній: зовнішній URL може викликати server error | Перевіряти скінченне допустиме ціле число до slice; визначити fallback/redirect/404 та поведінку page поза діапазоном. Використати наявну структуру, без нового маршруту | P2 / SEO-4 |
| F06. Canonical пагінації завжди веде на базовий список | `?page=2` в обох списках → 200 з canonical `/news` або `/events`. У поточних даних лише 5 новин/3 події, отже page=2 порожня; реальна непорожня друга сторінка **не перевірена** | Потенційний середній за зростання архіву: різні порції матимуть canonical першої. Уже зараз немає окремої обробки out-of-range | Для існуючих сторінок пагінації планувати власний canonical; empty/out-of-range і category/search узгодити окремо. Не оголошувати всі фільтри автоматично indexable | P3 зараз / SEO-2 policy → SEO-4 |

[Google пояснює обмеження noindex за заблокованого crawling](https://developers.google.com/search/docs/crawling-indexing/block-indexing). [Вимоги sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) рекомендують canonical URL і достовірний lastmod; priority/changefreq Google ігнорує. [Рекомендації пагінації](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) розрізняють власні canonical сторінок і політику фільтрів. Джерела звірено 2026-10-26.

## Metadata, social і семантика

Нижче — початкові findings SEO-1; статус виправлень F07–F10 та нові докази — у розділах SEO-3.1 і SEO-3.2.

| ID / проблема | Доказ | Вплив | Рекомендація | Пріоритет / етап |
|---|---|---|---|---|
| F07. OG/Twitter не відповідають конкретній сторінці | 42/44 URL sitemap мають `og:url=https://newlife.church`; наприклад `/news/vidkrittya-novogo-navchalnogo-roku-v-centri-indigo` має правильний canonical, але OG головної. Власні title/description не перевизначають nested openGraph/Twitter у root | Середній: social preview показує загальні дані й адресу іншої сторінки | Узгодити OG URL/title/description із маршрутом; використовувати наявні фото та перевірений спільний fallback. Перевірити фактичний HTML статичних і dynamic templates | P2 / SEO-3 |
| F08. `/about` втрачає `og:image` | `/about` має власний openGraph object без images. HTML: OG URL `/about`, og:image відсутній; Twitter image залишається root | Середній: неповне соціальне прев’ю | Явно зберегти спільне зображення при перевизначенні OG. Повторно перевірити image/siteName/locale разом, не покладатися на deep merge | P2 / SEO-3, мале виправлення |
| F09. CMS SEO/OG-поля не впливають на metadata | [siteSettings schema](../../sanity/schemaTypes/siteSettings.ts):221–234 визначає ogImage/defaultDescription. [query](../../sanity/lib/queries.ts):30–44 не вибирає ogImage; [helper](../../lib/site-settings.ts):127 повертає defaultDescription, але `rg` не знаходить його споживача в app. Root metadata статичні. Published settings зараз **без обох значень** | Середній для редактора: майбутнє заповнення не дасть очікуваного результату; зараз втрати конкретного заповненого значення не виявлено | Підключити наявні поля до defaults з fallback або уточнити контракт. Не створювати дублікати полів; порожній CMS не має прибирати metadata | P2 / SEO-3 |
| F10. Неповні description | `/ministries` повторює description головної. `/events/obid-dlya-rodin-zagiblikh-zakhisnikiv` → 200, але description немає: немає ні CMS description, ні body. 43/44 URL sitemap мають description | Середній: загальний або відсутній анонс не описує сторінку | Для списку — опис лише підтвердженого призначення; для detail — безпечний fallback/правило відкладення за SEO-2. Остаточний зміст оголошення надає власник | P2 / SEO-3 + SEO-L |
| F11. H1 і рівні heading неузгоджені | SEO-6.1: головна й 11 team details → 1 H1. SEO-6.2: `/news` main → H1,H2. SEO-6.3: `/team` і `/ministries` main → H1,H2,H3 (по 15 карток). SEO-6.4: OurVision/PastorGreeting pre-titles → p. SEO-6.5: імена відгуків → p, FAQ contact → H3. SEO-6.6: footer groups → H2. SEO-6.7: ministry detail sidebar/CTA H2, single name H3, multiple group H3 + names H4 | Середній для семантики/навігації; це не доказ санкцій або втрати конкретних позицій | Відомі template fixes виконані; потрібний свіжий heading crawl усіх публічних шаблонів/actual CMS rich text для оцінки залишку | P2 / частково закрито; SEO-6.8 |

Поведінка `/about` відповідає [документації Next.js про shallow metadata merge](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging); джерелом істини для встановленої 16.1.6 тут слугує перевірений HTML. Довжина title/description сама по собі не використана як жорсткий критерій дефекту.

## Контент і JSON-LD: залежності перед запуском

| Дані | Спостереження / доказ | Що лишається підтвердити | Власник дії / пріоритет |
|---|---|---|---|
| Служіння та служителі | Published: 15 ministry, 11 teamMember. У всіх є shortDescription/body або bio відповідно; фото є у всіх поточних документів. Два служіння без масиву leaders працюють. `/ministries/nove-sluzhinnya` має назву «Нове служіння» | Повноту, реальність і погоджений набір сторінок. Назва «Нове служіння» — кандидат на редакційну перевірку, не автоматичний вердикт видалити | Власник / P1 до SEO-L |
| Історія | [history page](../../app/(front)/history/page.tsx):17 починає таймлайн із 1992. [master-plan](../../context/master-plan.md) уже фіксує суперечність із 1991. `/about` має власний history-блок CMS/fallback | Єдину підтверджену хронологію, усі події/тексти/історичні медіа. Не міняти рік на підставі припущення | Власник / P1 до SEO-L |
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

Скіли: seo-audit; grill-with-docs/handoff для контексту; security-guidance/env-secrets-manager лише за потрібного scope; karpathy-coder за змінами коду. Початок: [tracker](../../context/progress-tracker.md) → [spec](../../context/specs/05-prelaunch-seo.md) → цей звіт. Рішень про нову архітектуру/UI на SEO-1 не прийнято.

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

- [Root metadata](../../app/layout.tsx): `robots: { index: false, follow: true }`, без env-перемикача. Чинна privacy metadata дає той самий `noindex, follow`; Studio зберігає власний `noindex` із `next-sanity/studio`. У Next.js вкладений об’єкт robots замінює батьківський цілком, тому нові page-specific robots мають зберігати pre-launch noindex.
- [HTTP headers](../../next.config.ts): у чинне правило `/:path*` додано `X-Robots-Tag: noindex`, включно з ресурсами й RSC. Security headers та CSP Report-Only з винятком Studio збережено; окремої middleware немає.
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

- Старт: чисте дерево `codex/seo-1-audit`, HEAD `f4b58a8`; пряме доручення користувача «Роби Наступний крок — SEO-3.1». [Спільний helper](../../lib/metadata.ts) формує повні OpenGraph/Twitter з title/description відповідної сторінки, URL через `SITE_URL`, siteName, `uk_UA`, type website та image. Root тепер `generateMetadata`, збережено metadataBase/keywords і `noindex, follow`; глобального canonical немає.
- [Чинний запит](../../sanity/lib/queries.ts) вибирає наявне `siteSettings.ogImage`; [getSiteSettings](../../lib/site-settings.ts) повертає URL 1200×630 лише за наявного asset ref, інакше null. Опис: власний непорожній → CMS defaultDescription → попередній кодовий; image: CMS → попередній `/images/hero-church-1.jpg` 1920×1080. Title/description очищаються від HTML-тегів та зайвих пробілів. Схеми, live CMS та залежності не змінені; TypeGen згенеровано штатно.
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

- Старт: чисте дерево `codex/seo-1-audit`, HEAD `51cf0f3` (SEO-3.1); пряме доручення «Роби Наступний крок — SEO-3.2». Змінено лише [helper](../../lib/metadata.ts) і generateMetadata у [news](../../app/(front)/news/[slug]/page.tsx), [events](../../app/(front)/events/[slug]/page.tsx), [ministries](../../app/(front)/ministries/[slug]/page.tsx), [team](../../app/(front)/team/[slug]/page.tsx), плюс 6 документів контексту/звіту.
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
- [Спільний критерій](../../lib/seo-readiness.ts): один `SEO_APPROVAL` із `launch: null, pages: []`. Майбутній запис запуску — погоджений origin і дата; сторінки — canonical path, дата, для CMS також `documentId` із published `_id`. Критерій вимагає Production (`VERCEL_ENV`) і збігу origin із `SITE_URL`; невідомі/службові/query шляхи, draft/version IDs, небезпечні сегменти не проходять. Перелік відомих статичних маршрутів не є схваленням. Новий slug/_id потребує відповідного схвалення; суттєві зміни фактів — повторної редакційної перевірки власником.
- [Metadata](../../lib/metadata.ts) споживає той самий критерій; 4 detail generateMetadata передають `_id` уже завантаженого документа. Без схвалення явний `noindex, follow`; `documentId` не потрапляє у вихідний Metadata. Чинні canonical/OG/Twitter/fallback і native 404 збережені. Root noindex та загальний HTTP noindex залишені без змін. Позитивну гілку перевірено лише ізольованими fixtures; реального схвалення не додано.
- [Sitemap](../../app/sitemap.ts): чинний `defineQuery`, 4 CMS-колекції, тепер із `_id`; fetch явно `perspective: 'published'`. Статичні й CMS URL проходять один критерій, дублікати прибираються, ISR 60s збережено. Наявний схвалений документ автоматично підхоплюється без правки запиту на кожен матеріал; unpublished/видалений не включається. Окремий event-фільтр `defined(startDate)` прибрано з переліку кандидатів для узгодження з чинним detail-запитом: наявність дати не є схваленням, без approval навіть повний документ не включається. Це не виправлення legacy event UI/JSON-LD або редакційної готовності.
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

- [Нормалізація](../../lib/listing-params.ts) працює перед fetch у page та generateMetadata news/events/media. Нечисловий/нецілий/повторений/≤0/небезпечний page → 307 на базовий список із валідними скалярними filters. Page=1 видаляється; `002` → `2`; whitespace/empty scalar filter нормалізується, повторений filter відкидається з 307. Redirect збирається через URLSearchParams на фіксованому локальному path. Media має «Завантажити ще», тому її `page` видаляється зі збереженням filter. Невідомі tracking-параметри не йдуть у canonical або GROQ, самі по собі не запускають redirect.
- News/events спочатку читають count: коректний N поза діапазоном → 404/noindex без довільного slice; порожня порція N≥2 також → 404. Порожній базовий список → 200/noindex. `LISTING_PER_PAGE=6` спільний; page-local React cache зі скалярними аргументами узгоджує порцію metadata/UI. NaN та небезпечні endpoints не надходять у GROQ.
- Непорожня пагінація без filter має власний canonical і OG URL `/news?page=N` / `/events?page=N`; filter/search завжди noindex з базовим canonical. Наявні crawlable pagination links і дизайн збережені.
- [Готовність](../../lib/seo-readiness.ts) `isListingIndexable()` перевіряє launch і схвалення базового списку та кожного `_id`+slug видимої непорожньої порції news/events. [Metadata](../../lib/metadata.ts) приймає `listingItems` лише на вході. [Sitemap](../../app/sitemap.ts) застосовує той самий критерій для першої порції, включає для перевірки документи без slug, повторює порядок і умову наявного startDate для events. Порожній `/media` також не indexable й не в sitemap. У початковому sitemap немає query URL; `isPageIndexable()` їх далі відкидає.

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

[Регресія](../../scripts/check-listing-seo.mjs): `cmd /c "pnpm exec node scripts/check-listing-seo.mjs"` — PASS. Реальні TypeScript helper/metadata/page/sitemap завантажуються через transpile/VM з target ES2022; mocked navigation/CMS, нуль мережевих запитів і CMS writes. Синтетичні 7 news/events перевіряють другу непорожню порцію, її власні canonical/OG URL, SSR сьомої картки без першої та реальні pagination links на базову сторінку. Окремо: порожня база/порція, count до slice, максимальне безпечне число, filters/повторення/Unicode encoding, поточний порожній register, схвалення списку/кожного видимого документа, missing slug, sitemap↔metadata узгодженість, event без startDate та порожній media. Позитивне approval існує лише в пам’яті fixture.

У поточній CMS досі немає другої непорожньої сторінки news/events: її canonical/SSR перевірено синтетично, а HTTP `page=2` закономірно дає 404. Browser hydration/інтерактивні Server Actions та live deployment не перевірялись; UI-компоненти/стилі/Actions не змінювались. Повний JSON-LD/null-ref аудит — SEO-5.

`cmd /c "pnpm run build"`, lint, typecheck та 3 наявні регресії — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks. Перший sandbox build зупинився на Sanity config EPERM; повтор із потрібним доступом і фінальний build успішні. Старі Node/localStorage/Browserslist warnings лишаються. Тимчасовий HTTP-runner/лог/JSON — ignored `.next/seo-4.2/`; довготривалий доказ — ця матриця та tracked regression.

[Google про canonical пагінації й filters](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [Next.js generateMetadata/searchParams/cache](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) і [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) звірено 2026-10-26; фактичні status і HTML засвідчені на встановленій Next.js 16.1.6.

Root/header noindex, privacy/studio robots і Disallow збережено. CMS/schema/production env/DNS/platform settings, JSON-LD та дизайн не змінені; generated types лише оновлені штатним TypeGen і ignored. F01/platform protection відкритий, launch не погоджено. Commit/push SEO-4.2 не виконано — гейт [ai-workflow-rules.md §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Наступний **SEO-5** — F04, наявні JSON-LD/null-ref та відповідність видимим фактам; schema-markup, karpathy-coder, решта скілів за фактичним scope.

Завершальні перевірки: 6 UTF-8 документів, 55 локальних file/anchor targets і `git diff --check` — PASS. Сервер зупинено, порт 3004 без listener. Фінальний diff: 7 файлів застосунку + 1 regression + 6 документів; root layout/robots/next.config/schema sources/package/lockfile без змін.

### Погоджена публікація SEO-4.2

Перед комітом повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 GROQ queries, TypeScript, 42/42 static-generation tasks; старі Node/Browserslist warnings. SEO-регресія повторно PASS, UTF-8 6 документів — PASS. Lint/typecheck/3 наявні регресії та 154 GET уже пройшли на цьому коді; staged diff перевіряється перед комітом.

Після локального QA користувач прямо погодив commit+push SEO-4.2 у `codex/seo-1-audit` 2026-10-26, відповівши «Так». Попередні згадки про непогоджену публікацію — стан до цієї відповіді. Свіжий fetch підтвердив HEAD/origin 0/0, Git Credential Manager — `Chekirko`; публікація охоплює 7 файлів застосунку, 1 regression і 6 документів. Точний SHA, remote SHA й чистота дерева перевіряються після push і наводяться у фінальному повідомленні. Merge, Production settings/env/DNS/CMS не змінюються; новий live deployment не засвідчений. Наступний юніт — SEO-5.

## SEO-5: JSON-LD і null-посилання — 2026-10-26

### Реалізація та межі

Старт — чистий `codex/seo-1-audit`, HEAD `124687d`; пряме доручення «Робимо Наступний крок — SEO-5». Два пов’язані юніти: F04/неповні detail-дані та чинні JSON-LD шаблони. 9 файлів застосунку + [tracked regression](../../scripts/check-jsonld-seo.mjs), без нових залежностей, CMS-схем, полів або mutations.

- **F04 закритий локально:** [ministry detail](../../app/(front)/ministries/[slug]/page.tsx) відкидає null та refs без name/slug до підрахунку 0/1/2+ відповідальних. Фото кожної особи має guard; тип масиву моделює null-елементи. Team detail без фото має чинний декоративний placeholder і не викликає image builder; валідні фото/UI зберігаються.
- **NewsArticle:** URL/ID і breadcrumb використовують route slug; description — видимий body або той самий fallback, підтримано legacy string. Дата публікації — лише валідний ISO; некоректна дата не показується й не потрапляє в JSON. Прибрано припущення author=publisher та dateModified=`_updatedAt`: visible byline/редакційної дати немає. Publisher лишається сайтом церкви зі спільним `#church`.
- **Event:** лише `подія` з назвою, валідною датою та видимим location. Оголошення/неповна подія не створюють Event; недійсна дата не дає NaN у detail UI. Location бере саме текст матеріалу, без автоматичного church NAP. Scheduled/organizer прибрані без підтверджених полів; description збігається з видимим body/fallback, URL/ID стабільні. «Головний зал» не перетворюється на вигадану повну адресу.
- **Person / Church:** `memberOf` замість непідтвердженого employment-твердження worksFor; назва церкви із `getSiteSettings()`, єдиний `#church`, власні URL/ID. Homepage та сама сутність має сумісні типи `Church` + `Organization`: Church належить до Place, юридичні/контактні поля підтримує Organization. AboutPage/WebSite refs узгоджені. FAQ JSON-LD вже використовує ті самі FAQ, що UI; переписування не потрібне. Розклад/гео/соцмережі походять із чинного settings helper; за поточної CMS `openingHours` порожній, непорожню гілку HTTP-вибірка не засвідчує.
- **VideoObject:** JSON-LD у [MediaGallery](../../app/(front)/media/components/MediaGallery.tsx) SSR-рендериться з тих самих cards і слідує state після search/filter/load-more; порожня вибірка прибирає script. Лише playable items, послідовні position, однакові name/thumbnail/description. YouTube watch — `url`, player — `embedUrl`; `contentUrl` прибрано, бо це не прямий файл. `uploadDate` прибрано: наявна date описує матеріал/служіння і не доводить дату завантаження. Нових полів про запас немає.
- **Серіалізація:** всі insertions зберігають `jsonLdHtml()`; round-trip hostile `</script>`, quotes, ampersand та Unicode PASS. [schemaDate](../../lib/utils.ts) зберігає справжню ISO дату/дату-час із timezone, відкидає missing/non-ISO/неможливий день; не підставляє «зараз».

### Перевірки

Фінальні **57 production-build GET** через `next start`, 127.0.0.1:3004: **51×200 / 6×404**. Усі 57 мають `X-Robots-Tag: noindex`, усі 54 HTML-відповіді — meta noindex. 46 базових HTML: 12 статичних/службових і 34 detail (15 ministry / 11 team / 5 news / 3 events). Додатково 5 missing URL → 404, `/events?page=2` → 404, news category/media q → 200, robots/sitemap/чинний fallback JPEG → 200. Robots зберігає Disallow, sitemap — 0 URL.

JSON.parse всіх знайдених blocks успішний; абсолютні URL/ID перевірені. У реальній вибірці 11 Person, 5 NewsArticle, 1 Event, 12 вкладених VideoObject, 22 BreadcrumbList, Church/Organization + WebSite, FAQPage (5 Q&A), AboutPage. NewsArticle без author/dateModified, VideoObject без contentUrl/uploadDate, Event без Scheduled/church-address. Усі 34 реальні detail лишаються 200. Повний query-регресійний HTTP scope SEO-4.2 не повторювався: збережена його tracked regression.

`pnpm exec node scripts/check-jsonld-seo.mjs` — **PASS**: 22 detail renders, 4 missing docs, 2 media SSR, 4 gallery states (initial/filter/append/empty), ISO dates і безпечне escaping. Виконуються справжні сторінки/MediaGallery/helpers через transpile/VM і React SSR із synthetic CMS та mocked state/actions, без мережі. Перевірено null/empty/mixed 0/1/2+ leaders, missing slug/name/photo, team photo null, rich/legacy/fallback body, оголошення й неповні події, invalid/missing dates, hostile text. Це перевірка реальних handlers і результату state, **не browser hydration/React scheduler або live Server Actions**.

Build, lint, typecheck, 3 наявні регресії та `scripts/check-listing-seo.mjs` — **PASS**: 21 schema type / 34 GROQ queries, 42/42 static-generation tasks. Sanity config EPERM та sandbox loopback EACCES/ETIMEDOUT усунені дозволеним build/QA-server/GET поза sandbox; application/network protections не послаблювались. Старі Node/localStorage/Browserslist warnings лишаються. HTTP-runner, HTML/JSON і synthetic outputs — ignored `.next/seo-5/`; довготривалі докази тут, наступна сесія не залежить від цих файлів.

**Зовнішня валідація:** Schema.org Validator, code mode, synthetic outputs справжніх шаблонів Person/Event/NewsArticle/BreadcrumbList/ItemList→VideoObject: **5 root elements, 0 errors / 0 warnings**. Живий CMS-контент до валідатора не передавався. Google Rich Results Test прийняв code, але повернув «Увійдіть в обліковий запис і повторіть спробу»; перевірка **не завершена**, eligibility не засвідчена. Локальний skill `schema_validator.py` запущено з `python -X utf8` (без цього Windows cp1251 error): JSON розпізнаний, breadcrumb 100; synthetic incomplete article отримує 40/100 через stale required image/author/date. Це евристика, не нормативний verdict: актуальна Google Article doc не має required properties. Вигадане авторство заради бала не додається.

### Офіційні джерела та відкладені факти

Звірено 2026-10-26: [Google Article — applicable recommended properties](https://developers.google.com/search/docs/appearance/structured-data/article), [VideoObject — contentUrl означає bytes, uploadDate дату завантаження](https://developers.google.com/search/docs/appearance/structured-data/video), [Event — назва/час/реальне місце](https://developers.google.com/search/docs/appearance/structured-data/event), [Schema.org Church — Place hierarchy](https://schema.org/Church). Валідність Schema.org не обіцяє rich results; missing video uploadDate та повна event address залишаються контентними обмеженнями.

До SEO-L власник підтверджує NAP/legalName/geo/соцмережі та їхні fallback, справжній розклад і його endTime, FAQ/свідчення/біографії/ролі, дати матеріалів та авторство. Event потребує точної адреси/статусу/організатора за кожною подією; video — справжньої uploadDate, назв/описів і готовності watch experience. У цій сесії відсутні факти пропущені або записані як залежності, а не вигадані. Історія й readiness approval лишаються непогодженими.

Pre-launch root/header/page noindex, Disallow та порожній approval збережені. Schema/GROQ sources, package/lockfile, CMS/env/DNS/platform settings не змінені; TypeGen лише штатний ignored output. Live deployment/Search Console/Google index та mobile/desktop layout не перевірені: in-app browser localhost timeout, HTTP через локальний процес успішний. F01 лишається відкритим. Commit/push SEO-5 не виконано — [проєктний гейт §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

## SEO-6.7: заголовки детальної сторінки служіння — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.7 після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижча згадка про ще потрібну згоду — попередній стан. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби SEO-6.7». Старт із чистого `4272e9b`, гілка `codex/seo-1-audit`; SEO-6.6 уже в HEAD. Обсяг — один [шаблон детальної сторінки служіння](../../app/(front)/ministries/[slug]/page.tsx), 8 змінених рядків застосунку. CMS, схеми, GROQ, залежності, URL та optional-data branches не змінені.

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

**SEO-6.7 завершено локально. Далі SEO-6.8 — окремий свіжий heading crawl F11:** звірити всі публічні шаблони й actual CMS rich text, після цього оцінити закриття F11/SEO-6. Вузький ministry QA не замінює цей crawl. Повний D8 (FAQ disclosure semantics, nav landmark, breadcrumbs contrast, візуальний/DOM порядок sidebar), SEO-7, F01 та SEO-L відкриті. Noindex/Disallow/порожній approval збережені; live deployment/Google index не засвідчені. Commit/push SEO-6.7 ще не виконано: окрема згода за [workflow §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19). Скіли наступного юніту: seo-audit, a11y-audit, karpathy-coder; senior-frontend за потреби, grill-with-docs для контексту. Передача тут і у spec, без окремого handoff-файла. Нижчі юніти — історичний стан.

## SEO-6.6: заголовки футера — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.6 після локального QA. Погоджено 1 файл застосунку та 6 документів у `codex/seo-1-audit`; нижча згадка про ще потрібну згоду — попередній стан. Свіжий fetch: HEAD/origin 0/0; Git Credential Manager — `Chekirko`. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Перед погодженим комітом повторний `cmd /c "pnpm run build"` — PASS: 21 schema type / 34 queries, TypeScript, 42/42 generation tasks. UTF-8 6 документів / 121 локальна file+anchor ціль і staged diff-check — PASS. Код після QA не змінено; попередні перевірки не розширювалися.

Пряме доручення — «роби SEO-6.6». Старт із чистого `32276d0`, гілка `codex/seo-1-audit`; SEO-6.5 уже в HEAD. Обсяг — один спільний шаблон [ChurchFooter.tsx](../../components/ChurchFooter.tsx), три рядки застосунку. Контент, класи, href, GROQ, схеми та залежності збережені.

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

Тимчасові QA-артефакти — ignored `.next/seo-6.6/`. Noindex/Disallow/порожній approval збережено; live CMS/env/DNS/platform settings без змін. Commit/push цього юніту потребує окремої згоди за [workflow §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

**Далі SEO-6.7:** ministry detail sidebar H5, CTA H6 та leader H4 (single/multiple). Спершу звірити повну сторінку й порожні/null дані, зберегти typography, перевірити SSR/links/keyboard/mobile. Після цього — окремий свіжий heading crawl усього залишку F11. Повний D8 (FAQ disclosure semantics/nav landmark/breadcrumbs contrast), SEO-7, F01 і SEO-L відкриті. Скіли наступної сесії: seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs/handoff для контексту. Передача тут і в spec, без дублюючого handoff-файла.

## SEO-6.5: підписи відгуків і контактний заголовок FAQ — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.5 після локального QA. Погоджено 2 файли застосунку та 6 документів у `codex/seo-1-audit`; нижчі згадки про ще потрібну згоду — історичний стан. Результат — у git history та фінальному повідомленні; merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби далі SEO-6.5». Старт із чистого `6c9ce1a` у `codex/seo-1-audit`, SEO-6.4 уже в HEAD. Рівно два рядки застосунку: [TestimonialsGrid](../../app/(front)/components/TestimonialsGrid.tsx) та [FAQSplit](../../app/(front)/components/FAQSplit.tsx). Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs і принципи handoff; передача через наявні документи. Нових dependencies, маршрутів, стану, схем, запитів або tracked тестів немає.

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

Тимчасові scripts/results/HTML/screenshots — ignored `.next/seo-6.5/` (зокрема `fixtures.json`, `http.json`, `browser.json`, `faq-desktop.jpg`). Noindex/Disallow/порожній approval, root/layout/robots/sitemap/config, schema/GROQ sources, package/lockfile, CMS/env/DNS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.5 не виконано — потрібна окрема згода за [workflow §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

Фінально: 2 файли застосунку + 6 документів, UTF-8 / 109 локальних file+anchor targets, diff-check та Diff Surgeon CLEAN. QA-сервери зупинено, viewport скинуто, тимчасову вкладку закрито. У server log зафіксований upstream YouTube maxres 404 поза testimonials/FAQ (наявний thumbnail fallback); browser console errors у перевірених flows не було.

### Наступний юніт після SEO-6.5

1. **SEO-6.6 — footer headings H4:** один template, звірити семантичний ранг у повних сторінках, зберегти typography та перевірити SSR/links/keyboard/mobile/desktop. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту.
2. **Далі ministry detail headings окремим юнітом:** sidebar H5/CTA H6/leader H4 (single/multiple); після всіх F11 fixes — свіжий heading crawl. Повний D8 (breadcrumbs contrast, nav landmark, FAQ disclosure), SEO-7, F01 і SEO-L лишаються відкритими. Нижчі сесії описують попередній стан.

## SEO-6.4: надзаголовки OurVision і PastorGreeting — 2026-10-26

**Публікація погоджена 2026-10-26:** користувач відповів «так» на commit + push SEO-6.4 після локального QA. Нижчі згадки про ще потрібну згоду — історичний стан. Публікація охоплює 2 файли застосунку та 6 документів у `codex/seo-1-audit`; результат — у git history та фінальному повідомленні. Merge/Production settings без змін, live deployment окремо не засвідчений.

Пряме доручення — «роби наступний крок — SEO-6.4». Старт із чистого `8fc6bea` у `codex/seo-1-audit`; SEO-6.3 уже в HEAD. Рівно два пов’язані компоненти: [OurVision](../../app/(front)/components/OurVision.tsx) та [PastorGreeting](../../app/(front)/components/PastorGreeting.tsx), обидва використовуються на головній. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs і принципи handoff для передачі через наявні документи. Нових маршрутів, стану, схем, запитів, залежностей або tracked тестів немає.

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

Тимчасові runner/results і HTML — ignored `.next/seo-6.4/`. Root layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile/env/DNS/CMS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.4 не виконано — потрібна окрема згода за [workflow §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

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

Пряме доручення — «Роби Наступний крок — SEO-6.3». Старт із чистого `9c1816c` у `codex/seo-1-audit`, SEO-6.2 уже в HEAD. Два пов’язані шаблони — team cards (звичайний/почесний варіант) і ministry listing cards. Рівно 3 файли застосунку: [TeamMemberCard](../../app/(front)/team/components/TeamMemberCard.tsx), [HonorarySection](../../app/(front)/team/components/HonorarySection.tsx), [MinistryCard](../../components/ui/MinistryCard.tsx). Нових маршрутів, стану, схем, GROQ-запитів чи залежностей немає. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту; окремого handoff-файлу немає.

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

QA-сервер зупинено, порт 3004 без listener. Фінальний diff — 3 файли застосунку + 6 документів. Root layout/robots/sitemap/next.config/readiness approval/schema sources/package/lockfile/env/DNS/CMS/platform settings збережені. Live deployment/Google index не засвідчені. Commit/push SEO-6.3 не виконано — потрібна окрема згода за [workflow §3](../../context/ai-workflow-rules.md#working-agreement-project-wide-agreed-2026-06-19).

### Наступний юніт після SEO-6.3

1. **SEO-6.4 — OurVision/PastorGreeting pre-titles:** звірити актуальні H1–H6 у контексті сторінки, точково виправити підтверджені skips, зберегти typography; SSR і keyboard/mobile/desktop QA. Скіли seo-audit/a11y-audit/senior-frontend/karpathy-coder, grill-with-docs/handoff для контексту.
2. **Решта F11 — окремими юнітами:** Testimonials names, FAQ contact block, footer; ministry detail sidebar H5, CTA H6 та leader H4 (single/multiple branches). Вони не належать до виправлених listing cards. Після всіх юнітів — свіжий heading crawl, без автоматичного закриття повного D8.
3. **Зберегти межі:** F01/platform protection, breadcrumbs contrast/D8, performance SEO-7, редакційні біографії/історія та launch SEO-L лишаються відкритими. Жодного запуску індексації або live CMS edits у цьому юніті.

## SEO-6.2: картки новин і sidebar — 2026-10-26

### Результат і межі

- `/news` main має один H1 і послідовні H2: п’ять назв новин та «Категорії», «Останні новини», «Маєте новину?». Порожній стан також H2. Розміри/шрифти/кольори залишені чинними класами; layout, CMS-контент, metadata та JSON-LD не змінювалися.
- Кожне «Читати далі» має доступну назву з повним title через `sr-only`; видимі слова збережено. Фото й назва картки та sidebar title залишаються нативними crawlable links на той самий detail URL. Фото-посилання має явну площу `absolute inset-0` і focus outline із відступом −4px, щоб його не обрізав overflow wrapper. Декоративні іконки змінених блоків — `aria-hidden`.
- Активна категорія/«Усі новини» має `aria-current="page"`. URL encoding та фільтрація з SEO-4.2 збережені. Noindex/Disallow/порожній approval не змінено; F11 закритий лише в цьому scope, повний D8 не закрито.

Пряме доручення — «Роби Наступний крок — SEO-6.2», потім «продовжуй». Старт із чистого `66a13a5` у `codex/seo-1-audit` (SEO-6.1 уже в HEAD). Два пов’язані шаблони — news card та news sidebar, включно з їхнім контейнером/empty-state у listing. Рівно 4 файли застосунку: [NewsCard](../../app/(front)/news/components/NewsCard.tsx), [SidebarCategories](../../app/(front)/news/components/SidebarCategories.tsx), [SidebarRecentPosts](../../app/(front)/news/components/SidebarRecentPosts.tsx), [news page](../../app/(front)/news/page.tsx). Нових CMS-схем/GROQ-запитів, клієнтського стану, dependencies або маршрутів немає. Скіли: seo-audit, a11y-audit, senior-frontend, karpathy-coder; grill-with-docs/handoff для контексту без окремого handoff-документа.

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
| Головна без H1; pre-title помилково h3 | Серверний HTML baseline: 0 H1. Декоративний надпис потрапляв у heading navigation перед основним заголовком | [Hero.tsx](../../components/sections/Hero.tsx): лише активний title — H1, неактивні titles — абзаци; pre-title — абзац із тими самими шрифтом/розміром/line-height. Після SSR і browser transitions — 1 H1. P2, виправлено |
| Team detail дублює H1 | PageHero та body повторювали ім’я як два H1 | [Шаблон](../../app/(front)/team/[slug]/page.tsx): повторне ім’я — абзац, візуальні класи збережено; rich-text headings не зсуваються штучно під зайвий H2. 11/11 HTTP details — один H1, photo/null fixtures теж. P2, виправлено |
| Невидимі слайди доступні через Tab; ротація без паузи; dots без назв | `opacity-0`/pointer-events не вилучали посилання з клавіатурного порядку. Прокручування могло прибрати CTA з-під фокусу | `inert` + `aria-hidden`, видимий pause/play перед контентом, focus stop до явного play, hover pause, reduced-motion default. Українські назви, aria-current для dots; 44×48px цілі dots, 48px arrows. Ручне перемикання зберігає фокус. Pointer-down ref усуває перевірений конфлікт focus stop → click toggle. P1 для keyboard use, виправлено |
| Стрілки на mobile проходили через центр тексту | На 320px контент займає більшу ширину; controls мають окрему нижню смугу | Лише mobile arrows перенесено вниз; темна підкладка controls, видимий global focus. Три слайди перевірено на 320px, CTA не перетинають нижні controls. P2, виправлено |
| `/contact#map` не має fragment-цілі | Local crawl: href на головній є, `id=map` у `/contact` відсутній | [Наявний wrapper карти](../../app/(front)/contact/page.tsx): `id="map"` та responsive scroll-margin під fixed header. Browser navigation → саме wrapper із iframe; desktop top=180px, mobile margin=140px. Нових embed/полів немає. P2, виправлено |

HeroGradientImage у тому самому файлі також замінює pre-title h6 на абзац; решта цього компонента не переписана. CTA слайдера без href не породжує фальшивого `href="#"`. CMS CTA-дані й slug не змінювалися.

Механіка ротації звірена з [W3C Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) і [W3C Carousel Animations](https://www.w3.org/WAI/tutorials/carousels/animations/): керування ротацією, stop при фокусі, hover pause та приховування неактивного вмісту. Це застосування патерну, не твердження про повну WCAG відповідність.

### Перевірки й межі

**Production HTTP:** read-only crawl HTML-посилань, старт із 11 базових маршрутів та prerendered ministry/team details; 45 унікальних pathname + 5 query URL = 50 HTML GET 200. Обхід охопив усі 34 details, crawlable anchors header/footer/карток/Portable Text і query links, знайдені в цій вибірці. Усі цілі віддали 200; 51 fragment-посилання (включно зі skip-links і map) мають id у цільовому HTML. Додатково robots/sitemap 200 і `/team/seo-6-missing` 404 — **53 GET, 52×200/1×404**. Header noindex на всіх, meta noindex на 51 HTML; Disallow збережено, sitemap 0 URL. Тимчасові runner/results — ignored `.next/seo-6/`; довготривалі висновки тут. Це не обхід усіх можливих query-комбінацій, CMS revisions або зовнішніх адрес.

**Browser:** in-app browser, локальний production server на loopback; після sandbox timeout сервер перезапущено дозволеним способом. Desktop 1280×900, mobile 390×844 і 320×812. На головній перевірено один H1 після Enter/dot/arrow, pause click, keyboard play, focus stop, Tab/Shift+Tab без прихованих CTA, видимий focus; три mobile slides — без горизонтального переповнення/перетину CTA та controls. Після паузи слайд залишається тим самим між перевірками. Team detail: desktop дві колонки, mobile одна; один H1, Enter відкриває фото, після відкриття фокус на «Закрити», Escape закриває й повертає фокус до тригера. Tab після єдиної кнопки дає activeElement BODY, наступний Tab повертається на «Закрити»; фонові page links у цій послідовності фокусу не отримали. Повний modal focus audit лишається D8. В inspected home/team flows console errors не виявлено. Map href доводить target/scroll offset, не доступність стороннього Google iframe. Reduced-motion preference і synthetic empty/missing-href cases перевірені VM, не браузерною емуляцією; screen reader/zoom/всі devices не перевірялися.

**Регресії:** [check-heading-seo.mjs](../../scripts/check-heading-seo.mjs) виконує справжній HeroSlider через transpile/VM зі state/effects mocks та React SSR: єдиний H1, inert slides, CTA без href, ручні переходи й wrap, focus/hover/reduced-motion timer gates, cleanup, pointer-focus pause race, один/нуль slides. Це не заміна browser React scheduler; pointer/keyboard flows окремо пройшли в браузері. [check-jsonld-seo.mjs](../../scripts/check-jsonld-seo.mjs) тепер також перевіряє один team H1 із photo/null. Listing regression та 3 наявні `pnpm run test` перевірки — PASS.

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
5. **SEO-6 — семантика:** SEO-6.1–6.7 завершено локально; далі SEO-6.8 — окремий свіжий heading crawl F11. Ширший аудит лишити D8. **SEO-7 — вимірювання:** production baseline і лише підтверджена оптимізація; зараз performance-дефект не заявляється.
6. **Редакційні залежності / SEO-L:** власник підтверджує факти й перелік готових сторінок; домен/Search Console/відкриття індексації — окреме фінальне рішення. До нього не прирівнювати технічний PASS до готовності контенту.
