import 'server-only'
import { z } from 'zod'
import { allowContact } from './rate-limit'
import type { ContactResult, ContactValues } from './form-model'

export const CONTACT_UNAVAILABLE: ContactResult = {
  status: 'error',
  message: 'Не вдалося надіслати повідомлення. Спробуйте пізніше або зв’яжіться з нами поштою чи телефоном, вказаними на цій сторінці.',
}

export async function deliverContact(values: ContactValues, ip: string, recipient: string): Promise<ContactResult> {
  try {
    const apiKey = process.env.RESEND_API_KEY?.trim()
    const from = process.env.CONTACT_FROM_EMAIL?.trim()
    if (!apiKey || !z.email().safeParse(from).success || !z.email().safeParse(recipient).success) {
      return CONTACT_UNAVAILABLE
    }
    if (!await allowContact(ip, values.email)) {
      return { status: 'error', message: 'Забагато звернень за короткий час. Спробуйте пізніше або зателефонуйте нам.' }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: values.email,
        subject: `[Нове Життя — звернення] ${values.subject}`,
        text: `Звернення з контактної форми\n\nІм’я: ${values.name}\nE-mail: ${values.email}\nТема: ${values.subject}\n\n${values.message}`,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return CONTACT_UNAVAILABLE
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object' || !('id' in body) || typeof body.id !== 'string' || !body.id) {
      return CONTACT_UNAVAILABLE
    }
    return { status: 'success', message: 'Дякуємо! Ваше повідомлення прийнято до відправлення. Ми відповімо на вказану вами пошту.' }
  } catch {
    // Never expose provider responses, credentials or the visitor's message in logs/UI.
    return CONTACT_UNAVAILABLE
  }
}
