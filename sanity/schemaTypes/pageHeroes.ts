import { defineType, defineField } from 'sanity'

// Singleton — editable hero (header) background images for section pages.
// One image per section, shared by the list page and all its detail pages.
export const pageHeroesType = defineType({
  name: 'pageHeroes',
  title: 'Заголовки сторінок (Hero)',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'newsHero',
      title: 'Hero — Новини',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Новини» та всіх окремих новин',
    }),
    defineField({
      name: 'eventsHero',
      title: 'Hero — Події',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Події» та всіх окремих подій',
    }),
    defineField({
      name: 'ministriesHero',
      title: 'Hero — Служіння',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Служіння» та всіх окремих служінь',
    }),
    defineField({
      name: 'teamHero',
      title: 'Hero — Команда',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Команда» та всіх окремих служителів',
    }),
    defineField({
      name: 'historyHero',
      title: 'Hero — Історія',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Історія»',
    }),
    defineField({
      name: 'contactHero',
      title: 'Hero — Контакти',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Контакти»',
    }),
    defineField({
      name: 'aboutHero',
      title: 'Hero — Про нас',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Про нас»',
    }),
    defineField({
      name: 'mediaHero',
      title: 'Hero — Медіа',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Медіа»',
    }),
    defineField({
      name: 'privacyHero',
      title: 'Hero — Політика конфіденційності',
      type: 'image',
      options: { hotspot: true },
      description: 'Фонове фото у шапці сторінки «Політика конфіденційності»',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Заголовки сторінок (Hero)' }),
  },
})
