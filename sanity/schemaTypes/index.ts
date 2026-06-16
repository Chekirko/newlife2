import { type SchemaTypeDefinition } from 'sanity'
import { ministryType } from './ministry'
import { newsType } from './news'
import { eventType } from './event'
import { teamMemberType } from './teamMember'
import { siteSettingsType } from './siteSettings'
import { homepageType } from './homepage'
import { pageHeroesType } from './pageHeroes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, homepageType, pageHeroesType, ministryType, newsType, eventType, teamMemberType],
}
