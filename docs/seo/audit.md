# SEO-аудит до запуску

Дата: 2026-10-26. **SEO-1, SEO-2.1, SEO-2.2, SEO-3.1, SEO-3.2 і SEO-4.1 завершено локально; наступний юніт — SEO-4.2.** Специфікація: [05-prelaunch-seo.md](../../context/specs/05-prelaunch-seo.md). Матриця середовищ і контракт готовності — у «SEO-2.1», noindex — у «SEO-2.2», metadata — у «SEO-3», готовність/sitemap/lastmod — у «SEO-4.1»; початкові докази SEO-1 збережені як baseline.

## Висновки

- Основа працює: 44/44 початкові адреси sitemap у SEO-1 відповідали HTTP 200 із canonical правильного шляху; доступність і canonical повторно підтверджені у SEO-4.1, 5 відсутніх адрес — 404/noindex. Нинішній sitemap навмисно порожній: запуск і жодна сторінка не схвалені.
- Pre-launch crawling заблоковано. За останньою live-перевіркою SEO-2.1 Production alias публічний без meta/header noindex. SEO-2.2 додав обидва сигнали в коді; актуальний live deployment окремо не перевірений. Сам `Disallow: /` і noindex, який crawler може не прочитати, не гарантують відсутності адрес у пошуку; F01 залишається відкритим.
- SEO-3.1 виправив соціальні metadata 11 статичних маршрутів, OG image `/about` і CMS defaults; SEO-3.2 — чотири detail families, фото матеріалу та description fallback оголошення. F07–F10 технічно закриті локально: 62 GET і 32 metadata fixtures SEO-3.2 — PASS. Остаточні тексти/редакційна готовність та live social preview не засвідчені.
- Виявлено відтворювані дефекти: 500 на некоректному номері сторінки новин/подій; падіння ministry-шаблону з нерозв’язаним weak-reference; відсутній H1 головної, дубльовані H1 служителів і пропуски рівнів заголовків.
- SEO-4.1 технічно закрив F02/F03 локально: спільний критерій metadata/sitemap, порожній launch approval і чесний lastmod; 58 GET та 103 fixture-перевірки. Редакційна готовність не встановлена: оголошення без тексту, суперечність історії та непогоджені факти лишаються SEO-L. Наступні виправлення — query/page/canonical (SEO-4.2), потім JSON-LD/null-guard (SEO-5).

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
| F11. H1 і рівні heading неузгоджені | `/` → 0 H1, HeroSlider використовує h2. Усі 11 `/team/[slug]` мають 2 однакові H1: PageHero + ім’я в body. `/ministries` → H1,H2,H6; `/news` → H1,H4; `/team` → H2,H5 | Середній для семантики/навігації; це не доказ санкцій або втрати конкретних позицій | SEO-6 почати з головного hero й team detail (1–2 шаблони), зберегти візуальні класи; картки/sidebar перенести в наступний під’юніт за потреби | P2 / SEO-6 |

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

## Порядок дій

1. **SEO-2 — локальні юніти завершено:** SEO-2.1 — матриця/політика, SEO-2.2 — noindex metadata/header та 66 локальних GET. F01: Production alias публічний за останнім live-аудитом, settings не перевірені; F02 реалізовано у SEO-4.1. Усі обмеження збережено.
2. **SEO-3 завершено локально:** defaults/static та чотири detail families перевірені; F07–F10 технічно закриті. Commit+push SEO-3.2 прямо погоджено користувачем; результат — у git history та фінальному повідомленні. Контентна готовність/live social preview не засвідчені.
3. **SEO-4.1 завершено локально; наступний SEO-4.2:** F02/F03 технічно закриті, 58 GET/103 fixture-перевірки. F05/F06 — page-валідація/пагінація/canonical. Зберегти робочі canonical/404 та noindex/Disallow.
4. **SEO-5 — JSON-LD і неповні дані:** почати з F04, далі звірити шаблони Event/VideoObject/Person/NewsArticle з видимими даними й актуальними вимогами. Не обіцяти rich results.
5. **SEO-6 — семантика:** F11, почати з homepage hero + team detail; ширший аудит лишити D8. **SEO-7 — вимірювання:** production baseline і лише підтверджена оптимізація; зараз performance-дефект не заявляється.
6. **Редакційні залежності / SEO-L:** власник підтверджує факти й перелік готових сторінок; домен/Search Console/відкриття індексації — окреме фінальне рішення. До нього не прирівнювати технічний PASS до готовності контенту.
