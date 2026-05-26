# Architecture Context

## Stack

| Layer       | Technology                      | Role                                      |
| ----------- | ------------------------------- | ----------------------------------------- |
| Framework   | Next.js 16 (App Router) + TS    | SSG/SSR, routing, React Server Components |
| CMS         | Sanity v3                       | Контент, медіа, вбудоване Studio          |
| CMS Client  | next-sanity + @sanity/image-url | GROQ-запити, генерація URL зображень      |
| Styling     | Tailwind CSS v4 + globals.css   | Utility-first + кастомна дизайн-система   |
| Types       | Sanity TypeGen                  | Автогенерація TS-типів з GROQ-запитів     |
| Deploy      | Vercel                          | CI/CD, edge functions, preview            |
| Fonts       | Google Fonts (Poppins, Roboto, Playfair Display) | Типографіка              |

## System Boundaries

- `app/(front)/` — Публічні сторінки (homepage, news, ministries, history)
- `app/(front)/components/` — Компоненти ТІЛЬКИ для homepage
- `app/(front)/news/components/` — Компоненти ТІЛЬКИ для сторінок новин
- `app/(front)/ministries/components/` — Компоненти ТІЛЬКИ для списку служінь
- `app/(front)/ministries/[slug]/components/` — Компоненти для деталей служіння
- `app/(front)/team/components/` — Компоненти для сторінки команди (TeamSection, HonorarySection, TeamPhotoBanner, TeamMemberCard)
- `app/(front)/**/queries.ts` — GROQ-запити, локальні для кожної сторінки
- `app/studio/` — Sanity Studio (не модифікувати вручну)
- `components/` — Спільні компоненти (Header, Footer, HeroSlider, NewsSlider, PageHero)
- `components/sections/` — Спільні секційні компоненти
- `components/ui/` — Базові UI-компоненти (MinistryCard)
- `sanity/lib/` — Sanity client, image helper, спільні запити, згенеровані типи
- `sanity/lib/queries.ts` — ТІЛЬКИ спільні GROQ-запити (використовуються 2+ сторінками)
- `sanity/schemaTypes/` — Sanity-схеми документів (ministry, news, event)
- `lib/` — Загальні утиліти (formatDate та ін.)
- `public/images/` — Статичні зображення (hero-фони, іконки)

## Storage Model

- **Sanity Content Lake**: Весь динамічний контент (новини, служіння, події, текстові описи)
- **Sanity CDN**: Медіа-файли (фотографії, зображення галерей)
- **`public/`**: Статичні ресурси (hero-фони, логотип, іконки, фото пастора)

## Caching and Revalidation Model

- **Incremental Static Regeneration (ISR)**: Усі динамічні сторінки, що завантажують контент із Sanity, використовують Next.js ISR для автоматичного оновлення кешу у фоновому режимі.
- **Інтервал ревалідації**: Сторінки експортують `revalidate = 60` (кешування не більше ніж на 60 секунд) для балансу продуктивності та актуальності.
- **Пряме опитування API (Bypass CDN)**: Клієнт Sanity налаштований з `useCdn: false`, щоб під час фонової регенерації Next.js отримував найсвіжіші опубліковані зміни безпосередньо з Live API, оминаючи затримки кешу CDN.

## Auth and Access Model

- Публічний сайт — авторизація користувачів відсутня
- Sanity Studio (`/studio`) — доступ через Sanity Dashboard (окремий логін)
- Контент-менеджер оновлює дані через Studio без участі розробника

## Invariants

1. Весь динамічний контент живе ТІЛЬКИ в Sanity — жодних hardcoded даних для CMS-типів
2. GROQ-запити визначаються через `defineQuery()` з `next-sanity` — для TypeGen сумісності
3. Спільні компоненти (`components/`) НІКОЛИ не імпортують з page-level директорій (`app/(front)/components/`)
4. Page-level компоненти НЕ виносяться в `components/` без підтвердження переиспользування на 2+ сторінках
5. Кириличний текст записується ТІЛЬКИ через інструменти редагування — НІКОЛИ через PowerShell pipe/Out-File
6. `npm run build` ПОВИНЕН проходити перед кожним push/deploy
7. Sanity TypeGen (`npm run typegen`) запускається при зміні GROQ-запитів або Sanity-схем
8. CSS-кольори використовують ТІЛЬКИ токени з `globals.css` (`--color-primary`, `--gradient-start/end`) — жодних raw hex
9. Відповідальні особи та лідери служінь зв'язуються як references до `teamMember` замість збереження inline-тексту та фото
