// =========================================
// HERO_SLIDES_FALLBACK — typed default homepage hero slides.
//
// Pure data, no runtime dependencies (the HeroSlide import is type-only and
// erased at build time). This keeps it importable from BOTH the Sanity-aware
// `lib/homepage.ts` (fallback when the CMS array is empty) and the standalone
// `scripts/seed-homepage.ts` node script (which can't pull the Sanity client).
// It is also the canonical SHAPE of a hero slide.
// =========================================

import type { HeroSlide } from '../components/sections/Hero'

export const HERO_SLIDES_FALLBACK: HeroSlide[] = [
  {
    id: '1',
    backgroundImage: '/images/hero-church-1.jpg',
    preTitle: 'Ласкаво просимо',
    title: 'Знайди надію, знайди дім',
    subtitle:
      'Церква «Нове Життя» — це місце, де кожен може зустріти Бога, знайти спільноту та розкрити своє призначення.',
    buttonText: 'Дізнатися більше',
    buttonHref: '/about',
    secondaryButtonText: 'Запланувати візит',
    secondaryButtonHref: '/contact',
    align: 'center',
  },
  {
    id: '2',
    backgroundImage: '/images/hero-church-2.jpg',
    preTitle: 'Кожної неділі о 10:00',
    title: 'Приєднуйтесь до богослужіння',
    subtitle: 'Прославлення, проповідь Слова та спільнота — чекаємо на вас!',
    buttonText: 'Як нас знайти',
    buttonHref: '/contact',
    align: 'center',
  },
  {
    id: '3',
    backgroundImage: '/images/hero-church-3.jpg',
    preTitle: 'Молодіжне служіння',
    title: 'Знайди своє місце',
    subtitle: "Щоп'ятниці о 19:00 — worship, спілкування та навчання для молоді.",
    buttonText: 'Молодіжне служіння',
    buttonHref: '/ministries/youth',
    align: 'center',
  },
]
