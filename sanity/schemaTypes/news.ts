import { defineType, defineField, defineArrayMember } from 'sanity'
import { CategoryInput } from '../components/CategoryInput'

export const newsType = defineType({
  name: 'news',
  title: 'Новини',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (rule) => rule.required().error('Заголовок обовʼязковий'),
    }),
    defineField({
      name: 'slug',
      title: 'URL-ідентифікатор',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required().error('Slug обовʼязковий'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Дата публікації',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainCategory',
      title: 'Основна категорія',
      type: 'string',
      components: {
        input: CategoryInput,
      },
      description: 'Оберіть зі списку або почніть вводити власну',
    }),
    defineField({
      name: 'categories',
      title: 'Додаткові категорії',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'text',
      title: 'Текст новини',
      type: 'text',
      rows: 5,
      description: 'Короткий текст для картки та основна інформація новини',
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
      title: 'За датою (нові спочатку)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mainCategory',
      media: 'image',
    },
  },
})
