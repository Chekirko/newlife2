import { defineType, defineField } from 'sanity'

export const ministryType = defineType({
  name: 'ministry',
  title: 'Служіння',
  type: 'document',
  icon: () => '⛪',
  fields: [
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
      name: 'shortDescription',
      title: 'Короткий опис',
      type: 'text',
      rows: 3,
      description: 'Коротка анотація для карток (1-2 речення)',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Повний опис',
      type: 'text',
      rows: 6,
      description: 'Розгорнутий опис служіння для деталь сторінки',
    }),
    defineField({
      name: 'image',
      title: 'Головне зображення',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Зображення обовʼязкове'),
    }),
    defineField({
      name: 'leaderName',
      title: 'Імʼя відповідального',
      type: 'string',
    }),
    defineField({
      name: 'leaderPhoto',
      title: 'Фото відповідального',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Фотогалерея',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Фотографії для галереї на сторінці служіння',
    }),
    defineField({
      name: 'bibleQuoteText',
      title: 'Біблійна цитата — текст',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'bibleQuoteReference',
      title: 'Біблійна цитата — посилання',
      type: 'string',
      description: 'Наприклад: Матвія 19:14',
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
    {
      title: 'За порядком',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'За назвою',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'image',
    },
  },
})
