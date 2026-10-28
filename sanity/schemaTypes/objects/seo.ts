import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO та соціальні мережі',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'SEO-заголовок',
      type: 'string',
      description: 'Без назви церкви в кінці — вона додається автоматично. Порожнє поле використовує назву документа.',
      validation: (rule) => rule.max(70).warning('Рекомендовано до 70 символів'),
    }),
    defineField({
      name: 'description',
      title: 'SEO-опис',
      type: 'text',
      rows: 3,
      description: 'Короткий опис сторінки для пошуку й соцмереж. Якщо порожньо — використовується опис документа.',
      validation: (rule) => rule.max(160).warning('Рекомендовано до 160 символів'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Зображення для соціальних мереж',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.assetRequired(),
      description: 'Рекомендоване співвідношення 1200 × 630. Якщо порожньо — основне фото документа або зображення сайту.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Не індексувати цю сторінку',
      type: 'boolean',
      description: 'Прибирає сторінку з sitemap і забороняє індексацію навіть після запуску сайту.',
      initialValue: false,
    }),
  ],
})
