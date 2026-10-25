import { z } from 'zod'
import { CONTACT_LIMITS, type ContactField } from './form-model'

const singleLine = (max: number, label: string) => z.string()
  .trim()
  .min(1, `Заповніть поле «${label}».`)
  .max(max, `Максимум ${max} символів.`)
  .regex(/^[^\r\n\u0000-\u001f\u007f]+$/, 'Введіть текст в один рядок без керівних символів.')

export const contactSchema = z.object({
  name: singleLine(CONTACT_LIMITS.name, "Ім'я"),
  email: singleLine(CONTACT_LIMITS.email, 'E-mail').pipe(z.email('Вкажіть коректну адресу електронної пошти.')),
  subject: singleLine(CONTACT_LIMITS.subject, 'Тема'),
  message: z.string().trim()
    .min(1, 'Напишіть повідомлення.')
    .max(CONTACT_LIMITS.message, `Максимум ${CONTACT_LIMITS.message} символів.`)
    .regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/, 'Приберіть керівні символи з повідомлення.'),
})

export function validateContact(formData: FormData) {
  const website = formData.getAll('website')
  if (website.length !== 1 || website[0] !== '') return { blocked: true }
  // Reject duplicate fields and files instead of silently accepting their first value.
  const fields = Object.keys(CONTACT_LIMITS) as ContactField[]
  const result = contactSchema.safeParse(Object.fromEntries(fields.map((field) => [
    field, formData.getAll(field).length === 1 ? formData.get(field) : undefined,
  ])))
  if (result.success) return { data: result.data }

  const fieldErrors: Partial<Record<ContactField, string>> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField
    fieldErrors[field] ??= issue.code === 'invalid_type' ? 'Заповніть поле коректно.' : issue.message
  }
  return { fieldErrors }
}
