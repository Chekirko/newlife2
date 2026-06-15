import { defineType, defineField } from 'sanity'
import { SOCIAL_PLATFORM_OPTIONS } from '../../lib/social'

// =========================================
// SITE SETTINGS — singleton document holding the church's real-world data
// (name, address, contacts, service times, socials, geo, OG defaults).
//
// Enforced as a singleton via `sanity/structure.ts` (one fixed item) and
// `sanity.config.ts` (create/delete/duplicate actions removed). Frontend
// reads it through `getSiteSettings()`, which falls back to `lib/church.ts`
// for any empty field.
// =========================================

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Налаштування сайту',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'general', title: 'Загальне', default: true },
    { name: 'contacts', title: 'Контакти' },
    { name: 'schedule', title: 'Розклад' },
    { name: 'social', title: 'Соцмережі' },
    { name: 'seo', title: 'SEO / OG' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Назва церкви',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required().error("Назва обов'язкова"),
    }),
    defineField({
      name: 'legalName',
      title: 'Офіційна назва',
      type: 'string',
      group: 'general',
      description: 'Повна юридична назва релігійної громади',
    }),
    defineField({
      name: 'city',
      title: 'Місто',
      type: 'string',
      group: 'general',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.email().error('Некоректний email'),
    }),
    defineField({
      name: 'phone',
      title: 'Телефон (E.164)',
      type: 'string',
      group: 'contacts',
      description: 'Формат для tel: та schema — наприклад +380633697532',
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Телефон (для показу)',
      type: 'string',
      group: 'contacts',
      description: 'Як телефон відображається на сайті — наприклад +38 (063) 369-75-32',
    }),

    defineField({
      name: 'address',
      title: 'Адреса',
      type: 'object',
      group: 'contacts',
      fields: [
        defineField({ name: 'street', title: 'Вулиця', type: 'string' }),
        defineField({ name: 'city', title: 'Місто', type: 'string' }),
        defineField({ name: 'district', title: 'Район', type: 'string' }),
        defineField({ name: 'region', title: 'Область', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Поштовий індекс', type: 'string' }),
        defineField({
          name: 'country',
          title: 'Країна (ISO 3166-1 alpha-2)',
          type: 'string',
          description: 'Двобуквений код, наприклад UA',
        }),
        defineField({
          name: 'full',
          title: 'Повна адреса (один рядок)',
          type: 'string',
          description: 'Використовується для геокодування мапи',
        }),
      ],
    }),

    defineField({
      name: 'geo',
      title: 'Координати',
      type: 'geopoint',
      group: 'contacts',
      description: 'Точний пін церкви для мапи та schema',
    }),

    defineField({
      name: 'social',
      title: 'Соцмережі',
      type: 'array',
      group: 'social',
      description:
        'Додавайте, прибирайте та змінюйте порядок соцмереж. Іконку й колір підставлено автоматично за платформою.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Платформа',
              type: 'string',
              options: { list: SOCIAL_PLATFORM_OPTIONS },
              validation: (rule) => rule.required().error('Оберіть платформу'),
            }),
            defineField({
              name: 'url',
              title: 'Посилання',
              type: 'url',
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ['http', 'https'] })
                  .error('Вкажіть коректне посилання (http/https)'),
            }),
            defineField({
              name: 'label',
              title: 'Підпис',
              type: 'string',
              description: 'Назва для іконки (обов’язково для «Інша»; для решти — необов’язково)',
            }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url', label: 'label' },
            prepare({ platform, url, label }) {
              return {
                title: label || platform || 'Соцмережа',
                subtitle: url || undefined,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'services',
      title: 'Розклад богослужінь',
      type: 'array',
      group: 'schedule',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Назва',
              type: 'string',
              description: 'Наприклад: Недільне богослужіння',
            }),
            defineField({ name: 'day', title: 'День', type: 'string' }),
            defineField({
              name: 'time',
              title: 'Час початку',
              type: 'string',
              description: 'Наприклад: 11:00',
            }),
          ],
          preview: {
            select: { title: 'label', day: 'day', time: 'time' },
            prepare({ title, day, time }) {
              return {
                title: title || 'Служіння',
                subtitle: [day, time].filter(Boolean).join(' · ') || undefined,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'ogImage',
      title: 'OG-зображення за замовчуванням',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Прев’ю-картинка для соцмереж, коли сторінка не має власної',
    }),
    defineField({
      name: 'defaultDescription',
      title: 'Опис за замовчуванням',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Мета-опис за замовчуванням для сторінок без власного',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Налаштування сайту' }
    },
  },
})
