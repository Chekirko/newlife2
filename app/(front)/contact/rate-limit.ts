import 'server-only'
import { createHmac } from 'node:crypto'

// Check all counters before incrementing any; the entire script is atomic in Redis.
const limitScript = `
for i, key in ipairs(KEYS) do
  if tonumber(redis.call('GET', key) or '0') >= tonumber(ARGV[i * 2 - 1]) then
    return 0
  end
end
for i, key in ipairs(KEYS) do
  local count = redis.call('INCR', key)
  if count == 1 then redis.call('EXPIRE', key, ARGV[i * 2]) end
end
return 1
`

export async function allowContact(ip: string, email: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (!url || !token || new URL(url).protocol !== 'https:') throw new Error('contact-rate-limit-config')

  const digest = (value: string) => createHmac('sha256', token).update(value).digest('hex')
  const prefix = `newlife2:contact:${process.env.VERCEL_ENV || 'local'}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    // 5/IP and 3/email in 15 minutes; a global 30/hour ceiling bounds mail abuse.
    body: JSON.stringify(['EVAL', limitScript, '3',
      `${prefix}:ip:${digest(ip)}`, `${prefix}:email:${digest(email.toLowerCase())}`, `${prefix}:all`,
      '5', '900', '3', '900', '30', '3600']),
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('contact-rate-limit-http')
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object' || 'error' in body || !('result' in body) || (body.result !== 0 && body.result !== 1)) {
    throw new Error('contact-rate-limit-response')
  }
  return body.result === 1
}
