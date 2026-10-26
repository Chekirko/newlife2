import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
let state = [], cursor = 0, reducedMotion = false, effects = [], interval, cleared = 0
const pointerRotation = { current: null }
const { outputText } = ts.transpileModule(readFileSync(new URL('../components/sections/Hero.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  fileName: 'Hero.tsx',
})
const exports = {}
vm.runInNewContext(outputText, { exports,
  require: (name) => {
    if (name === 'react') return {
      useState: (initial) => {
        const index = cursor++
        if (!(index in state)) state[index] = initial
        return [state[index], (value) => { state[index] = typeof value === 'function' ? value(state[index]) : value }]
      },
      useEffect: (effect) => effects.push(effect), useCallback: (fn) => fn, useRef: () => pointerRotation,
    }
    if (name === 'motion/react') return { useReducedMotion: () => reducedMotion }
    if (name === 'next/image') return { default: () => null }
    if (['react/jsx-runtime', 'clsx'].includes(name)) return require(name)
    throw new Error(`Unexpected import: ${name}`)
  },
  setInterval: (callback) => { interval = callback; return 1 },
  clearInterval: () => { interval = undefined; cleared++ },
})
const slides = [
  { id: 'one', title: 'First', preTitle: 'Welcome', backgroundImage: '/first.jpg', buttonText: 'About', buttonHref: '/about' },
  { id: 'two', title: 'Second', backgroundImage: '/second.jpg', buttonText: 'Incomplete CTA' },
  { id: 'three', title: 'Third', backgroundImage: '/third.jpg', buttonText: 'Contact', buttonHref: '/contact' },
]
function render(props = {}) {
  cursor = 0; effects = []; interval = undefined
  const tree = exports.HeroSlider({ slides, showDots: true, ...props })
  const html = renderToStaticMarkup(tree)
  assert.equal([...html.matchAll(/<h1\b/g)].length, props.slides?.length === 0 ? 0 : 1)
  assert(!html.includes('<h3') && !html.includes('href="#"') && !html.includes('Incomplete CTA'))
  return { tree, html }
}
const nodes = (node) => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)]
const button = (tree, label) => nodes(tree).find(n => n.type === 'button' && n.props['aria-label'] === label)
let { tree, html } = render()
assert(html.includes('<h1') && html.includes('>First</h1>'))
assert.equal([...html.matchAll(/ inert=""/g)].length, 2)
const cleanup = effects[0]()
assert.equal(typeof interval, 'function')
interval()
;({ tree, html } = render())
assert(html.includes('>Second</h1>'))
cleanup()
assert.equal(cleared, 1)
button(tree, 'Попередній слайд').props.onClick()
;({ tree, html } = render())
assert(html.includes('>First</h1>'))
button(tree, 'Попередній слайд').props.onClick()
;({ tree, html } = render())
assert(html.includes('>Third</h1>'))
tree.props.onFocusCapture()
;({ tree, html } = render())
effects[0]()
assert.equal(interval, undefined)
assert(html.includes('Відтворити слайди'))
button(tree, 'Перейти до слайда 1').props.onClick()
assert(render().html.includes('>First</h1>'))
state = []; reducedMotion = true
render(); effects[0]()
assert.equal(interval, undefined, 'Reduced motion must prevent default autoplay')
state = []; reducedMotion = false
;({ tree } = render())
nodes(tree).find(n => n.type === 'button' && n.props.onPointerDown).props.onPointerDown()
tree.props.onFocusCapture()
;({ tree } = render())
nodes(tree).find(n => n.type === 'button' && n.props.onPointerDown).props.onClick()
assert(render().html.includes('Відтворити слайди'), 'Pointer focus must not undo a pause click')
nodes(tree).find(n => n.type === 'button' && n.props.onPointerDown).props.onClick()
assert(render().html.includes('Зупинити слайди'), 'Keyboard activation must resume rotation')
state = []
;({ tree } = render())
tree.props.onMouseEnter()
render(); effects[0]()
assert.equal(interval, undefined, 'Hover must pause autoplay')
state = []
render({ slides: [slides[0]] }); effects[0]()
assert.equal(interval, undefined)
assert(!render({ slides: [] }).html.includes('<button'))
console.log('Heading SEO regressions PASS: single active H1, inert slides, real links, manual controls, focus/hover/reduced-motion timer gates and cleanup; VM state/SSR, no browser or CMS writes.')
