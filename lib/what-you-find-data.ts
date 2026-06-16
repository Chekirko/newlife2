// =========================================
// WHAT_YOU_FIND_FALLBACK — typed default "Що ви знайдете" cards.
//
// Pure data, no runtime dependencies (the MinistryItem import is type-only and
// erased at build time). Importable from BOTH the Sanity-aware `lib/homepage.ts`
// (fallback when the CMS array is empty) and the standalone
// `scripts/seed-homepage-sections.ts` node script. Also the canonical SHAPE.
// =========================================

import type { MinistryItem } from '../app/(front)/components/Ministries'

export const WHAT_YOU_FIND_FALLBACK: MinistryItem[] = [
  {
    icon: 'fas fa-book-bible',
    title: 'Проповідь Слова Божого',
    description:
      'Зрозуміле викладання Біблії, яке допомагає застосувати біблійні принципи у повсякденному житті та дає відповіді на важливі питання.',
    image: '/images/action1.jpg',
  },
  {
    icon: 'fas fa-music',
    title: 'Прославлення',
    description:
      'Жива музика, щирі пісні та атмосфера Божої присутності, де ви можете вільно висловити свою любов до Бога.',
    image: '/images/action2.jpg',
  },
  {
    icon: 'fas fa-heart',
    title: 'Дружня спільнота',
    description:
      'Теплі стосунки, щира дружба та люди, які стануть для вас справжньою сім\'єю у вірі.',
    image: '/images/action3.jpg',
  },
  {
    icon: 'fas fa-hands-helping',
    title: 'Практична допомога',
    description:
      'Підтримка у складних життєвих ситуаціях: душпастирська опіка, матеріальна допомога та молитвенна підтримка.',
    image: '/images/action4.jpg',
  },
  {
    icon: 'fas fa-child',
    title: 'Робота з молоддю та дітьми',
    description:
      'Цікаві програми для молоді та дітей, де вони можуть розвиватися, дружити та пізнавати Бога.',
    image: '/images/action5.jpg',
  },
  {
    icon: 'fas fa-door-open',
    title: 'Атмосфера прийняття',
    description: 'Місце, де вас приймуть такими, якими ви є, без осуду. Божа любов для кожного.',
    image: '/images/action6.jpg',
  },
]
