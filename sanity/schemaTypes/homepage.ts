import { defineType, defineField } from 'sanity'

// =========================================
// HOMEPAGE — singleton document holding the homepage's editable content.
//
// Phase 1.2 ships the hero slider (`heroSlides`). Future homepage sections
// (testimonials, FAQ, "what you'll find", stats) are added here as new groups
// in later units — keeping all homepage content in one editable document.
//
// Enforced as a singleton via `sanity/structure.ts` (one fixed item) and
// `sanity.config.ts` (create/delete/duplicate actions removed). The frontend
// reads it through `getHomepage()`, which falls back to `lib/homepage.ts`
// defaults when the array is empty.
// =========================================

export const homepageType = defineType({
  name: 'homepage',
  title: 'Головна сторінка',
  type: 'document',
  icon: () => '🏠',
  groups: [
    { name: 'hero', title: 'Hero-слайдер', default: true },
    { name: 'testimonials', title: 'Свідчення' },
    { name: 'faq', title: 'Часті запитання' },
    { name: 'whatYouFind', title: 'Що ви знайдете' },
    { name: 'stats', title: 'Статистика' },
  ],
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Слайди Hero',
      type: 'array',
      group: 'hero',
      description:
        'Слайди головного банера. Додавайте, прибирайте та змінюйте порядок перетягуванням.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Фонове зображення',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required().error("Зображення обов'язкове"),
            }),
            defineField({
              name: 'preTitle',
              title: 'Над-заголовок',
              type: 'string',
              description: 'Малий текст над заголовком (наприклад: Ласкаво просимо)',
            }),
            defineField({
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              validation: (rule) => rule.required().error("Заголовок обов'язковий"),
            }),
            defineField({
              name: 'subtitle',
              title: 'Підзаголовок',
              type: 'text',
              rows: 2,
            }),
            defineField({ name: 'buttonText', title: 'Кнопка — текст', type: 'string' }),
            defineField({ name: 'buttonHref', title: 'Кнопка — посилання', type: 'string' }),
            defineField({
              name: 'secondaryButtonText',
              title: 'Друга кнопка — текст',
              type: 'string',
            }),
            defineField({
              name: 'secondaryButtonHref',
              title: 'Друга кнопка — посилання',
              type: 'string',
            }),
            defineField({
              name: 'align',
              title: 'Вирівнювання тексту',
              type: 'string',
              options: {
                list: [
                  { title: 'По центру', value: 'center' },
                  { title: 'Ліворуч', value: 'left' },
                  { title: 'Праворуч', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'center',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'preTitle', media: 'image' },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Слайд',
                subtitle: subtitle || undefined,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Свідчення',
      type: 'array',
      group: 'testimonials',
      description: 'Відгуки членів церкви. Додавайте, прибирайте та змінюйте порядок перетягуванням.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Текст відгуку',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Текст відгуку обов'язковий"),
            }),
            defineField({
              name: 'name',
              title: "Ім'я",
              type: 'string',
              validation: (rule) => rule.required().error("Ім'я обов'язкове"),
            }),
            defineField({
              name: 'position',
              title: 'Підпис',
              type: 'string',
              description: 'Наприклад: Член церкви 5 років',
            }),
            defineField({
              name: 'rating',
              title: 'Рейтинг (1–5 зірок)',
              type: 'number',
              validation: (rule) => rule.min(1).max(5).integer(),
            }),
            defineField({
              name: 'avatar',
              title: 'Фото',
              type: 'image',
              options: { hotspot: true },
              description: 'Необов’язкове фото члена церкви',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'quote', media: 'avatar' },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Свідчення',
                subtitle: subtitle || undefined,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Часті запитання',
      type: 'array',
      group: 'faq',
      description: 'Запитання та відповіді. Додавайте, прибирайте та змінюйте порядок перетягуванням.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Запитання',
              type: 'string',
              validation: (rule) => rule.required().error("Запитання обов'язкове"),
            }),
            defineField({
              name: 'answer',
              title: 'Відповідь',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Відповідь обов'язкова"),
            }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Запитання',
                subtitle: subtitle || undefined,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'whatYouFind',
      title: 'Що ви знайдете',
      type: 'array',
      group: 'whatYouFind',
      description: 'Картки «Більше, ніж просто церква». Іконку оберіть зі списку.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Іконка',
              type: 'string',
              options: {
                list: [
                  { title: 'Біблія / Слово', value: 'fas fa-book-bible' },
                  { title: 'Музика / Прославлення', value: 'fas fa-music' },
                  { title: 'Серце / Любов', value: 'fas fa-heart' },
                  { title: 'Допомога (руки)', value: 'fas fa-hands-helping' },
                  { title: 'Діти / Молодь', value: 'fas fa-child' },
                  { title: 'Відкриті двері', value: 'fas fa-door-open' },
                  { title: 'Молитва', value: 'fas fa-pray' },
                  { title: 'Спільнота (люди)', value: 'fas fa-users' },
                  { title: 'Турбота (серце в руці)', value: 'fas fa-hand-holding-heart' },
                  { title: 'Хрест', value: 'fas fa-cross' },
                  { title: 'Голуб / Дух', value: 'fas fa-dove' },
                  { title: 'Зірка', value: 'fas fa-star' },
                ],
              },
              validation: (rule) => rule.required().error('Оберіть іконку'),
            }),
            defineField({
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              validation: (rule) => rule.required().error("Заголовок обов'язковий"),
            }),
            defineField({
              name: 'description',
              title: 'Опис',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Опис обов'язковий"),
            }),
            defineField({
              name: 'image',
              title: 'Зображення',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Картка',
                subtitle: subtitle || undefined,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      group: 'stats',
      description: 'Лічильники у секції «Про нашу церкву» (напр. 19+ / Років служіння).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Значення',
              type: 'string',
              description: 'Напр.: 19+, 350+, 6',
              validation: (rule) => rule.required().error("Значення обов'язкове"),
            }),
            defineField({
              name: 'label',
              title: 'Підпис',
              type: 'string',
              validation: (rule) => rule.required().error("Підпис обов'язковий"),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare({ title, subtitle }) {
              return {
                title: title || '—',
                subtitle: subtitle || undefined,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Головна сторінка' }
    },
  },
})
