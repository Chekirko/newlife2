# SEO-аудит до запуску

Дата: 2026-10-26. **SEO-1 завершено; виправлення ще не виконані.** Специфікація: [05-prelaunch-seo.md](../../context/specs/05-prelaunch-seo.md). Звіт доповнюється в наступних SEO-сесіях.

## Висновки

- Основа вже працює: 44/44 адреси локального sitemap відповідають HTTP 200, мають різні title та canonical із правильним шляхом; 5 перевірених відсутніх адрес повертають 404 із noindex. Переписувати ці механізми з нуля не потрібно.
- Pre-launch crawling заблоковано. Водночас публічна Production-головна доступна без авторизації та без meta/header noindex. Сам `Disallow: /` не гарантує відсутності адрес у пошуку; це перший предмет SEO-2, а не дозвіл зняти блокування.
- 42/44 сторінки sitemap успадковують OG URL головної. `/about` має власний OG URL, але втрачає OG-зображення. SEO-поля CMS не підключені до metadata.
- Виявлено відтворювані дефекти: 500 на некоректному номері сторінки новин/подій; падіння ministry-шаблону з нерозв’язаним weak-reference; відсутній H1 головної, дубльовані H1 служителів і пропуски рівнів заголовків.
- Редакційна готовність не встановлена: заповнені поля не підтверджують факти. Є оголошення без тексту/опису, відома суперечність історії та непогоджений набір готових сторінок. Найменші технічні виправлення: OG defaults, null-guard, перевірка page та чесний lastmod; порядок визначає план нижче.

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

## Порядок дій

1. **SEO-2 — захист до запуску:** F01 і контракт F02; перевірити Preview/platform access, зберегти всі обмеження. Це найвищий пріоритет, не відкриття індексації.
2. **SEO-3 — невеликі metadata-виправлення:** F07–F10; спочатку defaults/static, потім dynamic. OG `/about` і підключення наявних SEO-полів — окремі малі результати, не SEO-платформа.
3. **SEO-4 — URL/sitemap:** F02/F03/F05/F06; lastmod і page-валідація — невеликі підтверджені правки. Зберегти робочі canonical та 404, застосувати політику SEO-2.
4. **SEO-5 — JSON-LD і неповні дані:** почати з F04, далі звірити шаблони Event/VideoObject/Person/NewsArticle з видимими даними й актуальними вимогами. Не обіцяти rich results.
5. **SEO-6 — семантика:** F11, почати з homepage hero + team detail; ширший аудит лишити D8. **SEO-7 — вимірювання:** production baseline і лише підтверджена оптимізація; зараз performance-дефект не заявляється.
6. **Редакційні залежності / SEO-L:** власник підтверджує факти й перелік готових сторінок; домен/Search Console/відкриття індексації — окреме фінальне рішення. До нього не прирівнювати технічний PASS до готовності контенту.
