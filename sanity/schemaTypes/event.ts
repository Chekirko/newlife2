import { defineType, defineField } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Події',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва події',
      type: 'string',
      validation: (rule) => rule.required().error('Назва обовʼязкова'),
    }),
    defineField({
      name: 'slug',
      title: 'URL-ідентифікатор',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required().error('Slug обовʼязковий'),
    }),
    defineField({
      name: 'date',
      title: 'Дата проведення',
      type: 'string',
      description: 'Формат довільний, наприклад: "20 квітня 2026" або "Щосуботи о 16:00"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Мітка',
      type: 'string',
      description: 'Наприклад: Подія, Конференція, Родина, Навчання',
      options: {
        list: [
          { title: 'Подія', value: 'Подія' },
          { title: 'Конференція', value: 'Конференція' },
          { title: 'Родина', value: 'Родина' },
          { title: 'Навчання', value: 'Навчання' },
          { title: 'Свято', value: 'Свято' },
          { title: 'Молодь', value: 'Молодь' },
          { title: 'Служіння', value: 'Служіння' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'image',
      title: 'Зображення',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: 'За датою створення',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
  },
})
