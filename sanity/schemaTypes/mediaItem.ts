import { defineType, defineField, defineArrayMember } from 'sanity'
import { TagInput } from '../components/TagInput'

// =========================================
// MEDIA ITEM — одиниця медіатеки /media (трансляції, проповіді, пісні, різне).
// Кожен елемент = посилання на YouTube; на сторінці фільтрується табами за
// `category` і відкривається в модалі-лайтбоксі. Спікер — weak-ref на служителя
// (переважно для проповідей). Записані трансляції живуть тут; поточна пряма
// трансляція — окреме поле `liveStream` у siteSettings.
// =========================================

const MEDIA_CATEGORIES = [
  { title: 'Трансляція', value: 'трансляція' },
  { title: 'Проповідь', value: 'проповідь' },
  { title: 'Пісня', value: 'пісня' },
  { title: 'Різне', value: 'різне' },
]

// Підказки для тегів — менеджер може дописати будь-який власний (TagInput).
const MEDIA_TAGS = ['молитва', 'сімʼя', 'віра', 'свідчення', 'надія', 'любов', 'служіння']

export const mediaItemType = defineType({
  name: 'mediaItem',
  title: 'Медіа',
  type: 'document',
  icon: () => '🎬',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва',
      type: 'string',
      validation: (rule) => rule.required().error('Назва обовʼязкова'),
    }),
    defineField({
      name: 'category',
      title: 'Категорія',
      type: 'string',
      options: { list: MEDIA_CATEGORIES, layout: 'radio' },
      initialValue: 'проповідь',
      validation: (rule) => rule.required().error('Оберіть категорію'),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'Посилання на YouTube',
      type: 'url',
      description: 'Повне посилання на відео (watch, youtu.be, live або embed)',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['http', 'https'] })
          .error('Вкажіть коректне посилання на YouTube'),
    }),
    defineField({
      name: 'date',
      title: 'Дата',
      type: 'datetime',
      description: 'Коли відбулося/опубліковано. Використовується для сортування.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().error('Дата обовʼязкова'),
    }),
    defineField({
      name: 'speaker',
      title: 'Проповідник / спікер',
      type: 'string',
      description: 'Імʼя проповідника (вводиться вручну; переважно для проповідей)',
    }),
    defineField({
      name: 'scripture',
      title: 'Писання',
      type: 'string',
      description: 'Необовʼязково — наприклад: Івана 3:16',
    }),
    defineField({
      name: 'tags',
      title: 'Теги',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: { list: MEDIA_TAGS },
          components: { input: TagInput },
        }),
      ],
      options: { layout: 'tags' },
      description: 'Теми для пошуку й фільтрування. Оберіть зі списку або впишіть свій.',
    }),
    defineField({
      name: 'description',
      title: 'Короткий опис',
      type: 'text',
      rows: 3,
      description: 'Анонс для картки та лайтбокса (простий текст).',
    }),
    defineField({
      name: 'image',
      title: 'Обкладинка',
      type: 'image',
      options: { hotspot: true },
      description: 'Необовʼязково. Якщо порожньо — береться прев’ю з YouTube.',
    }),
  ],
  orderings: [
    {
      title: 'За датою (новіші спершу)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      date: 'date',
      speaker: 'speaker',
      media: 'image',
    },
    prepare({ title, category, date, speaker, media }) {
      const dateStr = date
        ? new Date(date).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'без дати'
      return {
        title: title || 'Без назви',
        subtitle: [category, speaker, dateStr].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
