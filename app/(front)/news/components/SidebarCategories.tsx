import Link from 'next/link'

interface SidebarCategoriesProps {
  categories: string[]
  activeCategory?: string
}

export function SidebarCategories({ categories, activeCategory }: SidebarCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-primary">
        Категорії
      </h2>
      <ul className="space-y-1">
        {/* "All" link */}
        <li>
          <Link
            href="/news"
            aria-current={!activeCategory ? 'page' : undefined}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !activeCategory
                ? 'bg-primary/10 text-primary-text font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-primary-text'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Усі новини
            </span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat}>
            <Link
              href={`/news?category=${encodeURIComponent(cat)}`}
              aria-current={activeCategory === cat ? 'page' : undefined}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary/10 text-primary-text font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {cat}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
