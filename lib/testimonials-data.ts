// =========================================
// TESTIMONIALS_FALLBACK — typed default homepage testimonials.
//
// Pure data, no runtime dependencies (the TestimonialData import is type-only
// and erased at build time). Importable from BOTH the Sanity-aware
// `lib/homepage.ts` (fallback when the CMS array is empty) and the standalone
// `scripts/seed-testimonials.ts` node script. Also the canonical SHAPE.
// =========================================

import type { TestimonialData } from '../app/(front)/components/TestimonialsGrid'

export const TESTIMONIALS_FALLBACK: TestimonialData[] = [
  {
    id: '1',
    name: 'Марія К.',
    position: 'Член церкви 5 років',
    quote:
      'Церква «Нове Життя» стала для мене справжнім домом. Тут я знайшла підтримку, друзів і, найголовніше, глибші стосунки з Богом.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Олександр П.',
    position: 'Член церкви 3 роки',
    quote:
      'Коли я вперше прийшов до церкви, я шукав відповіді на важливі питання. Тут я знайшов не лише відповіді, але й справжню сім\'ю у Христі.',
    rating: 5,
  },
]
