/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    // Scan all TS/TSX files for defineQuery() calls
    path: ['./app/**/*.{ts,tsx}', './sanity/**/*.{ts,tsx}'],
    // Extract schema to this file
    schema: 'schema.json',
    // Output generated types here
    generates: './sanity/lib/sanity.types.ts',
    // Overload client.fetch() to return typed results
    overloadClientMethods: false,
  },
})
