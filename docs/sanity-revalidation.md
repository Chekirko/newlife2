# Оновлення статичних сторінок із Sanity

Публічний контент читається через `sanity/lib/fetch.ts`: published perspective, `force-cache`, теги типів документів. `useCdn: false` дає свіжі дані з Content Lake під час оновлення кешу. Запити з `->` позначають також тип referenced-документа; `sanity.imageAsset` додається до всіх запитів для оновлення метаданих фото. Studio використовує власний авторизований `useClient`, поза цим кешем.

## Налаштування власником

1. Згенерувати довгий випадковий секрет. Додати `SANITY_REVALIDATE_SECRET` у Vercel для потрібного середовища й перевипустити deployment. Не додавати значення в Git або URL.
2. У [Sanity Manage](https://www.sanity.io/manage) → проєкт → API → Webhooks створити webhook для dataset `production`.
3. URL: `https://<домен-сайту>/api/revalidate`, метод `POST`, triggers **Create / Update / Delete**. Drafts і versions вимкнути. Filter:

   ```groq
   _type in ["siteSettings", "homepage", "pageHeroes", "aboutPage", "news", "event", "ministry", "teamMember", "mediaItem", "sanity.imageAsset"]
   ```

4. Projection: `{_type}`. У полі **Secret** ввести той самий секрет. Увімкнути webhook.
5. Після звичайної редакторської публікації перевірити delivery log: HTTP 200 і `{ "revalidated": "<тип>" }`. Відкрити змінену сторінку й повторити запит після фонового оновлення. Так само перевірити видалення/зняття публікації та створення нового slug без нового deployment.

Без секрету endpoint повертає 503; без коректного підпису — 401/400; невідомий тип — 400. Секрет і тіло запиту не логуються. `parseBody` перевіряє підпис і чекає узгодженості Content Lake.

## Поведінка кешу

`revalidateTag(type, 'max')` позначає дані застарілими. Наступний запит може отримати попередню версію й запускає фонове оновлення; наступні запити отримують нову. Вебхук не оновлює вже відкриту вкладку автоматично. Це [stale-while-revalidate у Next.js](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).

`/`, `/events`, `/events/page/[n]`, `/events/[slug]` додатково мають `revalidate = 3600`, щоб часові блоки оновлювались без змін у CMS. Перевірка YouTube Live зберігає власний кеш 900 с. Інші сторінки оновлюються за тегами.

Новини й події мають `/news/page/2` та `/events/page/2`; категорії — `/news/category/<категорія>` і `/page/2` у межах категорії, з noindex. Нові slug-и, категорії та сторінки пагінації генеруються на вимогу завдяки `dynamicParams = true`. Невалідні/відсутні сторінки повертають 404; `/page/1` і числа з початковими нулями перенаправляються на канонічний шлях через `next.config.ts` до рендерингу. Категорії звіряються з CMS-назвами; закодовані кириличні params із prerender декодуються, зберігаючи літеральні CMS-назви. Старі query-параметри списків ігноруються.

`/media` віддає статичні перші 12 карток. Пошук/category/speaker відновлюються з URL після hydration через Server Actions; весь dataset у браузер не передається. `/media/photos` слідує порядку служінь (`order`, title, `_id`) й порядку фото в CMS-масиві.

Локальні перевірки підписаних HTTP-запитів не замінюють налаштування webhook у Sanity та перевірку delivery log на Vercel. CMS-контент для QA не змінюється. Індексація лишається закритою до окремого запуску.
