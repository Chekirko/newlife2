import { defineType, defineField, defineArrayMember } from 'sanity'
import { CategoryInput, MultiCategoryInput } from '../components/CategoryInput'
import { richTextBlocks } from './objects/richText'
import { GalleryInput } from '../components/GalleryInput'

// Suggested categories — editors can also type a brand-new one (the category
// inputs are searchable dropdowns that accept free text).
const NEWS_CATEGORIES = ['Місія', 'Навчання', 'Служіння', 'Молодь', 'Культура', 'Волонтерство', 'Подія']

export const newsType = defineType({
  name: 'news',
  title: 'Новини',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({ name: 'seo', title: 'SEO та соціальні мережі', type: 'seo' }),
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
      options: { list: NEWS_CATEGORIES },
      components: { input: CategoryInput },
      description: 'Оберіть зі списку або почніть вводити власну',
    }),
    defineField({
      name: 'categories',
      title: 'Додаткові категорії',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: { list: NEWS_CATEGORIES },
        }),
      ],
      components: { input: MultiCategoryInput },
      description: 'Оберіть кілька зі списку або додайте власні',
    }),
    defineField({
      name: 'ministries',
      title: 'Служіння',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{ type: 'ministry' }],
        }),
      ],
      description:
        'Прив’яжіть новину до служінь — вона з’явиться в розділі новин на сторінках цих служінь',
    }),
    defineField({
      name: 'text',
      title: 'Короткий опис',
      type: 'text',
      rows: 3,
      description: 'Анонс для картки та SEO (простий текст, без форматування)',
    }),
    defineField({
      name: 'body',
      title: 'Повний текст',
      type: 'array',
      of: richTextBlocks,
      description: 'Текст статті з форматуванням: заголовки, жирний, списки, посилання, зображення',
    }),
    defineField({
      name: 'image',
      title: 'Основне фото',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().assetRequired().error('Додайте основне фото новини'),
    }),
    defineField({
      name: 'gallery',
      title: 'Додаткові фотографії',
      type: 'array',
      description: 'До 10 необов’язкових фото після тексту новини. Вертикальні й горизонтальні фото показуються повністю. Перетягуйте, щоб змінити порядок.',
      options: { layout: 'grid' },
      components: { input: GalleryInput },
      validation: (rule) => rule.max(10).error('Можна додати не більше 10 додаткових фотографій'),
      of: [
        defineArrayMember({
          type: 'image',
          validation: (rule) => rule.required().assetRequired().error('Завантажте фото або видаліть порожній елемент'),
          fields: [
            defineField({
              name: 'alt',
              title: 'Опис фото (alt)',
              type: 'string',
              description: 'Коротко опишіть, що зображено, для людей, які користуються читачем екрана',
            }),
          ],
        }),
      ],
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
