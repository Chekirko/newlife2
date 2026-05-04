import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Контент')
    .items([
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
    ])
