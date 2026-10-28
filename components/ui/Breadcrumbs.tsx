import Link from 'next/link'
import { Fragment } from 'react'
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
      <ol className="flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm">
        {items.map((item, index) => <Fragment key={index}>
          {index > 0 && <li aria-hidden="true">/</li>}
          <li>
            {item.href ? <Link href={item.href} className="text-white hover:text-white transition-colors">{item.label}</Link>
              : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}
          </li>
        </Fragment>)}
      </ol>
    </nav>
  </>
}
