import { type SchemaTypeDefinition } from 'sanity'
import { ministryType } from './ministry'
import { newsType } from './news'
import { eventType } from './event'
import { mediaItemType } from './mediaItem'
import { teamMemberType } from './teamMember'
import { siteSettingsType } from './siteSettings'
import { homepageType } from './homepage'
import { pageHeroesType } from './pageHeroes'
import { aboutPageType } from './aboutPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, homepageType, pageHeroesType, aboutPageType, ministryType, newsType, eventType, mediaItemType, teamMemberType],
}
