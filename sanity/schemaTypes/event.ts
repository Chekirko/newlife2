import { defineType, defineField } from 'sanity'
import { richTextBlocks } from './objects/richText'
import { TagInput } from '../components/TagInput'

export const eventType = defineType({
  name: 'event',
  title: 'Події / оголошення',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({ name: 'seo', title: 'SEO та соціальні мережі', type: 'seo' }),
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
      name: 'endDate',
      title: 'Дата та час завершення',
      type: 'datetime',
      description: 'Заповнюйте лише відомий час завершення події.',
      validation: (rule) => rule.min(rule.valueOfField('startDate')).error('Завершення не може бути раніше початку'),
    }),
    defineField({
      name: 'eventStatus',
      title: 'Статус події',
      type: 'string',
      options: { list: [
        { title: 'Заплановано', value: 'EventScheduled' },
        { title: 'Скасовано', value: 'EventCancelled' },
        { title: 'Відкладено', value: 'EventPostponed' },
      ] },
      description: 'Порожнє поле означає «Заплановано». Після скасування чи відкладення зберігайте початкову дату.',
    }),
    defineField({
      name: 'location',
      title: 'Місце',
      type: 'string',
      description: 'Необовʼязково. Адреса чи назва місця проведення.',
    }),
    defineField({
      name: 'locationAddress',
      title: 'Повна адреса події',
      type: 'object',
      description: 'Потрібна для Event-розмітки; адреса церкви не підставляється автоматично.',
      fields: [
        defineField({ name: 'street', title: 'Вулиця та будинок', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'city', title: 'Місто', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'region', title: 'Область / регіон', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Поштовий індекс', type: 'string' }),
        defineField({ name: 'country', title: 'Код країни', type: 'string', description: 'Дві латинські літери, наприклад UA.', validation: (rule) => rule.required().regex(/^[A-Z]{2}$/) }),
      ],
    }),
    defineField({
      name: 'organizer',
      title: 'Організатор',
      type: 'string',
      description: 'Фактична назва організації. Залиште порожнім, якщо організатор не відомий.',
    }),
    defineField({
      name: 'isAccessibleForFree',
      title: 'Безкоштовна участь',
      type: 'boolean',
      description: 'Укажіть лише відомі умови участі. Порожнє поле не означає безкоштовну участь.',
    }),
    defineField({
      name: 'tag',
      title: 'Мітка',
      type: 'string',
      description: 'Оберіть зі списку або впишіть свою',
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
      components: { input: TagInput },
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
