import Link from 'next/link'
import { clsx } from 'clsx'

// =========================================
// MINISTRIES - Church ministries with hover effects
// Features: sliding icon, image with green overlay, zoom effect
// =========================================

export interface MinistryItem {
  icon: string
  title: string
  description: string
  image: string
  link?: string
  linkText?: string
}

export interface MinistriesProps {
  preTitle?: string
  title?: string
  description?: string
  items: MinistryItem[]
  columns?: 2 | 3
  className?: string
}

export const Ministries = ({
  preTitle,
  title,
  description,
  items,
  columns = 3,
  className,
}: MinistriesProps) => {
  const columnClasses = {
    2: 'sm:w-1/2',
    3: 'sm:w-1/2 lg:w-1/3',
  }

  return (
    <section className={clsx('py-16 lg:py-24', className)}>
      <div className="container-larexa">
        {/* Header */}
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            {preTitle && (
              <span className="text-primary font-semibold tracking-wide uppercase text-sm block mb-3">
                {preTitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 text-lg mb-0">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Cards Grid */}
        <div className="flex flex-wrap -mx-3 lg:-mx-4">
          {items.map((item, idx) => (
            <div key={idx} className={clsx('w-full px-3 lg:px-4 mb-6 lg:mb-8', columnClasses[columns])}>
              <div className="group relative h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Icon - slides in from left on hover */}
                <div className="absolute top-4 -left-14 group-hover:left-4 z-10 transition-all duration-300 ease-out">
                  <div className="w-12 h-12 rounded-full bg-grad flex items-center justify-center shadow-lg">
                    <i className={clsx(item.icon, 'text-white text-lg')} />
                  </div>
                </div>

                {/* Image container */}
                <div className="relative h-48 overflow-hidden">
                  {/* Image with zoom effect */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {/* Green overlay - fades out on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-start)]/30 to-[var(--gradient-end)]/30 transition-opacity duration-300 group-hover:opacity-0" />
                </div>

                {/* Content */}
                <div className="p-5 lg:p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  {item.link && (
                    <Link 
                      href={item.link} 
                      className="inline-flex items-center text-primary font-medium text-sm hover:underline"
                    >
                      {item.linkText || 'Дізнатися більше'}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Ministries
