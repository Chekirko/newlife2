import { defineType, defineField } from 'sanity'
import { richTextBlocks } from './objects/richText'

export const eventType = defineType({
  name: 'event',
  title: 'Події / оголошення',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({
      name: 'type',
      title: 'Тип',
      type: 'string',
      options: {
        list: [
          { title: 'Подія', value: 'подія' },
          { title: 'Оголошення', value: 'оголошення' },
        ],
        layout: 'radio',
      },
      initialValue: 'подія',
      validation: (rule) => rule.required().error('Оберіть тип'),
    }),
    defineField({
      name: 'title',
      title: 'Назва',
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
      name: 'startDate',
      title: 'Дата та час',
      type: 'datetime',
      description: 'Коли відбувається подія (або дата оголошення). Використовується для сортування, показу та schema.',
      validation: (rule) => rule.required().error('Дата обовʼязкова'),
    }),
    defineField({
      name: 'activeUntil',
      title: 'Актуально до',
      type: 'datetime',
      description:
        'Необовʼязково. Доки показувати на головній. Якщо порожньо — до дати події. Корисно для оголошень із дедлайном.',
    }),
    defineField({
      name: 'location',
      title: 'Місце',
      type: 'string',
      description: 'Необовʼязково. Адреса чи назва місця проведення.',
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
      title: 'Короткий опис',
      type: 'text',
      rows: 4,
      description: 'Анонс для карток (списку та головної).',
    }),
    defineField({
      name: 'body',
      title: 'Повний текст',
      type: 'array',
      of: richTextBlocks,
      description:
        'Детальна інформація на сторінці події з форматуванням (необовʼязково).',
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
      title: 'За датою (новіші спершу)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      startDate: 'startDate',
      media: 'image',
    },
    prepare({ title, type, startDate, media }) {
      const date = startDate
        ? new Date(startDate).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'без дати'
      return {
        title: title || 'Без назви',
        subtitle: [type, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
