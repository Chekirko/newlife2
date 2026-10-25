import assert from 'node:assert/strict'
import { validateContact } from '../app/(front)/contact/validation'
import { CONTACT_LIMITS } from '../app/(front)/contact/form-model'
import { deliverContact } from '../app/(front)/contact/delivery'

const values = {
  name: ' Тестовий відвідувач ',
  email: ' visitor@example.com ',
  subject: ' Запитання про богослужіння ',
  message: ' Вітаю!\nПідкажіть, будь ласка, час богослужіння. ',
}

function form(overrides: Partial<typeof values> = {}) {
  const data = new FormData()
  for (const [key, value] of Object.entries({ ...values, ...overrides })) data.set(key, value)
  data.set('website', '')
  return data
}

const valid = validateContact(form())
assert(valid.data)
assert.equal(valid.data.name, values.name.trim())
assert.equal(valid.data.message, values.message.trim())

for (const field of Object.keys(CONTACT_LIMITS) as (keyof typeof CONTACT_LIMITS)[]) {
  assert(validateContact(form({ [field]: '   ' })).fieldErrors?.[field])
  assert(validateContact(form({ [field]: 'x'.repeat(CONTACT_LIMITS[field] + 1) })).fieldErrors?.[field])
  const duplicate = form()
  duplicate.append(field, values[field])
  assert(validateContact(duplicate).fieldErrors?.[field])
  const file = form()
  file.set(field, new Blob(['unexpected file']), 'input.txt')
  assert(validateContact(file).fieldErrors?.[field])
}

assert(validateContact(form({ email: 'invalid@example' })).fieldErrors?.email)
assert(validateContact(form({ subject: 'Hello\r\nBcc: other@example.com' })).fieldErrors?.subject)
assert(validateContact(form({ name: 'Test\nInjected' })).fieldErrors?.name)
assert.equal(validateContact(form({ name: '   ' })).fieldErrors?.name, 'Заповніть поле «Ім\'я».')
assert(validateContact(form({ message: 'Test\u0000data' })).fieldErrors?.message)
const empty = new FormData()
empty.set('website', '')
assert(validateContact(empty).fieldErrors?.email)
for (const honeypot of ['https://spam.example', new Blob(['file'])]) {
  const data = form()
  data.set('website', honeypot)
  assert(validateContact(data).blocked)
}
const missingHoneypot = form()
missingHoneypot.delete('website')
assert(validateContact(missingHoneypot).blocked)
const duplicateHoneypot = form()
duplicateHoneypot.append('website', '')
assert(validateContact(duplicateHoneypot).blocked)

async function checkDelivery() {
  const originalFetch = globalThis.fetch
  const keys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'] as const
  const originalEnv = keys.map((key) => process.env[key])
  process.env.RESEND_API_KEY = 'test-api-key-not-real'
  process.env.CONTACT_FROM_EMAIL = 'forms@example.com'
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.com'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token-not-real'
  const calls: { url: string; init?: RequestInit }[] = []
  let responses: (Response | Error)[] = []
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init })
    const next = responses.shift()
    assert(next, 'Unexpected HTTP call; tests must never reach a live service')
    if (next instanceof Error) throw next
    return next
  }
  const contact = validateContact(form()).data!
  const send = () => deliverContact(contact, '192.0.2.1', 'church@example.com')
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

  try {
    for (const key of keys) {
      const value = process.env[key]
      delete process.env[key]
      calls.length = 0
      assert.equal((await send()).status, 'error')
      assert.equal(calls.length, 0, `Missing ${key} must prevent mail/network requests`)
      process.env[key] = value
    }

    responses = [json({ result: 0 })]
    calls.length = 0
    assert.equal((await send()).status, 'error')
    assert.equal(calls.length, 1, 'Rate-limited requests must never reach Resend')

    for (const failure of [json({ error: 'denied' }), json({ result: '1' }), json({}, 500), new Response('invalid json'), new Error('timeout')]) {
      responses = [failure]
      calls.length = 0
      assert.equal((await send()).status, 'error')
      assert.equal(calls.length, 1, 'Redis failure must fail closed')
    }

    for (const failure of [json({}, 401), json({}, 429), json({}, 500), json({}), new Response('invalid json'), new Error('timeout')]) {
      responses = [json({ result: 1 }), failure]
      const result = await send()
      assert.equal(result.status, 'error', 'Never report success without provider acceptance')
      assert(!result.message.includes('test-api-key'))
    }

    responses = [json({ result: 1 }), json({ id: 'test-message-id' })]
    calls.length = 0
    assert.equal((await send()).status, 'success')
    assert.equal(calls.length, 2)
    assert.equal(calls[1].url, 'https://api.resend.com/emails')
    const mail = JSON.parse(String(calls[1].init?.body))
    assert.deepEqual(mail.to, ['church@example.com'])
    assert.equal(mail.from, 'forms@example.com')
    assert.equal(mail.reply_to, 'visitor@example.com')
    assert.equal(mail.html, undefined)
    assert(mail.text.includes(contact.message))
    const command = JSON.parse(String(calls[0].init?.body))
    assert.equal(command[0], 'EVAL')
    assert.equal(command[2], '3')
    assert.deepEqual(command.slice(6), ['5', '900', '3', '900', '30', '3600'])
    assert(!JSON.stringify(command).includes('192.0.2.1'))
    assert(!JSON.stringify(command).includes('visitor@example.com'))
    for (const call of calls) {
      assert.equal(call.init?.cache, 'no-store')
      assert(call.init?.signal)
    }
    responses = [json({ result: 1 }), json({ id: 'test-message-id-2' })]
    calls.length = 0
    await deliverContact({ ...contact, email: 'VISITOR@example.com', message: '<script>alert(1)</script>' }, '192.0.2.1', 'church@example.com')
    const nextCommand = JSON.parse(String(calls[0].init?.body))
    assert.equal(command[4], nextCommand[4], 'Email rate limiting must normalize case')
    const plainMail = JSON.parse(String(calls[1].init?.body))
    assert(plainMail.text.includes('<script>alert(1)</script>'))
    assert.equal(plainMail.html, undefined, 'Visitor input must remain plain text')
  } finally {
    globalThis.fetch = originalFetch
    keys.forEach((key, i) => {
      if (originalEnv[i] === undefined) delete process.env[key]
      else process.env[key] = originalEnv[i]
    })
  }
  console.log('Contact form: validation, honeypot, rate-limit HTTP contract, provider errors and plain-text mail — PASS (mock HTTP; no live email/Redis)')
}

checkDelivery().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
