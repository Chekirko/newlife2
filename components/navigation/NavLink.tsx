'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const active = usePathname() === href
  return <Link href={href} aria-current={active ? 'page' : undefined}
    className={`${className} hover:text-primary-text ${active ? 'text-primary-text' : 'text-gray-700'}`}>{children}</Link>
}
