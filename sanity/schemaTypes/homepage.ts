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
  groups: [{ name: 'hero', title: 'Hero-слайдер', default: true }],
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
  ],
  preview: {
    prepare() {
      return { title: 'Головна сторінка' }
    },
  },
})
