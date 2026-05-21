import { type SchemaTypeDefinition } from 'sanity'
import { ministryType } from './ministry'
import { newsType } from './news'
import { eventType } from './event'
import { teamMemberType } from './teamMember'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ministryType, newsType, eventType, teamMemberType],
}
