import { defineArrayMember, defineField } from 'sanity'
import { QuoteBlock } from '../../components/QuoteBlock'

/**
 * Reusable Portable Text (rich text) field config — one shared toolbar
 * definition for the long-form body fields of news / event / ministry /
 * teamMember. Heading styles set the text size (MDX-style), decorators give
 * bold / italic / underline, plus bullet & numbered lists, a link annotation,
 * and inline images. Use as `defineField({ ..., type: 'array', of: richTextBlocks })`.
 */
export const richTextBlocks = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Звичайний', value: 'normal' },
      { title: 'Заголовок 2', value: 'h2' },
      { title: 'Заголовок 3', value: 'h3' },
      { title: 'Заголовок 4', value: 'h4' },
      // Custom inline preview — avoids Sanity's default <div>-in-<p> nesting
      // that trips the Next.js dev hydration overlay.
      { title: 'Цитата', value: 'blockquote', component: QuoteBlock },
    ],
    lists: [
      { title: 'Маркований список', value: 'bullet' },
      { title: 'Нумерований список', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Жирний', value: 'strong' },
        { title: 'Курсив', value: 'em' },
        { title: 'Підкреслений', value: 'underline' },
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          type: 'object',
          title: 'Посилання',
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ['http', 'https', 'mailto', 'tel'] })
                  .error('Вкажіть коректне посилання'),
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    title: 'Зображення',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        type: 'string',
        title: 'Опис (alt)',
        description: 'Для доступності та SEO',
      }),
    ],
  }),
]
