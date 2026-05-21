# Unit 03: Team Page (Сторінка команди)

## Goal

Створити сторінку команди (`/team`) та детальні сторінки окремих служителів (`/team/[slug]`).
Дані підтягуються з Sanity CMS. Візуальний стиль — адаптація Larexa Team з двома секціями (рукопокладені та відповідальні).

## Data Model (Sanity Schema: `teamMember`)

| Поле | Тип | Обов'язковість | Опис |
|------|-----|----------------|------|
| `name` | `string` | required | Ім'я служителя |
| `slug` | `slug` | required | URL-ідентифікатор (source: name) |
| `category` | `array of string` | required | Масив: `ordained` (рукопокладений) та/або `responsible` (відповідальний) |
| `title` | `string` | optional | Сан (для рукопокладених: пастор, диякон тощо) |
| `responsibility` | `string` | optional | За що відповідальний (для відповідальних) |
| `bio` | `text` | optional | Біографія |
| `photo` | `image` | required | Фото (hotspot: true) |
| `order` | `number` | optional | Порядок відображення (менше = вище) |

### Бізнес-логіка категорій

- Людина може бути **лише рукопокладеною**, **лише відповідальною**, або **одночасно обома**.
- Якщо людина є в обох категоріях — вона відображається в **обох секціях** сторінки.

## Design — Сторінка `/team`

### Layout

1. **PageHero** — frosted-glass, breadcrumbs: `Головна → Команда`, backgroundImage відрізняється від інших сторінок.

2. **Секція «Рукопокладені служителі»** — Section Title + Grid 4 колонки:
   - Кожна картка: фото (кругле або прямокутне — як у Larexa), ім'я, сан.
   - При hover: градієнтний оверлей (`--gradient-start → --gradient-end`) знизу вгору.
   - Картка є лінком на `/team/[slug]`.

3. **Секція «Відповідальні за служіння»** — Section Title + Grid 4 колонки:
   - Кожна картка: фото, ім'я, відповідальність.
   - Ті ж hover-ефекти, так само є лінком.

### Responsive
- Desktop: 4 колонки
- Tablet: 2 колонки
- Mobile: 1 колонка

### Color tokens
- Section bg: `white`
- Card name: `--color-gray-800` (#343a40)
- Card position: `gradient-text` (primary gradient)
- Card description: `--color-gray-600`
- Hover overlay: `linear-gradient(to top, rgba(--gradient-start, 0.85), transparent)`

## Design — Сторінка `/team/[slug]`

### Layout

1. **PageHero** — breadcrumbs: `Головна → Команда → [Ім'я]`
2. **Content Section:**
   - Фото служителя (велике, зліва або зверху)
   - Ім'я, сан та/або відповідальність
   - Біографія (повний текст)
3. Оформлення в загальному стилі сайту (container-larexa)

## File Structure

```
app/(front)/team/
├── page.tsx                    — Серверна сторінка списку
├── queries.ts                  — GROQ-запити (defineQuery)
├── components/
│   ├── index.ts               — Barrel file
│   └── TeamMemberCard.tsx      — Картка служителя (shared між секціями)
└── [slug]/
    ├── page.tsx               — Детальна сторінка служителя
    └── queries.ts             — GROQ-запити для деталі

sanity/schemaTypes/
└── teamMember.ts              — Нова Sanity-схема

sanity/lib/types.ts            — Додати SanityTeamMember, SanityTeamMemberCard
```

## Verify when done

- [ ] Sanity schema створена та зареєстрована
- [ ] TypeGen успішно генерує типи (`npm run typegen`)
- [ ] Сторінка `/team` рендериться з двома секціями
- [ ] Картки є посиланнями на `/team/[slug]`
- [ ] Hover-ефект з градієнтним оверлеєм працює
- [ ] Сторінка `/team/[slug]` рендериться з біографією
- [ ] generateStaticParams працює для [slug]
- [ ] `npm run build` проходить без помилок
- [ ] Responsive: 4/2/1 колонки
