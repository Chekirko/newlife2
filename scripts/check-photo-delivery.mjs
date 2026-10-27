import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
let state = [], cursor = 0, observer, disconnects = 0, observedNode
class Observer {
  constructor(callback, options) { observer = { callback, options } }
  observe(node) { observedNode = node }
  disconnect() { disconnects++ }
}
const window = { IntersectionObserver: Observer }
function load(path) {
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: path,
  })
  const exports = {}
  vm.runInNewContext(outputText, { exports, window, IntersectionObserver: Observer,
    require: (name) => {
      if (name === 'react') return {
        useState: (initial) => {
          const i = cursor++
          if (!(i in state)) state[i] = initial
          return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value }]
        },
        useCallback: callback => callback, useEffect: () => {}, useRef: () => ({ current: null }),
      }
      if (['react/jsx-runtime', 'next/image'].includes(name)) return require(name)
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  return exports
}
const { DeferredGalleryImage } = load('components/ui/DeferredGalleryImage.tsx')
const { ImageLightbox } = load('components/ui/ImageLightbox.tsx')
const photos = Array.from({ length: 3 }, (_, i) => ({
  id: `${i}`, thumbUrl: `https://cdn.sanity.io/images/project/production/photo-${i}-2400x1600.jpg?q=100`,
  fullUrl: `https://cdn.sanity.io/images/project/production/photo-${i}-2400x1600.jpg?q=100`,
  alt: `Photo ${i}`, width: 2400, height: 1600,
  lqip: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
}))
function render(component, props) { cursor = 0; return component(props) }
for (const lqip of [photos[0].lqip, undefined]) {
  state = []
  const props = { photo: { ...photos[0], lqip }, sizes: '100vw' }
  let tree = render(DeferredGalleryImage, props)
  let html = renderToStaticMarkup(tree)
  assert(!html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '').includes('<img'), 'No original request before intersection')
  assert(html.includes('<noscript><img') && html.includes('q=100'), 'Original survives without JavaScript')
  assert(!html.includes('/_next/image') && !html.includes('srcSet='))
  const node = {}
  const cleanup = tree.props.ref(node)
  assert.equal(observedNode, node)
  assert.equal(observer.options.rootMargin, '400px')
  observer.callback([{ isIntersecting: false }])
  assert.equal(state[0], false)
  observer.callback([{ isIntersecting: true }])
  tree = render(DeferredGalleryImage, props)
  html = renderToStaticMarkup(tree).replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
  assert(html.includes('<img') && html.includes('q=100') && html.includes('alt="Photo 0"'))
  assert(!html.includes('/_next/image') && !html.includes('srcSet='))
  const before = disconnects
  cleanup()
  assert.equal(disconnects, before + 1, 'Observer is cleaned up on unmount')
}
state = []
delete window.IntersectionObserver
render(DeferredGalleryImage, { photo: photos[0], sizes: '100vw' }).props.ref({})
assert.equal(state[0], true, 'Unsupported observer falls back to the original')

function elements(tree) {
  if (!tree || typeof tree !== 'object') return []
  const children = [tree.props?.children].flat(Infinity)
  return [tree, ...children.flatMap(elements)]
}
function viewer(initialIndex = 0, items = photos) {
  return render(ImageLightbox, { photos: items, initialIndex, onClose() {} })
}
for (const count of [0, 1, 3]) {
  state = []
  const items = photos.slice(0, count)
  let tree = viewer(0, items)
  if (!count) { assert.equal(tree, null); continue }
  let images = elements(tree).filter(e => e.props?.src)
  assert.equal(images.length, 1, 'Only the foreground photo requests bytes initially')
  assert.equal(images[0].props.src, photos[0].fullUrl)
  assert.equal(images[0].props.unoptimized, true)
  images[0].props.onLoad()
  tree = viewer(0, items)
  assert.equal(elements(tree).filter(e => e.props?.src).length, count > 1 ? 2 : 1)
  if (count === 1) continue
  tree.props.onKeyDown({ key: 'ArrowRight', preventDefault() {} })
  tree = viewer(0, items)
  images = elements(tree).filter(e => e.props?.src)
  assert.equal(images.length, 1, 'Navigation waits for the new foreground load before prefetch')
  assert.equal(images[0].props.src, photos[1].fullUrl)
  images[0].props.onLoad()
  tree = viewer(0, items)
  assert.equal(elements(tree).filter(e => e.props?.src).length, 3)
  for (let i = 0; i < 4; i++) { tree.props.onKeyDown({ key: 'ArrowRight', preventDefault() {} }); tree = viewer(0, items) }
  assert.equal(elements(tree).find(e => e.props?.['aria-label'] === 'Наступне фото').props.disabled, true)
  for (let i = 0; i < 4; i++) { tree.props.onKeyDown({ key: 'ArrowLeft', preventDefault() {} }); tree = viewer(0, items) }
  assert.equal(elements(tree).find(e => e.props?.['aria-label'] === 'Попереднє фото').props.disabled, true)
}
console.log('PASS: deferred originals, noscript, LQIP/empty, observer cleanup/fallback, foreground-first preload, 0/1/many and navigation boundaries')
