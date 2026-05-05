'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  category?: string
}

export function NewsPagination({ currentPage, totalPages, category }: NewsPaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (category) params.set('category', category)
    const qs = params.toString()
    return `/news${qs ? `?${qs}` : ''}`
  }

  // Show at most 5 page numbers centered on current
  const getPageNumbers = (): number[] => {
    const pages: number[] = []
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)

    // Adjust window if near edges
    if (currentPage <= 2) end = Math.min(totalPages, 5)
    if (currentPage >= totalPages - 1) start = Math.max(1, totalPages - 4)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <nav className="mt-10 mb-4" aria-label="Пагінація новин">
      <ul className="flex items-center justify-center gap-1.5">
        {/* Prev */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200"
            >
              <i className="fas fa-chevron-left text-xs" />
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
              <i className="fas fa-chevron-left text-xs" />
            </span>
          )}
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-semibold text-white bg-grad">
                {page}
              </span>
            ) : (
              <Link
                href={buildHref(page)}
                className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200"
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Next */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={buildHref(currentPage + 1)}
              className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200"
            >
              <i className="fas fa-chevron-right text-xs" />
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-lg text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
              <i className="fas fa-chevron-right text-xs" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
