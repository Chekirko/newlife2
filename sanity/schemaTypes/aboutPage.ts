import { defineType, defineField } from 'sanity'
import { TagInput } from '../components/TagInput'

// =========================================
// ABOUT PAGE — singleton document holding the /about page's editable content
// (B1). Every section's headings AND content are editable here; section button
// links/routes stay in code. Stats numbers come from the `homepage` singleton
// (single source) — only the stats section headings live here.
//
// Enforced as a singleton via `sanity/structure.ts` (one fixed item) and
// `sanity.config.ts` (create/delete/duplicate removed). The frontend reads it
// through `getAboutPage()` (lib/about.ts), which merges CMS values over the
// `ABOUT_FALLBACK` defaults (lib/about-data.ts) field-by-field.
// =========================================

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'Сторінка «Про нас»',
  type: 'document',
  icon: () => 'ℹ️',
  groups: [
    { name: 'hero', title: 'Заголовок (Hero)', default: true },
    { name: 'whoWeAre', title: 'Хто ми + місія' },
    { name: 'history', title: 'Історія' },
    { name: 'beliefs', title: 'Віровчення' },
    { name: 'values', title: 'Цінності' },
    { name: 'whatToExpect', title: 'Чого очікувати' },
    { name: 'leadership', title: 'Керівництво' },
    { name: 'stats', title: 'Статистика' },
    { name: 'finalCta', title: 'Фінальний заклик' },
  ],
  fields: [
    // --- HERO ---
    defineField({
      name: 'heroTitle',
      title: 'Заголовок банера',
      type: 'string',
      group: 'hero',
    }),

    // --- WHO WE ARE + MISSION ---
    defineField({ name: 'whoPreTitle', title: 'Над-заголовок', type: 'string', group: 'whoWeAre' }),
    defineField({ name: 'whoHeading', title: 'Заголовок', type: 'string', group: 'whoWeAre' }),
    defineField({
      name: 'denomination',
      title: 'Хто ми (деномінація)',
      type: 'text',
      rows: 3,
      group: 'whoWeAre',
    }),
    defineField({ name: 'missionLabel', title: 'Підпис над місією', type: 'string', group: 'whoWeAre' }),
    defineField({ name: 'mission', title: 'Місія', type: 'text', rows: 3, group: 'whoWeAre' }),

    // --- HISTORY ---
    defineField({ name: 'historyPreTitle', title: 'Над-заголовок', type: 'string', group: 'history' }),
    defineField({ name: 'historyTitle', title: 'Заголовок', type: 'string', group: 'history' }),
    defineField({
      name: 'historyParagraphs',
      title: 'Абзаци історії',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      group: 'history',
      description: 'Короткий наратив. Повна хронологія — на сторінці /history.',
    }),

    // --- BELIEFS ---
    defineField({ name: 'beliefsPreTitle', title: 'Над-заголовок', type: 'string', group: 'beliefs' }),
    defineField({ name: 'beliefsTitle', title: 'Заголовок', type: 'string', group: 'beliefs' }),
    defineField({
      name: 'beliefs',
      title: 'Пункти віровчення',
      type: 'array',
      group: 'beliefs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              validation: (rule) => rule.required().error("Заголовок обов'язковий"),
            }),
            defineField({
              name: 'text',
              title: 'Текст',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Текст обов'язковий"),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
            prepare({ title, subtitle }) {
              return { title: title || 'Пункт', subtitle: subtitle || undefined }
            },
          },
        },
      ],
    }),

    // --- VALUES ---
    defineField({ name: 'valuesPreTitle', title: 'Над-заголовок', type: 'string', group: 'values' }),
    defineField({ name: 'valuesTitle', title: 'Заголовок', type: 'string', group: 'values' }),
    defineField({ name: 'valuesDescription', title: 'Опис', type: 'text', rows: 2, group: 'values' }),
    defineField({
      name: 'values',
      title: 'Цінності',
      type: 'array',
      group: 'values',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'iconKey',
              title: 'Іконка',
              type: 'string',
              options: {
                list: [
                  { title: 'Серце / Любов', value: 'heart' },
                  { title: 'Книга / Писання', value: 'book' },
                  { title: 'Дух / Молитва', value: 'spirit' },
                  { title: 'Спільнота', value: 'community' },
                  { title: 'Милосердя', value: 'mercy' },
                  { title: 'Місія', value: 'mission' },
                ],
              },
              validation: (rule) => rule.required().error('Оберіть іконку'),
            }),
            defineField({
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              validation: (rule) => rule.required().error("Заголовок обов'язковий"),
            }),
            defineField({
              name: 'text',
              title: 'Текст',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Текст обов'язковий"),
            }),
            defineField({
              name: 'featured',
              title: 'Виділити (градієнт)',
              type: 'boolean',
              description: 'Одна картка підсвічується бренд-градієнтом.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
            prepare({ title, subtitle }) {
              return { title: title || 'Цінність', subtitle: subtitle || undefined }
            },
          },
        },
      ],
    }),

    // --- WHAT TO EXPECT ---
    defineField({ name: 'expectPreTitle', title: 'Над-заголовок', type: 'string', group: 'whatToExpect' }),
    defineField({ name: 'expectTitle', title: 'Заголовок', type: 'string', group: 'whatToExpect' }),
    defineField({ name: 'expectDescription', title: 'Опис', type: 'text', rows: 2, group: 'whatToExpect' }),
    defineField({
      name: 'whatToExpect',
      title: 'Пункти «Чого очікувати»',
      type: 'array',
      group: 'whatToExpect',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Іконка',
              type: 'string',
              description:
                'Оберіть зі списку або впишіть свій клас Font Awesome (напр. fas fa-heart). Безкоштовні іконки: fontawesome.com/search?m=free',
              options: {
                list: [
                  { title: 'Рукостискання', value: 'fas fa-handshake' },
                  { title: 'Музика / Прославлення', value: 'fas fa-music' },
                  { title: 'Діти', value: 'fas fa-child' },
                  { title: 'Одяг', value: 'fas fa-shirt' },
                  { title: 'Локація / Як знайти', value: 'fas fa-location-dot' },
                  { title: 'Час / Тривалість', value: 'fas fa-clock' },
                  { title: 'Кава / Спілкування', value: 'fas fa-mug-hot' },
                  { title: 'Паркінг', value: 'fas fa-square-parking' },
                ],
              },
              components: { input: TagInput },
              validation: (rule) => rule.required().error('Оберіть або впишіть іконку'),
            }),
            defineField({
              name: 'title',
              title: 'Заголовок',
              type: 'string',
              validation: (rule) => rule.required().error("Заголовок обов'язковий"),
            }),
            defineField({
              name: 'text',
              title: 'Текст',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().error("Текст обов'язковий"),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
            prepare({ title, subtitle }) {
              return { title: title || 'Пункт', subtitle: subtitle || undefined }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'expectCtaText',
      title: 'Кнопка — текст',
      type: 'string',
      group: 'whatToExpect',
      description: 'Веде на /contact (маршрут у коді).',
    }),

    // --- LEADERSHIP ---
    defineField({ name: 'leadershipPreTitle', title: 'Над-заголовок', type: 'string', group: 'leadership' }),
    defineField({ name: 'leadershipTitle', title: 'Заголовок', type: 'string', group: 'leadership' }),
    defineField({ name: 'leadershipIntro', title: 'Текст', type: 'text', rows: 3, group: 'leadership' }),
    defineField({
      name: 'leadershipCtaText',
      title: 'Кнопка — текст',
      type: 'string',
      group: 'leadership',
      description: 'Веде на /team (маршрут у коді).',
    }),

    // --- STATS (headings + the numbers) ---
    defineField({ name: 'statsPreTitle', title: 'Над-заголовок', type: 'string', group: 'stats' }),
    defineField({ name: 'statsTitle', title: 'Заголовок', type: 'string', group: 'stats' }),
    defineField({ name: 'statsDescription', title: 'Опис', type: 'text', rows: 2, group: 'stats' }),
    defineField({
      name: 'stats',
      title: 'Лічильники',
      type: 'array',
      group: 'stats',
      description: 'Числа церкви (напр. 33+ / Років служіння).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Значення',
              type: 'string',
              description: 'Напр.: 33+, 350+, 6',
              validation: (rule) => rule.required().error("Значення обов'язкове"),
            }),
            defineField({
              name: 'label',
              title: 'Підпис',
              type: 'string',
              validation: (rule) => rule.required().error("Підпис обов'язковий"),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare({ title, subtitle }) {
              return { title: title || '—', subtitle: subtitle || undefined }
            },
          },
        },
      ],
    }),

    // --- FINAL CTA ---
    defineField({ name: 'ctaTitle', title: 'Заголовок', type: 'string', group: 'finalCta' }),
    defineField({ name: 'ctaText', title: 'Текст', type: 'text', rows: 2, group: 'finalCta' }),
    defineField({
      name: 'ctaPrimaryText',
      title: 'Кнопка 1 — текст',
      type: 'string',
      group: 'finalCta',
      description: 'Веде на /contact (маршрут у коді).',
    }),
    defineField({
      name: 'ctaSecondaryText',
      title: 'Кнопка 2 — текст',
      type: 'string',
      group: 'finalCta',
      description: 'Веде на /ministries (маршрут у коді).',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Сторінка «Про нас»' }
    },
  },
})
