export const CONTACT_LIMITS = { name: 100, email: 254, subject: 160, message: 5000 } as const

export type ContactField = keyof typeof CONTACT_LIMITS
export type ContactValues = Record<ContactField, string>

export type ContactResult = {
  status: 'success' | 'error'
  message: string
  fieldErrors?: Partial<Record<ContactField, string>>
}
