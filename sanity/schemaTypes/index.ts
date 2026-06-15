import { type SchemaTypeDefinition } from 'sanity'
import { ministryType } from './ministry'
import { newsType } from './news'
import { eventType } from './event'
import { teamMemberType } from './teamMember'
import { siteSettingsType } from './siteSettings'
import { homepageType } from './homepage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, homepageType, ministryType, newsType, eventType, teamMemberType],
}
