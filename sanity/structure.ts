import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Контент')
    .items([
      // Singleton — site-wide settings (one fixed document, no create/delete)
      S.listItem()
        .title('Налаштування сайту')
        .id('siteSettings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Налаштування сайту'),
        ),
      S.listItem()
        .title('Головна сторінка')
        .id('homepage')
        .icon(() => '🏠')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Головна сторінка'),
        ),
      S.listItem()
        .title('Заголовки сторінок (Hero)')
        .id('pageHeroes')
        .icon(() => '🖼️')
        .child(
          S.document()
            .schemaType('pageHeroes')
            .documentId('pageHeroes')
            .title('Заголовки сторінок (Hero)'),
        ),
      S.listItem()
        .title('Сторінка «Про нас»')
        .id('aboutPage')
        .icon(() => 'ℹ️')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .title('Сторінка «Про нас»'),
        ),
      S.divider(),
      S.listItem()
        .title('Служіння')
        .schemaType('ministry')
        .child(S.documentTypeList('ministry').title('Служіння')),
      S.listItem()
        .title('Новини')
        .schemaType('news')
        .child(S.documentTypeList('news').title('Новини')),
      S.listItem()
        .title('Події')
        .schemaType('event')
        .child(S.documentTypeList('event').title('Події')),
      S.listItem()
        .title('Медіа')
        .schemaType('mediaItem')
        .child(S.documentTypeList('mediaItem').title('Медіа')),
      S.listItem()
        .title('Служителі')
        .schemaType('teamMember')
        .child(S.documentTypeList('teamMember').title('Служителі')),
    ])
