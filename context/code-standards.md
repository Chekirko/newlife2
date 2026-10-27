# Code Standards

Чинні рішення й фази — [master-plan](master-plan.md); процес — [ai-workflow-rules](ai-workflow-rules.md). Історичні QA-журнали не є новими вимогами.

## General

- Лише pnpm; версія за `package.json#packageManager`. Не визначати major pnpm за версією lockfile. Після dependency/patch changes перевіряти `pnpm install --frozen-lockfile`.
- Karpathy: явні припущення, найпростіший достатній код, зміни в межах фази, перевіряльний результат.
- Маленькі модулі; named exports, крім page/layout conventions. Спільні transformers — у `lib/`, без передчасних абстракцій.
- Кирилицю редагувати інструментами редагування, не PowerShell pipes/Out-File/redirects. Файли UTF-8.
- Commit/push — окремий гейт після перевіреної фази; `codex/*` гілки, master через PR. Деталі CI — [docs/ci.md](../docs/ci.md).

## TypeScript

- Strict mode, без `any`; `unknown` + narrowing для невідомих даних.
- Перевага TypeGen results; ручні типи — `sanity/lib/types.ts`. `client.fetch<T>()` має типізований результат.
- Не редагувати generated `sanity/lib/sanity.types.ts`, `schema.json`, Next route types вручну.

## Next.js (App Router)

- Server Components за замовчуванням; `'use client'` лише для browser interactivity. Початковий fetch у server page/layout, без `useEffect` для CMS-контенту.
- `next/dynamic` — для справді відкладеного клієнтського острівця, не для статичних серверних секцій.
- Page-specific GROQ у page `queries.ts`; запити для 2+ сторінок — `sanity/lib/queries.ts`; завжди `defineQuery()` з `next-sanity`.
- Початкові дані та Server Actions використовують той самий transformer; великі колекції шукаються/фільтруються/пагінуються серверно. Не тягнути весь mediaItem dataset у браузер.
- **Поточний кеш:** `revalidate = 60`, `useCdn: false`; сторінки з `searchParams` динамічні. **Фаза 2 / B6:** статичні маршрути, path pagination, webhook/tags. Не називати всі CMS-сторінки статичними до цієї зміни.
- Client state на першому рендері має збігатися з SSR; reduced-motion не повинен змінювати початкову розмітку. B6 не скасовує актуальність часових даних.

## Styling and Images

- Tailwind v4 + tokens із `app/globals.css`; дизайн — [spec 08](specs/08-larexa-redesign.md), не скляні hero/великі радіуси.
- B4 реалізовано: локальні Montserrat (heading, кирилиця), Roboto (body), Playfair italic (accent), через `app/site-fonts.ts`/`next/font/local`. Файли — лише latin + cyrillic за `unicodes` із sources.json; при оновленні шрифту повторити subset, зберегти ліцензії й sources.json; не повертати remote font CSS.
- B3 реалізовано: серверний `Icon` (`server-only`) + `lib/icons.ts`, inline SVG і CMS-сумісні FA-назви. Client controls використовують малий `ControlIcon`, спільна розмітка — `SvgIcon`; CMS-реєстр не потрапляє в браузер. Декоративні іконки aria-hidden; icon-font CSS не додавати.
- B1 реалізовано: використовувати `SiteImage` для Sanity CDN прев’ю (власний loader, q=75/auto=format, `sizes`/LQIP). `toPhotoItem()` відділяє thumbUrl від fullUrl; оригінал/unoptimized дозволений лише у viewer та завантаженні. Next кодує AVIF з якістю quality−20: для групових фото й облич через Next optimizer ставити `quality={90}`. Не повертати deferred-original компонент.
- `next/image` замість важких CSS-фонів; `preload` лише для LCP. `sizes` враховує фактичний cover-crop, а не лише viewport.
- Немає asset → `ImagePlaceholder`, а не посилання на неіснуючий файл. У gallery пропускати assets без необхідних dimensions.

## File Organization

- `app/(front)/[page]/components/queries.ts/actions.ts` — page ownership; `components/` — реальний reuse; `lib/` — shared logic.
- `sanity/schemaTypes/` — CMS, `sanity/components/` — inputs, `sanity/lib/` — client/query/image/types.
- Активний контекст — `context/*.md`; завершені specs — `context/specs/done/`; історія — `context/archive/` і `docs/archive/`.
- `patches/*.patch -text` у `.gitattributes`: не змінювати CRLF generated patch. Зміна patch = workspace metadata + lockfile + frozen install. Не фільтрувати глобальний `console.error`.

## Sanity References

- Кожен `type: 'reference'` у схемах — з `weak: true`.
- Після GROQ `->` дані nullable: перевіряти reference/обов’язкові поля перед рендером. Видалений документ ховає блок, не ламає сторінку.
- Nullable ручні типи узгоджувати з реальним результатом; порожні/incomplete leaders фільтрувати до вибору single/grid layout.

## Rich Text (Portable Text)

- `news.body`, `event.body`, `ministry.fullDescription`, `teamMember.bio` — shared `richTextBlocks`: H2–H4, Quote, decorators, lists, links, images із alt. Карткові excerpt/description лишаються plain text.
- Рендер — `PortableTextBody` (server), із legacy-string fallback; не raw PortableText без mappings і не неіснуючий `prose` plugin.
- Detail GROQ проєктує inline-image `asset->metadata.dimensions`; description із rich text через `toPlainText()`, legacy string перевіряти окремо.
- Зміна stored type потребує окремої dry-run міграції/backup/revision guard; виконані одноразові міграції не є поточними командами проєкту.

## Sanity Singletons & Studio

- Singleton реєструється в `structure.ts` із fixed documentId і в `sanity.config.ts#SINGLETON_TYPES`; seed fixed `_id`, dry-run by default.
- `getSiteSettings()` і відповідні homepage/about helpers об’єднують CMS із типізованими фолбеками. Соцмережі — один `lib/social.ts` registry для схеми й рендера.
- Gallery uploads — нативний `onSelectFile` із upload-capable source; Sanity 4.22 image arrays не передають `onUpload`. Перевіряти installed props, не лише interface.
- Existing-assets picker — Studio `useClient` + параметризований `defineQuery`, abort старого пошуку, retry; один native `onInsert`, унікальні `_key`, повторна перевірка readOnly/дублів/залишку до 10. Не stale `set([...value])`.
- QA не пише fixtures у живу CMS. Для inputs перевіряти 0/1/2/10 фото, ліміт 11, search/load-more/keyboard; mock не може вигадувати native callback.

## SEO & New Pages

- `generateMetadata()` → `getPageMetadata()`, явний canonical; helper повертає повні OG/Twitter objects. Абсолютні URL тільки з `SITE_URL`.
- Description: власний текст → CMS default → fallback. Social image: detail → CMS ogImage → hero. Title/description очищати; UI-зображення не підміняти social crops.
- JSON-LD через `jsonLdHtml()` (екранує `<`); стабільні entity IDs та фактичний route slug. Дати через `schemaDate()`; не вигадувати author/uploadDate/адресу/organizer із технічних полів.
- Видимий контент і structured data мають збігатися. Media ItemList слідує поточному cards state; порожній не емітується. Schema validity не гарантує rich results.
- Listings: `normalizeListingParams()` до metadata/fetch; безпечні slice/count, 307 для невалідних/дубльованих params, 404 для N поза count, власний canonical непорожньої пагінації. Filter/search — noindex.
- **До Фази 3:** чинний `lib/seo-readiness.ts` спільний для metadata/sitemap; реєстр порожній, root/header noindex й Disallow збережено. Новий маршрут узгодити зі спільним переліком і sitemap, без автоматичного відкриття індексації.
- **B2 / Фаза 3:** заміна реєстру перемикачем indexing + документний `seo.noIndex`; опис цілі — у master-plan, код поки старий. Фактичне відкриття — лише [§F](master-plan.md#f-launch-checklist-найостанніший-крок).

## Security Headers & Contact

- Headers у `next.config.ts`; CSP наразі Report-Only, Studio виключене. Enforce без nonce — Фаза 7/B8 після runtime smoke; allowlist звіряти з реальними embeds.
- Контактний Action: server Zod/honeypot; server-only mail/Redis, plain text, visitor email лише Reply-To, recipient тільки env/CMS. Durable atomic limiter із TTL; fail closed без конфігурації/Redis. Значення зберігати при помилці, статус оголошувати доступно.
- Жодних секретів у public env, Git, logs або raw Sanity error dumps. Виводити лише безпечні code/status. `.env.example` містить імена й порожні secrets.
- [Контактна форма](../docs/contact-form.md) описує конфіг і межі mock QA; реальна доставка потребує окремого тесту.

## Accessibility (WCAG 2.2 AA)

- Один H1, rank за структурою повної сторінки, розмір через CSS. Pre-title/підпис автора — не новий heading. Sidebar/footer rank не залежить від кількості карток.
- Нативні button/link/details/dialog, accessible names, `aria-current` для активної навігації; disclosure `aria-expanded`, закритий вміст не фокусується. Декоративні icons/images приховані від AT, якщо visible label уже називає посилання.
- Текст ≥4.5:1; на світлому green text/focus — `text-primary-text`; білий текст лише на `.bg-grad-readable`, без opacity-зниження. Глобальний focus-visible не прибирати без заміни.
- DOM порядок відповідає читанню/Tab; hidden carousel slides inert; автоплей не додавати. Native dialog: Esc/бекдроп/стрілки/межі/scroll lock/focus restore, усі controls всередині modal, mobile без overflow.
- Перевірки UI на 1280/390/320px та клавіатурою; SSR/regex/VM PASS не засвідчує browser hydration чи повний WCAG. Незакриті проблеми — Фаза 6.

## Verification

`pnpm run lint`, `pnpm run typecheck`, `pnpm test`, `pnpm run build`; Windows довгі команди через `cmd /c`. Поточні `check-*.mjs` збережені до Фази 7; не розширювати VM-імітацію як заміну browser QA.

Для runtime performance — production build, `scripts/measure-seo-performance.mjs`, 3 зіставні прогони та медіани. Одна серія до/після на фазу; записати профіль і суттєві warnings. Simulated Lighthouse не є польовими CWV/INP. Для Фази 0 без runtime-змін Lighthouse/скриншоти не дають нового доказу: перевірити незмінність source, залежності ресурсів і build.

## Naming Conventions

Компоненти PascalCase; helpers camelCase; GROQ UPPER_SNAKE_CASE; CSS kebab-case; ручні CMS-типи з префіксом Sanity.
