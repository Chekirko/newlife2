'use server'

import { headers } from 'next/headers'
import { isIP } from 'node:net'
import { getSiteSettings } from '@/lib/site-settings'
import { deliverContact, CONTACT_UNAVAILABLE } from './delivery'
import { validateContact } from './validation'
import type { ContactResult } from './form-model'

export async function submitContact(formData: FormData): Promise<ContactResult> {
  if (!(formData instanceof FormData)) return CONTACT_UNAVAILABLE
  const parsed = validateContact(formData)
  if (parsed.blocked) return CONTACT_UNAVAILABLE
  if (!parsed.data) {
    return { status: 'error', message: 'Перевірте заповнені поля.', fieldErrors: parsed.fieldErrors }
  }

  try {
    const requestHeaders = await headers()
    // Vercel overwrites this header. Outside Vercel, use one shared bucket rather
    // than trusting arbitrary forwarded headers from a public client/proxy.
    const ip = process.env.VERCEL === '1' ? requestHeaders.get('x-vercel-forwarded-for')?.trim() : 'local'
    if (!ip || (process.env.VERCEL === '1' && !isIP(ip))) return CONTACT_UNAVAILABLE
    const recipient = process.env.CONTACT_TO_EMAIL?.trim() || (await getSiteSettings()).email
    return await deliverContact(parsed.data, ip, recipient)
  } catch {
    return CONTACT_UNAVAILABLE
  }
}
