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
  ],
  preview: {
    prepare: () => ({ title: 'Заголовки сторінок (Hero)' }),
  },
})
