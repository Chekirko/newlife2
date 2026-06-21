'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

// Document types that are singletons — exactly one document, edited in place.
// Remove create/delete/duplicate/unpublish so editors can't fork or remove them.
const SINGLETON_TYPES = new Set(['siteSettings', 'homepage', 'pageHeroes', 'aboutPage'])
const SINGLETON_DISABLED_ACTIONS = new Set(['create', 'delete', 'duplicate', 'unpublish'])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(
            (action) => !action.action || !SINGLETON_DISABLED_ACTIONS.has(action.action),
          )
        : prev,
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
