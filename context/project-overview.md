# Церква «Нове Життя» — Вебсайт

## Overview

Україномовний сайт церкви «Нове Життя» (Борислав, УЦХВЄ) для громади й нових відвідувачів. Next.js + Sanity, Vercel; сайт до запуску. Чинний [master-plan](master-plan.md) визначає фази й рішення, [tracker](progress-tracker.md) — завершений обсяг, [spec 08](specs/08-larexa-redesign.md) — цільовий дизайн Larexa.

## Goals and User Flow

Відвідувач бачить, коли й де проходить богослужіння, знайомиться з церквою/служіннями, читає події та новини, дивиться медіа й може зв’язатися з церквою. Редактор публікує контент через Studio без правок коду.

Пріоритети нового плану: серверний рендеринг і статична генерація, Lighthouse mobile Performance ≥95 (100 для контентних сторінок), Accessibility/Best Practices 100; SEO 100 після окремого запуску. До запуску SEO обмежений noindex. Це цілі, не засвідчені поточні результати.

## Current Features

| Маршрут | Наявна функціональність |
| --- | --- |
| `/` | CMS hero-слайдер, умовний Live, події, місія, пастор, розклад, «Що ви знайдете», новини, свідчення, FAQ, «Актуальне слово», CTA |
| `/about` | Місія, історія, віровчення, цінності, очікування, керівництво, статистика; singleton aboutPage |
| `/history` | Timeline із фото й details; контент поки в коді |
| `/ministries`, `/ministries/[slug]` | Картки/опис/галерея, одна або кілька відповідальних осіб, пов’язані новини; фото опційне, є ImagePlaceholder |
| `/team`, `/team/[slug]` | Почесні, рукопокладені, групове фото, кандидати, відповідальні; категорії можуть поєднуватися; біографія й масив відповідальностей |
| `/news`, `/news/[slug]` | Статичні path-категорії/пагінація/sidebar, Portable Text, основне фото + до 10 додаткових, спільний viewer; weak зв’язки зі служіннями |
| `/events`, `/events/[slug]` | Статичні списки/path-пагінація, події й оголошення в одній моделі, дати/дедлайни, список/sidebar/detail; Event JSON-LD лише для придатних даних події |
| `/media` | Статичні перші 12 YouTube-карток, серверний пошук/category/speaker, Server Actions без повного reload, load-more по 12, відео-lightbox |
| `/media/photos` | Агрегат ministry.gallery, бенто, load-more й фото-viewer; стабільний порядок служінь і CMS-масивів фото |
| `/contact` | Контакти/розклад/карта, Server Action форма → Upstash limiter + Resend; production secrets і реальну доставку ще налаштовує власник |
| `/privacy` | Заглушка/noindex; потрібен справжній текст до запуску |
| `/studio` | Sanity login, редагування контенту, media library, gallery multiple upload і пакетний Select наявних assets |

«Актуальне слово» використовує weak reference з homepage або найновішу проповідь. Live-банер на головній під hero та на media потребує channel ID у Studio + `YOUTUBE_API_KEY`. Без конфігурації секція схована.

Контентні фото відкриваються у спільному відкладеному native viewer, включно з rich text/history/team photo. Сторінки показують адаптивні CDN-прев’ю; оригінали доступні у viewer та для завантаження. Відео має native dialog, карта — Google iframe (lazy) і зовнішнє посилання. Публічний сайт і Studio мають окремі root layouts.

## Scope and Planned Changes

Зараз CMS має singletons siteSettings/homepage/pageHeroes/aboutPage та колекції ministry/news/event/teamMember/mediaItem. NAP, розклад, соцмережі й defaults — siteSettings; статистика — aboutPage. Фолбеки забезпечують неповні CMS-дані; контентні факти потребують перевірки редактором.

Фундамент швидкодії Фази 1 та static-first/cache/webhook Фази 2 реалізовано; підключення вебхука в Sanity/Vercel — [дія власника](../docs/sanity-revalidation.md). Далі: єдиний indexing-механізм і SEO (3), Larexa components/редизайн сторінок зі статичним hero (4–5), доступність (6), browser/unit/CI перевірки та CSP (7), контент/дії власника (8), окремо погоджений запуск (9).

Рекомендації master-plan §E — backlog, не автоматично дозволений scope: «Я тут уперше», sermon detail pages, календар, give, молитовні потреби тощо. Авторизація публічних відвідувачів, processing платежів, newsletter, коментарі й мультимовність не входять у поточну реалізацію.

## Success Criteria

- `pnpm run build`, lint, typecheck і наявні тести проходять; контекст відповідає фактичному коду.
- Контент керується зі Studio; nullable references та неповні дані не ламають UI.
- Mobile/desktop, клавіатура, зрозумілий фокус, production browser smoke й Lighthouse перевіряються відповідно до фази.
- Privacy/факти/NAP і конфігурація сервісів готові; запуск лише за [§F master-plan](master-plan.md#f-launch-checklist-найостанніший-крок), не як побічний ефект рефакторингу.
