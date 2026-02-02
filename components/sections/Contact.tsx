'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// CONTACT VARIANT 1: Split with Gallery
// (home demo style)
// =========================================
export interface ContactSplitGalleryProps {
  title: string
  subtitle?: string
  description?: string
  description2?: string
  buttonText?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  galleryImages?: (string | StaticImageData)[]
  quote?: { label: string; text: string }
  imagePosition?: 'left' | 'right'
  className?: string
}

export const ContactSplitGallery = ({
  title,
  subtitle,
  description,
  description2,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
  galleryImages = [],
  quote,
  imagePosition = 'left',
  className,
}: ContactSplitGalleryProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className={clsx(
          'flex flex-wrap items-center',
          imagePosition === 'right' && 'flex-row-reverse'
        )}>
          {/* Gallery */}
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-12 gap-3">
              {galleryImages[0] && (
                <div className="col-span-5 col-start-2 self-end">
                  <Image src={galleryImages[0]} alt="" width={200} height={250} className="rounded w-full" />
                </div>
              )}
              {galleryImages[1] && (
                <div className="col-span-6">
                  <Image src={galleryImages[1]} alt="" width={250} height={300} className="rounded w-full" />
                </div>
              )}
              {quote && (
                <div className="col-span-7">
                  <div className="rounded bg-grad p-4 lg:p-6 all-text-white">
                    <span>{quote.label}</span>
                    <h3 className="font-bold">"{quote.text}"</h3>
                  </div>
                </div>
              )}
              {galleryImages[2] && (
                <div className="col-span-5 self-start">
                  <Image src={galleryImages[2]} alt="" width={200} height={250} className="rounded w-full" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 md:pl-10 mt-8 md:mt-0">
            <h2 className="text-4xl">{title}</h2>
            {subtitle && <p className="text-xl">{subtitle}</p>}
            {description && <p>{description}</p>}
            {description2 && <p>{description2}</p>}
            <div className="mt-4">
              {buttonText && (
                <Link href={buttonHref || '#'} className="btn btn-dark">
                  {buttonText}
                </Link>
              )}
              {secondaryButtonText && (
                <Link href={secondaryButtonHref || '#'} className="btn btn-link">
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// CONTACT VARIANT 2: Form with Info
// =========================================
export interface ContactInfo {
  icon: string
  title: string
  content: string
  href?: string
}

export interface ContactFormProps {
  title?: string
  description?: string
  contactInfo?: ContactInfo[]
  onSubmit?: (data: { name: string; email: string; subject: string; message: string }) => void
  showMap?: boolean
  mapEmbed?: string
  className?: string
}

export const ContactForm = ({
  title,
  description,
  contactInfo = [],
  onSubmit,
  showMap = false,
  mapEmbed,
  className,
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {/* Contact Info */}
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            {title && <h2 className="text-3xl mb-4">{title}</h2>}
            {description && <p className="mb-6">{description}</p>}
            
            {contactInfo.length > 0 && (
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-2xl text-primary flex-shrink-0">
                      <i className={info.icon} />
                    </div>
                    <div>
                      <h6 className="font-bold mb-1">{info.title}</h6>
                      {info.href ? (
                        <a href={info.href} className="text-gray-600 hover:text-primary">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 m-0">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3 px-4">
            <form onSubmit={handleSubmit} className="bg-gray-100 rounded p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control px-4 py-3 rounded border border-gray-300 focus:border-primary focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-control px-4 py-3 rounded border border-gray-300 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="form-control w-full px-4 py-3 rounded border border-gray-300 focus:border-primary focus:outline-none mb-4"
              />
              <textarea
                placeholder="Your message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-control w-full px-4 py-3 rounded border border-gray-300 focus:border-primary focus:outline-none mb-4 resize-none"
                required
              />
              <button type="submit" className="btn btn-grad">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {showMap && mapEmbed && (
          <div className="mt-10">
            <div 
              className="rounded overflow-hidden h-[400px]"
              dangerouslySetInnerHTML={{ __html: mapEmbed }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

// =========================================
// CONTACT VARIANT 3: Simple CTA
// =========================================
export interface ContactCTAProps {
  title: string
  description?: string
  phone?: string
  email?: string
  buttonText?: string
  buttonHref?: string
  isDark?: boolean
  isGradient?: boolean
  className?: string
}

export const ContactCTA = ({
  title,
  description,
  phone,
  email,
  buttonText,
  buttonHref,
  isDark = false,
  isGradient = false,
  className,
}: ContactCTAProps) => {
  return (
    <section className={clsx(
      'py-16',
      isGradient && 'bg-grad all-text-white',
      isDark && !isGradient && 'bg-gray-800 text-white',
      className
    )}>
      <div className="container-larexa text-center">
        <h2 className={isGradient || isDark ? 'text-white' : ''}>{title}</h2>
        {description && <p className="mb-6">{description}</p>}
        
        {(phone || email) && (
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {phone && (
              <a href={`tel:${phone.replace(/\D/g, '')}`} className={clsx(
                'text-2xl font-bold hover:opacity-80',
                isGradient || isDark ? 'text-white' : 'text-primary'
              )}>
                <i className="fas fa-phone mr-2" /> {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={clsx(
                'text-2xl font-bold hover:opacity-80',
                isGradient || isDark ? 'text-white' : 'text-primary'
              )}>
                <i className="fas fa-envelope mr-2" /> {email}
              </a>
            )}
          </div>
        )}
        
        {buttonText && (
          <Link 
            href={buttonHref || '#'} 
            className={clsx('btn', isGradient || isDark ? 'btn-white' : 'btn-grad')}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { ContactForm as Contact }
export default ContactForm
