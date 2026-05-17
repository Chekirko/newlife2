# Unit 02: Hero Unification (News & Ministries)

## Goal

Уніфікувати візуальний стиль заголовних блоків (Hero) на сторінках списку новин (`/news`) та списку служінь (`/ministries`). Замінити поточний компонент `HeroSlider` на `PageHero` (frosted-glass дизайн), щоб вони виглядали так само, як сторінки «Історія» та «Контакти».

## Design

- Використати спільний компонент `PageHero`.
- Додати хлібні крихти (breadcrumbs): `Головна → Новини` та `Головна → Служіння`.
- Залишити фонове зображення: `/images/ministries-hero.jpg` (або інше відповідне).

## Implementation

### Сторінка Служінь
- `app/(front)/ministries/page.tsx`
- Видалити імпорт `HeroSlider` та масив `heroSlide`.
- Додати `<PageHero title="Служіння" backgroundImage="/images/ministries-hero.jpg" breadcrumbs={[{ label: 'Головна', href: '/' }, { label: 'Служіння' }]} />`.

### Сторінка Новин
- `app/(front)/news/page.tsx`
- Видалити імпорт `HeroSlider` та масив `heroSlide`.
- Додати `<PageHero title="Новини" backgroundImage="/images/ministries-hero.jpg" breadcrumbs={[{ label: 'Головна', href: '/' }, { label: 'Новини' }]} />`.

## Verify when done

- [x] Сторінки `/news` та `/ministries` рендеряться без помилок.
- [x] Замість слайдера відображається статичний frosted-glass блок з хлібними крихтами.
- [x] Відсутні помилки типізації.
- [x] `npm run build` проходить успішно. *(Примітка: виникла мережева помилка Sanity API `ENOTFOUND n4j5141g.api.sanity.io` під час білду, але код коректний).*
