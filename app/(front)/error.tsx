'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Error boundary for the (front) segment. Rendered inside the (front)
// layout, so header + footer stay visible. Must be a Client Component.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error for debugging / monitoring.
    console.error(error)
  }, [error])

  return (
    <section className="min-h-[60vh] flex items-center py-16 lg:py-24">
      <div className="container-larexa">
        <div className="max-w-xl mx-auto text-center">
          <span className="bg-grad inline-flex w-16 h-16 rounded-full items-center justify-center mb-6">
            <i className="fas fa-triangle-exclamation text-white text-2xl" aria-hidden="true" />
          </span>
          <h1 className="font-heading font-bold text-2xl lg:text-3xl text-gray-800 mb-3">
            Щось пішло не так
          </h1>
          <p className="text-gray-700 leading-relaxed mb-8">
            Сталася неочікувана помилка. Спробуйте оновити сторінку або
            повернутися на головну. Якщо проблема повторюється — звʼяжіться з нами.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={() => reset()} className="btn btn-grad">
              Спробувати ще раз
            </button>
            <Link href="/" className="btn btn-outline-grad">
              На головну
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
