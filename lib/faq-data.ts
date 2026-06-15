// =========================================
// FAQ_FALLBACK — typed default homepage FAQ items.
//
// Pure data, no runtime dependencies (the FAQItem import is type-only and
// erased at build time). Importable from BOTH the Sanity-aware `lib/homepage.ts`
// (fallback when the CMS array is empty) and the standalone `scripts/seed-faq.ts`
// node script. Also the canonical SHAPE.
// =========================================

import type { FAQItem } from '../app/(front)/components/FAQSplit'

export const FAQ_FALLBACK: FAQItem[] = [
  {
    id: '1',
    question: 'Який дрес-код у церкві?',
    answer:
      'У нас немає суворого дрес-коду. Одягайтеся так, як вам комфортно. Більшість людей приходять у повсякденному одязі.',
  },
  {
    id: '2',
    question: 'Де залишити дітей під час богослужіння?',
    answer:
      'У нас є дитяче служіння для різних вікових груп, яке проходить одночасно з дорослим богослужінням. Волонтери зустрінуть вас біля входу.',
  },
  {
    id: '3',
    question: 'Чи є парковка біля церкви?',
    answer:
      'Так, у нас є безкоштовна парковка біля будівлі церкви. Волонтери допоможуть вам знайти місце для паркування.',
  },
  {
    id: '4',
    question: 'Скільки триває богослужіння?',
    answer:
      'Недільне богослужіння зазвичай триває близько 1,5 години і включає час прославлення, проповідь та спільну молитву.',
  },
  {
    id: '5',
    question: 'Чи потрібно бути членом церкви?',
    answer: 'Ні, членство не є обов\'язковим для відвідування. Ми раді всім гостям!',
  },
]
