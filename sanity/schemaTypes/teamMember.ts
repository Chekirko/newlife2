import { defineType, defineField } from 'sanity'
import { richTextBlocks } from './objects/richText'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Служитель',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: "Ім'я",
      type: 'string',
      validation: (rule) => rule.required().error("Ім'я обов'язкове"),
    }),
    defineField({
      name: 'slug',
      title: 'URL-ідентифікатор',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required().error("Slug обов'язковий"),
    }),
    defineField({
      name: 'category',
      title: 'Категорія',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Рукопокладений служитель', value: 'ordained' },
          { title: 'Відповідальний за служіння', value: 'responsible' },
          { title: 'Кандидат', value: 'candidate' },
          { title: 'Почесний служитель', value: 'honorary' },
        ]
      },
      validation: (rule) => rule.required().min(1).error('Оберіть хоча б одну категорію'),
    }),
    defineField({
      name: 'title',
      title: 'Сан',
      type: 'string',
      description: 'Пастор, диякон тощо (для рукопокладених, кандидатів, почесних)',
      hidden: ({ document }) => {
        const category = document?.category as string[] | undefined
        return !category?.some(c => ['ordained', 'candidate', 'honorary'].includes(c))
      },
    }),
    defineField({
      name: 'responsibility',
      title: 'Відповідальність за служіння',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'За які служіння відповідає (можна додати кілька; перше показується на загальній сторінці команди)',
      hidden: ({ document }) => {
        const category = document?.category as string[] | undefined
        return !category?.includes('responsible')
      },
    }),
    defineField({
      name: 'candidateTitle',
      title: 'Кандидатство',
      type: 'string',
      description: 'Наприклад: Кандидат в пастори, Кандидат в диякони',
      hidden: ({ document }) => {
        const category = document?.category as string[] | undefined
        return !category?.includes('candidate')
      },
    }),
    defineField({
      name: 'bio',
      title: 'Біографія',
      type: 'array',
      of: richTextBlocks,
      description: 'Текст із форматуванням: заголовки, жирний, списки, посилання, зображення',
    }),
    defineField({
      name: 'photo',
      title: 'Фото',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error("Фото обов'язкове"),
    }),
    defineField({
      name: 'order',
      title: 'Порядок відображення',
      type: 'number',
      initialValue: 0,
      description: 'Менше число = вище в списку',
    }),
  ],
  orderings: [
    { title: 'За порядком', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', candidateTitle: 'candidateTitle', media: 'photo' },
    prepare({ title, subtitle, candidateTitle, media }) {
      const parts = [subtitle, candidateTitle].filter(Boolean)
      return { title, subtitle: parts.join(' · ') || undefined, media }
    },
  },
})
