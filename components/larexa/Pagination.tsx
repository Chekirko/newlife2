import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { pagedHref } from '@/lib/listing-params'

interface PaginationProps {
  /** Page-1 path, e.g. `/news` or `/news/category/<name>`. */
  basePath: string
  page: number
  total: number
  label?: string
}

/** Path pagination with up to five numbers around the current page; links only, no JS. */
export function Pagination({ basePath, page, total, label = 'Сторінки' }: PaginationProps) {
  if (total <= 1) return null
  const first = Math.max(1, Math.min(page - 2, total - 4))
  const pages = Array.from({ length: Math.min(5, total) }, (_, index) => first + index)
  return (
    <nav aria-label={label}>
      <ul className="pagination">
        {page > 1 && <li className="page-item">
          <Link href={pagedHref(basePath, page - 1)} aria-label="Попередня сторінка" className="page-link">
            <Icon className="fas fa-chevron-left" />
          </Link>
        </li>}
        {pages.map(number => <li key={number} className="page-item">
          {number === page
            ? <span aria-current="page" className="page-link bg-grad-readable">{number}</span>
            : <Link href={pagedHref(basePath, number)} aria-label={`Сторінка ${number}`} className="page-link">{number}</Link>}
        </li>)}
        {page < total && <li className="page-item">
          <Link href={pagedHref(basePath, page + 1)} aria-label="Наступна сторінка" className="page-link">
            <Icon className="fas fa-chevron-right" />
          </Link>
        </li>}
      </ul>
    </nav>
  )
}
