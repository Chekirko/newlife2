import Link from 'next/link'
import { SITE_URL } from '@/lib/site'
import { jsonLdHtml } from '@/lib/utils'

export interface Breadcrumb {
  label: string
  href?: string
}

/** The visible trail and JSON-LD share the same labels and links. */
export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (items.length === 0) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.label,
      // Google permits the current (last) item to omit its URL.
      ...(item.href ? { item: new URL(item.href, SITE_URL).href } : {}),
    })),
  }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
    <nav aria-label="Хлібні крихти">
      <ol className="breadcrumb justify-center text-white text-xs sm:text-sm">
        {items.map((item, index) => <li key={index} className="breadcrumb-item">
          {item.href ? <Link href={item.href}>{item.label}</Link>
            : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
        </li>)}
      </ol>
    </nav>
  </>
}
