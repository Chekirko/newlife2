import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ThemeProvider, studioTheme } from '@sanity/ui'
import { FormBuilderContext } from 'sanity/_singletons'
import type { ArrayOfObjectsInputProps, FormBuilderContextValue } from 'sanity'
import { GalleryInput } from '../sanity/components/GalleryInput'

// Sanity 4.22's ArrayOfObjectsField supplies onSelectFile, not onUpload.
// Keep onUpload absent so the Studio regression cannot hide behind a legacy mock.
const props = {
  id: 'gallery-check',
  value: [],
  schemaType: { of: [{ name: 'image', fields: [] }] },
  onSelectFile: () => {},
  renderDefault: () => <div>Default gallery input</div>,
} as unknown as ArrayOfObjectsInputProps

const context = {
  __internal: {
    image: { directUploads: true, assetSources: [{ name: 'sanity-default', Uploader: class {} }] },
  },
} as unknown as FormBuilderContextValue

function render(overrides: Partial<ArrayOfObjectsInputProps> = {}, uploadsEnabled = true) {
  const provider = uploadsEnabled ? context : {
    ...context,
    __internal: { ...context.__internal, image: { directUploads: false, assetSources: [] } },
  }
  const html = renderToStaticMarkup(
    <ThemeProvider theme={studioTheme}>
      <FormBuilderContext.Provider value={provider}>
        <GalleryInput {...props} {...overrides} />
      </FormBuilderContext.Provider>
    </ThemeProvider>,
  )
  const input = html.match(/<input\b[^>]*type="file"[^>]*>/)?.[0]
  assert(input, 'The multi-file picker must render')
  assert(input.includes('multiple=""'), 'The picker must allow multiple files')
  assert(html.includes('Default gallery input'), 'Preserve the native gallery controls')
  const select = Array.from(html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g), (match) => match[0])
    .find((button) => button.includes('Select — вибрати фото зі Studio'))
  assert(select, 'The Studio library multi-select must render')
  return { input, select: select.match(/^<button\b[^>]*>/)![0] }
}

const disabled = (html: string) => /\sdisabled(?:=""|\s|>)/.test(html)
assert(!disabled(render().input), 'onSelectFile alone must enable the picker')
assert(!disabled(render().select), 'Library Select must be available')
for (const overrides of [{ readOnly: true }, { value: Array.from({ length: 10 }, (_, i) => ({ _key: String(i) })) }]) {
  assert(disabled(render(overrides).input))
  assert(disabled(render(overrides).select))
}
assert(disabled(render({ onSelectFile: undefined }).input))
assert(disabled(render({}, false).input))
assert(!disabled(render({}, false).select), 'Disabling uploads must not disable existing library photos')
console.log('Gallery input: real callback contract, multiple picker, library Select, readOnly and limit — PASS')
