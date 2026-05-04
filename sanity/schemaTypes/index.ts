import { type SchemaTypeDefinition } from 'sanity'
import { ministryType } from './ministry'
import { newsType } from './news'
import { eventType } from './event'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ministryType, newsType, eventType],
}
