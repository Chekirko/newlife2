import { defineType, defineField } from 'sanity'
import { richTextBlocks } from './objects/richText'

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
      type: 'array',
      of: richTextBlocks,
      description:
        'Розгорнутий опис служіння для деталь сторінки з форматуванням: заголовки, жирний, списки, посилання, зображення',
    }),
    defineField({
      name: 'image',
      title: 'Головне зображення',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Зображення обовʼязкове'),
    }),
    defineField({
      name: 'leader',
      title: 'Відповідальний за служіння',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      weak: true,
      description: 'Оберіть служителя з наявних або залиште порожнім, якщо відповідального немає',
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
      leaderName: 'leader.name',
    },
    prepare({ title, subtitle, media, leaderName }) {
      return {
        title,
        subtitle: leaderName ? `${subtitle ?? ''} · ${leaderName}` : subtitle,
        media,
      }
    },
  },
})
