'use client'

import { useState } from 'react'

// =========================================
// ContactForm — Client component with form state
// Used on: Contact page
// =========================================

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission (replace with real API later)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div>
      <h3 className="text-2xl font-heading font-bold text-gray-800 mb-2">
        {'Зв\'язатися з нами'}
      </h3>
      <p className="text-gray-500 mb-6 text-sm">
        Якщо у вас є запитання чи потреба в молитві, напишіть нам.
      </p>

      {isSubmitted && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm font-medium"
          style={{
            background: 'linear-gradient(135deg, rgba(151,199,78,0.12), rgba(42,185,165,0.12))',
            color: 'var(--color-primary)',
            border: '1px solid rgba(75,189,137,0.25)',
          }}
        >
          Дякуємо! Ваше повідомлення успішно надіслано.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ваше ім'я"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Тема"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Ваше повідомлення..."
          rows={6}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-grad w-full py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Надсилається...' : 'Надіслати повідомлення'}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
