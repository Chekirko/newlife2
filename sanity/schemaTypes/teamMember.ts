import { defineType, defineField } from 'sanity'

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
        ]
      },
      validation: (rule) => rule.required().min(1).error('Оберіть хоча б одну категорію'),
    }),
    defineField({
      name: 'title',
      title: 'Сан',
      type: 'string',
      description: 'Пастор, диякон тощо (для рукопокладених)',
      hidden: ({ document }) => {
        const category = document?.category as string[] | undefined
        return !category?.includes('ordained')
      },
    }),
    defineField({
      name: 'responsibility',
      title: 'Відповідальність',
      type: 'string',
      description: 'За яке служіння відповідає (для відповідальних)',
      hidden: ({ document }) => {
        const category = document?.category as string[] | undefined
        return !category?.includes('responsible')
      },
    }),
    defineField({
      name: 'bio',
      title: 'Біографія',
      type: 'text',
      rows: 8,
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
    select: { title: 'name', subtitle: 'title', media: 'photo' },
  },
})
