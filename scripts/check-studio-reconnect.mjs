import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

// Resolve exactly the patched browser dependency used by this installed Sanity.
const require = createRequire(import.meta.url)
const sanityRequire = createRequire(require.resolve('sanity'))
const clientRequire = createRequire(sanityRequire.resolve('@sanity/client'))
const eventsourceRequire = createRequire(clientRequire.resolve('@sanity/eventsource/browser'))
const source = readFileSync(eventsourceRequire.resolve('event-source-polyfill'), 'utf8')
const warnings = [], errors = [], timers = new Map()
let now = 1000, timerId = 0, opens = 0, finish
const exported = {}
const sandbox = {
  exports: exported, module: { exports: exported },
  console: { warn: (value) => warnings.push(value), error: (value) => errors.push(value) },
  Date: { now: () => now },
  setTimeout(callback, delay) { timers.set(++timerId, { callback, at: now + delay }); return timerId },
  clearTimeout(id) { timers.delete(id) },
}
runInNewContext(source, sandbox)

class Transport {
  open(_xhr, onStart, onProgress, onFinish) {
    opens++
    finish = onFinish
    onStart(200, 'OK', 'text/event-stream', { get: () => null })
    onProgress(`:${' '.repeat(142)}\n\n`) // 145 bytes, then an idle connection
    return { abort() {} }
  }
}
function advance(target) {
  while (true) {
    const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]
    if (!next || next[1].at > target) break
    timers.delete(next[0]); now = next[1].at; next[1].callback()
  }
  now = target
}
const es = new exported.EventSourcePolyfill('https://example.test/listen', { Transport })
let reconnects = 0
es.addEventListener('error', () => reconnects++)
advance(46001)
assert.equal(warnings.length, 1, 'Idle heartbeat must stay visible as a warning')
assert.match(warnings[0].message, /No activity within 45000 milliseconds\. 145 chars received\. Reconnecting\./)
assert.equal(errors.length, 0, 'Recoverable reconnect must not trigger the Next.js error overlay')
assert.equal(reconnects, 1, 'Sanity must still receive the reconnect event')
advance(48000)
assert.equal(opens, 2, 'Automatic reconnection must still happen')
finish(new Error('NetworkError'))
assert.equal(errors.length, 1, 'Actual transport errors must still be reported')
es.close()
assert.equal(timers.size, 0, 'Closing must cancel reconnection timers')
console.log('Studio SSE: 45s/145-byte timeout warning, error event, reconnect and real network errors — PASS')
