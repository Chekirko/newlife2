'use client'

import { useEffect, useRef, useState } from 'react'
import { submitContact } from '../actions'
import { CONTACT_LIMITS, type ContactResult, type ContactValues } from '../form-model'

const emptyForm: ContactValues = { name: '', email: '', subject: '', message: '' }
const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100/50 text-sm text-gray-800 placeholder:text-gray-500 focus:border-primary-text focus:ring-2 focus:ring-primary-text transition-all aria-invalid:border-danger'
const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5'

export function ContactForm() {
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ContactResult | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const submitting = useRef(false)

  useEffect(() => {
    if (isSubmitting || !result?.fieldErrors) return
    const field = Object.keys(result.fieldErrors)[0]
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus()
  }, [result, isSubmitting])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setResult(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    const data = new FormData(e.currentTarget)
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await submitContact(data)
      setResult(response)
      if (response.status === 'success') {
        setFormData(emptyForm)
      }
    } catch {
      setResult({ status: 'error', message: 'Не вдалося надіслати повідомлення. Перевірте з’єднання та спробуйте ще раз.' })
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-heading font-bold text-gray-800 mb-2">
        {'Зв\'язатися з нами'}
      </h3>
      <p className="text-gray-500 mb-6 text-sm">
        Якщо у вас є запитання чи потреба в молитві, напишіть нам. Усі поля обов’язкові.
      </p>

      <div role="status" aria-live="polite" aria-atomic="true">
        {result?.status === 'success' && (
          <p className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-gray-100 text-primary-text border border-primary-text">
            {result.message}
          </p>
        )}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {result?.status === 'error' && (
          <p className="mb-6 px-4 py-3 rounded-lg text-sm text-gray-800 border border-danger">
            {result.message}
          </p>
        )}
      </div>

      <form ref={formRef} method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="space-y-4">
          <legend className="sr-only">Ваше звернення</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Ваше ім’я</label>
              <input
                id="contact-name" type="text" name="name" autoComplete="name"
                value={formData.name} onChange={handleChange}
                required maxLength={CONTACT_LIMITS.name} className={inputClass}
                aria-invalid={!!result?.fieldErrors?.name}
                aria-describedby={result?.fieldErrors?.name ? 'contact-name-error' : undefined}
              />
              {result?.fieldErrors?.name && <p id="contact-name-error" className="mt-1 text-sm text-gray-800">{result.fieldErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>E-mail</label>
              <input
                id="contact-email" type="email" name="email" autoComplete="email"
                value={formData.email} onChange={handleChange}
                required maxLength={CONTACT_LIMITS.email} className={inputClass}
                aria-invalid={!!result?.fieldErrors?.email}
                aria-describedby={result?.fieldErrors?.email ? 'contact-email-error' : undefined}
              />
              {result?.fieldErrors?.email && <p id="contact-email-error" className="mt-1 text-sm text-gray-800">{result.fieldErrors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>Тема</label>
            <input
              id="contact-subject" type="text" name="subject"
              value={formData.subject} onChange={handleChange}
              required maxLength={CONTACT_LIMITS.subject} className={inputClass}
              aria-invalid={!!result?.fieldErrors?.subject}
              aria-describedby={result?.fieldErrors?.subject ? 'contact-subject-error' : undefined}
            />
            {result?.fieldErrors?.subject && <p id="contact-subject-error" className="mt-1 text-sm text-gray-800">{result.fieldErrors.subject}</p>}
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>Ваше повідомлення</label>
            <textarea
              id="contact-message" name="message" value={formData.message} onChange={handleChange}
              rows={6} required maxLength={CONTACT_LIMITS.message} className={`${inputClass} resize-y`}
              aria-invalid={!!result?.fieldErrors?.message}
              aria-describedby={result?.fieldErrors?.message ? 'contact-message-error' : undefined}
            />
            {result?.fieldErrors?.message && <p id="contact-message-error" className="mt-1 text-sm text-gray-800">{result.fieldErrors.message}</p>}
          </div>

          <div hidden aria-hidden="true">
            <label htmlFor="contact-website">Залиште це поле порожнім</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200} />
          </div>

          <p className="text-xs text-gray-600">
            Ваше ім’я, email і повідомлення будуть передані церкві для відповіді на звернення.
          </p>

          <button type="submit" disabled={isSubmitting}
            className="btn btn-grad w-full py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? 'Надсилається...' : 'Надіслати повідомлення'}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
